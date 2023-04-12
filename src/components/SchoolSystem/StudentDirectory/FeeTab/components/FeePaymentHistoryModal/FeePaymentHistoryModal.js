import React, {useEffect, useState} from 'react'
import styles from './FeePaymentHistoryModal.module.css'
import {ErrorBoundary, ErrorOverlay, Tooltip} from '@teachmint/common'
import {Badges, Divider, Heading, Icon, Table, Modal} from '@teachmint/krayon'
import {useTranslation} from 'react-i18next'
import classNames from 'classnames'
import {useDispatch, useSelector} from 'react-redux'
import {
  EVENTS_SCREEN_NAMES,
  FEE_TAB_TRANSACTION_DOWNLOAD_OPTIONS,
  PAYMENT_HISTORY_MODALS_FOR,
  PAYMENT_HISTORY_TABLE_COLS,
  requestDispatchFrom,
} from '../../FeeTabConstant'
import {
  convertTimestampToLocalDateTime,
  getAmountFixDecimalWithCurrency,
  getShortTxnId,
} from '../../../../../../utils/Helpers'

import {
  ACTION_DELETE_TRANSACTION,
  ACT_DOWNLOAD_RECEIPT,
} from '../../../../../../pages/fee/fees.constants'
import feeTransactionActionTypes from '../../../../../../pages/fee/redux/feeTransactionActionTypes'
import {
  paymentStatus,
  payStatusKrayonTag,
  payStatusLabel,
  REVOKED,
} from '../../../../../../pages/fee/components/FeeTransaction/FeeTransactionConstants'
import {
  getStudentProfileFeePaymentHistoryAction,
  setStudentProfileFeePaymentHistoryStateAction,
} from '../../../redux/feeAndWallet/actions'
import {useStudentProfileFeeTabPaymentHistorySelector} from '../../../redux/selectros/feeTabSelectors'
import TableSkeleton from '../../skeletons/TableSkeleton/TableSkeleton'
import NoDataComp from '../NoDataComp/NoDataComp'
import {events} from '../../../../../../utils/EventsConstants'
import SubjectTooltipOptions from '../../../../SectionDetails/SubjectTooltipOptions'
import AlertModal from '../../../../../Common/AlertModal/AlertModal'
import {openLinkInNewTab} from '../../../../../../pages/fee/helpers/helpers'

