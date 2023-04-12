import React from 'react'
import classNames from 'classnames'
import {Icon} from '@teachmint/common'
import {useTranslation} from 'react-i18next'
import {
  NO_ACTIVITY,
  REPORT_DOWNLOAD_HISTORY_WILL_APPEAR_HERE,
} from '../../../../../../pages/fee/fees.constants'
import styles from './NoActivity.module.css'

export default function NoActivity() {
  const {t} = useTranslation()
  return (
    <div className={styles.section}>
      <div>
        <Icon
          color="secondary"
          name="document"
          size="4xl"
          type="filled"
          className={classNames(styles.higherSpecificity, styles.icon)}
        />
      </div>
      <div className={styles.noActivityTextSection}>
        <div className={styles.noActivityText}>{t(NO_ACTIVITY)}</div>
      </div>
      <div className={styles.noActivitySubText}>
        {t(REPORT_DOWNLOAD_HISTORY_WILL_APPEAR_HERE)}
      </div>
    </div>
  )
}
