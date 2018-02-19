import { isPlayerAlive } from '../../helpers'
import * as React from 'react'
import * as cx from 'classnames'
import { propEq, values } from 'ramda'
import { Game, nightAction, isRoleActive, performAction } from 'interfaces/game'
import { Tabs } from 'components/tabs'
import { PlayerRow } from 'components/player'
import {
  getRoleTeam,
  Roles,
  Team,
  getRoleEmoji,
  getCard,
} from 'interfaces/roles'
import { PromptView } from 'views/game/prompt'
import { makeGameButtons } from 'views/game/buttons'
import { Grid } from 'components/grid'
import { Button } from 'components/button'
import { updateFirebase } from 'helpers/firebase'
import { Content } from 'components/layout'
import { gameHasRole, comparePlayersFull, isNight, getGameRoles } from 'helpers'
import { Prompt } from 'interfaces/prompt'
import { Timer } from 'components/timer'
import { updatePlayer } from 'helpers/index'

interface Props {
  game: Game
}

export class GameView extends React.Component<Props> {
  startNight = () => {
    if (isNight(this.props.game)) return

    let game = this.props.game

    const cards = getGameRoles(game).map(getCard)

    const currentWolves = values(game.players)
      .filter(player => isPlayerAlive(game, player.name))
      .filter(player => getRoleTeam(player.role) === 'wolf')

    const isFangFaceActive =
      currentWolves.length == 1 && currentWolves[0].role === 'fang face'

    const nightPrompts: Prompt[] = cards
      .sort((a, b) => b.weight - a.weight)
      .reduce<Prompt[]>((prompts, card, i) => {
        const prompt = nightAction(card.role)
        const active = isRoleActive(game, card.role)

        return prompt &&
          (game.options.noFlip || (!game.options.noFlip && active))
          ? prompts.concat({
              ...prompt,
              key: `${i}.${Math.random()}).toString()`,
              message: `${getRoleEmoji(card.role)} ${
                prompt.message
              } ${getRoleEmoji(card.role)}`,
              className: cx({
                dim: !active,
              }),
              required: true,
              nightPrompt: true,
            })
          : prompts
      }, [])
      .concat({
        required: true,
        nightPrompt: true,
        message: `${getRoleEmoji(
          isFangFaceActive ? Roles['fang face'] : Roles.werewolf
        )} ${
          isFangFaceActive ? 'fangface' : 'werewolves'
        } wake up and kill someone ${
          isFangFaceActive
            ? getRoleEmoji(Roles['fang face'])
            : getRoleEmoji(Roles.werewolf)
        }`,
      })

    const tempStatuses = values(game.players).filter(player => {
      return !!player.silenced
    })

    tempStatuses.map(player => {
      game = updatePlayer(game, player.name, {
        silenced: false,
      })
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
        <Tabs navigation className="stats">
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
          <Timer
            key={this.props.game.dayCount}
            timeLimit={this.props.game.options.timeLimit || 0}
          />
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
              <PlayerRow
                isActive={this.props.game.activePlayer === player.name}
                onClick={() =>
                  updateFirebase({
                    game: {
                      ...this.props.game,
                      activePlayer:
                        this.props.game.activePlayer === player.name
                          ? null
                          : player.name,
                    },
                  })
                }
                player={player}
                key={player.name}>
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
              !isNight(this.props.game)
                ? this.startNight()
                : updateFirebase({
                    game: performAction(this.props.game, {
                      type: 'next role',
                      target: null,
                    }),
                  })
            }>
            {!(this.props.game.nightPrompts || []).length &&
            isNight(this.props.game)
              ? 'end night'
              : isNight(this.props.game) ? 'next role' : 'start night'}
          </Button>
        </Tabs>
      </Content>
    )
  }
}
