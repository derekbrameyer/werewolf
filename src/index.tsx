import * as React from 'react'
import { render } from 'react-dom'
import firebase from 'firebase'

import './styles.scss'

import { App } from 'views'

firebase.initializeApp({
  apiKey: 'AIzaSyC2XK6ev0rkTjbX1DEuiUrQb9ohAaJjRYg',
  authDomain: 'wt-werewolf.firebaseapp.com',
  databaseURL: 'https://wt-werewolf.firebaseio.com',
  projectId: 'wt-werewolf',
  storageBucket: 'wt-werewolf.appspot.com',
  messagingSenderId: '529798462395',
})

let database = firebase.database()

render(<App database={database} />, document.getElementById('root'))
