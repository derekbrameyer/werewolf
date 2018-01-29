import * as React from 'react'
import { Player, Game, setupRole, Setup, Action } from 'game'
import { Card } from 'cards'
import { getRoles, updateFirst, getNumberOfARole } from 'helpers'
import { sortBy, whereEq } from 'ramda'
import { PlayerRow } from 'player'

// Any state you want to persist to firebase
export interface FirebaseProps {}

interface Props extends FirebaseProps {
  players: Player[]
  cards: Card[]
  done: (game: Game) => void
}

interface State {
  game: Game
  players: Player[]
  completedSetups: Action[] // Completed setups the game needs to track
  setupsRemaining: Setup[] // The current role we are setting up
  currentSetup: Setup | undefined | null // The remaining roles we need to setup
}

export class SetupGame extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const setups = getRoles(sortBy(card => card.team, this.props.cards))
      .map(setupRole)
      .reduce<Setup[]>((acc, setup) => (setup ? [...acc, setup] : acc), [])

    this.state = {
      players: this.props.players.slice(0),
      game: {
        day: [],
        night: [],
        players: [],
        roles: getRoles(this.props.cards),
        setup: [],
      },
      completedSetups: [],
      setupsRemaining: setups.slice(1),
      currentSetup: setups[0],
    }
  }

  componentDidUpdate() {
    if (!this.state.currentSetup) {
      this.props.done({
        ...this.state.game,
        players: this.state.players,
        setup: this.state.completedSetups,
      })
    }
  }

  makeDoneButton = () => {
    const { setupsRemaining, currentSetup, completedSetups } = this.state
    if (!currentSetup) return null

    const { action } = currentSetup
    const isActionComplete = !!(action
      ? action.target && ('source' in action ? action.source : true)
      : true)

    return (
      <button
        disabled={!isActionComplete}
        onClick={() =>
          this.setState({
            setupsRemaining: setupsRemaining.slice(1),
            currentSetup: setupsRemaining[0],
            completedSetups: currentSetup.action
              ? [...completedSetups, currentSetup.action]
              : completedSetups,
          })
        }>
        next
      </button>
    )
  }

  makePlayerButtons = (player: Player, { action, role, message }: Setup) => {
    const numberOfRoleInDeck = getNumberOfARole(role, this.props.cards)
    const numberOfRoleInPlayers = getNumberOfARole(role, this.state.players)

    let sourceButton: React.ReactElement<{}> | null = null
    let undoSourceButton: React.ReactElement<{}> | null = null
    let targetButton: React.ReactElement<{}> | null = null
    let undoTargetButton: React.ReactElement<{}> | null = null

    if (action && 'target' in action) {
      targetButton = (
        <button
          onClick={() =>
            this.setState({
              currentSetup: {
                role,
                message,
                action: { ...action, target: player.name },
              },
            })
          }>
          target
        </button>
      )

      undoTargetButton = (
        <button
          onClick={() =>
            this.setState({
              currentSetup: {
                role,
                message,
                action: { ...action, target: '' },
              },
            })
          }>
          undo target
        </button>
      )
    }

    if (action && 'source' in action) {
      sourceButton = (
        <button
          onClick={() =>
            this.setState({
              currentSetup: {
                role,
                message,
                action: { ...action, source: player.name },
              },
            })
          }>
          source
        </button>
      )

      undoSourceButton = (
        <button
          onClick={() =>
            this.setState({
              currentSetup: {
                role,
                message,
                action: { ...action, source: '' },
              },
            })
          }>
          undo source
        </button>
      )
    }

    return (
      <React.Fragment>
        {!player.role &&
          numberOfRoleInPlayers < numberOfRoleInDeck &&
          player.role !== role && (
            <button
              onClick={() => {
                this.setState({
                  players: updateFirst(
                    whereEq({ name: player.name }),
                    player => ({ ...player, role: role }),
                    this.state.players
                  ),
                })
              }}>
              set as {role}
            </button>
          )}
        {player.role === role && (
          <button
            onClick={() => {
              this.setState({
                players: updateFirst(
                  whereEq({ name: player.name }),
                  player => ({ ...player, role: undefined }),
                  this.state.players
                ),
              })
            }}>
            undo {role}
          </button>
        )}

        {action &&
          !action.target &&
          player.name !== action.target &&
          targetButton}
        {action && player.name === action.target && undoTargetButton}
        {action &&
          'source' in action &&
          !action.source &&
          player.name !== action.target &&
          sourceButton}
        {action &&
          'source' in action &&
          player.name === action.source &&
          undoSourceButton}
      </React.Fragment>
    )
  }

  render() {
    const {
      players,
      currentSetup,
      setupsRemaining,
      completedSetups,
    } = this.state

    if (!currentSetup) {
      return <h1>done</h1>
    }

    return (
      <div>
        <h2>
          {currentSetup.role}, {currentSetup.message}
        </h2>

        {players.map(player => (
          <PlayerRow player={player} key={player.name}>
            {this.makePlayerButtons(player, currentSetup)}
          </PlayerRow>
        ))}

        {this.makeDoneButton()}
      </div>
    )
  }
}
