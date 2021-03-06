import { Actions } from 'interfaces/actions'

export interface Prompt {
  key?: string
  message: string
  target?: string
  actions?: (Actions)[]
  className?: string
  nightPrompt?: boolean
}
