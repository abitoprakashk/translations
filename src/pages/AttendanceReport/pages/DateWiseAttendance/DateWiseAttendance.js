import React from 'react'
import {useTranslation} from 'react-i18next'
import {useHistory} from 'react-router-dom'
import AttendanceReportRoutes from '../../AttendanceReport.routes'
import Header from '../../components/Header/Header'
import useIsMobile from '../../hooks/useIsMobile'
import DateWiseTableWidget from './components/DateWiseTableWidget/DateWiseTableWidget'
import styles from './DateWiseAttendance.module.css'

function DateWiseAttendance() {
  const {t} = useTranslation()
  const history = useHistory()
  const isMobile = useIsMobile()
  return (
    <div className={styles.wrapper}>
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
                    label: t('dateWiseStudentAttendance'),
                  },
                ],
              },
            })}
        title={t('dateWiseStudentAttendance')}
        classes={{
          divider: styles.divider,
        }}
      />
      <DateWiseTableWidget />
    </div>
  )
}

export default DateWiseAttendance
