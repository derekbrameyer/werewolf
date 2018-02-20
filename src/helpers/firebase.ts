import firebase from 'firebase'
import { Game } from 'interfaces/game'
import { Card } from 'interfaces/roles'
import { Player } from 'interfaces/player'
import { toPairs } from 'ramda'

firebase.initializeApp({
  apiKey: 'AIzaSyBoJ83KQAemXzA6U04NV1I1sRvcDAz1I34',
  authDomain: 'ww-dev-d5d0d.firebaseapp.com',
  databaseURL: 'https://ww-dev-d5d0d.firebaseio.com',
  projectId: 'ww-dev-d5d0d',
  storageBucket: '',
  messagingSenderId: '954677605618',
})

export interface FirebaseState {
  game: Game | null
  players: Player[]
  cards: Card[]
  timeLimit: number
  noFlip: boolean
}

export const defaultFirebaseState: FirebaseState = {
  cards: [],
  players: [],
  game: null,
  timeLimit: 120,
  noFlip: false,
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
