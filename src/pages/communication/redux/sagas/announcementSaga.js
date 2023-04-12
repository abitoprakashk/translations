import {call, put, takeEvery} from 'redux-saga/effects'
import {
  showErrorToast,
  showSuccessToast,
} from '../../../../redux/actions/commonAction'
import * as Api from '../../apiService'
import {
  AnnouncementActionType,
  FeedbackActionType,
  CommonActionType,
  PostActionType,
  PollActionType,
  TemplateActionTypes,
  SmsActionType,
} from './../actionTypes'
import {announcementType} from './../../constants'
import {Trans} from 'react-i18next'

const somethingWentWrongPleaseCheckYourNetwork = (
  <Trans i18nKey={'fetchPostsListErrorToast'}>
    Something went wrong, please check your network
  </Trans>
)
const communicationCreatedSuccessfully = (
  <Trans i18nKey={'communicationCreatedSuccessfully'}>
    Communication created successfully
  </Trans>
)
const communicationUpdatedSuccessfully = (
  <Trans i18nKey={'communicationUpdatedSuccessfully'}>
    Communication updated successfully
  </Trans>
)
const communicationDeletedSuccessfully = (
  <Trans i18nKey={'communicationDeletedSuccessfully'}>
    Communication deleted successfully
  </Trans>
)
const communicationRemovedSuccessfully = (
  <Trans i18nKey={'communicationRemovedSuccessfully'} />
)
const reminderSentSuccessfully = <Trans i18nKey={'reminderSent'} />

const receiverListError = (
  <Trans i18nKey={'receiverListError'}>Something went wrong</Trans>
)

function setCommonDraftData(payload) {
  let commonData = null
  if (Object.keys(payload).length) {
    commonData = {
      channels: payload.channels,
      segments: payload.segments,
      selected_users: payload.selected_users || [],
      node_ids: payload.node_ids,
      duration: payload.duration,
      is_anonymous: payload.is_anonymous,
      editPost: payload.editPost,
      // change this to handle backward compatability
    }
    if (payload.attachment_url !== undefined) {
      commonData.attachment_url = payload.attachment_url
    }
    if (payload._id !== undefined) {
      commonData._id = payload._id
    }
    if (payload.selectAll !== undefined) {
      commonData.selectAll = payload.selectAll
    }
  }
  return commonData
}

function* setAnnouncementDraftData({payload}) {
  let announcementData = null
  if (Object.keys(payload).length) {
    announcementData = {
      title: payload.title,
      message: payload.message,
      voice: payload.voice_note_url,
      voice_note_duration: payload.voice_note_duration,
      edit_id: payload._id,
    }
  }
  yield put({
    type: AnnouncementActionType.ANNOUNCEMENT_DRAFT_DATA_REQUEST,
    payload: announcementData,
  })
  let commonData = setCommonDraftData(payload)
  yield put({
    type: CommonActionType.COMMON_DRAFT_DATA_REQUEST,
    payload: commonData,
  })
}

export function* watchAnnouncementData() {
  yield takeEvery(
    CommonActionType.COMMON_ANNOUNCEMENT_DRAFT_DATA_REQUEST,
    setAnnouncementDraftData
  )
}

function* setFeedbackDraftData({payload}) {
  let feedbackData = null
  if (Object.keys(payload).length) {
    feedbackData = {
      message: payload.message,
    }
  }
  yield put({
    type: FeedbackActionType.SET_FEEDBACK_DRAFT_DATA,
    payload: feedbackData,
  })
  let commonData = setCommonDraftData(payload)
  yield put({
    type: CommonActionType.COMMON_DRAFT_DATA_REQUEST,
    payload: commonData,
  })
}

export function* watchFeedbackData() {
  yield takeEvery(
    CommonActionType.COMMON_FEEDBACK_DRAFT_DATA_REQUEST,
    setFeedbackDraftData
  )
}

