import React, {useEffect} from 'react'
import './dashboard.scss'
import {useDispatch, useSelector} from 'react-redux'
import {showErrorOccuredAction} from '../../../redux/actions/commonAction'
import {
  instituteStatsAction,
  instituteTeacherStatsAction,
} from '../../../redux/actions/instituteInfoActions'
import FullDashboard from '../FullDashboard/FullDashboard'
import {
  utilsGetInstituteStats,
  utilsGetTeacherStats,
} from '../../../routes/dashboard'
import {events} from '../../../utils/EventsConstants'
import {PERMISSION_CONSTANTS} from '../../../utils/permission.constants'
import {checkSubscriptionType} from '../../../utils/Helpers'
import globalActions from '../../../redux/actions/global.actions'

export default function Dashboard() {
  const {instituteInfo, eventManager} = useSelector((state) => state)
  const dispatch = useDispatch()
  const usersPermission = useSelector(
    (state) => state?.globalData?.userRolePermission?.data?.permission_ids
  )

  useEffect(() => {
    if (instituteInfo && instituteInfo._id && usersPermission) {
      getInstituteStats(instituteInfo._id)
      getInstituteTeachersStats(instituteInfo._id)
    }
  }, [instituteInfo, usersPermission])

  const checkPermission = (permissionId) => {
    const isPremium = checkSubscriptionType(instituteInfo)
    return usersPermission?.includes(permissionId) && isPremium ? true : false
  }

  const getInstituteStats = (instituteId) => {
    if (
      !checkPermission(PERMISSION_CONSTANTS.InstituteController_getStats_read)
    ) {
      return
    }

    utilsGetInstituteStats(instituteId)
      .then(({data}) => dispatch(instituteStatsAction(data)))
      .catch(() => dispatch(showErrorOccuredAction(true)))
  }

  const getInstituteTeachersStats = (instituteId) => {
    if (
      !checkPermission(
        PERMISSION_CONSTANTS.InstituteController_getTeacherStats_read
      )
    ) {
      return
    }
    utilsGetTeacherStats(instituteId)
      .then(({data}) => dispatch(instituteTeacherStatsAction(data)))
      .catch(() => dispatch(showErrorOccuredAction(true)))
  }

  useEffect(() => {
    dispatch(globalActions?.getDashboardPreference?.request())
    setTimeout(() => {
      eventManager.send_event(events.DASHBOARD_LOADED, {})
    }, 5500)
  }, [])

  return <FullDashboard />
}
