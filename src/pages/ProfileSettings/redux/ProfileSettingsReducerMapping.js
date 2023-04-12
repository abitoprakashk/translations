export const ProfileSettingsReducerMapping = {
  // Noted this things => Action:Reducer
  // personaProfileSettingsData Replace with personaProfileSettingsReducerCollection
  fetchPersonaProfileSettingsRequestAction:
    'personaProfileSettingsReducerCollection',
  profileSettingAddCategoryFormSubmitRequestAction:
    'profileSettingsCategorySubmitReducerData',
  requestForCategoryDetails: 'getCategoryAndTheirFieldsCollection',
  addCategoryFieldFormSubmitRequest: 'addCategoryFieldFormSubmitReducerData',
  updateCategoryFieldFormSubmitRequest:
    'updateCategoryFieldFormSubmitReducerData',
}
