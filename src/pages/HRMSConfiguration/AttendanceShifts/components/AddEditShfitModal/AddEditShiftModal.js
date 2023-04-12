import {useEffect, useMemo, useRef, useState} from 'react'
import {useHistory} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import produce from 'immer'
import {t} from 'i18next'
import styles from './AddEditShiftModal.module.css'
import isEqual from 'lodash/isEqual'
import {
  Modal,
  MODAL_CONSTANTS,
  Stepper,
  STEPPER_CONSTANTS,
  Button,
  BUTTON_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  Divider,
  Para,
  PARA_CONSTANTS,
  Heading,
  HEADING_CONSTANTS,
  Popup,
} from '@teachmint/krayon'
import SetupShift from '../SetupShift/SetupShift'
import SelectStaff from '../SelectStaff/SelectStaff'
import AttendanceMethod from '../AttendanceMethod/AttendanceMethod'
import {showSuccessToast} from '../../../../../redux/actions/commonAction'
import {
  validateSetupShiftStep,
  validateSelectStaffStep,
  validateAttendanceMethodStep,
} from '../../utils/validation'
import {sidebarData} from '../../../../../utils/SidebarItems'
import globalActions from '../../../../../redux/actions/global.actions'
import {
  ATTENDANCE_METHOD,
  DEFAULT_CONFIGURATION_STEPS,
  SHIFT_CONFIGURATION_STEPS,
} from '../../constants/shift.constants'
import {events} from '../../../../../utils/EventsConstants'
import QRCodeModal from '../QRCodeModal/QRCodeModal'

