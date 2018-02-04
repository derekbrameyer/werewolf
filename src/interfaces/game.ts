import { Roles, Card } from 'interfaces/roles'
import { updatePlayer, addPrompt, isPlayerAlive } from 'helpers/index'
import { values } from 'ramda'
import { Player, PlayerId } from 'interfaces/player'
import { PregameAction, Action, Actions } from 'interfaces/actions'
import { Prompt, SetupPrompt } from 'interfaces/prompt'

export interface Game {
  players: { [name: string]: Player }
  roles: Roles[]
  cards: Card[]
  options: {
    noFlip: boolean
    timeLimit: number | null
  }
  prompts: Prompt[] | null
  nightPrompts: Prompt[] | null
  nightKills: PlayerId[] | null
}

export const setupRole = (
  role: Roles | undefined | null
): SetupPrompt | null => {
  if (!role) return null

  switch (role) {
    case Roles['cupid']:
      return {
        role,
        message:
          'wake up and point at two players. when one dies, the other dies.',
        action: {
          type: 'cupid',
          id: Math.random().toString(),
          buttons: {
            link1: '',
            link2: '',
          },
        },
      }

    case Roles['mason']:
      return {
        role,
        message: 'wake up and look for the other masons.',
      }

    case Roles['doppleganger']:
      return {
        role,
        message:
          'wake up and point at someone, when they die you become their role.',
        action: {
          type: 'copy',
          source: '',
          id: Math.random().toString(),
          buttons: {
            copy: '',
          },
        },
      }

    case Roles['cursed']:
    case Roles['priest']:
    case Roles['hunter']:
    case Roles['pi']:
    case Roles['prince']:
    case Roles['seer']:
    case Roles['apprentice seer']:
    case Roles['witch']:
    case Roles['werewolf']:
    case Roles['big bad wolf']:
    case Roles['lycan']:
    case Roles['sorceress']:
    case Roles['wolf cub']:
    case Roles['tanner']:
    case Roles['vampire']:
    case Roles['aura seer']:
    case Roles['minion']:
    case Roles['bodyguard']:
      return {
        role,
        message: 'wake up and look at me.',
      }

    case Roles['villager']:
      return null
  }
}

export const nightAction = (role: Roles | undefined | null): Prompt | null => {
  if (!role) return null

  switch (role) {
    case Roles['seer']:
      return {
        message: `${role}, inspect someone`,
      }
    case Roles['apprentice seer']:
      return {
        message: `${role}, inspect someone`,
      }
    case Roles['aura seer']:
      return {
        message: `${role}, inspect someone, if they have a special power I will say yes`,
      }
    case Roles['witch']:
      return {
        message: `${role}, thumbs up to save everyone, thumbs down and point to kill someone`,
      }
    case Roles['sorceress']:
      return {
        message: `${role}, look for the seer`,
      }
    case Roles['bodyguard']:
      return {
        message: `${role}, protect someone`,
      }

    case Roles['priest']:
      return {
        message: `${role}, bless someone. if they are ever killed you will bless another person next night`,
      }

    case Roles['pi']:
      return {
        message: `${role}, point at some one, if they or one of their neighbors are a wolf I will say yes`,
      }

    case Roles['vampire']:
      return {
        message: `${role}, bite someone, if that person gets two nominations from now on, they die`,
      }

    case Roles['wolf cub']:
    case Roles['prince']:
    case Roles['minion']:
    case Roles['werewolf']:
    case Roles['big bad wolf']:
    case Roles['tanner']:
    case Roles['cupid']:
    case Roles['mason']:
    case Roles['doppleganger']:
    case Roles['lycan']:
    case Roles['cursed']:
    case Roles['hunter']:
    case Roles['villager']:
      return null
  }
}

