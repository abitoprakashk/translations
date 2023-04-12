import React from 'react'
import styles from '../CollectBackdatedPaymentModal.module.css'
import {
  Alert,
  ALERT_CONSTANTS,
  Heading,
  HEADING_CONSTANTS,
  ICON_CONSTANTS,
} from '@teachmint/krayon'
import {t} from 'i18next'
import classNames from 'classnames'
import StepComp from '../StepComp/StepComp'
import {
  FILE_UPLOAD_ERROR_STATS_LABEL,
  HOW_TO_CORRECT_ERRORS_STEPS,
} from '../../../../fees.constants'
import {ErrorBoundary} from '@teachmint/common'
import {Trans} from 'react-i18next'

export default function ErrorInfo({
  invalidDataStats = {},
  successUpdateCount = 0,
}) {
  return (
    <ErrorBoundary>
      <div>
        {successUpdateCount > 0 && (
          <Alert
            className={styles.successAlert}
            content={
              <>
                <Trans i18nKey={'successfullCountMsg'}>
                  {{successfullCount: successUpdateCount}} backdated payment
                  rows successfully updated through CSV file
                </Trans>
              </>
            }
            type={ALERT_CONSTANTS.TYPE.SUCCESS}
            icon={'checkCircle'}
          />
        )}
        <Heading
          textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}
          className={classNames(styles.fontWeight500, styles.font14)}
        >
          {t('errorsInFileUploaded')}
        </Heading>
        <Alert
          className={styles.width100}
          content={
            <>
              <div className={styles.stepsSection}>
                {Object.keys(invalidDataStats).map((step) => {
                  return (
                    <StepComp
                      text={`${invalidDataStats[step] ?? ''} ${
                        FILE_UPLOAD_ERROR_STATS_LABEL[step]?.translate ?? ''
                      }`}
                      iconObj={{
                        name: 'caution',
                        type: ICON_CONSTANTS.TYPES.ERROR,
                        size: ICON_CONSTANTS.SIZES.XXX_SMALL,
                      }}
                      key={step}
                    />
                  )
                })}
              </div>
            </>
          }
          hideClose
          hideIcon
          type={ALERT_CONSTANTS.TYPE.ERROR}
        />
        <Heading
          className={classNames(
            styles.fontWeight500,
            styles.mt10,
            styles.font14
          )}
          textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}
        >
          {t('howToCorrectErrors')}?
        </Heading>
        <div className={styles.stepsSection}>
          {HOW_TO_CORRECT_ERRORS_STEPS.map((step) => {
            return (
              <StepComp
                text={step}
                isDot
                iconObj={{
                  name: 'error',
                  type: ICON_CONSTANTS.TYPES.WARNING,
                  size: ICON_CONSTANTS.SIZES.XXX_SMALL,
                }}
                key={step}
              />
            )
          })}
        </div>
      </div>
    </ErrorBoundary>
  )
}
