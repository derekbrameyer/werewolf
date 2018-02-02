import * as React from 'react'
import * as cx from 'classnames'

interface Props {
  className?: string
  id?: string
}

export const Row: React.SFC<Props> = ({ children, className }) => (
  <div className={cx('row', className)}>{children}</div>
)

export const RowImg: React.SFC<Props> = ({ children, className }) => (
  <div className={cx('row--img', className)}>{children}</div>
)

export const RowDetail: React.SFC<Props> = ({ children, className }) => (
  <div className={cx('row--detail', className)}>{children}</div>
)

export const RowSbuTitle: React.SFC<Props> = ({ children, className }) => (
  <div className={cx('row--subtitle', className)}>{children}</div>
)

export const RowTitle: React.SFC<Props> = ({ children, className }) => (
  <div className={cx('row--title', className)}>{children}</div>
)

export const RowActions: React.SFC<Props> = ({ children, className }) => (
  <div className={cx('row--actions', className)}>{children}</div>
)

export const Content: React.SFC<Props> = ({ children, className }) => (
  <div className={cx('content', className)}>{children}</div>
)
