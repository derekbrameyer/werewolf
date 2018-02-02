import * as React from 'react'
import * as cx from 'classnames'
import { propEq, values } from 'ramda'
import { Game, nightAction, Prompt, isRoleActive } from 'interfaces/game'
import { Tabs } from 'components/tabs'
import { PlayerRow } from 'components/player'
import { getRoleTeam, Roles, Team, getRoleEmoji } from 'interfaces/roles'
import { PromptView } from 'views/game/prompt'
import { makeGameActionButtons } from 'views/game/buttons'
import { Grid } from 'components/grid'
import { Button } from 'components/button'
import { updateFirebase } from 'helpers/firebase'
import { Content } from 'components/layout'

interface Props {
  game: Game
}

interface State {}

export class GameView extends React.Component<Props, State> {
  startNight = () => {
    if (!this.props.game.nightPrompts || !this.props.game.nightPrompts.length) {
      updateFirebase({
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
    ).length
    const theLivingNonWolves = theLiving.length - theLivingWolves

    return (
      <Content>
        <Tabs navigation>
          <div>All Players: {theLiving.length}</div>
          <div className="green">Villagers: {theLivingNonWolves} </div>
          <div className="red">Wolves: {theLivingWolves}</div>
        </Tabs>

        {(this.props.game.prompts || []).map(prompt => (
          <PromptView
            game={this.props.game}
            done={game => updateFirebase({ game })}
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
                  updateFirebase({ game })
                )}
              </PlayerRow>
            ))}
        </Grid>

        <Tabs actions>
          <Button
            confirm
            className="red"
            onClick={() => updateFirebase({ game: null })}>
            end game
          </Button>
          <Button onClick={this.startNight}>
            {this.props.game.nightPrompts && this.props.game.nightPrompts.length
              ? 'next role'
              : 'start night'}
          </Button>
        </Tabs>
      </Content>
    )
  }
}
