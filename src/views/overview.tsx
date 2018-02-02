import * as React from 'react'
import { Player } from 'interfaces/player'
import { Card } from 'interfaces/roles'
import { getDeckWeight, getRoles, getNumberOfARole } from 'helpers/index'
import { Tabs } from 'components/tabs'
import { Row, Content } from 'components/layout'
import { Weight } from 'components/weight'
import { Button } from 'components/button'
import { defaultFirebaseState, updateFirebase } from 'helpers/firebase'

interface Props {
  players: Player[]
  cards: Card[]
}

export const Overview: React.SFC<Props> = ({ players, cards }) => (
  <Content>
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
        onClick={() => updateFirebase(defaultFirebaseState)}>
        reset everything
      </Button>
    </Tabs>
  </Content>
)
