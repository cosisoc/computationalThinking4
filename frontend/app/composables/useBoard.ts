import type { BoardObject, ObjectTemplate, Rect, StyleChanges, TextObject } from '~/types/canvas-object'

const TEXT_DEFAULTS = { text: '', fontSize: FONT_SIZES.M, bold: false }

// Starting attributes of a new object, per variant. Only variants with text get text attributes.
const DEFAULTS: Record<BoardObject['type'], Rect & Partial<TextObject>> = {
  'sticky-note': { x: 0, y: 0, width: GRID_SIZE * 8, height: GRID_SIZE * 8, ...TEXT_DEFAULTS },
  'text': { x: 0, y: 0, width: GRID_SIZE * 10, height: GRID_SIZE * 3, ...TEXT_DEFAULTS },
  'circle': { x: 0, y: 0, width: GRID_SIZE * 6, height: GRID_SIZE * 6 },
}

const API_URL = 'http://localhost:3001/objects'
const PATCH_DELAY = 300

type ObjectChanges = Partial<Rect> & StyleChanges & { text?: string }

// These live outside useBoard() because it is called several times and all callers must share them.
let loadStarted = false
let queue: Promise<unknown> = Promise.resolve()
const pendingPatches = new Map<string, { changes: ObjectChanges; timer: ReturnType<typeof setTimeout> }>()

// Requests run strictly one after another, so a PATCH can never overtake its POST or a newer PATCH.
function send(method: 'POST' | 'PATCH' | 'DELETE', url: string, body?: object) {
  queue = queue.then(() => $fetch(url, { method, body })).catch(console.error)
}

// Collects changes per object and sends them as one PATCH once they pause for PATCH_DELAY.
function schedulePatch(id: string, changes: ObjectChanges) {
  const pending = pendingPatches.get(id)
  clearTimeout(pending?.timer)
  const merged = { ...pending?.changes, ...changes }
  const timer = setTimeout(() => {
    pendingPatches.delete(id)
    send('PATCH', `${API_URL}/${id}`, merged)
  }, PATCH_DELAY)
  pendingPatches.set(id, { changes: merged, timer })
}

function cancelPatch(id: string) {
  clearTimeout(pendingPatches.get(id)?.timer)
  pendingPatches.delete(id)
}

// The board state is the single source of truth for which objects exist and what they look like.
// Components only read it; every change goes through one of the functions below.
// Each function changes the local state first and tells the backend afterwards.
export function useBoard() {
  const objects = useState<BoardObject[]>('objects', () => [])

  if (import.meta.client && !loadStarted) {
    loadStarted = true
    $fetch<BoardObject[]>(API_URL).then((loaded) => {
      objects.value = loaded
    }).catch(console.error)
  }

  function addObject(template: ObjectTemplate, centerX: number, centerY: number) {
    const defaults = DEFAULTS[template.type]
    const id = crypto.randomUUID()
    const x = snapToGrid(centerX - defaults.width / 2)
    const y = snapToGrid(centerY - defaults.height / 2)
    const object = { ...defaults, ...template, id, x, y } as BoardObject
    objects.value = [...objects.value, object]
    send('POST', API_URL, object)
    return id
  }

  // Works for every variant: the copy keeps all attributes except the id.
  function addCopy(source: BoardObject) {
    const id = crypto.randomUUID()
    const object = { ...source, id }
    objects.value = [...objects.value, object]
    send('POST', API_URL, object)
    return id
  }

  function removeObject(id: string) {
    objects.value = objects.value.filter(object => object.id !== id)
    cancelPatch(id)
    send('DELETE', `${API_URL}/${id}`)
  }

  function updateObject(id: string, changes: ObjectChanges) {
    objects.value = objects.value.map(object => (object.id === id ? ({ ...object, ...changes } as BoardObject) : object))
  }

  function moveObject(id: string, x: number, y: number) {
    updateObject(id, { x, y })
    schedulePatch(id, { x, y })
  }

  function resizeObject(id: string, rect: Rect) {
    updateObject(id, rect)
    schedulePatch(id, rect)
  }

  function updateText(id: string, text: string) {
    updateObject(id, { text })
    send('PATCH', `${API_URL}/${id}`, { text })
  }

  function updateStyle(id: string, changes: StyleChanges) {
    updateObject(id, changes)
    send('PATCH', `${API_URL}/${id}`, changes)
  }

  return { objects: readonly(objects), addObject, addCopy, removeObject, moveObject, resizeObject, updateText, updateStyle }
}
