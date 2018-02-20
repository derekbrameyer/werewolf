import { reduce, uniq, findIndex, remove, propEq, values } from 'ramda'
import { Card, Roles } from 'interfaces/roles'
import { Game } from 'interfaces/game'
import { Player } from 'interfaces/player'
import { Prompt } from 'interfaces/prompt'

export const getDeckWeight = (deck: Card[]): number =>
  reduce<Card, number>(
    (totalWeight, card) => totalWeight + card.weight,
    0,
    deck
  )

export const getGameRoles = (game: Game): Roles[] => {
  const playerRoles = getRoles(values(game.players))
  const cardRoles = getRoles(game.cards)
  return uniq([...playerRoles, ...cardRoles])
}

export const getRoles = (source: (Card | Player)[]): Roles[] =>
  uniq(source.map(c => c.role)) as Roles[]

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
  getGameRoles(game).indexOf(role) > -1

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

export const comparePlayersFull = (a: Player, b: Player): number => {
  const aName = a.name.toUpperCase()
  const bName = b.name.toUpperCase()

  if (a.alive && !b.alive) return -1
  else if (!a.alive && b.alive) return 1
  else if (aName < bName) return -1
  else if (aName > bName) return 1
  else return 0
}

export const comparePlayersName = (a: Player, b: Player): number => {
  const aName = a.name.toUpperCase()
  const bName = b.name.toUpperCase()

  if (aName < bName) return -1
  else if (aName > bName) return 1
  else return 0
}

export const isNight = (game: Game): boolean => {
  return (
    !!(game.nightPrompts || []).length ||
    !!(game.prompts || []).filter(p => p.nightPrompt).length
  )
}
