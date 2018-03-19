import * as React from 'react'
import { Game } from 'interfaces/game'
import { ghostVote } from 'helpers/firebase'
import { Content } from 'components/layout'
import { isNight } from 'helpers'

interface Props {
  game: Game
}

interface State {}

export class Ghost extends React.Component<Props, State> {
  state: State = {}

  render() {
    const { game } = this.props

    const letters = 'abcdefghijklmnopqrstuvwxyz'.split('')

    return (
      <Content className="ghost">
        <h1>Ghost</h1>
        <div>
          {isNight(game)
            ? 'Tap (as many times) on the letter you want. The letter with the most votes wins.'
            : 'Voting begins at night'}
        </div>
        {isNight(game) && (
          <div>
            <strong>Roles remaining:</strong>{' '}
            {(game.nightPrompts || []).length + 1}
          </div>
        )}
        <div className="ghost-buttons">
          {letters.map(letter => {
            const length = Object.keys((game.ghost || {})[letter] || []).length

            return (
              <button
                disabled={!game.options.ghost || !isNight(game)}
                style={{ fontSize: `${1 + length / 50}em` }}
                key={letter}
                onClick={() => ghostVote(letter)}>
                {letter}
              </button>
            )
          })}
        </div>
      </Content>
    )
  }
}
