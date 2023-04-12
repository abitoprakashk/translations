import {useEffect, useMemo, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {t} from 'i18next'
import {
  Button,
  Divider,
  Icon,
  ICON_CONSTANTS,
  Modal,
  MODAL_CONSTANTS,
  Stepper,
  BUTTON_CONSTANTS,
} from '@teachmint/krayon'
import {ErrorBoundary} from '@teachmint/common'
import LoadingButton from '../../../../../components/Common/LoadingButton/LoadingButton'
import {checkRegex} from '../../../../../utils/Validations'
import styles from './LeadProfileAdmissionForm.module.css'
import globalActions from '../../../../../redux/actions/global.actions'
import {
  admissionCrmAddLead,
  admissionCrmUpdateLead,
  useAdmissionCrmSettings,
  useLeadList,
  printAdmissionFormForLead,
} from '../../../redux/admissionManagement.selectors'
import {
  IMIS_SETTING_TYPES,
  admissionCrmFormTypes,
  admissionFormStepIds,
  admissionStepperStatus,
  admissionFormStepSequenceProfileManagementViewForm,
  defaultAdmissionFormStepsProfileManagementViewForm,
  confirmAdmissionRequiredFields,
  admissionFormLeadProfileStatus,
  permanentAddressFields,
  staticImisFields,
} from '../../../utils/constants'
import UploadDocuments from '../../AddLead/UploadDocuments'
import AdmissionForm from '../../Common/AdmissionForm/AdmissionForm'
import {updateLeadList, openLinkInNewTab} from '../../../utils/helpers'
import {events} from '../../../../../utils/EventsConstants'

export default function LeadProfileAdmissionForm({
  profileData,
  showAdmissionForm,
  setShowAdmissionForm,
}) {
  const dispatch = useDispatch()
  const leadList = useLeadList()
  const addLeadData = admissionCrmAddLead()
  const updateLead = admissionCrmUpdateLead()
  const getAdmissionForm = printAdmissionFormForLead()
  const admissionCrmSettings = useAdmissionCrmSettings()
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const currentAdminInfo = useSelector((state) => state.currentAdminInfo)
  const [steps, setSteps] = useState(
    JSON.parse(
      JSON.stringify(defaultAdmissionFormStepsProfileManagementViewForm)
    )
  )
  const [formErrors, setFormErrors] = useState({})
  const [buttonText, setButtonText] = useState(
    t('admissionCrmAddLeadFormSaveNextBtn')
  )
  const {categorizedFields, admissionFormFields, documentFormFields} =
    admissionCrmSettings.data
  const [formValues, setFormValues] = useState(profileData?.profile_data ?? {})
  const [isAddedLead, setIsAddedLead] = useState(false)

  const [currentStepperId, setCurrentStepperId] = useState(
    admissionFormStepIds.FILL_FORM
  )

  const eventManager = useSelector((state) => state.eventManager)

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
          if (
            admissionFormFields.profile_fields[field.key_id]?.required &&
            !confirmAdmissionRequiredFields.includes(field.key_id) &&
            !permanentAddressFields.includes(field.key_id)
          ) {
            categorywiseRequiredFields.push(field.key_id)
          }
          if (!admissionFormFields.profile_fields[field.key_id]?.enabled) {
            categorywiseNonVisibleFields.push(field.key_id)
          }
        })
      })
    return {categorywiseRequiredFields, categorywiseNonVisibleFields}
  }, [])

  const {
    requiredFields: requiredDocumentFields,
    visibleDocumentFields: visibleFields,
  } = useMemo(() => {
    let requiredFields = []
    let visibleDocumentFields = []
    Object.values(documentFormFields?.profile_fields)?.forEach(
      (uploadDocument) => {
        if (uploadDocument.required) {
          requiredFields.push(uploadDocument.imis_key_id)
        }
        if (uploadDocument.enabled) {
          visibleDocumentFields.push(uploadDocument.imis_key_id)
        }
      }
    )
    return {requiredFields, visibleDocumentFields}
  }, [])

  const checkFieldRegexPattern = () => {
    let errors = {}
    Object.values(categorizedFields)
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

  const setLastStepButtonText = (currentStepIndex, stepSequence) => {
    setButtonText(
      currentStepIndex + 1 === stepSequence.length - 1
        ? t('save')
        : t('admissionCrmAddLeadFormSaveNextBtn')
    )
  }

  const stepperHandleClick = () => {
    let stepsData = {...steps}
    const stepSequence = admissionFormStepSequenceProfileManagementViewForm
    const currentStepIndex = stepSequence.indexOf(currentStepperId)
    const nextStepIndex = currentStepIndex + 1
    stepsData[currentStepperId].status = admissionStepperStatus.COMPLETED
    if (
      nextStepIndex < stepSequence.length &&
      stepsData[stepSequence[nextStepIndex]].status !==
        admissionStepperStatus.COMPLETED
    ) {
      stepsData[stepSequence[nextStepIndex]].status =
        admissionStepperStatus.IN_PROGRESS
      setCurrentStepperId(stepSequence[nextStepIndex])
    }
    setCurrentStepperId(stepSequence[nextStepIndex])
    setLastStepButtonText(currentStepIndex, stepSequence)
    setSteps(stepsData)
    setIsAddedLead(!isAddedLead)
  }

  useEffect(() => {
    if (isAddedLead) {
      stepperHandleClick()
    }
  }, [isAddedLead])

  const handleNextClick = () => {
    setErrorMessage('')
    const errors = checkFieldRegexPattern()
    setFormErrors(errors)
    if (Object.keys(errors).length > 0) {
      return
    }
    const successAction = (leadData) => {
      setIsAddedLead(!isAddedLead)
      dispatch(
        globalActions.getLeadList.success(
          updateLeadList(leadList?.data, profileData._id, leadData)
        )
      )
      dispatch(globalActions.getLeadRecentActivity.request(profileData._id))
    }
    const formStatus =
      currentStepperId === admissionFormStepIds.UPLOAD_DOCUMENT ||
      profileData.status_adm_form === admissionFormLeadProfileStatus.COMPLETED
        ? admissionFormLeadProfileStatus.COMPLETED
        : admissionFormLeadProfileStatus.INCOMPLETE
    dispatch(
      globalActions.updateLead.request(
        {
          lead_id: profileData._id,
          profile_data: formValues,
          class_id: formValues.standard,
          u_by: currentAdminInfo.imember_id,
          status_adm_form: formStatus,
        },
        successAction,
        (error) => setErrorMessage(error)
      )
    )
    if (buttonText === t('save')) {
      setFormValues('')
      setCurrentStepperId(admissionFormStepIds.FILL_FORM)
      setIsAddedLead(!isAddedLead)
      setShowAdmissionForm(false)
    }
  }

  useEffect(() => {
    if (getAdmissionForm?.data != null) {
      openLinkInNewTab(getAdmissionForm?.data + '?timestamp=' + Date.now())
      dispatch(globalActions.printAdmissionFormForLead.reset())
      setIsLoading(false)
    }
  }, [getAdmissionForm?.data])

  const handleDownload = () => {
    eventManager.send_event(events.ADMISSION_FORM_DOWNLOAD_CLICKED_TFI, {
      screen_name: 'fill_admisison_form',
      lead_id: profileData._id,
    })
    setIsLoading(true)
    dispatch(globalActions.printAdmissionFormForLead.request(profileData._id))
  }

  const isSubmitDisabled = (stepperId) => {
    if (stepperId === admissionFormStepIds.FILL_FORM) {
      return (
        !requiredFormFields.every((field) => Boolean(formValues?.[field])) &&
        Boolean(Object.keys(formErrors))
      )
    } else if (stepperId === admissionFormStepIds.UPLOAD_DOCUMENT) {
      return (
        !requiredDocumentFields.every((field) =>
          Boolean(formValues?.[field])
        ) && Boolean(Object.keys(formErrors))
      )
    }
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
          <div className={styles.footerButton}>
            {currentStepperId === admissionFormStepIds.FILL_FORM ? (
              isLoading ? (
                <div className={styles.loader}>
                  <LoadingButton size="medium" />
                </div>
              ) : (
                <Button
                  children={t('downloadAdmissionFormLeadProfilePage')}
                  onClick={() => handleDownload()}
                  type={BUTTON_CONSTANTS.TYPE.OUTLINE}
                  prefixIcon="download"
                />
              )
            ) : (
              ''
            )}

            <Button
              children={buttonText}
              onClick={() => handleNextClick(currentStepperId)}
              isDisabled={isSubmitDisabled(currentStepperId)}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <Modal
      isOpen={showAdmissionForm}
      onClose={() => setShowAdmissionForm(false)}
      size={MODAL_CONSTANTS.SIZE.X_LARGE}
      header={admissionCrmFormTypes.ADMISSION_FORM.label}
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
      footer={getModalFooter()}
    >
      <ErrorBoundary>
        <div className={styles.formDisplay}>
          <div className={styles.stepperStyles}>
            <Stepper
              steps={Object.values(steps)}
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
                  requiredFields={requiredFormFields}
                  nonVisibleFields={nonVisibleFields}
                  ignoreFields={confirmAdmissionRequiredFields}
                  disabledFields={[staticImisFields.PHONE_NUMBER]}
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
        </div>
      </ErrorBoundary>
    </Modal>
  )
}
