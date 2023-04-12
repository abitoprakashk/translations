import {call, put, takeEvery} from 'redux-saga/effects'
import {showErrorToast} from '../../../../redux/actions/commonAction'
import * as Api from '../../apiService'
import {
  CreateCertificateItemTypes,
  CertificateInfoActionType,
  StudentProfileDataActions,
  CertificateActions,
} from '../actionTypes'

import {getUserDetails} from '../../../user-profile/apiService'

function* fetchTabInfo({payload}) {
  try {
    const res = yield call(Api.getCertificateData, payload)
    const {
      data: {obj, status},
      type,
    } = res
    if (status == true) {
      yield put({
        type: CertificateInfoActionType.FETCH_CERTIFICATE_TAB_DATA_SUCCESS,
        payload: obj,
      })
      if (!type)
        yield put({
          type: CertificateInfoActionType.FETCH_CERTIFICATE_ALL_TAB_DATA,
          payload: obj.length,
        })
    } else {
      yield put({
        type: CertificateInfoActionType.FETCH_CERTIFICATE_TAB_DATA_FAILURE,
      })
      yield put(
        showErrorToast('Something went wrong, please check your network')
      )
    }
  } catch (e) {
    console.error(e)
    yield put({
      type: CertificateInfoActionType.FETCH_CERTIFICATE_TAB_DATA_FAILURE,
    })
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}

function* generateCertificate(data) {
  try {
    yield put({
      type: CreateCertificateItemTypes.GENERATE_CERTIFICATE_ITEM_LOADING,
      loading: true,
    })
    const res = yield call(Api.createCertificate, data.payload)
    if (res.status === true) {
      // yield put(
      //   showSuccessToast(
      //     `${data?.payload?._id ? 'Updated' : 'Added'} successfully`
      //   )
      // )
      yield put({
        type: CreateCertificateItemTypes.GENERATE_CERTIFICATE_ITEM_SUCCESS,
        url: `${res?.obj?.certificate_link}?timestamp=${+new Date()}_${
          data?.payload?.tag
        }`,
      })
    } else {
      yield put(
        showErrorToast('Something went wrong, please check your network')
      )
      yield put({
        type: CreateCertificateItemTypes.GENERATE_CERTIFICATE_ITEM_FAILURE,
        loading: false,
      })
    }
  } catch (e) {
    console.error(e)
    yield put({
      type: CreateCertificateItemTypes.GENERATE_CERTIFICATE_ITEM_FAILURE,
      loading: false,
    })
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}

function* getStudentProfileData(data) {
  try {
    yield put({
      type: CreateCertificateItemTypes.GENERATE_CERTIFICATE_ITEM_LOADING,
      loading: true,
    })
    const res = yield call(getUserDetails, {
      imember_id: data.payload.imember_id,
    })
    if (res.status === true) {
      const result = res?.obj
      yield put({
        type: CertificateActions.SET_STUDENT_INFO,
        payload: {
          ...result,
          class_room: `${result?.standard}${
            result?.section ? '-' + result?.section : ''
          }`,
        },
      })
      yield put({
        type: CreateCertificateItemTypes.GENERATE_CERTIFICATE_ITEM_LOADING,
        loading: false,
      })
    } else {
      yield put(
        showErrorToast('Something went wrong, please check your network')
      )
      yield put({
        type: StudentProfileDataActions.FETCH_CERTIFICATE_STUDENT_DATA_FAILURE,
        loading: false,
      })
    }
  } catch (e) {
    console.error(e)
    yield put({
      type: StudentProfileDataActions.FETCH_CERTIFICATE_STUDENT_DATA_FAILURE,
      loading: false,
    })
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}

export function* watchFetchTabInfoCertificate() {
  yield takeEvery(
    CertificateInfoActionType.FETCH_CERTIFICATE_TAB_DATA_REQUEST,
    fetchTabInfo
  )
}

export function* watchGetStudentProfileData() {
  yield takeEvery(
    StudentProfileDataActions.FETCH_CERTIFICATE_STUDENT_DATA_REQUEST,
    getStudentProfileData
  )
}

export function* watchGenerateCertificate() {
  yield takeEvery(
    CreateCertificateItemTypes.GENERATE_CERTIFICATE_ITEM,
    generateCertificate
  )
}
