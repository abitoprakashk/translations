import {DateTime} from 'luxon'
import classNames from 'classnames'
import React, {useState} from 'react'
import {useSelector} from 'react-redux'
import {events} from '../../../../../../utils/EventsConstants'
import {getStructureFeeType} from '../../../../fees.constants'
import styles from './OnetimeTypeSection.module.css'
import OnetimeType from './OnetimeType'
import ConfirmationPopup from '../../../../../../components/Common/ConfirmationPopup/ConfirmationPopup'
import FormError from '../../../tfi-common/FormError/FormError'
import {useTranslation} from 'react-i18next'
import {Icon, Input} from '@teachmint/common'
import NumberLabel from '../../../tfi-common/NumberLabel/NumberLabel'
import {getAmountFixDecimalWithCurrency} from '../../../../../../utils/Helpers'

export default function OnetimeTypeSection({
  handleChange,
  formValues,
  formErrors,
  setFormValues,
}) {
  const {t} = useTranslation()
  const {
    eventManager,
    instituteAcademicSessionInfo,
    instituteActiveAcademicSessionId,
    instituteInfo,
  } = useSelector((state) => state)
  const sessionRange = instituteAcademicSessionInfo.find(
    (session) => session._id == instituteActiveAcademicSessionId
  )
  const [showRemoveConfirmPopup, setShowRemoveConfirmPopup] = useState(false)
  const [indexToRemove, setIndexToRemove] = useState(null)
  const blankRow = {
    master_id: '',
    amount: '',
    tax: '',
    schedule: {},
    isDelete: false,
  }

  const getRowTotal = (amount, tax) => {
    return (
      parseFloat(amount) +
      (tax && tax <= 100 ? (parseFloat(amount) * parseFloat(tax)) / 100 : 0)
    )
  }

  const calculateRowTotal = (amount, tax) => {
    return (
      amount && (
        <div className={styles.rowTotalDiv}>
          {getAmountFixDecimalWithCurrency(
            getRowTotal(amount, tax),
            instituteInfo.currency
          )}
          <div className={styles.annualFeeIncludingTaxText}>
            Annual fee including tax
          </div>
        </div>
      )
    )
  }

  const addTableRows = () => {
    const newValues = {...formValues}
    newValues.fee_categories.push(blankRow)
    setFormValues(newValues)
    eventManager.send_event(events.ADD_MORE_SECTION_CLICKED_TFI, {
      fee_type: getStructureFeeType(newValues),
      type: 'fee_type',
    })
  }

  const deleteTableRows = (index) => {
    if (
      !formValues.fee_categories[index].master_id &&
      !formValues.fee_categories[index].amount
    ) {
      deleteTableRow(index)
    } else {
      setIndexToRemove(index)
      setShowRemoveConfirmPopup(true)
    }
  }

  const deleteTableRow = (index) => {
    const newValues = {...formValues}
    newValues.fee_categories[index].isDelete = true
    setFormValues(newValues)
    setShowRemoveConfirmPopup(false)
  }

  return (
    <>
      {showRemoveConfirmPopup && (
        <ConfirmationPopup
          onClose={() => setShowRemoveConfirmPopup(false)}
          onAction={() => deleteTableRow(indexToRemove)}
          icon={
            <Icon
              name="removeCircle"
              color="error"
              className={classNames(
                styles.higherSpecificityFont,
                styles.higherSpecificitySize,
                styles.removeIcon
              )}
            />
          }
          title={t('academicFeeStructureDeleteModalTitle')}
          desc={t('academicFeeStructureDeleteModalDesc')}
          primaryBtnText={t('cancel')}
          secondaryBtnText={t('delete')}
          secondaryBtnStyle={classNames(
            styles.higherSpecificityFont,
            styles.higherSpecificityColor,
            styles.modalDeleteBtn
          )}
        />
      )}
      <div className={styles.section}>
        <NumberLabel number={'2'} label={t('selectDueDate')} />
      </div>
      <div className={classNames(styles.dueDate, styles.formGroup)}>
        <div className={styles.inputGroup}>
          <Input
            type="date"
            title="Due date"
            fieldName="onetime_due_date"
            placeholder="Select due date"
            classes={{wrapper: styles.inputWrapper, title: 'tm-para'}}
            value={
              formValues.onetime_due_date
                ? DateTime.fromSeconds(formValues.onetime_due_date).toJSDate()
                : null
            }
            onChange={handleChange}
            minDate={DateTime.fromMillis(
              parseInt(sessionRange.start_time)
            ).toJSDate()}
            maxDate={DateTime.fromMillis(
              parseInt(sessionRange.end_time)
            ).toJSDate()}
          />
          <FormError errorMessage={formErrors.onetime_due_date} />
        </div>
      </div>
      <div className={styles.section}>
        <NumberLabel
          number={'3'}
          label={t('selectFeeTypesUnderWhichFeeIsApplied')}
        />
      </div>
      <FormError errorMessage={formErrors.feeCategoriesRequired} />
      <div>
        <table className={styles.onetimeTable}>
          <thead>
            <tr>
              <td className={classNames(styles.label, styles.feeTypeCol)}>
                {t('tableFieldsFeeType')}
              </td>
              <td className={classNames(styles.label, styles.amountCol)}>
                {t('amount')}
              </td>
              <td className={classNames(styles.label, styles.taxCol)}>
                {t('taxPercentageIfApplicable')}
              </td>
            </tr>
          </thead>
          <tbody>
            <OnetimeType
              formValues={formValues}
              formErrors={formErrors}
              handleChange={handleChange}
              calculateRowTotal={calculateRowTotal}
              deleteTableRows={deleteTableRows}
            />
          </tbody>
        </table>
        <div className={styles.addMoreType} onClick={addTableRows}>
          {t('academicFeeStructureAddMoreFeeTypeWIthPlusSign')}
        </div>
      </div>
    </>
  )
}
