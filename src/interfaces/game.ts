import { Roles, Card } from 'interfaces/cards'
import { updatePlayer, addPrompt, isPlayerAlive } from 'helpers'

type Id = string

export type Action =
  | { type: 'kill'; target: Id }
  | {
      type: 'cursed'
      target: Id
      buttons: {
        kill: boolean
        'make wolf': boolean
      }
    }
  | { type: 'protect'; target: Id }
  | { type: 'revive'; target: Id }

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
}

export interface Player {
  name: Id
  role?: Roles
  alive: boolean
  links: Id[] | null
  copiedBy: Id | null
}

export interface SetupPrompt {
  role: Roles
  message: string
  action?: PregameAction
}

export interface Prompt {
  message: string
  action?: Action
}

export const setupRole = (role: Roles): SetupPrompt | null => {
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
    case Roles['hunter']:
    case Roles['seer']:
    case Roles['apprentice seer']:
    case Roles['witch']:
    case Roles['werewolf']:
    case Roles['big bad wolf']:
    case Roles['sorceress']:
    case Roles['wolf cub']:
    case Roles['tanner']:
    case Roles['bodyguard']:
      return {
        role,
        message: 'wake up and look at me.',
      }

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
    case Roles['cursed']:
    case Roles['wolf cub']:
      return { message: 'todo' }

    case Roles['seer']:
    case Roles['big bad wolf']:
    case Roles['apprentice seer']:
    case Roles['witch']:
    case Roles['werewolf']:
    case Roles['sorceress']:
    case Roles['bodyguard']:
    case Roles['cupid']:
    case Roles['mason']:
    case Roles['doppleganger']:
    case Roles['villager']:
      return null

    case undefined:
      return null
  }
}

export const performAction = (cleanGame: Game, action: Action): Game => {
  const player = cleanGame.players[action.target]
  let game: Game = { ...cleanGame }

  switch (action.type) {
    case 'kill':
      if (player.role === Roles.cursed) {
        return addPrompt(game, {
          message: `${player.name} is cursed, what would you like to do?`,
          action: {
            type: 'cursed',
            target: player.name,
            buttons: {
              'make wolf': false,
              kill: false,
            },
          },
        })
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

      return updatePlayer(game, player.name, { alive: false })

    case 'protect':
      return cleanGame

    case 'cursed':
      const wolfGame = updatePlayer(game, player.name, {
        role: Roles['werewolf'],
      })

      if (action.buttons['make wolf']) {
        return wolfGame
      } else if (action.buttons.kill) {
        return performAction(wolfGame, { type: 'kill', target: player.name })
      }

      return cleanGame

    case 'revive':
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
