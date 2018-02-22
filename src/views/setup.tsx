import * as React from 'react'
import { Game, defaultGame } from 'interfaces/game'
import { Roles, getCard } from 'interfaces/roles'
import {
  getNumberOfARole,
  comparePlayersName,
  Deck,
  addDeck,
} from 'helpers/index'
import {
  sortBy,
  values,
  map,
  repeat,
  append,
  reject,
  equals,
  uniq,
} from 'ramda'
import { Tabs } from 'components/tabs'
import { Grid } from 'components/grid'
import { Button } from 'components/button'
import { SetupPlayer, defaultPlayer } from 'interfaces/player'
import { updateFirebase } from 'helpers/firebase'
import { Content } from 'components/layout'
import { updatePlayer } from 'helpers/index'
import { PlayerSetupRow } from 'components/setupPlayer'

interface Action {
  role: Roles
  message: string

  requiredPlayers: number
  players: string[]

  requiredTargets: number
  targets: string[]

  actionToString: (players: string[], targets: string[]) => React.ReactNode
}

const roleToAction = (role: Roles, roleCount: number): Action | null => {
  const placeholderText = '____'
  const placeholder = (text?: string) => (
    <strong>{text || placeholderText}</strong>
  )

  switch (role) {
    case 'direwolf':
      return {
        role,
        message: `${role}, wake up and look at me. Point someone, when they die you die.`,
        requiredPlayers: 1,
        players: [],
        requiredTargets: 1,
        targets: [],
        actionToString: (players, targets) => (
          <React.Fragment>
            {placeholder(players[0])} is the {role} and dies when{' '}
            {placeholder(targets[0])} dies
          </React.Fragment>
        ),
      }

    case 'va wolf':
      return {
        role,
        message: `${role}, wake up and look at me. Point at someone, when you die they die.`,
        requiredPlayers: 1,
        players: [],
        requiredTargets: 1,
        targets: [],
        actionToString: (players, targets) => (
          <React.Fragment>
            {placeholder(players[0])} is the {role} and when they die{' '}
            {placeholder(targets[0])} dies
          </React.Fragment>
        ),
      }

    case 'doppleganger':
      return {
        role,
        message: `${role}, wake up and look at me. Point at someone, when they die you become their role.`,
        requiredPlayers: 1,
        players: [],
        requiredTargets: 1,
        targets: [],
        actionToString: (players, targets) => (
          <React.Fragment>
            {placeholder(players[0])} is the {role} and copies{' '}
            {placeholder(targets[0])} when they die
          </React.Fragment>
        ),
      }

    case 'cupid':
      return {
        role,
        message: `${role}, wake up and look at me. Point at two people, when one dies the other dies too.`,
        requiredPlayers: 1,
        players: [],
        requiredTargets: 2,
        targets: [],
        actionToString: (players, targets) => (
          <React.Fragment>
            {placeholder(players[0])} is the {role} and links{' '}
            {placeholder(targets[0])} and {placeholder(targets[1])} in love
          </React.Fragment>
        ),
      }

    case 'hoodlum':
      return {
        role,
        message: `${role}, wake up and look at me. You can only win with the villagers if you live and those two die`,
        requiredPlayers: 1,
        players: [],
        requiredTargets: 2,
        targets: [],
        actionToString: (players, targets) => (
          <React.Fragment>
            {placeholder(players[0])} is the {role} and bet on{' '}
            {placeholder(targets[0])} and {placeholder(targets[1])}
          </React.Fragment>
        ),
      }

    case 'seer':
    case 'apprentice seer':
    case 'bodyguard':
    case 'cursed':
    case 'cult leader':
    case 'hunter':
    case 'mason':
    case 'sorceress':
    case 'witch':
    case 'big bad wolf':
    case 'werewolf':
    case 'wolf cub':
    case 'tanner':
    case 'pi':
    case 'prince':
    case 'lycan':
    case 'aura seer':
    case 'minion':
    case 'priest':
    case 'vampire':
    case 'diseased':
    case 'old hag':
    case 'fang face':
    case 'fruit brute':
    case 'pacifist':
    case 'spell caster':
    case 'village idiot':
      return {
        role,
        message: `${role}, wake up and look at me`,
        requiredPlayers: roleCount,
        players: [],
        requiredTargets: 0,
        targets: [],
        actionToString: (players, targets) => {
          const isPlural = roleCount > 1

          const playerNames = players
            .concat(repeat(placeholderText, roleCount))
            .slice(0, roleCount)
            .join(', ')

          return (
            <React.Fragment>
              {playerNames} {isPlural ? 'are' : 'is'} the {role}
              {isPlural ? 's' : ''}
            </React.Fragment>
          )
        },
      }
    case 'villager':
      return null
  }
}

