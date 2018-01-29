import * as React from 'react'
import * as cx from 'classnames'
import { Row } from 'components/row'

interface Props {
  className?: string
  grow?: boolean
}

export const Tabs: React.SFC<Props> = ({ children, className, grow }) => (
  <Row className={cx('tabs', className, { 'tabs--expand': grow })}>
    {children}
  </Row>
)
