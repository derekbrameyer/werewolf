import * as React from 'react'
import { Card, AllCards } from 'interfaces/cards'
import { getNumberOfARole, getRoles } from 'helpers'
import { remove, findIndex, propEq } from 'ramda'
import { CardRow } from 'components/card'
import { Tabs } from 'components/tabs'

export interface FirebaseProps {
  cards: Card[]
}

interface Props extends FirebaseProps {
  done: () => void
  update: (props: FirebaseProps) => void
}

export class BuildDeck extends React.Component<Props> {
  renderCard = (card: Card) => (
    <CardRow card={card} id={card.role} key={card.role}>
      <button
        onClick={() =>
          this.props.update({
            cards: remove(
              findIndex(propEq('role', card.role), this.props.cards),
              1,
              this.props.cards
            ),
          })
        }
        disabled={!getNumberOfARole(card.role, this.props.cards)}>
        remove
      </button>
      <button
        onClick={() =>
          this.props.update({
            cards: this.props.cards.concat(card),
          })
        }
        disabled={
          !(card.cardCount - getNumberOfARole(card.role, this.props.cards))
        }>
        add
      </button>
    </CardRow>
  )

  render() {
    return (
      <div>
        <div className="body">
          <section>
            <h1>negative</h1>
            {AllCards.filter(c => c.weight < 0)
              .sort((a, b) => b.weight - a.weight)
              .map(this.renderCard)}
          </section>

          <section>
            <h1>positive</h1>
            {AllCards.filter(c => c.weight >= 0)
              .sort((a, b) => a.weight - b.weight)
              .map(this.renderCard)}
          </section>

          <section>
            {!!this.props.cards.length && (
              <>
                <h1>Roles</h1>
                {getRoles(this.props.cards).map(role => (
                  <div key={role}>
                    <a href={`#${role}`}>
                      {role}: {getNumberOfARole(role, this.props.cards)}
                    </a>
                  </div>
                ))}
              </>
            )}
          </section>
        </div>

        <Tabs center>
          <button
            className="reset"
            disabled={!this.props.cards.length}
            onClick={() => this.props.update({ cards: [] })}>
            reset
          </button>
        </Tabs>
      </div>
    )
  }
}
