import React from 'react'
import TodayAttendance from './components/TodayAttendance/TodayAttendance'
import classNames from 'classnames'
import AttendanceInsights from './components/AttendanceInsights/AttendanceInsights'
import {Divider} from '@teachmint/krayon'
import AttendanceTrend from './components/AttendanceTrend/AttendanceTrend'
import DetailedReports from './components/DetailedReports/DetailedReports'
import Header from '../../components/Header/Header'
import styles from './Overview.module.css'
import AttendanceRegister from './components/AttendanceRegister/AttendanceRegister'
import {useTranslation} from 'react-i18next'
import useForceUpdate from '../../hooks/useForceUpdate'
import ComponentErrorBoundary from '../../components/ComponentErrorBoundary/ComponentErrorBoundary'

function Overview() {
  const {t} = useTranslation()
  const {forceUpdate, key} = useForceUpdate()
  return (
    <div key={key} className={styles.attendanceReportWrapper}>
      <Header
        forceUpdate={forceUpdate}
        title={t('reportStudentAttendanceTitle')}
        showBreadcrumb={false}
      />

      <ComponentErrorBoundary>
        <div className={classNames(styles.hstack)}>
          <TodayAttendance />
          <AttendanceInsights />
        </div>
      </ComponentErrorBoundary>
      <Divider />
      <ComponentErrorBoundary>
        <AttendanceTrend />
      </ComponentErrorBoundary>
      <Divider />
      <ComponentErrorBoundary>
        <DetailedReports />
      </ComponentErrorBoundary>
      <ComponentErrorBoundary>
        <AttendanceRegister />
      </ComponentErrorBoundary>
    </div>
  )
}

export default Overview
