import {initialAsyncState} from '../redux/reducers/global.reducer'
/*
  Use this helper function to generate actions and types automatically
  This will return a object generating 3 actions and 3 types:
  {
    FAILURE: "GET_USERS_LIST_FAILURE",
    SUCCESS: "GET_USERS_LIST_SUCCESS",
    REQUEST: "GET_USERS_LIST_REQUEST",
    failure: payload => ({ type, payload, }), // type: GET_USERS_LIST_FAILURE
    success: payload => ({ type, payload, }), // type: GET_USERS_LIST_SUCCESS
    request: payload => ({ type, payload, }), // type: GET_USERS_LIST_REQUEST
  }
*/

export const actionCreator = (action) => {
  const values = ['SUCCESS', 'FAILURE', 'REQUEST', 'RESET']
  const types = values.reduce((acc, value) => {
    const type = `${action}_${value}`
    acc[value] = type
    acc[value.toLowerCase()] = (data, successAction, failureAction) => ({
      type,
      data,
      successAction,
      failureAction,
    })
    return acc
  }, {})
  return types
}

/*
  Use this reducer handler to auto manage request, success and failure state
*/
export const reducerHandler = (state, action, actionHandler) => {
  switch (action.type) {
    case actionHandler.REQUEST:
      return {
        ...state,
        isLoading: true,
      }
    case actionHandler.SUCCESS:
      return {
        ...state,
        isLoading: false,
        loaded: true,
        data: action?.data,
        error: null,
      }
    case actionHandler.FAILURE:
      return {
        ...state,
        isLoading: false,
        loaded: true,
        error: action?.data,
        data: null,
      }
    case actionHandler.RESET:
      return initialAsyncState
    default:
      return state
  }
}
