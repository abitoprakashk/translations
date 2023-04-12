import {createTransducer} from '../../../../redux/helpers'
import {templatePageSettingsActions} from '../TemplateGenerator.actionTypes'

const INITIAL_STATE = {
  getEditorContent: null,
  addSpan: null,
  addImage: null,
  insertHTML: null,
  getCompleteHTML: null,
}

const setTinyMceRef = (state, {payload}) => {
  return {...state, ...payload}
}

const resetPageSettings = () => {
  return INITIAL_STATE
}

const editorRefReducer = {
  [templatePageSettingsActions.RESET_PAGE_SETTINGS]: resetPageSettings,
  [templatePageSettingsActions.SET_TINYMCE_REF]: setTinyMceRef,
}

export default createTransducer(editorRefReducer, INITIAL_STATE)
