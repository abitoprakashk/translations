import {DateTime} from 'luxon'
import React, {useMemo} from 'react'
import {useTranslation} from 'react-i18next'
import {
  generatePath,
  useHistory,
  useLocation,
  useParams,
} from 'react-router-dom'
import AttendanceReportRoutes from '../../AttendanceReport.routes'
import Header from '../../components/Header/Header'
import useIsMobile from '../../hooks/useIsMobile'
import useInstituteHeirarchy from '../StudentWiseAttendance/hooks/useInstituteHeirarchy'
import TodaysDetailedReportTableWidget from './components/TodaysDetailedReportTableWidget/TodaysDetailedReportTableWidget'
import styles from './TodaysDetailedReport.module.css'

function TodaysDetailedReport() {
  const {t} = useTranslation()
  const history = useHistory()
  const isMobile = useIsMobile()
  const search = useLocation().search
  const fromPage = new URLSearchParams(search)?.get('from')
  const {date: selectedDate, classId} = useParams()
  const selectedDateObj = useMemo(() => {
    if (selectedDate) {
      const date = new Date(selectedDate)
      return Object.prototype.toString.call(date) === '[object Date]'
        ? date
        : null
    }
  }, [selectedDate])
  const {
    allSlectedSectionsDetails: {
      current: [selctedClass],
    },
  } = useInstituteHeirarchy({
    selectedItem: classId,
  })

  const handleRouteSelection = (e, route) => {
    e?.preventDefault()
    history.push(route)
  }

  const label = useMemo(
    () =>
      `${selctedClass?.standard?.replace(/class/i, '')}-${
        selctedClass?.name
      } ${t('attendance')}`,
    [selctedClass, t]
  )

  const breadCrumbData = useMemo(() => {
    if (isMobile) {
      return {
        className: styles.breadcrumbObj,
      }
    }
    // basic path
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
    // from a page
    if (fromPage === AttendanceReportRoutes.classAttendance.name) {
      breadCrumb.paths.push({
        label: t('classWiseStudentAttendance'),
        to: `${AttendanceReportRoutes.classAttendance.fullPath}?date=${selectedDate}`,
        onClick: (e) => {
          handleRouteSelection(
            e,
            `${AttendanceReportRoutes.classAttendance.fullPath}?date=${selectedDate}`
          )
        },
      })
    } else {
      // not from a page add :date and :classid breadcrumb
      if (selectedDateObj) {
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
          label: DateTime.fromJSDate(selectedDateObj).toFormat('dd LLL yyyy'),
          to: generatePath(
            AttendanceReportRoutes.specificDateAttendance.fullPath,
            {
              date: selectedDate,
            }
          ),
          onClick: (e) => {
            handleRouteSelection(
              e,
              generatePath(
                AttendanceReportRoutes.specificDateAttendance.fullPath,
                {
                  date: selectedDate,
                }
              )
            )
          },
        })
      } else {
        // no nested route
        breadCrumb.paths.push({
          label: t('todaysAttendance'),
        })
      }
    }
    if (selctedClass) {
      //
      breadCrumb.paths.push({
        label: label,
      })
    }
    return breadCrumb
  }, [isMobile, selectedDateObj, classId, selctedClass])

  return (
    <div className={styles.wrapper}>
      <Header
        breadcrumbObj={breadCrumbData}
        title={classId ? label : t('dailyAttendanceReport')}
      />
      <TodaysDetailedReportTableWidget selectedDateObj={selectedDateObj} />
    </div>
  )
}

export default TodaysDetailedReport
