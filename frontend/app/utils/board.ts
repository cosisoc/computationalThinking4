import type { Attribute, BoardObject, BoardObjectKind, FontSize } from '~/types/board'

export const COLORS = ['#fef08a', '#fbcfe8', '#bfdbfe', '#bbf7d0', '#1f2937']

// Which attributes each kind of object has, and therefore which editors its context bar shows.
export const ATTRIBUTES: Record<BoardObjectKind, Attribute[]> = {
  note: ['color', 'fontSize', 'border', 'bold'],
  text: ['color', 'fontSize', 'bold'],
  circle: ['color', 'border'],
}

export const FONT_SIZE_CLASSES: Record<FontSize, string> = { S: 'text-base', M: 'text-lg', L: 'text-2xl' }

const DEFAULTS: Record<BoardObjectKind, { width: number; height: number; color: string }> = {
  note: { width: GRID_SIZE * 8, height: GRID_SIZE * 8, color: COLORS[0]! },
  text: { width: GRID_SIZE * 8, height: GRID_SIZE * 3, color: COLORS[4]! },
  circle: { width: GRID_SIZE * 6, height: GRID_SIZE * 6, color: COLORS[2]! },
}

// Creates a new object of the given kind centered on the given board point.
export function createObject(kind: BoardObjectKind, centerX: number, centerY: number): BoardObject {
  const { width, height, color } = DEFAULTS[kind]
  const base = {
    id: crypto.randomUUID(),
    x: snapToGrid(centerX - width / 2),
    y: snapToGrid(centerY - height / 2),
    width,
    height,
    color,
  }
  const textStyle = { text: 'quack', fontSize: 'M' as const, bold: false }
  if (kind === 'note') return { ...base, ...textStyle, kind, border: false }
  if (kind === 'text') return { ...base, ...textStyle, kind }
  return { ...base, kind, border: false }
}
