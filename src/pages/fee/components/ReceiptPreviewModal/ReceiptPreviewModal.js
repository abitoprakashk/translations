import React, {useEffect} from 'react'
import styles from './ReceiptPreviewModal.module.css'
import {Button, Icon, Modal} from '@teachmint/common'
import classNames from 'classnames'
import {Trans, useTranslation} from 'react-i18next'
import {
  paymentStatus,
  paymentStatusLabels,
  RECEIPT_METHOD,
} from '../../fees.constants'
import {useDispatch, useSelector} from 'react-redux'
import {setRecordPaymentDetailsAction} from '../../redux/feeCollectionActions'
import {useHistory} from 'react-router-dom'
import feeCollectionActionTypes from '../../redux/feeCollectionActionTypes'
import {events} from '../../../../utils/EventsConstants'

export default function ReceiptPreviewModal({
  isOpen = false,
  recordPaymentDetails = {},
  receiptIds = [],
  submitFees = null,
  handleSetSliderScreen,
}) {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const history = useHistory()
  const eventManager = useSelector((state) => state.eventManager)
  const isMobile = useSelector((state) => state.isMobile)

  const handleSetRecordPaymentDetails = () => {
    dispatch(
      setRecordPaymentDetailsAction({
        isPopupOpen: false,
        receiptUrl: null,
        studentId: '',
        name: '',
        amount: 0,
        classroom: '',
        paymentMode: '',
        buttonLoader: false,
      })
    )
  }

  useEffect(() => {
    return () => {
      if (!isOpen) {
        handleSetRecordPaymentDetails()
      }
    }
  }, [])

  const handleGoToTransactionPage = () => {
    if (handleSetSliderScreen) {
      handleSetSliderScreen()
    }
    history.push('/institute/dashboard/fee-transactions/bank')
    eventManager.send_event(events.GO_TO_TRANSACTION_CLICKED_TFI, {
      payment_type: recordPaymentDetails?.paymentMode,
    })
    dispatch(
      setRecordPaymentDetailsAction({
        isPopupOpen: false,
      })
    )
  }

  const handleDownloadOrPrintReceipt = (
    actionMethod = RECEIPT_METHOD.download
  ) => {
    if (submitFees?.receipts?.length > 0) {
      eventManager.send_event(events.PAYMENT_CONFIRMATION_RECEIPT_TFI, {
        payment_type: recordPaymentDetails?.paymentMode,
        action: actionMethod,
      })

      dispatch({
        type: feeCollectionActionTypes.FEE_RECEIPT_DOWNLOAD_AND_PRINT_REQUEST,
        payload: {
          studentId: recordPaymentDetails.studentId,
          receiptNo: submitFees?.receipts,
          actionMethod,
          receiptObj: recordPaymentDetails,
        },
      })
    }
  }

  return (
    <Modal show={isOpen} className={classNames(styles.modal, styles.modalMain)}>
      <div className={styles.wrapper}>
        <div
          className={styles.headerRightSide}
          onClick={handleSetRecordPaymentDetails}
          role="button"
        >
          <Icon color="basic" name={'close'} size="xs" type="outlined" />
        </div>
        <div className={styles.headerSection}>
          <div className={styles.headerLeftSide}>
            <Icon
              color="success"
              name={'checkCircle'}
              size="3xl"
              type="filled"
            />
            <div className={styles.paymentConfirmText}>
              {![paymentStatus.CHEQUE, paymentStatus.DD].includes(
                recordPaymentDetails?.paymentMode
              )
                ? t('paymentConfirmed')
                : `${
                    paymentStatus.CHEQUE === recordPaymentDetails?.paymentMode
                      ? t('chequeReceived')
                      : t('ddReceived')
                  }`}
            </div>
            <div
              className={classNames(
                styles.dFlex,
                styles.alignCenter,
                styles.justifyCenter,
                styles.flexWrap
              )}
            >
              <span className={styles.helperText}>
                {recordPaymentDetails?.name}
              </span>
              <div className={styles.dot}></div>
              <span className={styles.helperText}>
                {recordPaymentDetails?.classroom}
              </span>
              <div className={styles.dot}></div>
              <span className={styles.helperText}>
                {recordPaymentDetails?.amount}
              </span>
              <div className={styles.dot}></div>
              <span className={styles.helperText}>
                {recordPaymentDetails?.paymentMode
                  ? t(
                      paymentStatusLabels[recordPaymentDetails?.paymentMode]
                        .label
                    )
                  : ''}
              </span>
              {receiptIds.length === 0 &&
                [paymentStatus.CHEQUE, paymentStatus.DD].includes(
                  recordPaymentDetails?.paymentMode
                ) && (
                  <>
                    <div className={styles.dot}></div>
                    <div className={styles.badge}>
                      <Icon
                        color="warning"
                        name={'error'}
                        size="xxxs"
                        type="filled"
                      />
                      {t('pending')}
                    </div>
                  </>
                )}
            </div>
            {receiptIds.length === 0 &&
              [paymentStatus.CHEQUE, paymentStatus.DD].includes(
                recordPaymentDetails?.paymentMode
              ) && (
                <div className={styles.warningInfo}>
                  <Icon
                    color="warning"
                    name={'error'}
                    size="xxxs"
                    type="filled"
                  />
                  <Trans i18nKey={'recordPaymentPopupChequeDdInfoText'}>
                    Payment receipt will be generated once the
                    {paymentStatus.CHEQUE === recordPaymentDetails?.paymentMode
                      ? 'cheque'
                      : 'dd'}
                    status is updated to cleared.
                  </Trans>
                </div>
              )}
          </div>
        </div>
        <div className={styles.contentSection}></div>
        <div
          className={classNames(styles.footerSection, {
            [styles.justifyCenterFooter]: recordPaymentDetails.buttonLoader,
          })}
        >
          {receiptIds.length > 0 && (
            <>
              {recordPaymentDetails.buttonLoader ? (
                <div
                  className={classNames(
                    'loading',
                    styles.loader,
                    styles.loaderHigherSpecificity
                  )}
                ></div>
              ) : (
                <>
                  <Button
                    type="outlined"
                    className={classNames(styles.buttons, styles.dounloadBtn)}
                    onClick={() =>
                      handleDownloadOrPrintReceipt(RECEIPT_METHOD.download)
                    }
                  >
                    <Icon
                      color="primary"
                      name={'download'}
                      size="xs"
                      type="outlined"
                    />{' '}
                    {t('download')}
                  </Button>
                  {!isMobile && (
                    <Button
                      className={classNames(styles.buttons, styles.printBtn)}
                      onClick={() =>
                        handleDownloadOrPrintReceipt(RECEIPT_METHOD.print)
                      }
                    >
                      <Icon
                        color="inverted"
                        name={'print'}
                        size="xs"
                        type="filled"
                      />{' '}
                      {t('print')}
                    </Button>
                  )}
                </>
              )}
            </>
          )}
          {[paymentStatus.CHEQUE, paymentStatus.DD].includes(
            recordPaymentDetails?.paymentMode
          ) && (
            <Button
              className={classNames(
                styles.buttons,
                styles.printBtn,
                styles.goTransPage
              )}
              onClick={handleGoToTransactionPage}
            >
              {t('goToTransactionPage')}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  )
}
