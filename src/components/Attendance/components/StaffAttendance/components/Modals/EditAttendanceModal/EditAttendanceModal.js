import {
  BUTTON_CONSTANTS,
  Modal,
  MODAL_CONSTANTS,
  PlainCard,
} from '@teachmint/krayon'
import {DateTime} from 'luxon'
import React, {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import {IS_MOBILE} from '../../../../../../../constants'
import {getStaffLeaveBalanceApi} from '../../../../../../../pages/LeaveManagement/apiService'
import {leaveLabelmap} from '../../../../../../../pages/LeaveManagement/LeaveManagement.constant'
import {getSelectedLeaveCount} from '../../../../../../../pages/LeaveManagement/redux/actions/leaveManagement.actions'
import globalActions from '../../../../../../../redux/actions/global.actions'
import {events} from '../../../../../../../utils/EventsConstants'
import Loader from '../../../../../../Common/Loader/Loader'
import {getStaffAttendance} from '../../../redux/actions/StaffAttendanceActions'
import {
  dateFromFormat,
  EDIT_ATTENDANCE_STATUS,
} from '../../../StaffAttendanceConstants'
import CardInfoBlock from './CardInfoBlock'
import EditAttendanceForm from './EditAttendanceForm'
import styles from './EditAttendanceModal.module.css'

const EditAttendanceModal = ({
  isOpen,
  onClose,
  data,
  date,
  type,
  leaveStatus,
  attendanceInfo,
}) => {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const eventManager = useSelector((state) => state.eventManager)

  const {data: userAttendaceSummary, isLoading: isUserAttendaceSummaryLoading} =
    useSelector((state) => state.globalData?.staffMonthlyAttendanceSummary)

  const {PRESENT, HALF_DAY_PRESENT, ABSENT, ARRIVE_LATE_LEFT_EARLY} =
    EDIT_ATTENDANCE_STATUS

  const [fields, setFields] = useState({
    ...data,
    date: DateTime.fromFormat(date, dateFromFormat.yyyy_LL_dd).toFormat(
      dateFromFormat.dd_LLL_yyyy
    ),
  })
  const [leaveBalance, setLeaveBalance] = useState()
  const [editLeaveSelect, setEditLeaveSelect] = useState(PRESENT)
  const [presentLeaveSelected, setPresentLeaveSelected] = useState([])
  const [isEditFormVaild, setIsEditFormVaild] = useState(false)

  const selectedLeaveCount = useSelector(
    (state) => state.leaveManagement.addLeave.selectedLeaveCount
  )
  const loading = useSelector((state) => state.leaveManagement.addLeave.loading)
  const createdLeaveData = useSelector(
    (state) => state.leaveManagement.pastLeaves.data
  )
  const selectedDateUTCTimestamp = useSelector(
    (state) => state.staffAttendance.selectedDateUTCTimestamp
  )

  useEffect(() => {
    if (data._id) {
      getStaffLeaveBalanceApi(data._id).then((res) => {
        if (res?.status) {
          setLeaveBalance(res?.obj)
        }
      })
    }
  }, [data])

  useEffect(() => {
    if (!fields.leaveSlot) return

    const createUTCfrom = DateTime.fromFormat(
      fields.date,
      dateFromFormat.dd_LLL_yyyy
    )
    const createUTCTo = DateTime.fromFormat(
      fields.date,
      dateFromFormat.dd_LLL_yyyy
    )
    const utcfrom =
      Date.UTC.apply(null, [
        createUTCfrom.year,
        createUTCfrom.month - 1,
        createUTCfrom.day,
      ]) / 1000

    const utcto =
      Date.UTC.apply(null, [
        createUTCTo.year,
        createUTCTo.month - 1,
        createUTCTo.day,
      ]) / 1000

    dispatch(
      getSelectedLeaveCount({
        from: utcfrom,
        to: utcto,
        from_slot: fields.leaveSlot,
        to_slot: fields.leaveSlot,
      })
    )
  }, [fields.leaveSlot])

  useEffect(() => {
    // Means leave has been created successfully
    if (
      createdLeaveData &&
      createdLeaveData.length &&
      createdLeaveData[0].iid === data._id
    ) {
      dispatch(
        getStaffAttendance({
          from_date: selectedDateUTCTimestamp,
          to_date: selectedDateUTCTimestamp,
          iid: data._id,
        })
      )
      onClose()
    }
  }, [createdLeaveData])

  const submitLeave = () => {
    const createUTCFrom = DateTime.fromFormat(
      fields.date,
      dateFromFormat.dd_LLL_yyyy
    )
    const from =
      Date.UTC.apply(null, [
        createUTCFrom.year,
        createUTCFrom.month - 1,
        createUTCFrom.day,
      ]) / 1000

    let presentLeaveStatusType = null
    if (presentLeaveSelected.length > 0) {
      if (presentLeaveSelected.length === 2) {
        presentLeaveStatusType = ARRIVE_LATE_LEFT_EARLY
      } else {
        presentLeaveStatusType = presentLeaveSelected[0]
      }
    }
    const payload = {
      date: from,
      iid: data?._id,
      status: editLeaveSelect,
      ...(editLeaveSelect === PRESENT &&
        presentLeaveStatusType && {status_type: presentLeaveStatusType}),
      ...(editLeaveSelect !== PRESENT &&
        fields?.leaveType && {leave_type: fields?.leaveType}),
    }

    eventManager.send_event(events.EDIT_STAFF_ATTENDANCE_SAVE_CLICKED_TFI, {
      staff_id: data?._id,
      status: editLeaveSelect,
      status_type: presentLeaveStatusType,
      leave_type: fields?.leaveType || '',
      action: 'confirm',
    })
    dispatch(globalActions?.updateStaffAttendance?.request(payload))
    onClose()
  }

  useEffect(() => {
    if (data._id) {
      const createUTCFrom = DateTime.fromFormat(
        fields.date,
        dateFromFormat.dd_LLL_yyyy
      )
      const from =
        Date.UTC.apply(null, [
          createUTCFrom.year,
          createUTCFrom.month - 1,
          createUTCFrom.day,
        ]) / 1000
      const requestParam = {
        iid: data._id,
        date: from,
      }
      dispatch(
        globalActions?.staffMonthlyAttendanceSummary?.request(requestParam)
      )
    }
  }, [])

  const {leaveType} = fields

  useEffect(() => {
    if (editLeaveSelect === HALF_DAY_PRESENT || editLeaveSelect === ABSENT) {
      setIsEditFormVaild(
        leaveType &&
          (leaveType === leaveLabelmap.UNPAID.value
            ? true
            : selectedLeaveCount <= leaveBalance?.[leaveType])
      )
    } else {
      setIsEditFormVaild(true)
    }
  }, [editLeaveSelect, presentLeaveSelected, fields])

  return (
    <Modal
      isOpen={isOpen}
      actionButtons={[
        {
          body: t('cancel'),
          onClick: () => {
            onClose()
            eventManager.send_event(events.MARK_LEAVE_CONFIRM_CLICKED_TFI, {
              staff_id: data?._id,
              action: 'cancel',
            })
          },
          type: BUTTON_CONSTANTS.TYPE.OUTLINE,
          width: IS_MOBILE
            ? BUTTON_CONSTANTS.WIDTH.FULL
            : BUTTON_CONSTANTS.WIDTH.FIT,
        },
        {
          body: t('save'),
          onClick: submitLeave,
          isDisabled: loading || !isEditFormVaild,
          width: IS_MOBILE
            ? BUTTON_CONSTANTS.WIDTH.FULL
            : BUTTON_CONSTANTS.WIDTH.FIT,
        },
      ]}
      header={t('editAttendance')}
      onClose={onClose}
      size={MODAL_CONSTANTS.SIZE.AUTO}
      classes={{modal: styles.mainModal, content: styles.content}}
    >
      <div className={styles.wrapper}>
        <PlainCard className={styles.card}>
          <Loader show={isUserAttendaceSummaryLoading} />
          <div className={styles.editAttendanceBox}>
            <CardInfoBlock
              data={data}
              type={type}
              date={date}
              attendanceInfo={attendanceInfo}
            />
            <EditAttendanceForm
              leaveStatus={leaveStatus}
              attendanceInfo={attendanceInfo}
              type={type}
              fields={fields}
              setFields={setFields}
              leaveBalance={leaveBalance}
              editLeaveSelect={editLeaveSelect}
              setEditLeaveSelect={setEditLeaveSelect}
              setPresentLeaveSelected={setPresentLeaveSelected}
              presentLeaveSelected={presentLeaveSelected}
              attendanceData={userAttendaceSummary}
            />
          </div>
        </PlainCard>
      </div>
    </Modal>
  )
}

export default EditAttendanceModal
