import { defineEventHandler, toWebRequest } from 'vinxi/http'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { z } from 'zod'
import { t } from './src/app/trpc'  
import { getBikes } from './src/app/widgets/bikes.server'


const POSTS = [
  { id: '1', title: 'First post' },
  { id: '2', title: 'Second post' },
  { id: '3', title: 'Third post' },
  { id: '4', title: 'Fourth post' },
  { id: '5', title: 'Fifth post' },
  { id: '6', title: 'Sixth post' },
  { id: '7', title: 'Seventh post' },
  { id: '8', title: 'Eighth post' },
  { id: '9', title: 'Ninth post' },
  { id: '10', title: 'Tenth post' },
]

const appRouter = t.router({
  hello: t.procedure.query(() => 'Hello world!'),
  posts: t.procedure.query(async (_) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return POSTS
  }),
  post: t.procedure.input(z.string()).query(async (req) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return POSTS.find((p) => p.id === req.input)
  }),
  getBikes,
})

export type AppRouter = typeof appRouter

export default defineEventHandler((event) => {
  const request = toWebRequest(event)

  return fetchRequestHandler({
    endpoint: '/trpc',
    req: request,
    router: appRouter,
    createContext() {
      return {}
    },
  })
})