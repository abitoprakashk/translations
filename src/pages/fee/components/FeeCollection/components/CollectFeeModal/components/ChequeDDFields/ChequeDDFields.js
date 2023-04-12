import CollectFeeModal from '../../CollectFeeModal.module.css'
import {Input, Datepicker, formatDateTime} from '@teachmint/krayon'
import {
  TRANSACTION_STATUS_OPTIONS,
  paymentStatusLabels,
} from '../../../../../../fees.constants'
import {useTranslation} from 'react-i18next'

export default function ChequeDDFields({
  paymentMethod,
  transactionStatus,
  updateTransactionStatus,
  referenceNumber,
  updateReferenceNumber,
  disbursalDate,
  updateDisbursalDate,
}) {
  const {t} = useTranslation()
  return (
    <div className={CollectFeeModal.inputFieldGroup}>
      <Input
        fieldName="fieldName"
        isRequired
        onChange={(e) => updateTransactionStatus(e.value)}
        options={Object.values(TRANSACTION_STATUS_OPTIONS).map((mode) => {
          return {label: mode.label, value: mode.value}
        })}
        value={transactionStatus}
        placeholder="Select"
        showMsg
        title={
          paymentMethod == paymentStatusLabels['CHEQUE'].key
            ? t('chequeStatusFee')
            : t('ddStatusFee')
        }
        type="dropdown"
        classes={{wrapper: CollectFeeModal.inputWrapper, optionsClass: 'z-1'}}
      />
      <Input
        defaultText=""
        fieldName="textField"
        onChange={(e) => updateReferenceNumber(e.value)}
        placeholder={t('chequePlaceholder')}
        showMsg
        value={referenceNumber}
        title={
          paymentMethod == paymentStatusLabels['CHEQUE'].key
            ? t('chequeReferenceNumber')
            : t('ddReferenceNumber')
        }
        type="text"
        classes={{wrapper: CollectFeeModal.inputWrapper}}
      />
      <div className={CollectFeeModal.datePickerWrapper}>
        <span className={CollectFeeModal.inputTitle}>
          {t('disbursalDateCollectionField')}{' '}
          <span className={CollectFeeModal.astrik}>*</span>
        </span>
        <Datepicker
          closeOnChange
          inputProps={{
            placeholder: t('dateSelect'),
          }}
          dateFormat={'yyyy-MM-dd'}
          onChange={(e) => updateDisbursalDate(formatDateTime(e, 'yyyy-MM-dd'))}
          value={new Date(disbursalDate)}
          classes={{wrapper: CollectFeeModal.datePickerClassWrapper}}
        />
      </div>
    </div>
  )
}
