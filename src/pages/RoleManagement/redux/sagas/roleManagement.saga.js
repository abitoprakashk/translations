import {call, put, takeEvery} from 'redux-saga/effects'
import {adminInfoActionTypes} from '../../../../redux/actionTypes'
import {
  showErrorToast,
  showSuccessToast,
} from '../../../../redux/actions/commonAction'
import * as Api from '../../apiService'
import globalActions from '../../../../redux/actions/global.actions'
import {alertMessages} from '../../constant/alertMessages.constant'

function* getAllRolesSaga({data, successAction, failureAction}) {
  try {
    const response = yield call(Api.getAllRoles, data)
    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      yield put(globalActions.getAllRoles.success(response?.data?.obj))
      yield put({
        type: adminInfoActionTypes.ROLES_LIST,
        payload: [
          ...(response?.data?.obj?.default || []),
          ...(response?.data?.obj?.custom || []),
        ],
      })
    } else throw response?.data?.msg
  } catch (error) {
    failureAction?.()
    yield put(globalActions.getAllRoles.failure(error))
    yield put(
      showErrorToast(error || 'Something went wrong, please check your network')
    )
  }
}

function* getRoleInfoSaga({data, successAction, failureAction}) {
  try {
    const response = yield call(Api.getRoleInfo, data)
    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      yield put(globalActions.getRoleInfo.success(response?.data?.obj))
    } else throw response?.data?.msg
  } catch (error) {
    failureAction?.()
    yield put(globalActions.getRoleInfo.failure(error))
    yield put(
      showErrorToast(error || 'Something went wrong, please check your network')
    )
  }
}

function* importRoleSaga({data, successAction, failureAction}) {
  try {
    const response = yield call(Api.importRole, data)
    if (response?.data?.status) {
      yield put(showSuccessToast(alertMessages.alertRoleImported))
      successAction?.(response?.data?.obj)
      yield put(globalActions.importRole.success(response?.data?.obj))
    } else throw response?.data?.msg
  } catch (error) {
    failureAction?.()
    yield put(globalActions.importRole.failure(error))
    yield put(
      showErrorToast(error || 'Something went wrong, please check your network')
    )
  }
}

function* assignUserRoleSaga({data, successAction, failureAction}) {
  try {
    const response = yield call(Api.assignUserRole, data)
    if (response?.data?.status) {
      yield put(
        showSuccessToast(
          data?.iids?.length +
            ' ' +
            (data?.iids?.length > 1
              ? alertMessages.alertUsersAssigned
              : alertMessages.alertUserAssigned)
        )
      )
      successAction?.(response?.data?.obj)
      yield put(globalActions.assignUserRole.success(response?.data?.obj))
    } else throw response?.data?.msg
  } catch (error) {
    failureAction?.()
    yield put(globalActions.assignUserRole.failure(error))
    yield put(
      showErrorToast(error || 'Something went wrong, please check your network')
    )
  }
}

function* createCustomRoleSaga({data, successAction, failureAction}) {
  try {
    const response = yield call(Api.createCustomRole, data)
    if (response?.data?.status) {
      yield put(
        showSuccessToast(
          data?.role_id
            ? data?.name + ' ' + alertMessages.alertRoleUpdated
            : data?.name + ' ' + alertMessages.alertRoleCreated
        )
      )
      successAction?.(response?.data?.obj)
      yield put(globalActions.createCustomRole.success(response?.data?.obj))
    } else throw response?.data?.msg
  } catch (error) {
    failureAction?.()
    yield put(globalActions.createCustomRole.failure(error))
    yield put(
      showErrorToast(error || 'Something went wrong, please check your network')
    )
  }
}

function* deleteCustomRoleSaga({data, successAction, failureAction}) {
  try {
    const response = yield call(Api.deleteCustomRole, data)
    if (response?.data?.status) {
      yield put(
        showSuccessToast(data?.name + ' ' + alertMessages.alertRoleDeleted)
      )
      successAction?.(response?.data?.obj)
      yield put(globalActions.deleteCustomRole.success(response?.data?.obj))
    } else throw response?.data?.msg
  } catch (error) {
    failureAction?.()
    yield put(globalActions.deleteCustomRole.failure(error))
    yield put(
      showErrorToast(error || 'Something went wrong, please check your network')
    )
  }
}

function* getPermissionMapSaga({data, successAction, failureAction}) {
  try {
    const response = yield call(Api.getPermissionMap, data)
    if (response?.data?.status) {
      yield put(
        globalActions.getPermissionMap.success(
          successAction?.(response?.data?.obj)
        )
      )
    } else throw response?.data?.msg
  } catch (error) {
    failureAction?.()
    yield put(globalActions.getPermissionMap.failure(error))
    yield put(
      showErrorToast(error || 'Something went wrong, please check your network')
    )
  }
}

export function* watchGetAllRolesSaga() {
  yield takeEvery(globalActions.getAllRoles.REQUEST, getAllRolesSaga)
}
export function* watchGetRoleInfoSaga() {
  yield takeEvery(globalActions.getRoleInfo.REQUEST, getRoleInfoSaga)
}
export function* watchAssignUserRoleSaga() {
  yield takeEvery(globalActions.assignUserRole.REQUEST, assignUserRoleSaga)
}
export function* watchCreateCustomRoleSaga() {
  yield takeEvery(globalActions.createCustomRole.REQUEST, createCustomRoleSaga)
}
export function* watchdeleteCustomRoleSaga() {
  yield takeEvery(globalActions.deleteCustomRole.REQUEST, deleteCustomRoleSaga)
}
export function* watchImportRoleSaga() {
  yield takeEvery(globalActions.importRole.REQUEST, importRoleSaga)
}
export function* watchGetPermissionMapSaga() {
  yield takeEvery(globalActions.getPermissionMap.REQUEST, getPermissionMapSaga)
}
