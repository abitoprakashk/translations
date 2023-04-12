import React from 'react'
import styles from './FormFields.module.css'
import collectFeesStyles from '../CollectFees.module.css'
import {Datepicker, formatDateTime, Input} from '@teachmint/krayon'
import {t} from 'i18next'
import {
  paymentStatus,
  paymentStatusLabels,
  transactionMethods,
  TRANSACTION_STATUS_OPTIONS,
} from '../../../fees.constants'
import classNames from 'classnames'
import {isInstituteInternational} from '../../../helpers/helpers'

export default function FormFields({
  handleChange = () => {},
  dateFiledName = () => {},
  handleDisbursalDate = () => {},
  handleStartDate = () => {},
  formValues = {},
  simplePaymentModes = [],
  formErrors = {},
  instituteInfo = {},
}) {
  const isInternational = isInstituteInternational(
    instituteInfo?.address?.country
  )
  return (
    <div className={styles.section}>
      <div className={styles.zIndex4}>
        <Input
          fieldName="paymentMethod"
          isRequired
          onChange={(obj) =>
            handleChange({
              target: {name: 'paymentMethod', value: obj.value},
            })
          }
          options={Object.values(paymentStatusLabels)
            .filter((status) => status.key !== paymentStatus.ONLINE)
            .filter((item) =>
              isInternational ? item.visibleToInernational : true
            )
            .map((status) => {
              return {
                value: status.key,
                label: isInternational
                  ? t(status?.internationalLabel)
                  : t(status.label),
              }
            })}
          placeholder={t('select')}
          showMsg
          title={t('paymentMethod')}
          type="dropdown"
          classes={{
            wrapper: collectFeesStyles.selectPaymentMethodDropdown,
            optionsClass: collectFeesStyles.optionsOverflow,
          }}
          value={formValues.paymentMethod}
        />
      </div>

      {!simplePaymentModes.includes(formValues.paymentMethod) &&
        formValues.paymentMethod !== paymentStatus.SELECT_PAYMENT_METHOD && (
          <Input
            fieldName="referenceNumber"
            infoMsg={formErrors?.referenceNumber}
            onChange={(obj) =>
              handleChange({
                target: {name: 'referenceNumber', value: obj.value},
              })
            }
            placeholder={
              paymentStatusLabels[formValues.paymentMethod].placeholder
            }
            showMsg={formErrors?.referenceNumber}
            title={t('referenceNumber')}
            type="text"
            classes={{wrapper: collectFeesStyles.selectPaymentMethodDropdown}}
            value={formValues.referenceNumber}
          />
        )}

      {!simplePaymentModes.includes(formValues.paymentMethod) &&
        formValues.paymentMethod !== paymentStatus.SELECT_PAYMENT_METHOD && (
          <>
            <Input
              fieldName="transactionStatus"
              infoMsg={formErrors?.transactionStatus}
              //   isRequired
              onChange={(obj) =>
                handleChange({
                  target: {name: 'transactionStatus', value: obj.value},
                })
              }
              options={TRANSACTION_STATUS_OPTIONS}
              placeholder={t('select')}
              showMsg={formErrors?.transactionStatus}
              title={
                <div>
                  {formValues.paymentMethod === paymentStatus.CHEQUE &&
                    'Cheque '}
                  {formValues.paymentMethod === paymentStatus.DD && 'DD '}
                  status
                </div>
              }
              type="dropdown"
              classes={{
                wrapper: collectFeesStyles.selectPaymentMethodDropdown,
                optionsClass: collectFeesStyles.optionsOverflow,
              }}
              value={formValues.transactionStatus}
              selectedOptions={
                formValues.transactionStatus !== ''
                  ? formValues.transactionStatus
                  : transactionMethods.RECEIVED
              }
            />
          </>
        )}

      {!simplePaymentModes.includes(formValues.paymentMethod) &&
        formValues.paymentMethod !== paymentStatus.SELECT_PAYMENT_METHOD && (
          <div className={styles.zIndex3}>
            <div className={collectFeesStyles.paymentDateLable}>
              {dateFiledName()}
            </div>
            <Datepicker
              dateFormat={'dd/MM/yyyy'}
              fieldName="disbursalDate"
              onChange={(obj) =>
                handleDisbursalDate(
                  'disbursalDate',
                  formatDateTime(obj, 'yyyy-MM-dd')
                )
              }
              value={new Date(formValues?.disbursalDate) ?? new Date()}
              classes={{
                wrapper: classNames(
                  styles.my,
                  collectFeesStyles.calendarWrapper
                ),
                input: collectFeesStyles.selectPaymentMethodDropdown,
              }}
            />
          </div>
        )}

      {formValues.paymentMethod !== paymentStatus.SELECT_PAYMENT_METHOD && (
        <div className={styles.zIndex3}>
          <div className={collectFeesStyles.paymentDateLable}>
            {t('paymentDate')}{' '}
            <span className={styles.requiredStarSpan}>*</span>
          </div>
          <Datepicker
            dateFormat={'dd/MM/yyyy'}
            fieldName="payDate"
            onChange={(obj) =>
              handleStartDate('payDate', formatDateTime(obj, 'yyyy-MM-dd'))
            }
            value={new Date(formValues?.payDate) ?? new Date()}
            classes={{
              wrapper: collectFeesStyles.calendarWrapper,
              input: collectFeesStyles.selectPaymentMethodDropdown,
            }}
          />
        </div>
      )}
    </div>
  )
}
