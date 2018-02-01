import * as React from 'react'
import * as cx from 'classnames'
import { propEq, values } from 'ramda'
import { Game, nightAction, Prompt, isRoleActive } from 'interfaces/game'
import { Tabs } from 'components/tabs'
import { PlayerRow } from 'components/player'
import { getRoleTeam, Roles, Team, getRoleEmoji } from 'interfaces/cards'
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
                const prompt = nightAction(card.role)
                return prompt
                  ? prompts.concat({
                      ...prompt,
                      message: `${getRoleEmoji(card.role)} ${
                        prompt.message
                      } ${getRoleEmoji(card.role)}`,
                      className: cx({
                        dim: !isRoleActive(this.props.game, card.role),
                      }),
                    })
                  : prompts
              }, [])
              .concat({
                message: `${getRoleEmoji(
                  Roles.werewolf
                )} werewolves wake up and kill someone ${getRoleEmoji(
                  Roles.werewolf
                )}`,
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

    return (
      <div>
        <Tabs navigation>
          <div>All Players: {theLiving.length}</div>
          <div className="green">Villagers: {theLivingVillagers.length} </div>
          <div className="red">Wolves: {theLivingWolves.length}</div>
        </Tabs>

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
            .sort((a, b) => (a.alive ? 1 : 0))
            .map(player => (
              <PlayerRow player={player} key={player.name}>
                {makeGameActionButtons(this.props.game, player, game =>
                  this.props.update({ game })
                )}
              </PlayerRow>
            ))}
        </Grid>

        <Tabs actions>
          <Button confirm className="red" onClick={() => this.props.endGame()}>
            end game
          </Button>
          <Button onClick={this.startNight}>
            {this.props.game.nightPrompts && this.props.game.nightPrompts.length
              ? 'next role'
              : 'start night'}
          </Button>
        </Tabs>
      </div>
    )
  }
}
