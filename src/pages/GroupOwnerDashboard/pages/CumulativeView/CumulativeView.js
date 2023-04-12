import React, {useCallback} from 'react'
import styles from './CumulativeView.module.css'
import {FeeWidget} from './FeeWidget/FeeWidget'
import AdmissionWidget from './AdmissionWidget/AdmissionWidget'
import StudentAttendanceWidget from './StudentAttendanceWidget/StudentAttendanceWidget'
import StaffAttendanceWidget from './StaffAttendanceWidget/StaffAttendanceWidget'
export default function CumulativeView() {
  const getCsvData = useCallback((csvData) => {
    const csvString = csvData.map((line) => line.join(',')).join('\n')
    return csvString
  }, [])

  return (
    <div className={styles.viewWrapper}>
      <FeeWidget getCsvData={getCsvData} />
      <AdmissionWidget getCsvData={getCsvData} />
      <StudentAttendanceWidget getCsvData={getCsvData} />
      <StaffAttendanceWidget getCsvData={getCsvData} />
    </div>
  )
}
