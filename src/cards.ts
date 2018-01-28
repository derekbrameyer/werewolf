import { Death, Action, Game, Link } from 'game'

export type Roles =
  | 'werewolf'
  | 'big bad wolf'
  | 'wolf cub'
  | 'seer'
  | 'apprentice seer'
  | 'bodyguard'
  | 'hunter'
  | 'villager'
  | 'cupid'
  | 'cursed'
  | 'mason'
  | 'witch'
  | 'doppleganger'

export interface Card {
  role: Roles // A unique id
  team: 'wolf' | 'villager' | 'tanner'
  weight: number // How much it offsets theme
  cardCount: number // How many cards can appear in a deck
  setupRequired?: (game: Game) => Link[] | null // Dictates if the card needs to wake up the first night
  isActive?: (game: Game) => boolean // Dictates if the card should perform its function at night
  deathAction?: (death: Death) => Action | null
}

export const doppleganger: Card = {
  cardCount: 1,
  team: 'villager',
  role: 'doppleganger',
  weight: -2,
}

export const cursed: Card = {
  cardCount: 1,
  team: 'wolf',
  role: 'cursed',
  weight: -3,
}

export const werewolf: Card = {
  cardCount: 5,
  team: 'wolf',
  role: 'werewolf',
  weight: -6,
}

export const wolfCub: Card = {
  cardCount: 1,
  role: 'wolf cub',
  team: 'wolf',
  weight: -8,
}

export const witch: Card = {
  cardCount: 1,
  role: 'witch',
  team: 'villager',
  weight: 4,
}

export const bigBadWolf: Card = {
  cardCount: 1,
  role: 'big bad wolf',
  team: 'wolf',
  weight: -9,
}

export const cupid: Card = {
  cardCount: 1,
  role: 'cupid',
  team: 'villager',
  weight: -3,
}

export const mason: Card = {
  cardCount: 3,
  role: 'mason',
  team: 'villager',
  weight: 2,
}

export const villager: Card = {
  cardCount: 15,
  team: 'villager',
  role: 'villager',
  weight: 1,
}

export const hunter: Card = {
  cardCount: 1,
  role: 'hunter',
  team: 'villager',
  weight: 3,
}

export const seer: Card = {
  cardCount: 1,
  role: 'seer',
  team: 'villager',
  weight: 7,
}

export const apprenticeSeer: Card = {
  cardCount: 1,
  role: 'apprentice seer',
  team: 'villager',
  weight: 4,
}

export const bodyguard: Card = {
  cardCount: 1,
  role: 'bodyguard',
  team: 'villager',
  weight: 3,
}

export const AllCards = [
  werewolf,
  bigBadWolf,
  wolfCub,
  villager,
  seer,
  apprenticeSeer,
  bodyguard,
  doppleganger,
  cupid,
  hunter,
  witch,
  mason,
  cursed,
]
