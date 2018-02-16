import * as React from 'react'
import * as cx from 'classnames'
import { getNumberOfARole } from 'helpers/index'
import { Card, getRoleEmoji, getRoleProfileImage } from 'interfaces/roles'
import { Actions } from 'components/layout'
import { Weight } from 'components/weight'

interface Props {
  id?: string
  card: Card
  deck: Card[]
  onRemove: () => void
  onAdd: () => void
}

export const CardRow: React.SFC<Props> = ({
  card,
  deck = [],
  children,
  onRemove,
  onAdd,
}) => {
  const numberInDeck = getNumberOfARole(card.role, deck)

  return (
    <button className="card" onDoubleClick={onRemove} onClick={onAdd}>
      <div className="profile-container">
        <img
          className={cx('role-profile', { dim: numberInDeck === 0 })}
          src={getRoleProfileImage(card.role)}
        />
        {!!numberInDeck &&
          numberInDeck > 1 && <div className="count white">{numberInDeck}</div>}
      </div>
      <h2>{card.role}</h2>
      <h2>
        <Weight weight={card.weight} />
      </h2>
      {/* <h2 className={cx({ dim: numberInDeck === 0 })}>
        {getRoleEmoji(card.role)}
        {card.role}
      </h2>

      <h3>
        ({numberInDeck} of {card.cardCount}) * <Weight weight={card.weight} />
  </h3>*/}

      {/* <Actions>{children}</Actions> */}
    </button>
  )
}
