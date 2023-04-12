import {Icon, IconFrame, ICON_CONSTANTS, Para} from '@teachmint/krayon'
import React from 'react'
import {useTranslation} from 'react-i18next'
import styles from './NoData.module.css'

function NoData({desc}) {
  const {t} = useTranslation()
  return (
    <div className={styles.wrapper}>
      <IconFrame className={styles.iconWrapper} type="basic">
        <Icon
          name="pieChart"
          version={ICON_CONSTANTS.VERSION.FILLED}
          className={styles.icon}
        />
      </IconFrame>
      <Para className={styles.para}>{desc || t('attendanceNotMarkedYet')}</Para>
    </div>
  )
}

export default NoData
