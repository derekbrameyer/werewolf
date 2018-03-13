import { isPlayerAlive } from '../../helpers'
import * as React from 'react'
import * as cx from 'classnames'
import { propEq, values, contains, equals } from 'ramda'
import {
  Game,
  isRoleActive,
  performAction,
  isRoleOmitted,
} from 'interfaces/game'
import { Tabs } from 'components/tabs'
import { PlayerRow } from 'components/player'
import { getCard } from 'interfaces/roles'
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
  makeWerewolfPrompt = (): Prompt => {
    const allWolves = getGameRoles(this.props.game).filter(
      role => getCard(role).team === 'wolf'
    )

    const livingWolves = values(this.props.game.players)
      .filter(player => isPlayerAlive(this.props.game, player.name))
      .filter(player => getCard(player.role).team === 'wolf')
      .map(player => player.role)

    const isFangFaceInGame = contains('fang face', allWolves)
    const isBigBadWolfAlive = contains('big bad wolf', livingWolves)

    const isOnlyFangFace = equals(livingWolves, ['fang face'])
    const isOnlyFruitBrute = equals(livingWolves, ['fruit brute'])

    const wasWolfCubKilled = !!(this.props.game.nightKills || []).find(
      playerName => this.props.game.players[playerName].role === 'wolf cub'
    )

    // prettier-ignore
    const emoji =
        wasWolfCubKilled        ? getCard('wolf cub').emoji :
        isBigBadWolfAlive       ? getCard('big bad wolf').emoji :
        livingWolves.length > 1 ? getCard('werewolf').emoji :
        !livingWolves.length    ? getCard('werewolf').emoji :
                                  getCard(livingWolves[0]).emoji

    // prettier-ignore
    const wakeUpAndKillPeople = 'wake up and kill ' + (
        wasWolfCubKilled && isBigBadWolfAlive ? 'three people' :
        wasWolfCubKilled || isBigBadWolfAlive ? 'two people' :
                                                 'someone'
    )

    // prettier-ignore
    const message =
        isOnlyFruitBrute ? `fruit brute wake up and eat some fruit` :
        isOnlyFangFace   ? `fang face ${wakeUpAndKillPeople}` :
        isFangFaceInGame ? `werewolves except fang face, ${wakeUpAndKillPeople}` :
                           `werewolves, ${wakeUpAndKillPeople}`

    return {
      nightPrompt: true,
      message: `${emoji} ${message} ${emoji}`,
    }
  }

  startNight = () => {
    if (isNight(this.props.game)) return

    let game = this.props.game

    const drunkMessage =
      this.props.game.dayCount === 2
        ? `${
            getCard('drunk').emoji
          } Drunk sober up, and receive your true identity. You can wake with the werewolves if you are now a werewolf 😏`
        : this.props.game.dayCount > 2
          ? `${getCard('drunk').emoji} Drunk wake up and do something`
          : ``

    const drunk = values(game.players).find(player => player.drunk)

    const nightPrompts: Prompt[] = getGameRoles(game)
      .filter(role => !drunk || role !== drunk.role)
      .map(getCard)
      .sort((a, b) => b.weight - a.weight)
      .reduce<Prompt[]>((prompts, card, i) => {
        const active = isRoleActive(game, card.role)

        return card.nightMessage &&
          (game.options.noFlip || (!game.options.noFlip && active))
          ? prompts.concat({
              message: `${card.emoji} ${card.nightMessage} ${card.emoji}`,
              className: cx({ dim: !active || isRoleOmitted(game, card.role) }),
              nightPrompt: true,
            })
          : prompts
      }, [])
      .concat(
        !!~game.initialRoles.indexOf('drunk') && drunkMessage
          ? {
              message: drunkMessage,
              nightPrompt: true,
            }
          : []
      )
      .concat(this.makeWerewolfPrompt())

    values(game.players).forEach(player => {
      game = updatePlayer(game, player.name, { silenced: false })
    })

    updateFirebase({
      game: {
        ...this.props.game,
        nightKills: [],
        nightPrompts: nightPrompts.slice(1),
        prompts: (this.props.game.prompts || []).concat(nightPrompts[0]),
      },
    })
  }

  render() {
    const theLiving = values(this.props.game.players).filter(
      propEq('alive', true)
    )
    const theLivingWolves = theLiving.filter(
      p => getCard(p.role).team === 'wolf'
    ).length

    const theLivingVampires = theLiving.filter(
      p => getCard(p.role).team === 'vampire'
    ).length

    const theLivingNonWolves =
      theLiving.length - theLivingWolves - theLivingVampires

    return (
      <Content>
        <Tabs navigation className="stats">
          <div className="game-passcode">
            {this.props.game.passcode}
            <h3>passcode</h3>
          </div>
          <div>All Players: {theLiving.length}</div>
          <div className="green">
            {getCard('villager').emoji}: {theLivingNonWolves}{' '}
          </div>
          <div className="red">
            {getCard('werewolf').emoji}: {theLivingWolves}
          </div>
          {gameHasRole(this.props.game, 'vampire') && (
            <div className="red">
              {getCard('vampire').emoji}: {theLivingVampires}
            </div>
          )}
          <Timer
            key={this.props.game.dayCount}
            display="bar"
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
