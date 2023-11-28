import { requiresAuth } from '@/auth/middlwares'
import { logger } from '@/services/logger'
import { prisma } from '@/services/prisma'
import { repl } from '@/services/repl'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'

export const posts = new Hono()

posts.get('/', requiresAuth, async (c) => {
  const posts = await prisma.post.findMany({
    take: 50,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  })

  return c.json(posts)
})

const createPost = z.object({
  content: z.string().min(4).max(255),
})

posts.post('/', requiresAuth, zValidator('json', createPost), async (c) => {
  const data = c.req.valid('json')

  const post = await prisma.post.create({
    data: {
      content: data.content,
      userId: c.var.user.id,
    },
    include: {
      user: {
        select: { name: true },
      },
    },
  })

  repl
    .publish('posts', {
      value: JSON.stringify({
        type: 'create',
        data: post,
      }),
    })
    .then(() => {
      logger.info('Published message to topic posts')
    })
    .catch((err) => {
      logger.error('Failed to publish message to topic posts:', err)
    })

  repl.create(`comments:${post.id}`)

  return c.json(post, { status: 201 })
})

posts.get('/:id', requiresAuth, async (c) => {
  const id = c.req.param('id')

  const post = await prisma.post.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  })

  if (!post) {
    return c.json({ message: 'Post not found' }, { status: 404 })
  }

  return c.json(post)
})

posts.delete('/:id', requiresAuth, async (c) => {
  const id = c.req.param('id')

  const post = await prisma.post.findUnique({
    where: {
      id: Number(id),
    },
  })

  if (!post) {
    return c.json({ message: 'Post not found' }, { status: 404 })
  }

  if (post.userId !== c.var.user.id) {
    return c.json({ message: 'Unauthorized' }, { status: 401 })
  }

  await prisma.post.delete({
    where: {
      id: Number(id),
    },
  })

  return c.json({ message: 'Post deleted' })
})

const comment = z.object({
  content: z.string().min(4).max(255),
})

posts.post(
  '/:id/comments',
  requiresAuth,
  zValidator('json', comment),
  async (c) => {
    const data = c.req.valid('json')
    const id = c.req.param('id')

    const post = await prisma.post.findUnique({
      where: {
        id: Number(id),
      },
    })

    if (!post) {
      return c.json({ message: 'Post not found' }, { status: 404 })
    }

    const comment = await prisma.comment.create({
      data: {
        content: data.content,
        userId: c.var.user.id,
        postId: post.id,
      },
    })

    repl.publish(`comments:${post.id}`, {
      value: JSON.stringify({
        type: 'create',
        data: await prisma.comment.findUnique({
          where: {
            id: comment.id,
          },
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        }),
      }),
    })

    return c.json(comment, { status: 201 })
  },
)

posts.get('/:id/comments', requiresAuth, async (c) => {
  const id = c.req.param('id')

  const comments = await prisma.comment.findMany({
    where: {
      postId: Number(id),
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return c.json(comments)
})
