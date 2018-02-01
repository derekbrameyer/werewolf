import * as React from 'react'
import { Player } from 'interfaces/game'
import { Card } from 'interfaces/cards'
import { getDeckWeight, getRoles, getNumberOfARole } from 'helpers'
import { Tabs } from 'components/tabs'
import { Row } from 'components/row'
import { Weight } from 'components/weight'
import { Button } from 'components/button'

interface Props {
  players: Player[]
  cards: Card[]
  reset: () => void
}

export const Overview: React.SFC<Props> = ({ players, cards, reset }) => (
  <div>
    <h1>players: {players.length}</h1>
    {players.map(player => <Row key={player.name}>{player.name}</Row>)}

    <h1>
      deck: cards: {cards.length}, weight:{' '}
      <Weight weight={getDeckWeight(cards)} />
    </h1>
    {getRoles(cards).map(role => (
      <Row key={role}>
        {role} @ {getNumberOfARole(role, cards)}
      </Row>
    ))}
    <Tabs actions>
      <Button
        confirm
        className="red"
        disabled={!players.length && !cards.length}
        onClick={reset}>
        reset everything
      </Button>
    </Tabs>
  </div>
)
