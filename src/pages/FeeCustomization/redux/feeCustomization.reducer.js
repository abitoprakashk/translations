import {createTransducer} from '@teachmint/krayon'
import produce from 'immer'
import {SET_EDITOR_FIELDS} from './feeCustomization.actionTypes'

const INITIAL_STATE = {
  editor: {},
}

const setEditorFields = (state, {payload = {}}) => {
  return produce(state, (draft) => {
    draft.editor = payload
    return draft
  })
}

const feeCustomizationReducer = {
  [SET_EDITOR_FIELDS]: setEditorFields,
}
export default createTransducer(feeCustomizationReducer, INITIAL_STATE)
