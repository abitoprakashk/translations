import {useLayoutEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import useInstituteAssignedStudents from '../../StudentWiseAttendance/hooks/useInstituteAssignedStudents'

function useAttendanceInsightData() {
  const {
    attendanceInsights: {isLoading, loaded, data: initData, error},
  } = useSelector((state) => state.globalData)
  const instituteActiveStudentList = useInstituteAssignedStudents()
  const [data, setData] = useState(null)

  useLayoutEffect(() => {
    if (initData && instituteActiveStudentList?.length) {
      const normalisedData = {}

      const activeStudents = initData?.filter((student) => {
        return instituteActiveStudentList?.some(
          (_stud) => _stud._id === student.uid
        )
      })
      activeStudents?.forEach(({A: absent, NM: notMarked, P: present}) => {
        const percentage =
          Math.round((present / (absent + notMarked + present)) * 100) || 0
        if (percentage < 100) {
          for (let i = percentage; i <= 100; i++) {
            normalisedData[i] = normalisedData[i] ? ++normalisedData[i] : 1
          }
        }
      })
      setData(normalisedData)
    }
  }, [isLoading, loaded, initData, error, instituteActiveStudentList])

  return {isLoading, data, loaded, error}
}

export default useAttendanceInsightData
