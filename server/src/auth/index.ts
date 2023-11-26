import { Hono } from 'hono'
import { sign } from 'hono/jwt'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { prisma } from '@/services/prisma'
import { env } from '@/globals/env'
import { requiresAuth } from './middlwares'

export const auth = new Hono()

const signUp = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email(),
  password: z.string().min(8).max(255),
})

auth.post('/sign-up', zValidator('json', signUp), async (c) => {
  const data = c.req.valid('json')

  const { password, ...user } = await prisma.user.create({
    data,
  })

  return c.json(user, { status: 201 })
})

const signIn = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(255),
})

auth.post('/sign-in', zValidator('json', signIn), async (c) => {
  const data = c.req.valid('json')

  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  })

  if (!user) {
    return c.json({ message: 'Invalid credentials' }, { status: 401 })
  }

  const isValid = user.password === data.password

  if (!isValid) {
    return c.json({ message: 'Invalid credentials' }, { status: 401 })
  }

  const token = await sign({ id: user.id }, env.JWT_SECRET)

  return c.json({ token })
})

auth.get('/profile', requiresAuth, async (c) => {
  const { password, ...user } = c.var.user

  return c.json(user)
})
