import classNames from 'classnames'
import React, {useState} from 'react'
import {useSelector} from 'react-redux'
import {events} from '../../../../../../utils/EventsConstants'
import {
  getStructureFeeType,
  TRANSPORT_METHODS,
} from '../../../../fees.constants'
import styles from './TransportTypeSection.module.css'
import ConfirmationPopup from '../../../../../../components/Common/ConfirmationPopup/ConfirmationPopup'
import FormError from '../../../tfi-common/FormError/FormError'
import TransportFeeSetting from './TransportFeeSetting'
import TransportTypeDistance from './TransportTypeDistance'
import TransportTypeWaypoint from './TransportTypeWaypoint'
import NumberLabel from '../../../tfi-common/NumberLabel/NumberLabel'
import {Icon} from '@teachmint/common'
import {useTranslation} from 'react-i18next'
import {useTransportStructureSettings} from '../../../../redux/feeStructure/feeStructureSelectors'
import InputWithLabel from '../../../tfi-common/InputWithLabel/InputWithLabel'
import {getAmountFixDecimalWithCurrency} from '../../../../../../utils/Helpers'

export default function TransportTypeSection({
  handleChange,
  formValues,
  formErrors,
  setFormValues,
}) {
  const {t} = useTranslation()
  const transportStructureSettings = useTransportStructureSettings()
  const eventManager = useSelector((state) => state.eventManager)
  const {instituteInfo} = useSelector((state) => state)
  const [showRemoveConfirmPopup, setShowRemoveConfirmPopup] = useState(false)
  const [indexToRemove, setIndexToRemove] = useState(null)
  const [transportMethod, setTranportMethod] = useState(
    formValues.transport_type
  )

  const blankRow =
    transportMethod === TRANSPORT_METHODS.WAYPOINT
      ? {pickup: '', amount: '', _id: null, schedule: {}, isDelete: false}
      : {
          distanceFrom: 0,
          distanceTo: '',
          amount: '',
          schedule: {},
          isDelete: false,
        }

  const getRowTotal = (amount) => {
    let tax = formValues.tax
    return (
      (parseFloat(amount) +
        (tax && tax <= 100
          ? (parseFloat(amount) * parseFloat(tax)) / 100
          : 0)) *
      formValues.applicable_months.length
    )
  }

  const calculateRowTotal = (amount) => {
    return (
      amount &&
      formValues.applicable_months.length > 0 && (
        <div className={styles.rowTotalDiv}>
          {getAmountFixDecimalWithCurrency(
            getRowTotal(amount),
            instituteInfo.currency
          )}
          <div className={styles.annualFeeIncludingTaxText}>
            Annual fee including tax
          </div>
        </div>
      )
    )
  }

  const handleDistanceChange = () => {
    let previousIndex = 0
    formValues.fee_categories.map((category, index) => {
      if (!category.isDelete) {
        const newValues = {...formValues}
        newValues.fee_categories[index].distanceFrom =
          previousIndex !== 0
            ? newValues.fee_categories[previousIndex - 1].distanceTo
              ? parseFloat(
                  newValues.fee_categories[previousIndex - 1].distanceTo
                ) // + 1
              : newValues.fee_categories[previousIndex - 1].distanceFrom
            : 0
        newValues.fee_categories[index].distanceTo = category.distanceTo
        setFormValues(newValues)
        previousIndex = index + 1
      }
    })
  }

  const addTableRows = () => {
    const newValues = {...formValues}
    newValues.fee_categories.push(blankRow)
    setFormValues(newValues)
    eventManager.send_event(events.ADD_MORE_SECTION_CLICKED_TFI, {
      fee_type: getStructureFeeType(newValues),
      type: 'distance',
    })
    if (transportMethod === TRANSPORT_METHODS.DISTANCE) {
      handleDistanceChange()
    }
  }

  const deleteTableRows = (index) => {
    if (transportMethod === TRANSPORT_METHODS.DISTANCE) {
      if (
        !formValues.fee_categories[index].distanceTo &&
        !formValues.fee_categories[index].amount
      ) {
        deleteTableRow(index)
      } else {
        setIndexToRemove(index)
        setShowRemoveConfirmPopup(true)
      }
    } else {
      if (!formValues.fee_categories[index].amount) {
        deleteTableRow(index)
      } else {
        setIndexToRemove(index)
        setShowRemoveConfirmPopup(true)
      }
    }
  }

  const deleteTableRow = (index) => {
    const newValues = {...formValues}
    newValues.fee_categories[index].isDelete = true
    setFormValues(newValues)
    setShowRemoveConfirmPopup(false)
    if (transportMethod === TRANSPORT_METHODS.DISTANCE) {
      handleDistanceChange()
    }
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
          title={
            transportMethod === TRANSPORT_METHODS.DISTANCE
              ? t('areYouSureYouWantToDeleteTheDistanceRange')
              : t('areYouSureYouWantToDeleteThePickupPoint')
          }
          desc={
            transportMethod === TRANSPORT_METHODS.DISTANCE
              ? t('deletingDistanceRangeWillBeRemovedFromTheFeeStructure')
              : t('pickupPointWillBeRemovedFromTheFeeStructure')
          }
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
        <NumberLabel number={'2'} label={t('taxPercentageIfApplicable')} />
      </div>
      <div className={classNames(styles.transportTax, styles.formGroup)}>
        <div className={styles.inputGroup}>
          <div className={styles.taxPercent}>{t('transportTaxPercentage')}</div>
          <InputWithLabel
            maxLength={4}
            fieldName="tax"
            value={formValues.tax}
            onChange={handleChange}
            inputWrapperClassName={styles.taxPrefix}
            placeholder={t('taxPlaceholder')}
            inputPrefixClassName={styles.taxPrefix}
            inputPostfix={t('percentageSign')}
          />
          <FormError errorMessage={formErrors.tax} />
        </div>
      </div>
      <div className={styles.section}>
        <NumberLabel
          number={'3'}
          label={
            transportMethod === TRANSPORT_METHODS.DISTANCE
              ? t('addDistanceAndItsAmount')
              : t('selectPickupPointAndItsAmount')
          }
        />
      </div>
      {!transportStructureSettings.transport_structure_exists.status && (
        <TransportFeeSetting
          formValues={formValues}
          setFormValues={setFormValues}
          transportMethod={transportMethod}
          setTranportMethod={setTranportMethod}
        />
      )}
      <FormError errorMessage={formErrors.feeCategoriesRequired} />
      <div className={styles.feeTypeDetails}>
        <table className={styles.table}>
          <thead>
            <tr>
              <td className={classNames(styles.label, styles.transportCol)}>
                {transportMethod === TRANSPORT_METHODS.DISTANCE
                  ? t('distanceInKm')
                  : t('pickupOrDropPoint')}
              </td>
              <td className={classNames(styles.label, styles.transportAmount)}>
                {t('amount')}
              </td>
            </tr>
          </thead>
          <tbody>
            {transportMethod === TRANSPORT_METHODS.DISTANCE && (
              <TransportTypeDistance
                formValues={formValues}
                formErrors={formErrors}
                calculateRowTotal={calculateRowTotal}
                handleChange={handleChange}
                deleteTableRows={deleteTableRows}
                handleDistanceChange={handleDistanceChange}
              />
            )}
            {transportMethod === TRANSPORT_METHODS.WAYPOINT && (
              <TransportTypeWaypoint
                formValues={formValues}
                formErrors={formErrors}
                calculateRowTotal={calculateRowTotal}
                handleChange={handleChange}
                deleteTableRows={deleteTableRows}
              />
            )}
          </tbody>
        </table>
        <div className={styles.addMoreType} onClick={addTableRows}>
          {transportMethod === TRANSPORT_METHODS.DISTANCE
            ? t('addDistance')
            : t('addPickupPoint')}
        </div>
      </div>
    </>
  )
}
