import * as React from 'react'
import * as cx from 'classnames'
import { Button } from 'components/button'
import { Game, performAction } from 'interfaces/game'
import { gameHasRole } from 'helpers/index'
import { Roles, getRoleActions } from 'interfaces/roles'
import { Player } from 'interfaces/player'
import { updateFirebase } from 'helpers/firebase'
import { Actions } from 'interfaces/actions'

export const makeActionButton = (
  game: Game,
  player: Player | null,
  type: Actions,
  done: (game: Game) => void
) => {
  const action = Actions(type)
  const playerProp = 'playerProp' in action ? action.playerProp : null
  const attr = playerProp && player && player[playerProp]

  return (
    <Button
      key={type}
      className={cx({
        green: (type === 'protect' || type === 'bless') && !!attr,
        red: (type === 'bite' || type === 'transform') && !!attr,
      })}
      onClick={() => {
        done(
          performAction(
            game,
            player
              ? { type, target: player.name, playerProp: 'name' }
              : { type, target: null }
          )
        )
      }}>
      {type === 'kill'
        ? player && player.alive ? 'kill' : `revive`
        : type === 'sudo kill' || type === 'bypass protection'
          ? type
          : type === 'transform' ? type : attr ? `un-${type}` : type}
    </Button>
  )
}

export const makeGameButtons = (game: Game, player: Player) => {
  return (
    <React.Fragment>
      <Button
        onClick={() =>
          updateFirebase({
            game: performAction(game, {
              type: 'kill',
              target: player.name,
              playerProp: 'name',
            }),
          })
        }>
        {player.alive ? 'kill' : 'revive'}
      </Button>

      {player.alive &&
        gameHasRole(game, Roles.bodyguard) &&
        makeActionButton(game, player, 'protect', game =>
          updateFirebase({ game })
        )}
      {player.alive &&
        gameHasRole(game, Roles.vampire) &&
        makeActionButton(game, player, 'bite', game =>
          updateFirebase({ game })
        )}
      {player.alive &&
        gameHasRole(game, Roles.priest) &&
        makeActionButton(game, player, 'bless', game =>
          updateFirebase({ game })
        )}

      {player.alive &&
        getRoleActions(player.role).map(type => (
          <Button
            key={type}
            onClick={() =>
              updateFirebase({
                game: performAction(game, {
                  type,
                  target: player.name,
                  playerProp: 'name',
                }),
              })
            }>
            {type}
          </Button>
        ))}
    </React.Fragment>
  )
}
