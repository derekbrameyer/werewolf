import * as React from 'react'
import * as cx from 'classnames'

interface Props {
  classNames?: string
}

export const Grid: React.SFC<Props> = ({ classNames, ...props }) => (
  <div {...props} className={cx('grid', classNames)} />
)
