import {CommonActionType} from '../actionTypes'

export const setCreatorIdAction = (data) => {
  return {
    type: CommonActionType.SET_CREATOR_ID,
    payload: data,
  }
}

export const setAcademicSessionIdAction = (data) => {
  return {
    type: CommonActionType.SET_ACADEMIC_SESSION_ID,
    payload: data,
  }
}

export const setDraftDataAction = (data) => {
  return {
    type: CommonActionType.SET_DRAFT_DATA,
    payload: data,
  }
}

export const setAnnouncementDraftDataAction = (data) => {
  return {
    type: CommonActionType.COMMON_ANNOUNCEMENT_DRAFT_DATA_REQUEST,
    payload: data,
  }
}

export const setFeedbackDraftDataAction = (data) => {
  return {
    type: CommonActionType.COMMON_FEEDBACK_DRAFT_DATA_REQUEST,
    payload: data,
  }
}

export const setChannelAction = (channelArr) => {
  return {
    type: CommonActionType.CHANNEL,
    payload: channelArr,
  }
}

export const setSegmentsAction = (userSegmentArr) => {
  return {
    type: CommonActionType.SEGMENTS,
    payload: userSegmentArr,
  }
}

export const setAttachmentFileAction = (AttachmentFile) => {
  return {
    type: CommonActionType.ATTACHMENT_FILE,
    payload: AttachmentFile,
  }
}

export const setUserFilterVisibleAction = (isVisible) => {
  return {
    type: CommonActionType.USER_FILTER_VISIBLE,
    payload: isVisible,
  }
}

export const setSeletedUsersAction = (selected_user) => {
  return {
    type: CommonActionType.SELECTED_USERS,
    payload: selected_user,
  }
}

export const setNodeIdsAction = (nodeIds) => {
  return {
    type: CommonActionType.NODE_IDS,
    payload: nodeIds,
  }
}

export const setUserFilterTagsAction = (payload) => {
  return {
    type: CommonActionType.USER_FILTER_TAGS,
    payload,
  }
}

export const setAnnouncementTypeAction = (annc_type) => {
  return {
    type: CommonActionType.ANNOUNCEMENT_TYPE,
    payload: annc_type,
  }
}

export const setDuration = (duration) => {
  return {
    type: CommonActionType.DURATION,
    payload: duration,
  }
}

export const setTotalNoOfUsersAction = (totalNoOfUsers) => {
  return {
    type: CommonActionType.TOTAL_NO_OF_USERS,
    payload: totalNoOfUsers,
  }
}

export const getUserListAction = (filters) => {
  return {
    type: CommonActionType.GET_USERS_LIST,
    payload: filters,
  }
}

export const setIsCheckedAnonymousAction = (isChecked) => {
  return {
    type: CommonActionType.SET_IS_ANONYMOUS,
    payload: isChecked,
  }
}

export const createNewCommunicationAction = (payload) => {
  return {
    type: CommonActionType.CREATE_NEW_COMMUNICATION,
    payload,
  }
}

export const createNewCommunicationSucceededAction = (payload) => {
  return {
    type: CommonActionType.CREATE_NEW_COMMUNICATION_SUCCEEDED,
    payload,
  }
}

export const createNewCommunicationFailAction = (payload) => {
  return {
    type: CommonActionType.CREATE_NEW_COMMUNICATION_FAIL,
    payload,
  }
}

export const updateCommunicationAction = (payload) => {
  return {
    type: CommonActionType.UPDATE_COMMUNICATION,
    payload,
  }
}

export const fetchUncategorisedClassesDataAction = (payload) => {
  return {
    type: CommonActionType.FETCH_UNCATEGORISED_CLASSES_DATA_REQUEST,
    payload,
  }
}

export const deleteDraftAction = (payload) => {
  return {
    type: CommonActionType.DELETE_DRAFT_REQUEST,
    payload,
  }
}

export const setIsPostCreatedOrUpdatedAction = (payload) => {
  return {
    type: CommonActionType.SET_IS_POST_CREATED_OR_UPDATED,
    payload,
  }
}

export const setSelectALL = (state) => {
  return {
    type: CommonActionType.SET_SELECTALL,
    payload: state,
  }
}

export const sendReminder = (payload) => {
  return {
    type: CommonActionType.SEND_REMINDER,
    payload,
  }
}

export const setPostReceiversList = (payload) => {
  return {
    type: CommonActionType.FETCH_POST_RECEIVERS_LIST_REQUEST,
    payload: payload,
  }
}

export const removeCommunicationPost = (payload) => {
  return {
    type: CommonActionType.REMOVE_POST,
    payload,
  }
}

export const editCommunicationPost = (payload) => {
  return {
    type: CommonActionType.EDIT_COMMUNICATION_POST,
    payload,
  }
}

export const setEditPost = (payload) => {
  return {
    type: CommonActionType.EDIT_POST,
    payload,
  }
}

export const setSmsTemplates = (payload) => {
  return {
    type: CommonActionType.SET_SMS_TEMPLATES,
    payload,
  }
}

export const setAttachmentUrls = (payload) => {
  return {type: CommonActionType.SET_ATTACHMENT_URLS, payload}
}

export const setRequestSize = (payload) => {
  return {type: CommonActionType.SET_REQUEST_SIZE, payload}
}
