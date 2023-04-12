import React, {useEffect, useMemo, useState} from 'react'
import {
  BUTTON_CONSTANTS,
  Modal,
  MODAL_CONSTANTS,
  Para,
  PARA_CONSTANTS,
} from '@teachmint/krayon'
import {Trans, useTranslation} from 'react-i18next'

import styles from './LeaveDetailsModal.module.css'
import {useDispatch, useSelector} from 'react-redux'
import {
  fetchLeaveDetails,
  getStaffAttendance,
} from '../../redux/actions/StaffAttendanceActions'
import Loader from '../../../../../Common/Loader/Loader'
import {
  leaveLabelmap,
  leaveSlotTypeMap,
  LEAVE_BASE_TYPE,
  LEAVE_SHIFT_TYPE,
} from '../../../../../../pages/LeaveManagement/LeaveManagement.constant'
import {
  getStaffStatsApi,
  updateLeaveStatusApi,
} from '../../../../../../pages/LeaveManagement/apiService'
import {
  ATTENDANCE_LEAVE_STATUS_MAP,
  STAFF_ATTENDANCE_STATUS,
} from '../../StaffAttendanceConstants'
import {
  showErrorToast,
  showSuccessToast,
} from '../../../../../../redux/actions/commonAction'
import {resolveLeaveStatus} from '../AttendanceCard/utils'
import {IS_MOBILE} from '../../../../../../constants'
import {events} from '../../../../../../utils/EventsConstants'

