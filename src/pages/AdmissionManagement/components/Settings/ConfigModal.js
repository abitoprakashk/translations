import {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {t} from 'i18next'
import produce from 'immer'
import {
  Button,
  BUTTON_CONSTANTS,
  Divider,
  Icon,
  ICON_CONSTANTS,
  Modal,
  STEPPER_CONSTANTS,
} from '@teachmint/krayon'
import {ErrorBoundary} from '@teachmint/common'
import globalActions from '../../../../redux/actions/global.actions'
import {
  FEES_STEPPER_IDS,
  FEES_STEPPER_SEQUENCE,
  onboardingFlowSteps,
  onboardingFlowStepsId,
  onboardingFlowStepsSequence,
  sessionData,
} from '../../utils/constants'
import {
  useAdmissionCrmSettings,
  useUpdateAdmissionCrmSettings,
  printAdmissionForm,
} from '../../redux/admissionManagement.selectors'
import {
  validateCrmSettings,
  validateFeesFormData,
} from '../../validations/configurationSteps'
import LoadingButton from '../../../../components/Common/LoadingButton/LoadingButton'
import {feesStepperOptions, openLinkInNewTab} from '../../utils/helpers'
import {setCrmHeaders} from '../../utils/apis.constants'
import styles from './ConfigModal.module.css'
import LeadStage from './LeadStage/LeadStage'
import Session from './Session/Session'
import WebPage from './WebPage/WebPage'
import EnquiryForm from './EnquiryForm/EnquiryForm'
import AdmissionForm from './AdmissionForm/AdmissionForm'
import Documents from './Documents/Documents'
import Fees from './Fees/Fees'
import {events} from '../../../../utils/EventsConstants'

const stepEventStatus = {
  COMPLETED: 'COMPLETED',
  UPDATED: 'UPDATED',
}

const stepEvents = {
  [onboardingFlowStepsId.SESSION]: {
    [stepEventStatus.COMPLETED]: events.ADMISSION_SESSION_SETUP_COMPLETED_TFI,
    [stepEventStatus.UPDATED]: events.ADMISSION_SESSION_SETUP_UPDATED_TFI,
  },
  [onboardingFlowStepsId.LEAD_STAGES]: {
    [stepEventStatus.COMPLETED]: events.ADMISSION_LEADSTAGE_SETUP_COMPLETED_TFI,
    [stepEventStatus.UPDATED]: events.ADMISSION_LEADSTAGE_SETUP_UPDATED_TFI,
  },
  [onboardingFlowStepsId.WEB_PAGE]: {
    [stepEventStatus.COMPLETED]: events.ADMISSION_WEBPAGE_SETUP_COMPLETED_TFI,
    [stepEventStatus.UPDATED]: events.ADMISSION_WEBPAGE_SETUP_UPDATED_TFI,
  },
  [onboardingFlowStepsId.ENQUIRY_FORM]: {
    [stepEventStatus.COMPLETED]:
      events.ADMISSION_ENQUIRYFORM_SETUP_COMPLETED_TFI,
    [stepEventStatus.UPDATED]: events.ADMISSION_ENQUIRYFORM_SETUP_UPDATED_TFI,
  },
  [onboardingFlowStepsId.ADMISSION_FORM]: {
    [stepEventStatus.COMPLETED]: events.ADMISSION_FORM_SETUP_COMPLETED_TFI,
    [stepEventStatus.UPDATED]: events.ADMISSION_FORM_SETUP_UPDAED_TFI,
  },
  [onboardingFlowStepsId.DOCUMENTS]: {
    [stepEventStatus.COMPLETED]: events.ADMISSION_DOCUMENTS_SETUP_COMPLETED_TFI,
    [stepEventStatus.UPDATED]: events.ADMISSION_DOCUMENTS_SETUP_UPDATED_TFI,
  },
  [onboardingFlowStepsId.FEES]: {
    [stepEventStatus.COMPLETED]: events.ADMISSION_FEES_SETUP_COMPLETED_TFI,
    [stepEventStatus.UPDATED]: events.ADMISSION_FEES_SETUP_UPDATED_TFI,
  },
}

export default function ConfigModal({
  type,
  data,
  selectedStep,
  setSelectedStep,
  setShowModal,
}) {
  const dispatch = useDispatch()
  const admissionCrmSettings = useAdmissionCrmSettings()
  const updateAdmissionCrmSettings = useUpdateAdmissionCrmSettings()
  const getAdmissionFormUrl = printAdmissionForm()
  const [formData, setFormData] = useState(JSON.parse(JSON.stringify(data)))
  const [errorMessage, setErrorMessage] = useState('')
  const [currentStep, setCurrentStep] = useState(FEES_STEPPER_IDS.FORM_FEE)
  const [isLoading, setIsLoading] = useState(false)
  const [stepperOptions, setStepperOptions] = useState(
    feesStepperOptions(admissionCrmSettings)
  )
  const eventManager = useSelector((state) => state.eventManager)
  const isFormFeesStep =
    FEES_STEPPER_SEQUENCE.indexOf(currentStep) !==
    FEES_STEPPER_SEQUENCE.length - 1

  useEffect(() => {
    if (type === onboardingFlowStepsId.FEES) {
      dispatch(globalActions.checkCrmPgKycStatus.request())
    }
  }, [])

  const getEventData = () => {
    const eventStatus = selectedStep
      ? stepEventStatus.COMPLETED
      : stepEventStatus.UPDATED
    let eventData = {
      eventName: stepEvents[type][eventStatus],
      data: {},
    }
    switch (type) {
      case onboardingFlowStepsId.SESSION:
        eventData.data = {
          standard: formData.enabled_node_ids,
          session: formData.session_id,
        }
        break
      case onboardingFlowStepsId.LEAD_STAGES:
        eventData.data = {
          stages_count: formData ? Object.keys(formData).length : 0,
        }
        break
    }
    return eventData
  }

  const handleClick = () => {
    setErrorMessage('')
    if (type === onboardingFlowStepsId.FEES) {
      if (!validateFeesFormData(isFormFeesStep, formData)) {
        setErrorMessage(t('feesStepperErrorMessage'))
        return
      }
      if (isFormFeesStep) {
        const currentStepIndex = FEES_STEPPER_SEQUENCE.indexOf(currentStep)
        const nextStepIndex = currentStepIndex + 1
        let newStepperOptions = produce(stepperOptions, (draft) => {
          draft[FEES_STEPPER_SEQUENCE[currentStepIndex]].status =
            STEPPER_CONSTANTS.STATUS.COMPLETED
          draft[FEES_STEPPER_SEQUENCE[nextStepIndex]].status =
            STEPPER_CONSTANTS.STATUS.IN_PROGRESS
        })
        setStepperOptions(newStepperOptions)
        setCurrentStep(FEES_STEPPER_SEQUENCE[nextStepIndex])
        return
      }
    }

    const successAction = () => {
      const eventData = getEventData()
      eventManager.send_event(eventData.eventName, eventData.data)
      if (selectedStep) {
        const currentStep = onboardingFlowStepsSequence.indexOf(selectedStep)
        onboardingFlowStepsSequence.length !== currentStep + 1
          ? setSelectedStep(onboardingFlowStepsSequence[currentStep + 1])
          : setShowModal(false)
      } else {
        setShowModal(false)
      }
      if (onboardingFlowSteps[type].settingsKey === sessionData.settingsKey) {
        setCrmHeaders(formData.session_id)
      }
    }

    dispatch(
      globalActions.updateAdmissionCrmSettings.request(
        {
          type: type,
          payload: {
            setting_key: onboardingFlowSteps[type].settingsKey,
            meta: formData,
          },
        },
        successAction,
        (error) => setErrorMessage(error)
      )
    )
  }

  useEffect(() => {
    if (getAdmissionFormUrl?.data != null) {
      openLinkInNewTab(getAdmissionFormUrl?.data + '?timestamp=' + Date.now())
      dispatch(globalActions.printAdmissionForm.reset())
      setIsLoading(false)
    }
  }, [getAdmissionFormUrl?.data])

  const printHandle = () => {
    eventManager.send_event(events.ADMISSION_FORM_DOWNLOAD_CLICKED_TFI, {
      screen_name: 'admisison_form',
    })
    setIsLoading(true)
    dispatch(globalActions.printAdmissionForm.request())
  }

  const getModalComponent = () => {
    switch (type) {
      case onboardingFlowStepsId.SESSION:
        return <Session formData={formData} setFormData={setFormData} />
      case onboardingFlowStepsId.LEAD_STAGES:
        return <LeadStage formData={formData} setFormData={setFormData} />
      case onboardingFlowStepsId.WEB_PAGE:
        return <WebPage formData={formData} setFormData={setFormData} />
      case onboardingFlowStepsId.ENQUIRY_FORM:
        return (
          <EnquiryForm
            formData={formData}
            setFormData={setFormData}
            setErrorMessage={setErrorMessage}
          />
        )
      case onboardingFlowStepsId.ADMISSION_FORM:
        return <AdmissionForm formData={formData} setFormData={setFormData} />
      case onboardingFlowStepsId.DOCUMENTS:
        return <Documents formData={formData} setFormData={setFormData} />
      case onboardingFlowStepsId.FEES:
        return (
          <Fees
            formData={formData}
            setFormData={setFormData}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            stepperOptions={stepperOptions}
            isFormFeesStep={isFormFeesStep}
            setErrorMessage={setErrorMessage}
          />
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
          <div className={styles.buttonWrapper}>
            {type === onboardingFlowStepsId.ADMISSION_FORM ? (
              isLoading ? (
                <div className={styles.loader}>
                  <LoadingButton size="medium" />
                </div>
              ) : (
                <Button
                  onClick={printHandle}
                  type={BUTTON_CONSTANTS.TYPE.OUTLINE}
                  prefixIcon="download"
                >
                  {t('downloadAdmissionFormSettingsTab')}
                </Button>
              )
            ) : (
              ''
            )}
            <Button
              onClick={handleClick}
              isDisabled={
                !validateCrmSettings(type, formData, isFormFeesStep) ||
                updateAdmissionCrmSettings.isLoading
              }
              classes={{button: styles.actionBtn}}
            >
              {type === onboardingFlowStepsId.FEES &&
              currentStep === FEES_STEPPER_IDS.FORM_FEE
                ? t('feesStepperNextBtnText')
                : selectedStep && currentStep !== FEES_STEPPER_IDS.ADMISSION_FEE
                ? t('feesStepperSaveAndNextBtnText')
                : t('feesStepperSaveBtnText')}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Modal
      isOpen
      size={onboardingFlowSteps[type].size}
      header={onboardingFlowSteps[type].title}
      onClose={() => setShowModal(false)}
      classes={{modal: styles.modal}}
      footer={getModalFooter()}
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
    >
      <ErrorBoundary>
        {updateAdmissionCrmSettings.isLoading ? (
          <div className="loader"></div>
        ) : (
          getModalComponent()
        )}
      </ErrorBoundary>
    </Modal>
  )
}
