import * as React from 'react'
import * as cx from 'classnames'

interface Props {
  className?: string
  timeLimit: number // seconds
}

interface State {
  time: number
}

export class Timer extends React.Component<Props, State> {
  state: State = { time: this.props.timeLimit }
  private timer: any | null = null
  private interval = 200

  componentDidMount() {
    this.tick()
  }
  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  tick = () => {
    this.timer = setTimeout(() => {
      this.tick()
      this.setState({
        time: Math.max(this.state.time - this.interval / 1000, 0),
      })
      if (!this.state.time) {
        clearTimeout(this.timer)
      }
    }, this.interval)
  }

  render() {
    return (
      <React.Fragment>
        <div
          className={cx('timer', this.props.className)}
          style={{
            width: `${this.state.time / this.props.timeLimit * 100}%`,
            transition: `width ${this.interval}ms linear`,
          }}
        />
        <div
          className={cx('timer-completed', this.props.className)}
          style={{
            width: `${100 - this.state.time / this.props.timeLimit * 100}%`,
            transition: `width ${this.interval}ms linear`,
          }}
        />
      </React.Fragment>
    )
  }
}
