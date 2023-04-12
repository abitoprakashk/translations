import {call, put, takeEvery} from 'redux-saga/effects'
import {showErrorToast} from '../../../../../redux/actions/commonAction'
import globalActions from '../../../../../redux/actions/global.actions'
import {toCamelCasedKeys} from '../../../../../utils/Helpers'
import {getStudentProfileWalletSummaryAction} from './actions'
import {FEE_TAB_ACTION_TYPES} from './actionTypes'
import * as Api from './apis'
// import {PAYMENT_HISTORY} from './mockData'
// import {FEE_SUMMARY} from './mockData'
// import {INSTALMENT_WISE_DETAILS} from './mockData'
// import {DISCOUNT_TILL_DATE} from './mockData'
// import {FEE_UPDATE_HISTORY_RES} from './mockData'
// import {WALLET_TRANSACTIONS} from './mockData'

// STUDENT_PROFILE_FEE_TAB_DETAILS_REQUEST
function* getStudentProfileFeeTabDetails(action) {
  try {
    yield put({
      type: FEE_TAB_ACTION_TYPES.SET_STUDENT_PROFILE_FEE_TAB_STATE,
      payload: {isDataFetching: true},
    })

    const res = yield call(Api.getStudentProfileFeeTabDetails, action.payload)
    if (res.status) {
      const {
        fee,
        discount,
        paid,
        due,
        due_till_date,
        installments,
        last_updated_history_timestamp,
      } = res.obj
      yield put({
        type: FEE_TAB_ACTION_TYPES.SET_STUDENT_PROFILE_FEE_SUMMARY_STATE,
        payload: {
          data: {
            fee: fee || 0,
            discount: discount || 0,
            paid: paid || 0,
            due: due || 0,
            dueTillDate: due_till_date || 0,
            installments: installments || 0,
            lastUpdatedHistoryTimestamp: last_updated_history_timestamp || null,
          },
        },
      })
      yield put({
        type: FEE_TAB_ACTION_TYPES.SET_STUDENT_PROFILE_FEE_INSTALLMENT_WISE_DETAILS_STATE,
        payload: {data: installments || []},
      })
      yield put({
        type: FEE_TAB_ACTION_TYPES.SET_STUDENT_PROFILE_FEE_TAB_STATE,
        payload: {isDataFetching: false},
      })
    } else {
      yield put({
        type: FEE_TAB_ACTION_TYPES.SET_STUDENT_PROFILE_FEE_TAB_STATE,
        payload: {isDataFetching: false},
      })
      yield put(showErrorToast(res.msg))
    }
  } catch (error) {
    yield put({
      type: FEE_TAB_ACTION_TYPES.SET_STUDENT_PROFILE_FEE_TAB_STATE,
      payload: {isDataFetching: false},
    })
    yield put(showErrorToast(error.message))
  }
}

export function* watchGetStudentProfileFeeTabDetails() {
  yield takeEvery(
    FEE_TAB_ACTION_TYPES.STUDENT_PROFILE_FEE_TAB_DETAILS_REQUEST,
    getStudentProfileFeeTabDetails
  )
}

function* getStudentProfileFeeUpdateHistory(action) {
  try {
    yield put({
      type: FEE_TAB_ACTION_TYPES.SET_UPADATE_HISTORY_STATE,
      payload: {isDataFetching: true},
    })

    const res = yield call(
      Api.getStudentProfileFeeUpdateHistory,
      action.payload
    )
    // yield delay(3000)
    // let res = {}
    // res.status = true
    // res.obj = FEE_UPDATE_HISTORY_RES
    if (res.status) {
      yield put({
        type: FEE_TAB_ACTION_TYPES.SET_UPADATE_HISTORY_STATE,
        payload: {data: res.obj, isDataFetching: false},
      })
    } else {
      yield put({
        type: FEE_TAB_ACTION_TYPES.SET_UPADATE_HISTORY_STATE,
        payload: {isDataFetching: false},
      })
      yield put(showErrorToast(res.msg))
    }
  } catch (error) {
    yield put({
      type: FEE_TAB_ACTION_TYPES.SET_UPADATE_HISTORY_STATE,
      payload: {isDataFetching: false},
    })
    yield put(showErrorToast(error.message))
  }
}

export function* watchGetStudentProfileFeeUpdateHistory() {
  yield takeEvery(
    FEE_TAB_ACTION_TYPES.FEE_UPDATE_HISTORY_REQUEST,
    getStudentProfileFeeUpdateHistory
  )
}

