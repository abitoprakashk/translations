import {call, put, takeEvery} from 'redux-saga/effects'
import {Trans} from 'react-i18next'
import {
  showErrorToast,
  showSuccessToast,
} from '../../../../redux/actions/commonAction'
import * as Api from '../../apiService'
import {schedulerActionType} from './../actionTypes'

const somethingWentWrongPleaseCheckYourNetwork = (
  <Trans i18nKey="fetchPostsListErrorToast" />
)

const ruleCreationSuccess = <Trans i18nKey="ruleCreationSuccess" />
const ruleActivated = <Trans i18nKey="ruleActivated" />
const ruleDeactivated = <Trans i18nKey="ruleDeactivated" />
const ruleDeleted = <Trans i18nKey="ruleDelete" />
const ruleInstancesUpdated = <Trans i18nKey="ruleInstancesUpdated" />
const ruleFetchFailed = <Trans i18nKey="ruleFetchFailed" />
const templatesFetchFailed = <Trans i18nKey="templateFetchFailed" />

function* addOrUpdateRule({payload}) {
  delete payload.icon
  const res = yield call(Api.addOrUpdateRule, payload)
  if (res.status) {
    yield put(showSuccessToast(ruleCreationSuccess))
    yield put({type: schedulerActionType.FETCH_RULES_LIST})
    yield put({type: schedulerActionType.FETCH_TEMPLATES})
    yield put({type: schedulerActionType.FETCH_RULE_INSTANCES})
  } else {
    yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
  }
}

export function* watchAddOrUpdateRule() {
  yield takeEvery(schedulerActionType.UPDATE_RULE, addOrUpdateRule)
}

function* fetchRulesList({payload}) {
  yield toggleLoader({rules: true})
  try {
    const res = yield call(Api.getRulesList, payload)
    if (res.status) {
      yield put({type: schedulerActionType.SET_RULES_LIST, payload: res.obj})
    } else {
      yield put(showErrorToast(ruleFetchFailed))
    }
  } catch (e) {
    yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
  } finally {
    yield toggleLoader({rules: false})
  }
}

export function* watchFetchRulesList() {
  yield takeEvery(schedulerActionType.FETCH_RULES_LIST, fetchRulesList)
}

function* fetchSchedulerTemplates() {
  try {
    yield toggleLoader({templates: true})
    const res = yield call(Api.getSchedulerTemplates)
    if (res.status) {
      yield put({type: schedulerActionType.SET_TEMPLATES, payload: res.obj})
    } else {
      yield put(showErrorToast(templatesFetchFailed))
    }
  } catch (e) {
    yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
  } finally {
    yield toggleLoader({templates: false})
  }
}

export function* watchFetchSchedulerTemplates() {
  yield takeEvery(schedulerActionType.FETCH_TEMPLATES, fetchSchedulerTemplates)
}

function* postToggleRule({payload}) {
  const res = yield call(Api.postToggleSwitch, payload)
  if (res.status) {
    yield put(
      showSuccessToast(res.obj.active ? ruleActivated : ruleDeactivated)
    )
    yield put({type: schedulerActionType.FETCH_RULES_LIST})
    yield put({type: schedulerActionType.FETCH_RULE_INSTANCES})
  } else {
    yield put(
      showErrorToast(res.message || somethingWentWrongPleaseCheckYourNetwork)
    )
  }
}

export function* watchPostToggleRule() {
  yield takeEvery(schedulerActionType.TOGGLE_RULE_STATUS, postToggleRule)
}

function* deleteSchedulerRule({payload}) {
  const res = yield call(Api.postDeleteRule, payload)
  if (res.status) {
    yield put(showSuccessToast(ruleDeleted))
    yield put({type: schedulerActionType.FETCH_RULES_LIST})
    yield put({type: schedulerActionType.FETCH_TEMPLATES})
  } else {
    yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
  }
}

export function* watchDeleteSchedulerRule() {
  yield takeEvery(schedulerActionType.DELETE_RULE, deleteSchedulerRule)
}

function* toggleLoader(payload) {
  yield put({
    type: schedulerActionType.TOGGLE_SCHEDULER_LOADER,
    payload,
  })
}

function* getAutomatedMessages({payload}) {
  yield toggleLoader({messages: true})
  const res = yield call(Api.fetchAutomatedMessages, payload)
  if (res.status) {
    yield put({
      type: schedulerActionType.SET_AUTOMATED_MESSAGES,
      payload: {
        data: res.obj,
        rule_id: payload.rule_id || 'all',
      },
    })
  } else {
    yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
  }
  yield toggleLoader({messages: false})
}

export function* watchFetchAutomatedMessages() {
  yield takeEvery(
    schedulerActionType.FETCH_AUTOMATED_MESSAGES,
    getAutomatedMessages
  )
}

function* getRuleInstances() {
  const res = yield call(Api.fetchRuleInstances)
  if (res.status) {
    yield put({
      type: schedulerActionType.SET_RULE_INSTANCES,
      payload: res.obj,
    })
  } else {
    yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
  }
}

export function* watchFetchRuleInstances() {
  yield takeEvery(schedulerActionType.FETCH_RULE_INSTANCES, getRuleInstances)
}

function* toggleRuleInstances({payload}) {
  const res = yield call(Api.toggleRuleInstances, payload)
  if (res.status) {
    yield put(showSuccessToast(ruleInstancesUpdated))
    yield put({type: schedulerActionType.FETCH_RULE_INSTANCES})
  } else {
    yield put(showErrorToast(somethingWentWrongPleaseCheckYourNetwork))
  }
}

export function* watchToggleRuleInstances() {
  yield takeEvery(
    schedulerActionType.TOGGLE_RULE_INSTANCES,
    toggleRuleInstances
  )
}