function* setPollDraftData({payload}) {
  let pollData = null
  if (Object.keys(payload).length) {
    pollData = {
      message: payload.message,
      question_options: payload.question_options,
      is_poll_public: payload.is_poll_public,
    }
  }
  yield put({
    type: PollActionType.SET_POLL_DRAFT_DATA,
    payload: pollData,
  })
  let commonData = setCommonDraftData(payload)
  yield put({
    type: CommonActionType.COMMON_DRAFT_DATA_REQUEST,
    payload: commonData,
  })
}

export function* watchPollData() {
  yield takeEvery(
    CommonActionType.COMMON_POLL_DRAFT_DATA_REQUEST,
    setPollDraftData
  )
}

function* setDraftData({payload}) {
  if (!payload) {
    yield put({
      type: CommonActionType.COMMON_ANNOUNCEMENT_DRAFT_DATA_REQUEST,
      payload: {},
    })
    yield put({
      type: CommonActionType.COMMON_FEEDBACK_DRAFT_DATA_REQUEST,
      payload: {},
    })
    yield put({
      type: CommonActionType.COMMON_POLL_DRAFT_DATA_REQUEST,
      payload: {},
    })
  } else if (payload.announcement_type === announcementType.ANNOUNCEMENT) {
    yield put({
      type: CommonActionType.COMMON_ANNOUNCEMENT_DRAFT_DATA_REQUEST,
      payload,
    })
  } else if (payload.announcement_type === announcementType.FEEDBACK) {
    yield put({
      type: CommonActionType.COMMON_FEEDBACK_DRAFT_DATA_REQUEST,
      payload,
    })
  } else if (payload.announcement_type === announcementType.POLL) {
    yield put({
      type: CommonActionType.COMMON_POLL_DRAFT_DATA_REQUEST,
      payload,
    })
  }
}

export function* watchDraftData() {
  yield takeEvery(CommonActionType.SET_DRAFT_DATA, setDraftData)
}

function* FetchPostsListData() {
  try {
    const res = yield call(Api.fetchPostsData)
    yield put({
      type: PostActionType.FETCH_POSTS_DATA_SUCCEEDED,
      payload: res,
    })
  } catch (e) {
    yield put({
      type: PostActionType.FETCH_POSTS_DATA_FAIL,
    })
    yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
  }
}

export function* watchFetchPostsData() {
  yield takeEvery(PostActionType.FETCH_POSTS_DATA_REQUEST, FetchPostsListData)
}

function* getUsersList(action) {
  yield put({
    type: CommonActionType.SET_USER_SEGMENT_LOADER,
    payload: true,
  })
  try {
    const res = yield call(Api.getUserList, action.payload)
    yield put({
      type: CommonActionType.FETCH_USER_LIST_REQUEST,
      payload: res.status ? res.obj : [],
    })
    if (!res.status) {
      yield put(showErrorToast(res.msg))
    }
    yield put({
      type: CommonActionType.TOTAL_NO_OF_USERS,
      payload: 0,
    })
  } catch (e) {
    yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
  }
  yield put({
    type: CommonActionType.SET_USER_SEGMENT_LOADER,
    payload: false,
  })
}

export function* watchGetUsersList() {
  yield takeEvery(CommonActionType.GET_USERS_LIST, getUsersList)
}

function* createNewCommunication(action) {
  yield put({
    type: CommonActionType.SET_LOADER,
    payload: true,
  })
  try {
    const res = yield call(Api.createNewCommunication, action.payload)
    yield put({
      type: PostActionType.FETCH_POSTS_DATA_REQUEST,
      payload: res,
    })
    if (res.status) {
      yield put(showSuccessToast(communicationCreatedSuccessfully))
      yield put({
        type: CommonActionType.SET_IS_POST_CREATED_OR_UPDATED,
        payload: true,
      })
    } else {
      yield put(showErrorToast(res.msg))
    }
  } catch (e) {
    yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
  }
  yield put({
    type: CommonActionType.SET_LOADER,
    payload: false,
  })
}

export function* watchCreateNewCommunication() {
  yield takeEvery(
    CommonActionType.CREATE_NEW_COMMUNICATION,
    createNewCommunication
  )
}

