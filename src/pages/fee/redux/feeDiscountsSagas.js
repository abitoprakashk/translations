import {DateTime} from 'luxon'
import {call, put, takeEvery} from 'redux-saga/effects'
import {
  showErrorToast,
  showSuccessToast,
} from '../../../redux/actions/commonAction'
import {events} from '../../../utils/EventsConstants'
import {
  createAndDownloadCSV,
  roundWithPrecision,
  JSObjectToCSV,
} from '../../../utils/Helpers'
import * as Api from '../apis/fees.apis'
import * as adHocDiscountApi from './apis/adHocDiscountApis'
import {IS_ABSOLUTE_VALUE, SliderScreens} from '../fees.constants'
import {DISCOUNT, FEES} from '../intl'
import feeCollectionActionTypes from './feeCollectionActionTypes'
import feeDiscountsActionTypes from './feeDiscountsActionTypes'
import {
  fetchAdHocDiscountRequestAction,
  setDiscountStatesAction,
} from './feeDiscountsActions'
import feeTransactionActionTypes from './feeTransactionActionTypes'

const unusedProperties = [
  'c',
  'u',
  'deleted',
  'session_id',
  'fee_categories',
  'students_count',
]

function* fetchDiscounts() {
  try {
    const res = yield call(Api.fetchDiscounts)
    if (res.status) {
      yield put({
        type: feeDiscountsActionTypes.FETCH_DISCOUNTS_SUCCEEDED,
        payload: res.obj,
      })
    } else {
      yield put({
        type: feeDiscountsActionTypes.FETCH_DISCOUNTS_FAILED,
      })
      yield put(showErrorToast(res.msg))
    }
  } catch (e) {
    yield put({
      type: feeDiscountsActionTypes.FETCH_DISCOUNTS_FAILED,
    })
    yield put(showErrorToast(e.msg))
  }
}

export function* watchFetchDiscounts() {
  yield takeEvery(
    feeDiscountsActionTypes.FETCH_DISCOUNTS_REQUESTED,
    fetchDiscounts
  )
}

function* fetchDiscountStudentsList(action) {
  try {
    const res = yield call(Api.fetchDiscountStudentsList, action.payload)
    if (res.status) {
      yield put({
        type: feeDiscountsActionTypes.GET_STUDENT_LIST_SUCCEEDED,
        payload: res.obj,
      })
    } else {
      yield put({
        type: feeDiscountsActionTypes.GET_STUDENT_LIST_FAILED,
      })
      yield put(showErrorToast(res.msg))
    }
  } catch (e) {
    yield put({
      type: feeDiscountsActionTypes.GET_STUDENT_LIST_FAILED,
    })
    yield put(showErrorToast(e.msg))
  }
}

export function* watchFetchDiscountStudentsList() {
  yield takeEvery(
    feeDiscountsActionTypes.GET_STUDENT_LIST_REQUESTED,
    fetchDiscountStudentsList
  )
}

function* createDiscount(action) {
  try {
    let formValues = {...action.payload}
    formValues.is_absolute_value =
      formValues.is_absolute_value === IS_ABSOLUTE_VALUE.ABSOLUTE
    formValues.value = parseFloat(formValues.value)
    const res = yield call(Api.createDiscount, formValues)
    if (res.status) {
      yield put({
        type: feeDiscountsActionTypes.CREATE_DISCOUNT_SUCCEEDED,
      })
      yield put({
        type: feeCollectionActionTypes.SET_SLIDER_SCREEN,
        payload: null,
      })
      yield put(showSuccessToast(DISCOUNT.discountCreatedMessage))
      yield put({
        type: feeDiscountsActionTypes.FETCH_DISCOUNTS_REQUESTED,
        payload: null,
      })
    } else {
      yield put({
        type: feeDiscountsActionTypes.CREATE_DISCOUNT_FAILED,
      })
      yield put(showErrorToast(res.msg))
    }
  } catch (e) {
    yield put({
      type: feeDiscountsActionTypes.CREATE_DISCOUNT_FAILED,
    })
    yield put(showErrorToast(e.msg))
  }
}

export function* watchCreateDiscount() {
  yield takeEvery(
    feeDiscountsActionTypes.CREATE_DISCOUNT_REQUESTED,
    createDiscount
  )
}

function* editDiscount(action) {
  try {
    const res = yield call(Api.editDiscount, action.payload)
    if (res.status) {
      yield put({
        type: feeDiscountsActionTypes.EDIT_DISCOUNT_SUCCEEDED,
      })
      unusedProperties.forEach((e) => delete res.obj[e])
      yield put({
        type: feeCollectionActionTypes.SET_SLIDER_SCREEN,
        payload: {
          name: SliderScreens.DISCOUNT_SLIDER,
          data: {
            initialValues: {
              ...res.obj,
              removed_students: res.obj.students,
              removed_fee_types: res.obj.fee_types,
              is_absolute_value: res.obj.is_absolute_value.toString(),
            },
          },
        },
      })
    } else {
      yield put({
        type: feeDiscountsActionTypes.EDIT_DISCOUNT_FAILED,
      })
      yield put(showErrorToast(res.msg))
    }
  } catch (e) {
    yield put({
      type: feeDiscountsActionTypes.EDIT_DISCOUNT_FAILED,
    })
    yield put(showErrorToast(e.msg))
  }
}

