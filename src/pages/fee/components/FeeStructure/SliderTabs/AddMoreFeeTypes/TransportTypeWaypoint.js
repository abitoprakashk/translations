import React from 'react'
import classNames from 'classnames'
import {useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {Icon, Input} from '@teachmint/common'
import styles from './TransportTypeWaypoint.module.css'
import FormError from '../../../tfi-common/FormError/FormError'
import InputWithLabel from '../../../tfi-common/InputWithLabel/InputWithLabel'
import {useFeeStructure} from '../../../../redux/feeStructure/feeStructureSelectors'
import {getSymbolFromCurrency} from '../../../../../../utils/Helpers'
import {DEFAULT_CURRENCY} from '../../../../../../constants/common.constants'

export default function TransportTypeWaypoint({
  formValues,
  formErrors,
  handleChange,
  deleteTableRows,
  calculateRowTotal,
}) {
  const {t} = useTranslation()
  const {instituteInfo} = useSelector((state) => state)
  const rowsData = formValues.fee_categories
  const {pickupPoints} = useFeeStructure()
  const filteredPickupPoints = pickupPoints.map((pickupPoint) => {
    return {
      label: pickupPoint.name,
      value: pickupPoint._id,
    }
  })

  return rowsData.map((data, index) => {
    const {pickup, amount, isDelete} = data

    return (
      <tr className={classNames({hidden: isDelete})} key={index}>
        <td className={styles.td}>
          <Input
            type="select"
            fieldName="pickup"
            value={pickup}
            options={filteredPickupPoints}
            onChange={(e) => handleChange(e, index)}
            classes={{wrapper: styles.inputWrapper}}
            className={styles.dropdownClass}
          />
          <FormError
            errorMessage={
              formErrors.fee_categories && formErrors.fee_categories[index]
                ? formErrors.fee_categories[index].pickup
                : ''
            }
          />
        </td>
        <td>
          <div className={styles.inputWrapper}>
            <InputWithLabel
              value={amount}
              inputPrefix={getSymbolFromCurrency(
                instituteInfo.currency || DEFAULT_CURRENCY
              )}
              fieldName="amount"
              maxLength={7}
              placeholder={t('eg3000')}
              inputPostfix={t('perInstallment')}
              inputWrapperClassName={styles.amount}
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
        <td>{calculateRowTotal(amount)}</td>
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
