import {call, put, takeEvery} from 'redux-saga/effects'
import {
  showErrorToast,
  showSuccessToast,
} from '../../../redux/actions/commonAction'
import {events} from '../../../utils/EventsConstants'
import * as Api from '../apis/fees.apis'
import feeCollectionActionTypes from './feeCollectionActionTypes'
import feeStructureActionTypes from '../redux/feeStructure/feeStructureActionTypes'
import {instituteInfoActionTypes} from '../../../redux/actionTypes'
import {
  feeCollectBackDatedPaymentTaskAcknowledgeRequest,
  setStudentIdsForFeeReminder,
} from './feeCollectionActions'
import {GENERIC_ERROR_MESSAGE} from '../../../../src/constants/common.constants.js'
import {
  CSV_PROCESS_STATUS,
  FILE_UPLOAD_ERROR_STATS_IDS,
  paymentStatus,
  RECEIPT_METHOD,
} from '../fees.constants'
import {pdfPrint} from '../../../utils/Helpers'
import {FEE_TAB_ACTION_TYPES} from '../../../components/SchoolSystem/StudentDirectory/redux/feeAndWallet/actionTypes'
import {setFeeCollectSliderScreen} from '../../../components/SchoolSystem/StudentDirectory/redux/feeAndWallet/actions'
import {createInvalidBackdatedStats} from '../helpers/helpers'
import {Trans} from 'react-i18next'

const somethingWentWrongPleaseCheckYourNetwork = (
  <Trans i18nKey={'fetchPostsListErrorToast'}>
    Something went wrong, please check your network
  </Trans>
)

const reminderSentTranslation = (studentLength) => (
  <Trans i18nKey={'reminderSentDynamic'}>
    Reminder sent to {{studentLength}}{' '}
    {{studentText: studentLength == 1 ? 'student' : 'students'}}
  </Trans>
)

function* fetchFeeStats() {
  try {
    const res = yield call(Api.fetchFeeCollectionStats)
    yield put({
      type: feeCollectionActionTypes.FETCH_FEE_STATS_SUCCEEDED,
      payload: res,
    })
  } catch (e) {
    yield put({
      type: feeCollectionActionTypes.FETCH_FEE_STATS_FAILED,
      payload: e.message,
    })
    yield put(showErrorToast(e.message))
  }
}

export function* watchFetchFeeStats() {
  yield takeEvery(
    feeCollectionActionTypes.FETCH_FEE_STATS_REQUESTED,
    fetchFeeStats
  )
}

function* fetchDashboardFeeStatistics() {
  try {
    const res = yield call(Api.fetchDashboardFeeStatistics)
    yield put({
      type: instituteInfoActionTypes.GET_DASHBOARD_FEE_STATISTICS_SUCCEEDED,
      payload: res,
    })
  } catch (e) {
    yield put({
      type: instituteInfoActionTypes.GET_DASHBOARD_FEE_STATISTICS_FAILED,
    })
    yield put(showErrorToast(e.msg))
  }
}

export function* watchFetchDashboardFeeStatistics() {
  yield takeEvery(
    instituteInfoActionTypes.GET_DASHBOARD_FEE_STATISTICS_REQUESTED,
    fetchDashboardFeeStatistics
  )
}

function* searchResults(action) {
  try {
    const {searchTerm} = action.payload
    const res = yield call(Api.searchStudents, searchTerm.trim())
    yield put({
      type: feeCollectionActionTypes.SEARCH_RESULTS_SUCCEEDED,
      payload: res,
    })
  } catch (e) {
    yield put({
      type: feeCollectionActionTypes.SEARCH_RESULTS_FAILED,
      payload: e.message,
    })
    yield put(showErrorToast(e.message))
  }
}

export function* watchSearchResults() {
  yield takeEvery(
    feeCollectionActionTypes.SEARCH_RESULTS_REQUESTED,
    searchResults
  )
}

function* fetchStudentDues(action) {
  const {classIds, sectionIds, paymentStatus} = action.payload
  try {
    const res = yield call(
      Api.fetchStudentDuesData,
      classIds,
      sectionIds,
      paymentStatus
    )
    yield put({
      type: feeCollectionActionTypes.STUDENT_DUES_SUCCEEDED,
      payload: res,
    })
  } catch (e) {
    yield put({
      type: feeCollectionActionTypes.STUDENT_DUES_FAILED,
      payload: e.message,
    })
    yield put(showErrorToast(e))
  }
}

export function* watchFetchStudentDues() {
  yield takeEvery(
    feeCollectionActionTypes.STUDENT_DUES_REQUESTED,
    fetchStudentDues
  )
}