// function* getStudentProfileFeeSumamry(action) {
//   try {
//     yield put({
//       type: FEE_TAB_ACTION_TYPES.SET_STUDENT_PROFILE_FEE_SUMMARY_STATE,
//       payload: {isDataFetching: true},
//     })

//     const res = yield call(Api.getStudentProfileFeeSummary, action.payload)
//     // let res = {}
//     // res.status = true
//     // res.obj = FEE_SUMMARY

//     // yield delay(3000)

//     if (res.status) {
//       yield put({
//         type: FEE_TAB_ACTION_TYPES.SET_STUDENT_PROFILE_FEE_SUMMARY_STATE,
//         payload: {data: res.obj, isDataFetching: false},
//       })
//     } else {
//       yield put({
//         type: FEE_TAB_ACTION_TYPES.SET_STUDENT_PROFILE_FEE_SUMMARY_STATE,
//         payload: {data: {}, isDataFetching: false},
//       })
//       yield put(showErrorToast(res.msg))
//     }
//   } catch (error) {
//     yield put({
//       type: FEE_TAB_ACTION_TYPES.SET_STUDENT_PROFILE_FEE_SUMMARY_STATE,
//       payload: {data: {}, isDataFetching: false},
//     })
//     yield put(showErrorToast(error.message))
//   }
// }

// export function* watchGetStudentProfileFeeSummary() {
//   yield takeEvery(
//     FEE_TAB_ACTION_TYPES.STUDENT_PROFILE_FEE_TAB_SUMMARY_REQUEST,
//     getStudentProfileFeeSumamry
//   )
// }

// function* getStudentProfileFeeInstalmentWiseDetails(action) {
//   try {
//     yield put({
//       type: FEE_TAB_ACTION_TYPES.SET_STUDENT_PROFILE_FEE_INSTALLMENT_WISE_DETAILS_STATE,
//       payload: {isDataFetching: true},
//     })

//     const res = yield call(
//       Api.getStudentProfileFeeInstalmentWiseDetails,
//       action.payload
//     )
//     // yield delay(3000)
//     // let res = {}
//     // res.status = true
//     // res.obj = INSTALMENT_WISE_DETAILS

//     if (res.status) {
//       yield put({
//         type: FEE_TAB_ACTION_TYPES.SET_STUDENT_PROFILE_FEE_INSTALLMENT_WISE_DETAILS_STATE,
//         payload: {data: res.obj, isDataFetching: false},
//       })
//     } else {
//       yield put({
//         type: FEE_TAB_ACTION_TYPES.SET_STUDENT_PROFILE_FEE_INSTALLMENT_WISE_DETAILS_STATE,
//         payload: {data: [], isDataFetching: false},
//       })
//       yield put(showErrorToast(res.msg))
//     }
//   } catch (error) {
//     yield put({
//       type: FEE_TAB_ACTION_TYPES.SET_STUDENT_PROFILE_FEE_INSTALLMENT_WISE_DETAILS_STATE,
//       payload: {data: [], isDataFetching: false},
//     })
//     yield put(showErrorToast(error.message))
//   }
// }

// export function* watchGetStudentProfileFeeInstalmentWiseDetails() {
//   yield takeEvery(
//     FEE_TAB_ACTION_TYPES.SET_STUDENT_PROFILE_FEE_INSTALLMENT_WISE_DETAILS_REQUEST,
//     getStudentProfileFeeInstalmentWiseDetails
//   )
// }

function* getStudentProfileFeePaymentHistory(action) {
  try {
    yield put({
      type: FEE_TAB_ACTION_TYPES.SET_STUDENT_PROFILE_PAYMENT_HISTORY_STATE,
      payload: {isDataFetching: true, error: ''},
    })

    const res = yield call(
      Api.getStudentProfileFeePaymentHistory,
      action.payload
    )
    res.obj = res.obj.map((item) => toCamelCasedKeys(item))
    // yield delay(3000)
    // let res = {}
    // res.status = true
    // res.obj = PAYMENT_HISTORY.map((item) => toCamelCasedKeys(item))

    if (res.status) {
      yield put({
        type: FEE_TAB_ACTION_TYPES.SET_STUDENT_PROFILE_PAYMENT_HISTORY_STATE,
        payload: {
          data: res.obj,
          isDataFetching: false,
          error: '',
        },
      })
    } else {
      yield put({
        type: FEE_TAB_ACTION_TYPES.SET_STUDENT_PROFILE_PAYMENT_HISTORY_STATE,
        payload: {
          isDataFetching: false,
          error: '',
        },
      })
      yield put(showErrorToast(res.msg))
    }
  } catch (error) {
    yield put({
      type: FEE_TAB_ACTION_TYPES.SET_STUDENT_PROFILE_PAYMENT_HISTORY_STATE,
      payload: {
        isDataFetching: false,
        error: '',
      },
    })
    yield put(showErrorToast(error.message))
  }
}

