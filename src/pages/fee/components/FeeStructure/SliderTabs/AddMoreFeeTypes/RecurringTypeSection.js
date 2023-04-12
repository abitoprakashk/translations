import classNames from 'classnames'
import React, {useState} from 'react'
import {useSelector} from 'react-redux'
import {events} from '../../../../../../utils/EventsConstants'
import {getStructureFeeType} from '../../../../fees.constants'
import styles from './RecurringTypeSection.module.css'
import RecurringType from './RecurringType'
import ConfirmationPopup from '../../../../../../components/Common/ConfirmationPopup/ConfirmationPopup'
import FormError from '../../../tfi-common/FormError/FormError'
import {useTranslation} from 'react-i18next'
import {Icon} from '@teachmint/common'
import NumberLabel from '../../../tfi-common/NumberLabel/NumberLabel'

export default function RecurringTypeSection({
  handleChange,
  formValues,
  formErrors,
  setFormValues,
}) {
  const {t} = useTranslation()
  const eventManager = useSelector((state) => state.eventManager)
  const [showRemoveConfirmPopup, setShowRemoveConfirmPopup] = useState(false)
  const [indexToRemove, setIndexToRemove] = useState(null)
  const blankRow = {
    master_id: '',
    tax: '',
    schedule: {},
    isDelete: false,
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
    if (!formValues.fee_categories[index].master_id) {
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
        <NumberLabel
          number={'2'}
          label={t('selectFeeTypesUnderWhichFeeIsApplied')}
        />
      </div>
      <FormError errorMessage={formErrors.feeCategoriesRequired} />
      <div className={styles.feeTypeDetails}>
        <table className={styles.table}>
          <thead>
            <tr>
              <td className={classNames(styles.label, styles.feeTypeCol)}>
                {t('tableFieldsFeeType')}
              </td>
              <td className={classNames(styles.label)}>
                {t('taxPercentageIfApplicable')}
              </td>
            </tr>
          </thead>
          <tbody>
            <RecurringType
              formValues={formValues}
              deleteTableRows={deleteTableRows}
              handleChange={handleChange}
              formErrors={formErrors}
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
