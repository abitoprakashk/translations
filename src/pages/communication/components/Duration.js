import React, {useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
// import {Tooltip} from '@teachmint/common'
import {showToast} from '../../../redux/actions/commonAction'

import communicationStyles from '../Communication.module.css'
import {setDuration} from '../redux/actions/commonActions'
import {
  DURATIONS,
  COMMUNICATION_TYPE,
  // DURATION_TOOLTIP_TEXT,
} from './../constants'
import classNames from 'classnames'
import {events} from '../../../utils/EventsConstants'
import {Trans, useTranslation} from 'react-i18next'

const Duration = () => {
  const {t} = useTranslation()
  const tDay = t('day')
  const tDays = t('days')
  const enterNumberHere = t('enterNumberHere')
  const tMax = t('max')
  const tCustomDays = t('customDays')

  const {duration, announcement_type} = useSelector(
    (state) => state.communicationInfo.common
  )

  const eventManager = useSelector((state) => state.eventManager)

  const [isCustom, setIsCustom] = useState(
    DURATIONS.indexOf(duration) === -1 ? true : false
  )
  const [customValue, setCustomValue] = useState(
    DURATIONS.indexOf(duration) === -1 ? (duration > 0 ? duration : '') : ''
  )
  const dispatch = useDispatch()

  const onRadioChangeValue = (e) => {
    let val = e.target.value
    if (val === '') {
      setIsCustom(true)
    } else if (isCustom) {
      setIsCustom(false)
    }
    dispatch(setDuration(parseInt(val)))
    sendClickEvents()
  }

  const renderRadios = () => {
    return DURATIONS.map((item) => {
      if (item === 0) return null
      return (
        <div className={communicationStyles.radioBottomMargin} key={item}>
          <label>
            <input
              type="radio"
              value={item}
              name="duration"
              checked={duration === item}
              onChange={onRadioChangeValue}
              className={communicationStyles.communicationDurationRadio}
            />
            <span
              className={classNames('ml-2', communicationStyles.textCapitalize)}
            >
              {item} {`${item > 1 ? tDays : tDay}`}
            </span>
          </label>
        </div>
      )
    })
  }

  const sendClickEvents = () => {
    eventManager.send_event(events.POST_DURATION_CLICKED_TFI, {
      post_type: announcement_type === 1 ? 'feedback' : 'poll',
    })
  }

  const handleChangeCustomDays = (val) => {
    if (val) {
      setCustomValue('')
      dispatch(setDuration(0))
    }
    setIsCustom(val)
    sendClickEvents()
  }

  const handleChangeCustomValue = (val) => {
    if (val && +val === 0) return
    if (val > 0 && val < 31) {
      dispatch(setDuration(val))
      setCustomValue(val)
    } else {
      dispatch(setDuration(0))
      setCustomValue('')
    }
  }

  const handleBlurCustomDays = (e) => {
    let val = +e.target.value
    if (val === 0) return

    if (val < 1 || val > 30) {
      dispatch(
        showToast({
          type: 'error',
          message: `You can create a ${COMMUNICATION_TYPE[announcement_type]} for a maximum of 30 days`,
        })
      )
      e.target.focus()
    } else {
      dispatch(setDuration(val))
    }
  }

  return (
    <>
      <span
        className={classNames(
          communicationStyles.communicationDurationHeading,
          'flex'
        )}
      >
        <Trans i18nKey={'selectDurationOfYour'}>
          Select duration of your {COMMUNICATION_TYPE[announcement_type]}
        </Trans>

        {/* <img
          className="mx-1"
          data-tip
          data-for="happyFace"
          src={
            'https://storage.googleapis.com/tm-assets/icons/secondary/infi-circle-secondary.svg'
          }
          alt="icon"
        />
        <Tooltip
          toolTipId="happyFace"
          type="info"
          effect="solid"
          place="bottom"
        >
          <div>{DURATION_TOOLTIP_TEXT}</div>
        </Tooltip> */}
      </span>
      <hr className="mb-3 mt-2" />
      <div className={communicationStyles.radioWrapper}>
        {renderRadios()}
        <div>
          <label>
            <input
              type="radio"
              value=""
              checked={DURATIONS.indexOf(duration) === -1 || isCustom}
              name="duration"
              onChange={(e) => handleChangeCustomDays(e.target.checked)}
              className={classNames(
                communicationStyles.communicationDurationRadio,
                {
                  [communicationStyles.settingsRadioOptionUncheckedText]:
                    isCustom,
                }
              )}
            />
            <span className={'ml-2'}>{tCustomDays}</span>
          </label>
        </div>
      </div>
      {isCustom && (
        <div>
          <input
            type="number"
            placeholder={enterNumberHere}
            className={classNames(
              communicationStyles.communicationDurationRadioCustomInputBox
            )}
            name="custom_days"
            value={customValue}
            onChange={(e) => handleChangeCustomValue(e.target.value)}
            onBlur={(e) => handleBlurCustomDays(e)}
          />
          <span
            className={classNames(
              communicationStyles.customDaysLimit,
              communicationStyles.textCapitalize
            )}
          >
            {tMax}: 30 {tDays}
          </span>
        </div>
      )}
    </>
  )
}

export default Duration
