import React, {useCallback} from 'react'
import styles from './DateWiseHistory.module.css'
import CalloutCard from '../../../CalloutCard/CalloutCard'
import {Icon} from '@teachmint/common'
import {Alert, Table} from '@teachmint/krayon'
import {useTranslation} from 'react-i18next'
import classNames from 'classnames'
import {
  FEE_UPDATE_HISTORY_DEFAULT_TABLE_COLS,
  UPDATE_HISTORY_TYPE,
} from '../../../../FeeTabConstant'
import {DateTime} from 'luxon'
import {useFeeStructure} from '../../../../../../../../pages/fee/redux/feeStructure/feeStructureSelectors'
import {getAmountFixDecimalWithCurrency} from '../../../../../../../../utils/Helpers'

export default function DateWiseHistory({selectedRecord = null}) {
  if (!selectedRecord) return null
  const {t} = useTranslation()
  const {feeTypes} = useFeeStructure()

  const amountDiff = useCallback(() => {
    return selectedRecord?.current_fee - selectedRecord?.previous_fee
  }, [selectedRecord])

  const tableCols = useCallback(() => {
    return FEE_UPDATE_HISTORY_DEFAULT_TABLE_COLS
  }, [selectedRecord])

  const summary = [
    {
      title: (
        <span>
          {getAmountFixDecimalWithCurrency(selectedRecord?.previous_fee)}
        </span>
      ),
      subText: t('previousFee'),
    },
    {
      title: (
        <div className={styles.amountChangedSection}>
          <span>
            {getAmountFixDecimalWithCurrency(selectedRecord?.amount_changed)}{' '}
          </span>{' '}
          <div
            className={classNames({
              [styles.downTransform]: amountDiff() < 0,
              [styles.upTransform]: amountDiff() > 0,
            })}
          >
            {amountDiff() !== 0 && (
              <Icon
                name="play1"
                size="xxxs"
                color={amountDiff() < 0 ? 'error' : 'success'}
              />
            )}
          </div>
        </div>
      ),
      subText: t('amountChanged'),
    },
    {
      title: (
        <span>
          {getAmountFixDecimalWithCurrency(selectedRecord?.current_fee)}
        </span>
      ),
      subText: t('currentFee'),
    },
  ]

  const rows = selectedRecord?.change_logs.map((rowData, idx) => {
    let feeType = feeTypes.find(
      (item) => item._id === rowData.category_master_id
    )
    return {
      id: `${rowData.id}${idx}`,
      installment: DateTime.fromSeconds(+rowData.installment_date).toFormat(
        `d LLL yyyy`
      ),
      feeType: feeType ? feeType?.name : '-',
      previousFee: getAmountFixDecimalWithCurrency(rowData.old_amount),
      currentFee: getAmountFixDecimalWithCurrency(rowData.new_amount),
    }
  })

  return (
    <div className={styles.section}>
      <div className={styles.calloutCardSection}>
        {summary.map((item) => (
          <CalloutCard
            key={item.subText}
            text={item.title}
            subText={item.subText}
          />
        ))}
      </div>
      <div>
        <Alert
          content={
            <div>
              <span className={styles.updatedByName}>
                {UPDATE_HISTORY_TYPE[selectedRecord?.source]}
              </span>{' '}
              updated by{' '}
              <span className={styles.updatedByName}>
                {selectedRecord.alterant_name}
              </span>{' '}
              on{' '}
              {DateTime.fromSeconds(
                selectedRecord?.history_update_timestamp
              ).toFormat(`d LLL yyyy`)}
            </div>
          }
          hideClose
          type="success"
          className={styles.alertComp}
        />
      </div>
      <div>
        <Table rows={rows} cols={tableCols()} isSelectable={false} />
      </div>
    </div>
  )
}
