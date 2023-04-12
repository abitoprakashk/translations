import classNames from 'classnames'
import produce from 'immer'
import React from 'react'
import {useSelector} from 'react-redux'
import {ATTENDANCE_DAY_STATS} from '../../StaffAttendanceConstants'
import AttendanceCard from '../AttendanceCard'

import styles from './styles.module.css'

const AttendanceList = ({list = [], editing = false, className}) => {
  const todayStatus = useSelector((state) => state.staffAttendance?.todayStatus)
  const selectedDate = useSelector(
    (state) => state.staffAttendance.staffAttendanceSelectedDate
  )
  const shiftList = useSelector((state) => state.globalData?.shiftList?.data)
  const staffListMapping = useSelector(
    (state) => state.globalData?.staffShiftMap?.data
  )
  const showToggle =
    editing || todayStatus === ATTENDANCE_DAY_STATS.NOT_MARKED_THIS_DAY.value

  return (
    <div className={classNames(styles.attendanceGrid, className)}>
      {list.map((data) => {
        const getShift = staffListMapping?.find((item) => item.iid === data._id)
        if (getShift) {
          const shiftData = shiftList?.find((s) => s._id === getShift.shift_id)
          if (shiftData) {
            data = produce(data, (draft) => {
              draft.shift_name = shiftData?.name || null
              return draft
            })
          }
        }
        return (
          <AttendanceCard
            key={data._id}
            data={data}
            showToggle={showToggle}
            date={selectedDate}
          />
        )
      })}
    </div>
  )
}

export default AttendanceList
