import {call, put, select, takeEvery, takeLatest} from 'redux-saga/effects'
import * as Api from '../../apiService'
import {Trans} from 'react-i18next'
import {
  showErrorToast,
  showSuccessToast,
} from '../../../../redux/actions/commonAction'
import {events} from '../../../../utils/EventsConstants'
import globalActions from '../../../../redux/actions/global.actions'
import {FIELD_TYPES} from '../../ProfileSettings.constant'

// Get Event Manager
const getEventManager = (state) => state.eventManager

// Messages translation
const somethingWentWrongPleaseCheckYourNetwork = (
  <Trans i18nKey={'fetchPostsListErrorToast'}>
    Something went wrong, please check your network
  </Trans>
)
const sectionCreatedSuccessfullyMsg = (
  <Trans i18nKey={'sectionCreatedSuccessfullyMsg'}>
    New section created successfully
  </Trans>
)
const operationFailedMsg = (
  <Trans i18nKey={'operationFailedMsg'}>
    {`Changes couldn't be saved. Please try again`}
  </Trans>
)

// Field create success msg
const getCreateFieldSuccessfullyMsg = (fielType) => {
  let msgText = ''
  if (fielType == FIELD_TYPES['DOCUMENT'].key) {
    msgText = (
      <Trans i18nKey={'docFieldCreatedSuccessfullyMsg'}>
        New document added successfully
      </Trans>
    )
  } else {
    msgText = (
      <Trans i18nKey={'fieldCreatedSuccessfullyMsg'}>
        New field created successfully
      </Trans>
    )
  }
  return msgText
}

// Field update success MSG
const getUpdateFieldSuccessfullyMsg = (fielType) => {
  let msgText = ''
  if (fielType == FIELD_TYPES['DOCUMENT'].key) {
    msgText = (
      <Trans i18nKey={'docUpdatedSuccessfullyMsg'}>
        Document settings updated successfully
      </Trans>
    )
  } else {
    msgText = (
      <Trans i18nKey={'fieldUpdatedSuccessfullyMsg'}>
        Field settings updated successfully
      </Trans>
    )
  }
  return msgText
}

// Get Persona Profile Settings Saga call
function* fetchPersonaWiseProfileSettings({
  data,
  successAction,
  failureAction,
}) {
  try {
    const response = yield call(Api.getPersonaProfileSettings, data)
    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      yield put(
        globalActions.fetchPersonaProfileSettingsRequestAction.success(
          response?.data?.obj
        )
      )
    } else {
      // else throw response?.data?.msg
      showErrorToast(response?.data?.msg)
    }
  } catch (error) {
    failureAction?.()
    yield put(
      globalActions.fetchPersonaProfileSettingsRequestAction.failure(
        error.message
      )
    )
    yield put(showErrorToast(error || somethingWentWrongPleaseCheckYourNetwork))
  }
}

// Submit Add Category Form Data
function* submitAddCategoryForm({data, successAction, failureAction}) {
  try {
    const response = yield call(Api.addCategorySubmitForm, data)
    if (response?.data?.status) {
      successAction?.(response?.data)
      yield put(
        globalActions.profileSettingAddCategoryFormSubmitRequestAction.success(
          sectionCreatedSuccessfullyMsg
        )
      )
      yield put(
        globalActions?.fetchPersonaProfileSettingsRequestAction?.request(data)
      )
      yield put(showSuccessToast(sectionCreatedSuccessfullyMsg))
      let eventManager = yield select(getEventManager)
      if (eventManager) {
        if (data?.setting_type == 3) {
          eventManager.send_event(events.NEW_DOCUMENTS_SECTION_SAVED_TFI, {
            screen_name: data?.persona,
            document_name: data?.label,
          })
        } else {
          eventManager.send_event(events.NEW_PROFILE_SECTION_SAVED_TFI, {
            screen_name: data?.persona,
            category_name: data?.label,
          })
        }
      }
    } else {
      yield put(
        globalActions.profileSettingAddCategoryFormSubmitRequestAction.failure(
          operationFailedMsg
        )
      )
      yield put(showErrorToast(operationFailedMsg))
    }
  } catch (error) {
    failureAction?.()
    yield put(
      globalActions.profileSettingAddCategoryFormSubmitRequestAction.failure(
        error.message
      )
    )
    yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
  }
}

