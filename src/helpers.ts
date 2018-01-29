import { reduce, uniq, adjust, findIndex } from 'ramda'
import { Card, Roles } from 'cards'
import { Player } from 'game'

// ================
// HELPER FUNCTIONS
// ================
export const getDeckWeight = (deck: Card[]): number =>
  reduce<Card, number>(
    (totalWeight, card) => totalWeight + card.weight,
    0,
    deck
  )

export const getRoles = (deck: (Card | Player)[]): Roles[] =>
  uniq(
    deck
      .map(c => c.role)
      .reduce((acc, role) => (role ? [...acc, role] : acc), [] as Roles[])
  )

export const getNumberOfARole = (
  role: Roles,
  deck: (Card | Player)[]
): number => reduce((acc, c) => (c.role === role ? acc + 1 : acc), 0, deck)

export const updateFirst = <T extends object>(
  predicate: (prop: T) => boolean,
  updater: (item: T) => T,
  list: T[]
): T[] => adjust(updater, findIndex(predicate, list), list)
