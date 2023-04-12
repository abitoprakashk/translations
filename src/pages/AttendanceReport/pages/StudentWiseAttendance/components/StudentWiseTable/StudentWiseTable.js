import {VirtualizedLazyList} from '@teachmint/common'
import {Table} from '@teachmint/krayon'
import React, {useCallback} from 'react'
import AttendanceCardShimmer from '../../../../components/AttendanceCardShimmer/AttendanceCardShimmer'
import NoMatchingData from '../../../../components/NoMatchingData/NoMatchingData'
import RetryOverlay from '../../../../components/RetryOverlay/RetryOverlay'
import useIsMobile from '../../../../hooks/useIsMobile'
import AttendanceRegisterShimmer from '../../../Overview/components/AttendanceRegister/AttendanceRegisterShimmer'
import useStudentWiseTableData from '../../hooks/useStudentWiseTableData'
import StudentCard from './StudentCard/StudentCard'
import classNames from 'classnames'
import tableStyles from '../../../../styles/Table.module.css'
import styles from './StudentWiseTable.module.css'
import NoData from '../../../Overview/components/AttendanceInsights/components/NoData/NoData'

function StudentWiseTable({getData}) {
  const isMobile = useIsMobile()
  const {rows, cols, loaded, error, rowsData, isLoading} =
    useStudentWiseTableData()
  const renderView = useCallback(() => {
    if (error) {
      return (
        <div className={styles.errorWrapper}>
          <RetryOverlay onretry={getData} />
        </div>
      )
    }
    if (isLoading || !rows) {
      return isMobile ? (
        <AttendanceCardShimmer />
      ) : (
        <AttendanceRegisterShimmer />
      )
    }

    if (rows && !rows?.length) {
      return <NoData />
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
              rows={rows}
              cols={cols}
              classes={{table: `${styles.table} ${tableStyles.table}`}}
            />
          )}
        </div>
      )
    }
    return <NoMatchingData />
  }, [rows, cols, loaded])

  return <div>{renderView()}</div>
}

export default StudentWiseTable
