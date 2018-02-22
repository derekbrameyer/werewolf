import * as React from 'react'
import * as cx from 'classnames'

import { Players } from 'views/players'
import { BuildDeck } from 'views/deck'
import { SetupGame } from 'views/setup'
import { getDeckWeight } from 'helpers/index'
import { Tabs } from 'components/tabs'
import { Overview } from 'views/overview'
import { Weight } from 'components/weight'
import { GameView } from 'views/game'
import { FirebaseState, defaultFirebaseState, database } from 'helpers/firebase'
import { Options } from 'views/options'
import { SpectateView } from 'views/game/spectate'
import { getCard } from 'interfaces/roles'

interface Props {}

interface State extends FirebaseState {
  view: 'menu' | 'deck' | 'players' | 'setup' | 'options'
}

export class App extends React.Component<Props, State> {
  state: State = {
    ...JSON.parse(
      localStorage.getItem('wt-werewolf') ||
        JSON.stringify(defaultFirebaseState)
    ),
    view: 'menu',
  }

  componentWillMount() {
    database.ref('/').on('value', snapshot => {
      this.setState(
        snapshot ? { ...defaultFirebaseState, ...snapshot.val() } : {}
      )
    })
  }

  render() {
    if (
      this.state.game &&
      localStorage.getItem('ww-passcode') === this.state.game.passcode
    ) {
      return <GameView game={this.state.game} />
    }

    if (this.state.game) {
      return <SpectateView game={this.state.game} />
    }

    return (
      <div>
        <Tabs navigation>
          <button
            className={cx({ active: this.state.view === 'menu' })}
            onClick={() => this.setState({ view: 'menu' })}>
            overview
          </button>

          <button
            className={cx({ active: this.state.view === 'deck' })}
            onClick={() => this.setState({ view: 'deck' })}>
            build deck
            <h3>
              cards: {this.state.roles.length}, balance:{' '}
              <Weight weight={getDeckWeight(this.state.roles.map(getCard))} />
            </h3>
          </button>

          <button
            className={cx({ active: this.state.view === 'players' })}
            onClick={() => this.setState({ view: 'players' })}>
            manage players <h3>players: {this.state.players.length}</h3>
          </button>

          <button
            className={cx({ active: this.state.view === 'options' })}
            onClick={() => this.setState({ view: 'options' })}>
            game options
          </button>

          <button
            className={cx({ active: this.state.view === 'setup' })}
            disabled={
              !this.state.roles.length ||
              !this.state.players ||
              !this.state.players.length
            }
            onClick={() => this.setState({ view: 'setup' })}>
            start game
          </button>
        </Tabs>

        {this.state.view === 'menu' && (
          <Overview
            roles={this.state.roles}
            players={this.state.players}
            noFlip={this.state.noFlip}
            timeLimit={this.state.timeLimit}
          />
        )}

        {this.state.view === 'deck' && (
          <BuildDeck
            cards={this.state.roles.map(getCard)}
            players={this.state.players}
            previousDecks={this.state.previousDecks}
          />
        )}

        {this.state.view === 'players' && (
          <Players
            cards={this.state.roles.map(getCard)}
            players={this.state.players}
          />
        )}

        {this.state.view === 'options' && (
          <Options
            timeLimit={this.state.timeLimit}
            noFlip={this.state.noFlip}
          />
        )}

        {this.state.view === 'setup' && (
          <SetupGame
            roles={this.state.roles}
            players={this.state.players}
            noFlip={this.state.noFlip}
            timeLimit={this.state.timeLimit}
            previousDecks={this.state.previousDecks}
          />
        )}
      </div>
    )
  }
}
