import {useEffect, useMemo, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {t} from 'i18next'
import classNames from 'classnames'
import {ErrorBoundary} from '@teachmint/common'
import {
  Alert,
  ALERT_CONSTANTS,
  Button,
  Divider,
  Icon,
  ICON_CONSTANTS,
  Input,
  INPUT_TYPES,
  Modal,
  MODAL_CONSTANTS,
  Para,
  PARA_CONSTANTS,
} from '@teachmint/krayon'
import styles from './ConfirmAdmissionModal.module.css'
import AdmissionForm from '../AdmissionForm/AdmissionForm'
import globalActions from '../../../../../redux/actions/global.actions'
import {
  useAdmissionCrmSettings,
  useApplicableFeeStructures,
} from '../../../redux/admissionManagement.selectors'
import {getSequencedStages} from '../../../utils/helpers'
import {
  confirmAdmissionDisabledFields,
  confirmAdmissionNonvisibleFields,
  confirmAdmissionRequiredFields,
  IMIS_SETTING_TYPES,
  staticImisFields,
} from '../../../utils/constants'
import {checkRegex} from '../../../../../utils/Validations'
import {getAmountWithCurrency} from '../../../../../utils/Helpers'

const feeStructureType = {
  STANDARD: t('recurringFee'),
  TRANSPORT: t('transportFee'),
  ONE_TIME: t('oneTimeFee'),
  CUSTOM: t('custom'),
}

export default function ConfirmAdmissionModal({showModal, setShowModal, lead}) {
  const dispatch = useDispatch()
  const instituteInfo = useSelector((state) => state.instituteInfo)
  const admissionCrmSettings = useAdmissionCrmSettings()
  const applicableFeeStructures = useApplicableFeeStructures()
  const [feeStructures, setFeeStructures] = useState([])
  const [selectedFeeStructure, setSelectedFeeStructure] = useState('')
  const [formData, setFormData] = useState({...lead.profile_data})
  const [formErrors, setFormErrors] = useState({})
  const [errorMessage, setErrorMessage] = useState('')
  const {categorizedFields, admissionFormFields: admissionFields} =
    admissionCrmSettings.data

  const isAdmissionFeePaid = lead.status_adm_fee === 'PAID'

  useEffect(() => {
    if (isAdmissionFeePaid) {
      dispatch(
        globalActions.getApplicableFeeStructures.request(lead._id, (list) =>
          setFeeStructures(list)
        )
      )
    }
  }, [])

  const admissionConfirmedStageId = useMemo(() => {
    const leadStages = getSequencedStages(
      Object.values(admissionCrmSettings.data.lead_stages)
    )
    return leadStages[leadStages.length - 1]?._id
  }, [])

  const filteredFields = useMemo(() => {
    let requiredFields = []
    let nonVisibleFields = []
    let nonActiveFields = []
    Object.values(categorizedFields)
      ?.filter((field) => field.setting_type === IMIS_SETTING_TYPES.CATEGORY)
      ?.forEach((formFields) => {
        formFields.fields.forEach((field) => {
          if (
            confirmAdmissionRequiredFields.includes(field.key_id) ||
            field.is_value_mandatory
          ) {
            requiredFields.push(field.key_id)
          } else if (
            confirmAdmissionNonvisibleFields.includes(field.key_id) ||
            !admissionFields.profile_fields[field.key_id]?.enabled
          ) {
            nonVisibleFields.push(field.key_id)
          }
          if (!field.is_active) {
            nonActiveFields.push(field.key_id)
          }
        })
      })
    return {
      requiredFields: [...requiredFields, staticImisFields.PHONE_NUMBER],
      nonActiveFields,
      nonVisibleFields: [
        ...nonVisibleFields,
        ...confirmAdmissionRequiredFields,
      ],
    }
  }, [])

  const renderFeeStructure = () => {
    return (
      !applicableFeeStructures.isLoading &&
      feeStructures.length !== 0 && (
        <Input
          isRequired={true}
          type={INPUT_TYPES.DROPDOWN}
          title={t('confirmAdmissionModalFeeStructureLabel')}
          onChange={({value}) => setSelectedFeeStructure(value)}
          fieldName="feeStructure"
          selectionPlaceholder={
            selectedFeeStructure
              ? feeStructures.find(
                  (structure) =>
                    structure.fee_structure_id === selectedFeeStructure
                ).name
              : t('confirmAdmissionModalFeeStructurePlaceholder')
          }
          classes={{
            dropdownClass: styles.dropdownField,
            optionClass: styles.dropdownOptionWidth,
            optionsClass: classNames(styles.dropdown, styles.zIndex),
          }}
          options={feeStructures.map((structure) => ({
            value: structure.fee_structure_id,
            label: (
              <div>
                <div className={styles.structureName}>{structure.name}</div>
                <div className={styles.structureDetails}>
                  <Para
                    textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
                    weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
                  >
                    {feeStructureType[structure.fee_type]}
                  </Para>
                  <Divider
                    spacing="12px"
                    isVertical={true}
                    className={styles.structureDetailsSpacing}
                  />
                  <Para
                    textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
                    weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
                  >
                    {getAmountWithCurrency(
                      structure.categories.reduce(
                        (previousAmount, {amount_with_tax}) => {
                          return (previousAmount += amount_with_tax)
                        },
                        0
                      ),
                      instituteInfo?.currency
                    )}
                  </Para>
                </div>
              </div>
            ),
          }))}
        />
      )
    )
  }

  const checkFieldRegexPattern = () => {
    let errors = {}
    Object.values(categorizedFields)
      ?.filter((field) => field.setting_type === IMIS_SETTING_TYPES.CATEGORY)
      ?.forEach((admissionFields) => {
        admissionFields.fields.forEach((field) => {
          if (
            formData?.[field.key_id] &&
            field.pattern &&
            !checkRegex(new RegExp(field.pattern), formData[field.key_id])
          ) {
            errors[field.key_id] = t('thisFieldHasIncorrectValue')
          }
        })
      })
    return errors
  }

  const handleConfirmAdmission = () => {
    const errors = checkFieldRegexPattern()
    setFormErrors(errors)
    if (Object.keys(errors).length > 0) {
      return
    }
    let profileData = {...formData}
    filteredFields.nonActiveFields.forEach((field) => delete profileData[field])
    delete profileData.lead_id
    const failureAction = (response) => {
      if (response?.error_obj && Array.isArray(response.error_obj)) {
        if (response.error_obj.length === 1 && !response.error_obj[0].key_id) {
          setErrorMessage(response.error_obj[0].error_message)
        } else {
          let errors = {}
          response.error_obj.forEach((error) => {
            errors[error.key_id] = error.error_message
          })
          setFormErrors(errors)
          setErrorMessage(response.msg)
        }
      } else {
        setErrorMessage(response.msg)
      }
    }
    dispatch(
      globalActions.confirmLeadAdmission.request(
        {
          lead_id: lead._id,
          lead_stage_id: admissionConfirmedStageId,
          fee_structure_id: selectedFeeStructure,
          profile_data: profileData,
          class_id: profileData.standard,
        },
        () => setShowModal(false),
        failureAction
      )
    )
  }

  const getModalFooter = () => {
    return (
      <div>
        <Divider spacing="0" />
        <div className={styles.modalFooter}>
          <div className={styles.modalErrorSection}>
            {errorMessage && (
              <>
                <Icon name="info" type={ICON_CONSTANTS.TYPES.ERROR} />
                <div>{errorMessage}</div>
              </>
            )}
          </div>
          <Button
            onClick={handleConfirmAdmission}
            isDisabled={
              (!filteredFields.requiredFields.every((field) =>
                Boolean(formData?.[field])
              ) &&
                Boolean(Object.keys(formErrors))) ||
              (isAdmissionFeePaid && feeStructures.length > 0
                ? Boolean(!selectedFeeStructure)
                : false)
            }
          >
            {t('confirmAdmissionModalConfirmBtnText')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Modal
      isOpen={showModal}
      size={MODAL_CONSTANTS.SIZE.AUTO}
      onClose={() => setShowModal(false)}
      shouldCloseOnEsc={false}
      shouldCloseOnOverlayClick={false}
      header={t('confirmAdmissionModalTitle')}
      footer={getModalFooter()}
      classes={{modal: styles.modal, content: styles.modalContent}}
    >
      <ErrorBoundary>
        {!applicableFeeStructures.isLoading && (
          <Alert
            hideClose
            className={styles.confirmAlert}
            type={
              isAdmissionFeePaid && feeStructures.length === 0
                ? ALERT_CONSTANTS.TYPE.WARNING
                : ALERT_CONSTANTS.TYPE.INFO
            }
            content={
              isAdmissionFeePaid && feeStructures.length === 0
                ? t('confirmAdmissionModalAlertNoFeeStructure')
                : t('confirmAdmissionModalAlert')
            }
          />
        )}
        <AdmissionForm
          formErrors={formErrors}
          formData={formData}
          setFormData={setFormData}
          isConfirmAdmissionForm={true}
          renderFeeStructure={renderFeeStructure}
          requiredFields={filteredFields.requiredFields}
          disabledFields={confirmAdmissionDisabledFields}
          nonVisibleFields={filteredFields.nonVisibleFields}
        />
      </ErrorBoundary>
    </Modal>
  )
}
