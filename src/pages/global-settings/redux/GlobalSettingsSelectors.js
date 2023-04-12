import {useSelector} from 'react-redux'

export const useGlobalSettings = () => {
  const {globalSettings} = useSelector((state) => state)
  return globalSettings
}

export const useSelectedSettingSubCategory = () => {
  const {selectedSettingSubCategory} = useSelector(
    (state) => state.globalSettings
  )
  return selectedSettingSubCategory
}
export const useSelectedSettingCategory = () => {
  const {selectedSettingCategory} = useSelector((state) => state.globalSettings)
  return selectedSettingCategory
}

export const useUpdateSettingLoading = () => {
  const {updateSettingLoading} = useSelector((state) => state.globalSettings)
  return updateSettingLoading
}
