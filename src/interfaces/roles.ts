import { Actions } from 'interfaces/actions'
const images = require('../assets/*')

export enum Team {
  'wolf' = 'wolf',
  'minion' = 'minion',
  'villager' = 'villager',
  'tanner' = 'tanner',
  'vampire' = 'vampire',
}

export enum Roles {
  'werewolf' = 'werewolf',
  'big bad wolf' = 'big bad wolf',
  'wolf cub' = 'wolf cub',
  'seer' = 'seer',
  'apprentice seer' = 'apprentice seer',
  'bodyguard' = 'bodyguard',
  'hunter' = 'hunter',
  'villager' = 'villager',
  'cupid' = 'cupid',
  'cursed' = 'cursed',
  'mason' = 'mason',
  'witch' = 'witch',
  'doppleganger' = 'doppleganger',
  'sorceress' = 'sorceress',
  'tanner' = 'tanner',
  'pi' = 'pi',
  'prince' = 'prince',
  'lycan' = 'lycan',
  'aura seer' = 'aura seer',
  'minion' = 'minion',
  'vampire' = 'vampire',
  'priest' = 'priest',
  'diseased' = 'diseased',
  'direwolf' = 'direwolf',
  'va wolf' = 'va wolf',
}

export type LinkRoles = typeof Roles.direwolf | typeof Roles['va wolf']

export interface Card {
  role: Roles
  team: Team
  weight: number
  cardCount: number
  emoji: string
  wakesUp: boolean
  profileImg: string
  actions: Actions[]
}

export const doesRoleWakeUp = (role: Roles): boolean => {
  // prettier-ignore
  switch (role) {
    case Roles['tanner']: return false
    case Roles['doppleganger']: return false
    case Roles['cursed']: return false
    case Roles['sorceress']: return true
    case Roles['werewolf']: return true
    case Roles['wolf cub']: return true
    case Roles['witch']: return true
    case Roles['big bad wolf']: return true
    case Roles['cupid']: return false
    case Roles['mason']: return false
    case Roles['villager']: return false
    case Roles['hunter']: return false
    case Roles['seer']: return true
    case Roles['apprentice seer']: return true
    case Roles['bodyguard']: return true
    case Roles['pi']: return true
    case Roles['prince']: return true
    case Roles['aura seer']: return true
    case Roles['lycan']: return false
    case Roles['vampire']: return true
    case Roles['minion']: return false
    case Roles['va wolf']: return false
    case Roles['priest']: return true
    case Roles['diseased']: return false
    case Roles['direwolf']: return true
  }
}

export const getRoleCardCount = (role: Roles): number => {
  // prettier-ignore
  switch (role) {
    case Roles['tanner']: return 1
    case Roles['doppleganger']: return 1
    case Roles['cursed']: return 1
    case Roles['sorceress']: return 1
    case Roles['werewolf']: return 12
    case Roles['wolf cub']: return 1
    case Roles['witch']: return 1
    case Roles['big bad wolf']: return 1
    case Roles['cupid']: return 1
    case Roles['mason']: return 3
    case Roles['villager']: return 20
    case Roles['hunter']: return 1
    case Roles['seer']: return 1
    case Roles['apprentice seer']: return 1
    case Roles['bodyguard']: return 1
    case Roles['pi']: return 1
    case Roles['va wolf']: return 1
    case Roles['prince']: return 1
    case Roles['lycan']: return 1
    case Roles['aura seer']: return 1
    case Roles['minion']: return 1
    case Roles['vampire']: return 8
    case Roles['priest']: return 1
    case Roles['diseased']: return 1
    case Roles['direwolf']: return 1
  }
}

export const getRoleTeam = (role: Roles | null | undefined): Team => {
  if (!role) return Team.villager

  // prettier-ignore
  switch (role) {
    case Roles['tanner']: return Team.tanner
    case Roles['doppleganger']: return Team.villager
    case Roles['cursed']: return Team.minion
    case Roles['sorceress']: return Team.minion
    case Roles['werewolf']: return Team.wolf
    case Roles['direwolf']: return Team.wolf
    case Roles['wolf cub']: return Team.wolf
    case Roles['witch']: return Team.villager
    case Roles['big bad wolf']: return Team.wolf
    case Roles['cupid']: return Team.villager
    case Roles['mason']: return Team.villager
    case Roles['villager']: return Team.villager
    case Roles['va wolf']: return Team.villager
    case Roles['hunter']: return Team.villager
    case Roles['seer']: return Team.villager
    case Roles['apprentice seer']: return Team.villager
    case Roles['bodyguard']: return Team.villager
    case Roles['pi']: return Team.villager
    case Roles['prince']: return Team.villager
    case Roles['lycan']: return Team.villager
    case Roles['minion']: return Team.minion
    case Roles['aura seer']: return Team.villager
    case Roles['priest']: return Team.villager
    case Roles['vampire']: return Team.vampire
    case Roles['diseased']: return Team.villager
  }
}

