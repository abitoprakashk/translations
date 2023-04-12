import React, {useState, useEffect} from 'react'
import styles from './PreviousSessionDues.module.css'
import {useSelector, useDispatch} from 'react-redux'
import {useTranslation} from 'react-i18next'
import ImportPreviousSessionDuesModal from './components/ImportPreviouseSessionDuesModal/ImportPreviousSessionDuesModal'
import ImportPreviousSessionDuesModalCSV from './components/ImportPreviouseSessionDuesModal/ImportPreviousSessionDuesModalCSV'
import StudentsList from './components/StudentsList/StudentsList'
import ImportInProgress from './components/ImportInProgress/ImportInProgress'
import InitialStage from './components/InitialStage/InitialStage'
import {fetchFeeCategoriesRequestedAction} from '../../../redux/feeStructure/feeStructureActions'
import feeStructureActionTypes from '../../../redux/feeStructure/feeStructureActionTypes'
import {
  checkPreviousSessionDuesTransferStatus,
  getDependancyStepsDataForPreviousSessionDues,
} from '../../../helpers/helpers'
import {useFeeStructure} from '../../../redux/feeStructure/feeStructureSelectors'
import {DELETE_PREVIOUS_SESSION_DUES_STEPS} from '../../../../user-profile/components/Student/studentConstants'
import DeleteReceiptsModal from './components/DeleteReceiptsModal/DeleteReceiptsModal'
import {events} from '../../../../../utils/EventsConstants'

export default function PreviousSessionDues() {
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const eventManager = useSelector((state) => state.eventManager)
  const instituteAcademicSessionInfo = useSelector(
    (state) => state.instituteAcademicSessionInfo
  )
  const [selectedSession, setSelectedSession] = useState(null)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [isImportModalCSVOpen, setIsImportModalCSVOpen] = useState(false)
  const [inProgress, setInProgress] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [previousSessionDue, setPreviousSessionDue] = useState({})
  const [CSVModalType, setCSVModalType] = useState('import')
  const {previousSessionDues} = useFeeStructure()
  const [isLoading, setIsLoading] = useState(false)
  const [deleteReceiptsModalProps, setDeleteReceiptsModalProps] = useState({
    isOpen: false,
    header: t('deleteReceiptsToDeletePreviousSessionDue'),
    steps: {...DELETE_PREVIOUS_SESSION_DUES_STEPS},
  })
  const [alertModalProps, setAlertModalProps] = useState({
    isOpen: false,
    header: t('cannotDeletePreviousDue'),
    text: '',
  })

  useEffect(() => {
    setPreviousSessionDue(previousSessionDues)
    if (JSON.stringify(previousSessionDues) === '{}') {
      setIsCompleted(false)
    } else {
      setIsCompleted(true)
      setInProgress(false)
    }
  }, [previousSessionDue, previousSessionDues])

  // Check for background task status
  useEffect(() => {
    setIsLoading(true)
    checkPreviousSessionDuesTransferStatus().then((res) => {
      setInProgress(res?.data?.obj?.is_running)
      if (!res?.data?.obj?.is_running) {
        dispatch(fetchFeeCategoriesRequestedAction())
        dispatch({type: feeStructureActionTypes.FETCH_PREVIOUS_SESSION_DUES})
      }
      setIsLoading(false)
    })
  }, [])

  const handleAlertModalClose = () => {
    setAlertModalProps((prev) => {
      return {...prev, isOpen: false}
    })
  }

  const onDeleteDependancy = ({transactions}) => {
    let newSteps = getDependancyStepsDataForPreviousSessionDues({
      transactions,
      steps: deleteReceiptsModalProps?.steps,
    })
    setDeleteReceiptsModalProps((prev) => {
      return {
        ...prev,
        transactions,
        isOpen: true,
        steps: newSteps,
      }
    })
  }

  const onDeleteSuccess = () => {
    eventManager.send_event(
      events.FEE_PREVIOUS_SESSION_DUES_FOR_ALL_STUDENTS_DELETED_TFI
    )
    setDeleteReceiptsModalProps((prev) => {
      return {
        ...prev,
        isOpen: false,
      }
    })
    dispatch({type: feeStructureActionTypes.FETCH_PREVIOUS_SESSION_DUES})
    setSelectedSession(null)
    setCSVModalType('import')
  }

  const onDeleteFailed = (params) => {
    setAlertModalProps({
      ...alertModalProps,
      isOpen: true,
      actionButtons: [
        {
          body: t('gotIt'),
          onClick: handleAlertModalClose,
        },
      ],
      ...params,
    })
  }

  const checkForReceiptPrefix = (
    formFields,
    setFormFields,
    setIsReceiptNoDisabled
  ) => {
    if (formFields.receipt_prefix.length > 0)
      dispatch({
        type: feeStructureActionTypes.RECEIPT_PREFIX_EXISTS_REQUESTED,
        payload: {
          prefix: formFields.receipt_prefix,
          formValues: formFields,
          setFormValues: setFormFields,
          setIsReceiptNoDisabled: setIsReceiptNoDisabled,
        },
      })
  }

  if (isLoading) {
    return <div className="loader"></div>
  } else {
    return (
      <>
        <section>
          <div className={styles.mainSection}>
            {!inProgress && !isCompleted && (
              <InitialStage
                instituteAcademicSessionInfo={instituteAcademicSessionInfo}
                selectedSession={selectedSession}
                setSelectedSession={setSelectedSession}
                setIsImportModalOpen={setIsImportModalOpen}
                setIsImportModalCSVOpen={setIsImportModalCSVOpen}
              />
            )}
            {inProgress && <ImportInProgress />}
            {isCompleted && (
              <StudentsList
                previousSessionDue={previousSessionDue}
                setIsImportModalCSVOpen={setIsImportModalCSVOpen}
                setCSVModalType={setCSVModalType}
                onDeleteDependancy={onDeleteDependancy}
                onDeleteSuccess={onDeleteSuccess}
                onDeleteFailed={onDeleteFailed}
              />
            )}
          </div>
        </section>
        {isImportModalOpen && (
          <ImportPreviousSessionDuesModal
            session={selectedSession}
            setIsImportModalOpen={setIsImportModalOpen}
            setInProgress={setInProgress}
            checkForReceiptPrefix={checkForReceiptPrefix}
          />
        )}
        {isImportModalCSVOpen && (
          <ImportPreviousSessionDuesModalCSV
            setIsImportModalCSVOpen={setIsImportModalCSVOpen}
            setInProgress={setInProgress}
            structure={previousSessionDue}
            modalType={CSVModalType}
            checkForReceiptPrefix={checkForReceiptPrefix}
          />
        )}
        <DeleteReceiptsModal
          structure={previousSessionDue}
          onDeleteDependancy={onDeleteDependancy}
          onDeleteSuccess={onDeleteSuccess}
          deleteReceiptsModalProps={deleteReceiptsModalProps}
          setDeleteReceiptsModalProps={setDeleteReceiptsModalProps}
          alertModalProps={alertModalProps}
          setAlertModalProps={setAlertModalProps}
        />
      </>
    )
  }
}
