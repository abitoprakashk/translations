import {Icon, IconFrame, Para} from '@teachmint/krayon'
import React from 'react'
import {useTranslation} from 'react-i18next'
import styles from './NoChartData.module.css'

function NoChartData() {
  const {t} = useTranslation()
  return (
    <div className={styles.wrapper}>
      <IconFrame className={styles.iconWrapper} type="basic">
        <Icon name="people2" className={styles.icon} />
      </IconFrame>
      <Para className={styles.para}>{t('attendanceNotMarkedYet')}</Para>
    </div>
  )
}

export default NoChartData
