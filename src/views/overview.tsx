import * as React from 'react'
import { SetupPlayer } from 'interfaces/player'
import { Roles, getCard } from 'interfaces/roles'
import { getDeckWeight, getNumberOfARole } from 'helpers/index'
import { Tabs } from 'components/tabs'
import { Content } from 'components/layout'
import { Weight } from 'components/weight'
import { Button } from 'components/button'
import { defaultFirebaseState, updateFirebase } from 'helpers/firebase'
import { uniq } from 'ramda'

interface Props {
  players: SetupPlayer[]
  roles: Roles[]
  noFlip: boolean
  timeLimit: number
  lobbyId: string
  leaveLobby: () => void
}

export const Overview: React.SFC<Props> = ({
  players,
  roles,
  noFlip,
  timeLimit,
  leaveLobby,
  lobbyId,
}) => (
  <Content>
    <h1>Lobby: {lobbyId}</h1>

    <h1>options:</h1>
    <ul>
      <li>Day time limit: {timeLimit}</li>
      <li>Flips card on death: {noFlip ? 'no flip' : 'flip'}</li>
    </ul>

    <h1>players: {players.length}</h1>
    <ul>{players.map(player => <li key={player.name}>{player.name}</li>)}</ul>

    <h1>
      deck: cards: {roles.length}, weight:{' '}
      <Weight weight={getDeckWeight(roles.map(getCard))} />
    </h1>
    <ul>
      {uniq(roles).map(role => (
        <li key={role}>
          {role} @ {getNumberOfARole(role, roles.map(getCard))}
        </li>
      ))}
    </ul>

    <Tabs actions>
      <Button confirm className="red" onClick={leaveLobby}>
        leave lobby
      </Button>
      <Button
        confirm
        className="red"
        disabled={!players.length && !roles.length}
        onClick={() => updateFirebase(defaultFirebaseState)}>
        reset everything
      </Button>
    </Tabs>
  </Content>
)