export const preDeathAction = (
  player: Player,
  action: Actions
): Prompt | null => {
  if (action === 'sudo kill') return null

  if (action === 'kill' && (player.protected || player.blessed)) {
    const typeSpecificAction: Actions = player.protected ? 'protect' : 'bless'
    return {
      target: player.name,
      message: `${player.name} is protected, what would you like to do?`,
      actions: [typeSpecificAction, 'bypass protection'],
    }
  }

  switch (player.role) {
    case Roles['prince']:
      return {
        target: player.name,
        message: `${player.name} is the ${
          player.role
        }, what would you like to do?`,
        actions: ['sudo kill'],
      }

    case Roles['cursed']:
      return {
        target: player.name,
        message: `${player.name} is the ${
          player.role
        }, what would you like to do?`,
        actions: ['transform', 'sudo kill'],
      }

    case Roles['hunter']:
    case Roles['tanner']:
    case Roles['wolf cub']:
    case Roles['seer']:
    case Roles['big bad wolf']:
    case Roles['aura seer']:
    case Roles['minion']:
    case Roles['pi']:
    case Roles['priest']:
    case Roles['apprentice seer']:
    case Roles['witch']:
    case Roles['werewolf']:
    case Roles['sorceress']:
    case Roles['bodyguard']:
    case Roles['cupid']:
    case Roles['vampire']:
    case Roles['mason']:
    case Roles['doppleganger']:
    case Roles['lycan']:
    case Roles['villager']:
    case undefined:
    case null:
      return null
  }
}

export const deathAction = (player: Player): Prompt | null => {
  switch (player.role) {
    case Roles['hunter']:
      return {
        message: 'the hunter has died, choose a player to kill',
      }

    case Roles['tanner']:
      return {
        message: 'if the tanner was lynched then they win',
      }

    case Roles['wolf cub']:
      return {
        message: 'the wolf cub died, wolves get to kill two people next night',
      }

    case Roles['prince']:
    case Roles['cursed']:
    case Roles['seer']:
    case Roles['big bad wolf']:
    case Roles['aura seer']:
    case Roles['minion']:
    case Roles['pi']:
    case Roles['priest']:
    case Roles['apprentice seer']:
    case Roles['witch']:
    case Roles['werewolf']:
    case Roles['sorceress']:
    case Roles['bodyguard']:
    case Roles['cupid']:
    case Roles['vampire']:
    case Roles['mason']:
    case Roles['doppleganger']:
    case Roles['lycan']:
    case Roles['villager']:
    case undefined:
    case null:
      return null
  }
}

export const performAction = (cleanGame: Game, action: Action): Game => {
  let game: Game = { ...cleanGame }
  const player = action.target ? game.players[action.target] : null

  switch (action.type) {
    // In the order of precedence
    case 'kill':
    case 'bypass protection':
    case 'sudo kill':
      if (!player) return game

      // Revive the player
      if (!player.alive) {
        if (player.copiedBy) {
          game = updatePlayer(game, player.copiedBy, {
            role: Roles.doppleganger,
          })
        }

        if (player.role === Roles.cursed) {
          game = updatePlayer(game, player.name, { role: Roles.cursed })
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
          })
        }, game)

      // Add any prompts for when specific roles die
      game = addPrompt(game, deathAction(player))

      // Update what players have been killed this night
      game = {
        ...game,
        nightKills: (game.nightKills || []).concat(player.name),
      }

      // Kill the player
      return updatePlayer(game, player.name, { alive: false })

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
    case 'transform':
      return player
        ? updatePlayer(game, player.name, {
            role:
              player.role === Roles.werewolf ? Roles.cursed : Roles.werewolf,
          })
        : game
    case 'next role':
      return {
        ...game,
        ...addPrompt(game, (game.nightPrompts || [])[0]),
        nightPrompts: (game.nightPrompts || []).slice(1),
      }
  }
}

export const performPregameAction = (
  game: Game,
  action?: PregameAction
): Game => {
  if (!action) return game

  switch (action.type) {
    case 'copy':
      return updatePlayer(game, action.buttons.copy, ({ copiedBy }) => ({
        copiedBy: action.source,
      }))

    case 'link':
      return updatePlayer(game, action.source, ({ links }) => ({
        links: (links || []).concat(action.buttons.link),
      }))

    case 'cupid':
      const updatedGame = updatePlayer(
        game,
        action.buttons.link1,
        ({ links }) => ({
          links: (links || []).concat(action.buttons.link2),
        })
      )
      return updatePlayer(updatedGame, action.buttons.link2, ({ links }) => ({
        links: (links || []).concat(action.buttons.link1),
      }))
  }
}

export const isRoleActive = (game: Game, role: Roles): boolean => {
  const livingPlayers = values(game.players).filter(p => p.alive)
  const isRoleInGame = !!livingPlayers.filter(p => p.role === role).length

  const isSeerInGame = !!livingPlayers.find(p => p.role === Roles.seer)
  const isApprenticeSeerInGame = !!livingPlayers.find(
    p => p.role === Roles['apprentice seer']
  )

  return role === Roles['apprentice seer']
    ? !isSeerInGame && isApprenticeSeerInGame
    : isRoleInGame
}
