import {DateTime} from 'luxon'
import {Trans} from 'react-i18next'
import {call, put, takeEvery} from 'redux-saga/effects'
import {
  showErrorToast,
  showSuccessToast,
} from '../../../../redux/actions/commonAction'
import {createAndDownloadCSV, JSObjectToCSV} from '../../../../utils/Helpers'
import {
  generateFeeDuePaidClassWiseReport,
  generateFeeDuePaidDepartmentWiseReport,
  generateFeeDuePaidInstalmentWiseReport,
  generateFeeDuePaidSectionWiseReport,
  generateFeeDuePaidStudentWiseReport,
  generateMiscellaneousAllTransactionStatusReports,
  generateMiscellaneousChequeStatusReports,
  generateChequeDetailedReport,
} from '../../components/FeeReports/commonFunctions'
import {
  generateFeeCollectionClassWiseReport,
  generateFeeCollectionDayWiseReport,
  generateFeeCollectionDepartmentWiseReport,
  generateFeeCollectionFeeTypeWiseReport,
  generateFeeCollectionMonthWiseReport,
  generateFeeCollectionPaymentModeWiseReport,
  generateFeeCollectionSectionWiseReport,
} from '../../components/FeeReports/feeCollectionReportUtils'
import {FEE_REPORTS_TEMPLATES} from '../../fees.constants'
import {FEES} from '../../intl'
import * as Api from '../apis/feeReportsApis'
import {feeReportActionTypes} from './feeReportsActiontype'

const somethingWentWrongPleaseCheckYourNetwork = (
  <Trans i18nKey={'fetchPostsListErrorToast'}>
    Something went wrong, please check your network
  </Trans>
)

function* downloadAndSaveReport(action) {
  try {
    const {rows, metaData} = action.payload

    yield put({
      type: feeReportActionTypes.SET_FEE_REPORTS_LOADER,
      payload: true,
    })

    let reportName =
      metaData.reportName + ' - ' + DateTime.now().toFormat('dd-LL-yyyy')
    createAndDownloadCSV(
      reportName,
      JSObjectToCSV([metaData.instituteInfo.name], rows)
    )
    yield put(showSuccessToast(FEES.CSV_REPORT_EXPORTED_MESSAGE))
    metaData.trackEventClick(action.payload.report_type)

    // for next release
    // if (action.payload.is_saved) {
    // yield put({
    //   type: reportLogActionTypes.SAVE_REPORT_LOG,
    //   payload: {
    //     start_date: DateTime.fromJSDate(metaData.sessionStartDate).toFormat(
    //       'yyyy-MM-dd'
    //     ),
    //     end_date: DateTime.fromJSDate(metaData.sessionEndDate).toFormat(
    //       'yyyy-MM-dd'
    //     ),
    //     report_name:
    //       action.payload.report_name !== ''
    //         ? action.payload.report_name
    //         : '',
    //     report_type: 'FEE',
    //     meta_info: {
    //       fee_report_type: action.payload.report_type,
    //     },
    //   },
    // })

    // yield put({
    //   type: feeReportActionTypes.FETCH_SAVED_REPORTS,
    // })
    // }

    // useful when backend archtechture is ready
    // yield put({
    //   type: feeReportActionTypes.SET_IS_REPORT_DOWNLOAD_MODAL_OPEN,
    //   payload: true,
    // })

    // yield put({
    //   type: feeReportActionTypes.SET_DOWNLOAD_REPORT_DATA,
    //   payload: res.obj,
    // })
  } catch (error) {
    yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
  } finally {
    yield put({
      type: feeReportActionTypes.SET_FEE_REPORTS_LOADER,
      payload: false,
    })
  }
}

export function* watchDownloadAndSaveReport() {
  yield takeEvery(feeReportActionTypes.DOWNLOAD_REPORT, downloadAndSaveReport)
}

