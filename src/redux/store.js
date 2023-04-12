import {createStore, applyMiddleware, compose} from 'redux'
import createSagaMiddleware from 'redux-saga'
import {REACT_ENV_TYPE} from '../constants'
import {rootReducer} from './reducers/index'
import rootSaga from './sagas'

// create the saga middleware
const sagaMiddleware = createSagaMiddleware()

const store =
  REACT_ENV_TYPE !== 'PROD'
    ? createStore(
        rootReducer,
        compose(
          applyMiddleware(sagaMiddleware),
          ...(window.__REDUX_DEVTOOLS_EXTENSION__
            ? [
                window.__REDUX_DEVTOOLS_EXTENSION__({
                  serialize: true,
                }),
              ]
            : [])
        )
      )
    : createStore(rootReducer, applyMiddleware(sagaMiddleware))

sagaMiddleware.run(rootSaga)

export default store
