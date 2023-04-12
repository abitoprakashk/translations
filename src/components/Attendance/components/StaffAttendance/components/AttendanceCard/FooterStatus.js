import React, {useMemo, useState} from 'react'
import {useSelector} from 'react-redux'
import {
  Badges,
  BADGES_CONSTANTS,
  Button,
  BUTTON_CONSTANTS,
} from '@teachmint/krayon'
import styles from './styles.module.css'
import {
  ATTENDANCE_LEAVE_STATUS_MAP,
  viewAttendanceStatus,
} from '../../StaffAttendanceConstants'
import {useTranslation} from 'react-i18next'
import LeaveDetailsModal from '../Modals/LeaveDetailsModal'
import {LEAVE_BASE_TYPE} from '../../../../../../pages/LeaveManagement/LeaveManagement.constant'
import {events} from '../../../../../../utils/EventsConstants'
import Permission from '../../../../../Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../../utils/permission.constants'

const FooterStatus = ({type, data, leaveStatus = {}, setEditAttendance}) => {
  const [showModal, setShowModal] = useState(false)
  const {t} = useTranslation()
  const eventManager = useSelector((state) => state.eventManager)

  const pendingLeavesCount = useMemo(() => {
    if (!leaveStatus) return 0

    return Object.values(leaveStatus).reduce((acc, curr) => {
      if (curr.status === LEAVE_BASE_TYPE.REQUESTED) acc++
      return acc
    }, 0)
  }, [leaveStatus])

  const viewDetailsHTML = viewAttendanceStatus.includes(type) ? (
    <Button
      type={BUTTON_CONSTANTS.TYPE.TEXT}
      classes={{button: styles.viewDetails}}
      onClick={() => {
        setShowModal(true)
        eventManager.send_event(events.STAFF_LEAVE_DETAILS_VIEW_CLICKED_TFI, {
          staff_id: data._id,
        })
      }}
    >
      {t('viewDetails')}
    </Button>
  ) : null

  const getRenderHTML = () => {
    let newHTML = viewDetailsHTML
    if (leaveStatus && Object.keys(leaveStatus)?.length === 0) {
      if (type === ATTENDANCE_LEAVE_STATUS_MAP.ABSENT.value) {
        newHTML = (
          <Permission
            permissionId={
              PERMISSION_CONSTANTS.staffAttendanceController_edit_attendance_update
            }
          >
            <div
              className={styles.footerLeaveLabel}
              onClick={() => {
                setEditAttendance(true)
                eventManager.send_event(events.MARK_LEAVE_CLICKED_TFI, {
                  staff_id: data._id,
                })
              }}
            >
              {t('markLeave')}
            </div>
          </Permission>
        )
      } else if (type === ATTENDANCE_LEAVE_STATUS_MAP.PRESENT_HALF_DAY.value) {
        newHTML = (
          <Permission
            permissionId={
              PERMISSION_CONSTANTS.staffAttendanceController_edit_attendance_update
            }
          >
            <div
              className={styles.footerLeaveLabel}
              onClick={() => {
                setEditAttendance(true)
                eventManager.send_event(events.MARK_LEAVE_CLICKED_TFI, {
                  staff_id: data._id,
                })
              }}
            >
              {t('markHalfDayLeave')}
            </div>
          </Permission>
        )
      }
    }
    return newHTML
  }

  return (
    <>
      <Badges
        size={BADGES_CONSTANTS.SIZE.SMALL}
        label={`${t(ATTENDANCE_LEAVE_STATUS_MAP[type].label)}${
          pendingLeavesCount == 2 ? ` (${pendingLeavesCount})` : ''
        }`}
        type={ATTENDANCE_LEAVE_STATUS_MAP[type].type}
        showIcon={false}
      />
      {getRenderHTML()}
      {showModal && (
        <LeaveDetailsModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          data={data}
        />
      )}
    </>
  )
}

export default FooterStatus
