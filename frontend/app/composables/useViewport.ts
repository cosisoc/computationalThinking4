const MIN_ZOOM = 0.1
const MAX_ZOOM = 4

// Pan and zoom state of the canvas: a screen point = world point * zoom + (x, y).
export function useViewport() {
  const view = reactive({ x: 0, y: 0, zoom: 1 })

  // Zooms so that the screen point (cx, cy) stays in place.
  function zoomAt(factor: number, cx: number, cy: number) {
    const zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, view.zoom * factor))
    const ratio = zoom / view.zoom
    view.x = cx - (cx - view.x) * ratio
    view.y = cy - (cy - view.y) * ratio
    view.zoom = zoom
  }

  function toWorld(sx: number, sy: number) {
    return { x: (sx - view.x) / view.zoom, y: (sy - view.y) / view.zoom }
  }

  // Pinch on a trackpad arrives as a wheel event with ctrlKey set.
  function onWheel(event: WheelEvent) {
    if (event.ctrlKey) {
      const delta = Math.max(-10, Math.min(10, event.deltaY))
      zoomAt(Math.exp(-delta * 0.01), event.clientX, event.clientY)
    } else {
      view.x -= event.deltaX
      view.y -= event.deltaY
    }
  }

  let start = { x: 0, y: 0 }
  const onPanStart = useDrag(
    () => { start = { x: view.x, y: view.y } },
    (dx, dy) => {
      view.x = start.x + dx
      view.y = start.y + dy
    }
  )

  return { view, zoomAt, toWorld, onWheel, onPanStart }
}
