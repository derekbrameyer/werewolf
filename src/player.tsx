import * as React from 'react'
import { Player } from 'game'
import { roleIcon } from 'helpers'

interface Props {
  player: Player
}

export const PlayerRow: React.SFC<Props> = ({ player, children }) => (
  <div className="cad">
    <div className="player-row--icon">{roleIcon(player.role)}</div>
    <div className="player-row--info">
      <div className="player-row--name">{player.name}</div>
      <div className="player-row--actions">{children}</div>
    </div>
  </div>
)
