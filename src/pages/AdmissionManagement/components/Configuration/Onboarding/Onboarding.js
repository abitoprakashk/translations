import classNames from 'classnames'
import {
  Heading,
  HEADING_CONSTANTS,
  IconFrame,
  ICON_FRAME_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  Para,
  PlainCard,
} from '@teachmint/krayon'
import {ErrorBoundary} from '@teachmint/common'
import styles from './Onboarding.module.css'
import {
  enquiryFormData,
  onboardingFlowSteps,
  onboardingFlowStepsId,
} from '../../../utils/constants'
import {
  useAdmissionCrmSettings,
  useAdmissionCrmSettingsProgress,
} from '../../../redux/admissionManagement.selectors'
import ConfigModal from '../../Settings/ConfigModal'
import {
  checkCrmSettingsToProceed,
  getCrmSettingsFormData,
} from '../../../utils/helpers'
import {useSelector} from 'react-redux'
import {events} from '../../../../../utils/EventsConstants'
import produce from 'immer'

export default function Onboarding({
  showModal,
  setShowModal,
  selectedStep,
  setSelectedStep,
}) {
  const {eventManager, instituteInfo} = useSelector((state) => state)
  const admissionCrmSettings = useAdmissionCrmSettings()
  const admissionCrmSettingsProgress = useAdmissionCrmSettingsProgress()

  const getEventName = (eventStepId) => {
    switch (eventStepId) {
      case onboardingFlowStepsId.SESSION:
        return events.ADMISSION_SESSION_SETUP_INITIATED_TFI
      case onboardingFlowStepsId.LEAD_STAGES:
        return events.ADMISSION_LEADSTAGE_SETUP_INITIATED_TFI
      case onboardingFlowStepsId.WEB_PAGE:
        return events.ADMISSION_WEBPAGE_SETUP_INITIATED_TFI
      case onboardingFlowStepsId.ENQUIRY_FORM:
        return events.ADMISSION_ENQUIRYFORM_SETUP_INITIATED_TFI
      case onboardingFlowStepsId.ADMISSION_FORM:
        return events.ADMISSION_FORM_SETUP_INITIATED_TFI
      case onboardingFlowStepsId.DOCUMENTS:
        return events.ADMISSION_DOCUMENTS_SETUP_INITIATED_TFI
      case onboardingFlowStepsId.FEES:
        return events.ADMISSION_FEES_SETUP_INITIATED_TFI
    }
  }

  const handleClick = (step) => {
    if (
      !checkCrmSettingsToProceed(
        step.mandatorySteps,
        admissionCrmSettingsProgress
      )
    ) {
      eventManager.send_event(getEventName(step.id))
      setSelectedStep(step.id)
      setShowModal(true)
    }
  }

  const isStepDisabled = (step) => {
    return checkCrmSettingsToProceed(
      step.mandatorySteps,
      admissionCrmSettingsProgress
    )
  }

  const getCrmSettingsData = () => {
    const formData = getCrmSettingsFormData(selectedStep, admissionCrmSettings)
    return produce(formData, (draft) => {
      if (
        selectedStep === onboardingFlowStepsId.ENQUIRY_FORM &&
        !admissionCrmSettings?.data?.[enquiryFormData.settingsKey]
          ?.enq_form_step
      ) {
        // Show institute name along with description for the first time only
        draft.declaration.text = `${draft.declaration.text} ${instituteInfo.name}`
      }
    })
  }

  return (
    <div className={styles.row}>
      {showModal && (
        <ConfigModal
          type={selectedStep}
          setShowModal={setShowModal}
          data={getCrmSettingsData()}
          selectedStep={selectedStep}
          setSelectedStep={setSelectedStep}
        />
      )}
      <ErrorBoundary>
        {Object.values(onboardingFlowSteps).map((step) => {
          return (
            <div key={step.id} className={styles.stepCardWrapper}>
              <PlainCard
                onClick={() => handleClick(step)}
                className={classNames(styles.stepCard, {
                  [styles.isDisabled]: isStepDisabled(step),
                  [styles.isCompleted]:
                    admissionCrmSettingsProgress?.data &&
                    admissionCrmSettingsProgress.data[step.id],
                })}
              >
                <div className={styles.stepIcon}>
                  <IconFrame
                    className={
                      isStepDisabled(step)
                        ? styles.disabled
                        : styles[step.className]
                    }
                    size={ICON_FRAME_CONSTANTS.SIZES.XX_LARGE}
                  >
                    <Icon
                      name={step.icon}
                      type={ICON_CONSTANTS.TYPES.INVERTED}
                      size={ICON_CONSTANTS.SIZES.X_SMALL}
                    />
                  </IconFrame>
                  <Icon
                    name="forwardArrow"
                    size={ICON_CONSTANTS.SIZES.X_SMALL}
                    type={
                      isStepDisabled(step)
                        ? ICON_CONSTANTS.TYPES.SECONDARY
                        : ICON_CONSTANTS.TYPES.BASIC
                    }
                  />
                </div>
                <div className={styles.stepTitle}>
                  <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
                    {step.title}
                  </Heading>
                  {admissionCrmSettingsProgress?.data &&
                    admissionCrmSettingsProgress.data[step.id] && (
                      <Icon
                        name="checkCircle"
                        type={ICON_CONSTANTS.TYPES.SUCCESS}
                        size={ICON_CONSTANTS.SIZES.XX_SMALL}
                      />
                    )}
                </div>
                <Para className={styles.stepDescription}>
                  {step.description}
                </Para>
              </PlainCard>
            </div>
          )
        })}
      </ErrorBoundary>
    </div>
  )
}
