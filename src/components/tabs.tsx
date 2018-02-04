import * as React from 'react'
import * as cx from 'classnames'

interface Props {
  className?: string
  actions?: boolean
  navigation?: boolean
}

export const Tabs: React.SFC<Props> = ({
  children,
  className,
  actions,
  navigation,
}) => (
  <div className={cx('tabs', className, { actions, navigation })}>
    {children}
  </div>
)
