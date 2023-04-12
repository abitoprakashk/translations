import {call, put, takeEvery} from 'redux-saga/effects'
import {showToast} from '../../../redux/actions/commonAction'
import globalActions from '../../../redux/actions/global.actions'
import {v4 as uuidv4} from 'uuid'
import {t} from 'i18next'
import {
  getPersonaMembers,
  getPersonaSettings,
  getUuidSignedUrl,
  uploadDocSignedUrl,
  uploadAttachmentId,
} from './DocumentActions.apis'

function* getSettings({payload}) {
  const res = yield call(getPersonaSettings, payload)
  if (res?.data?.status) {
    const settings = res.data.obj
    if (settings.length === 0) {
      yield put(showToast({type: 'error', message: t('settingsNotFound')}))
      yield put(globalActions.institutePersonaSettings.failure(true))
    } else {
      yield put(globalActions.institutePersonaSettings.success(settings))
    }
  } else {
    yield put(showToast({type: 'error', message: t('genericErrorMessage')}))
    yield put(globalActions.institutePersonaSettings.failure(true))
  }
}

function* getMember({payload}) {
  const res = yield call(getPersonaMembers, payload)
  if (res?.data?.status) {
    const personaData = res.data.obj
    if (personaData.length > 0) {
      yield put(globalActions.documentPersonaMember.success(personaData[0]))
    } else {
      yield put(showToast({type: 'error', message: t('userDataNotFound')}))
      yield put(globalActions.documentPersonaMember.failure(true))
    }
  } else {
    yield put(showToast({type: 'error', message: t('genericErrorMessage')}))
    yield put(globalActions.documentPersonaMember.failure(true))
  }
}

function* updateMemberDoc({payload}) {
  const file_name = payload.fileName
  const attachment_id = uuidv4()
  let extension = file_name.split('.')
  extension = extension[extension.length - 1]
  const signedUrlUuidPayload = {extension: extension, _id: attachment_id}
  const uuidResponse = yield call(getUuidSignedUrl, signedUrlUuidPayload)
  if (uuidResponse?.data?.status) {
    const signedUrl = uuidResponse.data.obj.signed_url
    const attachment_id = uuidResponse.data.obj.uuid
    const uploadUuidPayload = {signedUrl: signedUrl, attachment: payload.file}
    uploadDocSignedUrl(
      uploadUuidPayload,
      () => {
        payload.successCallback(attachment_id, payload.field)
      },
      () => {
        payload.failureCallback()
      }
    )
  } else {
    yield put(showToast({type: 'error', message: t('genericErrorMessage')}))
    payload.failureCallback()
  }
}

function* uploadMemberLink({payload}) {
  const refresh = payload.refreshPersona
  delete payload.refreshPersona
  const uploadPayload = {
    attachment_id: payload.doc_url,
    imember_id: payload.imember_id,
    key_id: payload.key_id,
  }
  const res = yield call(uploadAttachmentId, uploadPayload)
  if (res?.data?.status) {
    refresh(payload.imember_id)
    if (payload?.doc_url !== '') {
      yield put(
        showToast({type: 'success', message: t('documentUpdateSuccess')})
      )
    } else {
      yield put(
        showToast({type: 'success', message: t('documentRemovedSuccess')})
      )
    }
  } else {
    refresh(payload.imember_id)
    let errorMessage = t('genericErrorMessage')
    if (res?.data?.error_obj?.error_message) {
      errorMessage = res?.data?.error_obj?.error_message
    }
    yield put(showToast({type: 'error', message: errorMessage}))
  }
}

export function* watchDocumentUpload() {
  yield takeEvery(globalActions.institutePersonaSettings.REQUEST, getSettings)
  yield takeEvery(globalActions.documentPersonaMember.REQUEST, getMember)
  yield takeEvery(globalActions.updateMemberDocument.REQUEST, updateMemberDoc)
  yield takeEvery(globalActions.uploadLink.REQUEST, uploadMemberLink)
}
