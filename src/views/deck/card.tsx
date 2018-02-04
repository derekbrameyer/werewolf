import * as React from 'react'
import * as cx from 'classnames'
import { getNumberOfARole } from 'helpers/index'
import { Card, getRoleEmoji } from 'interfaces/roles'
import { Actions } from 'components/layout'
import { Weight } from 'components/weight'

interface Props {
  id?: string
  card: Card
  deck: Card[]
}

export const CardRow: React.SFC<Props> = ({ card, deck = [], children }) => {
  const numberInDeck = getNumberOfARole(card.role, deck)

  return (
    <div className="card">
      <h2 className={cx({ dim: numberInDeck === 0 })}>
        {getRoleEmoji(card.role)}
        {card.role}
      </h2>

      <h3>
        ({numberInDeck} of {card.cardCount}) * <Weight weight={card.weight} />
      </h3>

      <Actions>{children}</Actions>
    </div>
  )
}
