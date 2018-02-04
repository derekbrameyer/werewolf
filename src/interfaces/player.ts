import { Roles } from 'interfaces/roles'

export type PlayerId = string

export interface Player {
  name: PlayerId
  role: Roles | null
  originalRole: Roles | null
  alive: boolean
  links: PlayerId[] | null
  copiedBy: PlayerId | null
  protected: boolean
  bitten: boolean
  blessed: boolean
}

export const defaultPlayer: Player = {
  name: '',
  alive: true,
  links: null,
  copiedBy: null,
  protected: false,
  bitten: false,
  blessed: false,
  role: null,
  originalRole: null,
}
