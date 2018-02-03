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
      this.setState({ time: Math.max(this.state.time - this.interval, 0) })
      if (!this.state.time) {
        clearTimeout(this.timer)
      }
    }, this.interval)
  }

  render() {
    return (
      <div
        className={cx('timer', this.props.className)}
        style={{
          width: `${this.state.time / this.props.timeLimit * 100}%`,
          backgroundColor: 'red',
          height: 4,
          display: 'block',
          position: 'absolute',
          bottom: 0,
          left: 0,
          transition: `width ${this.interval}ms linear`,
        }}
      />
    )
  }
}
