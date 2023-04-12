import React from 'react'
import {Icon, Input} from '@teachmint/common'
import {useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import styles from './OnetimeType.module.css'
import classNames from 'classnames'
import FormError from '../../../tfi-common/FormError/FormError'
import {
  CUSTOM_CATEGORY,
  FEE_STRUCTURE_TYPES_IDS,
} from '../../../../fees.constants'
import InputWithLabel from '../../../tfi-common/InputWithLabel/InputWithLabel'
import {useFeeStructure} from '../../../../redux/feeStructure/feeStructureSelectors'
import {getSymbolFromCurrency} from '../../../../../../utils/Helpers'
import {DEFAULT_CURRENCY} from '../../../../../../constants/common.constants'

export default function OnetimeType({
  formValues,
  formErrors,
  handleChange,
  calculateRowTotal,
  deleteTableRows,
}) {
  const {t} = useTranslation()
  const {instituteInfo} = useSelector((state) => state)
  const rowsData = formValues.fee_categories
  const {feeTypes} = useFeeStructure()
  let filteredFeeTypes = feeTypes
    .filter((category) => {
      return category.type !== FEE_STRUCTURE_TYPES_IDS.TRANSPORT_FEE
    })
    // Filter repetitive fee categories
    // .filter(
    //   (category) =>
    //     !formValues.fee_categories
    //       .map((type) => type.master_id)
    //       .includes(category._id)
    // )
    .map((category) => {
      return {
        label: category.name,
        value: category._id,
      }
    })
  filteredFeeTypes.push({
    label: CUSTOM_CATEGORY.text,
    value: CUSTOM_CATEGORY.value,
  })

  return rowsData.map((data, index) => {
    const {master_id, amount, tax, isDelete} = data

    return (
      <tr className={classNames({hidden: isDelete})} key={index}>
        <td className={styles.td}>
          <Input
            type="select"
            fieldName="master_id"
            value={master_id}
            options={filteredFeeTypes}
            onChange={(e) => handleChange(e, index)}
            classes={{wrapper: styles.inputWrapper}}
            optionsBoxClassName={'show-scrollbar show-scrollbar-small'}
          />
          <FormError
            errorMessage={
              formErrors.fee_categories && formErrors.fee_categories[index]
                ? formErrors.fee_categories[index].master_id
                : ''
            }
          />
        </td>
        <td>
          <div className={styles.inputWrapper}>
            <InputWithLabel
              inputPrefix={getSymbolFromCurrency(
                instituteInfo.currency || DEFAULT_CURRENCY
              )}
              fieldName="amount"
              value={amount}
              maxLength={7}
              inputWrapperClassName={styles.amount}
              placeholder={t('eg3000')}
              onChange={(e) => handleChange(e, index)}
            />
          </div>
          <FormError
            errorMessage={
              formErrors.fee_categories && formErrors.fee_categories[index]
                ? formErrors.fee_categories[index].amount
                : ''
            }
          />
        </td>
        <td>
          <div className={styles.inputWrapper}>
            <InputWithLabel
              maxLength={4}
              fieldName="tax"
              value={tax}
              onChange={(e) => handleChange(e, index)}
              inputWrapperClassName={styles.taxPrefix}
              placeholder={t('taxPlaceholder')}
              inputPrefixClassName={styles.taxPrefix}
              inputPostfix={t('percentageSign')}
            />
          </div>
          <FormError
            errorMessage={
              formErrors.fee_categories && formErrors.fee_categories[index]
                ? formErrors.fee_categories[index].tax
                : ''
            }
          />
        </td>
        <td>{calculateRowTotal(amount, tax)}</td>
        <td>
          {formValues.fee_categories.filter((category) => {
            return !category.isDelete
          }).length > 1 && (
            <div
              className={styles.deleteIcon}
              onClick={() => deleteTableRows(index)}
            >
              <Icon name="close" size="s" color="error" />
            </div>
          )}
        </td>
      </tr>
    )
  })
}
