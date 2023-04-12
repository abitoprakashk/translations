import {Divider, Para, PlainCard} from '@teachmint/krayon'
import classNames from 'classnames'
import {t} from 'i18next'
import React from 'react'
import styles from '../../../../../styles/StudentCard.module.css'

function StudentCard({item, index}) {
  return (
    <div key={index} className={styles.cardWrapper}>
      <PlainCard className={styles.mcard}>
        <div className={classNames(styles.flex, styles.column)}>
          <span className={styles.mtitle}>{item.name}</span>
          <span className={styles.mdesc}>{item.phone_number}</span>
        </div>
        <Divider classes={{wrapper: styles.mcardWrapper}} />
        <div className={classNames(styles.flex, styles.spaceBetween)}>
          <div className={classNames(styles.flex, styles.xgap4)}>
            <Para>{t('dayPresent')}:</Para>
            <Para className={classNames(styles.f12, styles.semibold)}>
              {item.attendance?.P}
            </Para>
          </div>
          <div className={classNames(styles.flex, styles.xgap4)}>
            <Para>{t('dayAbsent')}:</Para>
            <Para className={classNames(styles.f12, styles.semibold)}>
              {item.attendance?.A}
            </Para>
          </div>
        </div>
      </PlainCard>
    </div>
  )
}

export default StudentCard
