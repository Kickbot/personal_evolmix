const css = {
  success: 'color: green; font-weight:normal;',
  error: 'color: red; font-weight:bold;',
  bold: 'font-weight:bold;',
}
const log = (name, style) => console.log('%c' + name, style)
const dir = console.dir || console.log
const group = (name, style) =>
  console.group ? console.group('%c' + name, style) : console.log('%c' + name, style)
const groupCollapsed = (name, style) =>
  console.groupCollapsed
    ? console.groupCollapsed('%c' + name, style)
    : console.log('%c' + name, style)
const groupEnd = () => {
  console.groupEnd && console.groupEnd()
}
const groupRed = (...args) => group(args.join(' '), css.error)
const logBold = title => log(title, css.bold)
// const logRed = message => log(message, css.error)
const logValue = (title, value) => {
  logBold(title)
  dir(value)
}

const isDev = import.meta.env.DEV

export const logSuccessGroup = isDev
  ? (name, items) => {
      groupCollapsed(name, css.success)
      for (const [item, value] of Object.entries(items)) {
        logValue(item, value)
      }
      groupEnd()
    }
  : () => {}

export const logErrorGroup = isDev
  ? (name, items) => {
      groupRed(name)
      for (const [item, value] of Object.entries(items)) {
        logValue(item, value)
      }
      groupEnd()
    }
  : () => {}