const LeaveDetailsModal = React.memo(({isOpen, onClose, data}) => {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const [stats, setStats] = useState({})
  const [progress, setProgress] = useState(false)
  const {data: leaveDetails, loading} = useSelector(
    (state) => state.staffAttendance.leaveDetails
  )
  const selectedDateUTCTimestamp = useSelector(
    (state) => state.staffAttendance.selectedDateUTCTimestamp
  )
  const eventManager = useSelector((state) => state.eventManager)

  const leaveStatus = resolveLeaveStatus(data.leave)
  const {FULL_DAY} = LEAVE_SHIFT_TYPE

  useEffect(() => {
    dispatch(
      fetchLeaveDetails({
        _ids: Object.values(data.leave).map(({_id}) => _id),
        // there can be maximum 2 leave on same day (first_half leave + second_half leave)
        count: 2,
        pending: leaveStatus === ATTENDANCE_LEAVE_STATUS_MAP.REQUESTED.value,
      })
    )

    getStaffStatsApi(data.iid).then((res) => {
      if (res.status) {
        setStats(res.obj || {})
      }
    })
  }, [])

  const {
    name,
    role_name,
    rollName,
    leaveDates = {},
    from_slot,
    to_slot,
    type,
    requestedOn,
    reason,
    _id,
  } = leaveDetails || {}

  let date = ''
  if (leaveDates.from) {
    date = `${leaveDates.from} (${leaveSlotTypeMap[from_slot].label})`
    if (data?.leave && Object.keys(data?.leave).length === 2) {
      date = `${leaveDates.from} (${leaveSlotTypeMap[FULL_DAY].label})`
    }
  }
  if (leaveDates.to && leaveDates.from != leaveDates.to) {
    date = `${date} - ${leaveDates.to} (${leaveSlotTypeMap[to_slot].label})`
  }

  const leaveCount = leaveDates.count
    ? `${leaveDates.count} ${leaveDates.count > 1 ? t('days') : t('day')}`
    : '0'

  const onApprove = () => {
    setProgress(true)
    eventManager.send_event(events.APPROVE_LEAVE_CLICKED_TFI, {
      employee_name: name,
      employee_user_id: _id,
      employee_type: rollName,
      screen_name: 'attendance',
    })
    updateLeaveStatusApi({
      status: LEAVE_BASE_TYPE.APPROVED,
      request_id: _id,
    })
      .then(() => {
        dispatch(showSuccessToast('Leave Approved Successfully'))
        dispatch(
          getStaffAttendance({
            from_date: selectedDateUTCTimestamp,
            to_date: selectedDateUTCTimestamp,
            iid: data.iid,
          })
        )
        eventManager.send_event(events.LEAVE_APPROVED_TFI, {
          employee_name: name,
          employee_user_id: _id,
          employee_type: rollName,
          screen_name: 'attendance',
        })
        onClose()
      })
      .catch(() => {
        setProgress(false)
        dispatch(showErrorToast('Something went wrong'))
      })
  }

  const onReject = () => {
    setProgress(true)
    eventManager.send_event(events.REJECT_LEAVE_CLICKED_TFI, {
      employee_name: name,
      employee_user_id: _id,
      employee_type: rollName,
      screen_name: 'attendance',
    })
    updateLeaveStatusApi({
      status: LEAVE_BASE_TYPE.REJECTED,
      request_id: _id,
    })
      .then(() => {
        dispatch(showSuccessToast('Leave rejected Successfully'))
        dispatch(
          getStaffAttendance({
            from_date: selectedDateUTCTimestamp,
            to_date: selectedDateUTCTimestamp,
            iid: data.iid,
          })
        )
        eventManager.send_event(events.LEAVE_REJECTED_TFI, {
          employee_name: name,
          employee_user_id: _id,
          employee_type: rollName,
          screen_name: 'attendance',
        })
        onClose()
      })
      .catch(() => {
        setProgress(false)
        dispatch(showErrorToast('Something went wrong'))
      })
  }

  const actionButtons = useMemo(() => {
    return leaveStatus === ATTENDANCE_LEAVE_STATUS_MAP.REQUESTED.value
      ? [
          {
            body: t('reject'),
            onClick: onReject,
            type: BUTTON_CONSTANTS.TYPE.OUTLINE,
            category: BUTTON_CONSTANTS.CATEGORY.DESTRUCTIVE,
            isDisabled: progress,
            width: IS_MOBILE
              ? BUTTON_CONSTANTS.WIDTH.FULL
              : BUTTON_CONSTANTS.WIDTH.FIT,
          },
          {
            body: t('approve'),
            category: BUTTON_CONSTANTS.CATEGORY.CONSTRUCTIVE,
            onClick: onApprove,
            isDisabled: progress,
            width: IS_MOBILE
              ? BUTTON_CONSTANTS.WIDTH.FULL
              : BUTTON_CONSTANTS.WIDTH.FIT,
          },
        ]
      : []
  }, [progress, leaveStatus, onReject, onApprove])

  if (loading) return <Loader show={loading} />

  return (
    <Modal
      isOpen={isOpen}
      actionButtons={actionButtons}
      header={t('leaveDetails')}
      onClose={onClose}
      size={MODAL_CONSTANTS.SIZE.AUTO}
    >
      {loading ? (
        'loading...'
      ) : (
        <div className={styles.wrapper}>
          <div className={styles.row}>
            <div className={styles.rowItem}>
              <Para>{t('name')}</Para>
            </div>
            <div className={styles.rowItem}>
              <Para type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}>{name}</Para>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.rowItem}>
              <Para>{t('userRolesPlaceholder')}</Para>
            </div>
            <div className={styles.rowItem}>
              <Para type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}>
                {role_name || rollName}
              </Para>
            </div>
          </div>
          {leaveCount > 0 && (
            <div className={styles.row}>
              <div className={styles.rowItem}>
                <Para>{t('numberOfDays')}</Para>
              </div>
              <div className={styles.rowItem}>
                <Para type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}>
                  {leaveCount}
                </Para>
              </div>
            </div>
          )}
          {!!date && (
            <div className={styles.row}>
              <div className={styles.rowItem}>
                <Para>{t('date')}</Para>
              </div>
              <div className={styles.rowItem}>
                <Para type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}>{date}</Para>
              </div>
            </div>
          )}
          {!!type && (
            <div className={styles.row}>
              <div className={styles.rowItem}>
                <Para>{t('leaveType')}</Para>
              </div>
              <div className={styles.rowItem}>
                <Para type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}>
                  {leaveLabelmap[type]?.label}
                </Para>
              </div>
            </div>
          )}
          {stats[type]?.available && stats[type]?.available >= 0 && (
            <div className={styles.row}>
              <div className={styles.rowItem}>
                <Para>Remaining leaves</Para>
              </div>
              <div className={styles.rowItem}>
                <Para type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}>
                  {stats[type]?.available}{' '}
                  {stats[type]?.available <= 1 ? t('day') : t('days')}
                </Para>
              </div>
            </div>
          )}
          <div className={styles.row}>
            <div className={styles.rowItem}>
              <Para>
                <Trans i18nKey="requestedon">
                  Requested on {{requestedOn: ''}}
                </Trans>
              </Para>
            </div>
            <div className={styles.rowItem}>
              <Para type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}>{requestedOn}</Para>
            </div>
          </div>
          {!!reason && (
            <div className={styles.row}>
              <div className={styles.rowItem}>
                <Para>{t('reason')}</Para>
              </div>
              <div className={styles.rowItem}>
                <Para type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}>{reason}</Para>
              </div>
            </div>
          )}
          {leaveStatus === ATTENDANCE_LEAVE_STATUS_MAP.REQUESTED.value &&
            date && (
              <Para>
                {name} will be marked {STAFF_ATTENDANCE_STATUS.ABSENT} for{' '}
                {leaveCount} - {date}
              </Para>
            )}
        </div>
      )}
    </Modal>
  )
})

LeaveDetailsModal.displayName = 'LeaveDetailsModal'

export default LeaveDetailsModal
