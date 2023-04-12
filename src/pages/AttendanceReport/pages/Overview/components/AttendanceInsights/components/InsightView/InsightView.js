import {PlainCard, RangeSlider} from '@teachmint/krayon'
import {Divider, Heading, Para} from '@teachmint/krayon'
import React from 'react'
import {Trans, useTranslation} from 'react-i18next'
import {Link} from 'react-router-dom'
import {STUDENT_ATTENDANCE_INSIGHTS_VIEW_DETAILED_REPORTS} from '../../../../../../AttendanceReport.events.constant'
import AttendanceReportRoutes from '../../../../../../AttendanceReport.routes'
import useSendEvent from '../../../../../../hooks/useSendEvent'
import styles from './InsightView.module.css'

const RANGE = [0, 20, 40, 60, 80, 100]
function InsightView({sliderValue, setsliderValue, data, selectedFilter}) {
  const {t} = useTranslation()
  const sendEvent = useSendEvent()
  const handleSliderChange = ({selectedMax: maxVal}) => {
    setsliderValue(maxVal)
  }

  return (
    <PlainCard className={styles.wrapper}>
      <div className={styles.contentWrapper}>
        <Heading className={styles.title}>{data[sliderValue] || 0}</Heading>
        <div className={styles.subtitle}>
          <Trans i18nKey="lessthan">
            students have less than {sliderValue ? '' : 'or equal to'}
            <span>{{sliderValue}}%</span> Attendance
          </Trans>
        </div>
        <div className={styles.sliderWrapper}>
          <RangeSlider
            onChange={handleSliderChange}
            classes={{value: styles.value, wrapper: styles.slider}}
            preSelectedMax={sliderValue}
            max={100}
          />
          <div className={styles.sliderMarker}>
            {RANGE.map((int) => (
              <span key={int} data-val={int}>
                {int}
              </span>
            ))}
          </div>
        </div>
      </div>
      <Divider classes={{wrapper: styles.divider}} />
      <div className={styles.paraWrapper}>
        <Link
          onClick={() => {
            sendEvent(STUDENT_ATTENDANCE_INSIGHTS_VIEW_DETAILED_REPORTS, {
              sliderValue,
              selectedFilter,
            })
          }}
          to={`${AttendanceReportRoutes.studentAttendance.fullPath}?sliderValue=${sliderValue}&dateFilter=${selectedFilter}`}
        >
          <Para className={styles.highlight}>{t('viewDetailedReport')}</Para>
        </Link>
      </div>
    </PlainCard>
  )
}

export default InsightView
