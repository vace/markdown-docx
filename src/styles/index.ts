import { classes } from './classes'
import { colors } from './colors'
import { markdown } from './markdown'
import { numbering } from './numbering'
import { defaultStyle } from './styles'

export * from './classes'
export * from './colors'
export * from './numbering'
export * from './markdown'
export * from './styles'

export const styles = {
  colors,
  classes,
  default: defaultStyle,
  markdown,
  numbering,
}
