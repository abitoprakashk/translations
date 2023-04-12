import classNames from 'classnames'
import React, {useMemo} from 'react'
import useTodayDetailedReportData from './useTodayDetailedReportData'
import styles from '../components/TodayDetailedReportTable/TodayDetailedReportTable.module.css'
import {useTranslation} from 'react-i18next'
import TableHeaderLabel from '../../../components/TableHeaderLabel/TableHeaderLabel'
import SingleAttendanceBadge from '../../../components/SingleAttendanceBadge/SingleAttendanceBadge'

function useTodayDetailedAttendanceTableData() {
  const {
    data: rowsData,
    loaded,
    sort,
    setsort,
    isLoading,
  } = useTodayDetailedReportData()
  const {t} = useTranslation()

  const cols = useMemo(
    () => [
      {
        key: 'student',
        label: TableHeaderLabel({
          sort,
          setsort,
          label: t('studentDetails'),
          key: 'student',
        }),
      },
      {
        key: 'class',
        label: TableHeaderLabel({
          sort,
          setsort,
          label: t('class'),
          key: 'class',
        }),
      },
      {
        key: 'rollNumber',
        label: TableHeaderLabel({
          sort,
          setsort,
          label: t('rollNumber'),
          key: 'rollNumber',
        }),
      },
      {
        key: 'enrollNumber',
        label: TableHeaderLabel({
          sort,
          setsort,
          label: t('enrollNumber'),
          key: 'enrollNumber',
        }),
      },
      {
        key: 'attendance',
        label: TableHeaderLabel({
          sort,
          setsort,
          label: t('attendance'),
          key: 'attendance',
        }),
      },
    ],
    [t, sort, rowsData]
  )

  const rows = rowsData?.map((rowData) => ({
    student: (
      <div className={classNames(styles.flex, styles.column)}>
        <span className={styles.title}>{rowData.full_name}</span>
        <span className={styles.desc}>{rowData.phone_number}</span>
      </div>
    ),
    class: <span>{rowData.sectionName}</span>,
    rollNumber: <span>{rowData.roll_number || '-'}</span>,
    enrollNumber: <span>{rowData.enrollment_number || '-'}</span>,
    present: <span>{rowData?.attendance?.P}</span>,
    attendance: <SingleAttendanceBadge {...rowData.attendance} />,
  }))

  return {rows, cols, loaded, isLoading, rowsData}
}

export default useTodayDetailedAttendanceTableData
