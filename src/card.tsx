import * as React from 'react'
import { roleIcon } from 'helpers'
import { Card } from 'cards'

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
  <div className="card-row">
    <div className="card-row--icon">{roleIcon(card.role)}</div>
    <div className="card-row--info">
      <div className="card-row--name">{card.role}</div>
      <div className="card-row--count" />
      <div className="card-row--actions">{children}</div>
    </div>
  </div>
)
