import * as React from 'react'
import * as cx from 'classnames'
import { propEq, values } from 'ramda'
import { Game, nightAction, isRoleActive, performAction } from 'interfaces/game'
import { Tabs } from 'components/tabs'
import { PlayerRow } from 'components/player'
import { getRoleTeam, Roles, Team, getRoleEmoji } from 'interfaces/roles'
import { PromptView } from 'views/game/prompt'
import { makeGameButtons } from 'views/game/buttons'
import { Grid } from 'components/grid'
import { Button } from 'components/button'
import { updateFirebase } from 'helpers/firebase'
import { Content } from 'components/layout'
import { gameHasRole, comparePlayersFull } from 'helpers'
import { Prompt } from 'interfaces/prompt'

interface Props {
  game: Game
}

interface State {}

export class GameView extends React.Component<Props, State> {
  startNight = () => {
    if (!this.props.game.nightPrompts || !this.props.game.nightPrompts.length) {
      const nightPrompts: Prompt[] = this.props.game.cards
        .sort((a, b) => b.weight - a.weight)
        .reduce<Prompt[]>((prompts, card, i) => {
          const prompt = nightAction(card.role)
          const active = isRoleActive(this.props.game, card.role)

          return prompt &&
            (this.props.game.options.noFlip ||
              (!this.props.game.options.noFlip && active))
            ? prompts.concat({
                ...prompt,
                key: `${i}.${Math.random()}).toString()`,
                message: `${getRoleEmoji(card.role)} ${
                  prompt.message
                } ${getRoleEmoji(card.role)}`,
                className: cx({
                  dim: !active,
                }),
                actions: ['next role'],
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

      const [firstPrompt, ...rest] = nightPrompts

      updateFirebase({
        game: {
          ...this.props.game,
          nightKills: [],
          nightPrompts: rest,
          prompts: (this.props.game.prompts || []).concat(firstPrompt),
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

    const theLivingVampires = theLiving.filter(
      p => getRoleTeam(p.role || Roles.villager) === Team.vampire
    ).length

    const theLivingNonWolves =
      theLiving.length - theLivingWolves - theLivingVampires

    return (
      <Content>
        <Tabs navigation>
          <div>All Players: {theLiving.length}</div>
          <div className="green">
            {getRoleEmoji(Roles.villager)}: {theLivingNonWolves}{' '}
          </div>
          <div className="red">
            {getRoleEmoji(Roles.werewolf)}: {theLivingWolves}
          </div>
          {gameHasRole(this.props.game, Roles.vampire) && (
            <div className="red">
              {getRoleEmoji(Roles.vampire)}: {theLivingVampires}
            </div>
          )}
        </Tabs>

        {this.props.game.nightKills && (
          <h3 className="night-kills">
            Killed tonight: {this.props.game.nightKills.join(', ')}
          </h3>
        )}

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
            .sort(comparePlayersFull)
            .map(player => (
              <PlayerRow player={player} key={player.name}>
                {makeGameButtons(this.props.game, player)}
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
          <Button
            onClick={() =>
              this.props.game.nightPrompts &&
              this.props.game.nightPrompts.length
                ? updateFirebase({
                    game: performAction(this.props.game, {
                      type: 'next role',
                      target: null,
                    }),
                  })
                : this.startNight()
            }>
            {this.props.game.nightPrompts && this.props.game.nightPrompts.length
              ? 'next'
              : 'start night'}
          </Button>
        </Tabs>
      </Content>
    )
  }
}
