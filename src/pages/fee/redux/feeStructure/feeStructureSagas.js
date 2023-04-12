import {DateTime} from 'luxon'
import {call, put, takeEvery, takeLatest} from 'redux-saga/effects'
import {
  showErrorToast,
  showSuccessToast,
} from '../../../../redux/actions/commonAction'
import {utilsGetTransportPickup} from '../../../../routes/transport'
import * as Api from '../apis/feeStructureApis'
import {events} from '../../../../utils/EventsConstants'
import {createAndDownloadCSV, JSObjectToCSV} from '../../../../utils/Helpers'
import {FEES, FEE_STRUCTURE} from '../../intl'
import feeCollectionActionTypes from '../feeCollectionActionTypes'
import {
  fetchFeeStructuresRequestedAction,
  fetchPreviousSessionDuesAction,
} from './feeStructureActions'
import feeStructureActionTypes from './feeStructureActionTypes'
import {Trans} from 'react-i18next'
import {
  ERROR_MESSAGES,
  FEE_STRUCTURE_TYPES_IDS,
  SliderScreens,
  TRANSPORT_METHODS,
} from '../../fees.constants'
import {t} from 'i18next'
import {
  eventReasonFromErrorCode,
  updateDeleteFeeStructureErrorCodeAndMsg,
} from '../../helpers/helpers'

const previousSessionDuesCreated = (
  <Trans i18nKey={'previousSessionDuesCreatedMessage'}>
    Previous session dues created successfully
  </Trans>
)

const previousSessionDuesUpdated = (
  <Trans i18nKey={'previousSessionDuesUpdatedMessage'}>
    Previous session dues updated successfully
  </Trans>
)

const previousSessionDuesModified = (
  <Trans i18nKey={'previousSessionDuesModifiedMessage'}>
    Previous session dues modified successfully
  </Trans>
)

const previousSessionDuesStudentDeleted = (
  <Trans i18nKey={'deleteStudentPreviousSessionDuesMessage'}>
    Student deleted successfully
  </Trans>
)

const somethingWentWrongMsg = t('somethingWentWrong')

function* fetchFeeStructures() {
  try {
    const response = yield call(Api.fetchFeeStructureData)
    if (response.status) {
      yield put({
        type: feeStructureActionTypes.FETCH_FEE_STRUCTURES_SUCCEEDED,
        payload: response.obj,
      })
    } else {
      yield put(showErrorToast(response.msg))
    }
  } catch (e) {
    yield put({
      type: feeStructureActionTypes.FETCH_FEE_STRUCTURES_FAILED,
    })
    yield put(showErrorToast(e.msg))
  }
}

export function* watchFetchFeeStructures() {
  yield takeEvery(
    feeStructureActionTypes.FETCH_FEE_STRUCTURES_REQUESTED,
    fetchFeeStructures
  )
}

function* fetchPreviousSessionDues() {
  try {
    const response = yield call(Api.fetchPreviousSessionDues)
    if (response.status) {
      yield put({
        type: feeStructureActionTypes.FETCH_PREVIOUS_SESSION_DUES_SUCCESS,
        payload: response.obj,
      })
    } else {
      yield put({
        type: feeStructureActionTypes.FETCH_PREVIOUS_SESSION_DUES_SUCCESS,
        payload: {},
      })
    }
  } catch (e) {
    yield put({
      type: feeStructureActionTypes.FETCH_FEE_STRUCTURES_FAILED,
    })
    yield put(showErrorToast(e.msg))
  }
}

export function* watchFetchPreviousSessionDues() {
  yield takeEvery(
    feeStructureActionTypes.FETCH_PREVIOUS_SESSION_DUES,
    fetchPreviousSessionDues
  )
}

function* createFeeStructure(action) {
  try {
    const response = yield call(Api.createFeeStructure, action.payload)
    if (response.status) {
      yield put(fetchFeeStructuresRequestedAction())
      yield put({
        type: feeCollectionActionTypes.SET_SLIDER_SCREEN,
        payload: null,
      })
      if (action.payload.fee_type === FEE_STRUCTURE_TYPES_IDS.TRANSPORT_FEE) {
        yield put({type: feeStructureActionTypes.FETCH_FEE_SETTING_REQUEST})
      }
      yield put(showSuccessToast(FEE_STRUCTURE.feeStructureCreated))
    } else {
      yield put(showErrorToast(response.msg))
    }
    yield put({
      type: feeStructureActionTypes.CREATE_FEE_STRUCTURE_SUCCEEDED,
    })
  } catch (e) {
    yield put({
      type: feeStructureActionTypes.CREATE_FEE_STRUCTURE_FAILED,
    })
    yield put(showErrorToast(e.msg))
  }
}

