import * as React from 'react'
import { Player } from 'interfaces/game'
import { Card } from 'interfaces/cards'
import { getDeckWeight, getRoles, getNumberOfARole } from 'helpers'
import { Tabs } from 'components/tabs'
import { Row } from 'components/row'
import { Weight } from 'components/weight'
import { Grid } from 'components/grid'

interface Props {
  players: Player[]
  cards: Card[]
  reset: () => void
}

export const Overview: React.SFC<Props> = ({ players, cards, reset }) => (
  <div>
    <Grid>
      <div>
        <h1>Players ({players.length}):</h1>
        {players.map(player => <Row key={player.name}>{player.name}</Row>)}
      </div>

      <div>
        <h1>
          Deck ({cards.length} / <Weight weight={getDeckWeight(cards)} />):
        </h1>
        {getRoles(cards).map(role => (
          <Row key={role}>
            {role} @ {getNumberOfARole(role, cards)}
          </Row>
        ))}
      </div>
    </Grid>

    <Tabs grow>
      <button
        className="red"
        disabled={!players.length && !cards.length}
        onClick={reset}>
        reset everything
      </button>
    </Tabs>
  </div>
)
