import * as React from 'react'
import { Card, AllCards } from 'interfaces/cards'
import { getNumberOfARole } from 'helpers'
import { remove, findIndex, propEq } from 'ramda'
import { CardRow } from 'components/card'
import { Tabs } from 'components/tabs'
import { Player } from 'interfaces/game'
import { Grid } from 'components/grid'
import { Button } from 'components/button'

export interface FirebaseProps {
  cards: Card[]
}

interface Props extends FirebaseProps {
  done: () => void
  update: (props: FirebaseProps) => void
  players: Player[]
}

export class BuildDeck extends React.Component<Props> {
  renderCard = (card: Card) => (
    <CardRow deck={this.props.cards} card={card} id={card.role} key={card.role}>
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
        <h1>positive</h1>
        <Grid>
          {AllCards.filter(c => c.weight >= 0)
            .sort((a, b) => a.weight - b.weight)
            .map(this.renderCard)}
        </Grid>
        <h1>negative</h1>
        <Grid>
          {AllCards.filter(c => c.weight < 0)
            .sort((a, b) => b.weight - a.weight)
            .map(this.renderCard)}
        </Grid>

        <Tabs actions>
          <Button
            confirm
            className="red"
            disabled={!this.props.cards.length}
            onClick={() => this.props.update({ cards: [] })}>
            reset deck
          </Button>
        </Tabs>
      </div>
    )
  }
}
