import {AnnouncementActionType} from '../actionTypes'

export const setTitleAction = (text) => {
  return {
    type: AnnouncementActionType.TITLE,
    payload: text,
  }
}

export const setMessageAction = (text) => {
  return {
    type: AnnouncementActionType.MESSAGE,
    payload: text,
  }
}

export const setDraftDataAction = (data) => {
  return {
    type: AnnouncementActionType.ANNOUNCEMENT_DRAFT_DATA_REQUEST,
    payload: data,
  }
}
export const setVoiceRecordingAction = (data) => {
  return {
    type: AnnouncementActionType.VOICE_RECORDING,
    payload: data,
  }
}

export const setVoiceAction = (data) => {
  return {
    type: AnnouncementActionType.ADD_VOICE_NOTE,
    payload: data,
  }
}

export const setVoiceDurationAction = (data) => {
  return {
    type: AnnouncementActionType.ADD_VOICE_NOTE_DURATION,
    payload: data,
  }
}

export const getSelectedUsers = (payload) => {
  return {
    type: AnnouncementActionType.GET_SELECTED_USERS_LIST,
    payload: payload,
  }
}

export const setAnnouncementId = (payload) => {
  return {
    type: AnnouncementActionType.ANNOUNCEMENT_ID,
    payload: payload,
  }
}
