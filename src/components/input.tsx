import * as React from 'react'

interface Props {
  onSubmit?: (value: any) => void
  onChange?: (value: any) => void
  label: string
  id: string
  className?: string
  type?: 'text' | 'tel' | 'checkbox'
  value?: any
  checked?: any
}

export const Input: React.SFC<Props> = ({
  value,
  className,
  onChange,
  onSubmit,
  label,
  type,
  checked,
  id,
}) => (
  <div className="input-container">
    <label htmlFor={id}>{label}</label>
    <input
      id={id}
      type={type}
      value={value}
      checked={checked}
      onChange={e => onChange && onChange(e)}
      onKeyPress={e => e.key === 'Enter' && onSubmit && onSubmit(e)}
    />
  </div>
)
