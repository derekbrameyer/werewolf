import * as React from 'react'
import { toPairs } from 'ramda'
import { Prompt, Game, performAction } from 'interfaces/game'
import { Tabs } from 'components/tabs'
import { removePrompt } from 'helpers'
import { Button } from 'components/button'

interface Props {
  prompt: Prompt
  game: Game
  done: (game: Game) => void
}

export const PromptView: React.SFC<Props> = ({
  prompt: { action, message },
  game,
  done,
}) => (
  <div>
    <h1>{message}</h1>
    <Tabs grow>
      <button
        className="red"
        onClick={() => {
          done(removePrompt(game, message))
        }}>
        dismiss
      </button>

      {action &&
        'buttons' in action &&
        toPairs<string, boolean>(action.buttons).map(([key, value]) => (
          <Button
            key={key}
            onClick={() => {
              done(
                removePrompt(
                  performAction(game, {
                    ...action,
                    buttons: {
                      ...action.buttons,
                      [key]: true,
                    },
                  }),
                  message
                )
              )
            }}>
            {key}
          </Button>
        ))}
    </Tabs>
  </div>
)
