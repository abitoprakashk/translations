import {t} from 'i18next'
import {call, put, takeEvery} from 'redux-saga/effects'
import globalActions from '../../../redux/actions/global.actions'
import {showErrorToast} from '../../../redux/actions/commonAction'
import * as Api from '../apis/apiService'
import {uploadFileBySignedUrl} from '../../../utils/SignedUrlUpload'

function* uploadDocument({data, successAction, failureAction}) {
  try {
    const response = yield call(Api.uploadDocument, {
      documents: {[data.keyId]: data.file.name},
    })
    if (
      response?.data?.status &&
      Object.keys(response?.data?.obj).length !== 0
    ) {
      const signedUrl = response?.data?.obj[data.keyId].signed_url
      uploadFileBySignedUrl(signedUrl, data.file, {
        imageCompression: true,
        uploadFinished: () => {},
        onChunkUploadError: () => {},
      })
      successAction?.(response?.data?.obj[data.keyId].permanent_url)
      yield put(globalActions.admissionFormDocument.success())
    } else throw response?.data?.msg
  } catch (error) {
    failureAction?.()
    yield put(globalActions.admissionFormDocument.failure())
    yield put(
      showErrorToast(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    )
  }
}
export function* watchAdmissionCrmUploadDocument() {
  yield takeEvery(globalActions.admissionFormDocument.REQUEST, uploadDocument)
}
