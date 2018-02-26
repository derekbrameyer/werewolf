import { Roles } from 'interfaces/roles'

export type PlayerId = string

export interface SetupPlayer {
  name: PlayerId
  role: Roles | null
}

export const defaultSetupPlayer: SetupPlayer = {
  name: '',
  role: null,
}

export interface Player extends SetupPlayer {
  name: PlayerId
  role: Roles
  originalRole: Roles | null
  alive: boolean
  links: PlayerId[] | null
  copiedBy: PlayerId | null
  protected: boolean
  indoctrinated: boolean
  bitten: boolean
  blessed: boolean
  silenced: boolean
  betOn: boolean
  drunk: boolean
  exiled: boolean
}

export const defaultPlayer: Player = {
  name: '',
  alive: true,
  links: null,
  copiedBy: null,
  protected: false,
  bitten: false,
  blessed: false,
  indoctrinated: false,
  role: 'villager',
  originalRole: null,
  silenced: false,
  exiled: false,
  drunk: false,
  betOn: false,
}