function* downloadDemandLetter(action) {
  try {
    const response = yield call(
      Api.downloadDemandLetter,
      action.payload.studentId
    )
    yield put({
      type: feeCollectionActionTypes.DOWNLOAD_DEMAND_LETTER_SUCCEEDED,
    })
    if (response.status) {
      action.payload.eventManager.send_event(
        events.DEMAND_LETTER_DOWNLOADED_TFI
      )
      const newWindow = window.open(response.obj.url, '_blank')
      if (newWindow != null) {
        newWindow.focus()
      }
    } else {
      yield put(showErrorToast(response.msg))
    }
  } catch (e) {
    yield put({
      type: feeCollectionActionTypes.DOWNLOAD_DEMAND_LETTER_FAILED,
    })
    yield put(showErrorToast(e.msg))
  }
}

export function* watchDownloadDemandLetter() {
  yield takeEvery(
    feeCollectionActionTypes.DOWNLOAD_DEMAND_LETTER_REQUESTED,
    downloadDemandLetter
  )
}

function* fetchFeeHistory(action) {
  try {
    const {studentId} = action.payload
    const res = yield call(Api.fetchFeeHistory, studentId)
    yield put({
      type: feeCollectionActionTypes.FEE_HISTORY_SUCCEEDED,
      payload: res,
    })
  } catch (e) {
    yield put({
      type: feeCollectionActionTypes.FEE_HISTORY_FAILED,
      payload: e.message,
    })
    yield put(showErrorToast(e.message))
  }
}

export function* watchFeeHistory() {
  yield takeEvery(
    feeCollectionActionTypes.FEE_HISTORY_REQUESTED,
    fetchFeeHistory
  )
}

function* sendFeeReminder(action) {
  try {
    const {studentIds} = action.payload
    yield call(Api.sendReminder, studentIds)
    yield put({
      type: feeCollectionActionTypes.FEE_REMINDER_SUCCEEDED,
    })
    yield put(showSuccessToast(reminderSentTranslation(studentIds.length)))
  } catch (e) {
    yield put({
      type: feeCollectionActionTypes.FEE_REMINDER_FAILED,
      payload: e.message,
    })
    yield put(showErrorToast(e.message))
  }
}

export function* watchFeeReminder() {
  yield takeEvery(
    feeCollectionActionTypes.FEE_REMINDER_REQUESTED,
    sendFeeReminder
  )
}

function* fetchCollectFees(action) {
  try {
    const res = yield call(
      Api.collectPaymentDetail,
      action.payload.studentId,
      action.payload.advancePayment
    )
    yield put({
      type: feeCollectionActionTypes.COLLECT_FEES_SUCCEEDED,
      payload: res,
    })
  } catch (e) {
    yield put({
      type: feeCollectionActionTypes.COLLECT_FEES_FAILED,
    })
    yield put(showErrorToast(e.message))
  }
}

export function* watchCollectFees() {
  yield takeEvery(
    feeCollectionActionTypes.COLLECT_FEES_REQUESTED,
    fetchCollectFees
  )
}

function* submitCollectedFees(action) {
  const {studentId, data, metaData = {}} = action.payload
  try {
    const res = yield call(Api.collectFees, studentId, data, metaData)
    yield put({
      type: feeCollectionActionTypes.SUBMIT_FEES_SUCCEEDED,
      payload: res,
    })

    if (!metaData.isFeeCollectedFromStudentProfile) {
      yield put({
        type: feeCollectionActionTypes.SET_SLIDER_SCREEN,
        payload: null,
      })
    }

    if (
      res?.receipts?.length > 0 ||
      [paymentStatus.CHEQUE, paymentStatus.DD].includes(
        metaData.recordPaymentDetailForDownloadOrPrintReceipt?.paymentMode
      )
    ) {
      yield put({
        type: feeCollectionActionTypes.SET_RECORD_PAYMENT_DETAILS,
        payload: {
          isPopupOpen: true,
          ...metaData.recordPaymentDetailForDownloadOrPrintReceipt,
        },
      })
    }

    // if fee collected from student profil fee tab then get new fee summary and instalment wise data
    if (metaData.isFeeCollectedFromStudentProfile) {
      yield put({
        type: FEE_TAB_ACTION_TYPES.STUDENT_PROFILE_FEE_TAB_SUMMARY_REQUEST,
        payload: {studentId},
      })
      yield put({
        type: FEE_TAB_ACTION_TYPES.SET_STUDENT_PROFILE_FEE_INSTALLMENT_WISE_DETAILS_REQUEST,
        payload: {studentId},
      })
      yield put(setFeeCollectSliderScreen(false))
    }

    metaData?.onSuccess?.()

    yield put(
      showSuccessToast(
        'Payment recorded successfully. You can check the same in fee history'
      )
    )
  } catch (e) {
    if (metaData?.onFailure) {
      metaData?.onFailure({msg: e.message})
    } else {
      yield put({
        type: feeCollectionActionTypes.SUBMIT_FEES_FAILED,
      })
      yield put(showErrorToast(e.message))
    }
  }
}

