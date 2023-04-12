import {AnnouncementActionType} from '../actionTypes'
import {createTransducer} from '../../../../redux/helpers'

const INITIAL_STATE = {
  title: '',
  message: '',
  voice: null,
  voice_note_duration: 0,
  edit_id: '',
}

const titleReducer = (state, {payload}) => {
  state.title = payload
  return state
}

const messageReducer = (state, {payload}) => {
  state.message = payload
  return state
}
const voiceReducer = (state, {payload}) => {
  state.voice = payload
  return state
}
const voiceDurationReducer = (state, {payload}) => {
  state.voice_note_duration = payload
  return state
}
const draftDataReducer = (state, {payload}) => {
  if (payload) return payload
  return INITIAL_STATE
}
const announcementIdReducer = (state, {payload}) => {
  state.edit_id = payload
  return state
}
const announcementReducer = {
  [AnnouncementActionType.TITLE]: titleReducer,
  [AnnouncementActionType.MESSAGE]: messageReducer,
  [AnnouncementActionType.ANNOUNCEMENT_DRAFT_DATA_REQUEST]: draftDataReducer,
  [AnnouncementActionType.ADD_VOICE_NOTE]: voiceReducer,
  [AnnouncementActionType.ADD_VOICE_NOTE_DURATION]: voiceDurationReducer,
  [AnnouncementActionType.ANNOUNCEMENT_ID]: announcementIdReducer,
}

export default createTransducer(announcementReducer, INITIAL_STATE)
