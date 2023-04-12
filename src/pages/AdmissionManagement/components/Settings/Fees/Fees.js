import {useSelector} from 'react-redux'
import {t} from 'i18next'
import {
  Button,
  BUTTON_CONSTANTS,
  Divider,
  Heading,
  HEADING_CONSTANTS,
  IconFrame,
  Icon,
  ICON_CONSTANTS,
  Para,
  PARA_CONSTANTS,
  PlainCard,
  Stepper,
} from '@teachmint/krayon'
import {events} from '../../../../../utils/EventsConstants'
import classNames from 'classnames'
import FormFees from './FormFees'
import styles from './Fees.module.css'
import {onboardingFlowStepsId} from '../../../utils/constants'
import {useCrmPgKycStatus} from '../../../redux/admissionManagement.selectors'
import {
  validateCrmSettings,
  validateFeesFormData,
} from '../../../validations/configurationSteps'

export default function Fees({
  formData,
  setFormData,
  currentStep,
  setCurrentStep,
  stepperOptions,
  isFormFeesStep,
  setErrorMessage,
}) {
  const crmPgKycStatus = useCrmPgKycStatus()
  const isPgConfigured = crmPgKycStatus?.data?.kyc_status
  const eventManager = useSelector((state) => state.eventManager)

  const handleStepChange = (step) => {
    if (
      !validateCrmSettings(onboardingFlowStepsId.FEES, formData, isFormFeesStep)
    ) {
      setErrorMessage('')
      return
    } else if (!validateFeesFormData(isFormFeesStep, formData)) {
      setErrorMessage(t('feesStepperErrorMessage'))
      return
    }
    if (step.id !== currentStep) {
      setCurrentStep(step.id)
    }
  }

  const handleConfigureClick = () => {
    eventManager.send_event(events.ADMISSION_PG_SETUP_INITIATED_TFI)
    window.open(
      `/institute/dashboard/fee-config/payment-gateway-setup`,
      '_blank'
    )
  }

  return (
    <div>
      {crmPgKycStatus?.isLoading ? (
        <div className={styles.pgCardLoader}>
          <div className="loading"></div>
        </div>
      ) : (
        <div className={styles.cardWrapper}>
          <PlainCard
            className={classNames(
              styles.pgCard,
              isPgConfigured ? styles.configuredCard : styles.notConfiguredCard
            )}
          >
            <div className={styles.pgCardContent}>
              <div className={styles.pgCardDetails}>
                <IconFrame
                  size={ICON_CONSTANTS.SIZES.X_LARGE}
                  type={
                    isPgConfigured
                      ? ICON_CONSTANTS.TYPES.SUCCESS
                      : ICON_CONSTANTS.TYPES.WARNING
                  }
                >
                  <Icon
                    name={isPgConfigured ? 'checkCircle' : 'error'}
                    size={ICON_CONSTANTS.SIZES.X_SMALL}
                    type={ICON_CONSTANTS.TYPES.INVERTED}
                  />
                </IconFrame>
                <div>
                  <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
                    {isPgConfigured
                      ? t('feesConfiguredPaymentGatewayTitle')
                      : t('feesNotConfiguredPaymentGatewayTitle')}
                  </Heading>
                  <Para weight={PARA_CONSTANTS.WEIGHT.MEDIUM}>
                    {isPgConfigured
                      ? t('feesConfiguredPaymentGatewayDescription')
                      : t('feesNotConfiguredPaymentGatewayDescription')}
                  </Para>
                </div>
              </div>
              <div>
                <Button
                  type={BUTTON_CONSTANTS.TYPE.OUTLINE}
                  suffixIcon="openInNewTab"
                  onClick={handleConfigureClick}
                >
                  {isPgConfigured
                    ? t('feesPaymentGatewayConfigureBtnText')
                    : t('feesPaymentGatewayConfigureNowBtnText')}
                </Button>
              </div>
            </div>
          </PlainCard>
        </div>
      )}
      <Divider spacing="20px" thickness="1px" />
      <div className={styles.formContent}>
        <Stepper
          onClickOfStep={handleStepChange}
          steps={Object.values(stepperOptions)}
        />
        <FormFees
          currentStep={currentStep}
          formData={formData}
          setFormData={setFormData}
        />
      </div>
    </div>
  )
}
