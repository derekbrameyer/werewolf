import firebase from 'firebase'
import { Game } from 'interfaces/game'
import { Roles } from 'interfaces/roles'
import { SetupPlayer } from 'interfaces/player'
import { toPairs } from 'ramda'

firebase.initializeApp({
  apiKey: 'AIzaSyDpVfAXmgLRROp1mhv0wGaL6iyrpHaDtaU',
  authDomain: 'ultimate-werewolf-generator.firebaseapp.com',
  databaseURL: 'https://ultimate-werewolf-generator.firebaseio.com',
  projectId: 'ultimate-werewolf-generator',
  storageBucket: 'ultimate-werewolf-generator.appspot.com',
  messagingSenderId: '930320036382',
})

export interface FirebaseState {
  game: Game | null
  players: SetupPlayer[]
  roles: Roles[]
  timeLimit: number
  noFlip: boolean
}

export const defaultFirebaseState: FirebaseState = {
  roles: [],
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
