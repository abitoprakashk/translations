import {useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import classNames from 'classnames'
import {DateTime} from 'luxon'
import {
  Datepicker,
  Divider,
  Input,
  INPUT_TYPES,
  Para,
  PlainCard,
  RequiredSymbol,
} from '@teachmint/krayon'
import {ErrorBoundary} from '@teachmint/common'
import {
  admissionPaymentStatus,
  admissionPaymentStatusLabels,
} from '../../utils/constants'
import styles from './RecordFees.module.css'
import {getAmountFixDecimalWithCurrency} from '../../../../utils/Helpers'
import {calculateAmount, calculateTaxAmount} from '../../utils/helpers'

export default function RecordFees({feesData, formData, setFormData}) {
  const {t} = useTranslation()
  const instituteInfo = useSelector((state) => state.instituteInfo)
  const handleChange = ({fieldName, value}) => {
    let newFormData = {...formData}
    newFormData[fieldName] = value
    setFormData(newFormData)
  }

  const handleDateChange = (fieldName, jsDate) => {
    handleChange({
      fieldName,
      value: DateTime.fromJSDate(jsDate).startOf('day').toSeconds(),
    })
  }

  const isChequeDD = [
    admissionPaymentStatus.CHEQUE,
    admissionPaymentStatus.DD,
  ].includes(formData?.payment_mode)

  return (
    <div>
      <ErrorBoundary>
        <span className={styles.headerStyle}>{t('recoredFormFee')}</span>
        <PlainCard className={styles.mainContainer}>
          <div className={classNames(styles.subContainer, styles.subHeader)}>
            <span>{t('totalFee')}</span>
            <span>
              {calculateAmount(
                feesData?.fee_amount,
                feesData?.tax,
                true,
                instituteInfo?.currency
              )}
            </span>
          </div>
          <Divider classes={{divider: styles.dividerWidth}} />
          <div className={classNames(styles.subContent, styles.itemStyle)}>
            <span>{t('formFee')}</span>
            <span>
              {getAmountFixDecimalWithCurrency(
                feesData?.fee_amount,
                instituteInfo?.currency
              )}
            </span>
          </div>
          <div
            className={classNames(
              styles.subContent,
              styles.subContent2,
              styles.itemStyle
            )}
          >
            <span>{t('taxes')}</span>
            <span>
              {calculateTaxAmount(
                feesData?.fee_amount,
                feesData?.tax,
                true,
                instituteInfo?.currency
              )}
            </span>
          </div>
        </PlainCard>
        <div
          className={classNames(styles.paymentMethods, {
            [styles.displayColumnFlex]: isChequeDD,
          })}
        >
          <div className={styles.formField}>
            <Input
              isRequired={true}
              type={INPUT_TYPES.DROPDOWN}
              fieldName="payment_mode"
              value={formData.payment_mode}
              placeholder={t('select')}
              options={admissionPaymentStatusLabels}
              title={t('admissionCrmSelectPaymentMethod')}
              onChange={handleChange}
              classes={{
                wrapper: styles.paymentModeWrapper,
                wrapperClass: styles.dropdownStyles,
                optionsClass: `${styles.dropdownZindex1} ${styles.dropdownZindex2}`,
              }}
            />
          </div>
          <div className={styles.displayFlex}>
            {isChequeDD && (
              <div className={styles.datePicketStyling}>
                <div>
                  <div className={styles.required}>
                    <Para className={styles.marginBotton}>
                      {t('admissionCrmSelectChequeDate')}
                      <RequiredSymbol />
                    </Para>
                  </div>
                  <div className={styles.datePickerZindex}>
                    <Datepicker
                      closeOnChange={true}
                      classes={{
                        calendarWrapper: styles.calendarSize,
                        wrapper: styles.dateWrapper,
                        input: styles.inputWrapper,
                      }}
                      onChange={(jsDate) =>
                        handleDateChange('ref_date', jsDate)
                      }
                      value={DateTime.fromSeconds(formData.ref_date).toJSDate()}
                    />
                  </div>
                </div>
              </div>
            )}
            {formData?.payment_mode && (
              <div className={styles.formField}>
                <div className={styles.required}>
                  <Para className={styles.marginBotton}>
                    {t('admissionCrmSelectPaymentDate')}
                    <RequiredSymbol />
                  </Para>
                </div>
                <div className={styles.datePickerZindex}>
                  <Datepicker
                    closeOnChange={true}
                    classes={{
                      calendarWrapper: styles.calendarSize,
                      wrapper: styles.dateWrapper,
                      input: styles.inputWrapper,
                    }}
                    onChange={(jsDate) =>
                      handleDateChange('order_timestamp', jsDate)
                    }
                    value={DateTime.fromSeconds(
                      formData.order_timestamp
                    ).toJSDate()}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        {isChequeDD && (
          <div className={styles.paymentDate}>
            <Input
              type={INPUT_TYPES.TEXT}
              fieldName="referenceNo"
              value={formData.referenceNo}
              onChange={handleChange}
              title={t('referenceNo')}
              placeholder={t('referenceNo')}
            />
          </div>
        )}
        <div className={styles.inputwrapper}>
          <Input
            type={INPUT_TYPES.TEXT}
            fieldName="additionalNote"
            onChange={handleChange}
            value={formData.additionalNote}
            title={t('admissionCrmAdditionalNote')}
            placeholder={t('admissionCrmAdditionalNote')}
          />
        </div>
      </ErrorBoundary>
    </div>
  )
}
