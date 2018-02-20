import * as React from 'react'

interface Props extends React.ButtonHTMLAttributes<any> {
  confirm?: boolean | string
}
interface State {
  confirmTimer?: any
}

export class Button extends React.Component<Props, State> {
  state: State = {
    confirmTimer: null,
  }

  onClick = (e: any) => {
    const propsOnClick = this.props.onClick

    if (propsOnClick && this.props.confirm && !this.state.confirmTimer) {
      this.setState({
        confirmTimer: setTimeout(() => {
          this.setState({ confirmTimer: clearTimeout(this.state.confirmTimer) })
        }, 3000),
      })
    } else if (propsOnClick && this.props.confirm && this.state.confirmTimer) {
      this.setState({ confirmTimer: clearTimeout(this.state.confirmTimer) })
      propsOnClick(e)
    } else if (propsOnClick) {
      propsOnClick(e)
    }
  }

  render() {
    const { confirm, children, ...props } = this.props
    return (
      <button {...props} onClick={this.onClick}>
        {this.state.confirmTimer ? (
          <React.Fragment>
            {typeof confirm === 'string' ? confirm : `confirm: ${children}`}
          </React.Fragment>
        ) : (
          children
        )}
      </button>
    )
  }
}
