// Returns a pointerdown handler that reports the pointer offset since the drag started.
export function useDrag(onStart: () => void, onMove: (dx: number, dy: number) => void) {
  return (event: PointerEvent) => {
    if (event.button !== 0) return
    const startX = event.clientX
    const startY = event.clientY
    onStart()

    const move = (e: PointerEvent) => onMove(e.clientX - startX, e.clientY - startY)
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }
}
