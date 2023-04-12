import React from 'react'
import styles from './SubTitleBar.module.css'
import {useTranslation} from 'react-i18next'

const SubTitleBar = ({titleInfo}) => {
  const {t} = useTranslation()

  return (
    <div className={styles.titleSection}>
      <h3 className={styles.headerTitleText}>{t(titleInfo.title)}</h3>
      {titleInfo.subTitle && (
        <span className={styles.headerSubTitleText}>
          {t(titleInfo.subTitle)}
        </span>
      )}
    </div>
  )
}

export default SubTitleBar
