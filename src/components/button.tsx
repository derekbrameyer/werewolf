import * as React from 'react'

interface Props extends React.ButtonHTMLAttributes<any> {
  confirm?: boolean
}

export class Button extends React.Component<Props> {
  private confirmTimer: any = null

  onClick = (e: any) => {
    const propsOnClick = this.props.onClick

    if (propsOnClick && this.props.confirm && !this.confirmTimer) {
      this.confirmTimer = setTimeout(() => {
        if (this.confirmTimer) {
          this.confirmTimer = null
          propsOnClick(e)
        }
      }, 3000)
    } else if (propsOnClick && this.props.confirm && this.confirmTimer) {
      clearTimeout(this.confirmTimer)
      this.confirmTimer = null
      propsOnClick(e)
    }
  }

  render() {
    const { confirm, ...props } = this.props
    return <button {...props} />
  }
}
