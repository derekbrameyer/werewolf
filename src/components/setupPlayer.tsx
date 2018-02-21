import * as React from 'react'
import { SetupPlayer } from 'interfaces/player'
import { getCard } from 'interfaces/roles'

interface Props {
  player: SetupPlayer
  onClick?: () => void
}

export const PlayerSetupRow: React.SFC<Props> = ({
  player,
  children,
  onClick,
}) => (
  <button onClick={onClick} className="player">
    <img
      className="role-profile"
      src={
        player.role
          ? getCard(player.role).image
          : require('../assets/unknown.png')
      }
    />
    <h2>{player.name}</h2>
  </button>
)
