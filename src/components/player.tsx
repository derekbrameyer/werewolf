import * as React from 'react'
import * as cx from 'classnames'
import { Player } from 'interfaces/game'
import { roleIcon } from 'helpers'
import { Row, RowActions, RowImg, RowDetail, RowTitle } from 'components/row'

interface Props {
  player: Player
}

export const PlayerRow: React.SFC<Props> = ({ player, children }) => (
  <Row>
    <RowImg className={cx({ dim: !player.alive })}>
      {roleIcon(player.role)}
    </RowImg>
    <RowDetail>
      <RowTitle subtitle={player.role && `(${player.role})`}>
        <span className={cx({ grey: !player.alive })}>{player.name}</span>
      </RowTitle>
      <RowActions>{children}</RowActions>
    </RowDetail>
  </Row>
)
