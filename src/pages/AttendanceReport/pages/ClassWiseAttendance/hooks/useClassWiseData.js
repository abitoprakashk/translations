import {useCallback, useLayoutEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {SORT_TYPE} from '../../../AttendanceReport.constant'
import useAttednanceRegisterData from '../../Overview/hooks/useAttednanceRegisterData'
import {
  basicSort,
  handleAttendanceBadgeSort,
  handleClassSort,
  handlePercentageSort,
  handleStatusSort,
} from '../../Overview/utils/utils'

function useClassWiseData() {
  const [data, setdata] = useState(null)
  const [sort, setsort] = useState({
    key: 'class',
    type: SORT_TYPE.ASC,
  })
  const {
    attendanceRegisterData: rowsData,
    error,
    isLoading,
  } = useAttednanceRegisterData()
  const {
    filterData: {heirarchy, markFilter},
    tableSearch,
  } = useSelector((state) => state.attendanceReportReducer.classWise)

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
      //
      const noAttendance = []
      let attendance = []
      data.forEach((rowData) => {
        if (!rowData.P && !rowData.A) {
          noAttendance.push(rowData)
        } else {
          attendance.push(rowData)
        }
      })
      attendance = handlePercentageSort({
        data,
        type: sort.type,
        key: 'attendance',
      })
      newData = [...attendance, ...noAttendance]
    } else if (sort.key === 'attendancePercentage') {
      newData = handleAttendanceBadgeSort({
        data,
        key: '',
        type: sort.type,
      })
    }
    return newData
  }

  const handleSearch = (data) => {
    if (!tableSearch) return data
    return data.filter(
      (row) =>
        row.teacherPhoneNumber
          ?.toUpperCase()
          .includes(tableSearch?.toUpperCase()) ||
        row.teacher?.toUpperCase().includes(tableSearch?.toUpperCase())
    )
  }

  const handleMarkFilter = (data) => {
    return data.filter((row) => {
      if (markFilter?.NOT_MARKED?.isSelected && (row.P || row.A)) {
        return false
      }
      if (
        markFilter?.MARKED?.isSelected &&
        markFilter?.MARKED?.sliderValue < row.percentage
      ) {
        return false
      }
      return true
    })
  }

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

  const handleClassSelection = (data) => {
    const allSections = getAllselectedSections()
    return data.filter((row) => allSections.includes(row.section_id))
  }

  const addStrength = (data) => {
    return data.map((row) => {
      if (row.NM || row.A || row.P) {
        row.strength = (row.A || 0) + (row.P || 0) + (row.NM || 0)
      }
    })
  }
  useLayoutEffect(() => {
    if (rowsData?.length) {
      let normalisedData = addStrength(rowsData)
      normalisedData = handleClassSelection(rowsData)
      normalisedData = handleSearch(normalisedData)
      normalisedData = handleMarkFilter(normalisedData)
      normalisedData = handleSort(normalisedData)
      setdata(normalisedData)
    }
  }, [rowsData, setsort, sort, error, tableSearch, markFilter, heirarchy])

  return {data, setsort, sort, error, isLoading}
}

export default useClassWiseData
