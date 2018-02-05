import * as React from 'react'
import * as cx from 'classnames'
import { Player } from 'interfaces/player'
import { Actions } from 'components/layout'
import { getRoleEmoji } from 'interfaces/roles'

interface Props {
  player: Player
}

export const PlayerRow: React.SFC<Props> = ({ player, children }) => {
  return (
    <div className={cx('player', { dim: !player.alive })}>
      <h2>
        {player.role && getRoleEmoji(player.role)}
        {player.name}
      </h2>

      {player.role && <h3>{player.role}</h3>}
      {player.links && <h3>links to: {player.links.join(', ')}</h3>}
      {player.copiedBy && <h3>copied by: {player.copiedBy}</h3>}

      <Actions>{children}</Actions>
    </div>
  )
}
