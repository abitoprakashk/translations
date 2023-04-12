import {Divider, Para} from '@teachmint/krayon'
import React from 'react'
import {useTranslation} from 'react-i18next'
import {Link} from 'react-router-dom'
import {STUDENT_ATTENDANCE_TODAY_VIEW_DETAILED_REPORTS} from '../../../../AttendanceReport.events.constant'
import AttendanceReportRoutes from '../../../../AttendanceReport.routes'
import ComponentErrorBoundary from '../../../../components/ComponentErrorBoundary/ComponentErrorBoundary'
import useSendEvent from '../../../../hooks/useSendEvent'
import TodayAttendanceChart from './components/TodayAttendanceChart/TodayAttendanceChart'
import styles from './TodayAttendance.module.css'

function TodayAttendance() {
  const {t} = useTranslation()
  const sendEvent = useSendEvent()
  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>{t('todaysAttendance')}</div>
      <div className={styles.chartWrapper}>
        <ComponentErrorBoundary>
          <TodayAttendanceChart />
        </ComponentErrorBoundary>
        <Divider classes={{wrapper: styles.divider}} />
        <div className={styles.paraWrapper}>
          <Link
            onClick={() =>
              sendEvent(STUDENT_ATTENDANCE_TODAY_VIEW_DETAILED_REPORTS)
            }
            to={AttendanceReportRoutes.todaysDetailedReport.fullPath}
          >
            <Para className={styles.highlight}>{t('viewDetailedReport')}</Para>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default TodayAttendance