export function* watchGetStudentProfileFeePaymentHistory() {
  yield takeEvery(
    FEE_TAB_ACTION_TYPES.STUDENT_PROFILE_PAYMENT_HISTORY_REQUEST,
    getStudentProfileFeePaymentHistory
  )
}

function* getStudentProfileFeeDiscountTillDate(action) {
  try {
    yield put({
      type: FEE_TAB_ACTION_TYPES.SET_STUDENT_PROFILE_DISCOUNT_TILL_DATE_STATE,
      payload: {isDataFetching: true, error: ''},
    })

    const res = yield call(
      Api.getStudentProfileFeeDiscountTillDate,
      action.payload
    )
    // yield delay(3000)
    // let res = {}
    // res.status = true
    // res.obj = DISCOUNT_TILL_DATE
    // res.obj.transactions = DISCOUNT_TILL_DATE?.transactions.map((item) =>
    //   toCamelCasedKeys(item)
    // )

    res.obj.transactions = res?.obj?.transactions.map((item) =>
      toCamelCasedKeys(item)
    )

    if (res.status) {
      yield put({
        type: FEE_TAB_ACTION_TYPES.SET_STUDENT_PROFILE_DISCOUNT_TILL_DATE_STATE,
        payload: {
          data: res.obj,
          isDataFetching: false,
          error: '',
        },
      })
    } else {
      yield put({
        type: FEE_TAB_ACTION_TYPES.SET_STUDENT_PROFILE_DISCOUNT_TILL_DATE_STATE,
        payload: {
          isDataFetching: false,
        },
      })
      yield put(showErrorToast(res.msg))
    }
  } catch (error) {
    yield put({
      type: FEE_TAB_ACTION_TYPES.SET_STUDENT_PROFILE_DISCOUNT_TILL_DATE_STATE,
      payload: {
        isDataFetching: false,
      },
    })
    yield put(showErrorToast(error.message))
  }
}

export function* watchGetStudentProfileFeeDiscountTillDate() {
  yield takeEvery(
    FEE_TAB_ACTION_TYPES.STUDENT_PROFILE_DISCOUNT_TILL_DATE_REQUEST,
    getStudentProfileFeeDiscountTillDate
  )
}

// WALLET
function* getStudentProfileWalletTransactions(action) {
  try {
    yield put({
      type: FEE_TAB_ACTION_TYPES.SET_STUDENT_PROFILE_WALLET_SUMMARY_STATE,
      payload: {isDataFetching: true, error: ''},
    })

    const res = yield call(
      Api.getStudentProfileWalletTransactions,
      action.payload
    )
    // yield delay(5000)
    // let res = {}
    // res.status = true
    // res.obj = toCamelCasedKeys(WALLET_TRANSACTIONS)
    // res.obj.transactions = WALLET_TRANSACTIONS?.transactions?.map((item) =>
    //   toCamelCasedKeys(item)
    // )
    res.obj = toCamelCasedKeys(res.obj)
    res.obj.transactions = res.obj?.transactions?.map((item) =>
      toCamelCasedKeys(item)
    )

    if (res.status) {
      yield put({
        type: FEE_TAB_ACTION_TYPES.SET_STUDENT_PROFILE_WALLET_SUMMARY_STATE,
        payload: {
          data: res.obj,
          isDataFetching: false,
          error: '',
        },
      })
    } else {
      yield put({
        type: FEE_TAB_ACTION_TYPES.SET_STUDENT_PROFILE_WALLET_SUMMARY_STATE,
        payload: {
          isDataFetching: false,
        },
      })
      yield put(showErrorToast(res.msg))
    }
  } catch (error) {
    yield put({
      type: FEE_TAB_ACTION_TYPES.SET_STUDENT_PROFILE_WALLET_SUMMARY_STATE,
      payload: {
        isDataFetching: false,
      },
    })
    yield put(showErrorToast(error.message))
  }
}

export function* watchGetStudentProfileWalletTransactions() {
  yield takeEvery(
    FEE_TAB_ACTION_TYPES.STUDENT_PROFILE_WALLET_SUMMARY_REQUEST,
    getStudentProfileWalletTransactions
  )
}

