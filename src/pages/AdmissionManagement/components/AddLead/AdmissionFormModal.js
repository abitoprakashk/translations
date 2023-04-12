import {t} from 'i18next'
import {useEffect, useMemo, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {DateTime} from 'luxon'
import {
  Button,
  BUTTON_CONSTANTS,
  Divider,
  Icon,
  ICON_CONSTANTS,
  Modal,
  MODAL_CONSTANTS,
  Stepper,
} from '@teachmint/krayon'
import {ErrorBoundary} from '@teachmint/common'
import {
  admissionCrmFormType,
  admissionCrmFormTypes,
  admissionFormLeadProfileStatus,
  admissionFormSettingsHiddenFields,
  admissionFormStepIds,
  admissionFormStepSequence,
  admissionFormStepSequenceWithoutFees,
  admissionPaymentStatus,
  admissionStepperStatus,
  admissionTransactionMethods,
  confirmAdmissionRequiredFields,
  crmFormType,
  defaultAdmissionFormSteps,
  defaultAdmissionFormStepsWithoutFees,
  FEES_STEPPER_IDS,
  IMIS_SETTING_TYPES,
  kanbanBoardOtherFilterOptionValues,
  staticImisFields,
  permanentAddressFields,
} from '../../utils/constants'
import {checkRegex} from '../../../../utils/Validations'
import globalActions from '../../../../redux/actions/global.actions'
import {
  admissionCrmUpdateLead,
  useAdmissionCrmSettings,
  useCreatePaymentStatus,
  useLeadList,
} from '../../redux/admissionManagement.selectors'
import {admissionCrmAddLead} from '../../redux/admissionManagement.selectors'
import styles from './AdmissionFormModal.module.css'
import UploadDocuments from './UploadDocuments'
import RecordFees from './RecordFees'
import ChooseStage from './ChooseLeadStage'
import AdmissionForm from '../Common/AdmissionForm/AdmissionForm'
import {
  calculateAmount,
  calculateTaxAmount,
  updateLeadList,
} from '../../utils/helpers'
import {events} from '../../../../utils/EventsConstants'
import classNames from 'classnames'

export default function AdmissionFormModal({formType, setFormType}) {
  const dispatch = useDispatch()
  const currentAdminInfo = useSelector((state) => state.currentAdminInfo)
  const [leadstage, setLeadStage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [formFeeValues, setFormFeeValues] = useState({
    payment_mode: '',
    additionalNote: '',
    ref_date: DateTime.now().startOf('day').toSeconds(),
    order_timestamp: DateTime.now().startOf('day').toSeconds(),
  })
  const [isAddedLead, setIsAddedLead] = useState(false)
  const eventManager = useSelector((state) => state.eventManager)
  const [steps, setSteps] = useState(
    JSON.parse(JSON.stringify(defaultAdmissionFormSteps))
  )
  const [sequence, setSequence] = useState(admissionFormStepSequence)
  const [currentStepperId, setCurrentStepperId] = useState(
    admissionFormStepIds.FILL_FORM
  )
  const addLeadData = admissionCrmAddLead()
  const updateLead = admissionCrmUpdateLead()
  const paymentStatus = useCreatePaymentStatus()
  const leadList = useLeadList()
  const [formValues, setFormValues] = useState({standard: ''})
  const [formErrors, setFormErrors] = useState({})
  const [buttonText, setButtonText] = useState(
    t('admissionCrmAddLeadFormSaveNextBtn')
  )
  let formStatus = updateLead?.data?.lead?.status_adm_form
  const admissionCrmSettings = useAdmissionCrmSettings()
  const leadstages = []
  const {
    lead_stages: leadStageData,
    fee_settings: feeData,
    categorizedFields,
    admissionFormFields,
  } = admissionCrmSettings.data
  if (leadStageData) {
    const totalStages = Object.values(leadStageData).length
    Object.values(leadStageData).map((leadStage, index) => {
      if (index !== totalStages - 1) {
        // Ignore admission confirmed stage
        leadstages.push({label: leadStage.name, value: leadStage._id})
      }
    })
  }

  const {
    categorywiseRequiredFields: requiredFormFields,
    categorywiseNonVisibleFields: nonVisibleFields,
  } = useMemo(() => {
    let categorywiseRequiredFields = []
    let categorywiseNonVisibleFields = []
    Object.values(categorizedFields)
      ?.filter((field) => field.setting_type === IMIS_SETTING_TYPES.CATEGORY)
      ?.forEach((admissionFields) => {
        admissionFields.fields.forEach((field) => {
          // Exclude confirm admission fields in admission form
          if (!admissionFormSettingsHiddenFields.includes(field.key_id)) {
            if (
              admissionFormFields.profile_fields[field.key_id]?.required &&
              !permanentAddressFields.includes(field.key_id)
            ) {
              categorywiseRequiredFields.push(field.key_id)
            }
            if (!admissionFormFields.profile_fields[field.key_id]?.enabled) {
              categorywiseNonVisibleFields.push(field.key_id)
            }
          }
        })
      })
    return {categorywiseRequiredFields, categorywiseNonVisibleFields}
  }, [])

  const {
    UploadDocumentRequiredFields: requiredDocumentFields,
    visibleDocumentFields: visibleFields,
  } = useMemo(() => {
    let UploadDocumentRequiredFields = []
    let visibleDocumentFields = []
    Object.values(
      admissionCrmSettings.data?.documentFormFields?.profile_fields
    )?.forEach((uploadDocument) => {
      if (uploadDocument.required) {
        UploadDocumentRequiredFields.push(uploadDocument.imis_key_id)
      }
      if (uploadDocument.enabled) {
        visibleDocumentFields.push(uploadDocument.imis_key_id)
      }
    })
    return {UploadDocumentRequiredFields, visibleDocumentFields}
  }, [])

  const checkFieldRegexPattern = () => {
    let errors = {}
    Object.values(admissionCrmSettings.data.categorizedFields)
      ?.filter((field) => field.setting_type === IMIS_SETTING_TYPES.CATEGORY)
      ?.forEach((admissionFields) => {
        admissionFields.fields.forEach((field) => {
          if (
            formValues?.[field.key_id] &&
            field.pattern &&
            !checkRegex(new RegExp(field.pattern), formValues[field.key_id])
          ) {
            errors[field.key_id] = t('thisFieldHasIncorrectValue')
          }
        })
      })
    return errors
  }

  const onCloseFucn = () => {
    setFormValues('')
    setCurrentStepperId(admissionFormStepIds.FILL_FORM)
    setIsAddedLead(!isAddedLead)
    dispatch(globalActions.getLeadList.request())
    setFormType('')
  }

  const handleFormValues = () => {
    formStatus =
      formStatus === admissionFormLeadProfileStatus.COMPLETED ||
      currentStepperId === admissionFormStepIds.UPLOAD_DOCUMENT
        ? admissionFormLeadProfileStatus.COMPLETED
        : admissionFormLeadProfileStatus.INCOMPLETE
    if (!formValues.lead_id) {
      const successAction = (leadId) => {
        setErrorMessage('')
        eventManager.send_event(
          events.NEW_LEAD_ADMISSION_FORM_NEXT_CLICKED_TFI,
          {
            field_values: Object.keys(formValues),
          }
        )
        setFormValues({...formValues, lead_id: leadId})
        setIsAddedLead(!isAddedLead)
      }
      dispatch(
        globalActions.addLead.request(
          {
            leads: [
              {
                is_unique: true,
                class_id: formValues.standard,
                lead_stage_id: leadstage,
                profile_data: formValues,
                phone_number: formValues.phone_number,
                form_type: crmFormType.ADMISSION,
              },
            ],
          },
          successAction,
          (error) => setErrorMessage(error)
        )
      )
    } else {
      const successAction = (leadData) => {
        setErrorMessage('')
        if (
          currentStepperId === admissionFormStepIds.UPLOAD_DOCUMENT ||
          currentStepperId === admissionFormStepIds.SELECT_STAGE
        ) {
          eventManager.send_event(
            currentStepperId === admissionFormStepIds.UPLOAD_DOCUMENT
              ? events.NEW_LEAD_ADMISSION_FORM_DOCUMENTS_NEXT_CLICKED_TFI
              : events.NEW_LEAD_ADMISSION_FORM_DONE_CLICKED_TFI,
            currentStepperId === admissionFormStepIds.SELECT_STAGE
              ? {stage_of_lead: leadstage}
              : ''
          )
        }
        setIsAddedLead(!isAddedLead)
        if (currentStepperId === admissionFormStepIds.UPLOAD_DOCUMENT) {
          dispatch(
            globalActions.getLeadList.success(
              updateLeadList(leadList?.data, formValues?.lead_id, {
                status_adm_form: admissionFormLeadProfileStatus.COMPLETED,
                profile_data: leadData.profile_data,
              })
            )
          )
        }
        if (
          Object.keys(steps).length ===
          sequence.indexOf(currentStepperId) + 1
        ) {
          onCloseFucn()
        }
      }
      dispatch(
        globalActions.updateLead.request(
          {
            lead_id: formValues.lead_id,
            lead_stage_id: leadstage,
            profile_data: formValues,
            u_by: currentAdminInfo.imember_id,
            status_adm_form: formStatus,
            form_type: crmFormType.ADMISSION,
          },
          successAction,
          (error) => setErrorMessage(error)
        )
      )
    }
  }

  useEffect(() => {
    setLeadStage([...leadstages].shift().value)
  }, [])

  useEffect(() => {
    if (
      formValues?.standard &&
      (!feeData?.form_fees_required ||
        feeData.form_fees?.class_fees[formValues.standard]?.fee_amount === 0)
    ) {
      setSteps(JSON.parse(JSON.stringify(defaultAdmissionFormStepsWithoutFees)))
      setSequence(admissionFormStepSequenceWithoutFees)
    } else {
      setSteps(JSON.parse(JSON.stringify(defaultAdmissionFormSteps)))
      setSequence(admissionFormStepSequence)
    }
  }, [formValues.standard])

  const stepperHandleClick = () => {
    let stepsData = {...steps}
    const currentStepIndex = sequence.indexOf(currentStepperId)
    stepsData[currentStepperId].status = admissionStepperStatus.COMPLETED
    if (
      currentStepIndex + 1 < sequence.length &&
      stepsData[sequence[currentStepIndex + 1]].status !==
        admissionStepperStatus.COMPLETED
    ) {
      stepsData[sequence[currentStepIndex + 1]].status =
        admissionStepperStatus.IN_PROGRESS
      setCurrentStepperId(sequence[currentStepIndex + 1])
    } else {
      setCurrentStepperId(sequence[currentStepIndex + 1])
      if (currentStepIndex + 1 === sequence.length - 1) {
        setButtonText(t('save'))
      } else {
        setButtonText(t('admissionCrmAddLeadFormSaveNextBtn'))
      }
    }
    if (currentStepIndex + 1 === sequence.length - 1) {
      setButtonText(t('save'))
    }
    setSteps(stepsData)
    setIsAddedLead(!isAddedLead)
  }

  useEffect(() => {
    if (isAddedLead) {
      stepperHandleClick()
      formStatus =
        currentStepperId === admissionFormStepIds.UPLOAD_DOCUMENT ||
        formStatus === admissionFormLeadProfileStatus.COMPLETED
          ? admissionFormLeadProfileStatus.COMPLETED
          : admissionFormLeadProfileStatus.INCOMPLETE
    }
  }, [isAddedLead])

  const handleNextClick = (id) => {
    const errors = checkFieldRegexPattern()
    setFormErrors(errors)
    if (Object.keys(errors).length > 0) {
      return
    }
    if (
      id === admissionFormStepIds.RECORD_FEES &&
      Object.keys(formFeeValues).length !== 0
    ) {
      const isChequeDD = [
        admissionPaymentStatus.CHEQUE,
        admissionPaymentStatus.DD,
      ].includes(formFeeValues?.payment_mode)

      let paymentData = {}
      let metaData = {}

      if (isChequeDD) {
        metaData.ref_date = formFeeValues.ref_date
        metaData.ref_no = formFeeValues.referenceNo ?? ''
        metaData.status = admissionTransactionMethods.APPROVED
      }

      paymentData.lead_id = formValues.lead_id
      paymentData.amount = calculateAmount(
        feeData?.form_fees?.class_fees[formValues.standard]?.fee_amount,
        feeData?.form_fees?.class_fees[formValues.standard]?.tax
      )
      paymentData.payment_mode = formFeeValues.payment_mode
      paymentData.fee_type = FEES_STEPPER_IDS.FORM_FEE
      paymentData.order_timestamp = formFeeValues.order_timestamp
      paymentData.meta = {
        additional_note: formFeeValues.additionalNote,
        tax_value: calculateTaxAmount(
          feeData?.form_fees?.class_fees[formValues.standard]?.fee_amount,
          feeData?.form_fees?.class_fees[formValues.standard]?.tax
        ),
        tax_percentage:
          feeData?.form_fees?.class_fees[formValues.standard]?.tax,
        amount_without_tax:
          feeData?.form_fees?.class_fees[formValues.standard]?.fee_amount,
        metaData,
      }
      const successAction = () => {
        setErrorMessage('')
        eventManager.send_event(
          events.NEW_LEAD_ADMISSION_FORM_RECORD_FORM_FEE_NEXT_CLICKED_TFI,
          {payment_mode: formFeeValues.payment_mode}
        )
        dispatch(
          globalActions.getLeadList.success(
            updateLeadList(leadList?.data, formValues?.lead_id, {
              status_form_fee: kanbanBoardOtherFilterOptionValues.PAID,
            })
          )
        )
      }
      dispatch(
        globalActions.createAdmissionCrmOfflinePayment.request(
          paymentData,
          successAction,
          (error) => setErrorMessage(error)
        )
      )
    }
    handleFormValues()
  }

  const getEventName = (eventName) => {
    switch (eventName) {
      case admissionFormStepIds.FILL_FORM:
        return events.NEW_LEAD_FILL_FORM_CLICKED_TFI
      case admissionFormStepIds.UPLOAD_DOCUMENT:
        return events.NEW_LEAD_UPLOAD_DOCUMENTS_CLICKED_TFI
      case admissionFormStepIds.RECORD_FEES:
        return events.NEW_LEAD_RECORD_FORM_FEES_CLICKED_TFI
      case admissionFormStepIds.SELECT_STAGE:
        return events.NEW_LEAD_CHOOSE_STAGE_CLICKED_TFI
    }
  }

  const handleStepperClick = (step) => {
    const currentStepIndex = admissionFormStepSequence.indexOf(step.id)
    eventManager.send_event(getEventName(step.id))
    setCurrentStepperId(step.id)
    if (currentStepIndex + 1 === admissionFormStepSequence.length) {
      setButtonText(t('save'))
    } else {
      setButtonText(t('admissionCrmAddLeadFormSaveNextBtn'))
    }
  }

  const getDisabledField = (stepperId) => {
    if (stepperId === admissionFormStepIds.FILL_FORM) {
      return (
        (!requiredFormFields.every((field) => Boolean(formValues?.[field])) ||
          addLeadData?.isLoading) &&
        Boolean(Object.keys(formErrors))
      )
    } else if (stepperId === admissionFormStepIds.UPLOAD_DOCUMENT) {
      return (
        (!requiredDocumentFields.every((field) =>
          Boolean(formValues?.[field])
        ) ||
          updateLead?.isLoading) &&
        Boolean(Object.keys(formErrors))
      )
    } else if (stepperId === admissionFormStepIds.RECORD_FEES)
      return Boolean(!formFeeValues.payment_mode || paymentStatus?.isLoading)
    else return false
  }

  const getModalFooter = () => {
    return (
      <div>
        <Divider spacing="0" />
        <div
          className={classNames(
            styles.modalFooter,
            currentStepperId === admissionFormStepIds.RECORD_FEES &&
              styles.modalFooter2
          )}
        >
          <div className={styles.modalErrorSection}>
            {errorMessage && (
              <>
                <Icon name="info" type={ICON_CONSTANTS.TYPES.ERROR} />
                <div>{errorMessage}</div>
              </>
            )}
          </div>
          {currentStepperId === admissionFormStepIds.RECORD_FEES && (
            <Button
              onClick={() => setIsAddedLead(!isAddedLead)}
              children={t('skipStep')}
              type={BUTTON_CONSTANTS.TYPE.OUTLINE}
            />
          )}
          <Button
            onClick={() => handleNextClick(currentStepperId)}
            children={buttonText}
            isDisabled={getDisabledField(currentStepperId)}
          />
        </div>
      </div>
    )
  }

  return (
    <Modal
      size={MODAL_CONSTANTS.SIZE.X_LARGE}
      isOpen={!!formType}
      onClose={() => (formValues.lead_id ? onCloseFucn() : setFormType(''))}
      header={admissionCrmFormTypes[admissionCrmFormType.ADMISSION_FORM].label}
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
      footer={getModalFooter()}
    >
      <ErrorBoundary>
        <div className={styles.formDisplay}>
          <div className={styles.stepperStyles}>
            <Stepper
              steps={Object.values(steps)}
              onClickOfStep={handleStepperClick}
              classes={{wrapper: styles.stepperWrapper}}
            />
          </div>

          {addLeadData?.isLoading ? (
            <div className="loader"></div>
          ) : (
            currentStepperId === admissionFormStepIds.FILL_FORM && (
              <div className={styles.scrollClass}>
                <AdmissionForm
                  formData={formValues}
                  setFormData={setFormValues}
                  formErrors={formErrors}
                  ignoreFields={confirmAdmissionRequiredFields}
                  requiredFields={requiredFormFields}
                  nonVisibleFields={nonVisibleFields}
                  disabledFields={
                    formValues.lead_id
                      ? [
                          staticImisFields.PHONE_NUMBER,
                          staticImisFields.STANDARD,
                        ]
                      : []
                  }
                />
              </div>
            )
          )}

          {updateLead?.isLoading ? (
            <div className="loader"></div>
          ) : (
            currentStepperId === admissionFormStepIds.UPLOAD_DOCUMENT && (
              <div className={styles.scrollClass}>
                <UploadDocuments
                  formValues={formValues}
                  setFormValues={setFormValues}
                  requiredFields={visibleFields}
                />
              </div>
            )
          )}

          {paymentStatus?.isLoading ? (
            <div className="loader"></div>
          ) : (
            currentStepperId === admissionFormStepIds.RECORD_FEES &&
            feeData.form_fees?.class_fees[formValues.standard]?.fee_amount !==
              0 && (
              <div className={styles.scrollClass}>
                <RecordFees
                  feesData={feeData?.form_fees?.class_fees[formValues.standard]}
                  formData={formFeeValues}
                  setFormData={setFormFeeValues}
                />
              </div>
            )
          )}

          {updateLead?.isLoading ? (
            <div className="loader"></div>
          ) : (
            currentStepperId === admissionFormStepIds.SELECT_STAGE && (
              <div className={styles.scrollClass}>
                <ChooseStage
                  leadstages={leadstages}
                  leadstage={leadstage}
                  setLeadStage={setLeadStage}
                />
              </div>
            )
          )}
        </div>
      </ErrorBoundary>
    </Modal>
  )
}
