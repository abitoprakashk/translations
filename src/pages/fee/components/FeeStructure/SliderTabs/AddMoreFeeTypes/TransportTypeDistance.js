import React from 'react'
import {useSelector} from 'react-redux'
import styles from './TransportTypeDistance.module.css'
import {Icon} from '@teachmint/common'
import FormError from '../../../tfi-common/FormError/FormError'
import classNames from 'classnames'
import InputWithLabel from '../../../tfi-common/InputWithLabel/InputWithLabel'
import {useTranslation} from 'react-i18next'
import {getSymbolFromCurrency} from '../../../../../../utils/Helpers'
import {DEFAULT_CURRENCY} from '../../../../../../constants/common.constants'

export default function TransportTypeDistance({
  formValues,
  deleteTableRows,
  handleChange,
  formErrors,
  handleDistanceChange,
  calculateRowTotal,
}) {
  const {t} = useTranslation()
  const {instituteInfo} = useSelector((state) => state)
  const rowsData = formValues.fee_categories

  return rowsData.map((data, index) => {
    const {distanceFrom, distanceTo, amount, isDelete} = data

    return (
      <tr className={classNames({hidden: isDelete})} key={index}>
        <td>
          <div className={styles.inputWrapper}>
            <InputWithLabel
              inputPrefix={distanceFrom + ' - '}
              inputPrefixClassName={styles.prefixClass}
              fieldName="distanceTo"
              value={distanceTo}
              placeholder={t('eg3')}
              maxLength={4}
              onChange={(evnt) => {
                handleChange(evnt, index)
                handleDistanceChange()
              }}
            />
          </div>
          <FormError
            errorMessage={
              formErrors.fee_categories && formErrors.fee_categories[index]
                ? formErrors.fee_categories[index].distance
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
              inputPostfix={t('perInstallment')}
              inputWrapperClassName={styles.amount}
              maxLength={7}
              onChange={(evnt) => handleChange(evnt, index)}
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
