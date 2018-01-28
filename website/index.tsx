import * as React from 'react'
import { render } from 'react-dom'
import { toPairs } from 'ramda'
import { Players, FirebaseProps as PlayersProps } from './players'
import { BuildDeck, FirebaseProps as DeckProps } from './deck'
import firebase from 'firebase'
import {
  getDeckWeight,
  getNumberOfARoleInDeck,
  getDeckRoles,
} from '../src/index'

firebase.initializeApp({
  apiKey: 'AIzaSyC2XK6ev0rkTjbX1DEuiUrQb9ohAaJjRYg',
  authDomain: 'wt-werewolf.firebaseapp.com',
  databaseURL: 'https://wt-werewolf.firebaseio.com',
  projectId: 'wt-werewolf',
  storageBucket: 'wt-werewolf.appspot.com',
  messagingSenderId: '529798462395',
})

let database = firebase.database()

interface Props {}
interface State extends PlayersProps, DeckProps {
  view: 'menu' | 'deck' | 'players' | 'game'
}

class App extends React.Component<Props, State> {
  state: State = {
    view: 'menu',
    cards: [],
    players: [],
    targetDeckSize: 9,
  }

  componentWillMount() {
    database.ref('/').on('value', snapshot => {
      this.setState(snapshot ? snapshot.val() : {})
    })
  }

  updateFirebase = <T extends object>(props: T) => {
    database
      .ref()
      .update(
        toPairs<string, any>(props).reduce(
          (acc, [key, val]) => ({ ...acc, [`/${key}`]: val }),
          {}
        )
      )
  }

  showMenu = () => this.setState({ view: 'menu' })

  render() {
    return (
      <div>
        {this.state.view !== 'game' && (
          <div>
            <button onClick={() => this.setState({ view: 'deck' })}>
              build deck
            </button>

            <button onClick={() => this.setState({ view: 'players' })}>
              manage players
            </button>

            <button onClick={() => this.setState({ view: 'game' })}>
              start game
            </button>
          </div>
        )}

        {this.state.view === 'menu' && (
          <div>
            <h2>Players ({this.state.players.length}):</h2>
            {this.state.players.map(player => <div>{player.name}</div>)}
            <h2>
              Deck ({this.state.cards.length} /{' '}
              {getDeckWeight(this.state.cards)}):
            </h2>
            {getDeckRoles(this.state.cards).map(role => (
              <div key={role}>
                {role} @ {getNumberOfARoleInDeck(role, this.state.cards)}
              </div>
            ))}
          </div>
        )}

        {this.state.view === 'deck' && (
          <BuildDeck
            done={this.showMenu}
            update={this.updateFirebase}
            cards={this.state.cards}
            targetDeckSize={this.state.targetDeckSize}
          />
        )}

        {this.state.view === 'players' && (
          <Players
            done={this.showMenu}
            update={this.updateFirebase}
            players={this.state.players}
          />
        )}
      </div>
    )
  }
}

render(<App />, document.getElementById('root'))
