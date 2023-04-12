import React from 'react'
import {Divider, Para, PlainCard} from '@teachmint/krayon'
import classNames from 'classnames'
import {t} from 'i18next'
import AttendanceBadge from '../../../../../components/AttendanceBadge/AttendanceBadge'
import styles from '../../../../../styles/StudentCard.module.css'

function StudentCard({item, index}) {
  return (
    <div key={index} className={styles.cardWrapper}>
      <PlainCard className={styles.mcard}>
        <div className={classNames(styles.flex, styles.column)}>
          <span className={styles.mtitle}>{item.formattedDate}</span>
          <Divider classes={{wrapper: styles.mcardWrapper}} />
          <div className={classNames(styles.flex, styles.column, styles.gap8)}>
            <div className={classNames(styles.flex, styles.spaceBetween)}>
              <Para>{t('markedClasses')}</Para>
              <Para className={classNames(styles.f12, styles.semibold)}>
                {item.marked}
              </Para>
            </div>
            <div className={classNames(styles.flex, styles.spaceBetween)}>
              <Para>{t('notMarkedClasses')}</Para>
              <Para className={classNames(styles.f12, styles.semibold)}>
                {item.not_marked}
              </Para>
            </div>
            <div className={classNames(styles.flex, styles.spaceBetween)}>
              <Para>{t('instituteAttendance')}</Para>
              <AttendanceBadge {...item} />
            </div>
          </div>
        </div>
      </PlainCard>
    </div>
  )
}

export default StudentCard
