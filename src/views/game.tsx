import * as React from 'react'
import { propEq, values } from 'ramda'
import { Game, Prompt } from 'interfaces/game'
import { Tabs } from 'components/tabs'
import { PlayerRow } from 'components/player'
import { getRoleTeam, Roles, Team } from 'interfaces/cards'
import { PromptView } from 'components/prompt'
import { updatePlayer } from 'helpers'
import { makeGameActionButtons } from 'components/gameButtons'

// Any state you want to persist to firebase
export interface FirebaseProps {
  game: Game
}

interface Props extends FirebaseProps {
  update: (props: FirebaseProps) => void
  endGame: () => void
}

interface State {}

export class GameView extends React.Component<Props, State> {
  addPrompt = (prompt: Prompt) => {
    this.props.update({
      game: {
        ...this.props.game,
        prompts: (this.props.game.prompts || []).concat([prompt]),
      },
    })
  }

  killPlayer = (name: string) => () => {
    this.props.update({
      game: updatePlayer(this.props.game, name, { alive: false }),
    })
  }

  revivePlayer = (name: string) => () => {
    this.props.update({
      game: updatePlayer(this.props.game, name, { alive: true }),
    })
  }

  render() {
    const theLiving = values(this.props.game.players).filter(
      propEq('alive', true)
    )
    const theLivingWolves = theLiving.filter(
      p => getRoleTeam(p.role || Roles.villager) === Team.wolf
    )
    const theLivingVillagers = theLiving.filter(
      p => getRoleTeam(p.role || Roles.villager) === Team.villager
    )

    console.log(this.props.game)

    return (
      <div>
        {(this.props.game.prompts || []).map(prompt => (
          <PromptView
            game={this.props.game}
            done={game => this.props.update({ game })}
            prompt={prompt}
            key={prompt.message}
          />
        ))}

        {values(this.props.game.players).map(player => (
          <PlayerRow player={player} key={player.name}>
            {makeGameActionButtons(this.props.game, player, game =>
              this.props.update({ game })
            )}
          </PlayerRow>
        ))}

        <Tabs grow>
          <button className="red" onClick={() => this.props.endGame()}>
            end game
          </button>
          <button
            disabled={!!(this.props.game.prompts || []).length}
            onClick={() => {}}>
            next
          </button>
        </Tabs>

        <div className="floating">
          <div>{theLiving.length}</div>
          <div className="green">{theLivingVillagers.length} </div>
          <div className="red">{theLivingWolves.length}</div>
        </div>
      </div>
    )
  }
}
