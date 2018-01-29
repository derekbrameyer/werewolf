import * as React from 'react'
import { Player } from 'interfaces/game'
import { Card } from 'interfaces/cards'
import { getDeckWeight, getRoles, getNumberOfARole } from 'helpers'
import { Tabs } from 'components/tabs'

interface Props {
  players: Player[]
  cards: Card[]
  reset: () => void
}

export const Overview: React.SFC<Props> = ({ players, cards, reset }) => (
  <div>
    <h1>Players ({players.length}):</h1>
    {players.map(player => <div key={player.name}>{player.name}</div>)}
    <h1>
      Deck ({cards.length} / {getDeckWeight(cards)}):
    </h1>
    {getRoles(cards).map(role => (
      <div key={role}>
        {role} @ {getNumberOfARole(role, cards)}
      </div>
    ))}

    <Tabs center>
      <button disabled={!players.length && !cards.length} onClick={reset}>
        reset
      </button>
    </Tabs>
  </div>
)
