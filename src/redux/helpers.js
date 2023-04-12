import produce from 'immer'

export function createReducer(name, config, initialState) {
  return (state = initialState, action) => {
    const type = action.type.replace(new RegExp(`^${name}/`), '')
    return produce(state, (draft) => {
      config[type]?.(draft, action.payload) ?? state
    })
  }
}

export function createActions(name, config) {
  return Object.keys(config).reduce((prevActions, key) => {
    prevActions[key] = (payload = {}) => ({
      type: `${name}/${key}`,
      payload,
    })
    return prevActions
  }, {})
}

export const createTransducer = (reducerObject, initialState) =>
  produce((state = initialState, action) => {
    if (action.type && reducerObject[action.type]) {
      const reducer = reducerObject[action.type]
      if (reducer) {
        return reducer(state, action)
      }
    }
    return state
  })
