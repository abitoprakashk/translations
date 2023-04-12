import {useMemo} from 'react'
import {useTranslation} from 'react-i18next'
import {generatePath, Link} from 'react-router-dom'
import {TREND_FILTER} from '../../../AttendanceReport.constant'
import AttendanceReportRoutes from '../../../AttendanceReport.routes'
import AttendanceBadge from '../../../components/AttendanceBadge/AttendanceBadge'
import TableHeaderLabel from '../../../components/TableHeaderLabel/TableHeaderLabel'
import useDateWiseData from './useDateWiseData'
import styles from '../DateWiseAttendance.module.css'
import useSendEvent from '../../../hooks/useSendEvent'
import {STUDENT_ATTENDANCE_REPORT_CLICK_DATE_WISE_VIEW_DETAILS} from '../../../AttendanceReport.events.constant'

function useDateWiseTableData() {
  const {
    data: rowsData,
    setsort,
    sort,
    error,
    isLoading,
  } = useDateWiseData(TREND_FILTER.DAILY)

  const {t} = useTranslation()
  const sendEvent = useSendEvent()

  const cols = useMemo(
    () => [
      {
        key: 'date',
        label: TableHeaderLabel({
          sort,
          setsort,
          label: t('date'),
          key: 'dateString',
        }),
      },
      {
        key: 'attendance',
        label: TableHeaderLabel({
          sort,
          setsort,
          key: 'attendancePercentage',
          label: t('instituteAttendance'),
        }),
        sort: null,
      },
      {
        key: 'markedClasses',
        label: TableHeaderLabel({
          sort,
          setsort,
          key: 'markedClasses',
          label: t('markedClasses'),
          info: t('markedClass'),
        }),
        sort: null,
      },
      {
        key: 'notMarkedClasses',
        label: TableHeaderLabel({
          sort,
          setsort,
          label: t('notMarkedClasses'),
          key: 'notMarkedClasses',
          info: t('unMarkedClass'),
        }),
      },
      {
        key: 'details',
        label: t('detailedStatus'),
      },
    ],
    [t, rowsData, sort]
  )

  const rows = rowsData?.map((rowData) => ({
    date: <span>{rowData.formattedDate}</span>,
    attendance: <AttendanceBadge {...rowData} />,
    markedClasses: <span>{rowData.marked}</span>,
    notMarkedClasses: <span>{rowData.not_marked}</span>,
    details: (
      <Link
        onClick={() =>
          sendEvent(
            STUDENT_ATTENDANCE_REPORT_CLICK_DATE_WISE_VIEW_DETAILS,
            rowData
          )
        }
        to={generatePath(
          AttendanceReportRoutes.specificDateAttendance.fullPath,
          {
            date: rowData.day,
          }
        )}
      >
        <span className={styles.highlight}>{t('viewDetails')}</span>
      </Link>
    ),
  }))
  return {rows, cols, error, isLoading, rowsData}
}

export default useDateWiseTableData
