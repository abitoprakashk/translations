import {useSelector} from 'react-redux'

export const getGlobalCertificateData = () => {
  const {
    customTemplatePreview,
    saveDocumentTemplate,
    templateList,
    updateDocumentTemplate,
  } = useSelector((store) => store?.globalData)
  return {
    customTemplatePreview,
    saveDocumentTemplate,
    templateList,
    updateDocumentTemplate,
  }
}

export const templateListSelector = () => {
  const templateList = useSelector(
    (store) => store.globalData?.templateList?.data
  )
  return templateList
}

export const templateDetailsSelector = () => {
  const templateDetails = useSelector(
    (store) => store.globalData?.templateDetails
  )
  return templateDetails || {}
}

export const staffListSelector = () => {
  const templateDetails = useSelector(
    (store) => store.globalData?.staffList?.data
  )
  return templateDetails
}

export const templateFieldsSelector = () => {
  const templateFields = useSelector(
    (store) => store.globalData?.templateFields?.data
  )
  return templateFields
}

export const customTemplateFieldValuesSelector = () => {
  const customTemplateFieldValues = useSelector(
    (store) => store?.globalData?.customTemplateFieldValues
  )
  return customTemplateFieldValues
}

export const templatePreviewSelector = () => {
  const customTemplatePreview = useSelector(
    (store) => store?.globalData?.customTemplatePreview
  )
  return customTemplatePreview
}

export const singleGeneratedDocumentIdSelector = () => {
  const generateSingleCertificate = useSelector(
    (store) => store?.globalData?.generateSingleCertificate
  )
  return generateSingleCertificate
}

export const generatedDocumentStatusSelector = () => {
  const generatedDocumentStatus = useSelector(
    (store) => store?.globalData?.generatedDocumentStatus?.data
  )
  return generatedDocumentStatus
}

export const generatedDocumentsListSelector = () => {
  const generatedDocumentsList = useSelector(
    (store) => store?.globalData?.generatedDocuments
  )

  return generatedDocumentsList
}

export const multipleGenerateRequestIdSelector = () => {
  const multipleGenerateRequestId = useSelector(
    (store) => store?.globalData?.bulkCertificateGenerate
  )

  return multipleGenerateRequestId
}

export const defaultTemplatePreviewSelector = () => {
  const defaultTemplatePreview = useSelector(
    (store) => store?.globalData?.defaultTemplatePreview || {}
  )

  return defaultTemplatePreview
}

export const eventManagerSelector = () => {
  const eventManager = useSelector((state) => state.eventManager)
  return eventManager
}
