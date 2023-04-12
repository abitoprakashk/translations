import React from 'react'
import {Icon, ICON_CONSTANTS} from '@teachmint/krayon'
import {useTranslation} from 'react-i18next'
import styles from './NoMatchingData.module.css'

function NoMatchingData({desc}) {
  const {t} = useTranslation()

  return (
    <div className={styles.wrapper}>
      <div className={styles.iconWrapper}>
        <Icon
          type={ICON_CONSTANTS.TYPES.BASIC}
          name="graph1"
          size={ICON_CONSTANTS.SIZES.X_SMALL}
          version="outlined"
        />
      </div>
      <div className={styles.subTitle}>
        <div>{t('noDataToShow')}</div>
        <div>{desc || t('noStudentsMatchingFilter')}</div>
      </div>
    </div>
  )
}

export default NoMatchingData
