import {
  ButtonDropdown,
  BUTTON_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
} from '@teachmint/krayon'
import classNames from 'classnames'
import React, {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import {IS_MOBILE} from '../../../../../../constants'
import {showSuccessToast} from '../../../../../../redux/actions/commonAction'
import {events} from '../../../../../../utils/EventsConstants'
import {getDownloadCSV} from '../../../../../../utils/Helpers'
import {fetchStaffAttendanceDownloadReportsRequestAction} from '../../redux/actions/StaffAttendanceActions'
import {DOWNLOAD_TOOLTIP_OPTIONS} from '../../StaffAttendanceConstants'
import styles from './DownloadReport.module.css'
import {getReportName} from './DownloadReport.utils'

const DownloadReport = () => {
  const {t} = useTranslation()
  const dispatch = useDispatch()

  const [downloadReportOnclickStatus, setDownloadReportOnclickStatus] =
    useState(false)

  const eventManager = useSelector((state) => state.eventManager)

  const {
    staffAttendanceDownloadReportData,
    staffAttendanceDownloadReportLoading,
    staffAttendanceDownloadReportParams: duration,
    staffAttendanceSelectedDate: selectedDate,
  } = useSelector((state) => state.staffAttendance)

  // Download request trigger
  const handleDownloadStaffAttendanceReports = (action) => {
    const duration = action.value
    dispatch(fetchStaffAttendanceDownloadReportsRequestAction(duration))
    setDownloadReportOnclickStatus(true)
    eventManager.send_event(
      events.DOWNLOAD_STAFF_ATTENDANCE_REPORT_CLICKED_TFI,
      {months: duration}
    )
  }

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
      dispatch(showSuccessToast('Your report is downloaded successfully'))
      eventManager.send_event(events.STAFF_ATTENDANCE_REPORT_DOWNLOADED_TFI, {
        months: duration,
      })
      setDownloadReportOnclickStatus(false)
    }
  }, [
    selectedDate,
    staffAttendanceDownloadReportLoading,
    staffAttendanceDownloadReportData,
  ])

  return (
    <div className={styles.btnWrapper}>
      <ButtonDropdown
        buttonObj={{
          type: IS_MOBILE
            ? BUTTON_CONSTANTS.TYPE.FILLED
            : BUTTON_CONSTANTS.TYPE.OUTLINE,
          size: IS_MOBILE
            ? BUTTON_CONSTANTS.SIZE.SMALL
            : BUTTON_CONSTANTS.SIZE.MEDIUM,
          children: IS_MOBILE ? (
            <Icon
              name="download"
              type={ICON_CONSTANTS.TYPES.INVERTED}
              size={ICON_CONSTANTS.SIZES.XX_SMALL}
            />
          ) : (
            t('download')
          ),
          prefixIcon: IS_MOBILE ? null : 'download',
          suffixIcon: IS_MOBILE ? null : 'downArrow',
          classes: {
            button: classNames({
              [styles.mobileBtn]: IS_MOBILE,
            }),
          },
        }}
        handleOptionClick={(action) =>
          handleDownloadStaffAttendanceReports(action)
        }
        options={DOWNLOAD_TOOLTIP_OPTIONS.map(({label, action}) => ({
          id: action,
          label: t(label),
        }))}
        classes={{
          wrapper: classNames(styles.wrapper, {
            [styles.marginLeftAuto]: !IS_MOBILE,
          }),
          dropdownContainer: classNames(styles.dropdownContainer, {
            [styles.mobileDropdown]: IS_MOBILE,
          }),
        }}
      />
    </div>
  )
}

export default DownloadReport
