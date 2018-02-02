import * as React from 'react'
import * as cx from 'classnames'
import { Button } from 'components/button'
import { Game, performAction } from 'interfaces/game'
import { gameHasRole, updatePlayer } from 'helpers/index'
import { Roles } from 'interfaces/roles'
import { Player } from 'interfaces/player'

export const makeKill = (
  game: Game,
  player: Player,
  update: (game: Game) => void
) => {
  if (!player.alive) return null
  return (
    <Button
      disabled={player.protected}
      onClick={() =>
        update(performAction(game, { type: 'kill', target: player.name }))
      }>
      kill
    </Button>
  )
}

export const makeRevive = (
  game: Game,
  player: Player,
  update: (game: Game) => void
) => {
  if (player.alive) return null
  return (
    <Button
      onClick={() =>
        update(performAction(game, { type: 'revive', target: player.name }))
      }>
      revive
    </Button>
  )
}

export const makeProtect = (
  game: Game,
  player: Player,
  update: (game: Game) => void
) => {
  if (!gameHasRole(game, Roles.bodyguard)) return null

  return (
    <Button
      className={cx({ green: player.protected })}
      onClick={() =>
        update(performAction(game, { type: 'protect', target: player.name }))
      }>
      {player.protected ? 'un-protect' : 'protect'}
    </Button>
  )
}

export const toggleCursed = (
  game: Game,
  player: Player,
  update: (game: Game) => void
) => {
  if (player.role !== Roles.cursed) return null

  return (
    <Button
      onClick={() =>
        update(updatePlayer(game, player.name, { role: Roles.werewolf }))
      }>
      make wolf
    </Button>
  )
}

export const makeGameActionButtons = (
  game: Game,
  player: Player,
  update: (game: Game) => void
) => {
  return (
    <React.Fragment>
      {makeRevive(game, player, update)}
      {player.alive && makeKill(game, player, update)}
      {player.alive && makeProtect(game, player, update)}
      {player.alive && toggleCursed(game, player, update)}
    </React.Fragment>
  )
}
