export const createExecue = ({ log = false } = {}) => (
  ({ dispatch, getState }) => (next) => (action, ...args) => {
    if (typeof action === 'function') {
      if (log) {
      // eslint-disable-next-line no-console
        console.log('Effect:', action.name, 'Arguments:', args)
      }
      const effect = action(...args)

      if (typeof effect !== 'function') {
        throw new TypeError('Effect should return `function(dispatch, getState){}`. '
        + 'Maybe you passed actionCreator to dispatch without call it?')
      }

      return effect(dispatch, getState)
    }
    return next(action, ...args)
  }
)
