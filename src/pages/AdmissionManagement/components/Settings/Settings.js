import {useState} from 'react'
import {useSelector} from 'react-redux'
import {
  Heading,
  HEADING_CONSTANTS,
  IconFrame,
  Icon,
  ICON_CONSTANTS,
  ICON_FRAME_CONSTANTS,
  Para,
} from '@teachmint/krayon'
import {ErrorBoundary} from '@teachmint/common'
import {
  useAdmissionCrmSettings,
  useAdmissionCrmSettingsProgress,
} from '../../redux/admissionManagement.selectors'
import ConfigModal from './ConfigModal'
import styles from './Settings.module.css'
import {onboardingFlowSteps, onboardingFlowStepsId} from '../../utils/constants'
import {
  checkCrmSettingsToProceed,
  getCrmSettingsFormData,
} from '../../utils/helpers'
import {events} from '../../../../utils/EventsConstants'

export default function Settings() {
  const [showModal, setShowModal] = useState(false)
  const [selectedStep, setSelectedStep] = useState(null)
  const admissionCrmSettings = useAdmissionCrmSettings()
  const admissionCrmSettingsProgress = useAdmissionCrmSettingsProgress()
  const eventManager = useSelector((state) => state.eventManager)

  const getEventName = (id) => {
    switch (id) {
      case onboardingFlowStepsId.SESSION:
        return events.ADMISSION_SESSION_EDIT_CLICKED_TFI
      case onboardingFlowStepsId.LEAD_STAGES:
        return events.ADMISSION_LEAD_STAGE_EDIT_CLICKED_TFI
      case onboardingFlowStepsId.WEB_PAGE:
        return events.ADMISSION_WEB_PAGE_EDIT_CLICKED_TFI
      case onboardingFlowStepsId.ENQUIRY_FORM:
        return events.ADMISSION_ENQUIRY_FORM_EDIT_CLICKED_TFI
      case onboardingFlowStepsId.ADMISSION_FORM:
        return events.ADMISSION_ADMISSION_FORM_EDIT_CLICKED_TFI
      case onboardingFlowStepsId.DOCUMENTS:
        return events.ADMISSION_DOCUMENTS_EDIT_CLICKED_TFI
      case onboardingFlowStepsId.FEES:
        return events.ADMISSION_FEE_EDIT_CLICKED_TFI
    }
  }

  const handleClick = (step) => {
    eventManager.send_event(getEventName(step.id))
    if (
      !checkCrmSettingsToProceed(
        step.mandatorySteps,
        admissionCrmSettingsProgress
      )
    ) {
      setSelectedStep(step.id)
      setShowModal(true)
    }
  }

  return (
    <ErrorBoundary>
      {showModal && (
        <ConfigModal
          type={selectedStep}
          setShowModal={setShowModal}
          data={getCrmSettingsFormData(selectedStep, admissionCrmSettings)}
        />
      )}
      {Object.values(onboardingFlowSteps).map((step) => {
        return (
          <div key={step.id} className={styles.stepSection}>
            <div>
              <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
                {step.title}
              </Heading>
              <Para>{step.settingsDescription}</Para>
            </div>
            <div onClick={() => handleClick(step)}>
              <IconFrame
                size={ICON_FRAME_CONSTANTS.SIZES.LARGE}
                type={ICON_FRAME_CONSTANTS.TYPES.PRIMARY}
              >
                <Icon size={ICON_CONSTANTS.SIZES.XXX_SMALL} name="edit2" />
              </IconFrame>
            </div>
          </div>
        )
      })}
    </ErrorBoundary>
  )
}
