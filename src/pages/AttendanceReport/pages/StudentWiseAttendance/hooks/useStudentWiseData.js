import {useCallback, useLayoutEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {SORT_TYPE} from '../../../AttendanceReport.constant'
import {
  basicSort,
  basicStringSort,
  handleAttendanceBadgeSort,
  handleClassSort,
  handleEnrollmentrSort,
  handleRollNumberSort,
} from '../../Overview/utils/utils'
import useInstituteAssignedStudents from './useInstituteAssignedStudents'

function useStudentWiseData() {
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
    filterData: {heirarchy, markFilter},
    tableSearch,
  } = useSelector((state) => state.attendanceReportReducer.studentWise)

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

  const handleSort = (data) => {
    if (!sort) return data
    let newData = data
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
    } else if (sort.key === 'present') {
      newData = basicSort({
        data: data,
        key: 'attendance.P',
        type: sort.type,
      })
    } else if (sort.key === 'attendance') {
      newData = handleAttendanceBadgeSort({
        data: data,
        key: 'attendance',
        type: sort.type,
      })
    } else if (sort.key === 'rollNumber') {
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
    } else if (!initData || !instituteActiveStudentList?.length) {
      // return false
    } else {
      let normalisedData = []

      const allSections = getAllselectedSections()
      instituteActiveStudentList.map((student) => {
        let normalisedStudent = student
        initData?.some((_student) => {
          /**
           * handle search
           */
          if (
            student._id === _student.uid &&
            allSections.includes(normalisedStudent.details?.sections?.[0]) &&
            (student.name?.toUpperCase().includes(tableSearch?.toUpperCase()) ||
              student.phone_number
                ?.toUpperCase()
                .includes(tableSearch?.toUpperCase()) ||
              student.email?.toUpperCase().includes(tableSearch?.toUpperCase()))
          ) {
            const percentage = Math.round(
              (_student.P / (_student.P + _student.A + _student.NM)) * 100
            )
            /**
             *  handle marked/not marked filter
             */
            if (
              markFilter?.NOT_MARKED?.isSelected &&
              (_student.P || _student.A)
            ) {
              return false
            }
            if (
              markFilter?.MARKED?.isSelected &&
              markFilter?.MARKED?.sliderValue < percentage
            ) {
              return false
            }

            normalisedStudent = {
              ...normalisedStudent,
              attendance: {
                ..._student,
                percentage,
              },
            }

            normalisedData.push(normalisedStudent)
            return true
          }
        })
      })
      //sort
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
    getAllselectedSections,
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

export default useStudentWiseData
