import {useLayoutEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import {
  ATTENDANCE_FILTER,
  DEFAULT_MARKED_FILTER,
} from '../AttendanceReport.constant'
import useInstituteHeirarchy from '../pages/StudentWiseAttendance/hooks/useInstituteHeirarchy'

function useSetFilterToRedux({
  action,
  defaultMarkFilter,
  setAttendance,
  selectedClass,
}) {
  const dispatch = useDispatch()
  const {heirarchy, handleSelection} = useInstituteHeirarchy({
    allSelected: !selectedClass,
    selectedItem: selectedClass,
  })
  const [markFilter, setmarkFilter] = useState(
    defaultMarkFilter || DEFAULT_MARKED_FILTER
  )
  const [attendanceFilter, setAttendanceFilter] = useState(ATTENDANCE_FILTER)

  useLayoutEffect(() => {
    setData()
  }, [heirarchy, handleSelection, markFilter, setmarkFilter, attendanceFilter])

  const setData = () => {
    dispatch(
      action({
        heirarchy,
        markFilter,
        ...(setAttendance
          ? {
              attendanceFilter,
            }
          : {}),
      })
    )
  }

  return {
    heirarchy,
    handleSelection,
    markFilter,
    setmarkFilter,
    attendanceFilter,
    setAttendanceFilter,
  }
}

export default useSetFilterToRedux
