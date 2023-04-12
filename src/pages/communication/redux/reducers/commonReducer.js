import {CommonActionType} from '../actionTypes'
import {createTransducer} from '../../../../redux/helpers'

const INITIAL_STATE = {
  announcement_type: 0, //announcement: 0 / feedback: 1 / poll: 2
  channels: ['notification'], //[ sms, notification, ivr ]
  duration: 0, //value in days (for survey/poll and optional for announcement)
  segments: ['teacher', 'student', 'unassigned'], //[all] or [teacher, student, unassigned]
  node_ids: [], // (it can be section id, standard id, department id)
  draft: false, //True/False
  unassigned: false,
  file: [], // attachment
  is_anonymous: false,
  selected_users: [],
  total_no_of_users: 0,
  user_filter_tags: [],
  isUserFilterVisible: false,
  usersList: [],
  userSegmentLoader: false,
  uncategorisedClassesData: [],
  delete_attachment: false,
  ann_type: 0,
  isPostCreatedOrUpdated: false,
  selectAll: false,
  receiversList: [],
  editPost: false,
  redirectOnSuccess: null,
  attachment_urls: [],
  request_file_size: 0,
}

const loaderReducer = (state, {payload}) => {
  state.isLoading = payload
  return state
}

const academicSessionIdReducer = (state, {payload}) => {
  state.academicSessionId = payload
  if (!state.node_ids?.length) {
    state.node_ids = [state.academicSessionId]
  }
  return state
}

const draftDataReducer = (state, {payload}) => {
  if (payload) return {...INITIAL_STATE, ...payload}
  return INITIAL_STATE
}

const announcementTypeReducer = (state, {payload}) => {
  state.announcement_type = payload
  return state
}

const channelReducer = (state, {payload}) => {
  state.channels = payload
  return state
}

const segmentsReducer = (state, {payload}) => {
  state.segments = payload
  return state
}

const fileReducer = (state, {payload}) => {
  state.file = payload
  if (!payload) {
    delete state.file
  }
  if (payload === null && state.attachment_url !== null) {
    delete state.attachment_url
    state.delete_attachment = true
  }
  return state
}

const selectedUsersReducer = (state, {payload}) => {
  state.selected_users = payload
  return state
}

const nodeIdsReducer = (state, {payload}) => {
  if (payload?.length) {
    state.node_ids = payload
  } else {
    state.node_ids = [state.academicSessionId]
  }
  return state
}

const userFilterTagsReducer = (state, {payload}) => {
  state.user_filter_tags = payload
  return state
}

const userFilterVisibleReducer = (state, {payload}) => {
  state.isUserFilterVisible = payload
  return state
}

const durationReducer = (state, {payload}) => {
  state.duration = payload
  return state
}

const isAnonymousReducer = (state, {payload}) => {
  state.is_anonymous = payload
  return state
}

const totalNoOfUsersReducer = (state, {payload}) => {
  state.total_no_of_users = payload
  return state
}

const usersListReducer = (state, {payload}) => {
  state.usersList = payload
  return state
}

const setUserSegmentLoader = (state, {payload}) => {
  state.userSegmentLoader = payload
  return state
}

const setUncategorisedClassesData = (state, {payload}) => {
  state.uncategorisedClassesData = payload
  return state
}

const setIsPostCreatedOrUpdatedReducer = (state, {payload}) => {
  state.isPostCreatedOrUpdated = payload
  return state
}

const setSelectALL = (state, {payload}) => {
  state.selectAll = payload
  return state
}
const receiversListReducer = (state, {payload}) => {
  state.receiversList = payload
  return state
}
const setEditPost = (state, {payload}) => {
  state.editPost = payload
  return state
}
const setRedirectOnSuccess = (state, {payload}) => {
  state.redirectOnSuccess = payload
  return state
}
const setRedirectOnClose = (state, {payload}) => {
  state.redirectOnClose = payload
  return state
}

const setAttachmentUrls = (state, {payload}) => {
  state.attachment_urls = payload
  return state
}
const setRequestSize = (state, {payload}) => {
  state.request_file_size = payload
}
const commonReducer = {
  [CommonActionType.SET_LOADER]: loaderReducer,
  [CommonActionType.SET_ACADEMIC_SESSION_ID]: academicSessionIdReducer,
  [CommonActionType.COMMON_DRAFT_DATA_REQUEST]: draftDataReducer,
  [CommonActionType.CHANNEL]: channelReducer,
  [CommonActionType.SEGMENTS]: segmentsReducer,
  [CommonActionType.ATTACHMENT_FILE]: fileReducer,
  [CommonActionType.SELECTED_USERS]: selectedUsersReducer,
  [CommonActionType.NODE_IDS]: nodeIdsReducer,
  [CommonActionType.USER_FILTER_TAGS]: userFilterTagsReducer,
  [CommonActionType.ANNOUNCEMENT_TYPE]: announcementTypeReducer,
  [CommonActionType.DURATION]: durationReducer,
  [CommonActionType.SET_IS_ANONYMOUS]: isAnonymousReducer,
  [CommonActionType.TOTAL_NO_OF_USERS]: totalNoOfUsersReducer,
  [CommonActionType.USER_FILTER_VISIBLE]: userFilterVisibleReducer,
  [CommonActionType.FETCH_USER_LIST_REQUEST]: usersListReducer,
  [CommonActionType.SET_USER_SEGMENT_LOADER]: setUserSegmentLoader,
  [CommonActionType.FETCH_UNCATEGORISED_CLASSES_DATA_SUCCEEDED]:
    setUncategorisedClassesData,
  [CommonActionType.SET_IS_POST_CREATED_OR_UPDATED]:
    setIsPostCreatedOrUpdatedReducer,
  [CommonActionType.SET_SELECTALL]: setSelectALL,
  [CommonActionType.FETCH_POST_RECEIVERS_LIST_SUCCESS]: receiversListReducer,
  [CommonActionType.EDIT_POST]: setEditPost,
  [CommonActionType.REDIRECT_ON_SUCCESS]: setRedirectOnSuccess,
  [CommonActionType.REDIRECT_ON_CLOSE]: setRedirectOnClose,
  [CommonActionType.SET_ATTACHMENT_URLS]: setAttachmentUrls,
  [CommonActionType.SET_REQUEST_SIZE]: setRequestSize,
}

export default createTransducer(commonReducer, INITIAL_STATE)
