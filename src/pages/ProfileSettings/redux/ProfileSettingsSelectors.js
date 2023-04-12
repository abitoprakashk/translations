import {useSelector} from 'react-redux'

export const personaProfileSettingsSelector = () => {
  const profileSettingsData = useSelector(
    (state) => state.globalData?.personaProfileSettingsReducerCollection
  )
  return profileSettingsData
}
export const categoryFieldsSettingsSelector = () => {
  const categoryFieldsSettings = useSelector(
    (state) => state.globalData?.getCategoryAndTheirFieldsCollection
  )
  return categoryFieldsSettings
}

export const addCategoryFieldFormSubmitSelector = () => {
  const addCategoryFieldFormSubmitResponse = useSelector(
    (state) => state.globalData?.addCategoryFieldFormSubmitReducerData
  )
  return addCategoryFieldFormSubmitResponse
}

export const updateCategoryFieldFormSubmitSelector = () => {
  const updateCategoryFieldFormResponse = useSelector(
    (state) => state.globalData?.updateCategoryFieldFormSubmitReducerData
  )
  return updateCategoryFieldFormResponse
}
