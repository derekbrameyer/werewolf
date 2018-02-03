import { Roles, Card } from 'interfaces/roles'
import { updatePlayer, addPrompt, isPlayerAlive } from 'helpers/index'
import { values } from 'ramda'
import { Player } from 'interfaces/player'

type Id = string

type PlayerProp<T extends keyof Player> = T

export type ActionButton =
  | {
      type: 'kill' | 'sudo kill'
      playerProp: PlayerProp<'alive'>
      target: Id
    }
  | {
      type: 'protect'
      playerProp: PlayerProp<'protected'>
      target: Id
    }
  | {
      type: 'bless'
      playerProp: PlayerProp<'blessed'>
      target: Id
    }
  | {
      type: 'bite'
      playerProp: PlayerProp<'bitten'>
      target: Id
    }
  | {
      type: 'transform' // cursed
      playerProp: PlayerProp<'role'>
      target: Id
    }

export type Action = {
  type: ActionButton['type']
  target: ActionButton['target']
}

export type PregameAction =
  | {
      type: 'cupid'
      id: string
      buttons: {
        link1: Id
        link2: Id
      }
    }
  | {
      type: 'copy'
      id: string
      source: Id
      buttons: {
        copy: Id
      }
    }
  | {
      type: 'link'
      id: string
      source: Id
      buttons: {
        link: Id
      }
    }

export interface Game {
  players: { [name: string]: Player }
  roles: Roles[]
  cards: Card[]
  prompts: Prompt[] | null
  nightPrompts: Prompt[] | null
}

export interface SetupPrompt {
  role: Roles
  message: string
  action?: PregameAction
  className?: string
}

export interface Prompt {
  key?: string
  message: string
  target?: string
  actions?: (Action['type'])[]
  className?: string
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
        message: `${role}, wake up and inspect someone`,
      }
    case Roles['apprentice seer']:
      return {
        message: `${role}, wake up and inspect someone`,
      }
    case Roles['aura seer']:
      return {
        message: `${role}, wake up and inspect someone, if they have a special power I will say yes`,
      }
    case Roles['witch']:
      return {
        message: `${role}, wake up thumbs up if you want to save everyone, thumbs down if you want to kill someone`,
      }
    case Roles['sorceress']:
      return {
        message: `${role}, wake up and look for the seer`,
      }
    case Roles['bodyguard']:
      return {
        message: `${role}, wake up and protect someone`,
      }

    case Roles['priest']:
      return {
        message: `${role}, wake up and bless someone, if they are ever killed, you will wake up the next night to pick another target`,
      }

    case Roles['pi']:
      return {
        message: `${role}, wake up and point at some one, if that person or one of their neighbors is a wolf I will say yes`,
      }

    case Roles['vampire']:
      return {
        message: `${role}, wake up and bite someone, if that person gets two nominations from now on, they die`,
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

export const deathAction = (player: Player): Prompt | null => {
  switch (player.role) {
    case Roles['hunter']:
      return {
        message: 'the hunter has died, choose a player to kill',
      }

    case Roles['tanner']:
      return {
        message: 'if the tanner was lynched then game over, tanner wins',
      }

    case Roles['wolf cub']:
      return {
        message:
          'the wolf cub has been killed, wolves get to kill two people next night',
      }

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
      return null

    case undefined:
    case null:
      return null
  }
}

export const performAction = (cleanGame: Game, action: Action): Game => {
  let game: Game = { ...cleanGame }
  const player = game.players[action.target]

  switch (action.type) {
    case 'kill':
    case 'sudo kill':
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

        return updatePlayer(game, player.name, {
          alive: true,
        })
      }

      if (action.type === 'kill' && player.blessed) {
        return addPrompt(game, {
          message: `${player.name} was blessed, what would you like to do?`,
          target: player.name,
          actions: ['bless', 'sudo kill'],
        })
      }

      if (action.type === 'kill' && player.protected) {
        return addPrompt(game, {
          message: `${player.name} is protected, what would you like to do?`,
          target: player.name,
          actions: ['sudo kill'],
        })
      }

      // Kill the player
      if (
        action.type === 'kill' &&
        (player.role === Roles.cursed || player.role === Roles.prince)
      ) {
        return addPrompt(game, deathAction(player))
      }

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

      const linkedLivingPlayers = (player.links || []).filter(name =>
        isPlayerAlive(game, name)
      )
      if (linkedLivingPlayers.length) {
        game = addPrompt(game, {
          message: `${
            player.name
          } has died and was linked to ${linkedLivingPlayers.join(
            ', '
          )}, be sure to kill them too.`,
        })
      }

      if (action.type !== 'sudo kill') {
        game = addPrompt(game, deathAction(player))
      }

      return updatePlayer(game, player.name, { alive: false })

    case 'bless':
      return updatePlayer(game, player.name, { blessed: !player.blessed })
    case 'protect':
      return updatePlayer(game, player.name, { protected: !player.protected })
    case 'bite':
      return updatePlayer(game, player.name, { bitten: !player.bitten })
    case 'transform':
      return updatePlayer(game, player.name, {
        role: player.role === Roles.werewolf ? Roles.cursed : Roles.werewolf,
      })
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
