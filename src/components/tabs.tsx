import * as React from 'react'
import * as cx from 'classnames'
import { Row } from 'components/row'

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
  <Row className={cx('tabs', className, { actions, navigation })}>
    {children}
  </Row>
)
