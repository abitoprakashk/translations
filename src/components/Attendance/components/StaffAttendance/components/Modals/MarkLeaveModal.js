import {
  BUTTON_CONSTANTS,
  Input,
  Modal,
  MODAL_CONSTANTS,
  Para,
  PARA_CONSTANTS,
} from '@teachmint/krayon'
import classNames from 'classnames'
import {DateTime} from 'luxon'
import React, {useEffect, useState} from 'react'
import {Trans, useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import {IS_MOBILE} from '../../../../../../constants'
import {getStaffLeaveBalanceApi} from '../../../../../../pages/LeaveManagement/apiService'
import {
  leaveLabelmap,
  leaveSlotTypeMap,
} from '../../../../../../pages/LeaveManagement/LeaveManagement.constant'
import {
  createLeave,
  getSelectedLeaveCount,
} from '../../../../../../pages/LeaveManagement/redux/actions/leaveManagement.actions'
import {events} from '../../../../../../utils/EventsConstants'
import {getStaffAttendance} from '../../redux/actions/StaffAttendanceActions'

import styles from './MarkLeaveModal.module.css'
const dateFormat = 'dd LLL yyyy'

const MarkLeaveModal = ({isOpen, onClose, data, date}) => {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const eventManager = useSelector((state) => state.eventManager)

  const [fields, setFields] = useState({
    ...data,
    date: DateTime.fromFormat(date, 'yyyy-LL-dd').toFormat(dateFormat),
  })
  const [leaveBalance, setLeaveBalance] = useState()
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

    const createUTCfrom = DateTime.fromFormat(fields.date, dateFormat)
    const createUTCTo = DateTime.fromFormat(fields.date, dateFormat)
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
    // means leave has been created successfully
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
    const createUTCFrom = DateTime.fromFormat(fields.date, dateFormat)
    const createUTCTo = DateTime.fromFormat(fields.date, dateFormat)
    const from =
      Date.UTC.apply(null, [
        createUTCFrom.year,
        createUTCFrom.month - 1,
        createUTCFrom.day,
      ]) / 1000
    const to =
      Date.UTC.apply(null, [
        createUTCTo.year,
        createUTCTo.month - 1,
        createUTCTo.day,
      ]) / 1000

    const payload = {
      iid: data?._id,
      type: fields.leaveType,
      from: from,
      to: to,
      no_of_days: selectedLeaveCount,
      reason: '',
      from_slot: fields.leaveSlot,
      to_slot: fields.leaveSlot,
    }

    eventManager.send_event(events.MARK_LEAVE_CONFIRM_CLICKED_TFI, {
      staff_id: data?._id,
      leave_slot: fields.leaveSlot,
      leave_type: fields.leaveType,
      action: 'confirm',
    })

    dispatch(createLeave({...payload, screen: 'staff_attendance'}))
  }

  const {leaveType, leaveSlot} = fields
  const isValid =
    leaveType &&
    leaveSlot &&
    (leaveType === leaveLabelmap.UNPAID.value
      ? true
      : selectedLeaveCount <= leaveBalance[leaveType])

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
          body: t('confirm'),
          onClick: submitLeave,
          isDisabled: loading || !isValid,
          width: IS_MOBILE
            ? BUTTON_CONSTANTS.WIDTH.FULL
            : BUTTON_CONSTANTS.WIDTH.FIT,
        },
      ]}
      header={t('markLeave')}
      onClose={onClose}
      size={MODAL_CONSTANTS.SIZE.AUTO}
      classes={{content: styles.content}}
    >
      <div className={styles.wrapper}>
        <div className={classNames(styles.info, styles.gridItem)}>
          <Para type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}>
            {"Add leaves on staff's behalf (in case they are absent)"}
          </Para>
        </div>
        <div className={classNames(styles.gridItem)}>
          <Input
            classes={{wrapper: styles.readOnlyField}}
            fieldName="name"
            readOnly
            title="Name"
            type="text"
            value={fields.name}
          />
        </div>
        <div className={classNames(styles.gridItem)}>
          <Input
            classes={{wrapper: styles.readOnlyField}}
            fieldName="date"
            readOnly
            title="Leave date"
            type="text"
            value={fields.date}
          />
        </div>
        <div className={classNames(styles.gridItem)}>
          <Input
            fieldName="leaveSlot"
            isRequired
            onChange={(e) => {
              setFields((fields) => ({...fields, [e.fieldName]: e.value}))
            }}
            options={Object.values(leaveSlotTypeMap).map(({value, label}) => ({
              label,
              value,
            }))}
            placeholder="Select"
            showMsg
            title="Full/half day"
            type="dropdown"
            value={fields.leaveSlot}
            classes={{optionClass: styles.optionClass}}
          />
        </div>
        <div className={classNames(styles.gridItem)}>
          <Input
            fieldName="leaveType"
            isRequired
            onChange={(e) => {
              setFields((fields) => ({...fields, [e.fieldName]: e.value}))
            }}
            options={Object.values(leaveLabelmap).map(({value, label}) => ({
              label: (
                <>
                  {label}{' '}
                  {value != leaveLabelmap.UNPAID.value && (
                    <span className={styles.leaveCount}>
                      (
                      <Trans i18nKey={'remainingDaysDynamic'}>
                        {{option: leaveBalance ? leaveBalance[value] || 0 : 0}}{' '}
                        remaining
                      </Trans>
                      )
                    </span>
                  )}
                </>
              ),
              value,
            }))}
            placeholder="Select"
            showMsg
            title="Type of leave"
            type="dropdown"
            value={fields.leaveType}
            classes={{optionClass: styles.optionClass}}
          />
        </div>
      </div>
    </Modal>
  )
}

export default MarkLeaveModal
