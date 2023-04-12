import {Badges, Para} from '@teachmint/krayon'
import useAttednanceRegisterData from './useAttednanceRegisterData'
import styles from './styles/table.module.css'
import classNames from 'classnames'
import {useMemo} from 'react'
import {useTranslation} from 'react-i18next'
import TableHeaderLabel from '../../../components/TableHeaderLabel/TableHeaderLabel'
import AttendanceBadge from '../../../components/AttendanceBadge/AttendanceBadge'

function useAttendanceRegisterTableData() {
  const {
    attendanceRegisterData: rowsData,
    setsort,
    sort,
    error,
  } = useAttednanceRegisterData()

  const {t} = useTranslation()

  const cols = useMemo(
    () => [
      {
        key: 'class',
        label: TableHeaderLabel({
          sort,
          setsort,
          key: 'class',
          label: t('class'),
        }),
        sort: null,
      },
      {key: 'strength', label: <Para>{t('classStrength')}</Para>, sort: null},
      {
        key: 'status',
        label: TableHeaderLabel({
          sort,
          setsort,
          key: 'status',
          label: t('status'),
        }),
        sort: null,
      },
      {
        key: 'studentsPresent',
        label: TableHeaderLabel({
          sort,
          setsort,
          key: 'studentsPresent',
          label: t('studentsPresent'),
        }),
        sort: null,
      },
      {
        key: 'attendance',
        label: TableHeaderLabel({
          sort,
          setsort,
          key: 'attendance',
          label: t('attendance'),
        }),
        sort: null,
      },
      {key: 'teacher', label: <Para>{t('classTeacher')}</Para>, sort: null},
    ],
    [t, rowsData, sort]
  )

  const getStatus = (rowData) => {
    if (!rowData.strength) return <Badges label="-" showIcon={false} />
    return (
      <span>
        {!rowData.P && !rowData.A ? (
          <Badges
            inverted
            label={t('notMarkedSentenceCase')}
            className={styles.notMarked}
            showIcon={false}
          />
        ) : (
          <Badges
            inverted
            label={t('marked')}
            showIcon={false}
            type="success"
          />
        )}
      </span>
    )
  }
  const rows = rowsData?.map((rowData) => ({
    class: <span>{rowData.name}</span>,
    strength: <span>{rowData.strength || 0}</span>,
    status: getStatus(rowData),
    studentsPresent: <span>{rowData?.P || 0}</span>,
    attendance: <AttendanceBadge {...rowData} showDash />,
    teacher: (
      <span
        className={classNames({
          [styles.teacherNotAssigned]: !rowData.teacher,
        })}
      >
        {rowData.teacher || t('notAssigned')}
      </span>
    ),
  }))

  return {rowsData, cols, rows, error}
}

export default useAttendanceRegisterTableData
