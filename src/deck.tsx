import * as React from 'react'
import { Card, AllCards } from 'cards'
import { getDeckWeight, getNumberOfARole, getRoles } from 'helpers'
import { remove, findIndex, propEq } from 'ramda'

export interface FirebaseProps {
  cards: Card[]
}

interface Props extends FirebaseProps {
  done: () => void
  update: (props: FirebaseProps) => void
}

export class BuildDeck extends React.Component<Props> {
  renderCard = (card: Card) => (
    <div className="card" id={card.role} key={card.role}>
      <div className="card-description">
        <span className={`card-title ${card.team}`}>{card.role}</span>
        <span className="card-count">
          ({getNumberOfARole(card.role, this.props.cards)} /{card.cardCount})
        </span>
      </div>
      <div>
        <span className="card-weight">
          {getNumberOfARole(card.role, this.props.cards)} @ {card.weight} ={' '}
          {getNumberOfARole(card.role, this.props.cards) * card.weight}
        </span>
      </div>
      <div className="card-actions">
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
      </div>
    </div>
  )

  render() {
    return (
      <div>
        <div className="body">
          <section>
            <h3>negative</h3>
            {AllCards.filter(c => c.weight < 0)
              .sort((a, b) => b.weight - a.weight)
              .map(this.renderCard)}
          </section>

          <section>
            <h3>positive</h3>
            {AllCards.filter(c => c.weight >= 0)
              .sort((a, b) => a.weight - b.weight)
              .map(this.renderCard)}
          </section>

          <section>
            {!!this.props.cards.length && (
              <>
                <h3>Roles</h3>
                {getRoles(this.props.cards).map(role => (
                  <div key={role}>
                    <a href={`#${role}`}>
                      {role}: {getNumberOfARole(role, this.props.cards)}
                    </a>
                  </div>
                ))}
              </>
            )}

            <div className="deck-actions">
              <button
                className="reset"
                disabled={!this.props.cards.length}
                onClick={() => this.props.update({ cards: [] })}>
                reset
              </button>
              <button className="make-deck" onClick={() => this.props.done()}>
                done {getDeckWeight(this.props.cards)}/{this.props.cards.length}
              </button>
            </div>
          </section>
        </div>
      </div>
    )
  }
}