export function* watchEditDiscount() {
  yield takeEvery(feeDiscountsActionTypes.EDIT_DISCOUNT_REQUESTED, editDiscount)
}

function* updateDiscount(action) {
  let formValues = {...action.payload}
  formValues.is_absolute_value =
    formValues.is_absolute_value === IS_ABSOLUTE_VALUE.ABSOLUTE
  formValues.value = parseFloat(formValues.value)
  formValues.removed_students = formValues.removed_students.filter(
    (f) => !formValues.students.includes(f)
  )
  formValues.removed_fee_types = formValues.removed_fee_types.filter(
    (f) => !formValues.fee_types.includes(f)
  )
  try {
    const res = yield call(Api.updateDiscount, formValues)
    if (res.status) {
      yield put({
        type: feeDiscountsActionTypes.UPDATE_DISCOUNT_SUCCEEDED,
      })
      yield put({
        type: feeCollectionActionTypes.SET_SLIDER_SCREEN,
        payload: null,
      })
      yield put(showSuccessToast(DISCOUNT.discountUpdatedMessage))
      yield put({
        type: feeDiscountsActionTypes.FETCH_DISCOUNTS_REQUESTED,
        payload: null,
      })
    } else {
      yield put({
        type: feeDiscountsActionTypes.UPDATE_DISCOUNT_FAILED,
      })
      yield put(showErrorToast(res.msg))
    }
  } catch (e) {
    yield put({
      type: feeDiscountsActionTypes.UPDATE_DISCOUNT_FAILED,
    })
    yield put(showErrorToast(e.msg))
  }
}

export function* watchUpdateDiscount() {
  yield takeEvery(
    feeDiscountsActionTypes.UPDATE_DISCOUNT_REQUESTED,
    updateDiscount
  )
}

function* deleteDiscount(action) {
  try {
    const res = yield call(Api.deleteDiscount, action.payload)
    if (res.status) {
      yield put({
        type: feeDiscountsActionTypes.DELETE_DISCOUNT_SUCCEEDED,
      })
      yield put(showSuccessToast(DISCOUNT.discountdeletedMessage))
      yield put({
        type: feeDiscountsActionTypes.FETCH_DISCOUNTS_REQUESTED,
        payload: null,
      })
    } else {
      yield put({
        type: feeDiscountsActionTypes.DELETE_DISCOUNT_FAILED,
      })
      yield put(showErrorToast(res.msg))
    }
  } catch (e) {
    yield put({
      type: feeDiscountsActionTypes.DELETE_DISCOUNT_FAILED,
    })
    yield put(showErrorToast(e.msg))
  }
}

export function* watchDeleteDiscount() {
  yield takeEvery(
    feeDiscountsActionTypes.DELETE_DISCOUNT_REQUESTED,
    deleteDiscount
  )
}

function downloadStudentList(data, metaData) {
  const rows = [
    {discountName: 'Discount name', value: data.name},
    {
      discountApplicable: 'Discount Applicable',
      value: data.is_absolute_value
        ? roundWithPrecision(data.value)
        : data.value + ' %',
    },
    {
      applicableOn: 'Applicable on',
      value: data.fee_types
        .map(
          (type) =>
            metaData.feeTypes.find((feeType) => feeType._id === type).name
        )
        .join(', '),
    },
    {noOfStudents: 'Number of Students', value: data?.students?.length ?? 0},
    {},
    {
      studentName: 'Student Name',
      className: 'Class',
      discountAmount: 'Discount Amount',
    },
    ...data.students.map((student) => {
      const studentDetails = metaData.studentsList.find(
        (stud) => stud._id === student
      )
      return {
        studentName: studentDetails.name,
        className: studentDetails.classroom,
        discountAmount: data.report_details[student].toFixed(2),
      }
    }),
  ]
  createAndDownloadCSV(
    'Discount-Report-' + DateTime.now().toFormat('dd-LL-yyyy'),
    JSObjectToCSV([metaData.instituteInfo.name], rows)
  )
  metaData.eventManager.send_event(events.DOWNLOAD_REPORT_CLICKED_TFI, {
    screenName: 'discount_student',
  })
}

function* downloadDiscount(action) {
  const metaData = {...action.payload}
  try {
    const res = yield call(Api.editDiscount, metaData.discountItem)
    if (res.status) {
      yield put({
        type: feeDiscountsActionTypes.DOWNLOAD_DISCOUNT_SUCCEEDED,
      })
      downloadStudentList(res.obj, metaData)
      yield put(showSuccessToast(FEES.CSV_REPORT_EXPORTED_MESSAGE))
    } else {
      yield put({
        type: feeDiscountsActionTypes.DOWNLOAD_DISCOUNT_FAILED,
      })
      yield put(showErrorToast(res.msg))
    }
  } catch (e) {
    yield put({
      type: feeDiscountsActionTypes.DOWNLOAD_DISCOUNT_FAILED,
    })
    yield put(showErrorToast(e.msg))
  }
}

