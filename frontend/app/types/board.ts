interface BaseObject {
  id: string
  x: number
  y: number
  width: number
  height: number
  color: string
}

export type FontSize = 'S' | 'M' | 'L'

interface TextStyle {
  fontSize: FontSize
  bold: boolean
}

interface Bordered {
  border: boolean
}

export interface NoteObject extends BaseObject, TextStyle, Bordered {
  kind: 'note'
  text: string
}

export interface TextObject extends BaseObject, TextStyle {
  kind: 'text'
  text: string
}

export interface CircleObject extends BaseObject, Bordered {
  kind: 'circle'
}

export type BoardObject = NoteObject | TextObject | CircleObject
export type BoardObjectKind = BoardObject['kind']
export type Rect = Pick<BoardObject, 'x' | 'y' | 'width' | 'height'>
export type Attribute = 'color' | 'fontSize' | 'border' | 'bold'
