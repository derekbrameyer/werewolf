import * as React from 'react'
import { Game } from 'interfaces/game'
import { updateFirebase } from 'helpers/firebase'
import { Content } from 'components/layout'
import { Input } from 'components/input'

interface Props {
  game: Game
  playerName: string
}

interface State {
  comment: string
}

export class Chat extends React.Component<Props, State> {
  state: State = { comment: '' }

  render() {
    const { playerName, game } = this.props
    return (
      <Content className="chat">
        <h1>Chat</h1>
        <Input
          label="Message:"
          id="chat-input"
          value={this.state.comment}
          onChange={e => this.setState({ comment: e.target.value })}
          onSubmit={e => {
            const comment = e.target.value.trim()
            if (!comment) return

            this.setState({ comment: '' })

            updateFirebase({
              game: {
                ...game,
                chat: [
                  {
                    playerName,
                    comment,
                  },
                  ...(game.chat || []),
                ],
              },
            })
          }}
        />
        <ul>
          {(game.chat || []).map((chat, i) => (
            <li className="comment" key={i}>
              <strong className="player-name">{chat.playerName}:</strong>
              {chat.comment}
            </li>
          ))}
        </ul>
      </Content>
    )
  }
}
