import { Roles } from 'interfaces/cards'

type Id = string

export type Death = 'lynch' | 'bite' | 'action' | 'moderator'

export type Action =
  | { type: 'kill'; target: Id; reason: Death }
  | { type: 'protect'; target: Id }
  | { type: 'link-1-way'; target: Id; source: Id }
  | { type: 'link-2-way'; target: Id; source: Id }
  | { type: 'copy'; target: Id; source: Id }

export interface Game {
  players: Player[]
  roles: Roles[]
  setup: Action[]
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

export interface Setup {
  role: Roles
  message: string
  action?: Action
}

export const setupRole = (role: Roles): Setup | null => {
  switch (role) {
    case 'cupid':
      return {
        role,
        message:
          'wake up and point at two players. when one dies, the other dies.',
        action: { type: 'link-2-way', target: '', source: '' },
      }

    case 'mason':
      return {
        role,
        message: 'wake up and look for the other masons.',
      }

    case 'doppleganger':
      return {
        role,
        message:
          'wake up and point at someone, when they die you become their role.',
        action: { type: 'copy', target: '', source: '' },
      }

    case 'cursed':
    case 'hunter':
    case 'seer':
    case 'apprentice seer':
    case 'witch':
    case 'werewolf':
    case 'big bad wolf':
    case 'sorceress':
    case 'wolf cub':
    case 'bodyguard':
      return {
        role,
        message: 'wake up and look at me.',
      }

    case 'villager':
      return null
  }
}

export const deathAction = (role: Roles): Action | string | null => {
  switch (role) {
    case 'hunter':
    case 'cursed':
      return 'wake up and point at two players. when one dies, the other dies.'

    case 'wolf cub':
    case 'seer':
    case 'big bad wolf':
    case 'apprentice seer':
    case 'witch':
    case 'werewolf':
    case 'sorceress':
    case 'bodyguard':
    case 'cupid':
    case 'mason':
    case 'doppleganger':
    case 'villager':
      return null
  }
}
