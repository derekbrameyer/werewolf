import { Roles } from 'interfaces/roles'

type Id = string

export interface Player {
  name: Id
  role: Roles | null
  alive: boolean
  links: Id[] | null
  copiedBy: Id | null
  protected: boolean
}

export const defaultPlayer: Player = {
  name: '',
  alive: true,
  links: null,
  copiedBy: null,
  protected: false,
  role: null,
}
