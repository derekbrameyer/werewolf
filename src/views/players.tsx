import * as React from 'react'
import { Player, defaultPlayer } from 'interfaces/player'
import { find, whereEq, remove, findIndex } from 'ramda'
import { PlayerRow } from 'components/player'
import { Tabs } from 'components/tabs'
import { Input } from 'components/input'
import { Card } from 'interfaces/roles'
import { Grid } from 'components/grid'
import { Button } from 'components/button'
import { updateFirebase } from 'helpers/firebase'
import { Content } from 'components/layout'
import { comparePlayersName } from 'helpers'

interface Props {
  players: Player[]
  cards: Card[]
}
interface State {
  playerName: string
}

export class Players extends React.Component<Props, State> {
  state: State = { playerName: '' }

  render() {
    return (
      <Content>
        <Input
          id="player-name"
          value={this.state.playerName}
          label="Player name:"
          onChange={e => this.setState({ playerName: e.target.value })}
          onSubmit={e => {
            if (find(whereEq({ name: e.target.value }), this.props.players)) {
              return alert('Player already exists')
            }

            this.setState({
              playerName: '',
            })

            updateFirebase({
              players: [
                ...this.props.players,
                { ...defaultPlayer, name: e.target.value },
              ],
            })
          }}
        />

        <Grid>
          {this.props.players.sort(comparePlayersName).map(player => (
            <PlayerRow player={player} key={player.name}>
              <button
                onClick={() => {
                  updateFirebase({
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
              updateFirebase({ players: [] })
            }}>
            reset players
          </Button>
        </Tabs>
      </Content>
    )
  }
}
