import React from 'react'
import {DateTime} from 'luxon'
import classNames from 'classnames'
import {Table} from '@teachmint/common'
import {useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import styles from './Amount.module.css'
import FormError from '../../tfi-common/FormError/FormError'
import {numericRegex} from '../../../../../utils/Validations'
import {getAmountFixDecimalWithCurrency} from '../../../../../utils/Helpers'
import InputWithLabel from '../../tfi-common/InputWithLabel/InputWithLabel'
import {useFeeStructure} from '../../../redux/feeStructure/feeStructureSelectors'
import {getSymbolFromCurrency} from '../../../../../utils/Helpers'
import {DEFAULT_CURRENCY} from '../../../../../constants/common.constants'

export default function Amount({formValues, formErrors, handleChange, hidden}) {
  const {t} = useTranslation()
  const {instituteInfo} = useSelector((state) => state)
  const {feeTypes} = useFeeStructure()
  const filteredFeeTypes = {}
  feeTypes.forEach((type) => {
    filteredFeeTypes[type._id] = type.name
  })

  const handleAmountChange = (
    {fieldName, value, event},
    month,
    masterId,
    isFirstRow
  ) => {
    if (!numericRegex(value)) {
      return false
    }
    const newFeeCategories = formValues.fee_categories.map((category) => {
      if (category.master_id === masterId) {
        if (isFirstRow) {
          let newTimestamps = {}
          Object.values(formValues.schedule_timestamps).forEach((timestamp) => {
            newTimestamps[timestamp] = value ? parseInt(value) : 0
          })
          return {
            ...category,
            schedule: newTimestamps,
          }
        } else {
          return {
            ...category,
            schedule: {
              ...category.schedule,
              [formValues.schedule_timestamps[month]]: value
                ? parseInt(value)
                : 0,
            },
          }
        }
      }
      return category
    })
    handleChange({fieldName, value: newFeeCategories, event})
  }

  const getTotalFees = () => {
    let totalFees = {
      installments: (
        <div className={styles.totalAmountHeading}>{t('totalFees')}</div>
      ),
    }
    formValues.fee_categories
      .filter((category) => !category.isDelete)
      .forEach((category) => {
        totalFees[category.master_id] = (
          <div className={styles.totalAmount}>
            {getAmountFixDecimalWithCurrency(
              Object.values(category.schedule).reduce(
                (total, amount) => total + (amount ? parseInt(amount) : 0),
                0
              ),
              instituteInfo.currency
            )}
          </div>
        )
      })
    return totalFees
  }

  const getTotalTax = () => {
    let totalTax = {
      installments: (
        <div className={styles.totalAmountHeading}>{t('totalTax')}</div>
      ),
    }
    formValues.fee_categories
      .filter((category) => !category.isDelete)
      .forEach((category) => {
        totalTax[category.master_id] = (
          <div className={styles.totalAmount}>
            {getAmountFixDecimalWithCurrency(
              Object.values(category.schedule).reduce(
                (total, amount) =>
                  total +
                  (amount && category.tax
                    ? (parseFloat(amount) * parseFloat(category.tax)) / 100
                    : 0),
                0
              ),
              instituteInfo.currency
            )}
          </div>
        )
      })
    return totalTax
  }

  const getTotalFeesWithTax = () => {
    let totalFees = {
      installments: (
        <div className={styles.totalAmountHeading}>
          {t('totalFeeIncludingTax')}
        </div>
      ),
    }
    formValues.fee_categories
      .filter((category) => !category.isDelete)
      .forEach((category) => {
        totalFees[category.master_id] = (
          <div className={styles.totalAmount}>
            {getAmountFixDecimalWithCurrency(
              Object.values(category.schedule).reduce(
                (total, amount) =>
                  total +
                  (amount
                    ? category.tax
                      ? parseInt(amount) +
                        (parseFloat(amount) * parseFloat(category.tax)) / 100
                      : parseInt(amount)
                    : 0),
                0
              ),
              instituteInfo.currency
            )}
          </div>
        )
      })
    return totalFees
  }

  let tableCols = [
    {
      key: 'installments',
      label: (
        <div className={styles.feeCategoryName}>
          {t('amountTableInstallment')}
        </div>
      ),
    },
    {
      key: 'totalAmount',
      label: <div className={styles.totalAmount}>{t('amountTableTotal')}</div>,
    },
  ]
  formValues.fee_categories
    .filter((category) => category.master_id && !category.isDelete)
    .forEach((category) => {
      tableCols.push({
        key: category.master_id,
        label: (
          <>
            <div className={styles.feeCategoryName}>
              {filteredFeeTypes[category.master_id]}
            </div>
            {category.tax ? '(' + category.tax + '% Tax)' : ''}
          </>
        ),
      })
    })

  let tableRows = []
  Object.keys(formValues.schedule_timestamps)
    .sort((a, b) => {
      return (
        formValues.schedule_timestamps[a] - formValues.schedule_timestamps[b]
      )
    })
    .forEach((month, i) => {
      let categoryAmount = {
        installments:
          month in formValues.schedule_timestamps
            ? DateTime.fromSeconds(
                formValues.schedule_timestamps[month]
              ).toFormat('d MMM yyyy')
            : '',
        totalAmount: (
          <div className={styles.totalAmount}>
            {getAmountFixDecimalWithCurrency(
              formValues.fee_categories
                .filter((category) => !category.isDelete)
                .reduce(
                  (total, {schedule}) =>
                    total +
                    (schedule[formValues.schedule_timestamps[month]]
                      ? parseInt(
                          schedule[formValues.schedule_timestamps[month]]
                        )
                      : 0),
                  0
                ),
              instituteInfo.currency
            )}
          </div>
        ),
      }
      formValues.fee_categories.forEach((category) => {
        categoryAmount[category.master_id] = (
          <InputWithLabel
            inputPrefix={getSymbolFromCurrency(
              instituteInfo.currency || DEFAULT_CURRENCY
            )}
            fieldName="fee_categories"
            placeholder={i === 0 ? t('eg3000') : ''}
            maxLength={7}
            value={category.schedule[formValues.schedule_timestamps[month]]}
            inputClassName={styles.inputWrapper}
            onChange={(e) =>
              handleAmountChange(e, month, category.master_id, i === 0)
            }
          />
        )
      })
      tableRows.push(categoryAmount)
    })
  let totalFees = {
    installments: (
      <div className={styles.totalAmountHeading}>
        {t('totalFeeIncludingTax')}
      </div>
    ),
  }
  formValues.fee_categories
    .filter((category) => !category.isDelete)
    .forEach((category) => {
      totalFees[category.master_id] = (
        <div className={styles.totalAmount}>
          {getAmountFixDecimalWithCurrency(
            Object.values(category.schedule).reduce(
              (total, amount) =>
                total +
                (amount
                  ? category.tax
                    ? parseInt(amount) +
                      (parseFloat(amount) * parseFloat(category.tax)) / 100
                    : parseInt(amount)
                  : 0),
              0
            ),
            instituteInfo.currency
          )}
        </div>
      )
    })
  tableRows.push(getTotalFees())
  tableRows.push(getTotalTax())
  tableRows.push(getTotalFeesWithTax())

  return (
    <div className={classNames(styles.scroll, {hidden: hidden})}>
      {t('amountTabTitle')}
      <div className={styles.note}>{t('amountTabTitleNote')}</div>
      <FormError errorMessage={formErrors.amount} />
      {formValues.fee_categories.filter(
        (category) => category.master_id && !category.isDelete
      ).length === 0 ||
      Object.keys(formValues.schedule_timestamps).length === 0 ? (
        <div className={styles.noAmount}>
          <FormError
            errorMessage={t('selectFeeCategoriesAndDueDatesToFillTheAmount')}
          />
        </div>
      ) : (
        <Table
          style={{
            width: (tableCols.length > 6 ? 100 : tableCols.length * 15) + '%',
          }}
          className={styles.table}
          cols={tableCols}
          rows={tableRows}
        />
      )}
    </div>
  )
}
