import * as React from 'react'
import * as cx from 'classnames'
import { Player } from 'interfaces/player'
import {
  Row,
  RowActions,
  RowImg,
  RowDetail,
  RowTitle,
  RowSbuTitle,
} from 'components/layout'
import { getRoleEmoji } from 'interfaces/roles'

interface Props {
  player: Player
}

export const PlayerRow: React.SFC<Props> = ({ player, children }) => {
  return (
    <Row className="player-row">
      <RowImg className={cx({ dim: !player.alive })}>
        {getRoleEmoji(player.role)}
      </RowImg>
      <RowDetail>
        <RowTitle>
          <span className={cx({ grey: !player.alive })}>{player.name}</span>
          {player.role && <RowSbuTitle>{player.role}</RowSbuTitle>}
          {player.links && (
            <RowSbuTitle>links to: {player.links.join(', ')}</RowSbuTitle>
          )}
          {player.copiedBy && (
            <RowSbuTitle>doppleganged by: {player.copiedBy}</RowSbuTitle>
          )}
        </RowTitle>
        <RowActions>{children}</RowActions>
      </RowDetail>
    </Row>
  )
}
