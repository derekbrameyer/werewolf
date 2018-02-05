import * as React from 'react'
import { Input } from 'components/input'
import { updateFirebase } from 'helpers/firebase'
import { Content } from 'components/layout'
import { Tabs } from 'components/tabs'
import { Button } from 'components/button'

interface Props {
  timeLimit: number
  noFlip: boolean
}

export class Options extends React.Component<Props> {
  render() {
    return (
      <Content>
        <Input
          id="time-limit"
          type="tel"
          value={this.props.timeLimit}
          label="Day Timer:"
          onChange={e =>
            updateFirebase({ timeLimit: parseInt(e.target.value || '0', 10) })
          }
        />

        <Input
          id="no-flip"
          type="checkbox"
          checked={!!this.props.noFlip}
          label="No Flip:"
          onChange={e => {
            updateFirebase({ noFlip: !!e.target.checked })
          }}
        />

        <Tabs actions>
          <Button
            confirm
            className="red"
            onClick={() => updateFirebase({ timeLimit: 120, noFlip: false })}>
            reset options
          </Button>
        </Tabs>
      </Content>
    )
  }
}
