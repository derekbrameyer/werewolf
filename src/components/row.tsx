import * as React from 'react'
import * as cx from 'classnames'
import { Tabs } from 'components/tabs'

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

export const RowTitle: React.SFC<Props & { subtitle?: string }> = ({
  children,
  className,
  subtitle,
}) => (
  <div className={cx('row--title', className)}>
    {children}
    <span className="row--subtitle">{subtitle}</span>
  </div>
)

export const RowActions: React.SFC<Props> = ({ children, className }) => (
  <Tabs className={cx('row--actions', className)}>{children}</Tabs>
)
