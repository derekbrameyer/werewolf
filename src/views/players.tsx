import * as React from 'react'
import { Player, defaultPlayer } from 'interfaces/game'
import { find, whereEq, remove, findIndex } from 'ramda'
import { PlayerRow } from 'components/player'
import { Tabs } from 'components/tabs'
import { Input } from 'components/input'
import { Card } from 'interfaces/cards'
import { Grid } from 'components/grid'
import { Button } from 'components/button'

// Anything we want persisted to firebase
export interface FirebaseProps {
  players: Player[]
}

interface Props extends FirebaseProps {
  done: () => void
  update: (props: FirebaseProps) => void
  cards: Card[]
}
interface State {
  playerName: string
}

export class Players extends React.Component<Props, State> {
  state: State = { playerName: '' }

  render() {
    return (
      <div>
        <Input
          id="player-name"
          value={this.state.playerName}
          label="Player name:"
          onChange={value => this.setState({ playerName: value })}
          onSubmit={value => {
            if (find(whereEq({ name: value }), this.props.players)) {
              return alert('Player already exists')
            }

            this.setState({
              playerName: '',
            })

            this.props.update({
              players: [
                ...this.props.players,
                { ...defaultPlayer, name: value },
              ],
            })
          }}
        />

        <Grid>
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
        </Grid>

        <Tabs actions>
          <Button
            confirm
            className="red"
            disabled={!this.props.players.length}
            onClick={() => {
              this.setState({ playerName: '' })
              this.props.update({ players: [] })
            }}>
            reset players
          </Button>
        </Tabs>
      </div>
    )
  }
}
