import {quickActionsActionTypes} from '../actionTypes'
import {createTransducer} from '../helpers'

const INITIAL_STATE = {
  feeQuickActionData: {
    loader: false,
    todayTotalFeeCollection: 0,
  },
}

const setFeeQuickActionData = (state, {payload}) => {
  return {
    ...state,
    feeQuickActionData: {...state.feeQuickActionData, ...payload},
  }
}

const dashboardQuickActionsReducer = {
  [quickActionsActionTypes.TODAY_COLLECTED_FEE_SUCCESS]: setFeeQuickActionData,
}

export default createTransducer(dashboardQuickActionsReducer, INITIAL_STATE)
