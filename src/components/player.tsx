import * as React from 'react'
import { Player } from 'interfaces/game'
import { roleIcon } from 'helpers'
import { Row, RowActions, RowImg, RowDetail, RowTitle } from 'components/row'

interface Props {
  player: Player
}

export const PlayerRow: React.SFC<Props> = ({ player, children }) => (
  <Row>
    <RowImg>{roleIcon(player.role)}</RowImg>
    <RowDetail>
      <RowTitle subtitle={player.role && `(${player.role})`}>
        {player.name}
      </RowTitle>
      <RowActions>{children}</RowActions>
    </RowDetail>
  </Row>
)
