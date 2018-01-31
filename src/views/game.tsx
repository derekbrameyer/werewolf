import * as React from 'react'
import { propEq, values } from 'ramda'
import { Game, nightAction, Prompt } from 'interfaces/game'
import { Tabs } from 'components/tabs'
import { PlayerRow } from 'components/player'
import { getRoleTeam, Roles, Team } from 'interfaces/cards'
import { PromptView } from 'components/prompt'
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
  startNight = () => {
    if (!this.props.game.nightPrompts || !this.props.game.nightPrompts.length) {
      this.props.update({
        game: {
          ...this.props.game,
          prompts: (this.props.game.prompts || []).concat(this.props.game.cards
            .sort((a, b) => b.weight - a.weight)
            .reduce<Prompt[]>((prompts, card) => {
              const action = nightAction(card.role)
              return action ? prompts.concat(action) : prompts
            }, [])
            .concat({
              message: 'werewolves wake up and kill someone',
            }),
        },
      })
    }

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
          <button onClick={this.startNight}>
            {this.props.game.nightPrompts && this.props.game.nightPrompts.length
              ? 'next role'
              : 'start night'}
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
