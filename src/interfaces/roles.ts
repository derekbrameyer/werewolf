import { Actions } from 'interfaces/actions'
import { Prompt } from 'interfaces/prompt'
import { Player } from 'interfaces/player'
const images = require('../assets/*')

type Diff<T extends string, U extends string> = ({ [P in T]: P } &
  { [P in U]: never } & { [x: string]: never })[T]
type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>

type Teams =
  | 'wolf'
  | 'minion'
  | 'villager'
  | 'tanner'
  | 'vampire'
  | 'cult leader'

export interface Card<Role extends string = string> {
  role: Role
  team: Teams
  weight: number
  cardCount: number
  emoji: string
  image: string
  profile: string
  preDeathAction?: (player: Player) => Prompt
  nightMessage?: string
  deathMessage?: string
  // Custom actions the role will always have available
  actions?: Actions[]
}

const Card = <Role extends string>(
  card: Omit<Card<Role>, 'image' | 'profile'>
): Card<Role> => ({
  ...card,
  image: images[`${card.role.replace(/\s/g, '-')}.png`],
  profile: images[`${card.role.replace(/\s/g, '-') + '-profile'}.png`],
})

export const AllCards = [
  Card({
    role: 'villager',
    team: 'villager',
    weight: 1,
    cardCount: 10,
    emoji: '👩‍🌾',
  }),

  Card({
    role: 'werewolf',
    team: 'wolf',
    weight: -6,
    cardCount: 3,
    emoji: '🐺',
  }),

  Card({
    role: 'tanner',
    cardCount: 1,
    emoji: '😭',
    team: 'tanner',
    weight: 1,
    deathMessage: 'if the tanner was lynched then they win',
  }),

  Card({
    role: 'big bad wolf',
    weight: -9,
    team: 'wolf',
    emoji: '🐗',
    cardCount: 1,
  }),

  Card({
    role: 'wolf cub',
    weight: -8,
    team: 'wolf',
    emoji: '🐶',
    cardCount: 1,
    deathMessage: 'the wolf cub died, wolves get to kill two people next night',
  }),

  Card({
    role: 'seer',
    weight: 7,
    team: 'villager',
    emoji: '🔮',
    cardCount: 1,
    nightMessage: 'seer, inspect someone',
  }),

  Card({
    role: 'apprentice seer',
    weight: 4,
    team: 'villager',
    emoji: '🧖‍',
    cardCount: 1,
    nightMessage: 'apprentice seer, inspect someone',
  }),

  Card({
    role: 'bodyguard',
    weight: 3,
    team: 'villager',
    emoji: '👮‍♀️',
    cardCount: 1,
    nightMessage: 'bodyguard, protect someone',
  }),

  Card({
    role: 'hunter',
    weight: 3,
    team: 'villager',
    emoji: '🏹',
    cardCount: 1,
    deathMessage: 'the hunter has died, choose a player to kill',
  }),

  Card({
    role: 'cupid',
    weight: -3,
    team: 'villager',
    emoji: '🏹',
    cardCount: 1,
  }),

  Card({
    role: 'cursed',
    weight: -3,
    team: 'villager',
    emoji: '🧟‍',
    cardCount: 1,
    actions: ['transform'],
    preDeathAction: player => ({
      target: player.name,
      message: `${player.name} is the cursed, what would you like to do?`,
      actions: ['transform', 'sudo kill'],
    }),
  }),

  Card({
    role: 'mason',
    weight: 2,
    team: 'villager',
    emoji: '👁',
    cardCount: 3,
  }),

  Card({
    role: 'witch',
    weight: 4,
    team: 'villager',
    emoji: '🧙‍♂️',
    cardCount: 1,
    nightMessage:
      'witch, thumbs up to save everyone, thumbs down and point to kill someone',
  }),

  Card({
    role: 'doppleganger',
    weight: -2,
    team: 'villager',
    emoji: '🤷‍♀️',
    cardCount: 1,
  }),

  Card({
    role: 'sorceress',
    weight: -3,
    team: 'minion',
    emoji: '🧙‍♀️',
    cardCount: 1,
    nightMessage: 'sorceress, look for the seer',
  }),

  Card({
    role: 'pi',
    weight: 3,
    team: 'villager',
    emoji: '👻',
    cardCount: 1,
    nightMessage:
      'pi, point at some one, if they or one of their neighbors are a wolf I will say yes',
  }),

  Card({
    role: 'prince',
    weight: 3,
    team: 'villager',
    emoji: '🤴',
    cardCount: 1,
    preDeathAction: player => ({
      target: player.name,
      message: `${player.name} is the prince, what would you like to do?`,
      actions: ['sudo kill'],
    }),
  }),

  Card({
    role: 'lycan',
    weight: -1,
    team: 'villager',
    emoji: '🦊',
    cardCount: 1,
  }),

  Card({
    role: 'aura seer',
    weight: 3,
    team: 'villager',
    emoji: '😇',
    cardCount: 1,
    nightMessage:
      'aura seer, inspect someone, if they have a special power I will say yes',
  }),

  Card({
    role: 'minion',
    weight: -6,
    team: 'minion',
    emoji: '😈',
    cardCount: 1,
  }),

  Card({
    role: 'vampire',
    weight: -7,
    team: 'vampire',
    emoji: '🧛‍♀️',
    cardCount: 3,
    nightMessage:
      'vampire, bite someone, if that person gets two nominations from now on, they die',
  }),

  Card({
    role: 'priest',
    weight: 3,
    team: 'villager',
    emoji: '🙏',
    cardCount: 1,
    nightMessage:
      'priest, bless someone. if they are ever killed you will bless another person next night',
  }),

  Card({
    role: 'diseased',
    weight: 3,
    team: 'villager',
    emoji: '🤒',
    cardCount: 1,
    deathMessage:
      'if the diseased was killed by werewolf the werewolfs can not kill the next night',
  }),

  Card({
    role: 'direwolf',
    weight: -4,
    team: 'wolf',
    emoji: '🐩',
    cardCount: 1,
  }),

  Card({
    role: 'va wolf',
    weight: -2,
    team: 'villager',
    emoji: '👵',
    cardCount: 1,
  }),

  Card({
    role: 'cult leader',
    weight: 1,
    team: 'cult leader',
    emoji: '🍷',
    cardCount: 1,
    nightMessage:
      'cult leader, indoctrinate someone, they are now part of your cult',
  }),

  Card({
    role: 'fruit brute',
    weight: -3,
    team: 'wolf',
    emoji: '🥕',
    cardCount: 1,
  }),

  Card({
    role: 'fang face',
    weight: -5,
    team: 'wolf',
    emoji: '😸',
    cardCount: 1,
  }),

  Card({
    role: 'spell caster',
    weight: 1,
    team: 'villager',
    emoji: '🧝‍♀️',
    cardCount: 1,
  }),

  Card({
    role: 'old hag',
    weight: 1,
    team: 'villager',
    emoji: '👵',
    cardCount: 1,
  }),

  Card({
    role: 'village idiot',
    weight: 2,
    team: 'villager',
    emoji: '🤡',
    cardCount: 1,
  }),

  Card({
    role: 'pacifist',
    weight: -1,
    team: 'villager',
    emoji: '✌️',
    cardCount: 1,
  }),

  Card({
    role: 'hoodlum',
    weight: 0,
    team: 'villager',
    emoji: '🎰',
    cardCount: 1,
  }),
]

export type Roles = (typeof AllCards)[0]['role']
export const Roles = AllCards.map(role => role.role)

export const getCard = <Role extends Roles>(role: Role): Card<Role> =>
  AllCards.find(r => r.role === role) as Card<Role>
