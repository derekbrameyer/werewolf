import * as React from 'react'
import { Player } from 'game'
import { find, whereEq, remove, findIndex } from 'ramda'
import { PlayerRow } from 'player'

// Anything we want persisted to firebase
export interface FirebaseProps {
  players: Player[]
}

interface Props extends FirebaseProps {
  done: () => void
  update: (props: FirebaseProps) => void
}
interface State {
  playerName: string
}

export class Players extends React.Component<Props, State> {
  state: State = { playerName: '' }

  render() {
    return (
      <div>
        <div className="player-form">
          <label htmlFor="player-name">Player name:</label>
          <input
            id="player-name"
            value={this.state.playerName}
            onChange={e => this.setState({ playerName: e.target.value })}
            onKeyPress={e => {
              if (e.key !== 'Enter') return
              e.preventDefault()

              if (
                find(
                  whereEq({ name: this.state.playerName }),
                  this.props.players
                )
              ) {
                return alert('Player already exists')
              }

              this.setState({
                playerName: '',
              })

              this.props.update({
                players: [
                  ...this.props.players,
                  { alive: true, name: this.state.playerName },
                ],
              })
            }}
          />
          <button
            onClick={() => {
              this.setState({ playerName: '' })
              this.props.update({ players: [] })
            }}>
            reset
          </button>
        </div>

        <div className="player-list">
          {!!this.props.players.length && (
            <div className="player-count">
              {this.props.players.length} players
            </div>
          )}
          {this.props.players.map(player => (
            <PlayerRow player={player} key={player.name}>
              <button
                onClick={() => {
                  this.props.update({
                    players: remove(
                      findIndex(
                        whereEq({ name: player.name }),
                        this.props.players
                      ),
                      1,
                      this.props.players
                    ),
                  })
                }}>
                remove
              </button>
            </PlayerRow>
          ))}
        </div>

        <div className="actions">
          <button className="done" onClick={() => this.props.done()}>
            done
          </button>
        </div>
      </div>
    )
  }
}
