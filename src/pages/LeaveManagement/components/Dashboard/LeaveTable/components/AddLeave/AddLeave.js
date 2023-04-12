import React, {useEffect, useRef, useState} from 'react'
import {Slider} from '@teachmint/common'
import {useDispatch, useSelector} from 'react-redux'
import {
  getSelectedLeaveCount,
  getStaffLeaveBalance,
  hideAddLeavePopup,
  requestLeave,
  createLeave,
  editLeave,
} from '../../../../../redux/actions/leaveManagement.actions'
import {getRoleNames} from '../../../../../LeaveManagement.utils'
import {DateTime} from 'luxon'
import {convertTimestampToLocalTime} from '../../../../../../../utils/Helpers'
import classNames from 'classnames'
import styles from './AddLeave.module.css'
import {events} from '../../../../../../../utils/EventsConstants'
import {Trans, useTranslation} from 'react-i18next'
import AddLeaveForm from './AddLeaveForm'
import {
  leaveSlotTypeMap,
  LEAVE_SHIFT_TYPE,
} from '../../../../../LeaveManagement.constant'
import userDefaultIcon from '../../../../../../../assets/images/icons/user-profile.svg'

const SLOT_BASE_STATE = Object.values(leaveSlotTypeMap).map((item) => ({
  ...item,
  disabled: false,
}))

const nameSortComparision = (a, b) => {
  let stra = a.name?.toLowerCase()
  let strb = b.name?.toLowerCase()
  if (stra < strb) return -1
  if (stra > strb) return 1
  return 0
}

