export enum Team {
  'wolf' = 'wolf',
  'minion' = 'minion',
  'villager' = 'villager',
  'tanner' = 'tanner',
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
}

export interface Card {
  role: Roles
  team: Team
  weight: number
  cardCount: number
  emoji: string
}

export const getCardCount = (role: Roles): number => {
  // prettier-ignore
  switch (role) {
    case Roles['tanner']: return 1
    case Roles['doppleganger']: return 1
    case Roles['cursed']: return 1
    case Roles['sorceress']: return 1
    case Roles['werewolf']: return 5
    case Roles['wolf cub']: return 1
    case Roles['witch']: return 1
    case Roles['big bad wolf']: return 1
    case Roles['cupid']: return 1
    case Roles['mason']: return 3
    case Roles['villager']: return 15
    case Roles['hunter']: return 1
    case Roles['seer']: return 1
    case Roles['apprentice seer']: return 1
    case Roles['bodyguard']: return 1
  }
}

export const getCardTeam = (role: Roles): Team => {
  // prettier-ignore
  switch (role) {
    case Roles['tanner']: return Team.tanner
    case Roles['doppleganger']: return Team.villager
    case Roles['cursed']: return Team.minion
    case Roles['sorceress']: return Team.minion
    case Roles['werewolf']: return Team.wolf
    case Roles['wolf cub']: return Team.wolf
    case Roles['witch']: return Team.villager
    case Roles['big bad wolf']: return Team.wolf
    case Roles['cupid']: return Team.villager
    case Roles['mason']: return Team.villager
    case Roles['villager']: return Team.villager
    case Roles['hunter']: return Team.villager
    case Roles['seer']: return Team.villager
    case Roles['apprentice seer']: return Team.villager
    case Roles['bodyguard']: return Team.villager
  }
}

export const getCardWeight = (role: Roles): number => {
  // prettier-ignore
  switch (role) {
    case Roles['tanner']: return 1
    case Roles['doppleganger']: return -2
    case Roles['cursed']: return -3
    case Roles['sorceress']: return -3
    case Roles['werewolf']: return -6
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
  }
}

export const getCardEmoji = (role: Roles | undefined): string => {
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
    case Roles['werewolf']: return '🐺'
    case Roles['wolf cub']: return '🐶'
    case Roles['tanner']: return '😭'
  }
}

export const AllRoles = Object.keys(Roles)
export const AllCards: Card[] = AllRoles.map((role: any) => ({
  role,
  team: getCardTeam(role),
  weight: getCardWeight(role),
  cardCount: getCardCount(role),
  emoji: getCardEmoji(role),
}))
