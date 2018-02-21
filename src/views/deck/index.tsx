import * as React from 'react'
import { Roles, AllCards, Card, getCard } from 'interfaces/roles'
import { getNumberOfARole } from 'helpers/index'
import { CardRow } from 'views/deck/card'
import { Tabs } from 'components/tabs'
import { SetupPlayer } from 'interfaces/player'
import { Grid } from 'components/grid'
import { Button } from 'components/button'
import { updateFirebase } from 'helpers/firebase'
import { Content } from 'components/layout'

interface Props {
  players: SetupPlayer[]
  cards: Card<Roles>[]
}

export class BuildDeck extends React.Component<Props> {
  renderCard = (card: Card<Roles>) => (
    <CardRow
      deck={this.props.cards}
      card={card}
      id={card.role}
      key={card.role}
      onAdd={() => {
        if (card.cardCount > getNumberOfARole(card.role, this.props.cards)) {
          updateFirebase({
            roles: this.props.cards.concat(card).map(card => card.role),
          })
        } else {
          updateFirebase({
            roles: this.props.cards
              .map(card => card.role)
              .filter(role => role !== card.role),
          })
        }
      }}
      onRemove={() => {
        updateFirebase({
          roles: this.props.cards
            .map(card => card.role)
            .filter(role => role !== card.role),
        })
      }}
    />
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
            onClick={() => updateFirebase({ roles: [] })}>
            reset deck
          </Button>
        </Tabs>
      </Content>
    )
  }
}
