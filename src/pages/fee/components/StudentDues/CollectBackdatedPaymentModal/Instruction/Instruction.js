import React from 'react'
import styles from '../CollectBackdatedPaymentModal.module.css'
import {Heading} from '@teachmint/krayon'
import classNames from 'classnames'
import {
  COLLECT_BACKDATED_PAYMENT_SETPS_INSTALLMENT_WISE,
  COLLECT_BACKDATED_PAYMENT_SETPS_LUMPSUM,
  UPLOAD_BACKDATED_PAYMENT_OPTION_VALUES,
} from '../../../../fees.constants'
import {t} from 'i18next'
import StepComp from '../StepComp/StepComp'

export default function Instruction({
  selectedMode = UPLOAD_BACKDATED_PAYMENT_OPTION_VALUES.LUMPSUM_AMOUNT,
}) {
  return (
    <div>
      <Heading
        textSize="xx_s"
        className={classNames(styles.fontWeight500, styles.font14)}
      >
        {t('howToBulkUploadBackdatedPayments')}?
      </Heading>
      <div className={styles.stepsSection}>
        {(selectedMode === UPLOAD_BACKDATED_PAYMENT_OPTION_VALUES.LUMPSUM_AMOUNT
          ? COLLECT_BACKDATED_PAYMENT_SETPS_LUMPSUM
          : COLLECT_BACKDATED_PAYMENT_SETPS_INSTALLMENT_WISE
        ).dos.map((step) => {
          return (
            <StepComp
              text={step}
              iconObj={{
                name: 'checkCircle',
                type: 'success',
                size: 'xxx_s',
              }}
              key={step}
            />
          )
        })}
      </div>
      <Heading
        className={classNames(styles.fontWeight500, styles.mt10, styles.font14)}
        textSize="xx_s"
      >
        {t('donts')}
      </Heading>
      <div className={styles.stepsSection}>
        {(selectedMode === UPLOAD_BACKDATED_PAYMENT_OPTION_VALUES.LUMPSUM_AMOUNT
          ? COLLECT_BACKDATED_PAYMENT_SETPS_LUMPSUM
          : COLLECT_BACKDATED_PAYMENT_SETPS_INSTALLMENT_WISE
        ).donts.map((step) => {
          return (
            <StepComp
              text={step}
              iconObj={{name: 'error', type: 'warning', size: 'xxx_s'}}
              key={step}
            />
          )
        })}
      </div>
    </div>
  )
}
