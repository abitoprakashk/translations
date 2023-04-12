import {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import globalActions from '../../redux/actions/global.actions'
import {call, put, takeEvery} from 'redux-saga/effects'
import {REACT_APP_API_URL} from '../../constants'
import axios from 'axios'
import {showErrorToast} from '../../redux/actions/commonAction'
import {t} from 'i18next'

function* getStaffList(payload) {
  try {
    const res = yield call(getInstituteStaffList, payload?.data)
    const {status} = res
    if (status == true) {
      yield put(globalActions.instituteStaffList.success(res?.obj))
    } else {
      yield put(
        globalActions.instituteStaffList.failure(t('fetchPostsListErrorToast'))
      )
      yield put(showErrorToast(t('fetchPostsListErrorToast')))
    }
  } catch (e) {
    globalActions.instituteStaffList.failure(t('fetchPostsListErrorToast'))
    yield put(showErrorToast(t('fetchPostsListErrorToast')))
  }
}

export function* watchStaffListSaga() {
  yield takeEvery(globalActions.instituteStaffList.REQUEST, getStaffList)
}

const getInstituteStaffList = async () => {
  // based on event_type
  const res = await axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}institute-admin/staff?include_left=true`,
  })
  return res.data
}

const useStaffListHook = () => {
  const [staffList, setStaffList] = useState({
    activeStaffList: [],
    staffList: [],
  })
  const dispatch = useDispatch()
  const staff = useSelector((store) => store.globalData.instituteStaffList)

  useEffect(() => {
    dispatch(globalActions?.instituteStaffList.request())
  }, [])

  useEffect(() => {
    if (staff?.data && staff?.data?.length)
      setStaffList({
        activeStaffList: staff.data.filter(
          (item) => item.verification_status != 4
        ),
        staffList: staff.data,
      })
  }, [staff.data])

  return {
    ...staffList,
    reloadList: () => dispatch(globalActions?.instituteStaffList.request()),
  }
}

export default useStaffListHook
