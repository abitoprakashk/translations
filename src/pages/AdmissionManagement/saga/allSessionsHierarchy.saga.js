import {t} from 'i18next'
import {call, put, takeEvery} from 'redux-saga/effects'
import globalActions from '../../../redux/actions/global.actions'
import {showErrorToast} from '../../../redux/actions/commonAction'
import * as Api from '../apis/apiService'

function* fetchAllSessionHierarchies() {
  try {
    const response = yield call(Api.fetchAllSessionHierarchies)
    if (response?.data?.status) {
      if (response?.data?.obj?.children) {
        let sessionHierarchies = {}
        response?.data?.obj?.children.forEach((session) => {
          sessionHierarchies[session.id] = session
        })
        yield put(
          globalActions.allSessionHierarchies.success(sessionHierarchies)
        )
      }
    } else throw response?.data?.msg
  } catch (error) {
    yield put(globalActions.allSessionHierarchies.failure())
    yield put(
      showErrorToast(error || t('somethingWentWrongPleaseCheckYourNetwork'))
    )
  }
}

export function* watchFetchAllSessionHierarchies() {
  yield takeEvery(
    globalActions.allSessionHierarchies.REQUEST,
    fetchAllSessionHierarchies
  )
}
