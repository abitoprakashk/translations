import React, {useEffect} from 'react'
import styles from './InitialStage.module.css'
import {useSelector, useDispatch} from 'react-redux'
import {
  Dropdown,
  Button,
  BUTTON_CONSTANTS,
  Divider,
  Alert,
} from '@teachmint/krayon'
import {useTranslation} from 'react-i18next'
import {events} from '../../../../../../../utils/EventsConstants'
import feeStructureActionTypes from '../../../../../redux/feeStructure/feeStructureActionTypes'
import {useFeeStructure} from '../../../../../redux/feeStructure/feeStructureSelectors'
import Permission from '../../../../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../../../utils/permission.constants'

export default function InitialStage({
  instituteAcademicSessionInfo,
  selectedSession,
  setSelectedSession,
  setIsImportModalOpen,
  setIsImportModalCSVOpen,
}) {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const {failedSessionTrasnferTask} = useFeeStructure()
  const {instituteActiveAcademicSessionId, eventManager} = useSelector(
    (state) => state
  )
  const handleErrorAcknowledgement = (index) => {
    dispatch({
      type: feeStructureActionTypes.ACKNOWLEDGE_FAILED_TASK,
      payload: {
        _id: failedSessionTrasnferTask[index]._id,
        acknowledged: true,
      },
    })
  }
  useEffect(() => {
    dispatch({
      type: feeStructureActionTypes.FETCH_FAILED_SESSION_TRANSFER_TASK,
    })
  }, [])
  return (
    <>
      {failedSessionTrasnferTask.map((failedTask, i) => {
        const sessionName = instituteAcademicSessionInfo.find(
          (session) => session._id != failedTask?.payload?.prev_due_session_id
        ).name
        return (
          <Alert
            key={i}
            content={t('importPreviousDueError', {sessionName: sessionName})}
            icon="caution"
            type="error"
            className={styles.alertClass}
            otherProps={{
              onClick: () => handleErrorAcknowledgement(i),
            }}
          />
        )
      })}
      <div className={styles.subSection}>
        <span className={styles.heading}>{t('previousSessionDuesTitle')}</span>
        <div className={styles.previousSessionContainer}>
          <span>{t('importDuesInstruction')}</span>
          <div className={styles.previousSession}>
            <Dropdown
              placeholder={t('previousSessionDuesSelectSession')}
              options={instituteAcademicSessionInfo
                .filter(
                  (session) => session._id != instituteActiveAcademicSessionId
                )
                .map((session) => {
                  return {label: session.name, value: session._id}
                })}
              onChange={(e) =>
                setSelectedSession(
                  instituteAcademicSessionInfo.filter(
                    (s) => s._id == e.value
                  )[0]
                )
              }
              selectedOptions={selectedSession?._id}
              classes={{
                wrapperClass: styles.sessionDropdownWrapperClass,
                dropdownClass: styles.sessionDropdownClass,
              }}
            />
            <Permission
              permissionId={
                PERMISSION_CONSTANTS.feeModuleController_importPreviousSessionDue_create
              }
            >
              <Button
                size={BUTTON_CONSTANTS.SIZE.MEDIUM}
                onClick={() => {
                  eventManager.send_event(
                    events.FEE_PREVIOUS_SESSION_DUES_IMPORT_CLICKED_TFI
                  )
                  setIsImportModalOpen(true)
                }}
                type={BUTTON_CONSTANTS.TYPE.PRIMARY}
                suffixIcon="arrowRightAlt"
                isDisabled={selectedSession ? false : true}
              >
                {t('previousSessionDuesButton')}
              </Button>
            </Permission>
          </div>
        </div>
        <div className={styles.dividerContainer}>
          <Divider length="50%" spacing="10px" thickness="1px" />
          <span>{t('dividerOR')}</span>
          <Divider length="50%" spacing="10px" thickness="1px" />
        </div>
        <div className={styles.previousSessionContainer}>
          <span>{t('importDuesByCSVInstruction')}</span>
          <div className={styles.previousSession}>
            <Permission
              permissionId={
                PERMISSION_CONSTANTS.feeModuleController_feeStructure_create
              }
            >
              <Button
                size={BUTTON_CONSTANTS.SIZE.MEDIUM}
                onClick={() => {
                  eventManager.send_event(
                    events.FEE_PREVIOUS_SESSION_DUES_CSV_UPLOAD_CLICKED_TFI
                  )
                  setIsImportModalCSVOpen(true)
                }}
                type={BUTTON_CONSTANTS.TYPE.OUTLINE}
                suffixIcon="arrowRightAlt"
              >
                {t('previousSessionDuesCSVButton')}
              </Button>
            </Permission>
          </div>
        </div>
      </div>
    </>
  )
}