function* updateCommunication({payload}) {
  yield put({
    type: CommonActionType.SET_LOADER,
    payload: true,
  })
  delete payload.total_no_of_users
  delete payload.user_filter_tags
  delete payload.isUserFilterVisible
  delete payload.usersList
  delete payload.userSegmentLoader
  delete payload.uncategorisedClassesData
  if (!payload.file) {
    delete payload.file
  }
  if (!payload.attachment_url) {
    delete payload.attachment_url
  }
  try {
    const res = yield call(Api.updateCommunication, payload)
    yield put({
      type: PostActionType.FETCH_POSTS_DATA_REQUEST,
      payload: res,
    })
    if (res.status) {
      yield put(showSuccessToast(communicationUpdatedSuccessfully))
      yield put({
        type: CommonActionType.SET_IS_POST_CREATED_OR_UPDATED,
        payload: true,
      })
    } else {
      yield put(showErrorToast(res.msg))
    }
  } catch (e) {
    yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
  }
  yield put({
    type: CommonActionType.SET_LOADER,
    payload: false,
  })
}

export function* watchUpdateCommunication() {
  yield takeEvery(CommonActionType.UPDATE_COMMUNICATION, updateCommunication)
}

function* fetchFeedbackResponseData(action) {
  try {
    yield put({
      type: FeedbackActionType.SET_FEESBACK_RESPONSE_LOADER,
      payload: true,
    })
    const res = yield call(Api.fetchFeedbackResponseData, action.payload)
    yield put({
      type: FeedbackActionType.FETCH_FEEDBACK_RESPONSE_DATA_SUCCEEDED,
      payload: res,
    })
  } catch (e) {
    yield put({
      type: FeedbackActionType.FETCH_FEEDBACK_RESPONSE_DATA_FAIL,
    })
    yield put({
      type: FeedbackActionType.SET_FEESBACK_RESPONSE_LOADER,
      payload: false,
    })
    yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
  }
  yield put({
    type: FeedbackActionType.SET_FEESBACK_RESPONSE_LOADER,
    payload: false,
  })
}

export function* watchFetchFeedbackResponseData() {
  yield takeEvery(
    FeedbackActionType.FETCH_FEEDBACK_RESPONSE_DATA_REQUEST,
    fetchFeedbackResponseData
  )
}

function* fetchUncategorisedClassesData(action) {
  try {
    const res = yield call(Api.getUncategorisedClasses, action.payload)
    yield put({
      type: CommonActionType.FETCH_UNCATEGORISED_CLASSES_DATA_SUCCEEDED,
      payload: res.status ? res.obj : [],
    })
    if (!res.status) {
      yield put(showErrorToast(res.msg))
    }
  } catch (e) {
    yield put({
      type: CommonActionType.FETCH_UNCATEGORISED_CLASSES_DATA_FAIL,
    })
    yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
  }
}

export function* watchFetchUncategorisedClassesData() {
  yield takeEvery(
    CommonActionType.FETCH_UNCATEGORISED_CLASSES_DATA_REQUEST,
    fetchUncategorisedClassesData
  )
}

function* deleteDraftRequest(action) {
  try {
    yield put({
      type: CommonActionType.SET_LOADER,
      payload: true,
    })
    const res = yield call(Api.deleteDraft, action.payload)
    yield put({
      type: PostActionType.FETCH_POSTS_DATA_REQUEST,
    })
    if (res.status) {
      yield put(showSuccessToast(communicationDeletedSuccessfully))
    } else {
      yield put(showErrorToast(res.msg))
    }
  } catch (e) {
    yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
  }
  yield put({
    type: CommonActionType.SET_LOADER,
    payload: false,
  })
  yield put({
    type: PostActionType.IS_DELETE_POST_MODAL_OPEN,
    payload: false,
  })
  yield put({
    type: PostActionType.POST_TITLE_FOR_DELETE,
    payload: null,
  })
  yield put({
    type: PostActionType.POST_TO_DELETE_INFO,
    payload: null,
  })
}

