import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { loadObjects, saveObjects } from './storage'

const PORT = 3001

const app = new Hono()

app.use(cors({ origin: 'http://localhost:3000' }))

app.get('/objects', c => c.json(loadObjects()))

app.post('/objects', async (c) => {
  // Broken JSON counts as an empty object, so it ends up as a missing id.
  const body = await c.req.json().catch(() => ({}))
  if (typeof body?.id !== 'string' || body.id === '') return c.json({ error: 'id is required' }, 400)

  const objects = loadObjects()
  if (objects.some(object => object.id === body.id)) return c.json({ error: 'id already exists' }, 409)

  saveObjects([...objects, body])
  return c.json(body, 201)
})

app.patch('/objects/:id', async (c) => {
  const id = c.req.param('id')
  const changes = await c.req.json().catch(() => ({}))

  const objects = loadObjects()
  const object = objects.find(object => object.id === id)
  if (!object) return c.json({ error: 'object not found' }, 404)

  // The id from the URL always wins, so a change can never rename an object.
  const updated = { ...object, ...changes, id }
  saveObjects(objects.map(object => (object.id === id ? updated : object)))
  return c.json(updated)
})

app.delete('/objects/:id', (c) => {
  const id = c.req.param('id')

  const objects = loadObjects()
  if (!objects.some(object => object.id === id)) return c.json({ error: 'object not found' }, 404)

  saveObjects(objects.filter(object => object.id !== id))
  return c.body(null, 204)
})

serve({ fetch: app.fetch, port: PORT }, () => console.log(`Backend running on http://localhost:${PORT}`))
