import * as React from 'react'
import { values } from 'ramda'
import { Game } from 'interfaces/game'
import { Tabs } from 'components/tabs'
import { PlayerRow } from 'components/player'
import { Grid } from 'components/grid'
import { Button } from 'components/button'
import { updateFirebase } from 'helpers/firebase'
import { Content } from 'components/layout'

interface Props {
  game: Game
}

export class SpectateView extends React.Component<Props> {
  render() {
    return (
      <Content>
        <Tabs navigation className="stats">
          <h1>Game in progress</h1>
        </Tabs>

        <Grid>
          {values(this.props.game.players).map(player => (
            <PlayerRow
              player={{ ...player, role: null }}
              key={player.name}
              isActive={false}
            />
          ))}
        </Grid>

        <Tabs actions>
          <Button
            confirm
            className="red"
            onClick={() => updateFirebase({ game: null })}>
            end game
          </Button>
        </Tabs>
      </Content>
    )
  }
}
