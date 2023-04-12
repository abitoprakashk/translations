import React from 'react'
import styles from './RecordFeeTypeSelection.module.css'
import {Radio, Para, Divider, PARA_CONSTANTS} from '@teachmint/krayon'
import {getAmountFixDecimalWithCurrency} from '../../../../../../../../utils/Helpers'
import {
  collectFeeOptionsEvents,
  collectFeeOptionsIds,
} from '../../../../../../fees.constants'
import {useSelector} from 'react-redux'
import {t} from 'i18next'
import {events} from '../../../../../../../../utils/EventsConstants'
import {ErrorBoundary} from '@teachmint/common'

export function RecordFeeTypeSelection({
  selectedRecordType,
  changeSelectedRecordType,
  dueAmount,
  dueTillAmount,
  sendClickEvent,
}) {
  const instituteInfo = useSelector((state) => state.instituteInfo)
  return (
    <ErrorBoundary>
      <div className={styles.recordTypeWrapper}>
        <div className={styles.recordTypeSection}>
          <span className={styles.title}>{t('recordBy')}</span>
          <div className={styles.recordTypes}>
            <Radio
              fieldName="recordBy"
              handleChange={() => {
                sendClickEvent(events.RECORD_BY_TYPE_TFI, {
                  type: collectFeeOptionsEvents.BY_LUMPSUM_AMOUNT,
                })
                changeSelectedRecordType(collectFeeOptionsIds.BY_LUMPSUM_AMOUNT)
              }}
              isSelected={
                collectFeeOptionsIds.BY_LUMPSUM_AMOUNT == selectedRecordType
                  ? true
                  : false
              }
              label={t('recordByLumpSumLabel')}
            />
            <Radio
              fieldName="recordBy"
              handleChange={() => {
                sendClickEvent(events.RECORD_BY_TYPE_TFI, {
                  type: collectFeeOptionsEvents.BY_FEE_STRUCTURE,
                })
                changeSelectedRecordType(collectFeeOptionsIds.BY_FEE_STRUCTURE)
              }}
              isSelected={
                collectFeeOptionsIds.BY_FEE_STRUCTURE == selectedRecordType
                  ? true
                  : false
              }
              label={t('recordByInstallmentLabel')}
            />
          </div>
        </div>
        <Divider isVertical length="40px" spacing="10px" thickness="2px" />
        <div className={styles.dueTillDateSection}>
          <div className={styles.dueTillDate}>
            <Para
              textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}
              type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
              className={styles.title}
            >
              {t('totalDue')}
            </Para>
            <Para
              textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}
              type={PARA_CONSTANTS.TYPE.ERROR}
              className={styles.title}
            >
              {getAmountFixDecimalWithCurrency(
                dueAmount || 0,
                instituteInfo.currency
              )}
            </Para>
          </div>
          <Divider isVertical length="40px" spacing="10px" thickness="2px" />
          <div className={styles.dueTillDate}>
            <Para
              textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}
              type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
              className={styles.title}
            >
              {t('dueTillDate')}
            </Para>
            <Para
              textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}
              type={PARA_CONSTANTS.TYPE.ERROR}
              className={styles.title}
            >
              {getAmountFixDecimalWithCurrency(
                dueTillAmount || 0,
                instituteInfo.currency
              )}
            </Para>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
