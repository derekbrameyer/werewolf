import * as React from 'react'
import { propEq } from 'ramda'
import { Game, Death, Player } from 'interfaces/game'
import { Tabs } from 'components/tabs'
import { PlayerRow } from 'components/player'
import { gameHasMasons, updateFirst } from 'helpers'
import { getCardTeam, Roles, Team } from 'interfaces/cards'

// Any state you want to persist to firebase
export interface FirebaseProps {
  game: Game
}

interface Props extends FirebaseProps {
  update: (props: FirebaseProps) => void
  endGame: () => void
}

interface State {}

// Game helpers
const updatePlayer = (
  game: Game,
  player: Player,
  attributes: Partial<Player>
): Game => {
  return {
    ...game,
    players: updateFirst(
      propEq('name', player.name),
      p => ({ ...p, ...attributes }),
      game.players
    ),
  }
}

export class GameView extends React.Component<Props, State> {
  killPlayer = (reason: Death, player: Player) => () => {
    this.props.update({
      game: updatePlayer(this.props.game, player, { alive: false }),
    })
  }

  revivePlayer = (player: Player) => () => {
    this.props.update({
      game: updatePlayer(this.props.game, player, { alive: true }),
    })
  }

  render() {
    const theLiving = this.props.game.players.filter(propEq('alive', true))
    const theLivingWolves = theLiving.filter(
      p => getCardTeam(p.role || Roles.villager) === Team.wolf
    )
    const theLivingVillagers = theLiving.filter(
      p => getCardTeam(p.role || Roles.villager) === Team.villager
    )

    return (
      <div>
        <h1>game started!</h1>

        {this.props.game.players.map(player => (
          <PlayerRow player={player} key={player.name}>
            {player.alive && (
              <button onClick={this.killPlayer('lynch', player)}>lynch</button>
            )}
            {player.alive &&
              gameHasMasons(this.props.game) && (
                <button onClick={this.killPlayer('mason', player)}>
                  mason
                </button>
              )}
            {player.alive && (
              <button onClick={this.killPlayer('other', player)}>other</button>
            )}
            {!player.alive && (
              <button onClick={this.revivePlayer(player)}>revive</button>
            )}
          </PlayerRow>
        ))}

        <Tabs grow>
          <button className="red" onClick={() => this.props.endGame()}>
            end game
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
