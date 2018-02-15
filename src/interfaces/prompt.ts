import { Actions, PregameAction } from 'interfaces/actions'
import { Roles } from 'interfaces/roles'

export interface Prompt {
  key?: string
  message: string
  target?: string
  actions?: (Actions)[]
  className?: string
  required?: boolean
}

export interface SetupPrompt {
  role: Roles
  message: string
  action?: PregameAction
  className?: string
}
