import {useEffect, useState} from 'react'
import {t} from 'i18next'
import produce from 'immer'
import styles from './SetupShift.module.css'
import classNames from 'classnames'
import {
  Divider,
  Heading,
  HEADING_CONSTANTS,
  Input,
  INPUT_TYPES,
  Icon,
  ICON_CONSTANTS,
  Tooltip,
  TOOLTIP_CONSTANTS,
  Para,
  PARA_CONSTANTS,
  RadioGroup,
  Checkbox,
  CHECKBOX_CONSTANTS,
} from '@teachmint/krayon'
import TimePickerInput from '../../../../Transport/components/TimePickerInput'
import ShiftDuration from '../ShiftDuration/ShiftDuration'
import {
  isCheckoutDateGreaterThanCheckIn,
  isGraceFrequencyValid,
  isGraceTimeValid,
} from '../../utils/validation'
import {
  ATTENDANCE_TAKEN_AT,
  defaultGrace,
  defaultGraceFrequency,
  defaultGraceTime,
} from '../../constants/shift.constants'

export default function SetupShift({shiftInfo, setShiftInfo}) {
  const [validations, setValidations] = useState({})
  const handleTextChange = ({fieldName, value}) => {
    const updatedShift = produce(shiftInfo, (draftState) => {
      draftState[fieldName] = value
    })
    setShiftInfo(updatedShift)
  }

  useEffect(() => {
    const updatedValidations = produce(validations, (draftState) => {
      draftState.outtime = shiftInfo?.setting?.outtime
        ? isCheckoutDateGreaterThanCheckIn(shiftInfo)
          ? ''
          : t('shiftOutTimeValidation')
        : ''
      draftState.time = shiftInfo?.setting?.grace?.time
        ? isGraceTimeValid(shiftInfo)
          ? ''
          : t('graceTimeValidation')
        : ''
      draftState.frequency = shiftInfo?.setting?.grace?.frequency
        ? isGraceFrequencyValid(shiftInfo)
          ? ''
          : t('graceAllowedValidation')
        : ''
    })
    setValidations(updatedValidations)
  }, [shiftInfo])

  const handleSettingChange = ({fieldName, value}) => {
    const updatedShift = produce(shiftInfo, (draftState) => {
      draftState.setting[fieldName] = value
      switch (fieldName) {
        case 'is_grace_allowed': {
          draftState.setting.grace = value ? defaultGrace : null
          break
        }
        case 'attendance_taken_at': {
          if (value === ATTENDANCE_TAKEN_AT.ONLY_CHECKIN) {
            draftState.setting.outtime = null
          }
          break
        }
      }
    })
    setShiftInfo(updatedShift)
  }

  const handleGraceTiming = ({fieldName, value}) => {
    const match = new RegExp('^[0-9]+$|^$').test(value)
    if (match) {
      const val = value ? parseInt(value) : ''
      if (!value || match) {
        const updatedShift = produce(shiftInfo, (draftState) => {
          draftState.setting.grace[fieldName] = val
        })
        setShiftInfo(updatedShift)
      }
    }
  }

  const getTimePickerInput = (timeStr) => {
    return {
      initialTime: timeStr || '',
      hr: timeStr ? timeStr.slice(0, 2) : '',
      mi: timeStr ? timeStr.slice(3, 5) : '',
      typeFormat: timeStr ? timeStr.slice(6, 8) : '',
    }
  }
  return (
    <>
      <div className={styles.headingWrapper}>
        <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.SMALL}>
          {t('setupShift')}
        </Heading>
        <Divider spacing={12} />
      </div>
      <div
        className={classNames(
          styles.scrollContainer,
          'krayon-show-scrollbar-small krayon-show-scrollbar'
        )}
      >
        <Input
          type={INPUT_TYPES.TEXT}
          value={shiftInfo?.name}
          placeholder={t('shiftNamePlaceholder')}
          fieldName={'name'}
          title={t('shiftName')}
          onChange={handleTextChange}
          showMsg
          isRequired
          classes={{
            wrapper: styles.shiftNameWrapper,
          }}
        />
        <div className={styles.attendanceContainer}>
          <div className={styles.attendanceSection}>
            <Heading
              textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}
              className={styles.headingWithTooltip}
            >
              {t('attendanceWillBeTaken')}
              <span data-tip data-for={'attendanceTime'}>
                <Icon
                  name="info"
                  type={ICON_CONSTANTS.TYPES.SECONDARY}
                  size={ICON_CONSTANTS.SIZES.XXX_SMALL}
                  version={ICON_CONSTANTS.VERSION.OUTLINED}
                />
                <Tooltip
                  toolTipId={'attendanceTime'}
                  effect={TOOLTIP_CONSTANTS.TOOLTIP_EFFECTS.SOLID}
                  toolTipBody={
                    <div className={styles.tooltipText}>
                      <Para textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}>
                        {t('onlyDuringCheckin')}
                      </Para>
                      <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
                        {t('attendanceWillBeRecordedOnceInDay')}
                      </Para>
                      <div className={styles.separator}></div>
                      <Para textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}>
                        {t('duringBothCheckinAndCheckout')}
                      </Para>
                      <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
                        {t('attendanceWillBeRecordedTwoTimesInDay')}
                      </Para>
                    </div>
                  }
                  place={TOOLTIP_CONSTANTS.TOOLTIP_POSITIONS.BOTTOM}
                />
              </span>
            </Heading>
            <div className={styles.radioGroupWrapper}>
              <RadioGroup
                options={[
                  {
                    label: t('onlyDuringCheckin'),
                    value: ATTENDANCE_TAKEN_AT.ONLY_CHECKIN,
                  },
                  {
                    label: t('duringBothCheckinAndCheckout'),
                    value: ATTENDANCE_TAKEN_AT.CHECKIN_CHECKOUT,
                  },
                ]}
                selectedOption={shiftInfo?.setting?.attendance_taken_at}
                size="s"
                handleChange={({selected}) => {
                  handleSettingChange({
                    fieldName: 'attendance_taken_at',
                    value: selected,
                  })
                }}
              />
            </div>
          </div>
          <Divider spacing={0} />
          <div className={styles.attendanceSection}>
            <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
              {t('setShiftTimings')}
            </Heading>
            <div className={styles.attendanceTimingWrapper}>
              <TimePickerInput
                title={t('shiftStartsAt')}
                isRequired
                fieldName={'intime'}
                onChange={handleSettingChange}
                placeholder={t('setTime')}
                className={styles.inputWrapper}
                {...getTimePickerInput(shiftInfo?.setting?.intime)}
              />
              {shiftInfo?.setting?.attendance_taken_at ===
                ATTENDANCE_TAKEN_AT.CHECKIN_CHECKOUT && (
                <div className={styles.inputWrapper}>
                  <TimePickerInput
                    title={t('shiftEndsAt')}
                    isRequired
                    fieldName={'outtime'}
                    onChange={handleSettingChange}
                    placeholder={t('setTime')}
                    className={styles.inputWrapper}
                    isDisabled={!shiftInfo?.setting?.intime}
                    {...getTimePickerInput(shiftInfo?.setting?.outtime)}
                    textInputProps={{
                      infoMsg: validations?.outtime,
                      infoType: validations?.outtime ? 'error' : '',
                    }}
                  />
                </div>
              )}
              {shiftInfo?.setting?.is_grace_allowed && (
                <div className={styles.inputWrapper}>
                  <Input
                    type={INPUT_TYPES.TEXT}
                    value={shiftInfo?.setting?.grace?.time}
                    placeholder={String(defaultGraceTime)}
                    fieldName={'time'}
                    title={t('graceTime')}
                    onChange={handleGraceTiming}
                    showMsg
                    suffix={t('graceTimeInMins')}
                    classes={{
                      wrapper: styles.inputWrapper,
                      title: styles.inputTitle,
                    }}
                    isDisabled={!shiftInfo?.setting?.intime}
                    infoMsg={validations?.time}
                    infoType={validations?.time ? 'error' : ''}
                    isRequired={shiftInfo?.setting?.is_grace_allowed}
                  />
                </div>
              )}
              {shiftInfo?.setting?.is_grace_allowed && (
                <Input
                  type={INPUT_TYPES.TEXT}
                  value={shiftInfo?.setting?.grace?.frequency}
                  placeholder={String(defaultGraceFrequency)}
                  fieldName={'frequency'}
                  title={t('graceAllowed')}
                  onChange={handleGraceTiming}
                  showMsg
                  suffix={t('graceAllowedPerMonth')}
                  classes={{
                    wrapper: styles.inputWrapper,
                    input: styles.textInput,
                    title: styles.inputTitle,
                  }}
                  infoMsg={validations?.frequency}
                  infoType={validations?.frequency ? 'error' : ''}
                  isRequired={shiftInfo?.setting?.is_grace_allowed}
                />
              )}
            </div>
            <div className={styles.headingWithTooltip}>
              <Checkbox
                label={t('setGraceTime')}
                size={CHECKBOX_CONSTANTS.SIZE.SMALL}
                isSelected={shiftInfo?.setting?.is_grace_allowed}
                handleChange={handleSettingChange}
                fieldName={'is_grace_allowed'}
                classes={{wrapper: styles.checkBoxWrapper}}
              />
              <span data-tip data-for={'is_grace_allowed'}>
                <Icon
                  name="info"
                  type={ICON_CONSTANTS.TYPES.SECONDARY}
                  size={ICON_CONSTANTS.SIZES.XXX_SMALL}
                  version={ICON_CONSTANTS.VERSION.OUTLINED}
                />
                <Tooltip
                  toolTipId={'is_grace_allowed'}
                  effect={TOOLTIP_CONSTANTS.TOOLTIP_EFFECTS.SOLID}
                  toolTipBody={
                    <div
                      className={classNames(
                        styles.tooltipText,
                        styles.graceTimeTooltip
                      )}
                    >
                      <Para textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}>
                        {t('graceTime')}
                      </Para>
                      <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
                        {t('graceTimeCheckinCheoutRule')}
                      </Para>
                      &nbsp;
                      <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
                        {t('graceFrequencyLimitExceededRule')}
                      </Para>
                    </div>
                  }
                  place={TOOLTIP_CONSTANTS.TOOLTIP_POSITIONS.BOTTOM}
                />
              </span>
            </div>
            <ShiftDuration
              isDisabled={Object.values(validations).some((val) => val)}
              isGraceAllowed={shiftInfo?.setting?.is_grace_allowed}
              checkInTime={shiftInfo?.setting?.intime}
              checkOutTime={shiftInfo?.setting?.outtime}
              graceTime={shiftInfo?.setting?.grace?.time}
            />
          </div>
        </div>
      </div>
    </>
  )
}
