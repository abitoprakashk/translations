import React from 'react'
import styles from '../CollectBackdatedPaymentModal.module.css'
import {t} from 'i18next'
import Lottie from 'lottie-react'
import varifiedGreen from '../../../../../../utils/animations/lottie/varifiedGreen.json'

export default function SuccessComp({rowCount = 0}) {
  return (
    <div className={styles.successCompSection}>
      <div>
        <div className={styles.successLogo}>
          <div className={styles.lottieDiv}>
            <Lottie animationData={varifiedGreen} loop={true} />
          </div>
        </div>
        <div>{`${rowCount} ${t('feeEntriesUpdatedSuccessfully')}`}</div>
      </div>
    </div>
  )
}