export function* watchDeleteDraftRequest() {
  yield takeEvery(CommonActionType.DELETE_DRAFT_REQUEST, deleteDraftRequest)
}

function* getTemplateData() {
  try {
    const res = yield call(Api.getTemplate)
    if (res.status) {
      yield put({
        type: TemplateActionTypes.SET_TEMPLATE_DATA,
        payload: res.obj,
      })
    } else {
      yield put(showErrorToast(res.msg))
    }
  } catch (e) {
    yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
  }
}

export function* watchGetTemplateData() {
  yield takeEvery(TemplateActionTypes.GET_TEMPLATES, getTemplateData)
}

function* sendReminder(action) {
  try {
    const res = yield call(Api.sendReminder, action.payload)
    yield put({
      type: PostActionType.FETCH_POSTS_DATA_REQUEST,
    })
    if (res.status) {
      yield put(showSuccessToast(reminderSentSuccessfully))
    } else {
      yield put(showErrorToast(res.msg))
    }
  } catch (e) {
    yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
  }
}

export function* watchSendReminder() {
  yield takeEvery(CommonActionType.SEND_REMINDER, sendReminder)
}

function* getPostReceiversList(action) {
  yield put({
    type: CommonActionType.SET_USER_SEGMENT_LOADER,
    payload: true,
  })
  try {
    const res = yield call(Api.getPostReceiversList, action.payload)

    if (res.status) {
      yield put({
        type: CommonActionType.FETCH_POST_RECEIVERS_LIST_SUCCESS,
        payload: res.obj,
      })
    } else {
      yield put(showErrorToast(receiverListError))
    }
  } catch (e) {
    yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
  }
  yield put({
    type: CommonActionType.SET_USER_SEGMENT_LOADER,
    payload: false,
  })
}

export function* watchGetPostReceiversList() {
  yield takeEvery(
    CommonActionType.FETCH_POST_RECEIVERS_LIST_REQUEST,
    getPostReceiversList
  )
}

function* removePostRequest(action) {
  try {
    yield put({
      type: CommonActionType.SET_LOADER,
      payload: true,
    })
    const res = yield call(Api.removePost, action.payload)
    if (res.status) {
      yield put({
        type: PostActionType.FETCH_POSTS_DATA_REQUEST,
      })
      yield put(showSuccessToast(communicationRemovedSuccessfully))
    } else {
      yield put(showErrorToast(res.msg))
    }
  } catch (e) {
    yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
  }
  yield put({
    type: CommonActionType.SET_LOADER,
    payload: false,
  })
  yield put({
    type: PostActionType.IS_DELETE_POST_MODAL_OPEN,
    payload: false,
  })
  yield put({
    type: PostActionType.POST_TITLE_FOR_DELETE,
    payload: null,
  })
  yield put({
    type: PostActionType.POST_TO_DELETE_INFO,
    payload: null,
  })
}

export function* watchRemovePostRequest() {
  yield takeEvery(CommonActionType.REMOVE_POST, removePostRequest)
}

function* editCommunicationPostRequest({payload}) {
  delete payload.editPost
  try {
    const res = yield call(Api.editCommunication, payload)

    if (res.status) {
      yield put({
        type: PostActionType.FETCH_POSTS_DATA_REQUEST,
      })
      yield put(showSuccessToast(communicationUpdatedSuccessfully))
    } else {
      yield put(showErrorToast(res.msg))
    }
  } catch (e) {
    yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
  }
}
export function* watchEditCommunicationPostRequest() {
  yield takeEvery(
    CommonActionType.EDIT_COMMUNICATION_POST,
    editCommunicationPostRequest
  )
}

function* fetchSelectedUsersData(action) {
  try {
    const res = yield call(Api.getSelectedUsers, action.payload)
    yield put({
      type: CommonActionType.SELECTED_USERS,
      payload: res.status ? res.obj : [],
    })
    if (!res.status) {
      yield put(showErrorToast(res.msg))
    }
  } catch (e) {
    yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
  }
}

export function* watchFetchSelectedUsersData() {
  yield takeEvery(
    AnnouncementActionType.GET_SELECTED_USERS_LIST,
    fetchSelectedUsersData
  )
}

