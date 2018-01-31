import * as React from 'react'
import * as cx from 'classnames'
import { Player } from 'interfaces/game'
import { Row, RowActions, RowImg, RowDetail, RowTitle } from 'components/row'
import { getRoleEmoji } from 'interfaces/cards'

interface Props {
  player: Player
}

export const PlayerRow: React.SFC<Props> = ({ player, children }) => {
  let subtitle: string = ''
  if (player.role) subtitle += `(${player.role}) `
  if (player.links) subtitle += ` (links to: ${player.links.join(', ')})`
  if (player.copiedBy) subtitle += ` (doppleganged by: ${player.copiedBy})`

  return (
    <Row className="player-row">
      <RowImg className={cx({ dim: !player.alive })}>
        {getRoleEmoji(player.role)}
      </RowImg>
      <RowDetail>
        <RowTitle subtitle={subtitle}>
          <span className={cx({ grey: !player.alive })}>{player.name}</span>
        </RowTitle>
        <RowActions>{children}</RowActions>
      </RowDetail>
    </Row>
  )
}
