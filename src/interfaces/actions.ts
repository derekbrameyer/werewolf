import { Player, PlayerId } from './player'

export type Actions =
  | 'kill'
  | 'bypass protection'
  | 'sudo kill'
  | 'protect'
  | 'bless'
  | 'bite'
  | 'transform'
  | 'next role'
  | 'start day timer'

export type Action =
  | { type: Actions; target: null }
  | { type: Actions; target: PlayerId; playerProp: keyof Player }

export const Actions = (type: Actions): Action => {
  switch (type) {
    case 'bite':
      return { type: 'bite', playerProp: 'bitten', target: '' }
    case 'bless':
      return { type: 'bless', playerProp: 'blessed', target: '' }
    case 'kill':
    case 'sudo kill':
    case 'bypass protection':
      return { type, playerProp: 'alive', target: '' }
    case 'protect':
      return { type: 'protect', playerProp: 'protected', target: '' }
    case 'transform':
      return { type: 'transform', playerProp: 'role', target: '' }
    case 'next role':
      return { type: 'next role', target: null }
    case 'start day timer':
      return { type: 'start day timer', target: null }
  }
}

export type PregameAction =
  | {
      type: 'cupid'
      id: string
      buttons: {
        link1: PlayerId
        link2: PlayerId
      }
    }
  | {
      type: 'copy'
      id: string
      source: PlayerId
      buttons: {
        copy: PlayerId
      }
    }
  | {
      type: 'link'
      id: string
      source: PlayerId
      buttons: {
        link: PlayerId
      }
    }