function* fetchSmsTemplatesData(action) {
  yield put({
    type: CommonActionType.SET_USER_SEGMENT_LOADER,
    payload: true,
  })
  try {
    const res = yield call(Api.getSmsTemplates, action.payload)
    if (res.status) {
      yield put({
        type: SmsActionType.SET_SMS_TEMPLATES,
        payload: res.obj.templates,
      })
      yield put({
        type: SmsActionType.SET_SMS_TEMPLATE_VARIABLES,
        payload: res.obj.variables,
      })
    } else {
      yield put(showErrorToast(receiverListError))
    }
  } catch (e) {
    yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
  }
  yield put({
    type: CommonActionType.SET_USER_SEGMENT_LOADER,
    payload: false,
  })
}

export function* watchFetchSmsTemplatesData() {
  yield takeEvery(SmsActionType.GET_SMS_TEMPLATES, fetchSmsTemplatesData)
}

function* fetchSmsUnusedQuota() {
  try {
    const res = yield call(Api.getSmsUnusedQuota)
    if (res.status) {
      yield put({
        type: SmsActionType.SET_SMS_UNUSED_QUOTA,
        payload: res.obj.sms_balance,
      })
      yield put({
        type: SmsActionType.SET_SMS_USED_QUOTA,
        payload: res.obj.price_per_block,
      })
    } else {
      yield put(showErrorToast(receiverListError))
    }
  } catch (e) {
    yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
  }
}

export function* watchfetchSmsUnusedQuota() {
  yield takeEvery(SmsActionType.GET_SMS_UNUSED_QUOTA, fetchSmsUnusedQuota)
}
function* fetchSmsPreview({payload}) {
  try {
    const res = yield call(Api.getSmsPreview, payload)
    if (res.status) {
      yield put({
        type: SmsActionType.SET_SMS_PREVIEW,
        payload: res.obj,
      })
      yield put({
        type: SmsActionType.SET_SMS_CREDIT_REQUIRED,
        payload: res.obj.sms_count,
      })
    }
  } catch (e) {
    yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
  }
}

export function* watchFetchSmsPreview() {
  yield takeEvery(SmsActionType.GET_SMS_PREVIEW, fetchSmsPreview)
}
function* sendCommunicationSms({payload}) {
  yield put({
    type: CommonActionType.SET_LOADER,
    payload: true,
  })
  try {
    const res = yield call(Api.sendSms, payload)
    if (res.status) {
      yield put({
        type: PostActionType.FETCH_POSTS_DATA_REQUEST,
      })
      yield put(showSuccessToast(communicationCreatedSuccessfully))
      yield put({type: SmsActionType.GET_SMS_UNUSED_QUOTA})
    } else {
      yield put(showErrorToast(res.msg))
    }
  } catch (e) {
    yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
  }
  yield put({
    type: CommonActionType.SET_LOADER,
    payload: false,
  })
}
export function* watchSendCommunicationSms() {
  yield takeEvery(SmsActionType.SEND_SMS, sendCommunicationSms)
}

function* createSmsOrder({payload}) {
  try {
    const res = yield call(Api.createSmsRechargeOrder, payload)
    if (res.status) {
      yield put({
        type: SmsActionType.CREATE_SMS_ORDER,
        payload: {
          id: res.obj._id,
          order_id: res.obj.razorpay_order_id,
          amount: res.obj.amount,
        },
      })
    }
  } catch (e) {
    yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
  }
}

export function* watchCreateSmsOrder() {
  yield takeEvery(SmsActionType.GET_SMS_ORDER, createSmsOrder)
}

function* verifySmsRecharge({payload}) {
  const res = yield call(Api.verifySmsRecharge, payload.payload)
  if (res.status) {
    payload.onSuccess()
  } else {
    payload.onFailure()
  }
}
export function* watchVerifySmsRecharge() {
  yield takeEvery(SmsActionType.VERIFY_SMS_ORDER, verifySmsRecharge)
}
