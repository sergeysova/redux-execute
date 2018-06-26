import test from 'ava'
import { createStore, applyMiddleware } from 'redux'
import { createExecue } from '../src'


const defaultReducer = (state, action) => {
  switch (action.type) {
    case 'test': return { ...state, value: action.value }
    default: return state
  }
}

const getStore = (options = {}) => (
  createStore(
    defaultReducer,
    { value: 0 },
    applyMiddleware(createExecue(options))
  )
)

test('must pass action if not an effect', (t) => {
  const store = getStore()

  store.dispatch({ type: 'test', value: 1 })

  t.is(store.getState().value, 1)
})

test('must execute effect', (t) => {
  const store = getStore()

  const effect = () => () => t.pass()

  store.dispatch(effect)
})

test('must pass arguments through dispatch to effect', (t) => {
  const store = getStore()
  const expected = [1, 2, 3]

  const effect = (...args) => () => {
    t.deepEqual(args, expected)
  }

  store.dispatch(effect, ...expected)
})

test('must correctly run action from effect', (t) => {
  const store = getStore()

  const effect = () => (dispatch) => {
    dispatch({ type: 'test', value: 2 })
  }

  store.dispatch(effect)
  t.is(store.getState().value, 2)
})

test('must correctly get state from effect', (t) => {
  const store = getStore()

  const effect = () => (dispatch, getState) => {
    t.is(getState().value, 3)
  }

  store.dispatch({ type: 'test', value: 3 })
  store.dispatch(effect)
  t.is(store.getState().value, 3)
})

test('must correctly run another effect from effect with arguments', (t) => {
  const store = getStore()

  const effectA = (a, b) => (dispatch, getState) => {
    const result = a + b + getState().value

    dispatch({ type: 'test', value: result })
    return result
  }
  const effectB = (a) => (dispatch) => dispatch(effectA, a, 2)

  const result = store.dispatch(effectB, 1)

  t.is(result, 3)
  t.is(store.getState().value, 3)
})

test('must return promise in async effect', async (t) => {
  const store = getStore()

  const effect = (a, b) => (
    async () => await a + await b
  )

  const result = await store.dispatch(effect, Promise.resolve(1), Promise.resolve(2))

  t.is(result, 3)
})

/* eslint-disable no-console */
test('test with logging', (t) => {
  const originalLog = console.log
  const store = getStore({ log: true })
  const effect = (a, b, c) => () => {}
  const mockedLog = (...args) => {
    t.deepEqual(
      ['Effect:', 'effect', 'Arguments:', [1, 2, 3]],
      args
    )
  }

  console.log = mockedLog
  store.dispatch(effect, 1, 2, 3)
  console.log = originalLog
})
/* eslint-enable no-console */
