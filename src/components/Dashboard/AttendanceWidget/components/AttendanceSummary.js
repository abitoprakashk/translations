import {Icon, ICON_CONSTANTS} from '@teachmint/krayon'
import {t} from 'i18next'
import React, {useEffect, useState} from 'react'
import {EmptyData} from '../constants'
import styles from './AttendanceGraph.module.css'

const AttendanceSummary = ({
  rowsMarked,
  rowsNotMarked,
  setShowTable,
  tableRowsMarked,
  tableRowsNotMarked,
  setTableData,
  filledData,
}) => {
  const [totalClasses, setTotalClasses] = useState([])

  useEffect(() => {
    if (filledData?.length > 0) {
      setTotalClasses([
        ...filledData?.map(
          (data) => (data?.not_marked || 0) + (data?.marked || 0)
        ),
      ])
    }
  }, [filledData])

  return (
    <div className={styles.attendanceSummaryContainer}>
      <div
        className={styles.attendanceSummaryContainerMain}
        onClick={(e) => {
          e.stopPropagation()
          setTableData({...EmptyData})
          setTableData(filledData[6])
          setShowTable(true)
        }}
      >
        <div className={styles.attendanceSummaryContainerNumber}>
          <div className={styles.attendanceSummaryContainerNumberMajor}>
            {filledData[6].marked || 0}
          </div>
          <div className={styles.attendanceSummaryContainerNumberMinor}>
            /{' '}
            {filledData[6].marked + filledData[6].not_marked ||
              rowsMarked + rowsNotMarked ||
              tableRowsMarked?.length + tableRowsNotMarked?.length ||
              Math.max(...totalClasses) ||
              0}
          </div>
        </div>
        <Icon
          color="primary"
          size={ICON_CONSTANTS.SIZES.XXX_SMALL}
          name="arrowForwardIos"
          type={ICON_CONSTANTS.TYPES.BASIC}
        />
      </div>

      <div className={styles.attendanceSummaryContainerSubheading}>
        {t('classesWithAttendanceMarked')}
      </div>
    </div>
  )
}

export default AttendanceSummary
