import { User } from '@prisma/client'
import { decode, verify } from 'hono/jwt'
import { MiddlewareHandler } from 'hono'
import { env } from '@/globals/env'
import { prisma } from '@/services/prisma'
import { logger } from '@/services/logger'

export const requiresAuth: MiddlewareHandler<{
  Variables: {
    user: User
  }
}> = async (ctx, next) => {
  const headers = ctx.req.header()
  const auth = headers.authorization

  if (!auth) {
    return ctx.json(
      { message: 'Missing authorization header' },
      { status: 401 },
    )
  }

  const token = auth.replace('Bearer ', '')

  if (!token) {
    return ctx.json({ message: 'Missing token' }, { status: 401 })
  }

  try {
    const payload = await verify(token, env.JWT_SECRET)

    const user = await prisma.user.findUnique({
      where: {
        id: payload.id,
      },
    })

    if (!user) {
      return ctx.json({ message: 'Invalid token' }, { status: 401 })
    }

    ctx.set('user', user)
    return await next()
  } catch (error) {
    logger.error(error)
    return ctx.json({ message: 'Invalid token' }, { status: 401 })
  }
}
