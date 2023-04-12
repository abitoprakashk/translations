import {useCallback, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import {Icon} from '@teachmint/common'
import classNames from 'classnames'
import styles from './Dashboard.module.css'
import DeleteRecieptsModalStyles from '../../../../../components/Common/DeleteRecieptsModal/DeleteRecieptsModal.module.css'
import {events} from '../../../../../utils/EventsConstants'
import feeStructureActionTypes from '../../../redux/feeStructure/feeStructureActionTypes'
import ConfirmationPopup from '../../../../../components/Common/ConfirmationPopup/ConfirmationPopup'
import {
  FEE_STRUCTURE_TYPES_IDS,
  getStructureFeeType,
} from '../../../fees.constants'
import ClassView from './Accordians/ClassView'
import StructureView from './Accordians/StructureView'
import PreviousSessionDues from './Accordians/PreviousSessionDues'
import AlertModal from '../../../../../components/Common/AlertModal/AlertModal'
import DeleteRecieptsModal from '../../../../../components/Common/DeleteRecieptsModal/DeleteRecieptsModal'
import {
  STEP_STATUS,
  STEPS_IDS,
  DEPENDANCY_CASES,
  DELETE_FEE_STRUCTURE_STEPS,
  DELETE_RECEIPT_CLICK_EVENT,
} from '../../../../user-profile/components/Student/studentConstants'
import Loader from '../../../../../components/Common/Loader/Loader'
import {
  deleteAllReceiptsConfirmationTransText,
  getDependancyStepsData,
  getStepsDataAfterDeleteReceipts,
  toastOnCloseClick,
} from '../../../helpers/helpers'

export default function StructuresList({showClassView, feeStructures}) {
  const {t} = useTranslation()
  const {eventManager, instituteHierarchy} = useSelector((state) => state)
  const departments = instituteHierarchy && instituteHierarchy.children
  const [showDeleteConfirmPopup, setShowDeleteConfirmPopup] = useState(false)
  const [isLoader, setIsLoader] = useState(false)
  const [structureToDelete, setStructureToDelete] = useState(null)
  const [alertModalProps, setAlertModalProps] = useState({
    isOpen: false,
    header: t('cannotDeleteStructure'),
    text: '',
  })
  const [deleteReceiptsModalProps, setDeleteReceiptsModalProps] = useState({
    isOpen: false,
    header: t('deleteReceiptsToDeleteStructure'),
    steps: {...DELETE_FEE_STRUCTURE_STEPS},
  })
  const dispatch = useDispatch()

  const getClassNames = (classes) => {
    const className = []
    let totalClasses = 0
    let totalSelectedClasses = 0
    departments.map((dept) => {
      if (dept.children.length > 0) {
        totalClasses += dept.children.length
        dept.children.map((cls) => {
          if (classes.includes(cls.id)) {
            totalSelectedClasses++
            className.push(cls.name)
          } else {
            cls.children.map((section) => {
              if (classes.includes(section.id)) {
                className.push(cls.name + '-' + section.name)
              }
            })
          }
        })
      }
    })

    return totalClasses === totalSelectedClasses
      ? t('all')
      : className.join(', ')
  }

  const handleEditClick = (structure) => {
    dispatch({
      type: feeStructureActionTypes.EDIT_FEE_STRUCTURE_REQUESTED,
      payload: structure._id,
    })
    eventManager.send_event(events.EDIT_FEE_STRUCTURE_CLICKED_TFI, {
      fee_type: getStructureFeeType(structure),
      fee_structure_id: structure._id,
    })
  }

  const handleDeleteClick = (structure) => {
    setShowDeleteConfirmPopup(true)
    setStructureToDelete(structure)
    eventManager.send_event(events.DELETE_FEE_STRUCTURE_CLICKED_TFI, {
      fee_type: getStructureFeeType(structure),
      fee_structure_id: structure._id,
      screen_name: DELETE_RECEIPT_CLICK_EVENT.SCREEN_NAME.FEE_CONFIG,
    })
    if (structure.fee_type === FEE_STRUCTURE_TYPES_IDS.TRANSPORT_FEE) {
      dispatch({type: feeStructureActionTypes.FETCH_FEE_SETTING_REQUEST})
    }
  }

  const toastOnCloseClickFn = (toastId) => {
    toastOnCloseClick(setDeleteReceiptsModalProps, toastId)
  }

  const handleAlertModalClose = () => {
    setAlertModalProps((prev) => {
      return {...prev, isOpen: false}
    })
  }

  const handleCloseDeleteRecieptsModal = () => {
    eventManager.send_event(events.DELETE_FEE_STRUCTURE_CANCEL_CLICKED_TFI, {
      tnx_id: deleteReceiptsModalProps?.transactions.map(
        (item) => item.transaction_id
      ),
      type: DELETE_RECEIPT_CLICK_EVENT.TYPE.DELETE,
      structure_id: structureToDelete?._id,
      screen_name: DELETE_RECEIPT_CLICK_EVENT.SCREEN_NAME.DELETE_POPUP,
    })
    setDeleteReceiptsModalProps((prev) => {
      return {
        ...prev,
        isOpen: false,
      }
    })
  }

  const handleCancleDeleteReceipts = () => {
    eventManager.send_event(events.DELETE_ALL_RECEIPTS_POPUP_CLICKED_TFI, {
      tnx_id: deleteReceiptsModalProps?.transactions.map(
        (item) => item.transaction_id
      ),
      type: DELETE_RECEIPT_CLICK_EVENT.TYPE.DELETE,
      structure_id: structureToDelete?._id,
    })
    setAlertModalProps((prev) => {
      return {...prev, isOpen: false}
    })
  }

  const handleDeleteAllReciepts = () => {
    eventManager.send_event(events.DELETE_ALL_RECEIPTS_CLICKED_TFI, {
      tnx_id: deleteReceiptsModalProps?.transactions.map(
        (item) => item.transaction_id
      ),
      type: DELETE_RECEIPT_CLICK_EVENT.TYPE.DELETE,
      structure_id: structureToDelete?._id,
    })
    let transactionCount =
      (deleteReceiptsModalProps?.transactions &&
        deleteReceiptsModalProps?.transactions.length) ||
      0
    let text = deleteAllReceiptsConfirmationTransText({
      transactionCount,
      structureName: structureToDelete?.name,
    })
    setAlertModalProps({
      ...alertModalProps,
      isOpen: true,
      header: t('deleteAllReceipts'),
      text,
      handleCloseModal: handleCancleDeleteReceipts,
      actionButtons: [
        {
          body: t('cancel'),
          onClick: handleCancleDeleteReceipts,
          type: 'outline',
        },
        {
          body: t('delete'),
          onClick: handleConfirmDeleteAllReciepts,
          category: 'destructive',
        },
      ],
    })
  }

  const onDeleteDependancy = ({transactions}) => {
    setIsLoader(false)
    let newSteps = getDependancyStepsData({
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

  const confirmDeleteStructure = (structure) => {
    function onDeleteFailed(params) {
      eventManager.send_event(events.CANNOT_DELETE_STRUCUTURE_CLICKED_TFI, {
        reason: params?.eventReason,
      })
      setIsLoader(false)
      setAlertModalProps({
        ...alertModalProps,
        isOpen: true,
        heading: t('cannotDeleteStructure'),
        actionButtons: [
          {
            body: t('gotIt'),
            onClick: handleAlertModalClose,
          },
        ],
        ...params,
      })
    }
    function onDeleteSuccess() {
      eventManager.send_event(events.FEE_STRUCTURE_DELETED_TFI, {
        fee_type: getStructureFeeType(structure),
        fee_structure: structure,
        screen_name: DELETE_RECEIPT_CLICK_EVENT.SCREEN_NAME.DELETE_POPUP,
      })
    }
    setIsLoader(true)
    dispatch({
      type: feeStructureActionTypes.DELETE_FEE_STRUCTURE_REQUESTED,
      payload: {
        _id: structure._id,
        onDeleteSuccess,
        onDeleteFailed,
        onDeleteDependancy,
      },
    })
    setShowDeleteConfirmPopup(false)
  }

  const handleConfirmDeleteAllReciepts = () => {
    eventManager.send_event(events.DELETE_ALL_RECEIPTS_POPUP_CLICKED_TFI, {
      tnx_id: deleteReceiptsModalProps?.transactions.map(
        (item) => item.transaction_id
      ),
      type: DELETE_RECEIPT_CLICK_EVENT.TYPE.DELETE,
      structure_id: structureToDelete?._id,
      action: DELETE_RECEIPT_CLICK_EVENT.ACTION.DELETE,
    })

    setAlertModalProps({...alertModalProps, isOpen: false})
    setDeleteReceiptsModalProps((prev) => {
      return {
        ...prev,
        buttonLoader: true,
      }
    })

    let data = {is_cancelled: false, receipts: {}, pending_transactions: []}
    deleteReceiptsModalProps?.transactions.forEach((item) => {
      if (item?.receipt_no) {
        if (data.receipts[item.academic_session_id]) {
          data.receipts[item.academic_session_id].push(item?.receipt_no)
        } else {
          data.receipts[item.academic_session_id] = [item?.receipt_no]
        }
      }
    })

    data.pending_transactions = deleteReceiptsModalProps?.transactions
      .filter((item) => !item.receipt_no)
      .map((item) => item.transaction_id)

    const onSuccess = () => {
      eventManager.send_event(events.ALL_RECEIPTS_DELETED_TFI, {
        tnx_id: deleteReceiptsModalProps?.transactions.map(
          (item) => item.transaction_id
        ),
        type: DELETE_RECEIPT_CLICK_EVENT.TYPE.DELETE,
        structure_id: structureToDelete?._id,
      })
      let newData = getStepsDataAfterDeleteReceipts({
        DependancyCase: DEPENDANCY_CASES.DELETE,
        ...deleteReceiptsModalProps,
      })

      setDeleteReceiptsModalProps((prev) => {
        return {...prev, ...newData}
      })
    }

    const onFailed = (errorMsg) => {
      let newData = {
        buttonLoader: false,
        toasts: [
          {
            id: deleteReceiptsModalProps?.toasts
              ? +deleteReceiptsModalProps.toasts.length + 1
              : 1,
            content: errorMsg || t('genericErrorMessage'),
            type: 'error',
          },
        ],
      }
      setDeleteReceiptsModalProps((prev) => {
        return {...prev, ...newData}
      })
    }

    dispatch({
      type: feeStructureActionTypes.REVOKE_FEE_RECEIPTS_TRANSACTIONS_REQUEST,
      payload: {data, onSuccess, onFailed},
    })
  }

  const deleteReceiptModalButtons = useCallback(() => {
    let actionBtn = {}
    Object.keys(deleteReceiptsModalProps?.steps).forEach((key) => {
      let ele = deleteReceiptsModalProps?.steps[key]
      if (key === STEPS_IDS.STEP_1 && ele.status === STEP_STATUS.IN_PROGRESS) {
        actionBtn = {
          text: t('deleteAllReceipts'),
          onClick: handleDeleteAllReciepts,
        }
      } else if (
        key === STEPS_IDS.STEP_2 &&
        ele.status === STEP_STATUS.IN_PROGRESS
      ) {
        actionBtn = {
          text: t('deleteFeeStructure'),
          onClick: () => confirmDeleteStructure(structureToDelete),
        }
      }
    })

    return [
      {
        body: t('cancel'),
        onClick: handleCloseDeleteRecieptsModal,
        type: 'outline',
        isDisabled: deleteReceiptsModalProps?.buttonLoader,
      },
      {
        body: (
          <div className={DeleteRecieptsModalStyles.buttonLoadingSection}>
            {deleteReceiptsModalProps?.buttonLoader && (
              <div
                className={classNames(
                  'loading',
                  DeleteRecieptsModalStyles.buttonLoading
                )}
              ></div>
            )}
            {actionBtn.text}
          </div>
        ),
        onClick: actionBtn.onClick,
        type: 'destructive',
        isDisabled: deleteReceiptsModalProps?.buttonLoader,
      },
    ]
  }, [
    structureToDelete,
    Object.keys(deleteReceiptsModalProps).map(
      (item) => deleteReceiptsModalProps[item]
    ),
  ])

  return (
    <>
      {alertModalProps?.isOpen && (
        <div className={styles.alertModalSection}>
          <AlertModal
            {...alertModalProps}
            handleCloseModal={handleAlertModalClose}
            actionButtons={alertModalProps?.actionButtons || []}
          />
        </div>
      )}

      {isLoader && <Loader show={true} />}

      {deleteReceiptsModalProps?.isOpen && (
        <DeleteRecieptsModal
          {...deleteReceiptsModalProps}
          classes={{stepper: {description: styles.stepperDesc}}}
          handleCloseModal={handleCloseDeleteRecieptsModal}
          handleDeleteAllReciepts={handleDeleteAllReciepts}
          actionButtons={deleteReceiptModalButtons()}
          toastOnCloseClick={toastOnCloseClickFn}
          eventManager={eventManager}
          strutureInfo={{
            ...structureToDelete,
            clickEventType: DELETE_RECEIPT_CLICK_EVENT.TYPE.DELETE,
          }}
        />
      )}

      <div className={styles.accordian}>
        {showDeleteConfirmPopup && (
          <ConfirmationPopup
            onClose={() => {
              setStructureToDelete(null)
              setShowDeleteConfirmPopup(false)
            }}
            onAction={() => confirmDeleteStructure(structureToDelete)}
            icon={
              <Icon
                name="removeCircle"
                color="error"
                className={classNames(
                  styles.higherSpecificityFont,
                  styles.higherSpecificitySize,
                  styles.removeIcon
                )}
              />
            }
            secondaryBtnStyle={classNames(
              styles.higherSpecificityFont,
              styles.higherSpecificityColor,
              styles.modalDeleteBtn
            )}
            title={t('deleteConfirmModalTitle')}
            desc={t(
              'deletingFeeStructureWillResultInRemovalAndWillNotBeVisibleToStudents'
            )}
            primaryBtnText={t('cancel')}
            secondaryBtnText={t('delete')}
          />
        )}
        {showClassView
          ? feeStructures.classView.map((classStructure) => (
              <ClassView
                key={classStructure.class_id}
                allStructures={feeStructures.structureView}
                classStructure={classStructure}
              />
            ))
          : Object.keys(feeStructures.structureView).map((structure) => {
              return feeStructures.structureView[structure].fee_type !==
                'CUSTOM' ? (
                <StructureView
                  key={structure}
                  isClassView={showClassView}
                  structure={feeStructures.structureView[structure]}
                  getClassNames={getClassNames}
                  handleEditClick={handleEditClick}
                  handleDeleteClick={handleDeleteClick}
                />
              ) : (
                <PreviousSessionDues
                  key={structure}
                  structure={feeStructures.structureView[structure]}
                />
              )
            })}
      </div>
    </>
  )
}
