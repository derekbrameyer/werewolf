import * as React from 'react'
import { Game, defaultGame } from 'interfaces/game'
import { Card, Roles, getRoleEmoji } from 'interfaces/roles'
import { getRoles, getNumberOfARole, comparePlayersName } from 'helpers/index'
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
import { PlayerRow } from 'components/player'
import { Tabs } from 'components/tabs'
import { Grid } from 'components/grid'
import { Button } from 'components/button'
import { Player } from 'interfaces/player'
import { updateFirebase } from 'helpers/firebase'
import { Content } from 'components/layout'
import { updatePlayer } from 'helpers/index'

interface Action {
  role: Roles
  message: string

  requiredPlayers: number
  players: string[]

  requiredTargets: number
  targets: string[]

  actionToString: (players: string[], targets: string[]) => React.ReactNode
}

const roleToAction = (role: Roles, roleCount: number): Action => {
  const placeholder = '_____'

  switch (role) {
    case Roles['direwolf']:
      return {
        role,
        message: `${role}, wake up and look at me. Point someone, when they die you die.`,
        requiredPlayers: 1,
        players: [],
        requiredTargets: 1,
        targets: [],
        actionToString: (players, targets) => (
          <React.Fragment>
            {strong(players[0] || placeholder)} is the {role} and dies when{' '}
            {strong(targets[0] || placeholder)} dies
          </React.Fragment>
        ),
      }

    case Roles['va wolf']:
      return {
        role,
        message: `${role}, wake up and look at me. Point at someone, when you die they die.`,
        requiredPlayers: 1,
        players: [],
        requiredTargets: 1,
        targets: [],
        actionToString: (players, targets) => (
          <React.Fragment>
            {strong(players[0] || placeholder)} is the {role} and when they die{' '}
            {strong(targets[0] || placeholder)} dies
          </React.Fragment>
        ),
      }

    case Roles['doppleganger']:
      return {
        role,
        message: `${role}, wake up and look at me. Point at someone, when they die you become their role.`,
        requiredPlayers: 1,
        players: [],
        requiredTargets: 1,
        targets: [],
        actionToString: (players, targets) => (
          <React.Fragment>
            {strong(players[0] || placeholder)} is the {role} and copies{' '}
            {strong(targets[0] || placeholder)} when they die
          </React.Fragment>
        ),
      }

    case Roles['cupid']:
      return {
        role,
        message: `${role}, wake up and look at me. Point at two people, when one dies the other dies too.`,
        requiredPlayers: 1,
        players: [],
        requiredTargets: 2,
        targets: [],
        actionToString: (players, targets) => (
          <React.Fragment>
            {strong(players[0] || placeholder)} is the {role} and links{' '}
            {strong(targets[0] || placeholder)} and{' '}
            {strong(targets[1] || placeholder)} in love
          </React.Fragment>
        ),
      }

    case Roles['seer']:
    case Roles['apprentice seer']:
    case Roles['bodyguard']:
    case Roles['cursed']:
    case Roles['cult leader']:
    case Roles['hunter']:
    case Roles['mason']:
    case Roles['sorceress']:
    case Roles['villager']:
    case Roles['witch']:
    case Roles['big bad wolf']:
    case Roles['werewolf']:
    case Roles['wolf cub']:
    case Roles['tanner']:
    case Roles['pi']:
    case Roles['prince']:
    case Roles['lycan']:
    case Roles['aura seer']:
    case Roles['minion']:
    case Roles['priest']:
    case Roles['vampire']:
    case Roles['diseased']:
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
            .concat(repeat(placeholder, roleCount))
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
  if (action.role === Roles.doppleganger) {
    game = updatePlayer(game, action.targets[0], {
      copiedBy: action.players[0],
    })
  }

  // Link cupids lovers together
  if (action.role === Roles.cupid) {
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
  if (action.role === Roles.direwolf) {
    game = updatePlayer(game, action.targets[0], ({ links }) => ({
      links: uniq((links || []).concat(action.players[0])),
    }))
  }

  // Link the target to va wolf
  if (action.role === Roles['va wolf']) {
    game = updatePlayer(game, action.players[0], ({ links }) => ({
      links: uniq((links || []).concat(action.targets[0])),
    }))
  }

  return game
}

interface Props {
  players: Player[]
  cards: Card[]
  noFlip: boolean
  timeLimit: number
}

interface State {
  game: Game
  actionsRemaining: Action[]
  currentAction: Action | null | undefined
}

const strong = (text: string) => <strong>{text}</strong>

export class SetupGame extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const actions = getRoles(sortBy(card => card.team, this.props.cards)).map(
      role => roleToAction(role, getNumberOfARole(role, props.cards))
    )

    this.state = {
      actionsRemaining: actions.slice(1),
      currentAction: actions[0],

      game: {
        ...defaultGame,
        cards: props.cards,
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

  render() {
    const { game, currentAction } = this.state

    if (!currentAction) return null

    return (
      <Content>
        <h1 className="prompt">
          {getRoleEmoji(currentAction.role)} {currentAction.message}{' '}
          {getRoleEmoji(currentAction.role)}
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
                <PlayerRow
                  isActive={false}
                  player={{
                    role: currentAction.players.find(equals(player.name))
                      ? currentAction.role
                      : null,
                    ...player,
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
          <Button className="red" confirm>
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