function AddLeave() {
  const [searchResults, setSearchResults] = useState(null) // populate search results
  const [leaveType, setLeaveType] = useState({
    options: [],
    selected: null,
  }) // populate select box
  const [normalizedStaffList, setnormalizedStaffList] = useState([])
  const [selectedStaffState, setselectedStaffState] = useState(null) // selected staff in select box
  const [dateRange, setDateRange] = useState({
    from: DateTime.now().toFormat('yyyy-LL-dd'),
    to: DateTime.now().toFormat('yyyy-LL-dd'),
    selectedFrom: null,
    selectedTo: null,
    fromSlot: null,
    toSlot: null,
  })
  const [reason, setReason] = useState('')
  const [error, seterror] = useState('')
  const [fromSlotOptions, setFromSlotOptions] = useState(SLOT_BASE_STATE)
  const [toSlotOptions, setToSlotOptions] = useState(SLOT_BASE_STATE)
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const formRef = useRef(null)
  const firstRender = useRef(true)

  const setdateRange = (...args) => {
    setDateRange(...args)
  }

  const {
    showAddLeavePopup,
    staffList,
    selectedStaffBalance,
    request,
    edit,
    leaveData,
    loading,
    selectedLeaveCount,
    selectedStaff,
    apiErrorMsg,
  } = useSelector((state) => state.leaveManagement.addLeave)
  const {
    rolesList,
    instituteAcademicSessionInfo,
    instituteActiveAcademicSessionId,
    eventManager,
  } = useSelector((state) => state)

  const currentUserId = useSelector((state) => state.currentAdminInfo?.user_id)
  const currentUserIId = useSelector(
    (state) => state.currentAdminInfo?.imember_id
  )

  useEffect(() => {
    if (edit && leaveData) {
      const {reason, from, from_slot, to, to_slot, type} = leaveData
      setReason(reason)
      setdateRange((dateRange) => ({
        ...dateRange,
        selectedFrom: DateTime.fromMillis(from).toFormat('yyyy-LL-dd'),
        selectedTo: DateTime.fromMillis(to).toFormat('yyyy-LL-dd'),
        fromSlot: from_slot,
        toSlot: to_slot,
      }))
      setLeaveType((leaveType) => ({...leaveType, selected: type}))
    }
  }, [edit, leaveData])

  useEffect(() => {
    if (!formRef) return
    const HTMLcollection = formRef.current?.getElementsByTagName('input')
    if (!HTMLcollection) return
    const input = HTMLcollection[0]
    input?.setAttribute('autocomplete', 'off')
  }, [formRef])

  useEffect(() => {
    if (staffList) {
      setnormalizedStaffList(
        staffList
          // remove current user from list
          .filter(({user_id}) => user_id != currentUserId)
          .map((staff) => {
            let rollName = staff.role_name
            if (!rollName) {
              rollName = getRoleNames(
                staff.roles,
                staff.roles_to_assign,
                rolesList
              )
            }
            return {
              id: staff._id,
              rollName: rollName,
              name: staff.name,
              phoneNumber: staff.phone_number,
              email: staff.email,
              img_url: staff.img_url,
            }
          })
      )
    }
  }, [staffList])

  useEffect(() => {
    const options = [
      {value: 'SICK', label: t('sickLeave'), available: null},
      {value: 'CASUAL', label: t('casualLeave'), available: null},
      {value: 'UNPAID', label: t('unpaidLeave'), available: null},
    ]

    if (selectedStaffBalance)
      setLeaveType((leaveType) => ({
        ...leaveType,
        options: options.map((option) => {
          option.available = selectedStaffBalance[option.value]

          if (
            edit &&
            option.value === leaveData.type &&
            option.value != 'UNPAID'
          ) {
            option.available += leaveData.no_of_days
          }

          option.children = (
            <div className={classNames(styles.rowWrapper)}>
              <div>{option.label}</div>
              {typeof option.available === 'number' ? (
                <div
                  className={classNames(
                    styles.textSecondary,
                    styles.leaveTypeCount,
                    {
                      [styles.errortext]: !option.available,
                    }
                  )}
                >
                  <Trans i18nKey={'remainingDaysDynamic'}>
                    {{option: option.available || 0}} remaining
                  </Trans>
                </div>
              ) : null}
            </div>
          )
          return option
        }),
      }))
  }, [selectedStaffBalance])

  useEffect(() => {
    if (instituteAcademicSessionInfo && instituteActiveAcademicSessionId) {
      const activerange = {}
      instituteAcademicSessionInfo.forEach((session) => {
        if (session._id === instituteActiveAcademicSessionId) {
          activerange.from = session.start_time
          activerange.to = session.end_time
        }
      })
      setdateRange((dateRange) => ({
        ...dateRange,
        from: convertTimestampToLocalTime(activerange.from),
        to: convertTimestampToLocalTime(activerange.to),
      }))
    }
  }, [instituteAcademicSessionInfo, instituteActiveAcademicSessionId])

  useEffect(() => {
    const {selectedFrom, selectedTo} = dateRange

    /*
      Case handled as per the requirement:
        1. selectedFrom == selectedTo then all slot options will be active/shown
        2. selectedFrom !== selectedTo then remove firstHalf from startDate & secondHalf from endDate
     */
    if (selectedFrom && selectedTo) {
      if (edit && firstRender.current) {
        // don't run setdateRange when in intial setup phase in edit mode
        firstRender.current = false
        // return
      } else {
        setdateRange((dateRange) => ({
          ...dateRange,
          fromSlot:
            selectedFrom !== selectedTo ? LEAVE_SHIFT_TYPE.FULL_DAY : null,
          toSlot: null,
        }))
      }
      setFromSlotOptions(
        fromSlotOptions.map((option) => ({
          ...option,
          disabled:
            selectedFrom === selectedTo
              ? false
              : option.value === LEAVE_SHIFT_TYPE.FIRST_HALF,
        }))
      )
      setToSlotOptions(
        toSlotOptions.map((option) => ({
          ...option,
          disabled:
            selectedFrom === selectedTo
              ? false
              : option.value === LEAVE_SHIFT_TYPE.SECOND_HALF,
        }))
      )
    }
  }, [dateRange.selectedFrom, dateRange.selectedTo])

  useEffect(() => {
    if (dateRange.selectedFrom && dateRange.selectedTo) {
      const from = DateTime.fromFormat(dateRange.selectedFrom, 'yyyy-LL-dd')
      const to = DateTime.fromFormat(dateRange.selectedTo, 'yyyy-LL-dd')
      const min = DateTime.fromFormat(dateRange.from, 'yyyy-LL-dd')
      const max = DateTime.fromFormat(dateRange.to, 'yyyy-LL-dd')

      const {fromSlot, toSlot} = dateRange

      // if single day leave, set endSlot value same as fromSlot
      if (from.ts == to.ts && fromSlot != toSlot) {
        setdateRange({
          ...dateRange,
          toSlot: fromSlot,
        })
        return
      }

      if (from > to || from < min || to > max || !fromSlot || !toSlot) {
        return
      }

      const createUTCfrom = DateTime.fromFormat(
        dateRange.selectedFrom,
        'yyyy-LL-dd'
      )
      const createUTCTo = DateTime.fromFormat(
        dateRange.selectedTo,
        'yyyy-LL-dd'
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
          from_slot: fromSlot,
          to_slot: toSlot,
        })
      )
    }
  }, [dateRange.fromSlot, dateRange.toSlot])

  useEffect(() => {
    setselectedStaffState(selectedStaff)
    if (selectedStaff) {
      dispatch(
        getStaffLeaveBalance({
          iid: selectedStaff.iid || selectedStaff.imember_id,
        })
      )
    }
  }, [selectedStaff])

  useEffect(() => {
    seterror(apiErrorMsg)
  }, [apiErrorMsg])

  useEffect(() => {
    if (!selectedStaff) {
      handleTextChange('')
    }
  }, [normalizedStaffList])

  useEffect(() => {}, [dateRange])

  const handleTextChange = (text) => {
    if (edit) return
    seterror(null)
    setselectedStaffState(null)
    const searchresults = normalizedStaffList.filter((staff) =>
      staff?.name?.toUpperCase()?.includes(text?.toUpperCase())
    )
    if (searchresults.length) {
      setSearchResults(
        <div>
          {searchresults
            .sort(nameSortComparision)
            .map((staff) => searchRow(staff))}
        </div>
      )
    } else {
      setSearchResults(null)
    }
  }

  const handleRowclick = (staff) => {
    setSearchResults(null)
    setselectedStaffState(staff)
    dispatch(getStaffLeaveBalance({iid: staff.id}))
  }
  const searchRow = (staff) => (
    <div
      onClick={() => {
        handleRowclick(staff)
        eventManager.send_event(events.SELECT_LEAVE_EMPLOYEE_TFI, {
          employee_name: staff.name,
          employee_user_id: staff.id,
          employee_type:
            typeof staff.rollName === 'object'
              ? staff.rollName?.props?.children
              : staff.rollName,
        })
      }}
      className={classNames(styles.rowWrapper, styles.addleaveRow)}
    >
      <div className={styles.flex}>
        <img
          className={styles.img}
          src={staff.img_url || userDefaultIcon}
          alt=""
        />
        <div>
          <div className={styles.textPrimary}>{staff.name}</div>
          <div className={styles.textSecondary}>
            {staff?.phoneNumber || staff?.email}
          </div>
        </div>
      </div>
      <div className={classNames(styles.textPrimary, styles.rollName)}>
        {staff.rollName}
      </div>
    </div>
  )

  const handleAddLeave = () => {
    if (!validate()) return
    const createUTCFrom = DateTime.fromFormat(
      dateRange.selectedFrom,
      'yyyy-LL-dd'
    )
    const createUTCTo = DateTime.fromFormat(dateRange.selectedTo, 'yyyy-LL-dd')
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

    const iid =
      selectedStaffState?.id ||
      selectedStaffState?.iid ||
      selectedStaffState?.imember_id

    const data = {
      iid,
      type: leaveType.selected,
      from: from,
      to: to,
      no_of_days: selectedLeaveCount,
      reason: reason,
      from_slot: dateRange.fromSlot,
      to_slot: dateRange.toSlot,
      ...(edit
        ? {
            request_id: leaveData._id,
            self: iid == currentUserIId,
          }
        : {}),
    }

    if (edit) dispatch(editLeave(data))
    else if (request) dispatch(requestLeave(data))
    else dispatch(createLeave({...data, screen: 'staff_leave'}))

    eventManager.send_event(
      edit
        ? events.EDIT_LEAVE_CLICKED_TFI
        : request
        ? events.REQUEST_LEAVE_CLICKED_TFI
        : events.ADD_LEAVE_CLICKED_TFI,
      {
        employee_name: selectedStaffState.name,
        employee_user_id: selectedStaffState.id,
        employee_type:
          typeof selectedStaffState.rollName === 'object'
            ? selectedStaffState.rollName?.props?.children
            : selectedStaffState.rollName,
        leave_type: leaveType.selected,
        from: dateRange.selectedFrom || null,
        to: dateRange.selectedTo || null,
        start_date_duration_type:
          LEAVE_SHIFT_TYPE[dateRange.fromSlot]?.toLowerCase() || null,
        end_date_duration_type:
          LEAVE_SHIFT_TYPE[dateRange.toSlot]?.toLowerCase() || null,
      }
    )
  }

  const validate = () => {
    let valid = true
    if (!selectedStaffState) {
      seterror(t('pleaseSelectAStaff'))
      valid = false
      return valid
    }
    if (!request && !leaveType.selected) {
      seterror(t('pleaseSelectALeaveType'))
      valid = false
      return valid
    }
    if (!dateRange.selectedFrom) {
      seterror(t('pleaseSelectADate'))
      valid = false
      return valid
    }
    if (!dateRange.selectedTo) {
      seterror(t('pleaseSelectADate'))
      valid = false
      return valid
    }

    const from = DateTime.fromFormat(dateRange.selectedFrom, 'yyyy-LL-dd')
    const to = DateTime.fromFormat(dateRange.selectedTo, 'yyyy-LL-dd')
    const min = DateTime.fromFormat(dateRange.from, 'yyyy-LL-dd')
    const max = DateTime.fromFormat(dateRange.to, 'yyyy-LL-dd')

    if (from > to) {
      seterror(t('fromDateLessThanToDate'))
      valid = false
      return valid
    }

    if (from > to || from < min || to > max) {
      seterror(t('leavesOutsideAcademicSession'))
      valid = false
      return valid
    }

    if (!dateRange.fromSlot || !dateRange.toSlot) {
      seterror(t('pleaseSelectSlot'))
      return false
    }

    if (request && !leaveType.selected) {
      seterror(t('pleaseSelectALeaveType'))
      valid = false
      return valid
    }

    if (request && !reason) {
      seterror(t('pleaseSelectLeaveReason'))
      return false
    }

    const selectedLeaveType = leaveType.options.find((leave) => {
      if (leave.value === leaveType.selected) return true
    })
    if (
      selectedLeaveType &&
      selectedLeaveType.value !== 'UNPAID' &&
      selectedLeaveCount
    ) {
      if (selectedLeaveCount > selectedLeaveType.available) {
        //
        seterror(t('requestedLeaveMoreThanAvailable'))
        valid = false
        eventManager.send_event(events.LEAVE_NOT_AVAILABLE_TFI, {
          employee_name: selectedStaffState?.name,
          employee_user_id: selectedStaffState?.id,
          from: dateRange.selectedFrom,
          to: dateRange.selectedTo,
          employee_type:
            typeof selectedStaffState?.rollName === 'object'
              ? selectedStaffState.rollName?.props?.children
              : selectedStaffState?.rollName,
        })
        return valid
      }
    }
    if (selectedLeaveType.value === 'UNPAID' && selectedLeaveCount > 30) {
      seterror(t('requestedLeaveMoreThanThirtyDays'))
      valid = false
      eventManager.send_event(events.LEAVE_LIMIT_EXCEED_TFI, {
        employee_name: selectedStaffState?.name,
        employee_user_id: selectedStaffState?.id,
        from: dateRange.selectedFrom,
        to: dateRange.selectedTo,
        employee_type:
          typeof selectedStaffState?.rollName === 'object'
            ? selectedStaffState.rollName?.props?.children
            : selectedStaffState?.rollName,
      })
      return valid
    }

    return valid
  }

  const dateRangeEventsData = () => ({
    employee_name: selectedStaffState?.name,
    employee_user_id: selectedStaffState?.id,
    employee_type:
      typeof selectedStaffState?.rollName === 'object'
        ? selectedStaffState.rollName?.props?.children
        : selectedStaffState?.rollName,
  })

  const handleDateChange = (dateType, date) => {
    seterror(null)
    const formattedValue = DateTime.fromJSDate(date).toFormat('yyyy-LL-dd')
    setdateRange({
      ...dateRange,
      selectedFrom:
        dateType === 'start' ? formattedValue : dateRange.selectedFrom,
      selectedTo: dateType === 'end' ? formattedValue : dateRange.selectedTo,
    })
    eventManager.send_event(events.SELECT_LEAVE_DATE_TFI, {
      ...dateRangeEventsData(),
      date_type: dateType === 'start' ? 'from_date' : 'to_date',
      from: dateType === 'start' ? formattedValue : dateRange.selectedFrom,
      to: dateType === 'end' ? formattedValue : dateRange.selectedTo,
      start_date_duration_type:
        LEAVE_SHIFT_TYPE[dateRange.fromSlot]?.toLowerCase() || null,
      end_date_duration_type:
        LEAVE_SHIFT_TYPE[dateRange.toSlot]?.toLowerCase() || null,
    })
  }

  const handleLeaveSlotChange = (name, value) => {
    seterror(null)
    setdateRange((dataRange) => ({
      ...dataRange,
      [name]: value,
    }))
    eventManager.send_event(events.SELECT_LEAVE_DATE_TFI, {
      ...dateRangeEventsData(),
      duration_type: name === 'fromSlot' ? 'from_slot' : 'to_slot',
      from: dateRange.selectedFrom,
      to: dateRange.selectedTo,
      start_date_duration_type:
        LEAVE_SHIFT_TYPE[
          name == 'fromSlot' ? value : dateRange.fromSlot
        ]?.toLowerCase() || null,
      end_date_duration_type:
        LEAVE_SHIFT_TYPE[
          name == 'toSlot' ? value : dateRange.toSlot
        ]?.toLowerCase() || null,
    })
  }

  return showAddLeavePopup ? (
    <div className={styles.slider}>
      <Slider
        open={showAddLeavePopup}
        setOpen={() => {
          dispatch(hideAddLeavePopup())
        }}
        hasCloseIcon
        widthInPercent={30}
        content={
          <AddLeaveForm
            request={request}
            edit={edit}
            formRef={formRef}
            handleTextChange={handleTextChange}
            selectedStaffState={selectedStaffState}
            searchResults={searchResults}
            leaveType={leaveType}
            seterror={seterror}
            setLeaveType={setLeaveType}
            dateRange={dateRange}
            handleDateChange={handleDateChange}
            selectedLeaveCount={selectedLeaveCount}
            error={error}
            handleAddLeave={handleAddLeave}
            loading={loading}
            setReason={setReason}
            reason={reason}
            handleLeaveSlotChange={handleLeaveSlotChange}
            fromSlotOptions={fromSlotOptions}
            toSlotOptions={toSlotOptions}
          />
        }
      ></Slider>
    </div>
  ) : null
}
export default AddLeave