function* studentProfileWalletRefundRequest(action) {
  try {
    yield put({
      type: FEE_TAB_ACTION_TYPES.SET_STUDENT_PROFILE_WALLET_REFUND_STATE,
      payload: {isDataSending: true, error: ''},
    })

    const res = yield call(
      Api.studentProfileWalletRefundRequest,
      action.payload
    )

    if (res.status) {
      yield put({
        type: FEE_TAB_ACTION_TYPES.SET_STUDENT_PROFILE_WALLET_REFUND_STATE,
        payload: {
          isDataSending: false,
          error: '',
          isRefundModalOpen: false,
        },
      })
      yield put(getStudentProfileWalletSummaryAction(action.payload.studentId))
    } else {
      yield put({
        type: FEE_TAB_ACTION_TYPES.SET_STUDENT_PROFILE_WALLET_REFUND_STATE,
        payload: {
          isDataSending: false,
          isRefundModalOpen: false,
          error: '',
        },
      })
      yield put(showErrorToast(res.msg))
    }
  } catch (error) {
    yield put(showErrorToast(error.message))
    yield put({
      type: FEE_TAB_ACTION_TYPES.SET_STUDENT_PROFILE_WALLET_REFUND_STATE,
      payload: {
        isDataSending: false,
        isRefundModalOpen: false,
        error: '',
      },
    })
  }
}

export function* watchGetStudentProfileWalletRefundRequest() {
  yield takeEvery(
    FEE_TAB_ACTION_TYPES.STUDENT_PROFILE_WALLET_MAKE_REFUND_REQUEST,
    studentProfileWalletRefundRequest
  )
}

export const studentProfileFeeTabWatchers = [
  watchGetStudentProfileFeeTabDetails(),
  watchGetStudentProfileFeeUpdateHistory(),
  // watchGetStudentProfileFeeSummary(),
  // watchGetStudentProfileFeeInstalmentWiseDetails(),
  watchGetStudentProfileFeePaymentHistory(),
  watchGetStudentProfileFeeDiscountTillDate(),
  watchGetStudentProfileWalletTransactions(),
  watchGetStudentProfileWalletRefundRequest(),
]

function* getReceiptPrefixesRequest({successAction}) {
  try {
    const res = yield call(Api.getReceiptPrefixesRequest)
    if (res.status) {
      successAction?.(res.obj)
    } else {
      yield put(showErrorToast(res.msg))
    }
  } catch (error) {
    yield put(showErrorToast(error.message))
  }
}

export function* watchGetReceiptPrefixesRequest() {
  yield takeEvery(
    globalActions.getReceiptPrefixesRequest.REQUEST,
    getReceiptPrefixesRequest
  )
}

function* addStudentAddOnFeesRequest({data, successAction, failureAction}) {
  try {
    const res = yield call(Api.addStudentAddOnFeesRequest, data)
    yield put(globalActions.addStudentAddOnFees.success())
    if (res.status) {
      successAction?.(res.status)
    } else {
      failureAction?.(res.msg)
    }
  } catch (error) {
    yield put(globalActions.addStudentAddOnFees.failure())
  }
}

export function* watchAddStudentAddOnFeesRequest() {
  yield takeEvery(
    globalActions.addStudentAddOnFees.REQUEST,
    addStudentAddOnFeesRequest
  )
}

function* deleteAddOnFeeRequest({data, successAction, failureAction}) {
  try {
    const res = yield call(Api.deleteAddOnFee, data)
    yield put(globalActions.deleteAddOnFee.success())
    if (res.status) {
      successAction?.(res)
    } else {
      failureAction?.(res)
    }
  } catch (error) {
    failureAction?.(error)
    yield put(globalActions.deleteAddOnFee.failure())
  }
}

export function* watchDeleteAddOnFeeRequest() {
  yield takeEvery(globalActions.deleteAddOnFee.REQUEST, deleteAddOnFeeRequest)
}

function* addStudentAddOnDiscountRequest({data, successAction, failureAction}) {
  try {
    const res = yield call(Api.addStudentAddOnDiscount, data)
    yield put(globalActions.addStudentAddOnDiscount.success())
    if (res.status) {
      successAction?.(res.status)
    } else {
      failureAction?.(res.msg)
    }
  } catch (error) {
    failureAction?.(error)
    yield put(globalActions.addStudentAddOnDiscount.failure())
  }
}

export function* watchAddStudentAddOnDiscountRequest() {
  yield takeEvery(
    globalActions.addStudentAddOnDiscount.REQUEST,
    addStudentAddOnDiscountRequest
  )
}