export function* watchDownloadDiscount() {
  yield takeEvery(
    feeDiscountsActionTypes.DOWNLOAD_DISCOUNT_REQUESTED,
    downloadDiscount
  )
}

function* adHocStudentListing() {
  yield put({
    type: feeDiscountsActionTypes.SET_DISCOUNT_STATES,
    payload: {adHocDiscountStudentListLoader: true},
  })

  try {
    const res = yield call(adHocDiscountApi.fetchAdHocStudentListing)
    if (res.status) {
      yield put({
        type: feeDiscountsActionTypes.SET_DISCOUNT_STATES,
        payload: {
          adHocDiscountStudentList: res.obj,
          adHocDiscountStudentListLoader: false,
        },
      })
    } else {
      yield put(showErrorToast(res.msg))
      yield put({
        type: feeDiscountsActionTypes.SET_DISCOUNT_STATES,
        payload: {adHocDiscountStudentListLoader: false},
      })
    }
  } catch (e) {
    yield put(showErrorToast(e.msg))
    yield put({
      type: feeDiscountsActionTypes.SET_DISCOUNT_STATES,
      payload: {adHocDiscountStudentListLoader: false},
    })
  }
}

export function* watchAdHocStudentListing() {
  yield takeEvery(
    feeDiscountsActionTypes.FETCH_AD_HOC_STUDENT_LISTING,
    adHocStudentListing
  )
}

function* createAdHocDiscountReason(action) {
  try {
    const res = yield call(
      adHocDiscountApi.createDiscountReason,
      action.payload
    )
    if (res.status) {
      yield put(
        setDiscountStatesAction({
          isCreateReasonModalOpen: false,
          selectedAdHocReason: res.obj._id,
        })
      )

      yield put({
        type: feeDiscountsActionTypes.FETCH_AD_HOC_DISCOUNT_LIST,
      })
    } else {
      yield put(showErrorToast(res.msg))
    }
  } catch (e) {
    yield put(showErrorToast(e.msg))
  }
}

export function* watchCreateAdHocDiscountReason() {
  yield takeEvery(
    feeDiscountsActionTypes.CREATE_AD_HOC_DISCOUNT_REASON,
    createAdHocDiscountReason
  )
}

function* fetchAdHocDiscountList() {
  try {
    const res = yield call(adHocDiscountApi.fetchAdHocDiscountList)
    if (res.status) {
      let options = []
      options = res.obj.map((reason) => {
        return {value: reason._id, label: reason.name}
      })

      options.push({
        value: 'noneOfAbove',
        label: 'Others',
      })

      yield put(setDiscountStatesAction({adHocDiscountReasons: options}))
    } else {
      yield put(showErrorToast(res.msg))
    }
  } catch (e) {
    yield put(showErrorToast(e.msg))
  }
}

export function* watchFetchAdHocDiscountList() {
  yield takeEvery(
    feeDiscountsActionTypes.FETCH_AD_HOC_DISCOUNT_LIST,
    fetchAdHocDiscountList
  )
}

function* downloadAdHocDiscountReceipt(action) {
  try {
    const {studentId, receiptNo} = action.payload
    const res = yield call(
      adHocDiscountApi.downloadAdHocDiscountReceipt,
      studentId,
      receiptNo
    )
    yield put({
      type: feeTransactionActionTypes.FEE_TRANSACTION_DOWNLOAD_SUCCEEDED,
      payload: res,
    })
    const win = window.open(res.receipt_url, '_blank')
    if (win != null) {
      win.focus()
    }
  } catch (e) {
    yield put({
      type: feeTransactionActionTypes.FEE_TRANSACTION_DOWNLOAD_FAILED,
    })
    yield put(showErrorToast(e.msg))
  }
}

export function* watchDownloadAdHocDiscountReceipt() {
  yield takeEvery(
    feeDiscountsActionTypes.DOWNLOAD_AD_HOC_DICSOUNT_RECEIPT,
    downloadAdHocDiscountReceipt
  )
}

function* deleteStudentAdHocDiscount(action) {
  try {
    let res = yield call(Api.deleteStudentAdHocDiscount, action.payload)
    if (res.status) {
      yield put({
        type: feeDiscountsActionTypes.DELETE_STUDENT_ADHOC_DISCOUNT_SUCCEEDED,
      })
      yield put(fetchAdHocDiscountRequestAction())
    } else {
      yield put(showErrorToast(res?.msg || 'Something went wrong'))
    }
  } catch (e) {
    yield put({
      type: feeDiscountsActionTypes.DELETE_STUDENT_ADHOC_DISCOUNT_FAILED,
      payload: e.msg,
    })
    yield put(showErrorToast(e?.msg || 'Something went wrong'))
  }
}

export function* watchDeleteStudentAdHocDiscount() {
  yield takeEvery(
    feeDiscountsActionTypes.DELETE_STUDENT_ADHOC_DISCOUNT_REQUESTED,
    deleteStudentAdHocDiscount
  )
}