export function* watchSubmitCollectedFees() {
  yield takeEvery(
    feeCollectionActionTypes.SUBMIT_FEES_REQUESTED,
    submitCollectedFees
  )
}

function* paymentGatewayStatus(action) {
  try {
    const instituteId = action.payload
    const res = yield call(Api.kycStatus, instituteId)
    yield put({
      type: feeCollectionActionTypes.PAYMENT_GATEWAY_SETUP_SUCCEEDED,
      payload: res,
    })
  } catch (e) {
    yield put({
      type: feeCollectionActionTypes.PAYMENT_GATEWAY_SETUP_FAILED,
      payload: e.message,
    })
    yield put(showErrorToast(e.message))
  }
}

export function* watchKycStatus() {
  yield takeEvery(
    feeCollectionActionTypes.PAYMENT_GATEWAY_SETUP_REQUESTED,
    paymentGatewayStatus
  )
}

function* createMultiplePaymentGateway(action) {
  try {
    const formData = action.payload
    const res = yield call(Api.multiplePaymentGatewayCreate, formData)
    if (res.verification_status) {
      yield put(showSuccessToast('API Verification Successful'))
      yield put({
        type: feeCollectionActionTypes.PAYMENT_GATEWAY_SETUP_REQUESTED,
        payload: formData.instituteId,
      })
      yield put({
        type: feeCollectionActionTypes.MULTIPLE_PAYMENT_GATEWAY_CREATE_SUCCESS,
        payload: res,
      })
      yield put({
        type: feeCollectionActionTypes.REDIRECT_TO_PAYMENTGATEWAY_SCREEN,
        payload: true,
      })
    } else {
      yield put(showErrorToast('API Verification Failed'))
      yield put({
        type: feeCollectionActionTypes.MULTIPLE_PAYMENT_GATEWAY_CREATE_FAILED,
        payload: 'API Verification Failed',
      })
    }
  } catch (e) {
    yield put({
      type: feeCollectionActionTypes.MULTIPLE_PAYMENT_GATEWAY_CREATE_FAILED,
      payload: e.message,
    })
    yield put(showErrorToast(e.message))
  }
}

export function* watchCreateMultiplePaymentGateway() {
  yield takeEvery(
    feeCollectionActionTypes.MULTIPLE_PAYMENT_GATEWAY_CREATE_REQUEST,
    createMultiplePaymentGateway
  )
}

function* udpateSettings(data) {
  try {
    // const formData = data
    const res = yield call(Api.updateFeeSetting, data)
    if (res) {
      // yield put(showSuccessToast('Setting Updated SuccessFully'))
      yield put({
        type: feeStructureActionTypes.FETCH_FEE_SETTING_REQUEST,
      })
      yield put({
        type: feeCollectionActionTypes.FETCH_FEE_SETTINGS_SUCCEEDED,
        payload: res.status,
      })
    } else {
      // yield put(showErrorToast('Setting Not Updated'))
      yield put({
        type: feeCollectionActionTypes.FETCH_FEE_SETTINGS_FAIL,
        payload: 'Setting Not Updated',
      })
    }
  } catch (e) {
    yield put({
      type: feeCollectionActionTypes.FETCH_FEE_SETTINGS_FAIL,
      payload: e.message,
    })
    yield put(showErrorToast(e.message))
  }
}

export function* watchFeeSettingUpdate() {
  yield takeEvery(
    feeCollectionActionTypes.FETCH_FEE_SETTINGS_UPDATE,
    udpateSettings
  )
}

function* fetchStudentIdsForFeeReminder() {
  yield put(
    setStudentIdsForFeeReminder({
      studentIds: [],
      showLoader: true,
      errorMsg: '',
    })
  )
  try {
    const res = yield call(Api.fetchStudentIdsForFeeReminder)
    yield put(
      setStudentIdsForFeeReminder({
        studentIds: res,
        showLoader: false,
        errorMsg: '',
      })
    )
  } catch (e) {
    yield put(
      setStudentIdsForFeeReminder({
        studentIds: [],
        showLoader: false,
        errorMsg: {GENERIC_ERROR_MESSAGE},
      })
    )
    yield put(showErrorToast(e.message))
  }
}

