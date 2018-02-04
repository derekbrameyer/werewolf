import * as React from 'react'
import * as cx from 'classnames'

interface Props {
  className?: string
  id?: string
}

export const Actions: React.SFC<Props> = ({ children, className }) => (
  <div className={cx('actions', className)}>{children}</div>
)

export const Content: React.SFC<Props> = ({ children, className }) => (
  <div className={cx('content', className)}>{children}</div>
)
