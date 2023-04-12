import {DateTime} from 'luxon'
import React, {useMemo} from 'react'
import {useTranslation} from 'react-i18next'
import {useHistory, useLocation, useParams} from 'react-router-dom'
import AttendanceReportRoutes from '../../AttendanceReport.routes'
import Header from '../../components/Header/Header'
import useIsMobile from '../../hooks/useIsMobile'
import styles from './ClassWiseAttendance.module.css'
import ClassWiseTableWidget from './components/ClassWiseTableWidget/ClassWiseTableWidget'

function ClassWiseAttendance() {
  const {t} = useTranslation()
  const isMobile = useIsMobile()
  const history = useHistory()
  const search = useLocation().search
  const filterDate = new URLSearchParams(search)?.get('date')

  const {date: selectedDate} = useParams()
  const selectedDateObj = useMemo(() => {
    if (selectedDate || filterDate) {
      const date = new Date(selectedDate || filterDate)
      return Object.prototype.toString.call(date) === '[object Date]'
        ? date
        : null
    }
  }, [selectedDate || filterDate])

  const handleRouteSelection = (e, route) => {
    e?.preventDefault()
    history.push(route)
  }

  const label = useMemo(
    () =>
      `${DateTime.fromJSDate(selectedDateObj).toFormat('dd LLL yyyy')} ${t(
        'attendance'
      )}`,
    [selectedDateObj, t]
  )

  const breadCrumbData = useMemo(() => {
    if (isMobile) {
      return {
        className: styles.breadcrumbObj,
      }
    }
    let breadCrumb = {
      className: '',
      paths: [
        {
          label: t('reportNAnalytics'),
          to: AttendanceReportRoutes.overview.fullPath,
          onClick: (e) => {
            handleRouteSelection(e, AttendanceReportRoutes.overview.fullPath)
          },
        },
      ],
    }

    if (selectedDate) {
      breadCrumb.paths.push({
        label: t('dateWiseStudentAttendance'),
        to: AttendanceReportRoutes.dateAttendance.fullPath,
        onClick: (e) => {
          handleRouteSelection(
            e,
            AttendanceReportRoutes.dateAttendance.fullPath
          )
        },
      })
      breadCrumb.paths.push({
        label: label,
      })
    } else {
      breadCrumb.paths.push({
        label: t('classWiseStudentAttendance'),
      })
    }
    return breadCrumb
  }, [isMobile, selectedDate])

  return (
    <div className={styles.wrapper}>
      <Header
        breadcrumbObj={breadCrumbData}
        title={selectedDate ? label : t('classWiseStudentAttendance')}
        classes={{
          divider: styles.divider,
        }}
      />
      <ClassWiseTableWidget
        selectedDateObj={selectedDateObj}
        hideDateFilter={selectedDate}
      />
    </div>
  )
}

export default ClassWiseAttendance
