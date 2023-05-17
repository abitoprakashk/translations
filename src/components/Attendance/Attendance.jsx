import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {INSTITUTE_TYPES} from '../../constants/institute.constants'
import history from '../../history'
import {checkSubscriptionType} from '../../utils/Helpers'
import {DASHBOARD} from '../../utils/SidebarItems'
import StaffAttendance from './components/StaffAttendance/StaffAttendance'
import StudentAttendance from './components/StudentAttendance/StudentAttendance'
import TeacherAttendance from './components/TeacherAttendance/TeacherAttendance'
import * as ATC from '../../constants/attendance.constants'

export default function Attendasnce({match}) {
  const {instituteInfo, currentAdminInfo} = useSelector((state) => state)
  const [selectedTab, setSelectedTab] = useState(ATC.ATTENDANCE_PAGE_TABS[0].id)
  const isPremium = checkSubscriptionType(instituteInfo)

  useEffect(() => {
    if (instituteInfo?.institute_type !== INSTITUTE_TYPES.SCHOOL)
      setSelectedTab(ATC.ATTENDANCE_PAGE_TABS[1].id)

    if (instituteInfo && !isPremium) history.push(DASHBOARD)
  }, [instituteInfo])

  useEffect(() => {
    if (match?.params?.type) {
      let res = ATC.ATTENDANCE_PAGE_TABS.find(
        (item) => item.url === match.params.type
      )
      setSelectedTab(res.id)
    }
  }, [match?.params?.type])

  const getTab = (id) => {
    switch (id) {
      case ATC.ATTENDANCE_PAGE_TABS[0].id:
        return <StudentAttendance />
      case ATC.ATTENDANCE_PAGE_TABS[1].id:
        return currentAdminInfo?.role_ids.includes('owner') ||
          currentAdminInfo?.role_ids.includes('admin') ? (
          <StaffAttendance />
        ) : null
      case ATC.ATTENDANCE_PAGE_TABS[2].id:
        return <TeacherAttendance />

      default:
        break
    }
  }

  if (selectedTab === ATC.ATTENDANCE_PAGE_TABS[1].id) {
    return getTab(selectedTab)
  }

  return <div className="p-5">{getTab(selectedTab)}</div>
}