export default function AddEditShiftModal({
  showModal,
  setShowModal,
  header,
  shift,
  isEdit,
}) {
  const dispatch = useDispatch()
  const biometricMachineList = useSelector(
    (state) => state.globalData.fetchBiometricMachinesList?.data
  )
  const eventManager = useSelector((state) => state.eventManager)
  const history = useHistory()
  const [steps, setSteps] = useState(DEFAULT_CONFIGURATION_STEPS)
  const [currentStepId, setCurrentStepId] = useState(
    SHIFT_CONFIGURATION_STEPS.SETUP_SHIFT
  )
  const initialState = useRef(shift)
  const [shiftInfo, setShiftInfo] = useState(shift)
  const [showExitModal, setShowExitModal] = useState(false)
  const [saveOrNextStatus, setSaveOrNextStatus] = useState({})
  const [showQRCodeModal, setShowQRCodeModal] = useState(false)

  const hasShiftSettingsChanged = useMemo(() => {
    return !isEqual(initialState.current, shiftInfo)
  }, [shiftInfo])

  useEffect(() => {
    const button = getSaveOrNextButtonStatus(shiftInfo)
    setSaveOrNextStatus(button)
  }, [shiftInfo, currentStepId])

  useEffect(() => {
    initialState.current = shift //create a copy of shift
    setShiftInfo({
      ...shift,
    })
    updateStepperInfo(shift)
  }, [shift])

  const setStepState = (stepId, steps, status) => {
    const newSteps = produce(steps, (draftState) => {
      if (draftState[stepId]) {
        draftState[stepId].status = status
      }
    })
    return newSteps
  }

  function updateStepperInfo(shiftInfo) {
    let updatedSteps = {...steps}
    if (validateSetupShiftStep(shiftInfo)) {
      updatedSteps = setStepState(
        SHIFT_CONFIGURATION_STEPS.SETUP_SHIFT,
        updatedSteps,
        STEPPER_CONSTANTS.STATUS.COMPLETED
      )
      if (validateSelectStaffStep(shiftInfo)) {
        updatedSteps = setStepState(
          SHIFT_CONFIGURATION_STEPS.SELECT_STAFF,
          updatedSteps,
          STEPPER_CONSTANTS.STATUS.COMPLETED
        )
        if (validateAttendanceMethodStep(shiftInfo)) {
          updatedSteps = setStepState(
            SHIFT_CONFIGURATION_STEPS.ATTENDANCE_METHOD,
            updatedSteps,
            STEPPER_CONSTANTS.STATUS.COMPLETED
          )
        }
      }
    }
    setSteps(updatedSteps)
  }

  const handleStepperClick = ({status, id}) => {
    if (
      [
        STEPPER_CONSTANTS.STATUS.COMPLETED,
        STEPPER_CONSTANTS.STATUS.IN_PROGRESS,
      ].includes(status)
    ) {
      setCurrentStepId(id)
    }
  }

  function getSaveOrNextButtonStatus(shiftInfo) {
    switch (currentStepId) {
      case SHIFT_CONFIGURATION_STEPS.SETUP_SHIFT: {
        return {
          body: t('shiftModalNextBtn'),
          isDisabled: !validateSetupShiftStep(shiftInfo),
        }
      }
      case SHIFT_CONFIGURATION_STEPS.SELECT_STAFF: {
        return {
          body: t('shiftModalNextBtn'),
          isDisabled: !validateSelectStaffStep(shiftInfo),
        }
      }
      case SHIFT_CONFIGURATION_STEPS.ATTENDANCE_METHOD: {
        return {
          body: t('shiftModalSaveBtn'),
          isDisabled:
            !validateSetupShiftStep(shiftInfo) ||
            !validateSelectStaffStep(shiftInfo) ||
            !validateAttendanceMethodStep(shiftInfo),
        }
      }
      default:
        return {}
    }
  }

  const sendStepEvent = () => {
    let eventID = '',
      payload = {}
    switch (currentStepId) {
      case SHIFT_CONFIGURATION_STEPS.SETUP_SHIFT: {
        eventID = events.SETUP_SHIFT_NEXT_CLICKED_TFI
        payload = {
          grace_time: shiftInfo?.setting?.is_grace_allowed,
          attendance_log_option: shiftInfo?.setting?.attendance_taken_at,
        }
        break
      }
      case SHIFT_CONFIGURATION_STEPS.SELECT_STAFF: {
        eventID = events.SELECT_STAFF_NEXT_CLICKED_TFI
        payload = {
          staff_ids: shiftInfo?.staffs,
        }
        break
      }
      case SHIFT_CONFIGURATION_STEPS.ATTENDANCE_METHOD: {
        eventID = events.ATTENDANCE_METHOD_SAVE_CLICKED_TFI
        payload = {
          method: shiftInfo?.setting?.attendance_method,
        }
        break
      }
    }
    eventManager.send_event(eventID, payload)
  }

  const onClickSaveOrNextButton = () => {
    sendStepEvent()
    if (currentStepId === SHIFT_CONFIGURATION_STEPS.ATTENDANCE_METHOD) {
      updateShift()
    } else {
      goToNextStep()
    }
  }

  const onClickPrevButton = () => {
    const currStepIndex = Object.values(steps).findIndex(
      (s) => s.id === currentStepId
    )
    if (currStepIndex > 0) {
      let prevStep = Object.values(steps)[currStepIndex - 1]
      setCurrentStepId(prevStep.id)
    }
  }

  const updateShift = () => {
    dispatch(
      globalActions?.updateShift?.request({shift: shiftInfo}, () => {
        switch (shiftInfo?.setting?.attendance_method) {
          case ATTENDANCE_METHOD.BIOMETRIC: {
            if (biometricMachineList.length === 0) {
              //redirect to biometric config page
              dispatch(
                showSuccessToast(t('biometricShiftConfiguredSuccessfully'))
              )
              history.push(sidebarData.HRMS_CONFIGURATION.subRoutes[1])
            } else {
              dispatch(
                showSuccessToast(
                  isEdit
                    ? t('shiftUpdatedSuccessfully')
                    : t('shiftCreatedSuccessfully')
                )
              )
              setShowModal(false)
            }
            break
          }
          case ATTENDANCE_METHOD.GEOFENCE: {
            dispatch(
              showSuccessToast(
                isEdit
                  ? t('shiftUpdatedSuccessfully')
                  : t('shiftCreatedSuccessfully')
              )
            )
            if (isEdit) {
              setShowModal(false)
            } else {
              setShowQRCodeModal(true)
            }
            break
          }
        }
      })
    )
  }

  const goToNextStep = () => {
    const currStepIndex = Object.values(steps).findIndex(
      (s) => s.id === currentStepId
    )
    if (currStepIndex < Object.values(steps).length - 1) {
      let nextStep = Object.values(steps)[currStepIndex + 1]
      setCurrentStepId(nextStep.id)
      const updatedSteps = produce(steps, (draftState) => {
        draftState[currentStepId].status = STEPPER_CONSTANTS.STATUS.COMPLETED
        draftState[nextStep.id].status =
          nextStep.status === STEPPER_CONSTANTS.STATUS.COMPLETED
            ? STEPPER_CONSTANTS.STATUS.COMPLETED
            : STEPPER_CONSTANTS.STATUS.IN_PROGRESS
      })
      setSteps(updatedSteps)
    }
  }

  const getCurrentStep = () => {
    switch (currentStepId) {
      case SHIFT_CONFIGURATION_STEPS.SETUP_SHIFT: {
        return <SetupShift shiftInfo={shiftInfo} setShiftInfo={setShiftInfo} />
      }
      case SHIFT_CONFIGURATION_STEPS.SELECT_STAFF: {
        return (
          <>
            <div className={styles.headingWrapper}>
              <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.SMALL}>
                {t('selectStaff')}
              </Heading>
              <Divider spacing={12} />
            </div>
            <SelectStaff
              shiftInfo={shiftInfo}
              setShiftInfo={setShiftInfo}
              isEdit={isEdit}
            />
          </>
        )
      }
      case SHIFT_CONFIGURATION_STEPS.ATTENDANCE_METHOD: {
        return (
          <AttendanceMethod shiftInfo={shiftInfo} setShiftInfo={setShiftInfo} />
        )
      }
      default:
        return null
    }
  }

  const onCloseModal = () => {
    if (hasShiftSettingsChanged) {
      setShowExitModal(true)
    } else {
      setShowModal(false)
    }
  }

  return (
    <Modal
      size={MODAL_CONSTANTS.SIZE.AUTO}
      header={header}
      showCloseIcon
      onClose={onCloseModal}
      isOpen={showModal}
      shouldCloseOnOverlayClick={false}
      classes={{
        modal: styles.shiftModalWrapper,
      }}
      actionButtons={[
        {
          onClick: onClickSaveOrNextButton,
          type: BUTTON_CONSTANTS.TYPE.FILLED,
          ...saveOrNextStatus,
        },
      ]}
      footerLeftElement={
        currentStepId !== SHIFT_CONFIGURATION_STEPS.SETUP_SHIFT ? (
          <Button
            type={BUTTON_CONSTANTS.TYPE.TEXT}
            prefixIcon="backArrow"
            onClick={onClickPrevButton}
          >
            {t('shiftModalBackBtn')}
          </Button>
        ) : null
      }
    >
      <div className={styles.shiftContent}>
        <div className={styles.stepperContainer}>
          <Stepper
            isVertical
            steps={Object.values(steps)}
            classes={{
              wrapper: styles.stepperWrapper,
            }}
            onClickOfStep={handleStepperClick}
          />
        </div>
        <Divider isVertical spacing={10} />
        <div className={styles.stepContentWrapper}>{getCurrentStep()}</div>
      </div>

      {/* Exit Modal */}
      <Popup
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        actionButtons={[
          {
            id: 'cancel',
            onClick: () => {
              setShowExitModal(false)
              eventManager.send_event(
                events.SETUP_ATTENDANCE_CONFIG_EXIT_POPUP_CLICKED_TFI,
                {action: 'cancel'}
              )
            },
            body: t('cancel'),
            type: BUTTON_CONSTANTS.TYPE.OUTLINE,
            category: BUTTON_CONSTANTS.CATEGORY.PRIMARY,
          },
          {
            id: 'exit',
            onClick: () => {
              setShowModal(false)
              eventManager.send_event(
                events.SETUP_ATTENDANCE_CONFIG_EXIT_POPUP_CLICKED_TFI,
                {action: 'exit'}
              )
            },
            body: t('exit'),
            type: BUTTON_CONSTANTS.TYPE.FILLED,
            category: BUTTON_CONSTANTS.CATEGORY.DESTRUCTIVE,
          },
        ]}
        header={t('exitSetup')}
        headerIcon={
          <Icon
            name="exitToApp"
            size={ICON_CONSTANTS.SIZES.X_SMALL}
            type={ICON_CONSTANTS.TYPES.BASIC}
          />
        }
        classes={{
          content: styles.exitModalWrapper,
        }}
        showCloseIcon
      >
        <Para
          textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}
          type={PARA_CONSTANTS.TYPE.TEXT_SECONDARY}
        >
          {t('exitSetupWarning')}
        </Para>
      </Popup>

      {/* QR Code Modal */}
      {showQRCodeModal && (
        <QRCodeModal
          isOpen={showQRCodeModal}
          onClose={() => {
            setShowQRCodeModal(false)
            setShowModal(false)
          }}
        />
      )}
    </Modal>
  )
}