export const getRoleWeight = (role: Roles | null | undefined): number => {
  if (!role) return 1

  // prettier-ignore
  switch (role) {
    case Roles['tanner']: return 1
    case Roles['doppleganger']: return -2
    case Roles['va wolf']: return -2
    case Roles['cursed']: return -3
    case Roles['sorceress']: return -3
    case Roles['werewolf']: return -6
    case Roles['direwolf']: return -4
    case Roles['wolf cub']: return -8
    case Roles['witch']: return 4
    case Roles['big bad wolf']: return -9
    case Roles['cupid']: return -3
    case Roles['mason']: return 2
    case Roles['villager']: return 1
    case Roles['hunter']: return 3
    case Roles['seer']: return 7
    case Roles['apprentice seer']: return 4
    case Roles['bodyguard']: return 3
    case Roles['pi']: return 3
    case Roles['prince']: return 3
    case Roles['minion']: return -6
    case Roles['aura seer']: return 3
    case Roles['lycan']: return -1
    case Roles['priest']: return 3
    case Roles['vampire']: return -7
    case Roles['diseased']: return +3
  }
}

export const getRoleEmoji = (role: Roles | undefined | null): string => {
  // prettier-ignore
  if (!role) return '❓'

  // prettier-ignore
  switch (role) {
    case Roles['apprentice seer']: return '🧖‍'
    case Roles['seer']: return '🔮'
    case Roles['bodyguard']: return '👮‍♀️'
    case Roles['cupid']: return '❤️'
    case Roles['cursed']: return '🧟‍'
    case Roles['doppleganger']: return '🤷‍♀️'
    case Roles['hunter']: return '🏹'
    case Roles['mason']: return '👁'
    case Roles['sorceress']: return '🧙‍♀️'
    case Roles['villager']: return '👨‍🌾'
    case Roles['witch']: return '🧙‍♂️'
    case Roles['big bad wolf']: return '🐗'
    case Roles['direwolf']: return '🐩'
    case Roles['werewolf']: return '🐺'
    case Roles['wolf cub']: return '🐶'
    case Roles['tanner']: return '😭'
    case Roles['pi']: return '👻'
    case Roles['prince']: return '🤴'
    case Roles['lycan']: return '🦊'
    case Roles['va wolf']: return '👵'
    case Roles['aura seer']: return '😇'
    case Roles['priest']: return '🙏'
    case Roles['minion']: return '😈'
    case Roles['vampire']: return '🧛‍♀️'
    case Roles['diseased']: return '🤒'
  }
}

export const getRoleActions = (role: Roles | undefined | null): Actions[] => {
  // prettier-ignore
  if (!role) return []

  // prettier-ignore
  switch (role) {
    case Roles['apprentice seer']: return []
    case Roles['seer']: return []
    case Roles['bodyguard']: return []
    case Roles['cupid']: return []
    case Roles['cursed']: return ['transform']
    case Roles['doppleganger']: return []
    case Roles['direwolf']: return []
    case Roles['hunter']: return []
    case Roles['mason']: return []
    case Roles['sorceress']: return []
    case Roles['va wolf']: return []
    case Roles['villager']: return []
    case Roles['witch']: return []
    case Roles['big bad wolf']: return []
    case Roles['werewolf']: return []
    case Roles['wolf cub']: return []
    case Roles['tanner']: return []
    case Roles['pi']: return []
    case Roles['prince']: return []
    case Roles['lycan']: return []
    case Roles['aura seer']: return []
    case Roles['minion']: return []
    case Roles['priest']: return []
    case Roles['vampire']: return []
    case Roles['diseased']: return []

  }
}

export const getRoleImage = (role: Roles | null | undefined): string =>
  images[`${(role || 'unknown').replace(/\s/g, '-')}.png`]

export const getRoleProfileImage = (role: Roles | null | undefined): string =>
  images[`${(role || 'unknown').replace(/\s/g, '-')}-profile.png`]

export const getCard = (maybeRole: Roles | null): Card => {
  const role = maybeRole || Roles.villager
  return {
    role,
    team: getRoleTeam(role),
    weight: getRoleWeight(role),
    cardCount: getRoleCardCount(role),
    emoji: getRoleEmoji(role),
    wakesUp: doesRoleWakeUp(role),
    actions: getRoleActions(role),
    profileImg: getRoleProfileImage(role),
  }
}

export const AllRoles = Object.keys(Roles) as Roles[]
export const AllCards: Card[] = AllRoles.map(getCard)
