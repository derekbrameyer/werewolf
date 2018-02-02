import * as React from 'react'
import { render } from 'react-dom'

import './styles.scss'

import { App } from 'views'
import { database } from 'helpers/firebase'

render(<App database={database} />, document.getElementById('root'))
