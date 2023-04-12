import {call, delay, put, takeLatest} from 'redux-saga/effects'
import {showErrorToast} from '../../../redux/actions/commonAction'
import globalActions from '../../../redux/actions/global.actions'
import {
  getAllFeeCustomizationTemplatesAPI,
  getFeeCustomizationSingleTemplateDataAPI,
  getPivotTableDataAPI,
} from '../api/feeCustomization.api'
import {API_WAIT_TIME} from '../constants/feeCustomization.constants'
import {convertValueObjToArr} from '../utils/feeCustomization.state.helpers'

function* getTableData({data}) {
  try {
    const fromTime = +new Date()
    let res = yield call(getPivotTableDataAPI, data)
    const difference = +new Date() - fromTime
    if (difference < API_WAIT_TIME) {
      yield delay(API_WAIT_TIME - difference)
    }
    if (typeof res === 'string') {
      res = res.replaceAll(/NaN/g, null)
      res = JSON.parse(res)
    }
    if (res.status) {
      yield put(
        globalActions.pivotTableData.success({
          rows: res.obj.index || [],
          cols: res.obj.columns || [],
          tree: res.obj.data || [],
        })
      )
    } else {
      yield put(globalActions.pivotTableData.failure(res))
      yield put(showErrorToast(res.msg || 'Something went wrong'))
    }
  } catch (error) {
    yield put(globalActions.pivotTableData.failure({}))
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}

function* getSingleEditorTemplate({data}) {
  try {
    let res = yield call(getFeeCustomizationSingleTemplateDataAPI, data)
    if (res.status) {
      res.obj = convertValueObjToArr(res.obj)
      yield put(globalActions.templateEditor.success(res.obj))
    } else {
      yield put(globalActions.templateEditor.failure(res))
      yield put(showErrorToast(res.msg || 'Something went wrong'))
    }
  } catch (error) {
    yield put(globalActions.templateEditor.failure({}))
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}

function* getAllFeeCustomizationTemplates({data: dateRange}) {
  try {
    const res = yield call(getAllFeeCustomizationTemplatesAPI, dateRange)
    if (res.status) {
      res.obj = res.obj.map((obj) => {
        return convertValueObjToArr(obj)
      })
      yield put(globalActions.feeCustomReports.success(res.obj))
    } else {
      yield put(globalActions.feeCustomReports.failure(res))
      yield put(showErrorToast(res.msg || 'Something went wrong'))
    }
  } catch (error) {
    yield put(globalActions.feeCustomReports.failure({}))
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}

export function* watchFeeCustomizationSaga() {
  yield takeLatest(globalActions.pivotTableData.REQUEST, getTableData)
  yield takeLatest(
    globalActions.feeCustomReports.REQUEST,
    getAllFeeCustomizationTemplates
  )
  yield takeLatest(
    globalActions.templateEditor.REQUEST,
    getSingleEditorTemplate
  )
}
