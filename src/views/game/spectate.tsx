import * as React from 'react'
import * as cx from 'classnames'
import { values, uniq } from 'ramda'
import { Game } from 'interfaces/game'
import { Tabs } from 'components/tabs'
import { Button } from 'components/button'
import { updateFirebase } from 'helpers/firebase'
import { Content } from 'components/layout'
import { isNight } from 'helpers'
import { Timer } from 'components/timer'

interface Props {
  game: Game
}

export const SpectateView: React.SFC<Props> = ({ game }) => {
  if (isNight(game)) {
    return <Content className="spectate night">🌕</Content>
  }

  return (
    <Content className="spectate day">
      <Tabs navigation className="stats">
        <div>Living: {values(game.players).filter(p => p.alive).length}</div>
        <div>Dead: {values(game.players).filter(p => !p.alive).length}</div>
      </Tabs>

      <Content className="spectate-body">
        <Content>
          {/* <h1>Time Left</h1> */}
          <Timer display="numbers" timeLimit={game.options.timeLimit || 0} />
        </Content>
        <Content>
          <h1>Players</h1>
          {values(game.players)
            .filter(p => p.alive)
            .map(player => <div key={player.name}>{player.name}</div>)}
          {values(game.players)
            .filter(p => !p.alive)
            .map(player => (
              <div key={player.name} className={cx({ dead: !player.alive })}>
                {player.name}
              </div>
            ))}
        </Content>
        <Content>
          <h1>Possible Roles</h1>
          {uniq(game.initialRoles).map(role => <div key={role}>{role}</div>)}
        </Content>
      </Content>

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
