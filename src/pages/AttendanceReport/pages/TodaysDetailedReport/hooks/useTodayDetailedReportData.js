import {useCallback, useLayoutEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {ATTENDANCE_FILTER, SORT_TYPE} from '../../../AttendanceReport.constant'
import {
  basicStringSort,
  handleAttendanceSort,
  handleClassSort,
  handleEnrollmentrSort,
  handleRollNumberSort,
} from '../../Overview/utils/utils'
import useInstituteAssignedStudents from '../../StudentWiseAttendance/hooks/useInstituteAssignedStudents'

function useTodayDetailedReportData() {
  const [data, setData] = useState(null)
  const [sort, setsort] = useState({
    key: 'student',
    type: SORT_TYPE.ASC,
  })
  const instituteActiveStudentList = useInstituteAssignedStudents()
  const {
    attendanceInsights: {isLoading, loaded, data: initData, error},
  } = useSelector((state) => state.globalData)

  const {
    filterData: {heirarchy, markFilter, attendanceFilter},
    tableSearch,
  } = useSelector((state) => state.attendanceReportReducer.todayAttendance)

  const getAllselectedSections = useCallback(() => {
    const allSections = []
    heirarchy?.department?.forEach((department) => {
      department.standard?.forEach((standard) => {
        standard.section?.forEach((section) => {
          if (section.isSelected) {
            allSections.push(section._id)
          }
        })
      })
    })
    return allSections
  }, [heirarchy])

  const handleSort = (data = []) => {
    if (!sort) return data
    let newData = [...data]

    if (sort.key === 'student') {
      newData = basicStringSort({
        data: data,
        key: 'full_name',
        type: sort.type,
      })
    }
    if (sort.key === 'class') {
      newData = handleClassSort({
        data: data,
        key: 'sectionName',
        type: sort.type,
      })
    } else if (sort.key === 'attendance') {
      newData = handleAttendanceSort({
        data: data,
        key: 'attendance',
        type: sort.type,
      })
    } else if (sort.key === 'rollNumber') {
      //
      newData = handleRollNumberSort({
        data: data,
        key: 'roll_number',
        type: sort.type,
      })
    } else if (sort.key === 'enrollNumber') {
      newData = handleEnrollmentrSort({
        data: data,
        key: 'enrollment_number',
        type: sort.type,
      })
    }
    return newData
  }

  useLayoutEffect(() => {
    if (initData && !instituteActiveStudentList?.length) {
      setData([])
    } else if (!instituteActiveStudentList?.length) {
      //
    } else {
      let normalisedData = []
      const attendanceFilterArray = getAttendanceArray(attendanceFilter)
      const allSections = getAllselectedSections()
      instituteActiveStudentList.map((student) => {
        let normalisedStudent = {
          ...student,
          attendance: {
            A: 0,
            P: 0,
            NM: 1,
          },
        }
        initData?.some((_student) => {
          if (student._id === _student.uid) {
            normalisedStudent = {
              ...normalisedStudent,
              attendance: {
                ..._student,
              },
            }
            return true
          }
        })
        let matched = true
        /**
         * handle section selection
         */
        if (!allSections.includes(normalisedStudent.details?.sections?.[0])) {
          matched = false
        }
        /**
         * handle search
         */
        if (
          !(
            student.name?.toUpperCase().includes(tableSearch?.toUpperCase()) ||
            student.email?.toUpperCase().includes(tableSearch?.toUpperCase()) ||
            student.phone_number
              ?.toUpperCase()
              .includes(tableSearch?.toUpperCase())
          )
        ) {
          matched = false
        }
        /**
         *  handle marked/not marked filter
         */
        if (
          markFilter?.NOT_MARKED.isSelected &&
          (normalisedStudent.attendance.P || normalisedStudent.attendance.A)
        ) {
          matched = false
        }
        if (
          initData?.length &&
          markFilter?.MARKED.isSelected &&
          !(normalisedStudent.attendance.P || normalisedStudent.attendance.A)
        ) {
          matched = false
        }
        /**
         * handle attendanceFilter
         */
        if (
          attendanceFilterArray?.length &&
          !attendanceFilterArray.includes(ATTENDANCE_FILTER.ALL.id) &&
          matched
        ) {
          //
          let _matched = false
          attendanceFilterArray.forEach((key) => {
            if (normalisedStudent.attendance[key]) {
              _matched = true
            }
          })
          matched = _matched
        }
        if (matched) {
          normalisedData.push(normalisedStudent)
        }
      })
      normalisedData = handleSort(normalisedData)
      setData(normalisedData)
    }
  }, [
    isLoading,
    loaded,
    initData,
    error,
    heirarchy,
    markFilter,
    instituteActiveStudentList,
    tableSearch,
    sort,
    attendanceFilter,
  ])
  return {
    isLoading,
    data,
    loaded: initData && instituteActiveStudentList,
    error,
    sort,
    setsort,
  }
}

const getAttendanceArray = (obj = {}) => {
  const arr = []
  Object.keys(obj).map((key) => {
    if (obj[key].isSelected) {
      arr.push(obj[key].id)
    }
  })
  return arr
}

export default useTodayDetailedReportData
