import * as React from 'react'
import { Button } from 'components/button'
import { Game, Player, performAction } from 'interfaces/game'

export const makeKill = (
  game: Game,
  player: Player,
  update: (game: Game) => void
) => {
  if (!player.alive) return null
  return (
    <Button
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

export const makeGameActionButtons = (
  game: Game,
  player: Player,
  update: (game: Game) => void
) => {
  return (
    <React.Fragment>
      {makeRevive(game, player, update)}
      {makeKill(game, player, update)}
    </React.Fragment>
  )
}
