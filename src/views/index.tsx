import * as React from 'react'
import * as cx from 'classnames'
import { toPairs } from 'ramda'

import { Players, FirebaseProps as PlayersProps } from 'views/players'
import { BuildDeck, FirebaseProps as DeckProps } from 'views/deck'
import { SetupGame } from 'views/setupgame'
import { Game } from 'interfaces/game'
import { getDeckWeight } from 'helpers'
import { Tabs } from 'components/tabs'
import { Overview } from 'views/overview'
import { Weight } from 'components/weight'
import { GameView } from 'views/game'

interface Props {
  database: firebase.database.Database
}

interface FirebaseState extends PlayersProps, DeckProps {
  game: Game | null
}
interface State extends FirebaseState {
  view: 'menu' | 'deck' | 'players' | 'setup'
}

export class App extends React.Component<Props, State> {
  defaultFirebaseState: FirebaseState = {
    cards: [],
    players: [],
    game: null,
  }
  state: State = { ...this.defaultFirebaseState, view: 'menu' }

  componentWillMount() {
    this.props.database.ref('/').on('value', snapshot => {
      this.setState(
        snapshot ? { ...this.defaultFirebaseState, ...snapshot.val() } : {}
      )
    })
  }

  updateFirebase = <T extends Partial<FirebaseState>>(props: T) => {
    this.props.database.ref().update(
      toPairs<string, any>(props).reduce(
        (acc, [key, val]) => ({
          ...acc,
          [`/${key}`]: val,
        }),
        {}
      )
    )
  }

  showMenu = () => this.setState({ view: 'menu' })

  render() {
    if (this.state.game) {
      return (
        <GameView
          game={this.state.game}
          endGame={() => this.updateFirebase({ game: null })}
          update={this.updateFirebase}
        />
      )
    }

    return (
      <div>
        <Tabs grow>
          <button
            className={cx({ active: this.state.view === 'menu' })}
            onClick={() => this.setState({ view: 'menu' })}>
            overview
          </button>

          <button
            className={cx({ active: this.state.view === 'deck' })}
            onClick={() => this.setState({ view: 'deck' })}>
            build deck ({this.state.cards.length} /{' '}
            <Weight weight={getDeckWeight(this.state.cards)} />)
          </button>

          <button
            className={cx({ active: this.state.view === 'players' })}
            onClick={() => this.setState({ view: 'players' })}>
            manage players ({this.state.players.length})
          </button>

          <button
            className={cx({ active: this.state.view === 'setup' })}
            disabled={
              !this.state.cards.length ||
              !this.state.players ||
              !this.state.players.length
            }
            onClick={() => this.setState({ view: 'setup' })}>
            start game
          </button>
        </Tabs>

        {this.state.view === 'menu' && (
          <Overview
            players={this.state.players}
            cards={this.state.cards}
            reset={() => this.updateFirebase(this.defaultFirebaseState)}
          />
        )}

        {this.state.view === 'deck' && (
          <BuildDeck
            done={this.showMenu}
            update={this.updateFirebase}
            cards={this.state.cards}
            players={this.state.players}
          />
        )}

        {this.state.view === 'players' && (
          <Players
            done={this.showMenu}
            update={this.updateFirebase}
            players={this.state.players}
            cards={this.state.cards}
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
