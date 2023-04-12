import {Button, Icon} from '@teachmint/common'
import classNames from 'classnames'
import React, {Fragment, useEffect} from 'react'
import {useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import {getReportName} from '../../../../components/Attendance/components/StaffAttendance/components/TopSectionFiltersBar/TopSectionFiltersBar.utils'
import Loader from '../../../../components/Common/Loader/Loader'
import {IS_MOBILE} from '../../../../constants'
import Permission from '../../../../components/Common/Permission/Permission'
import {showSuccessToast} from '../../../../redux/actions/commonAction'
import {events} from '../../../../utils/EventsConstants'
import {getDownloadCSV} from '../../../../utils/Helpers'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'
import {DOWNLOAD_REPORT_DURATIONS} from '../../LeaveManagement.constant'
import {
  downloadLeaveBalanceReport,
  resetLeaveBalanceReport,
  showAddLeavePopup,
  showRequestLeavePopup,
} from '../../redux/actions/leaveManagement.actions'

import styles from './styles.module.css'

export const RequestLeaveButton = ({
  label,
  className,
  eventData = {},
  onClick,
  ...rest
}) => {
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const eventManager = useSelector((state) => state.eventManager)
  const currentAdminInfo = useSelector((state) => state.currentAdminInfo)

  return (
    <Button
      onClick={() => {
        dispatch(showRequestLeavePopup({staff: currentAdminInfo}))
        eventManager.send_event(events.REQUEST_LEAVE_FOR_SELF_CLICKED_TFI, {
          screen: 'DASHBOARD',
          ...eventData,
        })
        onClick ? onClick(currentAdminInfo) : null
      }}
      className={classNames(styles.btn, className)}
      size="medium"
      {...rest}
    >
      <Icon color="inverted" name="day" size="xs" type="outlined" />
      <span className={styles.btnText}>{label || t('requestLeave')}</span>
    </Button>
  )
}

export const CreateLeaveButton = ({
  label,
  className,
  eventData = {},
  iconColor = 'inverted',
  staff = null,
  onClick,
  ...rest
}) => {
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const eventManager = useSelector((state) => state.eventManager)

  return (
    <Permission
      permissionId={
        PERMISSION_CONSTANTS.adminLeaveController_createRoute_create
      }
    >
      <Button
        onClick={() => {
          dispatch(showAddLeavePopup({staff}))
          eventManager.send_event(events.ADD_LEAVE_FOR_EMPLOYEE_CLICKED_TFI, {
            screen: 'DASHBOARD',
            ...eventData,
          })
          onClick ? onClick(staff) : null
        }}
        className={classNames(styles.btn, className)}
        size="medium"
        {...rest}
      >
        <Icon color={iconColor} name="day" size="xs" type="outlined" />
        <span className={styles.btnText}>{label || t('addLeave')}</span>
      </Button>
    </Permission>
  )
}

export const DownloadReportButton = ({label, className, ...rest}) => {
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const eventManager = useSelector((state) => state.eventManager)

  const {loading, data, duration} = useSelector(
    (state) => state.leaveManagement.report
  )

  useEffect(() => {
    if (data?.csv_string) {
      const fileName = getReportName(
        data?.start_mon_year,
        data?.end_mon_year,
        t('leaveReportFor')
      )
      getDownloadCSV(fileName, data?.csv_string)
      dispatch(showSuccessToast('Your report is downloaded successfully'))
      eventManager.send_event(events.LEAVE_DATA_DOWNLOAD_COMPLETED_TFI, {
        leave_data_duration: duration.toLowerCase(),
      })
    }

    return () => dispatch(resetLeaveBalanceReport())
  }, [data])

  return (
    <Button
      className={classNames(styles.btn, styles.downloadBtn, className)}
      size="medium"
      type="border"
      disabled={loading}
      {...rest}
    >
      <Loader show={loading} />
      <Icon color="primary" name="download" size="xs" type="outlined" />
      {!IS_MOBILE && (
        <span className={styles.btnText}>{label || t('download')}</span>
      )}
      <Icon color="primary" name="downArrow" size="xs" />
      <div className={styles.dropdown}>
        {Object.values(DOWNLOAD_REPORT_DURATIONS).map(
          ({value, label, permissionId}, index) => (
            <Fragment key={value}>
              {index != 0 && <hr className={styles.divider} />}
              {permissionId ? (
                <Permission permissionId={permissionId}>
                  <div
                    onClick={() => {
                      dispatch(downloadLeaveBalanceReport({duration: value}))
                      eventManager.send_event(
                        events.DOWNLOAD_LEAVE_DATA_CLICKED_TFI
                      )
                    }}
                    className={classNames(styles.dropdownItem, {
                      [styles.active]: value === duration,
                    })}
                  >
                    {label}
                  </div>
                </Permission>
              ) : (
                <div
                  onClick={() => {
                    dispatch(downloadLeaveBalanceReport({duration: value}))
                    eventManager.send_event(
                      events.DOWNLOAD_LEAVE_DATA_CLICKED_TFI
                    )
                  }}
                  className={classNames(styles.dropdownItem, {
                    [styles.active]: value === duration,
                  })}
                >
                  {label}
                </div>
              )}
            </Fragment>
          )
        )}
      </div>
    </Button>
  )
}
