import * as React from 'react'
import * as cx from 'classnames'
import { roleIcon, getNumberOfARole } from 'helpers'
import { Card } from 'interfaces/cards'
import { Row, RowActions, RowImg, RowDetail, RowTitle } from 'components/row'
import { Weight } from 'components/weight'

interface Props {
  id?: string
  card: Card
  deck: Card[]
}

export const CardRow: React.SFC<Props> = ({ card, deck = [], children }) => (
  <Row>
    <RowImg>{roleIcon(card.role)}</RowImg>
    <RowDetail>
      <RowTitle
        subtitle={
          <React.Fragment>
            ({getNumberOfARole(card.role, deck)} of {card.cardCount}) *{' '}
            <Weight weight={card.weight} />
          </React.Fragment>
        }>
        <span className={cx({ grey: !getNumberOfARole(card.role, deck) })}>
          {card.role}
        </span>
      </RowTitle>
      <RowActions>{children}</RowActions>
    </RowDetail>
  </Row>
)
