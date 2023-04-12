import React from 'react'
import classNames from 'classnames'
import {useDispatch, useSelector} from 'react-redux'
import {Icon, Modal} from '@teachmint/common'
import {useTranslation} from 'react-i18next'
import styles from './CreateStructureModal.module.css'
import feeCollectionActionTypes from '../../../redux/feeCollectionActionTypes'
import {
  FEE_STRUCTURE_TYPES,
  FEE_STRUCTURE_TYPES_IDS,
  getStructureFeeType,
  SliderScreens,
  STUDENT_OPTIONS,
  TRANSPORT_METHODS,
} from '../../../fees.constants'
import {events} from '../../../../../utils/EventsConstants'
import {
  usePreviousSessionDueSettings,
  useTransportStructureSettings,
} from '../../../redux/feeStructure/feeStructureSelectors'

export default function CreateStructureModal({
  showCreateFeeStructureModal,
  setShowCreateFeeStructureModal,
}) {
  const {t} = useTranslation()
  const eventManager = useSelector((state) => state.eventManager)
  const previousDueSettings = usePreviousSessionDueSettings()
  const transportStructureSettings = useTransportStructureSettings()
  const dispatch = useDispatch()
  const normalStructureInitialValues = {
    fee_type: null,
    name: '',
    receipt_prefix: '',
    series_starting_number: '',
    applicable_months: [],
    due_date: '',
    onetime_due_date: null,
    applicable_students: '',
    tax: '',
    fee_categories: [],
    schedule_timestamps: {},
    assigned_to: [],
    category: [],
    gender: '',
    transport_type: TRANSPORT_METHODS.NONE,
  }

  const previousSessionDueInitialValues = {
    _id: previousDueSettings.previous_due_structure_id.value,
    fee_type: 'CUSTOM',
    is_previous_due: true,
    receipt_prefix: previousDueSettings.previous_due_receipt_prefix.value ?? '',
    series_starting_number:
      previousDueSettings.previous_due_starting_number.value ?? '',
    applicable_students: STUDENT_OPTIONS.NONE,
    fee_categories: [],
    fee_types: previousDueSettings.previous_due_categories.value ?? [],
  }

  const handleChange = (feeType) => {
    const feesType = getStructureFeeType({fee_type: feeType})
    eventManager.send_event(events.CREATE_NEW_FEE_STRUCTURE_POPUP_CLICKED_TFI, {
      fee_type: feesType,
    })
    setShowCreateFeeStructureModal(false)
    normalStructureInitialValues.fee_type = feeType
    if (feeType === FEE_STRUCTURE_TYPES_IDS.TRANSPORT_FEE) {
      if (transportStructureSettings.transport_structure_exists.status) {
        normalStructureInitialValues.transport_type =
          transportStructureSettings.transport_structure_type.value ===
          TRANSPORT_METHODS.NONE
            ? TRANSPORT_METHODS.DISTANCE
            : transportStructureSettings.transport_structure_type.value
      } else {
        normalStructureInitialValues.transport_type = TRANSPORT_METHODS.DISTANCE
      }
    }

    let payload = {}
    if (feesType === 'CUSTOM') {
      payload = {
        name: SliderScreens.PREVIOUS_YEAR_DUE_SLIDER,
        data: {
          initialValues: previousSessionDueInitialValues,
        },
      }
    } else {
      payload = {
        name: SliderScreens.STRUCTURE_SLIDER,
        data: {
          initialValues: normalStructureInitialValues,
        },
      }
    }
    dispatch({
      type: feeCollectionActionTypes.SET_SLIDER_SCREEN,
      payload: payload,
    })
  }

  return (
    <Modal
      show={showCreateFeeStructureModal}
      className={classNames(styles.specificity, styles.modalWidth)}
    >
      <div>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>{t('createNewStructure')}</div>
          <div
            className={styles.closeModal}
            onClick={() => setShowCreateFeeStructureModal(false)}
          >
            <Icon name="circledClose" type="outlined" color="secondary" />
          </div>
        </div>
        <div className={styles.modalBody}>
          {Object.values(FEE_STRUCTURE_TYPES_IDS).map((type) => {
            return (
              <div
                key={FEE_STRUCTURE_TYPES[type].key}
                className={styles.structureSection}
              >
                <div
                  onClick={() => handleChange(FEE_STRUCTURE_TYPES[type].key)}
                  className={styles.feeCategoryAddFeeType}
                >
                  <div className={styles.feeCategoryAddFeeTypeIcon}>
                    <div className={styles.roundedIcon}>
                      {FEE_STRUCTURE_TYPES[type].icon}
                    </div>
                  </div>
                  <div className={styles.structureContent}>
                    <div className={styles.structureTitle}>
                      {FEE_STRUCTURE_TYPES[type].label}
                    </div>
                    <div className={styles.structureDescription}>
                      {FEE_STRUCTURE_TYPES[type].description}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Modal>
  )
}
