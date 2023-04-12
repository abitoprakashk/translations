import React, {useCallback} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import DeleteRecieptsModal from '../../../../../../../components/Common/DeleteRecieptsModal/DeleteRecieptsModal'
import DeleteRecieptsModalStyles from '../../../../../../../components/Common/DeleteRecieptsModal/DeleteRecieptsModal.module.css'
import AlertModal from '../../../../../../../components/Common/AlertModal/AlertModal'
import feeStructureActionTypes from '../../../../../redux/feeStructure/feeStructureActionTypes'
import {
  deleteAllReceiptsConfirmationTransText,
  getStepsDataAfterDeleteReceipts,
} from '../../../../../helpers/helpers'
import {
  STEPS_IDS,
  STEP_STATUS,
  DEPENDANCY_CASES,
} from '../../../../../../user-profile/components/Student/studentConstants'
import {events} from '../../../../../../../utils/EventsConstants'
import {DELETE_RECEIPT_CLICK_EVENT} from '../../../../../../user-profile/components/Student/studentConstants'

export default function DeleteReceiptsModal({
  structure,
  onDeleteDependancy,
  onDeleteSuccess,
  deleteReceiptsModalProps,
  setDeleteReceiptsModalProps,
  alertModalProps,
  setAlertModalProps,
}) {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const {eventManager} = useSelector((state) => state)

  const closeDeleteReceiptsModal = () => {
    setDeleteReceiptsModalProps((prev) => {
      return {
        ...prev,
        isOpen: false,
      }
    })
  }

  const closeDeleteReceiptsPopup = () => {
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
      structure_id: structure?._id,
    })
    let transactionCount =
      (deleteReceiptsModalProps?.transactions &&
        deleteReceiptsModalProps?.transactions.length) ||
      0
    let text = deleteAllReceiptsConfirmationTransText({
      transactionCount,
      structureName: structure?.name,
    })
    setAlertModalProps({
      ...alertModalProps,
      isOpen: true,
      header: t('deleteAllReceipts'),
      text,
      handleCloseModal: () => closeDeleteReceiptsPopup(),
      actionButtons: [
        {
          body: t('cancel'),
          onClick: () => closeDeleteReceiptsPopup(),
          type: 'outline',
        },
        {
          body: t('delete'),
          onClick: () => handleConfirmDeleteAllReciepts(),
          category: 'destructive',
        },
      ],
    })
  }

  const handleConfirmDeleteAllReciepts = () => {
    eventManager.send_event(events.DELETE_ALL_RECEIPTS_POPUP_CLICKED_TFI, {
      tnx_id: deleteReceiptsModalProps?.transactions.map(
        (item) => item.transaction_id
      ),
      type: DELETE_RECEIPT_CLICK_EVENT.TYPE.DELETE,
      structure_id: structure?._id,
      action: DELETE_RECEIPT_CLICK_EVENT.ACTION.DELETE,
    })
    setAlertModalProps({...alertModalProps, isOpen: false})

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
        structure_id: structure?._id,
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

  const confirmDeleteStructure = (structure) => {
    function onDeleteFailed(params) {
      eventManager.send_event(events.CANNOT_DELETE_STRUCUTURE_CLICKED_TFI, {
        reason: params?.eventReason,
      })
      setAlertModalProps({
        ...alertModalProps,
        isOpen: true,
        heading: t('cannotDeleteStructure'),
        actionButtons: [
          {
            body: t('gotIt'),
            onClick: () => {},
          },
        ],
        ...params,
      })
    }
    dispatch({
      type: feeStructureActionTypes.DELETE_FEE_STRUCTURE_REQUESTED,
      payload: {
        _id: structure._id,
        onDeleteSuccess,
        onDeleteFailed,
        onDeleteDependancy,
      },
    })
  }

  const deleteReceiptModalButtons = useCallback(() => {
    let actionBtn = {}
    Object.keys(deleteReceiptsModalProps?.steps).forEach((key) => {
      let ele = deleteReceiptsModalProps?.steps[key]
      if (key === STEPS_IDS.STEP_1 && ele.status === STEP_STATUS.IN_PROGRESS) {
        actionBtn = {
          text: t('deleteAllReceipts'),
          onClick: () => handleDeleteAllReciepts(),
        }
      } else if (
        key === STEPS_IDS.STEP_2 &&
        ele.status === STEP_STATUS.IN_PROGRESS
      ) {
        actionBtn = {
          text: t('deleteFeeStructure'),
          onClick: () => confirmDeleteStructure(structure),
        }
      }
    })

    return [
      {
        body: t('cancel'),
        onClick: () => closeDeleteReceiptsModal(),
        type: 'outline',
      },
      {
        body: (
          <div className={DeleteRecieptsModalStyles.buttonLoadingSection}>
            {actionBtn.text}
          </div>
        ),
        onClick: actionBtn.onClick,
        type: 'destructive',
      },
    ]
  }, [
    structure,
    Object.keys(deleteReceiptsModalProps).map(
      (item) => deleteReceiptsModalProps[item]
    ),
  ])

  return (
    <>
      {deleteReceiptsModalProps?.isOpen && (
        <DeleteRecieptsModal
          {...deleteReceiptsModalProps}
          classes={{
            stepper: {description: DeleteRecieptsModalStyles.stepperDesc},
          }}
          handleCloseModal={() => closeDeleteReceiptsModal()}
          handleDeleteAllReciepts={() => handleDeleteAllReciepts()}
          actionButtons={deleteReceiptModalButtons()}
          strutureInfo={{
            ...structure,
          }}
          eventManager={eventManager}
        />
      )}
      {alertModalProps?.isOpen && (
        <div className={DeleteRecieptsModalStyles.alertModalSection}>
          <AlertModal
            {...alertModalProps}
            // header={t('cannotDeletePreviousDue')}
            // text={t('previousSessionDueFineOrDiscountErrorMsg')}
            handleCloseModal={() => closeDeleteReceiptsPopup()}
            actionButtons={alertModalProps?.actionButtons || []}
          />
        </div>
      )}
    </>
  )
}
