import React from 'react'
import styles from './ImportInProgress.module.css'
import {Icon, ICON_CONSTANTS} from '@teachmint/krayon'
import {useTranslation} from 'react-i18next'

export default function ImportInProgress() {
  const {t} = useTranslation()
  return (
    <div className={styles.inProgressContainer}>
      <Icon
        name="autoRenew"
        size={ICON_CONSTANTS.SIZES.LARGE}
        type={ICON_CONSTANTS.TYPES.WARNING}
      />
      <span className={styles.progressTitle}>{t('inProgressDuesTitle')}</span>
      <span className={styles.progressMessage}>
        {t('inProgressDuesMessage')}
        <br />
        {t('inProgressDuesMessageLine2')}
      </span>
    </div>
  )
}
