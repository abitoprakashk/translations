import React from 'react'
import styles from './AppDownloadNudge.module.css'
import PlayStore from '../../../assets/images/icons/googleplay-bg-black.svg'
import {useTranslation} from 'react-i18next'

const AppDownloadNudge = () => {
  const {t} = useTranslation()

  return (
    <div
      className={styles.container}
      onClick={() => (window.location.href = 'https://bit.ly/3cGD8oM')}
    >
      <div className={styles.textContainer}>
        <h4 className={styles.header}>{t('DownloadAppNudgeText')}</h4>
      </div>
      <div className={styles.downloadIconContainer}>
        <img
          src={PlayStore}
          className={styles.playstoreIcon}
          alt=""
          onClick={() => (window.location.href = 'https://bit.ly/3cGD8oM')}
        />
      </div>
    </div>
  )
}

export default AppDownloadNudge
