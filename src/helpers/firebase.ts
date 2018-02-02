import firebase from 'firebase'
import { Game } from 'interfaces/game'
import { Card } from 'interfaces/roles'
import { Player } from 'interfaces/player'
import { toPairs } from 'ramda'

firebase.initializeApp({
  apiKey: 'AIzaSyC2XK6ev0rkTjbX1DEuiUrQb9ohAaJjRYg',
  authDomain: 'wt-werewolf.firebaseapp.com',
  databaseURL: 'https://wt-werewolf.firebaseio.com',
  projectId: 'wt-werewolf',
  storageBucket: 'wt-werewolf.appspot.com',
  messagingSenderId: '529798462395',
})

interface FirebaseState {
  game: Game | null
  players: Player[] | null
  cards: Card[] | null
}

export const updateFirebase = <T extends Partial<FirebaseState>>(props: T) =>
  database.ref().update(
    toPairs<string, any>(props).reduce(
      (acc, [key, val]) => ({
        ...acc,
        [`/${key}`]: val,
      }),
      {}
    )
  )

export const database = firebase.database()
