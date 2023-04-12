import {useSelector} from 'react-redux'
import {fieldType} from '../TemplateGenerator.constants'

export const usePageSettings = () => {
  const {pageSettings} = useSelector((store) => store.templateGenerator)
  return pageSettings
}

export const useTemplateData = () => {
  const {
    pageSettings,
    name,
    backgroundConfig,
    imageUrls,
    fields,
    watermark,
    _id,
    default: defaultTemplate,
  } = useSelector((store) => store.templateGenerator)
  return {
    pageSettings,
    name,
    backgroundConfig,
    imageUrls,
    ...fields,
    watermark,
    defaultTemplate,
    _id,
  }
}
export const useEditorRef = () => {
  const editorRef = useSelector((store) => store.editorRef)
  return editorRef
}

export const useCustomFields = () => {
  const customFields = useSelector(
    (store) => store?.templateGenerator?.fields?.[fieldType.CUSTOM] || []
  )
  return customFields
}

export const useTemplateWaterMark = () => {
  const watermark = useSelector((store) => store?.templateGenerator?.watermark)
  return watermark
}
