import {createTransducer} from '../../../../redux/helpers'
import {templatePageSettingsActions} from '../TemplateGenerator.actionTypes'

export const TEMPLATE_INITIAL_STATE = {
  pageSettings: {
    pagesize: '',
    orientation: '',
    margin: {left: '0.5', right: '0.5', top: '0.5', bottom: '0.5'},
  },
  name: '',
  backgroundConfig: {
    imageUrl: '',
    color: '',
  },
  field: {},
  watermark: {
    url: '',
    opacity: '50',
    size: '50',
  },
}

const setTemplateData = (state, {payload}) => {
  return {
    ...state,
    ...payload,
  }
}

const setPageSettings = (state, {payload}) => {
  const {pageSettings, name} = payload
  return {
    ...state,
    pageSettings,
    name,
  }
}

const setMargins = (state, {payload}) => {
  return {
    ...state,
    pageSettings: {...state.pageSettings, margin: payload},
  }
}

const resetPageSettings = () => {
  return TEMPLATE_INITIAL_STATE
}

const setPageBackground = (state, {payload}) => {
  let {imageUrl, color} = payload
  if (imageUrl === 'none') {
    color = ''
    imageUrl = 'none'
  } else if (imageUrl) color = ''
  else imageUrl = ''
  return {
    ...state,
    backgroundConfig: {
      imageUrl,
      color,
    },
  }
}

const updateImageUrls = (state, {payload}) => {
  const {imageUrls} = payload
  return {
    ...state,
    imageUrls: [...imageUrls],
  }
}

const setCustomFields = (state, {payload}) => {
  const {customFields} = payload
  return {
    ...state,
    fields: {...state.fields, CUSTOM: customFields},
  }
}

const setPageWatermarkUrl = (state, {payload}) => {
  return {
    ...state,
    watermark: {
      ...state.watermark,
      url: payload,
      opacity: state?.watermark?.opacity || '50',
    },
  }
}

const setPageWatermarkOpacity = (state, {payload}) => {
  return {
    ...state,
    watermark: {...state.watermark, opacity: payload},
  }
}

const setPageWatermarkSize = (state, {payload}) => {
  return {
    ...state,
    watermark: {...state.watermark, size: payload},
  }
}

const staffListReducer = {
  [templatePageSettingsActions.SET_PAGE_SETTINGS]: setPageSettings,
  [templatePageSettingsActions.RESET_PAGE_SETTINGS]: resetPageSettings,
  [templatePageSettingsActions.SET_BACKGROUND]: setPageBackground,
  [templatePageSettingsActions.UPDATE_IMAGE_URLS]: updateImageUrls,
  [templatePageSettingsActions.SET_TEMPLATE]: setTemplateData,
  [templatePageSettingsActions.SET_CUSTOM_FIELDS]: setCustomFields,
  [templatePageSettingsActions.SET_MARGINS]: setMargins,
  [templatePageSettingsActions.SET_WATERMARK_URL]: setPageWatermarkUrl,
  [templatePageSettingsActions.SET_WATERMARK_OPACITY]: setPageWatermarkOpacity,
  [templatePageSettingsActions.SET_WATERMARK_SIZE]: setPageWatermarkSize,
}

export default createTransducer(staffListReducer, TEMPLATE_INITIAL_STATE)
