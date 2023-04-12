import {useLayoutEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {SORT_TYPE} from '../../../AttendanceReport.constant'
import useInstituteAssignedStudents from '../../StudentWiseAttendance/hooks/useInstituteAssignedStudents'
import {
  basicSort,
  handleAttendanceBadgeSort,
  handleClassSort,
  handleStatusSort,
} from '../utils/utils'
import useTeacherList from './useTeacherList'

function useAttednanceRegisterData() {
  const [attendanceRegisterData, setAttendanceRegisterData] = useState(null)
  const [sort, setsort] = useState({
    key: 'class',
    type: SORT_TYPE.ASC,
  })

  const instituteActiveStudentList = useInstituteAssignedStudents()
  const {
    attendanceRegister: {data: attendanceData, isLoading, error},
  } = useSelector((state) => state.globalData)

  const {sectionTeacherData} = useTeacherList()

  const getSectionTeacherObject = () => {
    return sectionTeacherData.reduce((a, v) => ({...a, [v.id]: v}), {})
  }

  const addStudentStrength = (sectionTeacherObjData) => {
    Object.keys(sectionTeacherObjData).map((key) => {
      if (sectionTeacherObjData[key].strength) {
        sectionTeacherObjData[key].strength = 0
      }
    })
    instituteActiveStudentList?.map((student) => {
      student.details?.sections?.map((section) => {
        if (sectionTeacherObjData[section]) {
          sectionTeacherObjData[section].strength = sectionTeacherObjData[
            section
          ].strength
            ? sectionTeacherObjData[section].strength + 1
            : 1
        }
      })
      student.details?.subjects?.map((subject) => {
        if (sectionTeacherObjData[subject]) {
          sectionTeacherObjData[subject].strength = sectionTeacherObjData[
            subject
          ].strength
            ? sectionTeacherObjData[subject].strength + 1
            : 1
        }
      })
    })
  }

  const handleSort = (data) => {
    if (!sort) return data
    let newData = data
    if (sort.key === 'class') {
      newData = handleClassSort({
        data: data,
        key: 'name',
        type: sort.type,
      })
    } else if (sort.key === 'studentsPresent') {
      newData = basicSort({data, type: sort.type, key: 'P'})
    } else if (sort.key === 'studentsAbsent') {
      newData = basicSort({data, type: sort.type, key: 'A'})
    } else if (sort.key === 'status') {
      newData = handleStatusSort({data, type: sort.type})
    } else if (sort.key === 'attendance') {
      newData = handleAttendanceBadgeSort({
        data,
        key: '',
        type: sort.type,
      })
    } else if (sort.key === 'attendancePercentage') {
      newData = basicSort({
        data: data,
        key: 'percentage',
        type: sort.type,
      })
    }
    return newData
  }

  const getAttendanceRegister = () => {
    const sectionTeacherObjData = getSectionTeacherObject()
    //add student Strength
    addStudentStrength(sectionTeacherObjData)
    //attendance data
    attendanceData.forEach((attendance) => {
      if (sectionTeacherObjData[attendance.section_id]) {
        sectionTeacherObjData[attendance.section_id] = {
          ...sectionTeacherObjData[attendance.section_id],
          ...attendance,
          ...(attendance
            ? {
                percentage: Math.round(
                  (attendance.P /
                    (attendance.P + attendance.A + attendance.NM)) *
                    100
                ),
              }
            : {}),
        }
      }
    })
    //sort
    let sectionTeacherDataArray = Object.values(sectionTeacherObjData)
    sectionTeacherDataArray = handleSort(sectionTeacherDataArray)

    setAttendanceRegisterData(sectionTeacherDataArray)
  }
  useLayoutEffect(() => {
    if (!sectionTeacherData || !attendanceData) return

    getAttendanceRegister()
  }, [
    sectionTeacherData,
    attendanceData,
    sort,
    isLoading,
    error,
    instituteActiveStudentList,
  ])

  return {
    attendanceRegisterData,
    setAttendanceRegisterData,
    setsort,
    sort,
    isLoading,
    error,
  }
}

export default useAttednanceRegisterData
