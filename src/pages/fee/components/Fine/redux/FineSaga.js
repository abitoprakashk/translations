import {Trans} from 'react-i18next'
import {call, put, takeEvery} from 'redux-saga/effects'
import {showErrorToast} from '../../../../../redux/actions/commonAction'
import {events} from '../../../../../utils/EventsConstants'
import {feeFineActionTypes} from './ActionTypes'
import * as Api from './Apis'
import {fetchFeeFineRulesAction, setFeeFineStatesAction} from './FineActions'

const somethingWentWrongPleaseCheckYourNetwork = (
  <Trans i18nKey={'fetchPostsListErrorToast'}>
    Something went wrong, please check your network
  </Trans>
)

function* fetchFeeFineRules() {
  yield put(setFeeFineStatesAction({fineRuleLoader: true}))
  try {
    const res = yield call(Api.fetchFeeFineRules)
    if (res?.status) {
      yield put(
        setFeeFineStatesAction({fineRules: res.obj, fineRuleLoader: false})
      )
    } else {
      yield put(showErrorToast(res?.msg))
    }
  } catch (err) {
    yield put(setFeeFineStatesAction({fineRuleLoader: false}))
    yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
  }
}

export function* watchFetchFeeFineRules() {
  yield takeEvery(feeFineActionTypes.FETCH_FEE_FINE_RULES, fetchFeeFineRules)
}

function* saveRuleConfiguration(action) {
  yield put(setFeeFineStatesAction({saveFineRuleLoader: true}))
  const {payload, metaData} = action.payload
  try {
    const res = yield call(Api.saveRuleConfiguration, payload)
    if (res?.status) {
      metaData.eventManager.send_event(events.FINE_RULES_SAVED_TFI, {
        fee_type: metaData.feeTypesName,
      })
      yield put(fetchFeeFineRulesAction())
      yield put(setFeeFineStatesAction({isConfigureRuleSliderOpen: false}))
    } else {
      yield put(showErrorToast(res?.msg))
    }
    yield put(setFeeFineStatesAction({saveFineRuleLoader: false}))
  } catch (error) {
    yield put(setFeeFineStatesAction({saveFineRuleLoader: false}))
    yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
  }
}

export function* watchSaveRuleConfiguration() {
  yield takeEvery(
    feeFineActionTypes.SAVE_RULE_CONFIGURATION_REQUEST,
    saveRuleConfiguration
  )
}

function* fetchFeeFineStudentListing() {
  try {
    yield put(setFeeFineStatesAction({finedUserResponseloader: true}))

    const res = yield call(Api.fetchFeeFineStudentListing)
    if (res?.status) {
      yield put(
        setFeeFineStatesAction({
          finedUserResponse: res.obj,
        })
      )
    } else {
      yield put(showErrorToast(res?.msg))
    }
    yield put(
      setFeeFineStatesAction({
        finedUserResponseloader: false,
      })
    )
  } catch (error) {
    yield put(
      setFeeFineStatesAction({
        finedUserResponseloader: false,
      })
    )
    yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
  }
}

export function* watchFetchFeeFineStudentListing() {
  yield takeEvery(
    feeFineActionTypes.FETCH_FEE_FINE_STUDENT_LISTING_REQUEST,
    fetchFeeFineStudentListing
  )
}

function* deleteFeeFineRule(action) {
  try {
    const {payload, metaData} = action.payload
    const res = yield call(Api.deleteFeeFineRule, payload)
    if (res?.status) {
      metaData.eventManager.send_event(events.FINE_RULES_DELETED_TFI, {
        fee_type: metaData.feeTypesName,
      })
      yield put(fetchFeeFineRulesAction())
    } else {
      yield put(showErrorToast(res?.msg))
    }
    yield put(
      setFeeFineStatesAction({
        isDeleteRuleModalOpen: false,
        finedUserResponseloader: false,
      })
    )
  } catch (error) {
    yield put(
      setFeeFineStatesAction({
        isDeleteRuleModalOpen: false,
        finedUserResponseloader: false,
      })
    )
    yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
  }
}

export function* watchDeleteFeeFineRule() {
  yield takeEvery(feeFineActionTypes.DELETE_FEE_FINE_RULE, deleteFeeFineRule)
}
