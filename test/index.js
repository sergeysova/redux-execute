import test from 'ava'
import { createExecue } from '../src'


const execueMiddleware = createExecue()

const doDispatch = () => {}
const doGetState = () => {}
const nextHandler = execueMiddleware({ dispatch: doDispatch, getState: doGetState })

test('must return a function to handle next', (t) => {
  t.is(typeof nextHandler, 'function')
  t.is(nextHandler.length, 1)
})

test('must return a function to handle action', (t) => {
  const actionHandler = nextHandler()

  t.is(typeof actionHandler, 'function')
  t.is(actionHandler.length, 1)
})

test('must run the given effect with dispatch and getState', (t) => {
  const actionHandler = nextHandler()

  const effect = () => (dispatch, getState) => {
    t.is(dispatch, doDispatch)
    t.is(getState, doGetState)
    t.pass()
  }

  actionHandler(effect)
})

test('must pass action to next if not a function', (t) => {
  const actionObj = {}

  const actionHandler = nextHandler((action) => {
    t.is(action, actionObj)
  })

  actionHandler(actionObj)
})

test('must return the return value of next if not a function', (t) => {
  const expected = 'foo'
  const actionHandler = nextHandler(() => expected)

  const outcome = actionHandler()

  t.is(outcome, expected)
})

test('must return value as expected if an effect', (t) => {
  const expected = 'bar'
  const actionHandler = nextHandler()

  const outcome = actionHandler(() => () => expected)

  t.is(outcome, expected)
})

test('must pass all arguments to effect', (t) => {
  const expected = [1, 2, 3]
  const actionHandler = nextHandler()

  const effect = (...args) => () => {
    t.deepEqual(args, expected)
  }

  actionHandler(effect, ...expected)
})

test('must be invoked synchronously if an effect', (t) => {
  const actionHandler = nextHandler()
  let mutated = 0

  actionHandler(() => () => mutated++)
  t.is(mutated, 1)
})

test('must throw if argument is non-object', (t) => {
  t.throws(() => execueMiddleware())
})

test('must throw if passed function not returns function', (t) => {
  const actionHandler = nextHandler()

  t.throws(() => actionHandler(() => {}))
})

