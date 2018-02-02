import { reduce, uniq, findIndex, remove, propEq } from 'ramda'
import { Card, Roles } from 'interfaces/roles'
import { Game, Prompt } from 'interfaces/game'
import { Player } from 'interfaces/player'

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

export const isPlayerAlive = (game: Game, name: string): boolean =>
  game.players[name].alive

export const removeFirst = <T extends object>(
  predicate: (prop: T) => boolean,
  list: T[]
): T[] => remove(findIndex(predicate, list), 1, list)

export const gameHasRole = (game: Game, role: Roles): boolean =>
  game.roles.indexOf(role) > -1

export const updatePlayer = (
  game: Game,
  name: string,
  props: Partial<Player> | ((player: Player) => Partial<Player>)
): Game => ({
  ...game,
  players: {
    ...game.players,
    [name]: {
      ...game.players[name],
      ...(typeof props === 'function' ? props(game.players[name]) : props),
    },
  },
})

export const addPrompt = (
  game: Game,
  prompt: Prompt | undefined | null
): Game => ({
  ...game,
  prompts: prompt ? [...(game.prompts || []), prompt] : game.prompts || [],
})

export const removePrompt = (game: Game, message: string): Game => ({
  ...game,
  prompts: removeFirst(propEq('message', message), game.prompts || []),
})
