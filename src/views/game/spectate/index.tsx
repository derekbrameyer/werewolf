import * as React from 'react'
import * as cx from 'classnames'
import { values } from 'ramda'
import { Game } from 'interfaces/game'
import { Tabs } from 'components/tabs'
import { Button } from 'components/button'
import { Content } from 'components/layout'
import { Overview } from 'views/game/spectate/observe'
import { Chat } from 'views/game/spectate/chat'
import { ProveDead } from './proveDead'
import { Ghost } from 'views/game/spectate/ghost'
import { isNight } from 'helpers'

interface Props {
  game: Game
  leaveLobby: () => void
  moderate: (passcode: string) => void
}

interface State {
  view: 'ghost' | 'chat' | 'overview'
}

const localStorageId = 'ww-dead-username'

export class Spectate extends React.Component<Props, State> {
  state: State = { view: 'overview' }
  render() {
    const { game } = this.props

    const loggedInDeadPlayers = game.loggedInDeadPlayers || {}
    const { playerName, passcode } = JSON.parse(
      localStorage.getItem(localStorageId) || '{}'
    )
    const isUserLoggedIn = loggedInDeadPlayers[playerName]
    const isCorrectGame = passcode === game.passcode

    return (
      <Content className="spectate day">
        <Tabs navigation className="stats">
          <div>Living: {values(game.players).filter(p => p.alive).length}</div>
          <div>Dead: {values(game.players).filter(p => !p.alive).length}</div>
          <Button
            className="spectate-tab-button"
            onClick={() => this.setState({ view: 'overview' })}>
            👀
            <h3>overview</h3>
          </Button>
          {game.options.ghost && (
            <Button
              className="spectate-tab-button"
              onClick={() => this.setState({ view: 'ghost' })}>
              👻
              <h3 className={cx({ red: isNight(game) })}>ghost</h3>
            </Button>
          )}
          <Button
            className="spectate-tab-button"
            onClick={() => this.setState({ view: 'chat' })}>
            🙊
            <h3>chat</h3>
          </Button>
        </Tabs>

        {this.state.view === 'overview' && (
          <Overview
            moderate={this.props.moderate}
            leaveLobby={this.props.leaveLobby}
            game={this.props.game}
          />
        )}

        {this.state.view !== 'overview' &&
          (!isUserLoggedIn || !isCorrectGame ? (
            <ProveDead game={game} />
          ) : this.state.view === 'chat' ? (
            <Chat game={this.props.game} playerName={playerName} />
          ) : this.state.view === 'ghost' ? (
            <Ghost game={this.props.game} />
          ) : null)}
      </Content>
    )
  }
}