export function* watchCreateFeeStructure() {
  yield takeEvery(
    feeStructureActionTypes.CREATE_FEE_STRUCTURE_REQUESTED,
    createFeeStructure
  )
}

function* editFeeStructure(action) {
  try {
    const response = yield call(Api.getFeeStructure, action.payload)
    if (response.status) {
      yield put({
        type: feeCollectionActionTypes.SET_SLIDER_SCREEN,
        payload: {
          name: SliderScreens.STRUCTURE_SLIDER,
          data: {
            feeType: response.obj.fee_type,
            initialValues: response.obj,
          },
        },
      })
    } else {
      yield put(showErrorToast(response.msg))
    }
    yield put({
      type: feeStructureActionTypes.EDIT_FEE_STRUCTURE_SUCCEEDED,
    })
  } catch (e) {
    yield put({
      type: feeStructureActionTypes.EDIT_FEE_STRUCTURE_FAILED,
    })
    yield put(showErrorToast(e.msg))
  }
}

export function* watchEditFeeStructure() {
  yield takeEvery(
    feeStructureActionTypes.EDIT_FEE_STRUCTURE_REQUESTED,
    editFeeStructure
  )
}

function* updateFeeStructure(action) {
  const {formValues, onFailed, onEditDependancy, onSuccess} = action.payload
  try {
    const response = yield call(Api.updateFeeStructure, formValues)

    if (response.status) {
      if (response?.obj?.dependency) {
        yield put({
          type: feeStructureActionTypes.UPDATE_FEE_STRUCTURE_SUCCEEDED,
        })
        onEditDependancy({
          transactions: response?.obj?.transactions,
        })
      } else {
        onSuccess?.()
        yield put(fetchFeeStructuresRequestedAction())
        yield put({
          type: feeCollectionActionTypes.SET_SLIDER_SCREEN,
          payload: null,
        })
        if (action.payload.fee_type === FEE_STRUCTURE_TYPES_IDS.TRANSPORT_FEE) {
          yield put({type: feeStructureActionTypes.FETCH_FEE_SETTING_REQUEST})
        }
        yield put(showSuccessToast(FEE_STRUCTURE.feeStructureUpdated))
        yield put({
          type: feeStructureActionTypes.UPDATE_FEE_STRUCTURE_SUCCEEDED,
        })
      }
    } else {
      let msg = updateDeleteFeeStructureErrorCodeAndMsg(
        response?.error_code,
        'UPDATE'
      )
      onFailed({
        text: msg || response?.msg || somethingWentWrongMsg,
        eventReason: eventReasonFromErrorCode(response?.error_code),
      })
      yield put({
        type: feeStructureActionTypes.UPDATE_FEE_STRUCTURE_SUCCEEDED,
      })
    }
  } catch (e) {
    yield put({
      type: feeStructureActionTypes.UPDATE_FEE_STRUCTURE_FAILED,
    })
    yield put(showErrorToast(e.msg))
  }
}

export function* watchUpdateFeeStructure() {
  yield takeEvery(
    feeStructureActionTypes.UPDATE_FEE_STRUCTURE_REQUESTED,
    updateFeeStructure
  )
}

function* deleteFeeStructure(action) {
  try {
    const {
      _id,
      onDeleteSuccess,
      onDeleteFailed,
      onDeleteDependancy,
      isPreviousSessionDue = false,
    } = action.payload
    const response = yield call(Api.deleteFeeStructure, _id)
    if (response.status) {
      if (response?.obj?.dependency) {
        onDeleteDependancy({
          transactions: response?.obj?.transactions,
        })
      } else {
        onDeleteSuccess()
        yield put(fetchFeeStructuresRequestedAction())
        yield put(fetchPreviousSessionDuesAction())
        if (isPreviousSessionDue) {
          yield put(showSuccessToast(FEE_STRUCTURE.previousSessionDuesDeleted))
        } else {
          yield put(showSuccessToast(FEE_STRUCTURE.feeStructureDeleted))
        }
      }
    } else {
      let msg = updateDeleteFeeStructureErrorCodeAndMsg(
        response?.error_code,
        'DELETE'
      )
      onDeleteFailed({
        isOpen: true,
        text: msg || response?.msg || somethingWentWrongMsg,
        eventReason: eventReasonFromErrorCode(response?.error_code),
      })
    }
    yield put({
      type: feeStructureActionTypes.DELETE_FEE_STRUCTURE_SUCCEEDED,
    })
  } catch (e) {
    yield put({
      type: feeStructureActionTypes.DELETE_FEE_STRUCTURE_FAILED,
    })
    yield put(showErrorToast(e.msg))
  }
}

