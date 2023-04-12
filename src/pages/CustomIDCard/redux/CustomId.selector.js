import {useSelector} from 'react-redux'

export const customIdPreviewSelector = () => {
  const preview = useSelector((store) => store.globalData?.customIdPreview)
  return preview
}

export const savedCustomIdTemplateSelector = () => {
  const saveStatus = useSelector(
    (store) => store.globalData?.saveCustomIdTemplate
  )
  return saveStatus
}

export const getTemplateListSelector = (userType) => {
  const customIdTemplateList = useSelector(
    (store) => store.globalData?.customIdTemplateList
  )
  return {
    data: customIdTemplateList.data?.[userType],
    isLoading: customIdTemplateList.isLoading,
    loaded: customIdTemplateList.loaded,
  }
}

export const customIdTemplateDetailsSelector = () => {
  const customIdTemplateDetails = useSelector(
    (store) => store.globalData?.customIdTemplateDetails
  )
  return customIdTemplateDetails
}

export const updateCustomIdTemplateSelector = () => {
  const updateCustomIdTemplate = useSelector(
    (store) => store.globalData?.updateCustomIdTemplate
  )
  return updateCustomIdTemplate
}

export const generateSingleIdCardSelector = () => {
  const generateSingleIdCard = useSelector(
    (store) => store.globalData?.generateSingleIdCard
  )
  return generateSingleIdCard
}

export const generateBulkIdCardSelector = () => {
  const generateBulkIdCard = useSelector(
    (store) => store.globalData?.generateBulkIdCard
  )
  return generateBulkIdCard
}

export const bulkGeneratedIDCardStatusSelector = () => {
  const bulkGeneratedIDCardStatus = useSelector(
    (store) => store.globalData?.bulkGeneratedIDCardStatus?.data
  )

  return bulkGeneratedIDCardStatus
}

export const generatedIdCardList = () => {
  const generatedIdCardList = useSelector(
    (store) => store.globalData?.generatedIdCardList
  )
  return generatedIdCardList
}

export const customIdDefaultPreviewSelector = () => {
  const customIdDefaultPreview = useSelector(
    (store) => store.globalData?.customIdDefaultPreview
  )
  return customIdDefaultPreview
}

export const getSelectedTemplateForUser = (userType) => {
  const customIdTemplateList = useSelector(
    (store) => store.globalData?.customIdTemplateList
  )
  const data = customIdTemplateList.data?.[userType]
  const selected = data?.find((item) => item.selected)
  return {
    data: selected,
    isLoading: customIdTemplateList.isLoading,
    loaded: customIdTemplateList.loaded,
  }
}

export const idCardCheckoutPreviewUrlsSelector = () => {
  const idCardCheckoutPreviewUrls = useSelector(
    (store) => store.globalData.idCardCheckoutPreviewUrls.data
  )
  return idCardCheckoutPreviewUrls
}

export const getIDCardOrderData = () => {
  const data = useSelector(
    (state) => state?.globalData?.IDCardOrderHistory?.data
  )
  return data
}

export const idCardAccessoriesConfigSelector = () => {
  return useSelector((store) => store.globalData.idCardAccessoriesConfig)
}

export const idCardOrderCheckoutSelector = () => {
  return useSelector((store) => store.globalData.idCardOrderCheckout)
}
