import * as React from 'react'
import { values } from 'ramda'
import { Game } from 'interfaces/game'
import { Button } from 'components/button'
import { updateFirebase } from 'helpers/firebase'
import { Content } from 'components/layout'

interface Props {
  game: Game
}

const localStorageId = 'ww-dead-username'

export const ProveDead: React.SFC<Props> = ({ game }) => {
  const login = async (playerName: string) => {
    localStorage.setItem(
      localStorageId,
      JSON.stringify({ passcode: game.passcode, playerName })
    )

    updateFirebase({
      game: {
        ...game,
        loggedInDeadPlayers: {
          ...(game.loggedInDeadPlayers || {}),
          [playerName]: true,
        },
      },
    })
  }

  const eligablePlayers = values(game.players)
    .filter(player => !player.alive)
    .filter(player => !(game.loggedInDeadPlayers || {})[player.name])

  return (
    <Content className="prove-dead">
      <h1>Who are you?</h1>
      <div>Only eliminated players can do this</div>
      {eligablePlayers.map(player => (
        <Button
          confirm={`Confirm that you are ${player.name}`}
          onClick={() => login(player.name)}
          key={player.name}>
          {player.name}
        </Button>
      ))}
    </Content>
  )
}
