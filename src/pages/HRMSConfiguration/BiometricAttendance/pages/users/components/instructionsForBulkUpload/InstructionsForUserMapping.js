import React from 'react'
import styles from '../../../../../../fee/components/StudentDues/CollectBackdatedPaymentModal/CollectBackdatedPaymentModal.module.css'
import {Heading} from '@teachmint/krayon'
import classNames from 'classnames'
import {t} from 'i18next'
import {Icon, ICON_CONSTANTS, Para, PARA_CONSTANTS} from '@teachmint/krayon'

export default function InstructionsForUserMapping() {
  const StepComp = ({
    text = '',
    iconObj = {
      name: 'checkCircle',
      type: ICON_CONSTANTS.TYPES.SUCCESS,
      size: ICON_CONSTANTS.SIZES.XXX_SMALL,
    },
    isDot = false,
    type = PARA_CONSTANTS.TYPE.TEXT_SECONDARY,
  }) => {
    return (
      <div className={styles.stepDiv}>
        {isDot ? (
          <div className={styles.dot}></div>
        ) : (
          <Icon name={iconObj.name} type={iconObj.type} size={iconObj.size} />
        )}
        <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM} type={type}>
          {text}
        </Para>
      </div>
    )
  }

  const STEPS_BEFORE_UPLOADING = {
    dos: [
      t('biometricDownloadEmployeeListCsvFileDos'),
      t('enterBiometricUserIdForMapping'),
      t('uploadTheUpdatedCsvFile'),
    ],
    donts: [
      t('doNotChangeTheEntriesInUidColumn'),
      t('biometricUserIDsShouldBeUnique'),
      t('doNotAddExtraRows'),
    ],
  }

  return (
    <div>
      <Heading
        textSize="m"
        className={classNames(styles.fontWeight500, styles.font14)}
      >
        {t('biometricBulkUploadInstructionsTitle')}?
      </Heading>
      <div className={styles.stepsSection}>
        {STEPS_BEFORE_UPLOADING.dos.map((step) => {
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
      <div className={styles.stepsSection}>
        {STEPS_BEFORE_UPLOADING.donts.map((step) => {
          return (
            <StepComp
              text={step}
              iconObj={{
                name: 'error',
                type: 'warning',
                size: 'xxx_s',
              }}
              key={step}
            />
          )
        })}
      </div>
    </div>
  )
}
