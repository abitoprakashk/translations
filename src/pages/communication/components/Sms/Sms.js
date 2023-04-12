import {ErrorBoundary} from '@teachmint/common'
import {
  Stepper,
  STEPPER_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
} from '@teachmint/krayon'
import SliderScreenHeader from '../../../../components/Common/SliderScreenHeader/SliderScreenHeader'
import {ContentContainer} from './components/ContentContainer/ContentContainer'
import {Credits} from './components/Credits/Credits'
import styles from './Sms.module.css'
import {
  getSmsTemplates,
  setSmsBody,
  setTemplateId,
} from '../../redux/actions/smsActions'
import {useDispatch, useSelector} from 'react-redux'
import {useEffect, useState} from 'react'
import ButtonPanel from '../ButtonPanel'
import {setAnnouncementTypeAction} from '../../redux/actions/commonActions'
import {announcementType} from '../../constants'
import {StepperWrapper} from './components/StepperWrapper/StepperWrapper'
import {useTranslation} from 'react-i18next'
import {SMS_CREATION_STEPS} from '../../constants'
import {events} from '../../../../utils/EventsConstants'
import {addUserInputData} from '../../redux/actions/smsActions'
import classNames from 'classnames'
export const Sms = ({createCommunication}) => {
  const dispatch = useDispatch()
  const [currentStep, setCurrentStep] = useState(0)
  const [varData, setVarData] = useState({})
  const [stepperStatus, setStepperStatus] = useState([
    STEPPER_CONSTANTS.STATUS.IN_PROGRESS,
    STEPPER_CONSTANTS.STATUS.NOT_STARTED,
    STEPPER_CONSTANTS.STATUS.NOT_STARTED,
  ])
  const {segments, selected_users, isUserFilterVisible} = useSelector(
    (state) => state.communicationInfo.common
  )
  const {eventManager} = useSelector((state) => state)
  const {unusedQuota, allVarsFilled} = useSelector(
    (state) => state.communicationInfo.sms
  )
  const isRechargeOpen = useSelector(
    (state) => state.communicationInfo.sms.isRechargeOpen
  )
  const {t} = useTranslation()
  const smsIcon = (
    <Icon
      className={styles.smsIcon}
      name="chat"
      size={ICON_CONSTANTS.SIZES.X_SMALL}
    />
  )
  const SMS_CREATION_STEPS_LIST = SMS_CREATION_STEPS.map((item, i) => {
    return {...item, status: stepperStatus[i]}
  })

  const changeStepperUi = (step) => {
    const nextStatus = stepperStatus.map((item, i) => {
      if (i < step) {
        return STEPPER_CONSTANTS.STATUS.COMPLETED
      }
      if (i > step) {
        return STEPPER_CONSTANTS.STATUS.NOT_STARTED
      }
      return STEPPER_CONSTANTS.STATUS.IN_PROGRESS
    })
    setStepperStatus(nextStatus)
  }
  const handlePreviousButttonclick = () => {
    let newStep = currentStep - 1
    changeStepperUi(newStep)
    setCurrentStep(newStep)
  }
  const handleNextButtonClick = () => {
    let newStep = currentStep + 1
    if (newStep === 2) {
      dispatch(addUserInputData(varData))
    }
    changeStepperUi(newStep)
    setCurrentStep(currentStep + 1)
  }

  const disableNextButton = (givenStepIndex = null) => {
    if (!givenStepIndex) givenStepIndex = currentStep
    switch (SMS_CREATION_STEPS_LIST[givenStepIndex]) {
      case SMS_CREATION_STEPS_LIST[0]:
        return false
      case SMS_CREATION_STEPS_LIST[1]:
        return !allVarsFilled
      case SMS_CREATION_STEPS_LIST[2]:
        return (
          selected_users.length > unusedQuota ||
          !(segments.length && selected_users.length)
        )
      default:
        return true
    }
  }
  const onTemplateSelect = (data) => {
    let newStep = currentStep + 1
    changeStepperUi(newStep)
    setVarData({})
    setCurrentStep(newStep)
    dispatch(setSmsBody(data.message))
    dispatch(setTemplateId(data.id))
    eventManager.send_event(events.COMMS_SMS_TEMPLATE_SELECTED_TFI, {
      template_id: data.id,
      post_type: 'sms',
    })
  }
  useEffect(() => {
    dispatch(setAnnouncementTypeAction(announcementType.SMS))
    dispatch(getSmsTemplates())
  }, [])
  return (
    <div>
      <ErrorBoundary>
        <SliderScreenHeader title={t('smsSliderHeader')} icon={smsIcon} />
      </ErrorBoundary>
      <div className={styles.container}>
        <div className={classNames({[styles.blurryBg]: isRechargeOpen})}>
          <ErrorBoundary>
            <Stepper
              classes={{
                wrapper: styles.stepperWrapper,
                title: styles.stepperTitle,
              }}
              steps={SMS_CREATION_STEPS_LIST}
            />
          </ErrorBoundary>
        </div>
        <div className={styles.contentArea}>
          <ErrorBoundary>
            <Credits />
            <StepperWrapper
              currentStep={currentStep}
              totalSteps={SMS_CREATION_STEPS_LIST.length}
            />
          </ErrorBoundary>
          <ErrorBoundary>
            <ContentContainer
              step={SMS_CREATION_STEPS_LIST[currentStep].title}
              onTemplateClick={onTemplateSelect}
              varData={varData}
              setVarData={setVarData}
            />
          </ErrorBoundary>
        </div>
      </div>
      {currentStep
        ? !isUserFilterVisible && (
            <ButtonPanel
              isNext={currentStep < SMS_CREATION_STEPS_LIST.length - 1}
              showPrevious={currentStep > 0}
              nextStep={handleNextButtonClick}
              handlePreviousButtonClick={handlePreviousButttonclick}
              postAnnouncement={() => createCommunication()}
              isDisable={disableNextButton()}
            />
          )
        : null}
    </div>
  )
}
