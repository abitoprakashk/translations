import {VirtualizedLazyList} from '@teachmint/common'
import {Table} from '@teachmint/krayon'
import React, {useEffect} from 'react'
import {useTranslation} from 'react-i18next'
import {useDispatch} from 'react-redux'
import globalActions from '../../../../../../redux/actions/global.actions'
import {DATE_RANGE} from '../../../../AttendanceReport.constant'
import AttendanceCardShimmer from '../../../../components/AttendanceCardShimmer/AttendanceCardShimmer'
import RetryOverlay from '../../../../components/RetryOverlay/RetryOverlay'
import useGetDateRange from '../../../../hooks/useGetDateRange'
import useIsMobile from '../../../../hooks/useIsMobile'
import useAttendanceRegisterTableData from '../../hooks/useAttendanceRegisterTableData'
import AttendanceRegisterShimmer from './AttendanceRegisterShimmer'
import StudentCard from './StudentCard/StudentCard'
import classNames from 'classnames'
import tableStyles from '../../../../styles/Table.module.css'
import styles from './AttendanceRegister.module.css'

function AttendanceRegister() {
  const {t} = useTranslation()
  const isMobile = useIsMobile()
  const dispatch = useDispatch()
  const dateRange = useGetDateRange(DATE_RANGE.DAILY)

  const {cols, rows, rowsData, error} = useAttendanceRegisterTableData()

  const getData = () => {
    dispatch(globalActions.attendanceRegister.request(dateRange))
  }

  useEffect(() => {
    dateRange && getData()
  }, [dateRange])

  const renderView = () => {
    if (error) {
      return (
        <div className={styles.errorWrapper}>
          <RetryOverlay onretry={getData} />
        </div>
      )
    }
    if (!rows) {
      return isMobile ? (
        <AttendanceCardShimmer />
      ) : (
        <AttendanceRegisterShimmer />
      )
    } else {
      return (
        <div
          className={classNames(styles.tableWrapper, tableStyles.tableWrapper)}
        >
          {isMobile ? (
            <VirtualizedLazyList
              itemCount={rows.length}
              itemSize={85}
              dynamicSize={true}
              loadMoreItems={() => {}}
              rowsData={rowsData}
              RowJSX={StudentCard}
              loadMorePlaceholder={
                <div className={`loader ${styles.loader}`} />
              }
              showLoadMorePlaceholder={false}
            />
          ) : (
            <Table
              rows={rows}
              cols={cols}
              classes={{table: `${styles.table} ${tableStyles.table}`}}
            />
          )}
        </div>
      )
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>{t('todaysAttendanceRegister')}</div>
      {renderView()}
    </div>
  )
}

export default AttendanceRegister
