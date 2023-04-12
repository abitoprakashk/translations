import {
  BUTTON_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  Modal,
  MODAL_CONSTANTS,
  Stepper,
} from '@teachmint/krayon'
import {t} from 'i18next'
import {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import Loader from '../Common/Loader/Loader'
import ClassStructure from './components/ClassStructure/ClassStructure'
import FeeStructure from './components/FeeStructure/FeeStructure'
import {
  STEP,
  TIME_IN_MILLISECONDS_TO_SHOW_SUCCESS_MODAL,
  TRANSFER_STEPS,
} from './constants'
import {
  constructHierarchy,
  getSessionIdDict,
  getSessionTransferSteps,
} from './utils'
import {
  showErrorOccuredAction,
  showErrorToast,
} from '../../redux/actions/commonAction'
import SuccessModal from './components/SuccessModal/SuccessModal'
import {
  getInstituteHierarchy,
  getNonCategorizedClasses,
  getSessionFeeStructures,
  transferSession,
} from './api/apiService'
import {BROWSER_STORAGE_KEYS} from '../../constants/institute.constants'
import {setAdminSpecificToLocalStorage} from '../../utils/Helpers'
import styles from './SessionTransfer.module.css'
import useSendEvent from '../../pages/AttendanceReport/hooks/useSendEvent'
import {events} from '../../utils/EventsConstants'

const SessionTransfer = ({sessionImportIds, onClose, onEditSession}) => {
  const dispatch = useDispatch()
  const instituteInfo = useSelector((state) => state.instituteInfo)
  const [activeStepId, setActiveStepId] = useState(STEP.CLASSROOM)
  const [loading, setLoading] = useState(false)
  const [instituteHierarchy, setInstituteHierarchy] = useState({})
  const [customClasses, setCustomClasses] = useState([])
  const [feeStructures, setFeeStructures] = useState([])
  const [enableSessionTransfer, setEnableSessionTransfer] = useState(false)
  const [transferSuccessStep, setTransferSuccessStep] = useState(null)

  const instituteAcademicSessionInfo = useSelector((state) =>
    getSessionIdDict(state.instituteAcademicSessionInfo)
  )

  const sendEvent = useSendEvent()
  const {source: sourceSessionId, target: targetSessionId} = sessionImportIds
  const sourceSession = instituteAcademicSessionInfo[sourceSessionId] || {}
  const targetSession = instituteAcademicSessionInfo[targetSessionId] || {}

  const toggleLoader = () => setLoading((show) => !show)

  useEffect(() => {
    fetchInstituteHierarchy(sourceSessionId).then((response) => {
      setInstituteHierarchy(constructHierarchy(response))
    })
    getNonCategorizedClasses(sourceSessionId).then((response) =>
      setCustomClasses(response.obj)
    )
    fetchFeeStructures()
  }, [instituteInfo._id, sourceSessionId, targetSessionId])

  const fetchInstituteHierarchy = async (sessionId) => {
    setLoading(true)
    try {
      const hierarchyRes = await getInstituteHierarchy(
        instituteInfo._id,
        sessionId
      )
      if (!hierarchyRes.status) {
        dispatch(showErrorToast(t('genericErrorMessage')))
      }
      return hierarchyRes.obj
    } catch (_err) {
      dispatch(showErrorOccuredAction(true))
    } finally {
      setLoading(false)
    }
  }

  const fetchFeeStructures = () => {
    setLoading(true)
    getSessionFeeStructures(sourceSession._id, targetSession._id)
      .then((response) => {
        if (response.status) {
          setFeeStructures(response.obj)
        } else {
          dispatch(showErrorToast(t('genericErrorMessage')))
        }
      })
      .catch((_err) => {
        dispatch(showErrorOccuredAction(true))
      })
      .finally(() => setLoading(false))
  }

  const onSessionTransfer = (shouldCloneFee) => {
    if (!feeStructures.length) {
      sendEvent(events.SESSION_TRANSFER_COMPLTED_TFI, {
        session_id: sourceSessionId,
        from_session_id: targetSessionId,
      })
    }
    toggleLoader()
    transferSession(sourceSessionId, targetSessionId, shouldCloneFee)
      .then((response) => {
        if (response.status) {
          setTransferSuccessStep(shouldCloneFee ? STEP.FEE : STEP.CLASSROOM)
          sendEvent(events.SESSION_TRANSFER_COMPLTED_TFI, {
            session_id: targetSessionId,
            from_session_id: sourceSessionId,
          })
          setTimeout(() => {
            setAdminSpecificToLocalStorage(
              BROWSER_STORAGE_KEYS.ACTIVE_ACADEMIC_SESSION_ID,
              response.obj.session_id
            )
            window.location.reload()
          }, TIME_IN_MILLISECONDS_TO_SHOW_SUCCESS_MODAL)
        } else {
          dispatch(showErrorToast(t('genericErrorMessage')))
          onClose()
        }
      })
      .catch((_err) => {
        dispatch(showErrorOccuredAction(true))
      })
      .finally(toggleLoader)
  }

  const actionButtons = {
    [STEP.CLASSROOM]: [
      {
        body: feeStructures.length ? t('saveAndExit') : t('saveConfigLabel'),
        onClick: () => onSessionTransfer(false),
        type: feeStructures.length
          ? BUTTON_CONSTANTS.TYPE.OUTLINE
          : BUTTON_CONSTANTS.TYPE.FILLED,
        classes: {button: styles.footerBtn},
      },
    ],
    [STEP.FEE]: [
      {
        body: t('saveConfigLabel'),
        classes: {button: styles.footerBtn},
        onClick: () => onSessionTransfer(true),
        isDisabled: !enableSessionTransfer,
      },
    ],
  }

  if (feeStructures.length) {
    actionButtons[STEP.CLASSROOM].push({
      body: t('next'),
      classes: {button: styles.footerBtn},
      onClick: () => {
        setActiveStepId(STEP.FEE)
        sendEvent(events.SESSION_IMPORT_NEXT_CLICKED_TFI, {
          session_id: targetSessionId,
          from_session_id: sourceSessionId,
        })
      },
    })
  }

  const getModalContent = () => {
    switch (activeStepId) {
      case STEP.CLASSROOM:
        return (
          <ClassStructure
            instituteHierarchy={instituteHierarchy}
            customClasses={customClasses}
          />
        )
      case STEP.FEE:
        return (
          <FeeStructure
            feeStructures={feeStructures}
            sourceSession={sourceSession}
            targetSession={targetSession}
            toggleLoader={toggleLoader}
            instituteHierarchy={instituteHierarchy}
            setEnableSessionTransfer={setEnableSessionTransfer}
            onEditSession={onEditSession}
          />
        )
      default:
        return null
    }
  }

  if (transferSuccessStep) {
    return (
      <SuccessModal
        targetSessionName={targetSession.name}
        isFeeStructureImported={transferSuccessStep === STEP.FEE}
      />
    )
  }

  return (
    <Modal
      size={MODAL_CONSTANTS.SIZE.LARGE}
      onClose={onClose}
      isOpen
      header={t('sessionTransferHeader')}
      classes={{
        footer: styles.footer,
        content: styles.modalContent,
        modal: styles.modal,
      }}
      actionButtons={actionButtons[activeStepId]}
      footerLeftElement={
        <div className={styles.footerInfo}>
          <Icon
            name="info"
            size={ICON_CONSTANTS.SIZES.XX_SMALL}
            type={ICON_CONSTANTS.TYPES.INFO}
            version={ICON_CONSTANTS.VERSION.OUTLINED}
          />
          <span>
            {activeStepId === STEP.CLASSROOM
              ? t('configurationChangeAllowedLabel')
              : t('configurationFeeStructureInfo')}
          </span>
        </div>
      }
    >
      <div className={styles.contentContainer}>
        <div className={styles.stepperWrapper}>
          <Stepper
            steps={getTransferSteps(activeStepId, feeStructures)}
            classes={{wrapper: styles.stepper}}
            onClickOfStep={({id}) => setActiveStepId(id)}
          />
        </div>
        <div className={styles.configContainer}>
          <Loader show={loading} />
          {getModalContent()}
        </div>
      </div>
    </Modal>
  )
}

const getTransferSteps = (activeStepId, feeStructures) => {
  const allSteps = getStepDetails(TRANSFER_STEPS, feeStructures)
  return getSessionTransferSteps(allSteps, activeStepId)
}

const getStepDetails = (steps, feeStructures) =>
  steps.map((step) => {
    if (step.id === STEP.FEE && !feeStructures?.length) {
      return {
        ...step,
        description: (
          <span className={styles.disabledStepDesc}>
            {t('importFeeConfigStepperDesc')}
          </span>
        ),
        title: (
          <span className={styles.disabledStepTitle}>{t('feeStructure')}</span>
        ),
      }
    }

    return step
  })

export default SessionTransfer
