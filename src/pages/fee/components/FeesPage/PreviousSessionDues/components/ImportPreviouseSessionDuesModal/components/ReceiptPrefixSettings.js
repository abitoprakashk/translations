import styles from '../ImportPreviousSessionDuesModal.module.css'
import {useTranslation} from 'react-i18next'
import {Para, PARA_CONSTANTS, Input, Datepicker} from '@teachmint/krayon'
import {alphaRegex} from '../../../../../../../../utils/Validations'
import React, {useState} from 'react'

export default function ReceiptPrefixSettings({
  formFields,
  setFormFields,
  modalType,
  checkForReceiptPrefix,
  currentSession,
}) {
  const {t} = useTranslation()
  const [isReceiptNoDisabled, setIsReceiptNoDisabled] = useState(false)
  return (
    <>
      <Para
        textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}
        type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
      >
        {t('receiptInfoSectionTitle')}
      </Para>
      <div className={styles.inputGroup}>
        <Input
          fieldName="receipt_prefix"
          isRequired
          onChange={(e) => {
            if (alphaRegex(e.value)) {
              setFormFields((formFields) => ({
                ...formFields,
                receipt_prefix: e.value.toUpperCase(),
              }))
            }
          }}
          onBlur={() =>
            checkForReceiptPrefix(
              formFields,
              setFormFields,
              setIsReceiptNoDisabled
            )
          }
          placeholder={t('receiptPrefixPlaceholder')}
          showMsg
          value={formFields.receipt_prefix || ''}
          title={t('receiptPrefix')}
          type="text"
          isDisabled={modalType == 'update' ? true : false}
        />
        <Input
          fieldName="series_starting_number"
          isRequired
          onChange={(e) =>
            setFormFields((formFields) => ({
              ...formFields,
              series_starting_number: e.value,
            }))
          }
          placeholder="0"
          showMsg
          isDisabled={isReceiptNoDisabled || modalType == 'update'}
          value={formFields.series_starting_number || ''}
          title={t('receiptStartingNo')}
          type="number"
        />
        <div className={styles.datePickerWrapper}>
          <span className={styles.inputTitle}>
            {t('paymentDueDataRequired')}
          </span>
          <Datepicker
            inputProps={{
              placeholder: t('selectDate'),
            }}
            dateFormat={'dd-MM-yyyy'}
            onChange={(e) =>
              setFormFields((formFields) => ({
                ...formFields,
                due_date: e.getTime() / 1000,
              }))
            }
            maxDate={new Date(parseInt(currentSession.end_time))}
            minDate={new Date(parseInt(currentSession.start_time))}
            value={new Date(formFields.due_date * 1000)}
            classes={{
              wrapper: styles.datePickerClassWrapper,
              calendar: styles.rdrCalendarWrapper,
            }}
          />
        </div>
      </div>
    </>
  )
}
