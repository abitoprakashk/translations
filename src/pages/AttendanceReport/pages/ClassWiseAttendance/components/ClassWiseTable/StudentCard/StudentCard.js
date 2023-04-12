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
          <span className={classNames(styles.mdesc)}>
            {t('strength')}
            {`: `}
            <span className={styles.semibold}>{item.strength || 0}</span>
          </span>
          <Divider classes={{wrapper: styles.mcardWrapper}} />
          <div className={classNames(styles.flex, styles.spaceBetween)}>
            <div className={classNames(styles.flex, styles.xgap4)}>
              <Para>{t('studentsPresent')}:</Para>
              <Para className={classNames(styles.f12, styles.semibold)}>
                {item.P || '-'}
              </Para>
            </div>
            <div className={classNames(styles.flex, styles.xgap4)}>
              <Para>{t('studentsAbsent')}:</Para>
              <Para className={classNames(styles.f12, styles.semibold)}>
                {item.A || '-'}
              </Para>
            </div>
          </div>
        </div>
      </PlainCard>
    </div>
  )
}

export default StudentCard
