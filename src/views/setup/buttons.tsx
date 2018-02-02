import * as React from 'react'
import { Button } from 'components/button'
import { Game, SetupPrompt } from 'interfaces/game'
import { updatePlayer, getNumberOfARole } from 'helpers/index'
import { values } from 'ramda'
import { Player } from 'interfaces/player'

export const makeLink = (
  game: Game,
  player: Player,
  prompt: SetupPrompt,
  update: (options: { game: Game; prompt: SetupPrompt }) => void
) => {
  if (!prompt.action || prompt.action.type !== 'link') return null
  const { action } = prompt

  const hasTarget = !!action.buttons.link
  const isTarget = action.buttons.link === player.name

  if (hasTarget && !isTarget) return null

  return (
    <Button
      onClick={() => {
        update({
          prompt: {
            ...prompt,
            action: {
              ...action,
              buttons: {
                link: isTarget ? '' : player.name,
              },
            },
          },
          game,
        })
      }}>
      {isTarget ? `undo link` : `link`}
    </Button>
  )
}

export const makeCopy = (
  game: Game,
  player: Player,
  prompt: SetupPrompt,
  update: (options: { game: Game; prompt: SetupPrompt }) => void
) => {
  if (!prompt.action || prompt.action.type !== 'copy') return null
  const { action } = prompt

  const hasTarget = !!action.buttons.copy
  const isTarget = action.buttons.copy === player.name

  if (hasTarget && !isTarget) return null

  return (
    <Button
      onClick={() => {
        update({
          prompt: {
            ...prompt,
            action: {
              ...action,
              buttons: {
                copy: isTarget ? '' : player.name,
              },
            },
          },
          game,
        })
      }}>
      {isTarget ? `undo copy` : `copy`}
    </Button>
  )
}

export const makeCupid = (
  game: Game,
  player: Player,
  prompt: SetupPrompt,
  update: (options: { game: Game; prompt: SetupPrompt }) => void
) => {
  if (!prompt.action || prompt.action.type !== 'cupid') return null
  const { action } = prompt

  const hasLink1 = !!action.buttons.link1
  const isLink1 = action.buttons.link1 === player.name

  const hasLink2 = !!action.buttons.link2
  const isLink2 = action.buttons.link2 === player.name

  const updateLink = (key: 'link1' | 'link2', name: string) =>
    update({
      game,
      prompt: {
        ...prompt,
        action: {
          ...action,
          buttons: {
            ...action.buttons,
            [key]: name,
          },
        },
      },
    })

  return (
    <React.Fragment>
      {/* Link 1 */}
      {!isLink2 &&
        (isLink1 || !hasLink1) && (
          <Button
            onClick={() => updateLink('link1', isLink1 ? '' : player.name)}>
            {isLink1 ? `undo link` : `link`}
          </Button>
        )}

      {/* Link 2 */}
      {!isLink1 &&
        (isLink2 || !hasLink2) && (
          <Button
            onClick={() => updateLink('link2', isLink2 ? '' : player.name)}>
            {isLink2 ? `undo link` : `link`}
          </Button>
        )}
    </React.Fragment>
  )
}

export const makePregameActionButton = (
  game: Game,
  player: Player,
  prompt: SetupPrompt,
  update: (options: { game: Game; prompt: SetupPrompt }) => void
) => {
  const action = prompt.action

  const rolesInGame = getNumberOfARole(prompt.role, values(game.players))
  const rolesInDeck = getNumberOfARole(prompt.role, game.cards)

  const playerHasRole = !!player.role
  const playerRoleIsPromptRole = player.role === prompt.role
  const rolesStillAvailable = rolesInGame < rolesInDeck
  const displaySetRole =
    playerRoleIsPromptRole || (!playerHasRole && rolesStillAvailable)

  return (
    <React.Fragment>
      {/* Update the player's role */}
      {displaySetRole && (
        <Button
          onClick={() => {
            update({
              prompt:
                prompt.action && 'source' in prompt.action
                  ? {
                      ...prompt,
                      action: { ...prompt.action, source: player.name },
                    }
                  : prompt,
              game: updatePlayer(game, player.name, {
                role: player.role === prompt.role ? undefined : prompt.role,
              }),
            })
          }}>
          {player.role === prompt.role ? `undo role` : prompt.role}
        </Button>
      )}

      {/* Update any of the players special properties */}
      {action &&
        action.type === 'copy' &&
        makeCopy(game, player, prompt, update)}
      {action &&
        action.type === 'cupid' &&
        makeCupid(game, player, prompt, update)}
      {action &&
        action.type === 'link' &&
        makeLink(game, player, prompt, update)}
    </React.Fragment>
  )
}
