import React, {useEffect, useState} from 'react'
import {Trans, useTranslation} from 'react-i18next'
import produce from 'immer'
import classNames from 'classnames'
import {
  CheckboxGroup,
  Icon,
  ICON_CONSTANTS,
  Input,
  Radio,
  Tooltip,
  TOOLTIP_CONSTANTS,
} from '@teachmint/krayon'
import {
  absentLeaveStatus,
  ATTENDANCE_MARKED_STATUS,
  EDIT_ATTENDANCE_STATUS,
  GRACE_LABEL_CONST,
  presentLeaveStatus,
} from '../../../StaffAttendanceConstants'
import {leaveLabelmap} from '../../../../../../../pages/LeaveManagement/LeaveManagement.constant'
import styles from './EditAttendanceForm.module.css'
import {
  EDIT_BADGES_STATUS,
  getGraceCalculation,
} from './EditAttendanceModal.utils'

const EditAttendanceForm = ({
  attendanceData,
  leaveStatus,
  attendanceInfo,
  type,
  setFields,
  fields,
  leaveBalance,
  setEditLeaveSelect,
  editLeaveSelect,
  setPresentLeaveSelected,
  presentLeaveSelected,
}) => {
  const {t} = useTranslation()
  const {
    NOT_MARKED,
    PRESENT,
    HALF_DAY_PRESENT,
    PRESENT_HALF_DAY,
    ARRIVE_LATE,
    LEFT_EARLY,
    ABSENT,
    ARRIVE_LATE_LEFT_EARLY,
  } = EDIT_ATTENDANCE_STATUS
  const {GRACE_ALLOWED, GRACE_USED, PENALTY} = GRACE_LABEL_CONST
  const [showGraceCard, setShowGraceCard] = useState(false)
  const [graceStateData, setGraceStateData] = useState({
    GRACE_ALLOWED: 0,
    GRACE_USED: 0,
    PENALTY: 0,
  })

  useEffect(() => {
    if (attendanceInfo && Object.keys(attendanceInfo)?.length > 0) {
      if (leaveStatus && Object.keys(leaveStatus)?.length > 0) {
        if (type === PRESENT_HALF_DAY) {
          setEditLeaveSelect(HALF_DAY_PRESENT)
          setFields((fields) => ({
            ...fields,
            leaveType: Object.values(leaveStatus)?.[0]?.type || '',
          }))
        } else {
          if (absentLeaveStatus.includes(type)) {
            setEditLeaveSelect(ABSENT)
            setFields((fields) => ({
              ...fields,
              leaveType: Object.values(leaveStatus)?.[0]?.type || '',
            }))
          }
        }
        if (
          attendanceInfo?.status === PRESENT &&
          attendanceInfo?.status_type !== ''
        ) {
          if (attendanceInfo?.status_type === ARRIVE_LATE_LEFT_EARLY) {
            setPresentLeaveSelected([ARRIVE_LATE, LEFT_EARLY])
          } else {
            if (
              attendanceInfo.status_type &&
              attendanceInfo?.status_type !== ''
            ) {
              setPresentLeaveSelected([attendanceInfo.status_type])
            }
          }
        }
      } else {
        if (
          attendanceInfo?.status !== '' &&
          attendanceInfo?.status !== NOT_MARKED
        ) {
          setEditLeaveSelect(attendanceInfo?.status)
          if (
            attendanceInfo?.status === PRESENT &&
            attendanceInfo?.status_type !== ''
          ) {
            if (attendanceInfo?.status_type === ARRIVE_LATE_LEFT_EARLY) {
              setPresentLeaveSelected([ARRIVE_LATE, LEFT_EARLY])
            } else {
              if (
                attendanceInfo.status_type &&
                attendanceInfo?.status_type !== ''
              ) {
                setPresentLeaveSelected([attendanceInfo.status_type])
              }
            }
          }
        }
      }
    }
  }, [])

  useEffect(() => {
    if (attendanceData && Object.keys(attendanceData?.shift)?.length > 0) {
      const graceSettings = attendanceData?.shift?.setting?.grace
      if (
        graceSettings &&
        Object.keys(graceSettings)?.length > 0 &&
        graceSettings?.frequency > 0
      ) {
        setShowGraceCard(true)
        const graceSetValues = {
          GRACE_ALLOWED: graceSettings?.frequency || 0,
          GRACE_USED: attendanceData?.grace_used || 0,
          PENALTY: attendanceData?.total_unpaid_leave || 0,
        }
        setGraceStateData(graceSetValues)
      }
    }
  }, [attendanceData])

  const handleLeaveSelection = (value) => {
    setEditLeaveSelect(value)
    if (presentLeaveSelected.length > 0 && !attendanceInfo?.status_type) {
      setPresentLeaveSelected([])
    }
    if (fields?.leaveType !== '') {
      setFields(
        produce(fields, (draft) => {
          delete draft['leaveType']
          return draft
        })
      )
    }
  }

  const handlePresentLeaveSelection = (selected, e) => {
    const isChecked = e.target.checked
    setPresentLeaveSelected([...selected])
    const updatedGraceObj = getGraceCalculation({graceStateData, isChecked})
    setGraceStateData(updatedGraceObj)
  }

  return (
    <div className={styles.attendanceBox}>
      <div className={styles.attendanceTopBlock}>
        <div className={styles.selectLeaveType}>
          {Object.values(ATTENDANCE_MARKED_STATUS).map(({value, label}) => {
            return (
              <div
                className={styles.radioInnerBlock}
                key={`editModalLeave_${value}`}
              >
                <Radio
                  fieldName={value}
                  size="m"
                  isSelected={editLeaveSelect === value ? true : false}
                  label={t(label)}
                  handleChange={() => {
                    handleLeaveSelection(value)
                  }}
                  classes={{
                    wrapper: styles.radioWrapper,
                    radio: styles.radioBtn,
                    label: styles.radioLabel,
                  }}
                />
              </div>
            )
          })}
        </div>
      </div>
      <div className={styles.attendanceBottomBlock}>
        {editLeaveSelect === PRESENT && (
          <div className={styles.innerCommonWrapper}>
            <div className={styles.presentBoxTitle}>{t('presentWith')}</div>
            <CheckboxGroup
              name="presetBoxStatus"
              options={presentLeaveStatus}
              selectedOptions={presentLeaveSelected}
              onChange={(selectedValues, event) =>
                handlePresentLeaveSelection(selectedValues, event)
              }
              wrapperClass={styles.wrapperCheckBox}
            />
            {showGraceCard && (
              <div className={styles.graceBlock}>
                {Object.values(EDIT_BADGES_STATUS).map((item) => {
                  const graceValue = graceStateData?.[item?.id] || 0
                  return (
                    <div
                      key={item?.id}
                      className={classNames(styles.graceSubCard, {
                        [styles.basicBadge]: item?.id === GRACE_ALLOWED,
                        [styles.successBadge]: item?.id === GRACE_USED,
                        [styles.errorBadge]: item?.id === PENALTY,
                      })}
                    >
                      <span className={styles.titleBlock}>
                        <span className={styles.penaltyValue}>
                          {item?.label}
                        </span>
                        {item?.tooltip && (
                          <span
                            className={styles.penaltyTooltip}
                            data-tip
                            data-for={'leavePenaltyToolTip'}
                          >
                            <Icon
                              name="info"
                              type={ICON_CONSTANTS.TYPES.BASIC}
                              size={ICON_CONSTANTS.SIZES.XXX_SMALL}
                              version={ICON_CONSTANTS.VERSION.OUTLINED}
                            />
                            <Tooltip
                              toolTipId={'leavePenaltyToolTip'}
                              effect={TOOLTIP_CONSTANTS.TOOLTIP_EFFECTS.SOLID}
                              toolTipBody={
                                <div className={styles.toolTipText}>
                                  {t(
                                    'leavesDeductedThisMonthDueToGraceBreaches'
                                  )}
                                </div>
                              }
                              place={TOOLTIP_CONSTANTS.TOOLTIP_POSITIONS.BOTTOM}
                            />
                          </span>
                        )}
                      </span>
                      <div className={styles.valueBlock}>
                        {`${graceValue} ${item.valueSuffix || ''}`}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {editLeaveSelect === HALF_DAY_PRESENT && (
          <div className={styles.innerCommonWrapper}>
            <Input
              fieldName="leaveType"
              isRequired
              onChange={(e) => {
                setFields((fields) => ({
                  ...fields,
                  [e.fieldName]: e.value,
                }))
              }}
              options={Object.values(leaveLabelmap).map(({value, label}) => ({
                label: (
                  <>
                    {label}{' '}
                    {value != leaveLabelmap.UNPAID.value && (
                      <span className={styles.leaveCount}>
                        (
                        <Trans i18nKey={'remainingDaysDynamic'}>
                          {{
                            option: leaveBalance ? leaveBalance[value] || 0 : 0,
                          }}{' '}
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
              title={t('markLeaveForHalfDay')}
              type="dropdown"
              value={fields.leaveType}
              classes={{optionClass: styles.optionClass}}
            />
          </div>
        )}

        {editLeaveSelect === ABSENT && (
          <div className={styles.innerCommonWrapper}>
            <Input
              fieldName="leaveType"
              isRequired
              onChange={(e) => {
                setFields((fields) => ({
                  ...fields,
                  [e.fieldName]: e.value,
                }))
              }}
              options={Object.values(leaveLabelmap).map(({value, label}) => ({
                label: (
                  <>
                    {label}{' '}
                    {value != leaveLabelmap.UNPAID.value && (
                      <span className={styles.leaveCount}>
                        (
                        <Trans i18nKey={'remainingDaysDynamic'}>
                          {{
                            option: leaveBalance ? leaveBalance[value] || 0 : 0,
                          }}{' '}
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
              title={t('markLeave')}
              type="dropdown"
              value={fields.leaveType}
              classes={{optionClass: styles.optionClass}}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default EditAttendanceForm
