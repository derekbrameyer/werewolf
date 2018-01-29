import * as React from 'react'
import * as cx from 'classnames'

interface Props {
  weight: number
}

export const Weight: React.SFC<Props> = ({ weight }) => (
  <span className={cx({ green: weight > 0, red: weight < 0 })}>{weight}</span>
)
