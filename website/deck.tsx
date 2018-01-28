import * as React from 'react'
import { Card, AllCards } from '../src/cards'
import {
  getDeckWeight,
  getNumberOfARoleInDeck,
  getDeckRoles,
} from '../src/index'
import { remove } from 'ramda'

export interface FirebaseProps {
  cards: Card[]
  targetDeckSize: number
}

interface Props extends FirebaseProps {
  done: () => void
  update: (props: FirebaseProps) => void
}

export class BuildDeck extends React.Component<Props> {
  renderDeckSize = () => (
    <div className="deck-size">
      <label htmlFor="deck-size-input">Deck Size: </label>
      <input
        id="deck-size-input"
        type="tel"
        value={this.props.targetDeckSize}
        onChange={e =>
          this.props.update({
            targetDeckSize: parseInt(e.target.value || '0', 10),
            cards: this.props.cards,
          })
        }
      />
    </div>
  )

  renderCard = (card: Card) => (
    <div className="card" id={card.role} key={card.role}>
      <div className="card-description">
        <span className={`card-title ${card.team}`}>{card.role}</span>
        <span className="card-count">
          ({getNumberOfARoleInDeck(card.role, this.props.cards)} /{
            card.cardCount
          })
        </span>
      </div>
      <div>
        <span className="card-weight">
          {getNumberOfARoleInDeck(card.role, this.props.cards)} @ {card.weight}{' '}
          = {getNumberOfARoleInDeck(card.role, this.props.cards) * card.weight}
        </span>
      </div>
      <div className="card-actions">
        <button
          onClick={() =>
            this.props.update({
              targetDeckSize: this.props.targetDeckSize,
              cards: remove(
                this.props.cards.indexOf(card),
                1,
                this.props.cards
              ),
            })
          }
          disabled={!getNumberOfARoleInDeck(card.role, this.props.cards)}>
          remove
        </button>
        <button
          onClick={() =>
            this.props.update({
              targetDeckSize: this.props.targetDeckSize,
              cards: this.props.cards.concat(card),
            })
          }
          disabled={
            !(
              card.cardCount -
              this.props.cards.filter(c => c.role === card.role).length
            ) || this.props.cards.length >= this.props.targetDeckSize
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
          {this.renderDeckSize()}

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
                {getDeckRoles(this.props.cards).map(role => (
                  <div key={role}>
                    <a href={`#${role}`}>
                      {role}: {getNumberOfARoleInDeck(role, this.props.cards)}
                    </a>
                  </div>
                ))}
              </>
            )}

            {this.renderDeckSize()}

            <div className="deck-actions">
              <button
                className="reset"
                disabled={!this.props.cards.length}
                onClick={() =>
                  this.props.update({ targetDeckSize: 0, cards: [] })
                }>
                reset
              </button>
              <button
                className="make-deck"
                onClick={() => this.props.done()}
                disabled={
                  this.props.cards.length !== this.props.targetDeckSize
                }>
                done {getDeckWeight(this.props.cards)}/{this.props
                  .targetDeckSize - this.props.cards.length}
              </button>
            </div>
          </section>
        </div>

        <style jsx>{`
          section {
            margin-top: 20px;
          }

          .card {
            margin-bottom: 5px;
            display: inline-block;
            width: 50%;
            padding: 10px;
            text-align: center;
          }

          .card-description > * + * {
            margin-left: 5px;
          }

          .card-title {
            font-weight: bold;
          }
          .card-title.wolf {
            color: red;
          }
          .card-title.villager {
            color: blue;
          }

          .card-count {
            font-style: italic;
          }

          .make-deck,
          .reset {
            border-top: 1px solid black;
            width: 50%;
          }
          .reset {
            border-right: 1px solid black;
          }

          .deck-size {
            border-top: 1px solid black;
            display: flex;
            width: 100%;
            white-space: nowrap;
            padding: 15px;
          }

          button {
            border: 0;
            padding: 15px;
            width: 50%;
          }

          button:focus,
          button:active {
            font-weight: bold;
          }

          input {
            text-align: right;
            border: none;
            width: 100%;
          }
        `}</style>
      </div>
    )
  }
}
