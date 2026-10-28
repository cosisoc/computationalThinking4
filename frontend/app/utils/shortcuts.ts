import type { BoardObject } from '~/types/board'

export interface ShortcutContext {
  selected: BoardObject | null
  select: (id: string | null) => void
  clipboard: Ref<BoardObject | null>
  board: ReturnType<typeof useBoard>
  panBy: (dx: number, dy: number) => void
}

interface Shortcut {
  label: string
  matches: (event: KeyboardEvent) => boolean
  run: (ctx: ShortcutContext, event: KeyboardEvent) => void
}

const ARROWS: Record<string, [number, number]> = {
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
}

// ⌘ on macOS, Ctrl elsewhere.
function withCommand(key: string) {
  return (event: KeyboardEvent) => (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === key
}

function pasteCopy({ board, select }: ShortcutContext, source: BoardObject) {
  const copy = board.addCopy(source, GRID_SIZE, GRID_SIZE)
  select(copy.id)
  return copy
}

// Every keyboard shortcut of the board. What each one does depends on what is selected.
export const SHORTCUTS: Shortcut[] = [
  {
    label: '⌘C',
    matches: withCommand('c'),
    run: ({ selected, clipboard }) => {
      if (selected) clipboard.value = selected
    },
  },
  {
    label: '⌘X',
    matches: withCommand('x'),
    run: ({ selected, clipboard, board, select }) => {
      if (!selected) return
      clipboard.value = selected
      board.removeObject(selected.id)
      select(null)
    },
  },
  {
    label: '⌘V',
    matches: withCommand('v'),
    // The clipboard moves along with each paste, so repeated pastes don't stack on top of each other.
    run: (ctx) => {
      if (ctx.clipboard.value) ctx.clipboard.value = pasteCopy(ctx, ctx.clipboard.value)
    },
  },
  {
    label: '⌘D',
    matches: withCommand('d'),
    run: (ctx) => {
      if (ctx.selected) pasteCopy(ctx, ctx.selected)
    },
  },
  {
    label: '⌫',
    matches: (event) => event.key === 'Backspace' || event.key === 'Delete',
    run: ({ selected, board, select }) => {
      if (!selected) return
      board.removeObject(selected.id)
      select(null)
    },
  },
  {
    label: 'Esc',
    matches: (event) => event.key === 'Escape',
    run: ({ select }) => select(null),
  },
  {
    label: 'Pfeiltasten',
    matches: (event) => event.key in ARROWS,
    // Moves the selected object by one grid cell, or the view when nothing is selected.
    run: ({ selected, board, panBy }, event) => {
      const [dx, dy] = ARROWS[event.key]!
      if (selected) board.moveObject(selected.id, selected.x + dx * GRID_SIZE, selected.y + dy * GRID_SIZE)
      else panBy(-dx * GRID_SIZE, -dy * GRID_SIZE)
    },
  },
]
