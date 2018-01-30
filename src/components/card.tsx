import * as React from 'react'
import * as cx from 'classnames'
import { getNumberOfARole } from 'helpers'
import { Card, getCardEmoji } from 'interfaces/cards'
import { Row, RowActions, RowImg, RowDetail, RowTitle } from 'components/row'
import { Weight } from 'components/weight'

interface Props {
  id?: string
  card: Card
  deck: Card[]
}

export const CardRow: React.SFC<Props> = ({ card, deck = [], children }) => {
  const numberInDeck = getNumberOfARole(card.role, deck)

  return (
    <Row>
      <RowImg className={cx({ dim: numberInDeck === 0 })}>
        {getCardEmoji(card.role)}
      </RowImg>
      <RowDetail>
        <RowTitle
          subtitle={
            <React.Fragment>
              ({numberInDeck} of {card.cardCount}) *{' '}
              <Weight weight={card.weight} />
            </React.Fragment>
          }>
          <span className={cx({ grey: numberInDeck === 0 })}>{card.role}</span>
        </RowTitle>
        <RowActions>{children}</RowActions>
      </RowDetail>
    </Row>
  )
}
