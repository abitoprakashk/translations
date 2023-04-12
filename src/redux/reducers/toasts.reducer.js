import produce from 'immer'
import {commonActionTypes} from '../actionTypes'
import {enableMapSet} from 'immer'

enableMapSet()

// const toastsInitialState = new Map();
const toastsInitialState = {}
export const toastsReducer = (state = toastsInitialState, {type, payload}) => {
  const reducers = {
    [commonActionTypes.SHOW_TOAST]: () => {
      const {id} = payload
      const nextState = produce(state, (draftState) => {
        // draftState.set(id, payload);
        draftState[id] = payload
      })
      return nextState
    },
    [commonActionTypes.HIDE_TOAST]: () => {
      const {id} = payload
      const nextState = produce(state, (draftState) => {
        // draftState.delete(id);
        delete draftState[id]
      })
      return nextState
    },
  }
  return reducers[type] ? reducers[type]() : state
}
