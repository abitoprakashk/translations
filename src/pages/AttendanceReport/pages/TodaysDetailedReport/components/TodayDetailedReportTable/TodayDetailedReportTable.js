import {Table} from '@teachmint/krayon'
import React, {useCallback} from 'react'
import NoMatchingData from '../../../../components/NoMatchingData/NoMatchingData'
import AttendanceRegisterShimmer from '../../../Overview/components/AttendanceRegister/AttendanceRegisterShimmer'
import useTodayDetailedAttendanceTableData from '../../hooks/useTodayDetailedAttendanceTableData'
import classNames from 'classnames'
import useIsMobile from '../../../../hooks/useIsMobile'
import {VirtualizedLazyList} from '@teachmint/common'
import StudentCard from './StudentCard/StudentCard'
import AttendanceCardShimmer from '../../../../components/AttendanceCardShimmer/AttendanceCardShimmer'
import tableStyles from '../../../../styles/Table.module.css'
import styles from './TodayDetailedReportTable.module.css'
import NoData from '../../../Overview/components/AttendanceInsights/components/NoData/NoData'
import {ATTENDANCE_FILTER} from '../../../../AttendanceReport.constant'
import {useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import {AttendanceReportReducerKey} from '../../../../redux/AttendanceReportReducer'

function TodayDetailedReportTable() {
  const {rows, cols, loaded, isLoading, rowsData} =
    useTodayDetailedAttendanceTableData()
  const isMobile = useIsMobile()
  const {t} = useTranslation()
  const {
    filterData: {attendanceFilter},
  } = useSelector(
    (state) =>
      state.attendanceReportReducer[AttendanceReportReducerKey.TODAY_ATTENDANCE]
  )

  const renderView = useCallback(() => {
    if (isLoading || !rows) {
      return isMobile ? (
        <AttendanceCardShimmer />
      ) : (
        <AttendanceRegisterShimmer />
      )
    }
    if (rows && !rows?.length) {
      return (
        <NoData
          desc={
            attendanceFilter[ATTENDANCE_FILTER.ALL.id].isSelected
              ? t('attendanceNotMarkedYet')
              : t('noStudentsMatchingFilter')
          }
        />
      )
    }
    if (rows?.length) {
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
              autoSize
              virtualized
              classes={{
                thead: styles.thead,
                table: classNames(`${styles.table} ${tableStyles.table}`),
              }}
              rows={rows}
              cols={cols}
            />
          )}
        </div>
      )
    }
    return <NoMatchingData />
  }, [rows, cols, loaded])

  return <div>{renderView()}</div>
}

export default TodayDetailedReportTable
