import React from 'react'
import styles from './MainTitleBar.module.css'
import {useTranslation} from 'react-i18next'

const MainTitleBar = (props) => {
  const {t} = useTranslation()
  return <h2 className={styles.mainTitleText}>{t(props.titleInfo)}</h2>
}

export default MainTitleBar
