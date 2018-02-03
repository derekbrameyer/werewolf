import * as React from 'react'
import {
  Game,
  setupRole,
  SetupPrompt,
  performPregameAction,
} from 'interfaces/game'
import { Card, Roles, getRoleEmoji } from 'interfaces/roles'
import { getRoles, getNumberOfARole, comparePlayersName } from 'helpers/index'
import { sortBy, values, map } from 'ramda'
import { PlayerRow } from 'components/player'
import { Tabs } from 'components/tabs'
import { makePregameActionButton } from 'views/setup/buttons'
import { Grid } from 'components/grid'
import { Button } from 'components/button'
import { Player } from 'interfaces/player'
import { updateFirebase } from 'helpers/firebase'
import { Content } from 'components/layout'

interface Props {
  players: Player[]
  cards: Card[]
}

interface State {
  game: Game
  promptsRemaining: SetupPrompt[] // The current role we are setting up
  currentPrompt: SetupPrompt | undefined | null // The remaining roles we need to setup
}

export class SetupGame extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const setups = getRoles(sortBy(card => card.team, this.props.cards))
      .map(setupRole)
      .reduce<SetupPrompt[]>(
        (acc, setup) => (setup ? [...acc, setup] : acc),
        []
      )

    this.state = {
      game: {
        players: props.players.reduce(
          (memo, player) => ({ ...memo, [player.name]: player }),
          {}
        ),
        roles: getRoles(this.props.cards),
        prompts: [],
        cards: this.props.cards,
        nightPrompts: null,
      },
      promptsRemaining: setups.slice(1),
      currentPrompt: setups[0],
    }
  }

  componentDidUpdate() {
    if (!this.state.currentPrompt) {
      updateFirebase({
        game: {
          ...this.state.game,
          players: map(
            player => ({ role: Roles.villager, ...player }),
            this.state.game.players
          ),
        },
      })
    }
  }

  makeDoneButton = () => {
    const { promptsRemaining, currentPrompt } = this.state
    if (!currentPrompt) return null

    const { role, action } = currentPrompt

    const hasAllKeys = <T extends object>(obj: T): boolean =>
      values(obj).reduce((valid, val) => valid && !!val, true)

    const isActionComplete = !action
      ? true
      : hasAllKeys(action) && hasAllKeys(action.buttons)

    const areRolesSet = role
      ? getNumberOfARole(role, values(this.state.game.players)) ===
        getNumberOfARole(role, this.props.cards)
      : true

    return (
      <Tabs actions>
        <Button
          confirm
          className="red"
          onClick={() =>
            this.setState({
              promptsRemaining: promptsRemaining.slice(1),
              currentPrompt: promptsRemaining[0],
            })
          }>
          skip
        </Button>
        <Button
          disabled={!isActionComplete || !areRolesSet}
          onClick={() => {
            this.setState({
              promptsRemaining: promptsRemaining.slice(1),
              currentPrompt: promptsRemaining[0],
              game: performPregameAction(this.state.game, action),
            })
          }}>
          next
        </Button>
      </Tabs>
    )
  }

  render() {
    const { game, currentPrompt } = this.state

    if (!currentPrompt) return null

    return (
      <Content>
        <h1 className="prompt">
          {getRoleEmoji(currentPrompt.role)} {currentPrompt.role},{' '}
          {currentPrompt.message} {getRoleEmoji(currentPrompt.role)}
        </h1>

        <Grid>
          {values(game.players)
            .sort(comparePlayersName)
            .map(player => (
              <PlayerRow player={player} key={player.name}>
                {makePregameActionButton(
                  this.state.game,
                  player,
                  currentPrompt,
                  ({ game, prompt }) => {
                    this.setState({ currentPrompt: prompt, game })
                  }
                )}
              </PlayerRow>
            ))}
        </Grid>

        {this.makeDoneButton()}
      </Content>
    )
  }
}