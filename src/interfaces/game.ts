import { Roles } from 'interfaces/cards'

type Id = string

export type Death = 'lynch' | 'bite' | 'other' | 'mason'
export const Death: Death[] = ['lynch', 'bite', 'other', 'mason']

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
    case Roles['cupid']:
      return {
        role,
        message:
          'wake up and point at two players. when one dies, the other dies.',
        action: { type: 'link-2-way', target: '', source: '' },
      }

    case Roles['mason']:
      return {
        role,
        message: 'wake up and look for the other masons.',
      }

    case Roles['doppleganger']:
      return {
        role,
        message:
          'wake up and point at someone, when they die you become their role.',
        action: { type: 'copy', target: '', source: '' },
      }

    case Roles['cursed']:
    case Roles['hunter']:
    case Roles['seer']:
    case Roles['apprentice seer']:
    case Roles['witch']:
    case Roles['werewolf']:
    case Roles['big bad wolf']:
    case Roles['sorceress']:
    case Roles['wolf cub']:
    case Roles['tanner']:
    case Roles['bodyguard']:
      return {
        role,
        message: 'wake up and look at me.',
      }

    case Roles['villager']:
      return null
  }
}

export const deathAction = (
  role: Roles,
  reason: Death
): Action | string | null => {
  switch (role) {
    case Roles['hunter']:
    case Roles['tanner']:
    case Roles['cursed']:
    case Roles['wolf cub']:
      return 'todo'

    case Roles['seer']:
    case Roles['big bad wolf']:
    case Roles['apprentice seer']:
    case Roles['witch']:
    case Roles['werewolf']:
    case Roles['sorceress']:
    case Roles['bodyguard']:
    case Roles['cupid']:
    case Roles['mason']:
    case Roles['doppleganger']:
    case Roles['villager']:
      return null
  }
}
