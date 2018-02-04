import * as React from 'react'
import { Game } from 'interfaces/game'
import { Tabs } from 'components/tabs'
import { removePrompt } from 'helpers/index'
import { makeActionButton } from './buttons'
import { Button } from 'components/button'
import { Prompt } from 'interfaces/prompt'

interface Props {
  prompt: Prompt
  game: Game
  done: (game: Game) => void
}

export const PromptView: React.SFC<Props> = ({
  prompt: { actions = [], message, className, target },
  game,
  done,
}) => (
  <div className="prompt">
    <h1 className={className}>{message}</h1>
    <Tabs>
      <Button
        className="red"
        onClick={() => {
          done(removePrompt(game, message))
        }}>
        dismiss
      </Button>

      {actions.map(type =>
        makeActionButton(
          game,
          target ? game.players[target] : null,
          type,
          game => done(removePrompt(game, message))
        )
      )}
    </Tabs>
  </div>
)
