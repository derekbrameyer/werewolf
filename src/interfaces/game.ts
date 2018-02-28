import { Roles, getCard } from 'interfaces/roles'
import {
  updatePlayer,
  addPrompt,
  isPlayerAlive,
  removeFirst,
  isNight,
} from 'helpers/index'
import { values } from 'ramda'
import { Player, PlayerId } from 'interfaces/player'
import { Action, Actions } from 'interfaces/actions'
import { Prompt } from 'interfaces/prompt'

export interface Game {
  passcode: string
  initialRoles: Roles[]
  players: { [name: string]: Player }
  options: {
    noFlip: boolean
    timeLimit: number | null
  }
  prompts: Prompt[] | null
  nightPrompts: Prompt[] | null
  nightKills: PlayerId[] | null
  dayCount: number
  activePlayer: string | null
}

export const defaultGame: Game = {
  passcode: '',
  initialRoles: [],
  players: {},
  options: {
    noFlip: false,
    timeLimit: 0,
  },
  prompts: [],
  nightPrompts: [],
  nightKills: [],
  activePlayer: null,
  dayCount: 0,
}

const makeIndoctrinatePrompt = (game: Game): Game => {
  if (
    values(game.players)
      .filter(p => p.role !== Roles['cult leader'])
      .filter(p => p.alive)
      .every(p => p.indoctrinated)
  ) {
    game = addPrompt(game, {
      message: 'All the living players are in the cult, the cult leader wins!',
      spectatable: true,
    })
  }
  return game
}

const makeFruitBrutePrompt = (game: Game): Game => {
  const livingWolves = values(game.players)
    .filter(p => p.alive)
    .filter(p => getCard(p.role).team === 'wolf')

  if (
    livingWolves.length &&
    livingWolves.every(
      p => p.role === Roles['fruit brute'] || p.role === Roles['fang face']
    )
  ) {
    game = addPrompt(game, {
      message:
        'The fruit brute is currently the only werewolf active, they can not kill anyone.',
      spectatable: true,
    })
  }

  return game
}

export const preDeathAction = (
  player: Player,
  action: Actions
): Prompt | null => {
  const role = getCard(player.role)

  if (action === 'sudo kill') return null

  if (action === 'kill' && (player.protected || player.blessed)) {
    const typeSpecificAction: Actions = player.protected ? 'protect' : 'bless'
    return {
      target: player.name,
      message: `${player.name} is protected, what would you like to do?`,
      actions: [typeSpecificAction, 'bypass protection'],
      spectatable: false,
    }
  }

  if (role.preDeathAction) {
    return role.preDeathAction(player)
  }

  return null
}

export const performAction = (cleanGame: Game, action: Action): Game => {
  let game: Game = { ...cleanGame, activePlayer: null }
  const player = action.target ? game.players[action.target] : null

  switch (action.type) {
    // In the order of precedence
    case 'kill':
    case 'bypass protection':
    case 'sudo kill':
      if (!player) return game
      const role = getCard(player.role)

      // Revive the player
      if (!player.alive) {
        if (player.copiedBy) {
          game = updatePlayer(game, player.copiedBy, {
            role: 'doppleganger',
          })
        }

        if (player.role === 'cursed') {
          game = updatePlayer(game, player.name, { role: 'cursed' })
        }

        game = {
          ...game,
          nightKills: (game.nightKills || []).filter(
            name => name !== player.name
          ),
        }

        return updatePlayer(game, player.name, {
          alive: true,
        })
      }

      // Attempt to kill the player if they don't have any pre-death prompts
      const rolesPreDeathAction = preDeathAction(player, action.type)
      if (rolesPreDeathAction) {
        return addPrompt(game, rolesPreDeathAction)
      }

      // Before fully killing the player we need to...
      // Perform cleanup
      if (player.copiedBy) {
        game = updatePlayer(game, player.copiedBy, {
          role: player.role,
        })

        game = addPrompt(game, {
          message: `${player.copiedBy} transformed into a ${
            player.role
          } since ${player.name} was killed`,
          spectatable: false,
        })
      }

      // Add prompts to kill linked player
      game = (player.links || [])
        .filter(name => isPlayerAlive(game, name))
        .reduce((game, linkedPlayer) => {
          return addPrompt(game, {
            message: `${
              player.name
            } has died and was linked to ${linkedPlayer}`,
            actions: ['kill'],
            target: linkedPlayer,
            spectatable: true,
          })
        }, game)

      // Add any prompts for when specific roles die
      if (role.deathMessage) {
        game = addPrompt(game, {
          message: role.deathMessage,
          spectatable: !game.options.noFlip,
        })
      }

      // Update what players have been killed this night
      game = {
        ...game,
        nightKills: (game.nightKills || []).concat(player.name),
      }

      // Kill the player
      game = updatePlayer(game, player.name, { alive: false })

      game = makeFruitBrutePrompt(game)

      game = makeIndoctrinatePrompt(game)
      return game

    case 'bless':
      return player
        ? updatePlayer(game, player.name, { blessed: !player.blessed })
        : game
    case 'protect':
      return player
        ? updatePlayer(game, player.name, { protected: !player.protected })
        : game
    case 'bite':
      return player
        ? updatePlayer(game, player.name, { bitten: !player.bitten })
        : game
    case 'silence':
      return player
        ? updatePlayer(game, player.name, { silenced: !player.silenced })
        : game
    case 'exile':
      return player
        ? updatePlayer(game, player.name, { exiled: !player.exiled })
        : game
    case 'indoctrinate':
      game = player
        ? updatePlayer(game, player.name, {
            indoctrinated: !player.indoctrinated,
          })
        : game
      game = makeIndoctrinatePrompt(game)
      return game
    case 'transform':
      return player
        ? updatePlayer(game, player.name, {
            role: player.role === 'werewolf' ? 'cursed' : 'werewolf',
          })
        : game
    case 'next role':
      game = {
        ...game,
        prompts: removeFirst(p => !!p.nightPrompt, game.prompts || []),
      }
      game = addPrompt(game, (game.nightPrompts || [])[0])
      game = { ...game, nightPrompts: (game.nightPrompts || []).slice(1) }
      game = {
        ...game,
        dayCount: isNight(game) ? game.dayCount : game.dayCount + 1,
      }
      return game
  }
}

export const isRoleActive = (game: Game, role: Roles): boolean => {
  const livingPlayers = values(game.players).filter(p => p.alive)
  const isRoleInGame = !!livingPlayers.filter(p => p.role === role).length

  const isSeerInGame = !!livingPlayers.find(p => p.role === 'seer')
  const isApprenticeSeerInGame = !!livingPlayers.find(
    p => p.role === Roles['apprentice seer']
  )

  return role === Roles['apprentice seer']
    ? !isSeerInGame && isApprenticeSeerInGame
    : isRoleInGame
}