export function* watchDeleteFeeStructure() {
  yield takeEvery(
    feeStructureActionTypes.DELETE_FEE_STRUCTURE_REQUESTED,
    deleteFeeStructure
  )
}

function* fetchFeeCategories() {
  try {
    const response = yield call(Api.fetchFeeCategories)
    if (response.status) {
      yield put({
        type: feeStructureActionTypes.FETCH_FEE_CATEGORIES_SUCCEEDED,
        payload: response.obj,
      })
    } else {
      yield put(showErrorToast(response.msg))
    }
  } catch (e) {
    yield put({
      type: feeStructureActionTypes.FETCH_FEE_CATEGORIES_FAILED,
    })
    yield put(showErrorToast(e.message))
  }
}

export function* watchFetchFeeCategories() {
  yield takeEvery(
    feeStructureActionTypes.FETCH_FEE_CATEGORIES_REQUESTED,
    fetchFeeCategories
  )
}

function* fetchUsedFeeCategories(action) {
  const {session} = action.payload
  try {
    const response = yield call(Api.fetchUsedFeeCategories, session)
    if (response.status) {
      yield put({
        type: feeStructureActionTypes.FETCH_USED_FEE_CATEGORIES_SUCCEEDED,
        payload: response.obj,
      })
    } else {
      yield put(showErrorToast(response.msg))
    }
  } catch (e) {
    yield put({
      type: feeStructureActionTypes.FETCH_USED_FEE_CATEGORIES_FAILED,
    })
    yield put(showErrorToast(e.message))
  }
}

export function* watchFetchUsedFeeCategories() {
  yield takeEvery(
    feeStructureActionTypes.FETCH_USED_FEE_CATEGORIES_REQUESTED,
    fetchUsedFeeCategories
  )
}

function* checkReceiptPrefixExists(action) {
  try {
    const {prefix, formValues, setFormValues, setIsReceiptNoDisabled} =
      action.payload
    const response = yield call(Api.checkReceiptPrefix, prefix)
    setIsReceiptNoDisabled(response.obj.duplicate_found)
    if (response.obj.duplicate_found) {
      setFormValues({
        ...formValues,
        ...{
          series_starting_number: response.obj.series_starting_number ?? '',
          receipt_prefix: prefix,
        },
      })
    } else {
      setFormValues({
        ...formValues,
        ...{series_starting_number: '0', receipt_prefix: prefix},
      })
    }
    yield put({
      type: feeStructureActionTypes.RECEIPT_PREFIX_EXISTS_SUCCEEDED,
    })
  } catch (e) {
    yield put({
      type: feeStructureActionTypes.RECEIPT_PREFIX_EXISTS_FAILED,
    })
    yield put(showErrorToast(e.msg))
  }
}

export function* watchCheckReceiptPrefixExists() {
  yield takeEvery(
    feeStructureActionTypes.RECEIPT_PREFIX_EXISTS_REQUESTED,
    checkReceiptPrefixExists
  )
}

function* previousSessionDues(action) {
  try {
    const response = yield call(Api.createFeeStructure, action.payload)
    if (response.status) {
      yield put(fetchPreviousSessionDuesAction())
      action.payload._id !== null
        ? yield put(showSuccessToast(previousSessionDuesUpdated))
        : yield put(showSuccessToast(previousSessionDuesCreated))
      action.updateResponse(response.obj)
      action.onSuccess()
    } else {
      yield put(showErrorToast(response.msg))
    }
    yield put({
      type: feeStructureActionTypes.PREVIOUS_YEAR_DUES_SUCCEEDED,
    })
  } catch (e) {
    yield put({
      type: feeStructureActionTypes.PREVIOUS_YEAR_DUES_FAILED,
    })
    yield put(showErrorToast(e.msg))
  }
}

export function* watchPreviousSessionDues() {
  yield takeEvery(
    feeStructureActionTypes.PREVIOUS_YEAR_DUES_REQUESTED,
    previousSessionDues
  )
}

