import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {Icon} from '@teachmint/common'
import {DateTime} from 'luxon'
import DateField from '../../../../../Common/DateField/DateField'
import classNames from 'classnames'
import {
  convertTimestampToLocalTime,
  getDownloadCSV,
} from '../../../../../../utils/Helpers'
import {
  fetchStaffAttendanceDates,
  fetchStaffAttendanceDownloadReportsRequestAction,
  fetchUTCTimestamp,
  selectedTabAction,
  staffAttendanceUIManageStatesAction,
  storeStaffAttendanceSearchTerm,
} from '../../redux/actions/StaffAttendanceActions'
import {getCurrentDate, getUTCTimeStamp} from '../../commonFunctions'
import {getReportName, getSelectedMonth} from './TopSectionFiltersBar.utils'
import {events} from '../../../../../../utils/EventsConstants'
import {
  DOWNLOAD_TOOLTIP_OPTIONS,
  STAFF_ATTENDANCE_USERS_STATUS_TABS,
} from '../../StaffAttendanceConstants'
import styles from './TopSectionFiltersBar.module.css'
import Permission from '../../../../../Common/Permission/Permission'
export default function TopSectionFiltersBar() {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const [selectedDate, setSelectedDate] = useState(getCurrentDate())
  const [staffMinDate, setStaffMinDate] = useState({})
  const [downloadReportOnclickStatus, setDownloadReportOnclickStatus] =
    useState(false)
  const [hadleNavbarHelpClick, setHadleNavbarHelpClick] = useState(false)
  const {
    instituteAcademicSessionInfo,
    instituteActiveAcademicSessionId,
    eventManager,
  } = useSelector((state) => state)

  const {
    staffAttendanceDownloadReportData,
    staffAttendanceDownloadReportLoading,
    staffAttendanceDownloadReportParams: monthsCount,
  } = useSelector((state) => state.staffAttendance)

  // Set UTC DateTime Stamp
  useEffect(() => {
    dispatch(fetchStaffAttendanceDates(selectedDate))
    const getTimeStampValue = getUTCTimeStamp(selectedDate)
    dispatch(fetchUTCTimestamp(getTimeStampValue))
  }, [selectedDate])

  // Academic session wise date range set
  useEffect(() => {
    if (instituteAcademicSessionInfo && instituteActiveAcademicSessionId) {
      const activerange = {}
      instituteAcademicSessionInfo.forEach((session) => {
        if (session._id === instituteActiveAcademicSessionId) {
          activerange.from = session.start_time
        }
      })
      setStaffMinDate({
        ...staffMinDate,
        from: convertTimestampToLocalTime(activerange.from),
      })
    }
  }, [instituteAcademicSessionInfo, instituteActiveAcademicSessionId])

  // Date change value store
  const dateChangeHandler = (value) => {
    const currentDateValue = getCurrentDate()
    if (currentDateValue >= value) {
      if (staffMinDate?.from <= value) {
        setSelectedDate(value)
        eventManager.send_event(events.STAFF_ATTENDANCE_DATE_CLICKED_TFI, {
          attendance_date: value,
        })
      }
    } else {
      setSelectedDate(currentDateValue)
      eventManager.send_event(events.STAFF_ATTENDANCE_DATE_CLICKED_TFI, {
        attendance_date: currentDateValue,
      })
    }
    const text = ''
    dispatch(storeStaffAttendanceSearchTerm(text))
    setDownloadReportOnclickStatus(false)
    dispatch(selectedTabAction(STAFF_ATTENDANCE_USERS_STATUS_TABS[0].id))
    const staffAttendanceStatesChanges = {
      isShowMarkAttendance: false,
      isShowMarkAttendanceToggle: false,
      isEditMarkAttendance: false,
      isMarkAttendanceUpdateView: false,
    }
    dispatch(staffAttendanceUIManageStatesAction(staffAttendanceStatesChanges))
  }

  // Download request trigger
  const handleDownloadStaffAttendanceReports = (action) => {
    const selectedMonth = getSelectedMonth(action)
    dispatch(fetchStaffAttendanceDownloadReportsRequestAction(selectedMonth))
    setDownloadReportOnclickStatus(true)
    eventManager.send_event(
      events.DOWNLOAD_STAFF_ATTENDANCE_REPORT_CLICKED_TFI,
      {months: monthsCount}
    )
  }
  // Download report data
  useEffect(() => {
    if (
      !staffAttendanceDownloadReportLoading &&
      downloadReportOnclickStatus &&
      staffAttendanceDownloadReportData &&
      staffAttendanceDownloadReportData.csv_string
    ) {
      const fileName = getReportName(
        staffAttendanceDownloadReportData?.start_mon_year,
        staffAttendanceDownloadReportData?.end_mon_year,
        t('staffAttendanceReportForLabel')
      )
      getDownloadCSV(fileName, staffAttendanceDownloadReportData?.csv_string)
      eventManager.send_event(events.STAFF_ATTENDANCE_REPORT_DOWNLOADED_TFI, {
        months: monthsCount,
      })
      setDownloadReportOnclickStatus(false)
      setHadleNavbarHelpClick(false)
    }
  }, [
    selectedDate,
    staffAttendanceDownloadReportLoading,
    staffAttendanceDownloadReportData,
  ])

  return (
    <div className={styles.topTitleFiltersbar}>
      <div className={styles.todaysAttendanceTitle}>
        {t('attendanceOverview')}
      </div>

      <div className={styles.topfilterRightBar}>
        <div className={styles.inputCon}>
          <div className={styles.dateField}>
            <DateField
              value={selectedDate}
              handleChange={(_, value) => {
                dateChangeHandler(value)
              }}
              fieldName="selectedDate"
              max={DateTime.now().toFormat('yyyy-MM-dd')}
              min={staffMinDate?.from}
            />
          </div>
        </div>

        <div className={styles.downloadBlock}>
          <div className={styles.dropdown}>
            <div
              className={styles.dropdownIconDiv}
              onMouseEnter={() => setHadleNavbarHelpClick(true)}
              onTouchStart={() => setHadleNavbarHelpClick(true)}
            >
              <Icon
                color="primary"
                name="download"
                size="xxs"
                type="outlined"
                className={styles.downloadIcon}
              />
            </div>
            {hadleNavbarHelpClick && (
              <div className={styles.dropdownContent}>
                {DOWNLOAD_TOOLTIP_OPTIONS.map(
                  ({label, action, labelStyle, permissionId}) =>
                    permissionId ? (
                      <Permission key={label} permissionId={permissionId}>
                        <div
                          className={classNames(
                            labelStyle,
                            styles.dropdownContentItem
                          )}
                          key={label}
                          onClick={() =>
                            handleDownloadStaffAttendanceReports(action)
                          }
                        >
                          {t(label)}
                        </div>
                      </Permission>
                    ) : (
                      <div
                        className={classNames(
                          labelStyle,
                          styles.dropdownContentItem
                        )}
                        key={label}
                        onClick={() =>
                          handleDownloadStaffAttendanceReports(action)
                        }
                      >
                        {t(label)}
                      </div>
                    )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
