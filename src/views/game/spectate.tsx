import * as React from 'react'
import { values } from 'ramda'
import { Game } from 'interfaces/game'
import { Tabs } from 'components/tabs'
import { Grid } from 'components/grid'
import { Button } from 'components/button'
import { updateFirebase } from 'helpers/firebase'
import { Content } from 'components/layout'
import { PlayerSetupRow } from 'components/setupPlayer'

interface Props {
  game: Game
}

export const SpectateView: React.SFC<Props> = ({ game }) => (
  <Content>
    <Tabs navigation className="stats">
      <h1>Game in progress</h1>
    </Tabs>

    <Grid>
      {values(game.players).map(player => (
        <PlayerSetupRow
          player={{ name: player.name, role: null }}
          key={player.name}
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
