import React, {useState, useEffect} from 'react'
import classNames from 'classnames'
import {useDispatch} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {Input} from '@teachmint/common'
import styles from './FeeType.module.css'
import FormError from '../../tfi-common/FormError/FormError'
import {FEE_STRUCTURE_TYPES_IDS} from '../../../fees.constants'
import NumberLabel from '../../tfi-common/NumberLabel/NumberLabel'
import RecurringTypeSection from './AddMoreFeeTypes/RecurringTypeSection'
import TransportTypeSection from './AddMoreFeeTypes/TransportTypeSection'
import OnetimeTypeSection from './AddMoreFeeTypes/OnetimeTypeSection'
import feeStructureActionTypes from '../../../redux/feeStructure/feeStructureActionTypes'
import {useFeeStructure} from '../../../redux/feeStructure/feeStructureSelectors'

export default function FeeType({
  formValues,
  formErrors,
  setFormValues,
  handleChange,
  hidden,
}) {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const [isReceiptNoDisabled, setIsReceiptNoDisabled] = useState(false)
  // get previous structure's receipt prefix
  const {feeStructures} = useFeeStructure()
  const previousStructureReceiptPrefix = Object.keys(
    feeStructures.structureView
  ).length
    ? Object.values(feeStructures.structureView)[0].receipt_prefix
    : ''
  // fetch receipt starting number as soon as we have receipt prefix
  useEffect(() => {
    checkReceiptPrefixExists(
      formValues.receipt_prefix || previousStructureReceiptPrefix
    )
  }, [previousStructureReceiptPrefix])

  const checkReceiptPrefixExists = (prefix) => {
    if (prefix.length > 0)
      dispatch({
        type: feeStructureActionTypes.RECEIPT_PREFIX_EXISTS_REQUESTED,
        payload: {
          prefix: prefix,
          formValues: formValues,
          setFormValues: setFormValues,
          setIsReceiptNoDisabled: setIsReceiptNoDisabled,
        },
      })
  }

  return (
    <div className={classNames(styles.paddingBottom, {hidden: hidden})}>
      <div className={styles.section}>
        <NumberLabel
          number={'1'}
          label={t('addStructureNamePrefixAndReceiptNumber')}
        />
      </div>
      <div className={classNames(styles.basicDetails, styles.formGroup)}>
        <div className={styles.inputGroup}>
          <Input
            type="text"
            title={t('feeStructureNameWithStar')}
            fieldName="name"
            value={formValues.name}
            onChange={handleChange}
            classes={{wrapper: styles.inputWrapper, title: 'tm-para'}}
            placeholder={
              formValues.fee_type === FEE_STRUCTURE_TYPES_IDS.TRANSPORT_FEE
                ? t('transportFeePlaceholder')
                : t('termFeePlaceholder')
            }
          />
          <FormError errorMessage={formErrors.name} />
        </div>
        <div className={styles.inputGroup}>
          <Input
            type="text"
            title={t('receiptPrefixWithStar')}
            fieldName="receipt_prefix"
            value={formValues.receipt_prefix}
            onChange={handleChange}
            onBlur={(evnt) => checkReceiptPrefixExists(evnt.target.value)}
            placeholder={t('egDPS')}
            classes={{wrapper: styles.inputWrapper, title: 'tm-para'}}
          />
          <FormError errorMessage={formErrors.receipt_prefix} />
        </div>
        <div className={styles.inputGroup}>
          <Input
            type="text"
            title={t('receiptStartingNumberWithStar')}
            disabled={isReceiptNoDisabled}
            fieldName="series_starting_number"
            value={formValues.series_starting_number}
            onChange={handleChange}
            placeholder={t('eg100')}
            classes={{wrapper: styles.inputWrapper, title: 'tm-para'}}
          />
          <FormError errorMessage={formErrors.series_starting_number} />
        </div>
      </div>
      {formValues.fee_type === FEE_STRUCTURE_TYPES_IDS.RECURRING_FEE && (
        <RecurringTypeSection
          handleChange={handleChange}
          formValues={formValues}
          formErrors={formErrors}
          setFormValues={setFormValues}
        />
      )}
      {formValues.fee_type === FEE_STRUCTURE_TYPES_IDS.ONE_TIME_FEE && (
        <OnetimeTypeSection
          handleChange={handleChange}
          formValues={formValues}
          formErrors={formErrors}
          setFormValues={setFormValues}
        />
      )}
      {formValues.fee_type === FEE_STRUCTURE_TYPES_IDS.TRANSPORT_FEE && (
        <TransportTypeSection
          handleChange={handleChange}
          formValues={formValues}
          formErrors={formErrors}
          setFormValues={setFormValues}
        />
      )}
    </div>
  )
}
