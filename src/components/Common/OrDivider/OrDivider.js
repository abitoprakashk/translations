import React from 'react'
import styles from './OrDivider.module.scss'
import {useTranslation} from 'react-i18next'

const OrDivider = () => {
  const {t} = useTranslation()
  return (
    <div className={styles.or}>
      <span>{t('or')}</span>
      <hr />
    </div>
  )
}

export default OrDivider