function* modifyPreviousSessionDues(action) {
  try {
    const response = yield call(Api.modifyPreviousSessionDues, action.payload)
    if (response.status) {
      yield put(fetchPreviousSessionDuesAction())
      yield put(showSuccessToast(previousSessionDuesModified))
      yield put({
        type: feeCollectionActionTypes.SET_SLIDER_SCREEN,
        payload: null,
      })
    } else {
      yield put(showErrorToast(response.msg))
    }
    yield put({
      type: feeStructureActionTypes.MODIFY_PREVIOUS_YEAR_DUES_SUCCEEDED,
    })
  } catch (e) {
    yield put({
      type: feeStructureActionTypes.MODIFY_PREVIOUS_YEAR_DUES_FAILED,
    })
    yield put(showErrorToast(e.msg))
  }
}

export function* watchModifyPreviousSessionDues() {
  yield takeEvery(
    feeStructureActionTypes.MODIFY_PREVIOUS_YEAR_DUES_REQUESTED,
    modifyPreviousSessionDues
  )
}

function* modifyFeeInstallment(action) {
  try {
    const response = yield call(Api.modifyFeeInstallment, action.payload)
    yield put({
      type: feeStructureActionTypes.MODIFY_FEE_INSTALLMENT_SUCCEEDED,
      payload: response,
    })
    if (response.status) {
      yield put(fetchFeeStructuresRequestedAction())
      yield put(showSuccessToast(FEE_STRUCTURE.feeInstallmentModified))
      yield put({
        type: feeCollectionActionTypes.SET_SLIDER_SCREEN,
        payload: null,
      })
    } else {
      yield put(showErrorToast(response.msg))
    }
  } catch (e) {
    yield put({
      type: feeStructureActionTypes.MODIFY_FEE_INSTALLMENT_FAILED,
    })
    yield put(showErrorToast(e.msg))
  }
}

export function* watchModifyFeeInstallment() {
  yield takeEvery(
    feeStructureActionTypes.MODIFY_FEE_INSTALLMENT_REQUESTED,
    modifyFeeInstallment
  )
}

function* addNewCustomCategory(action) {
  const {data, handleSetValueAndResetCustomCategoryStates} = action.payload

  try {
    const response = yield call(Api.newCustomCategoryCreate, data)
    if (response.status) {
      yield put({
        type: feeStructureActionTypes.FETCH_FEE_CATEGORIES_REQUESTED,
        payload: null,
      })
      handleSetValueAndResetCustomCategoryStates(response.obj._id)
      yield put({
        type: feeStructureActionTypes.SET_CUSTOM_CATEGORY_STATE,
        payload: {
          showAddCustomCategoryPopup: false,
          indexOfcustomCategorySelect: null,
          customCategoryName: '',
        },
      })
    } else {
      yield put(showErrorToast(ERROR_MESSAGES.customCategory.notCreated))
    }
  } catch (e) {
    if (e?.msg) {
      yield put(showErrorToast(e.msg))
    } else if (e?.message) {
      yield put(showErrorToast(e.message))
    } else {
      yield put(showErrorToast('Something went wrong'))
    }
  }
}

export function* watchAddNewCustomCategory() {
  yield takeEvery(
    feeStructureActionTypes.ADD_NEW_CUSTOM_CATEGORY_REQUEST,
    addNewCustomCategory
  )
}

function* fetchFeeSetting() {
  try {
    const response = yield call(Api.fetchFeeSettings)

    if (response.status) {
      let transportSettings =
        response.obj.miscellaneous_settings.transport_structure.settings
      if (
        !transportSettings.transport_structure_exists.status ||
        (transportSettings.transport_structure_exists.status &&
          transportSettings.transport_structure_type.value ===
            TRANSPORT_METHODS.WAYPOINT)
      ) {
        yield put({
          type: feeStructureActionTypes.FETCH_TRANSPORT_PICKUP_POINTS_REQUEST,
        })
      }

      yield put({
        type: feeStructureActionTypes.FETCH_FEE_SETTING_SUCCEEDED,
        payload: response.obj,
      })
    } else {
      yield put(showErrorToast(response.msg))
    }
  } catch (e) {
    yield put({
      type: feeStructureActionTypes.FETCH_FEE_SETTING_FAILED,
    })
    yield put(showErrorToast(e.msg))
  }
}

export function* watchFetchFeeSetting() {
  yield takeEvery(
    feeStructureActionTypes.FETCH_FEE_SETTING_REQUEST,
    fetchFeeSetting
  )
}