// Get Specific Category and their fields data
function* fetchCategoryFieldsSettings({data, successAction, failureAction}) {
  try {
    const response = yield call(Api.getCategoryFieldsSettings, data)
    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      yield put(
        globalActions.requestForCategoryDetails.success(response?.data?.obj)
      )
    } else {
      showErrorToast(response?.data?.msg)
    }
  } catch (error) {
    failureAction?.()
    yield put(globalActions.requestForCategoryDetails.failure(error.message))
    yield put(showErrorToast(error || somethingWentWrongPleaseCheckYourNetwork))
  }
}

// Submit Category Field Form Data
function* submitCategoryAddFieldForm({data, successAction, failureAction}) {
  try {
    const response = yield call(Api.categoryAddFieldFormSubmit, data)
    const fieldCreatedSuccessfullyMsg = getCreateFieldSuccessfullyMsg(
      data.field_type
    )
    if (response?.data?.status) {
      successAction?.(response?.data)
      yield put(
        globalActions.addCategoryFieldFormSubmitRequest.success(
          fieldCreatedSuccessfullyMsg
        )
      )

      const getCategoryDetails = {
        category_id: data.category_id,
        userType: data.persona,
      }
      yield put(
        globalActions?.requestForCategoryDetails?.request(getCategoryDetails)
      )
      yield put(showSuccessToast(fieldCreatedSuccessfullyMsg))
      let eventManager = yield select(getEventManager)
      if (eventManager) {
        if (data?.setting_type == 3) {
          eventManager.send_event(events.NEW_PROFILE_DOCUMENTS_SAVED_TFI, {
            screen_name: data.persona,
            category_id: data.category_id,
            form_fields: data,
          })
        } else {
          eventManager.send_event(events.NEW_PROFILE_FIELD_SAVED_TFI, {
            screen_name: data.persona,
            category_id: data.category_id,
            form_fields: data,
          })
        }
      }
    } else {
      yield put(
        globalActions.addCategoryFieldFormSubmitRequest.failure(
          operationFailedMsg
        )
      )
      yield put(showErrorToast(operationFailedMsg))
    }
  } catch (error) {
    failureAction?.()
    yield put(
      globalActions.addCategoryFieldFormSubmitRequest.failure(error.message)
    )
    yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
  }
}

// Update Category Field Form Data
function* updateCategoryAndFieldForm({data, successAction, failureAction}) {
  try {
    const response = yield call(Api.categoryUpdateFieldFormSubmit, data)
    const fieldUpdatedSuccessfullyMsg = getUpdateFieldSuccessfullyMsg(
      data?.field_type
    )
    if (response?.data?.status) {
      successAction?.(response?.data)
      yield put(
        globalActions.updateCategoryFieldFormSubmitRequest.success(
          fieldUpdatedSuccessfullyMsg
        )
      )
      const getCategoryDetails = {
        category_id: data.category_id,
        userType: data.persona,
      }
      yield put(
        globalActions?.requestForCategoryDetails?.request(getCategoryDetails)
      )
      yield put(showSuccessToast(fieldUpdatedSuccessfullyMsg))
      let eventManager = yield select(getEventManager)
      if (eventManager) {
        if (data?.setting_type == 3) {
          eventManager.send_event(events.PROFILE_DOCUMENTS_EDITED_TFI, {
            screen_name: data.persona,
            category_id: data.category_id,
            form_fields: data,
          })
        } else {
          eventManager.send_event(events.PROFILE_FIELD_EDITED_TFI, {
            screen_name: data.persona,
            category_id: data.category_id,
            form_fields: data,
          })
        }
      }
    } else {
      yield put(
        globalActions.updateCategoryFieldFormSubmitRequest.failure(
          operationFailedMsg
        )
      )
      yield put(showErrorToast(operationFailedMsg))
    }
  } catch (error) {
    failureAction?.()
    yield put(
      globalActions.updateCategoryFieldFormSubmitRequest.failure(error.message)
    )
    yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
  }
}

export function* watchProfileSettingsSaga() {
  yield takeEvery(
    globalActions?.fetchPersonaProfileSettingsRequestAction?.REQUEST,
    fetchPersonaWiseProfileSettings
  )
  yield takeLatest(
    globalActions.profileSettingAddCategoryFormSubmitRequestAction?.REQUEST,
    submitAddCategoryForm
  )
  yield takeEvery(
    globalActions?.requestForCategoryDetails?.REQUEST,
    fetchCategoryFieldsSettings
  )
  // Add Category Field Form SubmitRequest
  yield takeLatest(
    globalActions.addCategoryFieldFormSubmitRequest?.REQUEST,
    submitCategoryAddFieldForm
  )
  //
  yield takeLatest(
    globalActions.updateCategoryFieldFormSubmitRequest?.REQUEST,
    updateCategoryAndFieldForm
  )
}