export function* watchFetchStudentIdsForFeeReminder() {
  yield takeEvery(
    feeCollectionActionTypes.FETCH_STUDENT_IDS_FOR_FEE_REMINDER_REQUESTED,
    fetchStudentIdsForFeeReminder
  )
}

function* feeTransactionReceiptDownloadAndPrint(action) {
  yield put({
    type: feeCollectionActionTypes.SET_RECORD_PAYMENT_DETAILS,
    payload: {buttonLoader: true},
  })
  try {
    const {studentId, receiptNo, actionMethod, receiptObj} = action.payload
    let receiptUrl = ''
    if (receiptObj && !receiptObj?.receiptUrl) {
      const res = yield call(Api.downloadCombineReciepts, {
        student_id: studentId,
        receipt_list: receiptNo,
      })
      receiptUrl = res.receipt_url
    } else {
      receiptUrl = receiptObj.receiptUrl
    }

    if (actionMethod === RECEIPT_METHOD.download) {
      fetch(receiptUrl)
        .then((r) => r.blob())
        .then((blobData) => {
          const link = document.createElement('a')
          link.href = URL.createObjectURL(blobData)
          link.download = receiptUrl.substr(receiptUrl.lastIndexOf('/') + 1)
          link.click()
        })
    } else {
      pdfPrint(receiptUrl, () => {
        // eventManager.send_event(events.PRINT_CERTIFICATE_CLICKED_TFI, {
        //   certificate_type: certificateTypeMap[selectedType],
        // })
      })
    }
    yield put({
      type: feeCollectionActionTypes.SET_RECORD_PAYMENT_DETAILS,
      payload: {receiptUrl, buttonLoader: false},
    })
  } catch (e) {
    yield put({
      type: feeCollectionActionTypes.SET_RECORD_PAYMENT_DETAILS,
      payload: {buttonLoader: false},
    })
    yield put(showErrorToast(e.msg))
  }
}

export function* watchFeeTransactionReceiptDownloadAndPrint() {
  yield takeEvery(
    feeCollectionActionTypes.FEE_RECEIPT_DOWNLOAD_AND_PRINT_REQUEST,
    feeTransactionReceiptDownloadAndPrint
  )
}

function* collectBackdatedPayment(action) {
  yield put({
    type: feeCollectionActionTypes.SET_COLLECT_BACKDATED_PAYMENT_STATES,
    payload: {buttonLoader: true, error: ''},
  })
  try {
    const {csvRowsData} = action.payload
    const res = yield call(Api.collectBackdatedPayment, csvRowsData)

    if (res.status) {
      yield put({
        type: feeCollectionActionTypes.SET_COLLECT_BACKDATED_PAYMENT_STATES,
        payload: {
          proccessTaskId: res?.obj?._id,
        },
      })
      yield put({
        type: feeCollectionActionTypes.SET_COLLECT_BACKDATED_PAYMENT_STATES,
        payload: {buttonLoader: false},
      })
    } else {
      yield put({
        type: feeCollectionActionTypes.SET_COLLECT_BACKDATED_PAYMENT_STATES,
        payload: {buttonLoader: false},
      })
      yield put(
        showErrorToast(res?.msg || somethingWentWrongPleaseCheckYourNetwork)
      )
    }
    action?.payload?.metaData?.setIsCsvAdded(false)
  } catch (e) {
    action?.payload?.metaData?.setIsCsvAdded(false)
    yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
    yield put({
      type: feeCollectionActionTypes.SET_COLLECT_BACKDATED_PAYMENT_STATES,
      payload: {buttonLoader: false},
    })
  }
}

export function* watchCollectBackdatedPayment() {
  yield takeEvery(
    feeCollectionActionTypes.COLLECT_BACKDATED_PAYMENT_REQUEST,
    collectBackdatedPayment
  )
}