function* fetchTransportPickup() {
  try {
    const response = yield call(utilsGetTransportPickup)

    if (response.status) {
      if (response.obj.length) {
        response.obj = response.obj
          .filter((waypoint) => waypoint.name !== null || waypoint._id !== null)
          .sort(function (a, b) {
            var nameA = a.name?.toLowerCase(),
              nameB = b.name?.toLowerCase()
            if (nameA < nameB)
              //sort string ascending
              return -1
            if (nameA > nameB) return 1
            return 0 //default return value (no sorting)
          })
      }

      yield put({
        type: feeStructureActionTypes.FETCH_TRANSPORT_PICKUP_POINTS_SUCCEEDED,
        payload: response.obj,
      })
    } else {
      yield put(showErrorToast(response.msg))
    }
  } catch (e) {
    yield put({
      type: feeStructureActionTypes.FETCH_TRANSPORT_PICKUP_POINTS_ERROR,
    })
    yield put(showErrorToast(e.msg))
  }
}

export function* watchFetchTransportPickupForFeeStructure() {
  yield takeEvery(
    feeStructureActionTypes.FETCH_TRANSPORT_PICKUP_POINTS_REQUEST,
    fetchTransportPickup
  )
}

function downloadStructureReport(data, metaData) {
  let classData = []
  Object.keys(data).forEach((className) => {
    let feeTypes = {}
    let allTypes = Object.keys(data[className])
    let allTimestamps = Object.values(data[className])
    classData.push({className: 'Class ' + className})
    allTypes.forEach((type) => {
      feeTypes[type] = type
    })
    classData.push({
      feesDueDates: 'Fees Due Dates',
      ...feeTypes,
    })
    if (allTimestamps.length > 0) {
      let timestamps = Object.keys(allTimestamps[0])
      timestamps.forEach((timestamp) => {
        let amounts = {}
        amounts[0] = DateTime.fromSeconds(parseInt(timestamp)).toFormat(
          'dd-LL-yyyy'
        )
        allTypes.forEach((category, i) => {
          amounts[i + 1] = data[className][category][timestamp].toFixed(2)
        })
        classData.push({...amounts})
      })
    }
    classData.push({})
  })
  const rows = [
    {
      academicSession: 'Fee Structure for Academic Session',
      value: metaData.sessionRange.name,
    },
    {},
    ...classData,
  ]
  createAndDownloadCSV(
    'Fee-Structure-' + DateTime.now().toFormat('dd-LL-yyyy'),
    JSObjectToCSV([metaData.instituteInfo.name], rows)
  )
  metaData.eventManager.send_event(events.DOWNLOAD_REPORT_CLICKED_TFI, {
    screenName: 'fee_structure',
  })
}

function* downloadReport(action) {
  const metaData = {...action.payload}
  try {
    const response = yield call(Api.downloadFeeStructureReport)
    if (response.status) {
      yield put({
        type: feeStructureActionTypes.DOWNLOAD_FEE_STRUCTURE_SUCCEEDED,
      })
      downloadStructureReport(response.obj, metaData)
      yield put(showSuccessToast(FEES.CSV_REPORT_EXPORTED_MESSAGE))
    } else {
      yield put({
        type: feeStructureActionTypes.DOWNLOAD_FEE_STRUCTURE_FAILED,
      })
      yield put(showErrorToast(response.msg))
    }
  } catch (e) {
    yield put({
      type: feeStructureActionTypes.DOWNLOAD_FEE_STRUCTURE_FAILED,
    })
    yield put(showErrorToast(e.msg))
  }
}

export function* watchFeeStructureDownloadReport() {
  yield takeEvery(
    feeStructureActionTypes.DOWNLOAD_FEE_STRUCTURE_REQUESTED,
    downloadReport
  )
}

function* getFeeWebinarStatus() {
  try {
    // const formData = data
    const res = yield call(Api.getFeeWebinarStatus)
    if (res) {
      yield put({
        type: feeStructureActionTypes.FETCH_FEE_WEBINAR_STATUS_SUCCESS,
        payload: {
          isSuccess: true,
          status: res.webinar_status,
        },
      })
    } else {
      yield put({
        type: feeStructureActionTypes.FETCH_FEE_WEBINAR_STATUS_FAIL,
        payload: res.message,
      })
      // yield put(showErrorToast(res.message))
    }
  } catch (e) {
    yield put({
      type: feeStructureActionTypes.FETCH_FEE_WEBINAR_STATUS_FAIL,
      payload: e.message,
    })
    // yield put(showErrorToast(e.message))
  }
}

