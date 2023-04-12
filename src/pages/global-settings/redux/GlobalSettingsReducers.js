import {createTransducer} from '../../../redux/helpers'
import {SETTINGS_CATEGORY_TYPES} from '../constants/constants'
import GLOBAL_SETTINGS_ACTIONS from './GlobalSettingsActionTypes'

const INITIAL_STATE = {
  settings: [],
  settingsLoading: false,
  selectedSettingCategory: SETTINGS_CATEGORY_TYPES.CLASSROOM_SETTINGS.title,

  selectedSettingSubCategory: null,
  updateSettingLoading: false,
}

const getGlobalSettingsReducer = (state) => {
  return {...state, settingsLoading: true}
}

const setGlobalSettingsReducer = (state, action) => {
  return {...state, settings: action.payload, settingsLoading: false}
}

const postGlobalSettingsReducer = (state, action) => {
  return {
    ...state,
    settings: action.payload,
    settingsLoading: false,
    updateSettingLoading: true,
  }
}

const postSettingSuccessReducer = (state) => {
  state.updateSettingLoading = false
  return state
}
const setSelectedSettingCategoryReducer = (state, action) => {
  state.selectedSettingCategory = action.payload
  return state
}
const setSelectedSettingSubCategoryReducer = (state, action) => {
  state.selectedSettingSubCategory = action.payload
  return state
}

const globalSettingsReducer = {
  [GLOBAL_SETTINGS_ACTIONS.GET_SETTINGS]: getGlobalSettingsReducer,
  [GLOBAL_SETTINGS_ACTIONS.SET_SETTINGS]: setGlobalSettingsReducer,
  [GLOBAL_SETTINGS_ACTIONS.POST_SETTINGS]: postGlobalSettingsReducer,
  [GLOBAL_SETTINGS_ACTIONS.POST_SETTING_SUCCESS]: postSettingSuccessReducer,
  [GLOBAL_SETTINGS_ACTIONS.SET_SELECTED_SETTING_CATEGORY]:
    setSelectedSettingCategoryReducer,
  [GLOBAL_SETTINGS_ACTIONS.SET_SELECTED_SETTING_SUB_CATEGORY]:
    setSelectedSettingSubCategoryReducer,
}

export default createTransducer(globalSettingsReducer, INITIAL_STATE)
