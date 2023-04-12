import classNames from 'classnames'
import React, {memo, useEffect, useRef} from 'react'
import {useTranslation} from 'react-i18next'
import styles from './AttendanceTrendComponent.module.css'

const AttendanceTrendComponent = memo(function AttendanceTrendComponent({
  data: {
    title = '',
    subTitle = '',
    value = 0,
    weeklyOff,

    notMarked,
  },
}) {
  const {t} = useTranslation()
  const ref = useRef(null)
  useEffect(() => {
    if (ref) {
      setTimeout(() => {
        if (ref?.current?.style) {
          ref.current.style.width =
            weeklyOff || notMarked ? '100%' : `${value < 18 ? 18 : value}%`
        }
      }, 100)
    }
  }, [ref, value, weeklyOff, notMarked])

  const getValue = () => {
    if (notMarked) {
      return (
        <div className={styles.slider} ref={ref}>
          {t('notMarkedSentenceCase')}
        </div>
      )
    } else if (weeklyOff) {
      return (
        <div className={styles.slider} ref={ref}>
          {t('Holiday')}
        </div>
      )
    } else
      return (
        <div className={styles.slider} ref={ref}>
          {value || 0}%
        </div>
      )
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>{title}</div>
      <div className={styles.subtitle}>{subTitle}</div>
      <div
        className={classNames(styles.sliderWrapper, {
          [styles.red]: value < 70,
          [styles.green]: value >= 70,
          [styles.weeklyOff]: weeklyOff || notMarked,
        })}
      >
        {getValue()}
      </div>
    </div>
  )
})

export default AttendanceTrendComponent
