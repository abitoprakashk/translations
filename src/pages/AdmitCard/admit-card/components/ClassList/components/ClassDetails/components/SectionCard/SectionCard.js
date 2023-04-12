import {Icon} from '@teachmint/common'
import classNames from 'classnames'
import React from 'react'
import {t} from 'i18next'
import styles from './SectionCard.module.css'

export default function SectionCard({title, onViewClick}) {
  return (
    <div className={styles.wrapper} onClick={onViewClick}>
      <div className={classNames(styles.title, 'tm-hdg tm-hdg-24')}>
        {title}
      </div>
      <div className={styles.viewWrapper}>
        <div className={styles.view}>{t('admitCardView')}</div>
        <Icon
          color="primary"
          name="forwardArrow"
          size="xxs"
          type="filled"
          className={styles.viewIcon}
        />
      </div>
    </div>
  )
}
