import {call, put, takeEvery} from 'redux-saga/effects'
import {
  showErrorToast,
  showSuccessToast,
} from '../../../../redux/actions/commonAction'
import * as Api from '../../apis/staff.apis'
import globalActions from '../../../../redux/actions/global.actions'
import {uploadFileBySignedUrl} from '../../../../utils/SignedUrlUpload'
import {t} from 'i18next'
import {MAX_STAFF_DOCUMENT_SIZE} from '../../pages/StaffPage/constants'

function* fetchTransportStaff({successAction, failureAction}) {
  try {
    const response = yield call(Api.fetchStaff)
    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      yield put(globalActions.transportStaff.success(response?.data?.obj))
    } else throw response?.data?.msg
  } catch (error) {
    failureAction?.()
    yield put(globalActions.transportStaff.failure(error))
    yield put(
      showErrorToast(error || 'Something went wrong, please check your network')
    )
  }
}

function* updateTransportStaff({data, successAction, failureAction} = {}) {
  try {
    const payloadForSignedUrls = getPayloadForSignedUrl(data)
    const signedUrlRespose = yield call(
      Api.fetchSignedUrls,
      payloadForSignedUrls
    )
    if (!signedUrlRespose?.data?.status) throw signedUrlRespose?.data.msg
    const urlData = signedUrlRespose?.data?.obj
    const updatedData = yield call(uploadFilestoUrls, urlData, data)
    const response = yield call(Api.updateStaff, updatedData)
    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      yield put(globalActions.updateTransportStaff.success(response?.data?.obj))
      yield put(globalActions.transportStaff.request())
      yield put(globalActions?.transportAggregates?.request())
      yield put(
        showSuccessToast(
          data?.staff_list?.[0]?._id
            ? t('staffUpdatedSuccessfully')
            : t('staffCreatedSuccessfully')
        )
      )
      yield put(globalActions.transportRoutes.request())
    } else if (response?.data?.error_code === 7082) {
      throw t('duplicateStaffContact')
    } else throw response?.data?.msg
  } catch (error) {
    failureAction?.()
    yield put(globalActions.updateTransportStaff.failure(error))
    yield put(
      showErrorToast(error || 'Something went wrong, please check your network')
    )
  }
}

function* deleteTransportStaff({data, successAction, failureAction} = {}) {
  try {
    const response = yield call(Api.deleteStaff, data)
    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      yield put(globalActions.deleteTransportStaff.success(response?.data?.obj))
      yield put(globalActions?.transportAggregates?.request())

      yield put(globalActions.transportStaff.request())
      yield put(showSuccessToast(t('staffDeletedSuccessfully')))
      yield put(globalActions.transportRoutes.request())
    } else throw response?.data?.msg
  } catch (error) {
    failureAction?.()
    yield put(globalActions.deleteTransportStaff.failure(error))
    yield put(
      showErrorToast(error || 'Something went wrong, please check your network')
    )
  }
}

function getPayloadForSignedUrl(data) {
  let list = []
  data.staff_list?.forEach((item) => {
    if (item.idProof) {
      const fileNameList = item?.idProof?.name?.split('.')
      const fileExtension = fileNameList?.pop()
      fileNameList?.push(`.${fileExtension?.toLowerCase()}`)
      list.push({
        uid: item.phone_number,
        file_name: fileNameList?.join('') || '',
      })
    }
  })
  return {staff_list: list}
}

async function uploadFilestoUrls(urlData, data) {
  let promiseList = []
  urlData?.forEach((item) => {
    let staffObj = data?.staff_list?.find(
      (obj) => obj.phone_number === item.uid
    )
    const currentBlob = staffObj.idProof
    delete staffObj.idProof
    promiseList.push(
      uploadFileBySignedUrl(item.signed_url, currentBlob, {
        chunkSize: MAX_STAFF_DOCUMENT_SIZE,
        onChunkUploadError: () => {
          showErrorToast(
            `Error occured while uploading IDProof for ${staffObj.name}`
          )
        },
        uploadFinished: () => {
          staffObj.document_url = item.public_url
        },
      })
    )
  })
  await Promise.all(promiseList)
  return data
}

export function* watchTransportStaffSaga() {
  yield takeEvery(globalActions.transportStaff.REQUEST, fetchTransportStaff)
  yield takeEvery(
    globalActions.updateTransportStaff.REQUEST,
    updateTransportStaff
  )
  yield takeEvery(
    globalActions.deleteTransportStaff.REQUEST,
    deleteTransportStaff
  )
}
