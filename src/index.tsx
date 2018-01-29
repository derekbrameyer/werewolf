import * as React from 'react'
import { render } from 'react-dom'
import { toPairs } from 'ramda'
import firebase from 'firebase'
import { Players, FirebaseProps as PlayersProps } from 'players'
import { BuildDeck, FirebaseProps as DeckProps } from 'deck'
import { getDeckWeight, getNumberOfARole, getRoles } from 'helpers'
import { Game } from 'game'
import { SetupGame } from 'setupgame'

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
  view: 'menu' | 'deck' | 'players' | 'setup'
  game: Game | null
}

class App extends React.Component<Props, State> {
  defaultState: State = {
    view: 'menu',
    cards: [],
    players: [],
    game: null,
  }
  state: State = this.defaultState

  componentWillMount() {
    database.ref('/').on('value', snapshot => {
      this.setState(snapshot ? { ...this.defaultState, ...snapshot.val() } : {})
    })
  }

  updateFirebase = <T extends Partial<State>>(props: T) => {
    database.ref().update(
      toPairs<string, any>(props).reduce(
        (acc, [key, val]) => ({
          ...acc,
          [`/${key}`]: val,
        }),
        {}
      )
    )
  }

  showMenu = () => this.updateFirebase({ view: 'menu' })

  render() {
    if (this.state.game) {
      return (
        <h1>
          game started
          <button onClick={() => this.updateFirebase(this.defaultState)}>
            end game
          </button>
        </h1>
      )
    }

    return (
      <div>
        {
          <div>
            <button onClick={() => this.updateFirebase({ view: 'deck' })}>
              build deck
            </button>

            <button onClick={() => this.updateFirebase({ view: 'players' })}>
              manage players
            </button>

            <button
              disabled={
                !this.state.cards.length ||
                !this.state.players ||
                !this.state.players.length
              }
              onClick={() => this.updateFirebase({ view: 'setup' })}>
              start game
            </button>
          </div>
        }

        {this.state.view === 'menu' && (
          <div>
            <h2>Players ({(this.state.players || []).length}):</h2>
            {this.state.players &&
              this.state.players.map(player => (
                <div key={player.name}>{player.name}</div>
              ))}
            <h2>
              Deck ({this.state.cards.length} /{' '}
              {getDeckWeight(this.state.cards)}):
            </h2>
            {getRoles(this.state.cards).map(role => (
              <div key={role}>
                {role} @ {getNumberOfARole(role, this.state.cards)}
              </div>
            ))}
          </div>
        )}

        {this.state.view === 'deck' && (
          <BuildDeck
            done={this.showMenu}
            update={this.updateFirebase}
            cards={this.state.cards}
          />
        )}

        {this.state.view === 'players' && (
          <Players
            done={this.showMenu}
            update={this.updateFirebase}
            players={this.state.players}
          />
        )}

        {this.state.view === 'setup' && (
          <SetupGame
            players={this.state.players}
            cards={this.state.cards}
            done={game => this.updateFirebase({ game })}
          />
        )}
      </div>
    )
  }
}

render(<App />, document.getElementById('root'))
