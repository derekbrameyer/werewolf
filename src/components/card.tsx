import * as React from 'react'
import * as cx from 'classnames'
import { getNumberOfARole } from 'helpers'
import { Card, getRoleEmoji } from 'interfaces/cards'
import {
  Row,
  RowActions,
  RowImg,
  RowDetail,
  RowTitle,
  RowSbuTitle,
} from 'components/row'
import { Weight } from 'components/weight'

interface Props {
  id?: string
  card: Card
  deck: Card[]
}

export const CardRow: React.SFC<Props> = ({ card, deck = [], children }) => {
  const numberInDeck = getNumberOfARole(card.role, deck)

  return (
    <Row className="card-row">
      <RowImg className={cx({ dim: numberInDeck === 0 })}>
        {getRoleEmoji(card.role)}
      </RowImg>
      <RowDetail>
        <RowTitle className={cx({ dim: numberInDeck === 0 })}>
          {card.role}
        </RowTitle>
        <RowSbuTitle>
          ({numberInDeck} of {card.cardCount}) * <Weight weight={card.weight} />
        </RowSbuTitle>
        <RowActions>{children}</RowActions>
      </RowDetail>
    </Row>
  )
}
