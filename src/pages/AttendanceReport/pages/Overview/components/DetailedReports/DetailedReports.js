import {Badges, Icon, ICON_CONSTANTS, PlainCard} from '@teachmint/krayon'
import classNames from 'classnames'
import React from 'react'
import {useTranslation} from 'react-i18next'
import {Link} from 'react-router-dom'
import {
  STUDENT_ATTENDANCE_CLASSWISE_REPORTS,
  STUDENT_ATTENDANCE_STUDENTWISE_REPORTS,
} from '../../../../AttendanceReport.events.constant'
import AttendanceReportRoutes from '../../../../AttendanceReport.routes'
import useSendEvent from '../../../../hooks/useSendEvent'
import styles from './DetailedReports.module.css'

const cardData = [
  {
    title: 'studentWiseAttendance',
    desc: 'studentWiseAttendanceDesc',
    icon: 'students',
    iconclassName: styles.students,
    path: AttendanceReportRoutes.studentAttendance.fullPath,
    event: STUDENT_ATTENDANCE_STUDENTWISE_REPORTS,
  },
  {
    title: 'classWiseAttendance',
    desc: 'classWiseAttendanceDesc',
    icon: 'schoolCap',
    iconclassName: styles.schoolCap,
    path: AttendanceReportRoutes.classAttendance.fullPath,
    event: STUDENT_ATTENDANCE_CLASSWISE_REPORTS,
    // comingSoon: true,
  },
]
function DetailedReports() {
  const {t} = useTranslation()
  const sendEvent = useSendEvent()
  return (
    <div>
      <div className={classNames(styles.title, styles.mb)}>
        {t('detailedReports')}
      </div>
      <div className={styles.cardWrapper}>
        {cardData.map((card) => (
          <Link
            onClick={(e) => {
              if (card.comingSoon) {
                e.preventDefault()
              }
              sendEvent(card.event)
            }}
            className={classNames(styles.link, {
              [styles.comingSoon]: card.comingSoon,
            })}
            key={card.title}
            to={card.path}
          >
            <PlainCard key={card.icon} className={styles.card}>
              <div className={styles.infoWrapper}>
                <Icon
                  type={ICON_CONSTANTS.TYPES.INVERTED}
                  className={classNames(card.iconclassName, styles.iconWrapper)}
                  name={card.icon}
                  size={ICON_CONSTANTS.SIZES.XX_SMALL}
                />
                <div className={styles.titleWrapper}>
                  <div className={styles.title}>{t(card.title)}</div>
                  <div className={styles.desc}>{t(card.desc)}</div>
                </div>
              </div>
              {card.comingSoon ? (
                <Badges
                  className={styles.comingSoonBadge}
                  label="Coming Soon!"
                  showIcon={false}
                  type="primary"
                />
              ) : (
                <Icon
                  name={'forwardArrow'}
                  size={ICON_CONSTANTS.SIZES.XX_SMALL}
                />
              )}
            </PlainCard>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default DetailedReports
