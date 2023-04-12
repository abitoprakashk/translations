import React, {useMemo} from 'react'
import useStudentWiseData from './useStudentWiseData'
import classNames from 'classnames'
import {useTranslation} from 'react-i18next'
import TableHeaderLabel from '../../../components/TableHeaderLabel/TableHeaderLabel'
import styles from '../components/StudentWiseTableWidget/StudentWiseTableWidget.module.css'
import AttendanceBadge from '../../../components/AttendanceBadge/AttendanceBadge'
function useStudentWiseTableData() {
  const {
    data: rowsData,
    loaded,
    error,
    sort,
    setsort,
    isLoading,
  } = useStudentWiseData()

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
        key: 'present',
        label: TableHeaderLabel({
          sort,
          setsort,
          label: t('presentDays'),
          key: 'present',
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
    [t, rowsData, sort]
  )

  const rows = rowsData?.map((rowData) => ({
    student: (
      <div className={classNames(styles.flex, styles.column)}>
        <span className={styles.title}>{rowData.full_name}</span>
        <span className={styles.desc}>
          {rowData.phone_number || rowData.email}
        </span>
      </div>
    ),
    class: <span>{rowData.sectionName}</span>,
    rollNumber: <span>{rowData.roll_number || '-'}</span>,
    enrollNumber: <span>{rowData.enrollment_number || '-'}</span>,
    present: <span>{rowData?.attendance?.P}</span>,
    attendance: <AttendanceBadge {...rowData.attendance} />,
  }))

  return {rows, cols, loaded, error, rowsData, isLoading}
}

export default useStudentWiseTableData
