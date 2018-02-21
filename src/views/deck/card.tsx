import * as React from 'react'
import * as cx from 'classnames'
import { getNumberOfARole } from 'helpers/index'
import { Weight } from 'components/weight'
import { Card, Roles } from 'interfaces/roles'

interface Props {
  id?: string
  card: Card<Roles>
  deck: Card<Roles>[]
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
          src={card.image}
        />
        {!!numberInDeck &&
          numberInDeck > 1 && <div className="count white">{numberInDeck}</div>}
      </div>
      <h2>{card.role}</h2>
      <h2>
        <Weight weight={card.weight} />
      </h2>
    </button>
  )
}
