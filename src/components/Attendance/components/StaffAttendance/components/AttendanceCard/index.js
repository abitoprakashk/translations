import React, {lazy, Suspense, useCallback, useMemo, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {DateTime} from 'luxon'
import {KebabMenu, PlainCard} from '@teachmint/krayon'
import {ErrorBoundary} from '@teachmint/common'
import UserInfo from '../../../../../Common/Krayon/UserInfo'
import AttendanceStateToggle from '../AttendanceStateToggle'
import FooterStatus from './FooterStatus'
import {markIndividualAttendance} from '../../redux/actions/StaffAttendanceActions'
import {
  resolveAttendanceStatus,
  resolveLeaveStatus,
  resolveFooterState,
  getAttendanceMethodHTML,
} from './utils'
import useRoleFilter from '../../../../../../hooks/useRoleFilter'
import EditAttendanceModal from '../Modals/EditAttendanceModal/EditAttendanceModal'
import {
  dateFromFormat,
  STAFF_ATTENDANCE_STATUS,
} from '../../StaffAttendanceConstants'
import {events} from '../../../../../../utils/EventsConstants'
import Permission from '../../../../../Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../../utils/permission.constants'
import styles from './styles.module.css'
import {isURLValid} from '../../commonFunctions'

const MarkLeaveModal = lazy(() => import('../Modals/MarkLeaveModal'))
const {ABSENT, PRESENT, NOT_MARKED} = STAFF_ATTENDANCE_STATUS

const AttendanceCard = React.memo(({data, date, showToggle = true}) => {
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const {name, designation, role_name, img_url, _id} = data
  const currentAdminId = useSelector(
    (state) => state.currentAdminInfo.imember_id
  )
  const attendanceInfo = useSelector((state) => state.staffAttendance.info[_id])

  const {
    leave: leaveStatus,
    status: attendanceStatus,
    status_type: attendStatusType,
  } = attendanceInfo || {}

  const [isOperatorAdmin] = useRoleFilter()
  const eventManager = useSelector((state) => state.eventManager)

  const [openMarkLeave, setMarkLeave] = useState(false)
  const [openEditAttendance, setEditAttendance] = useState(false)

  const onAttendanceToggle = useCallback(
    (status) => {
      dispatch(markIndividualAttendance(_id, status))
      let eventType = ''
      if (status === PRESENT)
        eventType = events.STAFF_ATTENDANCE_MARK_PRESENT_CLICKED_TFI

      if (status === ABSENT)
        eventType = events.STAFF_ATTENDANCE_MARK_ABSENT_CLICKED_TFI

      if (status === NOT_MARKED)
        eventType = events.STAFF_ATTENDANCE_NOT_MARKED_CLICKED_TFI

      eventManager.send_event(eventType, {staff_id: _id})
    },
    [_id, dispatch]
  )

  const leaveType = useMemo(() => {
    return resolveLeaveStatus(leaveStatus)
  }, [leaveStatus])

  const attendanceType = useMemo(() => {
    return resolveAttendanceStatus(attendanceStatus, attendStatusType)
  }, [attendanceInfo])

  const {toggle, footerStatus} = useMemo(() => {
    return resolveFooterState(leaveType, attendanceType, showToggle)
  }, [leaveType, attendanceInfo, showToggle])

  // const {REQUESTED, ON_LEAVE_FULL_DAY, PRESENT_HALF_DAY} = ATTENDANCE_LEAVE_STATUS_MAP
  // const kebab = ![REQUESTED.value,ON_LEAVE_FULL_DAY.value,PRESENT_HALF_DAY.value,].includes(leaveType)

  const threeDotsDisabled =
    isOperatorAdmin && (currentAdminId == data._id || data.roles == 'owner')

  const isURL = isURLValid(img_url)

  return (
    <PlainCard className={classNames(styles.wrapper, styles.cardWrapper)}>
      <ErrorBoundary>
        <div
          className={classNames(
            styles.cardBody,
            styles.flex,
            styles.flexRow,
            styles.spaceBetween,
            styles.mwFull
          )}
        >
          <UserInfo
            name={name}
            designation={designation || role_name}
            profilePic={isURL ? img_url : ''}
            className={classNames(styles.flexGrow, styles.mwFullWithKebab)}
          />

          {getAttendanceMethodHTML({attendanceInfo})}
          <KebabMenu
            classes={{
              wrapper: styles.kebab,
              tooltipWrapper: styles.tooltipWrapper,
              optionsWrapper: classNames(styles.optionsWrapper, {
                [styles.disabled]: threeDotsDisabled,
              }),
              option: styles.option,
              content: styles.contenWrapper,
            }}
            isVertical
            options={[
              {
                content: (
                  <Permission
                    permissionId={
                      PERMISSION_CONSTANTS.staffAttendanceController_edit_attendance_update
                    }
                  >
                    <div
                      className={classNames(styles.menuItem, {
                        // Can't apply leave for self
                        [styles.disabled]: threeDotsDisabled,
                      })}
                      onClick={() => {
                        setEditAttendance(true)
                        eventManager.send_event(events.MARK_LEAVE_CLICKED_TFI, {
                          staff_id: data._id,
                        })
                      }}
                    >
                      {t('editAttendance')}
                    </div>
                  </Permission>
                ),
                handleClick: () => {},
              },
            ]}
          />
        </div>

        <div className={styles.inTimeOutTime}>
          <div className={styles.inTimeBlock}>
            <span
              className={classNames(
                styles.inTimeOutTimeText,
                styles.textEllipsis
              )}
            >
              {`${t('inTime')}:`}
            </span>
            <span
              className={classNames(
                styles.inTimeOutTimeText2,
                styles.textEllipsis
              )}
            >
              {attendanceInfo?.checkin && attendanceInfo?.checkin !== ''
                ? DateTime.fromSeconds(
                    attendanceInfo.checkin,
                    dateFromFormat.HH_MM_SS
                  ).toFormat(dateFromFormat.hh_mm_a)
                : '--'}
            </span>
          </div>
          <div className={styles.outTimeBlock}>
            <span
              className={classNames(
                styles.inTimeOutTimeText,
                styles.textEllipsis
              )}
            >
              {`${t('outTime')}:`}
            </span>
            <span
              className={classNames(
                styles.inTimeOutTimeText2,
                styles.textEllipsis
              )}
            >
              {attendanceInfo?.checkout && attendanceInfo?.checkout !== ''
                ? DateTime.fromSeconds(
                    attendanceInfo?.checkout,
                    dateFromFormat.HH_MM_SS
                  ).toFormat(dateFromFormat.hh_mm_a)
                : '--'}
            </span>
          </div>
        </div>

        <div
          className={classNames(
            styles.cardFooter,
            styles.flex,
            styles.alignCenter,
            styles.spaceBetween
          )}
        >
          {footerStatus && (
            <FooterStatus
              type={footerStatus}
              data={attendanceInfo}
              leaveStatus={leaveStatus}
              setEditAttendance={setEditAttendance}
            />
          )}
          {toggle && (
            <AttendanceStateToggle
              onClick={onAttendanceToggle}
              selected={attendanceStatus}
            />
          )}
        </div>
      </ErrorBoundary>
      {openMarkLeave && (
        <ErrorBoundary>
          <Suspense fallback="loading...">
            <MarkLeaveModal
              isOpen
              onClose={() => setMarkLeave(false)}
              data={data}
              date={date}
            />
          </Suspense>
        </ErrorBoundary>
      )}
      {openEditAttendance && (
        <ErrorBoundary>
          <Suspense fallback="loading...">
            <EditAttendanceModal
              isOpen
              onClose={() => setEditAttendance(false)}
              data={data}
              date={date}
              type={footerStatus}
              attendanceInfo={attendanceInfo}
              leaveStatus={leaveStatus}
            />
          </Suspense>
        </ErrorBoundary>
      )}
    </PlainCard>
  )
})

AttendanceCard.displayName = 'AttendanceCard'

AttendanceCard.propTypes = {
  footer: PropTypes.node,
}

export default AttendanceCard
