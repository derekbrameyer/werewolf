import * as React from 'react'
import { Roles, AllCards, Card, getCard } from 'interfaces/roles'
import {
  getNumberOfARole,
  getDeckWeight,
  removeFirst,
  Deck,
} from 'helpers/index'
import { CardRow } from 'views/deck/card'
import { Tabs } from 'components/tabs'
import { SetupPlayer } from 'interfaces/player'
import { Grid } from 'components/grid'
import { Button } from 'components/button'
import { updateFirebase } from 'helpers/firebase'
import { Content } from 'components/layout'
import { equals, groupWith } from 'ramda'
import { Weight } from 'components/weight'

interface Props {
  players: SetupPlayer[]
  cards: Card<Roles>[]
  previousDecks: Deck[]
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

        {!!this.props.previousDecks.length && (
          <React.Fragment>
            <h1>previous decks</h1>
            {this.props.previousDecks.map(deck => (
              <div className="deck" key={deck.id}>
                {deck.title && <h2>{deck.title}</h2>}
                <div className="roles">
                  {groupWith(equals, deck.roles).map(roles => (
                    <div className="role" key={roles[0]}>
                      <img
                        className="role-profile"
                        src={getCard(roles[0]).profile}
                      />
                      {roles.length > 1 && (
                        <div className="count white">{roles.length}</div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="meta">
                  <span>
                    <strong>played</strong>: {deck.timesPlayed}
                  </span>
                  <span>
                    <strong>cards</strong>: {deck.roles.length}
                  </span>
                  <span>
                    <strong>weight</strong>:{' '}
                    <Weight weight={getDeckWeight(deck.roles.map(getCard))} />
                  </span>
                </div>
                {deck.description && <div>{deck.description}</div>}
                <Tabs>
                  <Button
                    confirm
                    className="red"
                    onClick={() =>
                      updateFirebase({
                        previousDecks: removeFirst(
                          d => deck.id === d.id,
                          this.props.previousDecks
                        ),
                      })
                    }>
                    remove
                  </Button>
                  <Button onClick={() => updateFirebase({ roles: deck.roles })}>
                    use
                  </Button>
                </Tabs>
              </div>
            ))}
          </React.Fragment>
        )}

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
