import {call, put, takeEvery} from 'redux-saga/effects'
import {showErrorToast} from '../../../../redux/actions/commonAction'
import * as Api from '../../apiService'
import globalActions from '../../../../redux/actions/global.actions'

function* getUserRolesPermissionV2({successAction, failureAction}) {
  try {
    const response = yield call(Api.getUserPermissionsV2)
    if (response?.data?.status) {
      successAction?.(response?.data?.obj)
      yield put(globalActions.userRolePermission.success(response?.data?.obj))
    } else throw response?.data?.msg
  } catch (error) {
    failureAction?.()
    yield put(globalActions.userRolePermission.failure(error))
    yield put(
      showErrorToast(error || 'Something went wrong, please check your network')
    )
  }
}
export function* watchGetUserRolesPermissionV2Saga() {
  yield takeEvery(
    globalActions.userRolePermission.REQUEST,
    getUserRolesPermissionV2
  )
}
