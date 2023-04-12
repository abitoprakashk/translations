import React from 'react'
import styles from './RecurringType.module.css'
import {useFeeStructure} from '../../../../redux/feeStructure/feeStructureSelectors'
import {
  CUSTOM_CATEGORY,
  FEE_STRUCTURE_TYPES_IDS,
} from '../../../../fees.constants'
import {Icon, Input} from '@teachmint/common'
import FormError from '../../../tfi-common/FormError/FormError'
import classNames from 'classnames'
import InputWithLabel from '../../../tfi-common/InputWithLabel/InputWithLabel'
import {useTranslation} from 'react-i18next'

export default function RecurringType({
  formValues,
  deleteTableRows,
  handleChange,
  formErrors,
}) {
  const {t} = useTranslation()
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
    const {master_id, tax, isDelete} = data

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