function* fetchReportData(action) {
  try {
    const {metaData} = action.payload
    delete action.payload.metaData

    if (metaData.reportAction !== 'download') {
      yield put({
        type: feeReportActionTypes.SET_FEE_REPORTS_LOADER,
        payload: true,
      })
    }

    const res = yield call(Api.downloadAndSaveReport, action.payload)

    if (res.status) {
      let rows = []
      switch (action.payload.report_type) {
        case FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_STUDENTWISE.value:
          rows = generateFeeDuePaidStudentWiseReport(res.obj, metaData, {
            payload: action.payload,
          })
          break
        case FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_CLASSWISE.value:
          rows = generateFeeDuePaidClassWiseReport(res.obj, metaData, {
            payload: action.payload,
          })
          break
        case FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_SECTIONWISE.value:
          rows = generateFeeDuePaidSectionWiseReport(res.obj, metaData, {
            payload: action.payload,
          })
          break
        case FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_DEPARTMENTWIS.value:
          rows = generateFeeDuePaidDepartmentWiseReport(res.obj, metaData, {
            payload: action.payload,
          })
          break
        case FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_INSTALLMENTWISE.value:
          rows = generateFeeDuePaidInstalmentWiseReport(res.obj, metaData, {
            payload: action.payload,
          })
          break
        case FEE_REPORTS_TEMPLATES.FEE_COLLECTION_MONTH.value:
          rows = generateFeeCollectionMonthWiseReport(res.obj, metaData, {
            payload: action.payload,
          })
          break
        case FEE_REPORTS_TEMPLATES.FEE_COLLECTION_DAILY.value:
          rows = generateFeeCollectionDayWiseReport(res.obj, metaData, {
            payload: action.payload,
          })
          break
        case FEE_REPORTS_TEMPLATES.FEE_COLLECTION_DEPARTMENTWISE.value:
          rows = generateFeeCollectionDepartmentWiseReport(res.obj, metaData, {
            payload: action.payload,
          })
          break
        case FEE_REPORTS_TEMPLATES.FEE_COLLECTION_CLASSWISE.value:
          rows = generateFeeCollectionClassWiseReport(res.obj, metaData, {
            payload: action.payload,
          })
          break
        case FEE_REPORTS_TEMPLATES.FEE_COLLECTION_FEETYPEWISE.value:
          rows = generateFeeCollectionFeeTypeWiseReport(res.obj, metaData, {
            payload: action.payload,
          })
          break
        case FEE_REPORTS_TEMPLATES.FEE_COLLECTION_PAYMENTMODEWISE.value:
          rows = generateFeeCollectionPaymentModeWiseReport(res.obj, metaData, {
            payload: action.payload,
          })
          break
        case FEE_REPORTS_TEMPLATES.FEE_COLLECTION_SECTIONWISE.value:
          rows = generateFeeCollectionSectionWiseReport(res.obj, metaData, {
            payload: action.payload,
          })
          break
        case FEE_REPORTS_TEMPLATES.FEE_MISC_CHEQUE_STATUS.value:
          rows = generateMiscellaneousChequeStatusReports(res.obj, metaData, {
            payload: action.payload,
          })
          break
        case FEE_REPORTS_TEMPLATES.FEE_MISC_ALL_TRANSACTIONS.value:
          rows = generateMiscellaneousAllTransactionStatusReports(
            res.obj,
            metaData,
            {
              payload: action.payload,
            }
          )
          break
        default:
          break
      }
      if (metaData.reportAction !== 'download') {
        yield put({
          type: feeReportActionTypes.SET_DOWNLOAD_REPORT_DATA,
          payload: {
            ...res.obj,
            data: rows,
          },
        })
      }
      if (metaData.reportAction) {
        // Remove amountAwaiting and totalAmount keys if Cheque/DD are excluded
        if (
          !action.payload.meta.is_pending_cheque &&
          action.payload.report_type !==
            FEE_REPORTS_TEMPLATES.FEE_COLLECTION_PAYMENTMODEWISE.value
        ) {
          var selectedFeeTypesCount = 0
          if (action?.payload?.meta.category_breakdown) {
            selectedFeeTypesCount =
              action?.payload?.meta?.category_master_ids.length
          }
          rows = rows.map((row) => {
            if ('amountAwaiting' in row) {
              delete row.amountAwaiting
              delete row.totalAmount
            }
            for (var i = 0; i < selectedFeeTypesCount; i++) {
              delete row[`column${i * 3 + 2}`]
              delete row[`column${i * 3 + 3}`]
            }
            return row
          })
        }

        let reportName =
          metaData.reportName + ' - ' + DateTime.now().toFormat('dd-LL-yyyy')
        createAndDownloadCSV(
          reportName,
          JSObjectToCSV([metaData.instituteInfo.name], rows)
        )
        yield put(showSuccessToast(FEES.CSV_REPORT_EXPORTED_MESSAGE))
        // metaData.trackEventClick(action.payload.report_type)
      }
    } else {
      yield put(showErrorToast(res?.msg))
    }
  } catch (error) {
    yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
  } finally {
    yield put({
      type: feeReportActionTypes.SET_FEE_REPORTS_LOADER,
      payload: false,
    })
  }
}

export function* watchFetchReportData() {
  yield takeEvery(feeReportActionTypes.FETCH_REPORT_DATA, fetchReportData)
}

function* fetchInstituteFeeTypes() {
  try {
    const res = yield call(Api.fetchInstituteFeeTypes)
    res.status = true
    if (res.status) {
      yield put({
        type: feeReportActionTypes.SET_INSTITUTE_FEE_TYPES,
        payload: res.obj,
      })
    } else {
      yield put(showErrorToast(res?.msg))
    }
  } catch (error) {
    yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
  }
}