function* collectBackdatedPaymentTaskRequest(action) {
  try {
    const {proccessTaskId, eventManager, clearIntervalForCsvProgressStatus} =
      action.payload
    const res = yield call(
      Api.collectBackdatedPaymentTaskRequest,
      proccessTaskId
    )

    if (res.status) {
      const {status, result} = res?.obj
      let file_type = null

      if (status === CSV_PROCESS_STATUS.COMPLETED) {
        clearInterval(clearIntervalForCsvProgressStatus)
        let successData = result?.data.filter((item) => {
          if (typeof item.amount === 'number') {
            file_type = 'lumpsum'
            return (
              item.status === FILE_UPLOAD_ERROR_STATS_IDS.OK &&
              item.amount !== 0
            )
          } else if (typeof item.amount === 'object') {
            file_type = 'installment'
            return (
              item.status === FILE_UPLOAD_ERROR_STATS_IDS.OK &&
              Object.values(item.amount).some((value) => value !== 0)
            )
          } else {
            return false
          }
        })

        let failedData = result?.data.filter(
          (item) =>
            item.status !== FILE_UPLOAD_ERROR_STATS_IDS.OK || item.status === ''
        )

        if (successData.length > 0) {
          let totalFeeCollected = successData?.reduce(
            (sum, e) => sum + (e === '' ? 0 : +e?.amount),
            0
          )

          eventManager.send_event(events.FEE_BACKDATED_UPLOADED_TFI, {
            back_dated_amount: totalFeeCollected,
            file_type: file_type,
          })
        }

        if (failedData.length > 0) {
          let invalidDataStats = createInvalidBackdatedStats(failedData)

          yield put({
            type: feeCollectionActionTypes.SET_COLLECT_BACKDATED_PAYMENT_STATES,
            payload: {
              buttonLoader: false,
              successfullyUpdated: false,
              invalidDataStats,
              invalidData: failedData,
              proccessTaskId: null,
              successUpdateCount: successData.length,
              collectionModeOnResponse: result?.collection_mode,
            },
          })
        } else if (failedData.length === 0) {
          yield put({
            type: feeCollectionActionTypes.SET_COLLECT_BACKDATED_PAYMENT_STATES,
            payload: {
              buttonLoader: false,
              successfullyUpdated: true,
              invalidDataStats: null,
              invalidData: null,
              proccessTaskId: null,
              successUpdateCount: successData.length,
              collectionModeOnResponse: null,
            },
          })
        }

        yield put(
          feeCollectBackDatedPaymentTaskAcknowledgeRequest({
            _id: proccessTaskId,
            acknowledge: true,
          })
        )
      } else if (status === CSV_PROCESS_STATUS.FAILED) {
        clearInterval(clearIntervalForCsvProgressStatus)
      }
    } else {
      yield put({
        type: feeCollectionActionTypes.SET_COLLECT_BACKDATED_PAYMENT_STATES,
        payload: {buttonLoader: false},
      })
      yield put(
        showErrorToast(res?.msg || somethingWentWrongPleaseCheckYourNetwork)
      )
    }
  } catch (e) {
    yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
    yield put({
      type: feeCollectionActionTypes.SET_COLLECT_BACKDATED_PAYMENT_STATES,
      payload: {buttonLoader: false},
    })
  }
}

export function* watchCollectBackdatedPaymentTaskRequest() {
  yield takeEvery(
    feeCollectionActionTypes.COLLECT_BACK_DATED_PAYMENT_TASK_REQUEST,
    collectBackdatedPaymentTaskRequest
  )
}

function* collectBackdatedPaymentTaskAcknowledge(action) {
  try {
    const res = yield call(
      Api.collectBackdatedPaymentTaskAcknowledge,
      action.payload
    )

    if (!res.status) {
      yield put({
        type: feeCollectionActionTypes.SET_COLLECT_BACKDATED_PAYMENT_STATES,
        payload: {
          buttonLoader: false,
          successfullyUpdated: false,
          successUpdateCount: 0,
        },
      })
      yield put(
        showErrorToast(res?.msg || somethingWentWrongPleaseCheckYourNetwork)
      )
    } else {
      yield put({
        type: feeCollectionActionTypes.SET_COLLECT_BACKDATED_PAYMENT_STATES,
        payload: {buttonLoader: false},
      })
    }
  } catch (e) {
    yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
    yield put({
      type: feeCollectionActionTypes.SET_COLLECT_BACKDATED_PAYMENT_STATES,
      payload: {buttonLoader: false},
    })
  }
}

export function* watchCollectBackdatedPaymentTaskAcknowledge() {
  yield takeEvery(
    feeCollectionActionTypes.COLLECT_BACK_DATED_PAYMENT_TASK_ACKNOWLEDGE_REQUEST,
    collectBackdatedPaymentTaskAcknowledge
  )
}

export const feeModuleCollectBackDatedPaymentWatchers = [
  watchCollectBackdatedPaymentTaskRequest(),
  watchCollectBackdatedPaymentTaskAcknowledge(),
]
