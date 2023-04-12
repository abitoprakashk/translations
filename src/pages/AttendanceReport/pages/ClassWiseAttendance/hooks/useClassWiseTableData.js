import {Para} from '@teachmint/krayon'
import classNames from 'classnames'
import {DateTime} from 'luxon'
import React, {useMemo} from 'react'
import {useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import {generatePath, Link, useHistory, useParams} from 'react-router-dom'
import {
  STUDENT_ATTENDANCE_REPORT_CLICK_CLASS_WISE_VIEW_DETAILS,
  STUDENT_ATTENDANCE_REPORT_CLICK_DATE_WISE_CLASS_WISE_VIEW_DETAILS,
} from '../../../AttendanceReport.events.constant'
import AttendanceReportRoutes from '../../../AttendanceReport.routes'
import AttendanceBadge from '../../../components/AttendanceBadge/AttendanceBadge'
import TableHeaderLabel from '../../../components/TableHeaderLabel/TableHeaderLabel'
import useSendEvent from '../../../hooks/useSendEvent'
import styles from './styles.module.css'
import useClassWiseData from './useClassWiseData'
const DATE_FORMAT = 'yyyy-MM-dd'
function useClassWiseTableData() {
  const {data: rowsData, setsort, sort, error, isLoading} = useClassWiseData()
  const {dateFilter} = useSelector(
    (state) => state.attendanceReportReducer.classWise
  )
  const {t} = useTranslation()
  const {date: selectedDate} = useParams()
  const history = useHistory()
  const sendEvent = useSendEvent()
  const cols = useMemo(
    () => [
      {
        key: 'class',
        label: TableHeaderLabel({
          sort,
          setsort,
          label: t('class'),
          key: 'class',
        }),
      },

      {key: 'strength', label: <Para>{t('classStrength')}</Para>, sort: null},
      {
        key: 'present',
        label: TableHeaderLabel({
          sort,
          setsort,
          label: t('studentsPresent'),
          key: 'studentsPresent',
        }),
      },
      {
        key: 'absent',
        label: TableHeaderLabel({
          sort,
          setsort,
          label: t('studentsAbsent'),
          key: 'studentsAbsent',
        }),
      },
      {
        key: 'attendance',
        label: TableHeaderLabel({
          sort,
          setsort,
          key: 'attendancePercentage',
          label: t('attendance'),
        }),
        sort: null,
      },
      {
        key: 'teacher',
        label: t('classTeacher'),
      },
      {
        key: 'details',
        label: t('detailedStatus'),
      },
    ],
    [t, rowsData, sort]
  )

  const rows = rowsData?.map((rowData) => {
    return {
      class: <span>{rowData.name}</span>,
      strength: <span>{rowData.strength || 0}</span>,
      present: <span>{rowData.P || 0}</span>,
      absent: <span>{rowData.A || 0}</span>,
      attendance: <AttendanceBadge {...rowData} />,
      teacher: !rowData.teacher ? (
        <span className={styles.teacherNotAssigned}>
          {rowData.teacher || t('notAssigned')}
        </span>
      ) : (
        <div className={classNames(styles.flex, styles.column)}>
          <span className={styles.title}>{rowData.teacher}</span>
          <span className={styles.desc}>{rowData.teacherPhoneNumber}</span>
        </div>
      ),
      ...(selectedDate
        ? {
            details: (
              <Link
                to={generatePath(
                  AttendanceReportRoutes.specificDateClassAttendance.fullPath,
                  {
                    classId: rowData.section_id,
                    date: selectedDate,
                  }
                )}
                onClick={() => {
                  sendEvent(
                    STUDENT_ATTENDANCE_REPORT_CLICK_DATE_WISE_CLASS_WISE_VIEW_DETAILS,
                    rowData
                  )
                }}
              >
                <span className={styles.highlight}>{t('viewDetails')}</span>
              </Link>
            ),
          }
        : {
            details: (
              <span
                onClick={() => {
                  history.push(
                    `${
                      AttendanceReportRoutes.classAttendance.fullPath
                    }?date=${DateTime.fromJSDate(
                      dateFilter?.meta?.startDate
                    ).toFormat(DATE_FORMAT)}`
                  )
                  history.push(
                    `${generatePath(
                      AttendanceReportRoutes.specificDateClassAttendance
                        .fullPath,
                      {
                        date: DateTime.fromJSDate(
                          dateFilter?.meta?.startDate
                        ).toFormat(DATE_FORMAT),
                        classId: rowData.section_id,
                      }
                    )}?from=${AttendanceReportRoutes.classAttendance.name}`
                  )
                  sendEvent(
                    STUDENT_ATTENDANCE_REPORT_CLICK_CLASS_WISE_VIEW_DETAILS,
                    rowData
                  )
                }}
                className={classNames(styles.highlight, styles.pointer)}
              >
                {t('viewDetails')}
              </span>
            ),
          }),
    }
  })
  return {rows, cols, error, isLoading, rowsData}
}

export default useClassWiseTableData
