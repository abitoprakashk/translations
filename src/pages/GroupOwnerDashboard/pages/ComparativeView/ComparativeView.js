import React, {useCallback} from 'react'
import styles from './ComparativeView.module.css'
import {FeeWidget} from './FeeWidget/FeeWidget'
import {AdmissionWidget} from './AdmissionWidget/AdmissionWidget'
import {StudentAttendanceWidget} from './StudentAttendanceWidget/StudentAttendanceWidget'
import {StaffAttendanceWidget} from './StaffAttendanceWidget/StaffAttendanceWidget'
export default function ComparativeView() {
  const getCsvData = useCallback((csvData) => {
    const csvString = csvData.map((line) => line.join(',')).join('\n')
    return csvString
  }, [])

  const createBarChartData = useCallback(
    (selectedFilter, chartYAxis, chartStructure, label) => {
      return {
        labels: selectedFilter.length > 0 ? chartYAxis : null,
        datasets:
          selectedFilter.length > 0
            ? selectedFilter.map((filterValue) => {
                let chartData = chartStructure[filterValue]
                return chartData
              })
            : label.map((filterValue) => {
                let chartData = chartStructure[filterValue]
                return chartData
              }),
      }
    },
    []
  )

  return (
    <div className={styles.viewWrapper}>
      <FeeWidget getCsvData={getCsvData} createChartData={createBarChartData} />
      <AdmissionWidget
        getCsvData={getCsvData}
        createChartData={createBarChartData}
      />
      <StudentAttendanceWidget
        getCsvData={getCsvData}
        createChartData={createBarChartData}
      />
      <StaffAttendanceWidget
        getCsvData={getCsvData}
        createChartData={createBarChartData}
      />
    </div>
  )
}
