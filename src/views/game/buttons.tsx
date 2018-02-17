import * as React from 'react'
import * as cx from 'classnames'
import { Button } from 'components/button'
import { Game, performAction } from 'interfaces/game'
import { gameHasRole, updatePlayer } from 'helpers/index'
import { Roles, getRoleActions, AllRoles, getRoleImage } from 'interfaces/roles'
import { Player } from 'interfaces/player'
import { updateFirebase } from 'helpers/firebase'
import { Actions } from 'interfaces/actions'
import { Grid } from 'components/grid'

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
        red:
          (type === 'bite' ||
            type === 'transform' ||
            type === 'indoctrinate') &&
          !!attr,
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

class ChangeRoleButton extends React.Component<
  { game: Game; player: Player | null; done: (game: Game) => void },
  { open: boolean }
> {
  state = { open: false }

  render() {
    const { game, done, player } = this.props
    if (!player) return null

    return (
      <React.Fragment>
        <Button onClick={() => this.setState({ open: !this.state.open })}>
          {this.state.open ? 'hide roles' : 'change role'}
        </Button>
        {this.state.open && (
          <Grid>
            {AllRoles.sort().map(
              role =>
                role === player.role ? null : (
                  <Button
                    key={role}
                    onClick={() =>
                      done({
                        ...game,
                        ...updatePlayer(game, player.name, {
                          role: role as Roles,
                        }),
                        activePlayer: null,
                      })
                    }>
                    <img
                      className="role-profile"
                      src={getRoleImage(role as Roles)}
                    />
                    {role}
                  </Button>
                )
            )}
          </Grid>
        )}
      </React.Fragment>
    )
  }
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
        gameHasRole(game, Roles['cult leader']) &&
        makeActionButton(game, player, 'indoctrinate', game =>
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

      {player.alive && (
        <ChangeRoleButton
          game={game}
          player={player}
          done={game => updateFirebase({ game })}
        />
      )}
    </React.Fragment>
  )
}