export default function FeePaymentHistoryModal({
  studentId = null,
  isOpen = true,
  setIsOpen = () => {},
  modalForAndTimeStamp = {},
  sendClickEvents = () => {},
}) {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const {instituteInfo} = useSelector((state) => state)
  const {isDataFetching, data, error} =
    useStudentProfileFeeTabPaymentHistorySelector()
  const [alertModalProps, setAlertModalProps] = useState({
    isOpen: false,
    header: t('deleteRecieptText'),
    text: [
      `${t('areYouSureYouWantToDeleteTheReceipt')}?`,
      t('receiptWillBeDeletedPermanentlyAndCantBeUndoneLater'),
    ],
  })

  useEffect(() => {
    if (studentId) {
      dispatch(
        getStudentProfileFeePaymentHistoryAction({
          studentId,
          modalForAndTimeStamp,
        })
      )
    }

    return () => {
      dispatch(
        setStudentProfileFeePaymentHistoryStateAction({
          isDataFetching: false,
          data: [],
          error: '',
        })
      )
    }
  }, [studentId])

  const checkForDownloadReceipt = (studentId, receipt, isCancelled = false) => {
    let receiptInfo = {
      receiptNo: isCancelled ? 'cancReceiptNo' : 'receiptNo',
      receiptUrl: isCancelled ? 'cancReceiptUrl' : 'receiptUrl',
    }
    let screenName =
      modalForAndTimeStamp?.modalFor ===
      PAYMENT_HISTORY_MODALS_FOR.viewPaymentHistory
        ? EVENTS_SCREEN_NAMES.student_details_payment_history
        : EVENTS_SCREEN_NAMES.student_details_view_receipts

    sendClickEvents(events.DOWNLOAD_RECEIPT_CLICKED_TFI, {
      screen_name: screenName,
    })

    if (receipt[receiptInfo.receiptUrl] !== '') {
      sendClickEvents(events.RECEIPT_DOWNLOADED_TFI, {screen_name: screenName})
      openLinkInNewTab(receipt[receiptInfo.receiptUrl])
    } else {
      dispatch({
        type: feeTransactionActionTypes.FEE_TRANSACTION_DOWNLOAD_REQUESTED,
        payload: {
          isCancelled: isCancelled,
          studentId: studentId,
          receiptNo: receipt[receiptInfo.receiptNo].replace('CAN/', ''),
          filters: {},
          metaData: {
            sendClickEvents: () =>
              sendClickEvents(events.RECEIPT_DOWNLOADED_TFI, {
                screen_name: screenName,
              }),
          },
        },
      })
    }
  }

  const handleAlertModalClose = (isClicked = false) => {
    if (isClicked) {
      sendClickEvents(events.DELETE_RECEIPT_POPUP_CLICKED_TFI, {
        action: 'Cancel',
      })
    }
    setAlertModalProps((prev) => {
      return {...prev, isOpen: false}
    })
  }

  const confirmDeleteTransaction = (receiptData) => {
    sendClickEvents(events.DELETE_RECEIPT_POPUP_CLICKED_TFI, {action: 'Delete'})
    function onSuccess() {
      sendClickEvents(events.FEE_RECEIPT_DELETED_TFI)
      handleAlertModalClose()
      dispatch(
        getStudentProfileFeePaymentHistoryAction({
          studentId,
          modalForAndTimeStamp,
        })
      )
    }
    dispatch({
      type: feeTransactionActionTypes.REVOKE_FEE_TRANSACTION_REQUESTED,
      payload: {
        receiptNo: receiptData.receiptNo,
        isCancelled: false,
        metaData: {
          isDispatchFrom: requestDispatchFrom.FEE_TAB_PAYMENT_HISTORY,
          onSuccess,
        },
      },
    })
  }

  const handleOnClickReceipt = (action, receiptData) => {
    if (action === ACTION_DELETE_TRANSACTION) {
      sendClickEvents(events.DELETE_RECEIPT_CLICKED_TFI)
      setAlertModalProps((prev) => {
        return {
          ...prev,
          isOpen: true,
          actionButtons: [
            {
              body: t('cancel'),
              onClick: () => handleAlertModalClose(true),
              type: 'outline',
            },
            {
              body: t('delete'),
              onClick: () => confirmDeleteTransaction(receiptData),
              type: 'destructive',
            },
          ],
        }
      })
    } else if (action === ACT_DOWNLOAD_RECEIPT) {
      checkForDownloadReceipt(
        receiptData.studentId ?? studentId,
        receiptData,
        receiptData.transactionStatus === paymentStatus.CANCELLED
      )
    }
  }

  const downloadReceiptOptions = (receipt) => {
    if (
      [
        paymentStatus.PENDING,
        paymentStatus.FAILED,
        paymentStatus.REVOKED,
        REVOKED,
      ].includes(receipt.transactionStatus)
    ) {
      return (
        <div className={styles.downloadDiv}>
          <span>-</span>
        </div>
      )
    } else {
      return (
        <div className={styles.actionBtn}>
          <SubjectTooltipOptions
            subjectItem={receipt}
            options={FEE_TAB_TRANSACTION_DOWNLOAD_OPTIONS}
            trigger={
              <img
                src="https://storage.googleapis.com/tm-assets/icons/secondary/settings-dots-secondary.svg"
                alt=""
                className="w-4 h-4"
              />
            }
            handleChange={handleOnClickReceipt}
          />
        </div>
      )
    }
  }

  const rows =
    data.length !== 0
      ? data?.map((receipt, i) => {
          const feeCatLabel = receipt?.receiptNo
            ? `# ${receipt.receiptNo}`
            : '--'
          return {
            id: `paymentHistory${i}`,
            receiptNo: (
              <div>
                <span
                  className={classNames(styles.cstTxnId)}
                  data-tip
                  data-for={`txnId_${i}`}
                >
                  {getShortTxnId(feeCatLabel, 8)}
                </span>
                <Tooltip toolTipId={`txnId_${i}`} place="top" type="info">
                  <span>{feeCatLabel}</span>
                </Tooltip>
              </div>
            ),
            amount: getAmountFixDecimalWithCurrency(
              receipt.amount,
              instituteInfo.currency
            ),
            mode: (
              <div className={styles.capitalized}>
                {receipt.paymentMethod?.toLowerCase()}
              </div>
            ),
            date: convertTimestampToLocalDateTime(receipt.timestamp),
            status: (
              <Badges
                size="s"
                type={payStatusKrayonTag[receipt.transactionStatus]}
                inverted
                label={payStatusLabel[receipt.transactionStatus]}
                showIcon={false}
              />
            ),
            receipt: downloadReceiptOptions(receipt),
          }
        })
      : []

  return (
    <ErrorBoundary>
      {alertModalProps?.isOpen && (
        <div className={styles.alertModalSection}>
          <AlertModal
            {...alertModalProps}
            handleCloseModal={() => handleAlertModalClose(true)}
          />
        </div>
      )}
      <div>
        <Modal
          size="l"
          isOpen={isOpen}
          header={
            <>
              <div className={styles.modalHeadingSection}>
                <div className={styles.iconAndHeadingSection}>
                  <Heading textSize="x_s">
                    {modalForAndTimeStamp.modalFor ===
                    PAYMENT_HISTORY_MODALS_FOR.viewPaymentHistory
                      ? t('paymentHistory')
                      : t('receiptPaidFeeWithHyphen')}
                  </Heading>
                </div>
                <div>
                  <button onClick={() => setIsOpen(!isOpen)}>
                    <Icon name="close" size="x_s" version="outlined" />
                  </button>
                </div>
              </div>
              <Divider length="100%" spacing="0px" thickness="1px" />
            </>
          }
        >
          {isDataFetching ? (
            <TableSkeleton tableRowsCount={7} />
          ) : (
            <>
              {error ?? <ErrorOverlay>{error}</ErrorOverlay>}
              <Table
                uniqueKey={'id'}
                rows={rows}
                cols={PAYMENT_HISTORY_TABLE_COLS}
                isSelectable={false}
                classes={{table: styles.table}}
              />
              {rows?.length === 0 && (
                <NoDataComp msg={t('noPaymentHistoryFound')} />
              )}
            </>
          )}
        </Modal>
      </div>
    </ErrorBoundary>
  )
}
