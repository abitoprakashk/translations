import {t} from 'i18next'
import {call, put, takeEvery} from 'redux-saga/effects'
import {REACT_APP_API_URL} from '../../../../constants'
import {
  showErrorToast,
  showSuccessToast,
} from '../../../../redux/actions/commonAction'
import globalActions from '../../../../redux/actions/global.actions'
import {
  ERROR_CODE_AND_MSG,
  FEE_COMPANY_ACCOUNT_URL,
} from '../../components/CompanyAndAccount/companyAccConstants'
import * as Api from '../apis/feeCompanyAccountApis'

const generateUrl = (uri, params = {}) => {
  const searchParams = new URLSearchParams(params)
  return `${REACT_APP_API_URL}${uri}?${searchParams.toString()}`
}

function* getCompanyAccountList({data}) {
  try {
    const response = yield call(Api.apiRequest, {
      url: generateUrl(FEE_COMPANY_ACCOUNT_URL.createCompanyAccountList),
      method: 'GET',
      data,
    })
    if (response?.status) {
      yield put(globalActions.getCompanyAccountListCA.success(response?.obj))
    }
  } catch (error) {
    yield put(
      showErrorToast(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    )
  }
}

function* createNewCompany({data, failureAction, successAction}) {
  try {
    const response = yield call(Api.apiRequest, {
      url: generateUrl(FEE_COMPANY_ACCOUNT_URL.createNewCompany),
      method: 'POST',
      data,
    })
    if (response?.status) {
      yield put(globalActions.createNewCompanyCA.success())
      yield put(showSuccessToast(t('companyCreated')))
      successAction()
    } else {
      let errorObj = ERROR_CODE_AND_MSG[response?.error_code] || {}
      let errorMsg =
        errorObj?.msg || t('somethingWentWrongPleaseCheckYourNetwork')
      failureAction(errorMsg)
    }
    yield put(globalActions.getCompanyAccountListCA.request())
  } catch (error) {
    let errorObj = ERROR_CODE_AND_MSG[error?.error_code] || {}
    let errorMsg =
      errorObj?.msg || t('somethingWentWrongPleaseCheckYourNetwork')
    failureAction(errorMsg)
    yield put(
      showErrorToast(
        error?.msg || t('somethingWentWrongPleaseCheckYourNetwork')
      )
    )
  }
}

function* updateCompany({data, failureAction, successAction}) {
  try {
    const response = yield call(Api.apiRequest, {
      url: generateUrl(FEE_COMPANY_ACCOUNT_URL.updateCompany),
      method: 'POST',
      data,
    })
    if (response?.status) {
      yield put(globalActions.updateCompanyCA.success())
      yield put(globalActions.getCompanyAccountListCA.request())
      successAction()
    } else {
      let errorObj = ERROR_CODE_AND_MSG[response?.error_code] || {}
      let errorMsg =
        errorObj?.msg || t('somethingWentWrongPleaseCheckYourNetwork')
      failureAction(errorMsg)
    }
  } catch (error) {
    let errorObj = ERROR_CODE_AND_MSG[error?.error_code] || {}
    let errorMsg =
      errorObj?.msg || t('somethingWentWrongPleaseCheckYourNetwork')
    failureAction(errorMsg)
    yield put(
      showErrorToast(
        error?.msg || t('somethingWentWrongPleaseCheckYourNetwork')
      )
    )
  }
}

function* createNewAccount({data, failureAction, successAction}) {
  try {
    const response = yield call(Api.apiRequest, {
      url: generateUrl(FEE_COMPANY_ACCOUNT_URL.createNewAccount),
      method: 'POST',
      data,
    })
    if (response?.status) {
      yield put(globalActions.createNewAccountCA.success())
      yield put(showSuccessToast(t('accountCreated')))
      yield put(globalActions.getCompanyAccountListCA.request())
      successAction()
    } else {
      let errorObj = ERROR_CODE_AND_MSG[response?.error_code] || {}
      let errorMsg =
        errorObj?.msg || t('somethingWentWrongPleaseCheckYourNetwork')
      failureAction(errorMsg)
    }
  } catch (error) {
    let errorObj = ERROR_CODE_AND_MSG[error?.error_code] || {}
    let errorMsg =
      errorObj?.msg || t('somethingWentWrongPleaseCheckYourNetwork')
    failureAction(errorMsg)
    failureAction(errorMsg || '')
    yield put(
      showErrorToast(
        error?.msg || t('somethingWentWrongPleaseCheckYourNetwork')
      )
    )
  }
}

function* updateAccount({data, failureAction, successAction}) {
  try {
    const response = yield call(Api.apiRequest, {
      url: generateUrl(FEE_COMPANY_ACCOUNT_URL.updateAccount),
      method: 'POST',
      data,
    })
    if (response?.status) {
      yield put(globalActions.updateAccountCA.success())
      yield put(globalActions.getCompanyAccountListCA.request())
      successAction()
    } else {
      let errorObj = ERROR_CODE_AND_MSG[response?.error_code] || {}
      let errorMsg =
        errorObj?.msg || t('somethingWentWrongPleaseCheckYourNetwork')
      failureAction(errorMsg)
    }
  } catch (error) {
    let errorObj = ERROR_CODE_AND_MSG[error?.error_code] || {}
    let errorMsg =
      errorObj?.msg || t('somethingWentWrongPleaseCheckYourNetwork')
    failureAction(errorMsg)
    yield put(
      showErrorToast(
        error?.msg || t('somethingWentWrongPleaseCheckYourNetwork')
      )
    )
  }
}

function* verifyIFSC({data, failureAction, successAction}) {
  try {
    const response = yield call(Api.apiRequest, {
      url: generateUrl(FEE_COMPANY_ACCOUNT_URL.verifyIFSC, {
        ifsc: data.ifsc,
      }),
      method: 'GET',
      data,
    })
    if (response?.status) {
      successAction(response?.obj)
    } else {
      let errorObj = ERROR_CODE_AND_MSG[response?.error_code] || {}
      let errorMsg =
        errorObj?.msg || t('somethingWentWrongPleaseCheckYourNetwork')
      failureAction(errorMsg)
    }
  } catch (error) {
    failureAction(error)
  }
}

function* fetchAccountActivities({data, successAction}) {
  try {
    const response = yield call(Api.apiRequest, {
      url: generateUrl(FEE_COMPANY_ACCOUNT_URL.accountActivity, {
        start_timestamp: data.start_timestamp,
        end_timestamp: data.end_timestamp,
      }),
      method: 'GET',
    })
    if (response?.status) {
      successAction(response?.obj)
    }
  } catch (error) {
    yield put(
      showErrorToast(
        error?.msg || t('somethingWentWrongPleaseCheckYourNetwork')
      )
    )
  }
}

function* getAccountMappingListCA({data}) {
  try {
    const response = yield call(Api.apiRequest, {
      url: generateUrl(FEE_COMPANY_ACCOUNT_URL.getAccountMappingList),
      method: 'GET',
      data,
    })
    JSON.stringify(response)
    yield put(globalActions.getAccountMappingListCA.success(response?.obj))
  } catch (error) {
    yield put(
      showErrorToast(
        error?.msg || t('somethingWentWrongPleaseCheckYourNetwork')
      )
    )
  }
}

function* createAccountMapping({data}) {
  try {
    const response = yield call(Api.apiRequest, {
      url: generateUrl(FEE_COMPANY_ACCOUNT_URL.createAccountMapping),
      method: 'POST',
      data,
    })
    JSON.stringify(response)
  } catch (error) {
    yield put(
      showErrorToast(
        error?.msg || t('somethingWentWrongPleaseCheckYourNetwork')
      )
    )
  }
}

function* getSessionFeeTypes({data}) {
  try {
    const response = yield call(Api.apiRequest, {
      url: generateUrl(FEE_COMPANY_ACCOUNT_URL.getSessionFeeTypes),
      method: 'GET',
      data,
    })
    let feeTypesIds =
      response?.status && Array.isArray(response?.obj)
        ? response?.obj?.map((feetype) => feetype?._id)
        : []
    yield put(globalActions.getSessionFeeTypesCA.success(feeTypesIds))
  } catch (error) {
    yield put(
      showErrorToast(
        error?.msg || t('somethingWentWrongPleaseCheckYourNetwork')
      )
    )
  }
}
function* updateAccountMapping({data, failureAction, successAction}) {
  try {
    const response = yield call(Api.apiRequest, {
      url: generateUrl(FEE_COMPANY_ACCOUNT_URL.updateAccountMapping),
      method: 'POST',
      data,
    })
    yield put(globalActions.updateAccountMappingCA.success(response?.obj))
    successAction()
    failureAction()
  } catch (error) {
    yield put(
      showErrorToast(
        error?.msg || t('somethingWentWrongPleaseCheckYourNetwork')
      )
    )
  }
}

function* resetAccountMapping({
  data,
  successAction = () => {},
  failureAction = () => {},
}) {
  try {
    const response = yield call(Api.apiRequest, {
      url: generateUrl(FEE_COMPANY_ACCOUNT_URL.resetAccountMapping),
      method: 'POST',
      data,
    })

    if (response?.status) {
      yield put(globalActions.resetAccountMappingCA.success(response?.obj))
      successAction()
    } else {
      failureAction()
    }
  } catch (error) {
    yield put(
      showErrorToast(
        error?.msg || t('somethingWentWrongPleaseCheckYourNetwork')
      )
    )
  }
}

export function* watchFeeCompanyAccountRequest() {
  yield takeEvery(globalActions.createNewCompanyCA.REQUEST, createNewCompany)

  yield takeEvery(globalActions.updateCompanyCA.REQUEST, updateCompany)

  yield takeEvery(globalActions.createNewAccountCA.REQUEST, createNewAccount)

  yield takeEvery(globalActions.updateAccountCA.REQUEST, updateAccount)

  yield takeEvery(globalActions.verifyIFSCCA.REQUEST, verifyIFSC)

  yield takeEvery(
    globalActions.accountActivityCA.REQUEST,
    fetchAccountActivities
  )

  yield takeEvery(
    globalActions.getCompanyAccountListCA.REQUEST,
    getCompanyAccountList
  )

  yield takeEvery(
    globalActions.getAccountMappingListCA.REQUEST,
    getAccountMappingListCA
  )

  yield takeEvery(
    globalActions.createAccountMappingCA.REQUEST,
    createAccountMapping
  )

  yield takeEvery(
    globalActions.getSessionFeeTypesCA.REQUEST,
    getSessionFeeTypes
  )
  yield takeEvery(
    globalActions.updateAccountMappingCA.REQUEST,
    updateAccountMapping
  )

  yield takeEvery(
    globalActions.resetAccountMappingCA.REQUEST,
    resetAccountMapping
  )
}

function* getAccountPassbook({data}) {
  try {
    const response = yield call(Api.apiRequest, {
      url: generateUrl(FEE_COMPANY_ACCOUNT_URL.getAccountPassbook),
      method: 'POST',
      data,
    })
    if (response?.status) {
      yield put(globalActions.getAccountPassbook.success(response.obj))
    } else {
      yield put(showErrorToast(t('somethingWentWrongPleaseCheckYourNetwork')))
    }
  } catch (error) {
    yield put(
      showErrorToast(
        error?.msg || t('somethingWentWrongPleaseCheckYourNetwork')
      )
    )
  }
}

export function* watchGetAccountPassbookRequest() {
  yield takeEvery(globalActions.getAccountPassbook.REQUEST, getAccountPassbook)
}

function* changeReceiptAccount({data, successAction, failureAction}) {
  try {
    const response = yield call(Api.apiRequest, {
      url: generateUrl(FEE_COMPANY_ACCOUNT_URL.changeReceiptAccount),
      method: 'POST',
      data,
    })
    if (response?.status) {
      yield put(globalActions.changeReceiptAccount.success())
      successAction(response.obj)
    } else {
      let errorObj = ERROR_CODE_AND_MSG[response?.error_code] || {}
      let errorMsg =
        errorObj?.msg || t('somethingWentWrongPleaseCheckYourNetwork')
      yield put(globalActions.changeReceiptAccount.failure())
      failureAction(errorMsg)
    }
  } catch (error) {
    let errorObj = ERROR_CODE_AND_MSG[error?.error_code] || {}
    let errorMsg =
      errorObj?.msg || t('somethingWentWrongPleaseCheckYourNetwork')
    yield put(globalActions.changeReceiptAccount.failure())
    failureAction(errorMsg)
  }
}

export function* watchChangeReceiptAccountRequest() {
  yield takeEvery(
    globalActions.changeReceiptAccount.REQUEST,
    changeReceiptAccount
  )
}

function* accountChangeHistory({data, successAction, failureAction}) {
  try {
    const response = yield call(Api.apiRequest, {
      url: generateUrl(FEE_COMPANY_ACCOUNT_URL.accountChangeHistory, {
        receipt_id: data?.receiptId,
      }),
      method: 'GET',
    })
    if (response?.status) {
      yield put(globalActions.accountChangeHistory.success())
      successAction(response.obj)
    } else {
      let errorObj = ERROR_CODE_AND_MSG[response?.error_code] || {}
      let errorMsg =
        errorObj?.msg || t('somethingWentWrongPleaseCheckYourNetwork')
      failureAction(errorMsg)
    }
  } catch (error) {
    let errorObj = ERROR_CODE_AND_MSG[error?.error_code] || {}
    let errorMsg =
      errorObj?.msg || t('somethingWentWrongPleaseCheckYourNetwork')
    failureAction(errorMsg)
    yield put(
      showErrorToast(
        error?.msg || t('somethingWentWrongPleaseCheckYourNetwork')
      )
    )
  }
}

export function* watchAccountChangeHistoryRequest() {
  yield takeEvery(
    globalActions.accountChangeHistory.REQUEST,
    accountChangeHistory
  )
}
