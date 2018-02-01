import * as React from 'react'
import * as cx from 'classnames'
import { Row } from 'components/row'

interface Props {
  className?: string
}

export const Tabs: React.SFC<Props> = ({ children, className }) => (
  <Row className={cx('tabs', className)}>{children}</Row>
)
