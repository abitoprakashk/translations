import {call, put, takeEvery} from 'redux-saga/effects'
import {
  showErrorToast,
  showSuccessToast,
} from '../../../../redux/actions/commonAction'
import * as Api from '../../apis/vehicles.apis'
import globalActions from '../../../../redux/actions/global.actions'
import {t} from 'i18next'
import {uploadFileBySignedUrl} from '../../../../utils/SignedUrlUpload'
import {MAX_VEHICLE_DOCUMENT_SIZE} from '../../pages/VehiclesPage/constants'

function* fetchTransportVehicles({successAction, failureAction}) {
  try {
    const response = yield call(Api.fetchVehicles)
    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      yield put(globalActions.transportVehicles.success(response?.data?.obj))
    } else throw response?.data?.msg
  } catch (error) {
    failureAction?.()
    yield put(globalActions.transportVehicles.failure(error))
    yield put(
      showErrorToast(error || 'Something went wrong, please check your network')
    )
  }
}

function* updateTransportVehicles({data, successAction, failureAction} = {}) {
  try {
    const payloadForSignedUrls = getPayloadForSignedUrl(data)
    const signedUrlRespose = yield call(
      Api.fetchDocumentSignedUrls,
      payloadForSignedUrls
    )
    if (!signedUrlRespose?.data?.status) {
      throw new Error(signedUrlRespose?.data?.msg)
    }
    const updatedData = yield call(
      uploadFilesToSignedUrls,
      signedUrlRespose?.data?.obj,
      data
    )
    const response = yield call(Api.updateVehicles, updatedData)
    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      yield put(
        globalActions.updateTransportVehicles.success(response?.data?.obj)
      )
      yield put(globalActions.transportVehicles.request())
      yield put(globalActions?.transportAggregates?.request())
      yield put(
        showSuccessToast(
          data?.vehicles_list?.[0]?._id
            ? t('vehicleUpdatedSuccessfully')
            : t('vehicleCreatedSuccessfully')
        )
      )
      yield put(globalActions.transportRoutes.request())
    } else if (response?.data?.error_code === 7082) {
      throw new Error(t('duplicateVehicleNumErrMsg'))
    } else throw new Error(response?.data?.msg)
  } catch (error) {
    failureAction?.()
    yield put(globalActions.updateTransportVehicles.failure(error))
    yield put(
      showErrorToast(
        error.message || 'Something went wrong, please check your network'
      )
    )
  }
}

function* deleteTransportVehicles({data, successAction, failureAction}) {
  try {
    const response = yield call(Api.deleteVehicle, data)
    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      yield put(
        globalActions.deleteTransportVehicles.success(response?.data?.obj)
      )
      yield put(globalActions?.transportAggregates?.request())

      yield put(globalActions.transportVehicles.request())
      yield put(globalActions.transportRoutes.request())
      yield put(showSuccessToast(t('vehicleDeletedSuccessfully')))
    } else throw response?.data?.msg
  } catch (error) {
    failureAction?.()
    yield put(globalActions.deleteTransportVehicles.failure(error))
    yield put(
      showErrorToast(error || 'Something went wrong, please check your network')
    )
  }
}

function getPayloadForSignedUrl(data) {
  let docsData = []
  data?.vehicles_list?.forEach((vehicle) => {
    if (!vehicle.documents) return
    vehicle?.documents?.forEach((doc, index) => {
      if (!doc?.blob?.name) return
      docsData.push({
        id: `${vehicle.number}_${index}`,
        file_name: doc?.blob?.name,
      })
    })
  })
  return {data: docsData}
}

async function uploadFilesToSignedUrls(urlData, data) {
  let promiseList = []
  for (let docUrlData of urlData) {
    const [vehicleNumber, index] = docUrlData.id.split('_')
    let currentVehicleDoc = data?.vehicles_list?.find(
      (obj) => obj.number === vehicleNumber
    ).documents[index]
    let currentBlob = currentVehicleDoc?.blob
    // delete blob from document data and add public url on upload success
    delete currentVehicleDoc?.blob
    promiseList.push(
      uploadFileBySignedUrl(docUrlData.signed_url, currentBlob, {
        chunkSize: MAX_VEHICLE_DOCUMENT_SIZE,
        onChunkUploadError: async () => {
          showErrorToast(
            `Error occured while uploading ${currentBlob.name} for ${vehicleNumber}`
          )
        },
        uploadFinished: () => {
          currentVehicleDoc.public_url = docUrlData.public_url
        },
      })
    )
  }
  await Promise.all(promiseList)
  return data
}

export function* watchTransportVehiclesSaga() {
  yield takeEvery(
    globalActions.transportVehicles.REQUEST,
    fetchTransportVehicles
  )
  yield takeEvery(
    globalActions.updateTransportVehicles.REQUEST,
    updateTransportVehicles
  )
  yield takeEvery(
    globalActions.deleteTransportVehicles.REQUEST,
    deleteTransportVehicles
  )
}
