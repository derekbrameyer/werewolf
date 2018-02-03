import * as React from 'react'
import * as cx from 'classnames'
import { Button } from 'components/button'
import { Game, performAction, Action, ActionButton } from 'interfaces/game'
import { gameHasRole } from 'helpers/index'
import { Roles, getRoleActions } from 'interfaces/roles'
import { Player } from 'interfaces/player'
import { updateFirebase } from 'helpers/firebase'

export const actionTypeToAction = (type: Action['type']): ActionButton => {
  switch (type) {
    case 'bite':
      return { type: 'bite', playerProp: 'bitten', target: '' }
    case 'bless':
      return { type: 'bless', playerProp: 'blessed', target: '' }
    case 'kill':
      return { type: 'kill', playerProp: 'alive', target: '' }
    case 'sudo kill':
      return { type: 'sudo kill', playerProp: 'alive', target: '' }
    case 'protect':
      return { type: 'protect', playerProp: 'protected', target: '' }
    case 'transform':
      return { type: 'transform', playerProp: 'role', target: '' }
  }
}

export const makeActionButton = (
  game: Game,
  player: Player,
  type: Action['type'],
  done: (game: Game) => void
) => {
  const action = actionTypeToAction(type)

  return (
    <Button
      key={type}
      className={cx({
        green:
          (type === 'protect' || type === 'bless') &&
          !!player[action.playerProp],
        red:
          (type === 'bite' || type === 'transform') &&
          !!player[action.playerProp],
      })}
      onClick={() => {
        done(performAction(game, { type, target: player.name }))
      }}>
      {type === 'sudo kill' || type === 'kill'
        ? player.alive ? type : `un-${type}`
        : player[action.playerProp] ? `un-${type}` : type}
    </Button>
  )
}

export const makeGameButtons = (game: Game, player: Player) => {
  return (
    <React.Fragment>
      <Button
        onClick={() =>
          updateFirebase({
            game: performAction(game, { type: 'kill', target: player.name }),
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
                game: performAction(game, { type, target: player.name }),
              })
            }>
            {type}
          </Button>
        ))}
    </React.Fragment>
  )
}
