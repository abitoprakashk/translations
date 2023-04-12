import {Divider} from '@teachmint/krayon'
import React, {useEffect} from 'react'
import {useTranslation} from 'react-i18next'
import {SORT_TYPE} from '../../../../pages/AttendanceReport/AttendanceReport.constant'
import {handleClassSort} from '../../../../pages/AttendanceReport/pages/Overview/utils/utils'
import WidgetShimmer from '../../WidgetShimmer/WidgetShimmer'
import styles from './AttendanceGraph.module.css'

const MarkedTable = ({tableRowsMarked, rows, error}) => {
  const {t} = useTranslation()
  const sortedTableRowData = handleClassSort({
    type: SORT_TYPE.ASC,
    data: tableRowsMarked,
    key: 'name',
  })
  const getTable = (tableRowsMarked, rows, error) => {
    if (error) {
      return (
        <div className={styles.noAttendanceMarkedError}>
          {t('couldNotLoadTryAgain')}
        </div>
      )
    }

    if (!rows && !error) {
      return <WidgetShimmer shimmerCount={5} />
    } else {
      if (tableRowsMarked?.length > 0) {
        return tableRowsMarked?.map((item) => (
          <div key={item?.id}>
            <div className={styles.tableRowClass}>{item?.name || ''}</div>
            <div className={styles.tableRowTeacher}>{`${t('classTeacher')} - ${
              item?.teacher || ''
            }`}</div>
            <Divider spacing="16px" className={styles.divider} />
          </div>
        ))
      } else {
        return (
          <div className={styles.noAttendanceMarkedText}>
            {tableRowsMarked?.length > 0
              ? t('dataNotFound')
              : t('noAttendanceMarkedToday')}
          </div>
        )
      }
    }
  }
  useEffect(() => {
    tableRowsMarked && getTable()
  }, [rows])

  return <div>{getTable(sortedTableRowData, rows, error)}</div>
}

export default MarkedTable
