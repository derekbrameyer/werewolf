import * as React from 'react'
import { Card, AllCards } from 'interfaces/roles'
import { getNumberOfARole } from 'helpers/index'
import { remove, findIndex, propEq } from 'ramda'
import { CardRow } from 'views/deck/card'
import { Tabs } from 'components/tabs'
import { Player } from 'interfaces/player'
import { Grid } from 'components/grid'
import { Button } from 'components/button'
import { updateFirebase } from 'helpers/firebase'
import { Content } from 'components/layout'

interface Props {
  players: Player[]
  cards: Card[]
}

export class BuildDeck extends React.Component<Props> {
  renderCard = (card: Card) => (
    <CardRow deck={this.props.cards} card={card} id={card.role} key={card.role}>
      <button
        onClick={() =>
          updateFirebase({
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
          updateFirebase({
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
      <Content>
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
            onClick={() => updateFirebase({ cards: [] })}>
            reset deck
          </Button>
        </Tabs>
      </Content>
    )
  }
}