const performAction = (_game: Game, action: Action): Game => {
  let game = { ..._game }

  // Updated _all_ of the action's players with the proper roles
  game = action.players.reduce(
    (game, playerName) =>
      updatePlayer(game, playerName, {
        role: action.role,
      }),
    game
  )

  // Set the target to be copied by the doppleganger
  if (action.role === 'doppleganger') {
    game = updatePlayer(game, action.targets[0], {
      copiedBy: action.players[0],
    })
  }

  if (action.role === 'hoodlum') {
    game = action.targets.reduce(
      (game, playerName) =>
        updatePlayer(game, playerName, () => ({ betOn: true })),
      game
    )
  }

  // Link cupids lovers together
  if (action.role === 'cupid') {
    game = action.targets.reduce(
      (game, playerName) =>
        updatePlayer(game, playerName, ({ links }) => ({
          links: uniq(
            (links || []).concat(reject(equals(playerName), action.targets))
          ),
        })),
      game
    )
  }

  // Link the direwolf to its target
  if (action.role === 'cupid') {
    game = updatePlayer(game, action.targets[0], ({ links }) => ({
      links: uniq((links || []).concat(action.players[0])),
    }))
  }

  // Link the target to va wolf
  if (action.role === 'va wolf') {
    game = updatePlayer(game, action.players[0], ({ links }) => ({
      links: uniq((links || []).concat(action.targets[0])),
    }))
  }

  return game
}

interface Props {
  players: SetupPlayer[]
  roles: Roles[]
  previousDecks: Deck[]
  noFlip: boolean
  timeLimit: number
}

interface State {
  game: Game
  actionsRemaining: Action[]
  currentAction: Action | null | undefined
}

export class SetupGame extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const cards = props.roles.map(getCard)
    const actions = sortBy(card => card.team, cards)
      .map(({ role }) => roleToAction(role, getNumberOfARole(role, cards)))
      .filter(x => !!x) as Action[]

    this.state = {
      actionsRemaining: actions.slice(1),
      currentAction: actions[0],

      game: {
        ...defaultGame,
        players: props.players.reduce(
          (memo, player) => ({ ...memo, [player.name]: player }),
          {}
        ),
        options: {
          timeLimit: props.timeLimit,
          noFlip: props.noFlip,
        },
      },
    }
  }

  componentDidUpdate() {
    if (!this.state.currentAction) {
      const passcode = Math.random()
        .toString()
        .slice(3)

      localStorage.setItem('ww-passcode', passcode)

      updateFirebase({
        game: {
          ...this.state.game,
          passcode,
          players: map(
            player => ({ ...defaultPlayer, role: 'villager', ...player }),
            this.state.game.players
          ),
        },
      })

      addDeck(this.props.roles, this.props.previousDecks)
    }
  }

  render() {
    const { game, currentAction } = this.state

    if (!currentAction) return null

    return (
      <Content>
        <h1 className="prompt">
          {getCard(currentAction.role).emoji} {currentAction.message}{' '}
          {getCard(currentAction.role).emoji}
        </h1>

        <div style={{ paddingTop: '1rem', textAlign: 'center' }}>
          {currentAction.actionToString(
            currentAction.players,
            currentAction.targets
          )}
        </div>

        <Grid>
          {values(game.players)
            .sort(comparePlayersName)
            .map(player => {
              return (
                <PlayerSetupRow
                  player={{
                    name: player.name,
                    role: currentAction.players.find(equals(player.name))
                      ? currentAction.role
                      : player.role,
                  }}
                  key={player.name}
                  onClick={() => {
                    let { targets, players } = currentAction

                    if (!!players.find(equals(player.name))) {
                      // Player already is the role
                      players = reject(equals(player.name), players)
                    } else if (players.length < currentAction.requiredPlayers) {
                      if (!player.role) {
                        // We need more roles and the player needs one too
                        players = append(player.name, players)
                        if (!!targets.find(equals(player.name))) {
                          targets = reject(equals(player.name), targets)
                        }
                      }
                    } else if (!!targets.find(equals(player.name))) {
                      // The player is already a target
                      targets = reject(equals(player.name), targets)
                    } else if (targets.length < currentAction.requiredTargets) {
                      // There are targets left to be made
                      targets = append(player.name, targets)
                    }

                    this.setState({
                      currentAction: {
                        ...currentAction,
                        targets,
                        players,
                      },
                    })
                  }}
                />
              )
            })}
        </Grid>

        <Tabs actions>
          <Button
            className="red"
            confirm
            onClick={() => {
              this.setState({
                currentAction: this.state.actionsRemaining[0],
                actionsRemaining: this.state.actionsRemaining.slice(1),
              })
            }}>
            skip
          </Button>

          <Button
            disabled={
              !currentAction.players.length ||
              currentAction.targets.length !== currentAction.requiredTargets
            }
            confirm={
              !(currentAction.players.length === currentAction.requiredPlayers)
                ? 'u sure? unset players remain'
                : false
            }
            onClick={() => {
              this.setState({
                game: performAction(this.state.game, currentAction),
                currentAction: this.state.actionsRemaining[0],
                actionsRemaining: this.state.actionsRemaining.slice(1),
              })
            }}>
            next
          </Button>
        </Tabs>
      </Content>
    )
  }
}
