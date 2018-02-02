import * as React from 'react'
import { Row } from 'components/layout'

interface Props {
  onSubmit: (value: any) => void
  onChange: (value: any) => void
  label: string
  id: string
  className?: string
  value: any
}

export const Input: React.SFC<Props> = ({
  value,
  className,
  onChange,
  onSubmit,
  label,
  id,
}) => (
  <Row className="input-container">
    <label htmlFor={id}>{label}</label>
    <input
      id={id}
      value={value}
      onChange={e => onChange(e.target.value)}
      onKeyPress={e => e.key === 'Enter' && onSubmit(value)}
    />
  </Row>
)
