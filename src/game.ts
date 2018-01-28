import { Roles } from 'cards'

type Id = string
export const uuid = (): Id =>
  Math.floor(Math.random() * 100000000000).toString()

export type Death = 'lynch' | 'bite' | 'action' | 'force'
export type Action = {
  target?: Id
}

export interface Game {
  id: Id
  players: Player[]
  roles: Roles[]
  night: Night[]
  day: Day[]
}

export interface Player {
  name: Id
  role?: Roles
  alive: boolean
}

interface Night {}

interface Day {}

export interface Link {
  source: Id
  target: Id
  action: Action
}
