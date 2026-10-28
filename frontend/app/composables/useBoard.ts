import type { BoardObject, BoardObjectKind, FontSize, Rect } from '~/types/board'

// The one place that holds all board objects. They can only be changed through the functions below.
export function useBoard() {
  const objects = useState<BoardObject[]>('board-objects', () => [createObject('note', 216, 216)])

  function change(id: string, apply: (object: BoardObject) => BoardObject) {
    objects.value = objects.value.map((o) => (o.id === id ? apply(o) : o))
  }

  function addObject(kind: BoardObjectKind, centerX: number, centerY: number) {
    const object = createObject(kind, centerX, centerY)
    objects.value = [...objects.value, object]
    return object
  }

  function addCopy(source: BoardObject, dx: number, dy: number) {
    const object = { ...source, id: crypto.randomUUID(), x: source.x + dx, y: source.y + dy }
    objects.value = [...objects.value, object]
    return object
  }

  function moveObject(id: string, x: number, y: number) {
    change(id, (o) => ({ ...o, x, y }))
  }

  function resizeObject(id: string, rect: Rect) {
    change(id, (o) => ({ ...o, ...rect }))
  }

  function setText(id: string, text: string) {
    change(id, (o) => (o.kind === 'circle' ? o : { ...o, text }))
  }

  function setColor(id: string, color: string) {
    change(id, (o) => ({ ...o, color }))
  }

  function setFontSize(id: string, fontSize: FontSize) {
    change(id, (o) => (o.kind === 'circle' ? o : { ...o, fontSize }))
  }

  function setBold(id: string, bold: boolean) {
    change(id, (o) => (o.kind === 'circle' ? o : { ...o, bold }))
  }

  function setBorder(id: string, border: boolean) {
    change(id, (o) => (o.kind === 'text' ? o : { ...o, border }))
  }

  function removeObject(id: string) {
    objects.value = objects.value.filter((o) => o.id !== id)
  }

  return {
    objects: readonly(objects),
    addObject,
    addCopy,
    moveObject,
    resizeObject,
    setText,
    setColor,
    setFontSize,
    setBold,
    setBorder,
    removeObject,
  }
}
