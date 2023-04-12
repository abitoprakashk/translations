import React, {
  useState,
  memo,
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
} from 'react'
import {
  Alert,
  ALERT_CONSTANTS,
  Button,
  BUTTON_CONSTANTS,
} from '@teachmint/krayon'
import {useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
// import {events} from '../../../../../../utils/EventsConstants'
import {
  markStaffAttendanceSubmitRequestAction,
  revertMarkedIndividualAttendance,
} from '../../redux/actions/StaffAttendanceActions'
import styles from './styles.module.css'
import AttendanceUnsaveConfirmation from '../Popups/AttendanceUnsaveConfirmation'
import AttendanceConfirmModal from '../Modals/AttendanceConfirmModal'
import useAttendanceCount from '../../hooks/useAttendanceCount'
import {Prompt, useHistory} from 'react-router-dom'
import {IS_MOBILE} from '../../../../../../constants'
import {events} from '../../../../../../utils/EventsConstants'
import classNames from 'classnames'
import Permission from '../../../../../Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../../utils/permission.constants'

export const ATTENDANCE_FOOTER_ACTION = {
  SAVE: 'SAVE',
  EXIT: 'EXIT',
  CLOSE: 'CLOSE',
}

const AttendanceFooter = memo(
  forwardRef(({changes = {}}, ref) => {
    const [warning, showWarning] = useState(false)
    const [confirm, showConfirm] = useState(false)
    const [routeLocked, setRouteLocked] = useState(true)
    const [pendingRoute, setPendingRoute] = useState(null)
    const callbackRef = useRef()

    const eventManager = useSelector((state) => state.eventManager)

    useImperativeHandle(ref, () => ({
      showWarning: (callback) => {
        showWarning(true)
        callbackRef.current = callback
      },
    }))

    useEffect(() => {
      if (!warning) callbackRef.current = null
    }, [warning])

    const {t} = useTranslation()
    const dispatch = useDispatch()
    const history = useHistory()
    const selectedDateUTCTimestamp = useSelector(
      (state) => state.staffAttendance.selectedDateUTCTimestamp
    )

    const staffListData = useSelector(
      (state) => state.staffAttendance.staffListData
    )
    const attendanceInfo = useSelector((state) => state.staffAttendance.info)

    const attendanceCount = useAttendanceCount({
      staffList: staffListData,
      attendanceInfo,
    })

    return (
      <footer className={styles.footer}>
        {!IS_MOBILE && (
          <div
            className={classNames(styles.alertWrapper, styles.marginRightAuto)}
          >
            <Alert
              content={t('clickOnSaveToMarkAttendance')}
              type={ALERT_CONSTANTS.TYPE.INFO}
              hideClose
            />
          </div>
        )}
        <Permission
          permissionId={
            PERMISSION_CONSTANTS.staffAttendanceController_markAttendance_create
          }
        >
          <Button
            type={BUTTON_CONSTANTS.TYPE.OUTLINE}
            classes={{button: styles.btn}}
            onClick={() => {
              showWarning(true)
            }}
            width={
              IS_MOBILE
                ? BUTTON_CONSTANTS.WIDTH.FULL
                : BUTTON_CONSTANTS.WIDTH.FIT
            }
          >
            {t('cancel')}
          </Button>
        </Permission>

        <Permission
          permissionId={
            PERMISSION_CONSTANTS.staffAttendanceController_markAttendance_create
          }
        >
          <Button
            classes={{button: styles.btn}}
            onClick={() => {
              showConfirm(true)
              eventManager.send_event(
                events.SAVE_STAFF_ATTENDANCE_CLICKED_TFI,
                {
                  attendance_date: selectedDateUTCTimestamp,
                }
              )
            }}
            width={
              IS_MOBILE
                ? BUTTON_CONSTANTS.WIDTH.FULL
                : BUTTON_CONSTANTS.WIDTH.FIT
            }
          >
            {t('save')}
          </Button>
        </Permission>

        <AttendanceUnsaveConfirmation
          isOpen={warning}
          onSave={() => {
            dispatch(
              markStaffAttendanceSubmitRequestAction({
                date: parseInt(selectedDateUTCTimestamp),
                info: changes,
              })
            )
            eventManager.send_event(
              events.STAFF_ATTENDANCE_UNSAVED_CHANGES_POPUP_CLICKED_TFI,
              {action: 'save', attendance_date: selectedDateUTCTimestamp}
            )
            showWarning(false)
            setRouteLocked(false)
            setPendingRoute(null)
            typeof callbackRef.current === 'function' &&
              callbackRef.current(ATTENDANCE_FOOTER_ACTION.SAVE)
            if (routeLocked && pendingRoute)
              setTimeout(() => {
                history.push(pendingRoute)
              }, 0)
          }}
          onExit={() => {
            dispatch(revertMarkedIndividualAttendance())
            eventManager.send_event(
              events.STAFF_ATTENDANCE_UNSAVED_CHANGES_POPUP_CLICKED_TFI,
              {action: 'cancel', attendance_date: selectedDateUTCTimestamp}
            )
            setRouteLocked(false)
            setPendingRoute(null)
            typeof callbackRef.current === 'function' &&
              callbackRef.current(ATTENDANCE_FOOTER_ACTION.EXIT)
            if (routeLocked && pendingRoute)
              setTimeout(() => {
                history.push(pendingRoute)
              }, 0)
          }}
          onClose={() => {
            showWarning(false)
            setRouteLocked(true)
            setPendingRoute(null)
            typeof callbackRef.current === 'function' &&
              callbackRef.current(ATTENDANCE_FOOTER_ACTION.CLOSE)
          }}
        />

        <AttendanceConfirmModal
          isOpen={confirm}
          onClose={() => {
            showConfirm(false)
            eventManager.send_event(
              events.SAVE_STAFF_ATTENDANCE_POP_UP_CLICKED_TFI,
              {action: 'cancel', attendance_date: selectedDateUTCTimestamp}
            )
          }}
          onConfirm={() => {
            dispatch(
              markStaffAttendanceSubmitRequestAction({
                date: parseInt(selectedDateUTCTimestamp),
                info: changes,
              })
            )
            eventManager.send_event(
              events.SAVE_STAFF_ATTENDANCE_POP_UP_CLICKED_TFI,
              {action: 'confirm', attendance_date: selectedDateUTCTimestamp}
            )
            showConfirm(false)
          }}
          stats={attendanceCount}
        />

        <Prompt
          when={routeLocked}
          message={(location) => {
            showWarning(true)
            setPendingRoute(location.pathname)
            return false
          }}
        />
      </footer>
    )
  })
)

AttendanceFooter.displayName = 'AttendanceFooter'

export default AttendanceFooter
