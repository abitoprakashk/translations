import {useEffect, useState} from 'react'
import styles from './ShiftDuration.module.css'
import {t} from 'i18next'
import classNames from 'classnames'
import {DateTime, Duration} from 'luxon'

export default function ShiftDuration({
  isDisabled,
  isGraceAllowed,
  checkInTime,
  checkOutTime,
  graceTime,
}) {
  const defaultDurationState = {
    inTime: '',
    outTime: '',
    inGraceTime: '',
    outGraceTime: '',
    shiftDuration: '',
  }
  const [duration, setDuration] = useState(defaultDurationState)

  useEffect(() => {
    if (isDisabled) {
      resetDurationInfo()
      return
    }
    let inTime, graceTimeDuration, inGraceTime, outTime, outGraceTime
    if (graceTime) {
      graceTimeDuration = Duration.fromObject({minutes: graceTime})
    }
    if (checkOutTime) {
      outTime = DateTime.fromFormat(checkOutTime, 'hh:mm a')
      outGraceTime = graceTimeDuration ? outTime.minus(graceTimeDuration) : ''
    }
    if (checkInTime) {
      inTime = DateTime.fromFormat(checkInTime, 'hh:mm a')
      inGraceTime = graceTimeDuration ? inTime.plus(graceTimeDuration) : ''
      setDuration({
        ...duration,
        inTime: inTime.toFormat('hh:mm a'),
        outTime: outTime ? outTime.toFormat('hh:mm a') : '',
        inGraceTime: inGraceTime ? inGraceTime.toFormat('hh:mm a') : '',
        outGraceTime: outGraceTime ? outGraceTime.toFormat('hh:mm a') : '',
        shiftDuration: outTime
          ? outTime
              .diff(inTime, ['hours', 'minutes'])
              .toHuman()
              ?.replace(', 0 minutes', '')
          : '',
      })
    }
  }, [checkInTime, checkOutTime, graceTime, isDisabled])

  const resetDurationInfo = () => {
    setDuration({
      ...duration,
      ...defaultDurationState,
    })
  }

  return (
    <div
      className={classNames(
        styles.wrapper,
        isDisabled ? styles.isDisabled : ''
      )}
    >
      <div className={styles.textWrapper}>
        <div className={classNames(styles.text, styles.shiftText)}>
          {t('shiftStarts')}
        </div>
        <div className={styles.dashedLineWrapper}>
          <div className={styles.dashedLine}></div>
          {duration?.shiftDuration && (
            <div className={styles.text}>{duration?.shiftDuration}</div>
          )}
          <div className={styles.dashedLine}></div>
        </div>
        <div className={classNames(styles.text, styles.shiftText)}>
          {t('shiftEnds')}
        </div>
      </div>
      <div className={styles.shiftDuration}>
        <div className={styles.inAndOutTime}></div>
        <div className={styles.inAndOutAnchor}>
          <div className={styles.time}> {duration?.inTime}</div>
        </div>
        {isGraceAllowed && (
          <div className={styles.graceTime}>{t('graceTime')}</div>
        )}
        {isGraceAllowed && (
          <div className={styles.graceAnchor}>
            <div className={styles.anchor}></div>
            <div className={classNames(styles.graceTimeValue, styles.text)}>
              {duration?.inGraceTime}
            </div>
          </div>
        )}
        <div className={styles.duration}></div>
        {isGraceAllowed && checkOutTime && (
          <div className={styles.graceAnchor}>
            <div className={styles.anchor}></div>
            <div className={classNames(styles.graceTimeValue, styles.text)}>
              {duration?.outGraceTime}
            </div>
          </div>
        )}
        {isGraceAllowed && checkOutTime && (
          <div className={styles.graceTime}>{t('graceTime')}</div>
        )}
        <div className={styles.inAndOutAnchor}>
          <div className={styles.time}> {duration?.outTime}</div>
        </div>
        <div className={styles.inAndOutTime}></div>
      </div>
    </div>
  )
}
