import * as React from 'react'
import * as cx from 'classnames'

interface Props {
  className?: string
}

export const Grid: React.SFC<Props> = ({ className, ...props }) => (
  <div {...props} className={cx('grid', className)} />
)
