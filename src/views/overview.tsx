import * as React from 'react'
import { Player } from 'interfaces/player'
import { Card } from 'interfaces/roles'
import { getDeckWeight, getRoles, getNumberOfARole } from 'helpers/index'
import { Tabs } from 'components/tabs'
import { Content } from 'components/layout'
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
    <ul>{players.map(player => <li key={player.name}>{player.name}</li>)}</ul>

    <h1>
      deck: cards: {cards.length}, weight:{' '}
      <Weight weight={getDeckWeight(cards)} />
    </h1>
    <ul>
      {getRoles(cards).map(role => (
        <li key={role}>
          {role} @ {getNumberOfARole(role, cards)}
        </li>
      ))}
    </ul>

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
