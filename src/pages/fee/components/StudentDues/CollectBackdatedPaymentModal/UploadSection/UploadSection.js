import React from 'react'
import styles from '../CollectBackdatedPaymentModal.module.css'
import {ErrorBoundary} from '@teachmint/common'
import {
  Alert,
  ALERT_CONSTANTS,
  Divider,
  Heading,
  HEADING_CONSTANTS,
  Input,
  Radio,
} from '@teachmint/krayon'
import {t} from 'i18next'
import {events} from '../../../../../../utils/EventsConstants'
import {UPLOAD_BACKDATED_PAYMENT_OPTION_MAP} from '../../../../fees.constants'

export default function UploadSection({
  invalidData = null,
  buttonLoader,
  csvErrors,
  selectedMode,
  eventManager = {},
  feeTypeList = [],
  handleDownloadSampleCsv = () => {},
  handleOnChangeCsv = () => {},
  handleSheetUpload = () => {},
  handleValidateCsv = () => {},
  handleSelectMode = () => {},
}) {
  return (
    <div className={styles.leftSection}>
      {feeTypeList.length === 0 ? (
        <Alert
          content={t('noFeeTypeListMsg')}
          hideClose
          type={ALERT_CONSTANTS.TYPE.ERROR}
          className={styles.inputWarpper}
        />
      ) : (
        <>
          <div>
            <ErrorBoundary>
              <Heading
                textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}
                className={styles.fontWeight500}
              >
                {!invalidData && (
                  <div className={styles.paymentOptions}>
                    {Object.values(UPLOAD_BACKDATED_PAYMENT_OPTION_MAP).map(
                      ({value, label}) => {
                        return (
                          <div key={`uploadBackdatedOption_${value}`}>
                            <Radio
                              fieldName={value}
                              isSelected={selectedMode === value ? true : false}
                              label={t(label)}
                              handleChange={() => {
                                handleSelectMode(value)
                              }}
                              classes={{
                                wrapper: styles.radioWrapper,
                              }}
                            />
                          </div>
                        )
                      }
                    )}
                  </div>
                )}
                <span>
                  {invalidData
                    ? t('toDownloadTheFileWithStatusColumn')
                    : t('downloadTheStudentList')}
                </span>
                <span
                  onClick={() => {
                    handleDownloadSampleCsv(invalidData ? true : false)
                  }}
                  className={styles.clickHereSpan}
                >
                  {t('csvFile')}
                </span>{' '}
              </Heading>
            </ErrorBoundary>
          </div>
          <Divider length="100" spacing="40" thickness="1px" />
          <div style={buttonLoader ? {pointerEvents: 'none'} : {}}>
            <Input
              id="csvUpload"
              fieldName="file"
              isRequired
              showLoader={false}
              onChange={(obj) => {
                if (handleOnChangeCsv(obj)) {
                  eventManager.send_event(
                    events.FEE_BACKDATED_ADD_FILE_CLICKED_TFI
                  )
                  handleSheetUpload(obj.value, false, handleValidateCsv)
                }
              }}
              placeholder={t('filecsv')}
              showMsg={csvErrors}
              infoType={csvErrors ? 'error' : ''}
              infoMsg={csvErrors}
              title={t('uploadCsvFileText')}
              type="file"
              fileProps={{accept: '.csv'}}
              classes={{
                wrapper: styles.inputWarpper,
                fileName: styles.textOverflowEllipsis,
              }}
              actionName={t('chooseFile')}
            />
          </div>
        </>
      )}
    </div>
  )
}
