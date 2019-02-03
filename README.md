# redux-execute [![Maintainability](https://api.codeclimate.com/v1/badges/1448aef0f57513e42c0c/maintainability)](https://codeclimate.com/github/sergeysova/redux-execute/maintainability) [![Build Status](https://travis-ci.com/sergeysova/redux-execute.svg?branch=master)](https://travis-ci.com/sergeysova/redux-execute) [![Coverage Status](https://coveralls.io/repos/github/sergeysova/redux-execute/badge.svg?branch=master)](https://coveralls.io/github/sergeysova/redux-execute?branch=master)

## Readme

## Installation

> Note: redux-execute requires redux@^4.0.0

```sh
npm install --save redux-execute
```

ES modules:

```js
import { createExecue } from "redux-execute"
```

CommonJS:

```js
const { createExecue } = require("redux-execute")
```

## Why do I need this?

Please, read [introduction to thunks in Redux](https://stackoverflow.com/questions/35411423/how-to-dispatch-a-redux-action-with-a-timeout/35415559#35415559). Execue just another way to run and test thunks(effects).

## Motivation

Redux Execue [middleware](https://github.com/reactjs/redux/blob/master/docs/advanced/Middleware.md) allows you to write "action creators" that return function instead of an action. These action creators are called effects. The effect can be used to delay the dispatch an action, or to dispatch another effect, or to dispatch only if a certain condition is met. The inner function receives the store methods `dispatch` and `getState` as parameters.

An action creator that returns a function to perform asynchronous dispatch:

```js
const setValue = (value) => ({
  type: "SET_VALUE",
  payload: { value },
})

const setValueWithDelay = (value) => (dispatch) => {
  setTimeout(() => {
    // classic dispatch action
    dispatch(setValue(value))
  }, 1000)
}
```

Effect that dispatch another effect:

```js
const incrementWithDelay = () => (dispatch, getState) => {
  const { value } = getState()

  // Just pass effect and all arguments as arguments of dispatch
  dispatch(setValueWithDelay, value + 1)
}
```

## What is an effect?

An effect is a [thunk](https://en.wikipedia.org/wiki/Thunk) that called by `dispatch`.

```js
const effect = (a, b) => (dispatch, getState) => {
  return a + b
}

store.dispatch(effect, 1, 2) // 3
```

[See also](https://github.com/reduxjs/redux-thunk#whats-a-thunk)

## Composition

Any return value from the inner function of effect will be available as the return value of `dispatch` itself. This is convenient for orchestrating an asynchronous control flow with effects dispatching each other and returning Promises to wait for each other's completion.

```js
const requestGet = (url) => () =>
  fetch(`/api${url}`).then((response) => response.json())

const userPostsFetch = (userId) => async (dispatch) => {
  const user = await dispatch(requestGet, `/users/${userId}`)

  if (user.isActive) {
    return dispatch(requestGet, `/users/${userId}/posts`)
  }

  return []
}
```

## Logger

Redux Execue has logger out of the box. You can combine it with [redux-logger](https://github.com/evgenyrodionov/redux-logger):

```js
import { createStore, applyMiddleware } from "redux"
import { createLogger } from "redux-logger"
import { createExecue } from "redux-execute"

import { rootReducer } from "./reducers"

const store = createStore(
  rootReducer,
  applyMiddleware(
    createExecue({ log: true }),
    createLogger({ collapsed: true }),
  ),
)
```
