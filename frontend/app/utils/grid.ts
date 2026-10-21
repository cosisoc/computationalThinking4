export const GRID_SIZE = 24

export const snapToGrid = (value: number) => Math.round(value / GRID_SIZE) * GRID_SIZE
