export const createExecue = ({ log = false } = {}) => (
  ({ dispatch, getState }) => (next) => (fn, ...args) => {
    if (typeof fn === 'function') {
      if (log) {
      // eslint-disable-next-line no-console
        console.log('Effect:', fn.name, 'Arguments:', args)
      }
      const thunk = fn(...args)

      if (typeof thunk !== 'function') {
        throw new TypeError('Effect should return `function(dispatch, getState){}`. '
        + 'Maybe you passed actionCreator to dispatch without call it?')
      }

      return thunk(dispatch, getState)
    }
    return next(fn, ...args)
  }
)
