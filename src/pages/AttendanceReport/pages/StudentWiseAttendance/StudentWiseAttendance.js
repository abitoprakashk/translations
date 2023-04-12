import React from 'react'
import {useTranslation} from 'react-i18next'
import {useHistory} from 'react-router-dom'
import AttendanceReportRoutes from '../../AttendanceReport.routes'
import Header from '../../components/Header/Header'
import useForceUpdate from '../../hooks/useForceUpdate'
import useIsMobile from '../../hooks/useIsMobile'
import StudentWiseTableWidget from './components/StudentWiseTableWidget/StudentWiseTableWidget'
import styles from './StudentWiseAttendance.module.css'

function StudentWiseAttendance() {
  const {t} = useTranslation()
  const {key} = useForceUpdate()
  const isMobile = useIsMobile()
  const history = useHistory()
  return (
    <div className={styles.wrapper} key={key}>
      <Header
        {...(isMobile
          ? {
              breadcrumbObj: {
                className: styles.breadcrumbObj,
              },
            }
          : {
              breadcrumbObj: {
                className: '',
                paths: [
                  {
                    label: t('reportNAnalytics'),
                    to: AttendanceReportRoutes.overview.fullPath,
                    onClick: (e) => {
                      e?.preventDefault()
                      history.push(AttendanceReportRoutes.overview.fullPath)
                    },
                  },
                  {
                    label: t('studentWiseAttendance'),
                  },
                ],
              },
            })}
        title={t('studentWiseAttendance')}
        classes={{
          divider: styles.divider,
        }}
      />
      <StudentWiseTableWidget />
    </div>
  )
}

export default StudentWiseAttendance
