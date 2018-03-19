import * as React from 'react'
import * as cx from 'classnames'
import { values, uniq, toPairs, map, filter } from 'ramda'
import { Game } from 'interfaces/game'
import { Tabs } from 'components/tabs'
import { Button } from 'components/button'
import { updateFirebase } from 'helpers/firebase'
import { Content } from 'components/layout'
import { isNight, getNumberOfARole } from 'helpers'
import { Timer } from 'components/timer'
import { Input } from 'components/input'

interface Props {
  game: Game
  leaveLobby: () => void
  moderate: (passcode: string) => void
}

export const Overview: React.SFC<Props> = ({ game, leaveLobby, moderate }) => {
  if (isNight(game)) {
    return (
      <div className="spectate night">
        {values(game.players)
          .sort()
          .map(player => (
            <div
              key={player.name}
              className={cx('player', {
                active: game.activePlayer === player.name,
              })}>
              {player.name}
            </div>
          ))}
      </div>
    )
  }

  return (
    <Content className="spectate day">
      <Content className="spectate-body">
        <Content>
          <Timer display="numbers" timeLimit={game.options.timeLimit || 0} />
          <div className="timer">
            {
              // lol
              (toPairs<string, number>(
                filter(
                  arr => !!arr,
                  map(
                    arr => (arr ? Object.keys(arr).length : 0),
                    game.ghost || {}
                  )
                )
              ).sort((a, b) => b[1] - a[1])[0] || [])[0]
            }
          </div>
        </Content>
        <Content>
          <h1>Players</h1>
          {values(game.players)
            .filter(p => p.alive)
            .map(player => {
              const role =
                !game.options.noFlip && !player.alive && `: ${player.role}`
              return (
                <div key={player.name}>
                  {player.name}
                  {role}
                </div>
              )
            })}
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
          {uniq(game.initialRoles).map(role => {
            const numRole = getNumberOfARole(role, game.initialRoles)

            return (
              <div key={role}>
                {role}
                {numRole > 1 && `: ${numRole}`}
              </div>
            )
          })}
        </Content>
      </Content>

      <Input
        label="moderate:"
        id="moderate"
        onSubmit={e => moderate(e.target.value)}
        placeholder="passcode"
      />

      <Tabs actions>
        <Button confirm className="red" onClick={leaveLobby}>
          leave lobby
        </Button>

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
