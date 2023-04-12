import {EmptyState} from '@teachmint/krayon'
import React from 'react'
import {useTranslation} from 'react-i18next'
import styles from './NoDataComp.module.css'

export default function NoDataComp({msg}) {
  const {t} = useTranslation()
  return (
    <div className={styles.noDataSection}>
      <EmptyState
        iconName="error"
        content={msg ?? t('noData')}
        button={false}
      />
    </div>
  )
}
