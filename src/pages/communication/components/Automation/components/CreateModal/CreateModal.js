import {
  Modal,
  Stepper,
  STEPPER_CONSTANTS,
  Icon,
  IconFrame,
  ICON_CONSTANTS,
  ICON_FRAME_CONSTANTS,
  MODAL_CONSTANTS,
} from '@teachmint/krayon'
import {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import ContentContainer from '../ContentContainer/ContentContainer'
import {addOrUpdateRule} from '../../../../redux/actions/schedulerActions'
import {
  RECIPIENT_TYPE,
  RULE_CREATION_STEPS,
  SCHEDULER_TEMPLATE_TYPES,
  TEMPLATE_ICONS,
} from '../../Automation.constants'
import {events} from '../../../../../../utils/EventsConstants'
import {
  getCreateSteps,
  hasValidReceivers,
  isValidFeeTriggerParams,
} from '../../utils'
import styles from './CreateModal.module.css'

export default function CreateModal({setModalOpen, template, preSelectedIds}) {
  const {t} = useTranslation()
  const dispatch = useDispatch()

  const [currentStep, setCurrentStep] = useState(0)
  const [stepperStatus, setStepperStatus] = useState([
    STEPPER_CONSTANTS.STATUS.IN_PROGRESS,
    STEPPER_CONSTANTS.STATUS.NOT_STARTED,
    STEPPER_CONSTANTS.STATUS.NOT_STARTED,
    STEPPER_CONSTANTS.STATUS.NOT_STARTED,
  ])
  const [userInputData, setUserInputData] = useState(
    JSON.parse(JSON.stringify(template))
  )
  const eventManager = useSelector((state) => state.eventManager)

  const RULE_CREATION_STEPS_LIST = Object.values(RULE_CREATION_STEPS).map(
    (item, i) => {
      return {...item, status: stepperStatus[i]}
    }
  )

  const isProceedFromWhenEnabled = () => {
    const template = userInputData.template_id || userInputData._id
    const trigger_params = userInputData.trigger_params || {}

    switch (template) {
      case SCHEDULER_TEMPLATE_TYPES.FEE_REMINDER:
        return isValidFeeTriggerParams(trigger_params)
      case SCHEDULER_TEMPLATE_TYPES.ATTENDANCE:
        return trigger_params.event_trigger?.length
      case SCHEDULER_TEMPLATE_TYPES.HOLIDAY: {
        const {days_before_holiday} = trigger_params
        return days_before_holiday || days_before_holiday === 0
      }
      case SCHEDULER_TEMPLATE_TYPES.BIRTHDAY:
        return true
      default:
        return false
    }
  }

  const isNextDisabled = (currStep) => {
    switch (currStep) {
      case 0:
        return !userInputData?.actions_list?.length
      case 1:
        return !isProceedFromWhenEnabled()
      case 2:
        return !hasValidReceivers(userInputData)
    }
  }

  const getModalActions = () => {
    const actions = [
      {
        body: t('previous'),
        type: 'outline',
        isDisabled: currentStep < 1,
        onClick: handlePreviousClick,
        classes: {button: styles.modalActionBtn},
      },
    ]

    if (currentStep === RULE_CREATION_STEPS_LIST.length - 1) {
      actions.push({
        body: t('schedule'),
        onClick: schedulePost,
        classes: {button: styles.modalActionBtn},
      })
    } else {
      actions.push({
        body:
          currentStep === RULE_CREATION_STEPS_LIST.length - 2
            ? t('preview')
            : t('next'),
        onClick: handleNextClick,
        isDisabled: isNextDisabled(currentStep),
        classes: {button: styles.modalActionBtn},
      })
    }

    return actions
  }
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
  const handlePreviousClick = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1
      changeStepperUi(newStep)
      setCurrentStep(newStep)
    }
  }
  const handleNextClick = () => {
    if (currentStep < RULE_CREATION_STEPS_LIST.length) {
      eventManager.send_event(
        events[RULE_CREATION_STEPS_LIST[currentStep].eventName],
        {
          data: {...userInputData},
        }
      )
      const newStep = currentStep + 1
      setCurrentStep(newStep)
      changeStepperUi(newStep)
    }
  }
  const schedulePost = () => {
    const payload = {...userInputData}

    if (!payload.template_id) {
      payload.template_id = payload._id
      delete payload._id
    }

    if (payload.template_id !== SCHEDULER_TEMPLATE_TYPES.BIRTHDAY) {
      if (!payload.filter) payload.filter = {}
      payload.filter.recipient_type = [RECIPIENT_TYPE.STUDENT]
    }

    dispatch(
      addOrUpdateRule({
        template_id: payload.template_id,
        trigger_params: {},
        ...payload,
      })
    )
    setModalOpen(false)
    eventManager.send_event(events.COMMS_RULES_CREATION_SCHEDULE_CLICKED_TFI)
  }

  const icon =
    TEMPLATE_ICONS[template.template_id || template._id] || 'notifications'

  return (
    <Modal
      size={MODAL_CONSTANTS.SIZE.LARGE}
      isOpen
      header={template.name}
      classes={{footer: styles.footer}}
      headerIcon={
        <IconFrame
          size={ICON_FRAME_CONSTANTS.SIZES.X_LARGE}
          className={styles.wishIconFrame}
        >
          <Icon
            name={icon}
            type={ICON_CONSTANTS.TYPES.BASIC}
            size={ICON_CONSTANTS.SIZES.XX_SMALL}
          />
        </IconFrame>
      }
      onClose={() => setModalOpen(false)}
      actionButtons={getModalActions()}
    >
      <div className={styles.contentContainer}>
        <div className={styles.stepperWrapper}>
          <Stepper steps={getCreateSteps(userInputData, stepperStatus)} />
        </div>
        <div className={styles.infoCollection}>
          <ContentContainer
            step={RULE_CREATION_STEPS_LIST[currentStep].id}
            inputData={userInputData}
            setInputData={setUserInputData}
            preSelectedIds={preSelectedIds}
          />
        </div>
      </div>
    </Modal>
  )
}
