import firebase from 'firebase'
import { Game } from 'interfaces/game'
import { Roles } from 'interfaces/roles'
import { SetupPlayer } from 'interfaces/player'
import { toPairs } from 'ramda'
import { Deck } from '.'

firebase.initializeApp(
  process.env.NODE_ENV === 'production'
    ? {
        apiKey: 'AIzaSyC2XK6ev0rkTjbX1DEuiUrQb9ohAaJjRYg',
        authDomain: 'wt-werewolf.firebaseapp.com',
        databaseURL: 'https://wt-werewolf.firebaseio.com',
        projectId: 'wt-werewolf',
        storageBucket: 'wt-werewolf.appspot.com',
        messagingSenderId: '529798462395',
      }
    : {
        apiKey: 'AIzaSyBoJ83KQAemXzA6U04NV1I1sRvcDAz1I34',
        authDomain: 'ww-dev-d5d0d.firebaseapp.com',
        databaseURL: 'https://ww-dev-d5d0d.firebaseio.com',
        projectId: 'ww-dev-d5d0d',
        storageBucket: 'ww-dev-d5d0d.appspot.com',
        messagingSenderId: '954677605618',
      }
)

export interface FirebaseState {
  game: Game | null
  players: SetupPlayer[]
  roles: Roles[]
  timeLimit: number
  noFlip: boolean
  previousDecks: Deck[]
}

export const defaultFirebaseState: FirebaseState = {
  roles: [],
  players: [],
  game: null,
  timeLimit: 120,
  noFlip: false,
  previousDecks: [],
}

export const updateFirebase = <T extends Partial<FirebaseState>>(props: T) => {
  database.ref().update(
    toPairs<string, any>(props).reduce(
      (acc, [key, val]) => ({
        ...acc,
        [`/${key}`]: val,
      }),
      {}
    )
  )

  const prev = JSON.parse(
    localStorage.getItem('wt-werewolf') || JSON.stringify(defaultFirebaseState)
  )
  localStorage.setItem(
    'wt-werewolf',
    JSON.stringify({ ...prev, ...(props as object) })
  )
}

export const database = firebase.database()
