import * as React from 'react'
import { Player } from '../src/game'
import { find, whereEq, remove, findIndex } from 'ramda'

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

  addPlayer = () => {
    if (find(whereEq({ name: this.state.playerName }), this.props.players)) {
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
  }

  removePlayer = (name: string) => {}

  render() {
    return (
      <div>
        <div className="player-form">
          <label htmlFor="player-name">Player name:</label>
          <input
            id="player-name"
            value={this.state.playerName}
            onChange={e => this.setState({ playerName: e.target.value })}
            onKeyPress={e => e.key === 'Enter' && this.addPlayer()}
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
            <div key={player.name}>
              {player.name}{' '}
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
            </div>
          ))}
        </div>

        <div className="actions">
          <button className="done" onClick={() => this.props.done()}>
            done
          </button>
        </div>

        <style jsx>{`
          .player-form {
            display: flex;
            width: 100%;
            white-space: nowrap;
            padding: 15px;
          }

          .player-count {
            text-align: center;
            margin-bottom: 15px;
          }

          .player-list {
            padding: 15px;
          }

          .player-form input {
            margin: 0 15px;
            width: 100%;
          }

          .done {
            border: none;
            border-top: 1px solid black;
            border-bottom: 1px solid black;
            padding: 15px;
            width: 100%;
          }
        `}</style>
      </div>
    )
  }
}