function* revokeFeeReceiptsTransactions(action) {
  const {data, onSuccess, onFailed} = action.payload
  try {
    const res = yield call(Api.revokeFeeReceiptsTransactions, data)
    if (res.status) {
      onSuccess()
    } else {
      onFailed(res?.message || res?.msg || 'something went wrong')
    }
  } catch (e) {
    onFailed(e.message)
  }
}

export function* watchGetFeeWebinarStatus() {
  yield takeEvery(
    feeStructureActionTypes.FETCH_FEE_WEBINAR_STATUS,
    getFeeWebinarStatus
  )

  yield takeLatest(
    feeStructureActionTypes.REVOKE_FEE_RECEIPTS_TRANSACTIONS_REQUEST,
    revokeFeeReceiptsTransactions
  )
}

function* importPreviousSessionDues(action) {
  try {
    const response = yield call(Api.importPreviousSessionDues, action.payload)
    if (response.status) {
      yield put(fetchPreviousSessionDuesAction())
      yield put(showSuccessToast(previousSessionDuesCreated))
      action.onSuccess()
    } else {
      yield put(showErrorToast(response.msg))
    }
    yield put({
      type: feeStructureActionTypes.PREVIOUS_YEAR_DUES_SUCCEEDED,
    })
  } catch (e) {
    yield put({
      type: feeStructureActionTypes.IMPORT_PREVIOUS_SESSION_DUES_FAILED,
    })
    yield put(showErrorToast(e.msg))
  }
}

export function* watchImportPreviousSessionDues() {
  yield takeEvery(
    feeStructureActionTypes.IMPORT_PREVIOUS_SESSION_DUES_REQUESTED,
    importPreviousSessionDues
  )
}

function* deleteStudentPreviousSessionDues(action) {
  try {
    const response = yield call(
      Api.deleteStudentPreviousSessionDues,
      action.payload
    )
    if (response.status) {
      yield put({
        type: feeStructureActionTypes.DELETE_STUDENT_PREVIOUS_SESSION_DUES_SUCCESS,
      })
      yield put(fetchPreviousSessionDuesAction())
      yield put(showSuccessToast(previousSessionDuesStudentDeleted))
      action.payload.onSuccess()
    } else {
      yield put(showErrorToast(response.msg))
    }
  } catch (e) {
    yield put(showErrorToast(e.msg))
  }
}

export function* watchDeleteStudentPreviousSessionDues() {
  yield takeEvery(
    feeStructureActionTypes.DELETE_STUDENT_PREVIOUS_SESSION_DUES,
    deleteStudentPreviousSessionDues
  )
}

function* fetchImportedSessionDueData(action) {
  try {
    const response = yield call(Api.fetchImportedSessionDueData, action.payload)
    if (response.status) {
      yield put({
        type: feeStructureActionTypes.FETCH_IMPORTED_SESSION_DUE_DATA_SUCCEEDED,
        payload: response.obj,
      })
    }
  } catch (e) {
    yield put(showErrorToast(e.msg))
  }
}

export function* watchFetchImportedSessionDueData() {
  yield takeEvery(
    feeStructureActionTypes.FETCH_IMPORTED_SESSION_DUE_DATA,
    fetchImportedSessionDueData
  )
}

function* fetchFailedSessionTransferTask(action) {
  try {
    const response = yield call(
      Api.fetchFailedSessionTransferTask,
      action.payload
    )
    if (response.status) {
      yield put({
        type: feeStructureActionTypes.FETCH_FAILED_SESSION_TRANSFER_TASK_SUCCEEDED,
        payload: response.obj,
      })
    }
  } catch (e) {
    yield put(showErrorToast(e.msg))
  }
}

export function* watchFetchFailedSessionTransferTask() {
  yield takeEvery(
    feeStructureActionTypes.FETCH_FAILED_SESSION_TRANSFER_TASK,
    fetchFailedSessionTransferTask
  )
}

function* acknowledgeFailedTask(action) {
  try {
    yield call(Api.acknowledgeFailedTask, action.payload)
    yield put({
      type: feeStructureActionTypes.FETCH_FAILED_SESSION_TRANSFER_TASK,
    })
  } catch (e) {
    yield put(showErrorToast(e.msg))
  }
}

export function* watchAcknowledgeFailedTask() {
  yield takeEvery(
    feeStructureActionTypes.ACKNOWLEDGE_FAILED_TASK,
    acknowledgeFailedTask
  )
}
