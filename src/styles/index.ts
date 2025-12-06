import { classes } from './classes'
import { markdown } from './markdown'
import { numbering } from './numbering'
import { defaultStyle } from './styles'
import { defaultTheme } from './themes'

export * from './classes'
export * from './themes'
export * from './numbering'
export * from './markdown'
export * from './styles'

export const styles = {
  // ? Compatible with lower version export configuration
  colors: defaultTheme,
  themes: defaultTheme,
  classes,
  default: defaultStyle,
  markdown,
  numbering,
}
