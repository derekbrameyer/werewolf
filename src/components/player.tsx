import * as React from 'react'
import * as cx from 'classnames'
import { Player } from 'interfaces/player'
import { Tabs } from './tabs'
import { getCard } from 'interfaces/roles'

interface Props {
  player: Player
  onClick?: () => void
  isActive: boolean
}

export const PlayerRow: React.SFC<Props> = ({
  player,
  children,
  onClick,
  isActive,
}) => {
  const reminders = (
    <h2>
      {player.protected && '🛡'}
      {player.blessed && '🙏'}
      {player.bitten && '🦇'}
      {player.indoctrinated && '🍷'}
      {player.silenced && '🤐'}
      {player.exiled && '👵'}
      {player.betOn && '🎲'}
      {player.drunk && '🍻'}
    </h2>
  )

  const image = getCard(player.role).image

  return (
    <React.Fragment>
      <button
        onClick={onClick}
        className={cx('player', { dim: !player.alive })}>
        <img className="role-profile" src={image} />
        <h2>{player.name}</h2>
        {reminders}
      </button>

      {isActive && (
        <div className="modal">
          <Tabs navigation>
            <h1>
              {player.name} {player.role && `(${player.role})`}
            </h1>
          </Tabs>
          {reminders}
          <img className="role-profile" src={image} />
          {player.links && <h3>links to: {player.links.join(', ')}</h3>}
          {player.copiedBy && <h3>copied by: {player.copiedBy}</h3>}

          {children}

          <Tabs actions>
            <button onClick={onClick}>close</button>
          </Tabs>
        </div>
      )}
    </React.Fragment>
  )
}
