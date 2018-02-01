import * as React from 'react'
import { propEq, values } from 'ramda'
import { Game, nightAction, Prompt, Player } from 'interfaces/game'
import { Tabs } from 'components/tabs'
import { PlayerRow } from 'components/player'
import { getRoleTeam, Roles, Team, getRoleWeight } from 'interfaces/cards'
import { PromptView } from 'components/prompt'
import { makeGameActionButtons } from 'components/gameButtons'
import { Grid } from 'components/grid'
import { Button } from 'components/button'

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
          prompts: (this.props.game.prompts || []).concat(
            this.props.game.cards
              .sort((a, b) => b.weight - a.weight)
              .reduce<Prompt[]>((prompts, card) => {
                const action = nightAction(card.role)
                return action ? prompts.concat(action) : prompts
              }, [])
              .concat({
                message: 'werewolves wake up and kill someone',
              })
          ),
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

    const isGood = (player: Player): boolean =>
      getRoleTeam(player.role) === Team.villager ||
      getRoleTeam(player.role) === Team.tanner

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

        <Grid>
          {values(this.props.game.players)
            .filter(p => isGood(p))
            .sort(
              (a, b) =>
                Math.abs(getRoleWeight(b.role)) -
                Math.abs(getRoleWeight(a.role))
            )
            .sort((a, b) => (a.alive ? 1 : 0))
            .map(player => (
              <PlayerRow player={player} key={player.name}>
                {makeGameActionButtons(this.props.game, player, game =>
                  this.props.update({ game })
                )}
              </PlayerRow>
            ))}
        </Grid>

        <Tabs>
          <Button confirm className="red" onClick={() => this.props.endGame()}>
            end game
          </Button>
          <Button onClick={this.startNight}>
            {this.props.game.nightPrompts && this.props.game.nightPrompts.length
              ? 'next role'
              : 'start night'}
          </Button>
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
