import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

export type StoredObject = { id: string; [key: string]: unknown }

// The only place that knows where the board is stored.
const BOARD_FILE = fileURLToPath(new URL('../data/board.json', import.meta.url))

// Reading and writing are synchronous on purpose: no other request can run between
// a route's load and save, so concurrent changes cannot overwrite each other.
export function loadObjects(): StoredObject[] {
  if (!existsSync(BOARD_FILE)) return []
  return JSON.parse(readFileSync(BOARD_FILE, 'utf8'))
}

export function saveObjects(objects: StoredObject[]): void {
  mkdirSync(dirname(BOARD_FILE), { recursive: true })
  writeFileSync(BOARD_FILE, JSON.stringify(objects, null, 2))
}
