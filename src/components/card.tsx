import * as React from 'react'
import { roleIcon } from 'helpers'
import { Card } from 'interfaces/cards'
import { Row, RowActions, RowImg, RowDetail, RowTitle } from 'components/row'

interface Props {
  id?: string
  card: Card
  deck?: Card[]
}

// Options for what view its in
// How many are in deck
// How many possible
// Weight
// Maybe math for
export const CardRow: React.SFC<Props> = ({ card, deck = [], children }) => (
  <Row>
    <RowImg>{roleIcon(card.role)}</RowImg>
    <RowDetail>
      <RowTitle>{card.role}</RowTitle>
      <RowActions>{children}</RowActions>
    </RowDetail>
  </Row>
)
