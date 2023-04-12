import {call, put, takeEvery} from 'redux-saga/effects'
import {CONTENT_ACTION_TYPES} from '../actionTypes'
import * as Api from '../../apiService'
import {
  PAYLOAD_FIELDS,
  PDF_URL_PREFIX,
  REPORT_CONTENT_MODAL,
  VIDEOS,
  COURSE_CATEGORY,
} from '../../constants'
import {
  showErrorToast,
  showSuccessToast,
} from '../../../../redux/actions/commonAction'
import {
  setContentAccessCheckPopupAction,
  setIsContentReportedAction,
  accessAccessCheckLoaderAction,
} from '../actions/contentActions'

function* fecthTaxonomyData(action) {
  try {
    const res = yield call(Api.fetchTaxonomyData, action.payload)
    if (res.status) {
      switch (action.payload.field) {
        case PAYLOAD_FIELDS.language: {
          yield put({
            type: CONTENT_ACTION_TYPES.SET_LANGUAGE_LOADER,
            payload: true,
          })

          yield put({
            type: CONTENT_ACTION_TYPES.SET_LANGUAGE_LIST,
            payload: {
              list: res.obj,
              course: action.payload.tfile_id,
            },
          })
          break
        }
        case PAYLOAD_FIELDS.className:
          yield put({
            type: CONTENT_ACTION_TYPES.FETCH_TAXONOY_CLASS_LIST_SUCCESS,
            payload: res.obj,
          })
          break

        case PAYLOAD_FIELDS.subjectName:
          yield put({
            type: CONTENT_ACTION_TYPES.FETCH_TAXONOY_SUBJECT_LIST_SUCCESS,
            payload: res.obj,
          })
          break
        case PAYLOAD_FIELDS.topicName: {
          yield put({
            type: CONTENT_ACTION_TYPES.SET_TOPIC_LIST,
            payload: res.obj,
          })
          break
        }
        case PAYLOAD_FIELDS.course: {
          let courseArr = [],
            comingSoonArr = [],
            isLockedArr = []
          if (res.obj) {
            let resData = res.obj
            resData.forEach((element) => {
              if (element.is_locked) {
                isLockedArr.push(element)
              } else if (element.coming_soon) {
                if (
                  element.category === COURSE_CATEGORY.stateLevel ||
                  element.category === COURSE_CATEGORY.nationalLevel
                )
                  comingSoonArr.push(element)
                else return
              } else courseArr.push(element)
            })
            courseArr.push(...isLockedArr)
            courseArr.push(...comingSoonArr)
          }
          yield put({
            type: CONTENT_ACTION_TYPES.FETCH_COURSE_LIST_SUCCESS,
            payload: courseArr,
          })
          break
        }
        default:
          yield put({
            type: CONTENT_ACTION_TYPES.FETCH_TAXONOY_SUCCESS,
            payload: false,
          })
          break
      }

      yield put({
        type: CONTENT_ACTION_TYPES.FETCH_TAXONOY_SUCCESS,
        payload: false,
      })
    }
  } catch (error) {
    yield put(showErrorToast(error.msg))
  }
}

export function* watchFetchTaxonomyData() {
  yield takeEvery(
    CONTENT_ACTION_TYPES.FETCH_TAXONOY_REQUESTED,
    fecthTaxonomyData
  )
}

function* fetchContentListData(action) {
  try {
    yield put({
      type: CONTENT_ACTION_TYPES.SET_CONTENT_LIST_LOADER,
      payload: true,
    })
    const res = yield call(Api.fetchContentListData, action.payload)
    yield put({
      type: CONTENT_ACTION_TYPES.FETCH_CONTENT_LIST_SUCCESS,
      payload: res.obj,
    })
    yield put({
      type: CONTENT_ACTION_TYPES.SET_CONTENT_LIST_LOADER,
      payload: false,
    })
  } catch (error) {
    yield put(showErrorToast(error.msg))
    yield put({
      type: CONTENT_ACTION_TYPES.SET_CONTENT_LIST_LOADER,
      payload: false,
    })
  }
}

export function* watchFetchContentListData() {
  yield takeEvery(
    CONTENT_ACTION_TYPES.FETCH_CONTENT_LIST_REQUEST,
    fetchContentListData
  )
}

function* reportContent(action) {
  try {
    const res = yield call(Api.reportContent, action.payload)
    yield put(
      showSuccessToast(res.msg ? res.msg : REPORT_CONTENT_MODAL.contentReported)
    )
    yield put({
      type: CONTENT_ACTION_TYPES.SET_CONTENT_FOR_REPORT,
      payload: null,
    })
    yield put(setIsContentReportedAction(true))
  } catch (error) {
    yield put(showErrorToast(error.msg))
  }
}

export function* watchReportContent() {
  yield takeEvery(CONTENT_ACTION_TYPES.REPORT_CONTENT_REQUEST, reportContent)
}

function* requestContentAccessCheck(action) {
  try {
    accessAccessCheckLoaderAction(true)
    const res = yield call(
      Api.checkUserAccessToContent,
      action.payload.instituteId
    )
    if (res.obj.has_authorization) {
      yield put(setContentAccessCheckPopupAction(false))
      yield put({
        type: CONTENT_ACTION_TYPES.CONTENT_ACCESS_CHECK_SUCCESS,
        payload: res.obj.has_authorization,
      })
    } else {
      yield put({
        type: CONTENT_ACTION_TYPES.CONTENT_ACCESS_CHECK_SUCCESS,
        payload: false,
      })
      yield put(setContentAccessCheckPopupAction(true))
    }
  } catch (error) {
    yield put(showErrorToast(error.msg))
  }
}

export function* watchRequestContentAccessCheck() {
  yield takeEvery(
    CONTENT_ACTION_TYPES.CONTENT_ACCESS_CHECK_REQUESTED,
    requestContentAccessCheck
  )
}

function* fetchContent(action) {
  try {
    accessAccessCheckLoaderAction(true)
    const res = yield call(Api.fetchContent, action.payload.uuid)

    yield put({
      type: CONTENT_ACTION_TYPES.SET_CONTENT,
      payload: res.obj,
    })

    if (action.payload.contentType === VIDEOS) {
      yield put({
        type: CONTENT_ACTION_TYPES.SET_IS_VIDEO_MODAL_OPEN,
        payload: true,
      })
    } else {
      yield put({
        type: CONTENT_ACTION_TYPES.IS_STUDY_MATERIAL_CONTENT_SET,
        payload: true,
      })
      // window.open(`${PDF_URL_PREFIX}${res.obj.content_url}`, '_blank')
      window.open(
        `${PDF_URL_PREFIX}${encodeURIComponent(res.obj.content_url)}`,
        '_blank'
      )
    }
  } catch (error) {
    yield put(showErrorToast(error.msg))
  }
}

export function* watchFetchContent() {
  yield takeEvery(CONTENT_ACTION_TYPES.FETCH_CONTENT, fetchContent)
}
