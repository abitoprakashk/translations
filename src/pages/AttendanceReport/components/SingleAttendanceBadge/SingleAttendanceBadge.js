import {Badges, BADGES_CONSTANTS} from '@teachmint/krayon'
import React from 'react'
import {useTranslation} from 'react-i18next'
import styles from './styles.module.css'

function SingleAttendanceBadge({P, A}) {
  const {t} = useTranslation()
  if (P)
    return (
      <Badges
        label={t('present')}
        showIcon={false}
        type={BADGES_CONSTANTS.TYPE.SUCCESS}
        inverted
      />
    )
  if (A)
    return (
      <Badges
        label={t('absent')}
        showIcon={false}
        type={BADGES_CONSTANTS.TYPE.ERROR}
        inverted
      />
    )
  return (
    <Badges
      label={t('notMarkedSentenceCase')}
      inverted
      className={styles.notMarked}
      showIcon={false}
    />
  )
}

export default SingleAttendanceBadge
