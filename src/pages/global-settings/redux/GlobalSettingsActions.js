import GLOBAL_SETTINGS_ACTIONS from './GlobalSettingsActionTypes'

export const fetchGlobalSettingsRequestedAction = (instituteId) => {
  return {
    type: GLOBAL_SETTINGS_ACTIONS.GET_SETTINGS,
    payload: {
      instituteId,
    },
  }
}

export const setGlobalSettingsAction = (settingsData) => {
  return {
    type: GLOBAL_SETTINGS_ACTIONS.SET_SETTINGS,
    payload: settingsData,
  }
}

export const postGlobalSettingsAction = (instituteId, updatedSetting) => {
  return {
    type: GLOBAL_SETTINGS_ACTIONS.POST_SETTINGS,
    payload: {
      instituteId,
      updatedSetting,
    },
  }
}

export const setSelectedSettingCategoryAction = (selectedSettingCategory) => {
  return {
    type: GLOBAL_SETTINGS_ACTIONS.SET_SELECTED_SETTING_CATEGORY,
    payload: selectedSettingCategory,
  }
}
export const setSelectedSettingSubCategoryAction = (
  selectedSettingSubCategory
) => {
  return {
    type: GLOBAL_SETTINGS_ACTIONS.SET_SELECTED_SETTING_SUB_CATEGORY,
    payload: selectedSettingSubCategory,
  }
}
