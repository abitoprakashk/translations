import {Divider, Para, PlainCard} from '@teachmint/krayon'
import classNames from 'classnames'
import {t} from 'i18next'
import React from 'react'
import AttendanceBadge from '../../../../../components/AttendanceBadge/AttendanceBadge'
import styles from '../../../../../styles/StudentCard.module.css'

function StudentCard({item, index}) {
  return (
    <div key={index} className={styles.cardWrapper}>
      <PlainCard className={styles.mcard}>
        <div className={classNames(styles.flex, styles.spaceBetween)}>
          <div className={classNames(styles.flex, styles.column)}>
            <span className={styles.mtitle}>{item.name}</span>
            <span className={styles.mdesc}>
              {t('strength')}
              {': '}
              <span className={styles.semibold}>{item.strength || 0}</span>
            </span>
          </div>
          <div>
            <AttendanceBadge {...item} />
          </div>
        </div>
        <Divider classes={{wrapper: styles.mcardWrapper}} />
        <div className={classNames(styles.flex, styles.spaceBetween)}>
          <div className={classNames(styles.flex, styles.xgap4)}>
            <Para className={styles.f12}>{t('present')}:</Para>
            <Para className={classNames(styles.f12, styles.semibold)}>
              {item.P || '-'}
            </Para>
          </div>
          <div className={classNames(styles.flex, styles.xgap4)}>
            <Para className={styles.f12}>{t('absent')}:</Para>
            <Para className={classNames(styles.f12, styles.semibold)}>
              {item.A || '-'}
            </Para>
          </div>
        </div>
      </PlainCard>
    </div>
  )
}

export default StudentCard