export function* watchFetchInstituteFeeTypes() {
  yield takeEvery(
    feeReportActionTypes.FETCH_INSTITUTE_FEE_TYPES,
    fetchInstituteFeeTypes
  )
}

function* fetchInstalmentDateTimestamp() {
  try {
    const res = yield call(Api.fetchInstalmentDateTimestamp)

    res.status = true
    if (res.status) {
      yield put({
        type: feeReportActionTypes.SET_INSTALMENT_TIMESTAMP_LIST,
        payload: res.obj,
      })
    } else {
      yield put(showErrorToast(res?.msg))
    }
  } catch (error) {
    yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
  }
}

export function* watchFetchInstalmentDateTimestamp() {
  yield takeEvery(
    feeReportActionTypes.FETCH_INSTALMENT_TIMESTAMP,
    fetchInstalmentDateTimestamp
  )
}

function* fetchSavedReports() {
  try {
    const res = yield call(Api.fetchSavedReports)

    res.status = true
    if (res.status) {
      yield put({
        type: feeReportActionTypes.SET_SAVED_REPORTS_LIST,
        payload: res.obj,
      })
    } else {
      yield put(showErrorToast(res?.msg))
    }
  } catch (error) {
    yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
  }
}

export function* watchFetchavedReports() {
  yield takeEvery(feeReportActionTypes.FETCH_SAVED_REPORTS, fetchSavedReports)
}

function* fetchInstituteFeeData(action) {
  try {
    const res = yield call(Api.fetchFeeData, action.payload)
    res.status = true
    if (res.status) {
      yield put({
        type: feeReportActionTypes.SET_FEE_DATA,
        payload: res.obj,
      })
    } else {
      yield put(showErrorToast(res?.msg))
    }
  } catch (error) {
    yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
  }
}

export function* watchFetchInstituteFeeData() {
  yield takeEvery(feeReportActionTypes.FETCH_FEE_DATA, fetchInstituteFeeData)
}

function* fetchInstituteFeeDataStart(action) {
  try {
    const res = yield call(Api.fetchFeeData, action.payload)
    res.status = true
    if (res.status) {
      yield put({
        type: feeReportActionTypes.SET_FEE_DATA_START,
        payload: res.obj,
      })
    } else {
      yield put(showErrorToast(res?.msg))
    }
  } catch (error) {
    yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
  }
}

export function* watchFetchInstituteFeeDataStart() {
  yield takeEvery(
    feeReportActionTypes.FETCH_FEE_DATA_START,
    fetchInstituteFeeDataStart
  )
}

function* fetchInstituteFeeDataDefaulters(action) {
  try {
    const res = yield call(Api.fetchFeeData, action.payload)
    res.status = true
    if (res.status) {
      yield put({
        type: feeReportActionTypes.SET_FEE_DATA_DEFAULTERS,
        payload: res.obj,
      })
    } else {
      yield put(showErrorToast(res?.msg))
    }
  } catch (error) {
    yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
  }
}

export function* watchFetchInstituteFeeDataDefaulters() {
  yield takeEvery(
    feeReportActionTypes.FETCH_FEE_DATA_DEFAULTERS,
    fetchInstituteFeeDataDefaulters
  )
}

function* fetchInstituteTimeStampFeeData(action) {
  try {
    const res = yield call(Api.fetchTimeStampData, action.payload)
    res.status = true
    if (res.status) {
      yield put({
        type: feeReportActionTypes.FETCH_TIMESTAMP_DATA,
        payload: res.obj,
      })
    } else {
      yield put(showErrorToast(res?.msg))
    }
  } catch (error) {
    // yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
  }
}

export function* watchFetchInstituteTimeStampFeeData() {
  yield takeEvery(
    feeReportActionTypes.FETCH_TIMESTAMP_DATA,
    fetchInstituteTimeStampFeeData
  )
}

function* fetchChequeCountData(action) {
  // try {
  const metaData = action.payload
  const res = yield call(Api.fetchChequeCount)
  res.status = true
  if (res.status) {
    if (metaData.actionType === 'Download Report') {
      let rows = generateChequeDetailedReport(res.obj, metaData)
      let reportName =
        metaData.reportName + ' - ' + DateTime.now().toFormat('dd-LL-yyyy')
      createAndDownloadCSV(
        reportName,
        JSObjectToCSV([metaData.instituteInfo.name], rows)
      )
      yield put(showSuccessToast(FEES.CSV_REPORT_EXPORTED_MESSAGE))
    } else {
      yield put({
        type: feeReportActionTypes.SET_CHEQUE_COUNT,
        payload: res.obj,
      })
    }
  } else {
    yield put(showErrorToast(res?.msg))
  }
  // } catch (error) {
  //   // yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
  // }
}

export function* watchFetchChequeCountData() {
  yield takeEvery(feeReportActionTypes.FETCH_CHEQUE_COUNT, fetchChequeCountData)
}
