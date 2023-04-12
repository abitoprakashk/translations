import {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {t} from 'i18next'
import classNames from 'classnames'
import {saveAs} from 'file-saver'
import printJS from 'print-js'
import {
  Modal,
  Icon,
  Para,
  ICON_CONSTANTS,
  BUTTON_CONSTANTS,
  Heading,
  HEADING_CONSTANTS,
} from '@teachmint/krayon'
import PDFViewer from '../../../../../../components/Common/PdfViewer/PdfViewer'
import {showErrorToast} from '../../../../../../redux/actions/commonAction'
import {FEES_STEPPER_IDS} from '../../../../utils/constants'
import {
  getTransactionListWithStatusSuccess,
  getReciept,
} from '../../../../redux/admissionManagement.selectors'
import globalActions from '../../../../../../redux/actions/global.actions'
import styles from './ViewReciept.module.css'
import {events} from '../../../../../../utils/EventsConstants'
import {DEFAULT_CURRENCY} from '../../../../../../constants/common.constants'
import {getSymbolFromCurrency} from '../../../../../../utils/Helpers'

export default function ViewReciept({
  showReciept,
  setShowReciept,
  leadId,
  leadName,
  leadClass,
  feeType,
}) {
  const dispatch = useDispatch()
  const getReceiptUrl = getReciept()
  const getTransactionList = getTransactionListWithStatusSuccess()
  const eventManager = useSelector((state) => state.eventManager)
  const instituteInfo = useSelector((state) => state.instituteInfo)

  const successAction = (transData) => {
    if (transData?.receipt_no) {
      eventManager.send_event(
        events.ADMISSION_LEAD_PROFILE_VIEW_RECEIPT_CLICKED_TFI,
        transData?.receipt_no
          ? {receipt_id: transData?.receipt_no, fee_type: feeType}
          : ''
      )
    }
  }

  useEffect(() => {
    dispatch(
      globalActions.getTransactionListWithStatusSuccess.request(
        {leadId, feeType},
        successAction
      )
    )
  }, [feeType])

  useEffect(() => {
    // dispatch(globalActions.getReciept.reset())
    if (
      getTransactionList &&
      getTransactionList?.loaded &&
      getTransactionList?.data != [] &&
      getTransactionList?.data[0]?.receipt_url === null &&
      getTransactionList?.data[0]?.fee_type == feeType
    ) {
      dispatch(
        globalActions.getReciept.request(
          getTransactionList?.data[0]?._id,
          successAction
        )
      )
    }
  }, [getTransactionList])

  const handleDownload = async (fileUrl) => {
    const fileName = fileUrl.split('/').pop()
    let blob = await fetch(fileUrl).then((r) => r.blob())
    saveAs(blob, fileName)
  }

  const handlePrint = (fileUrl) => {
    if (!fileUrl) return
    const fileType = fileUrl.split('.').pop()
    let type = ''
    if (fileType === 'pdf') type = 'pdf'
    else if (fileType === 'jpeg' || fileType === 'png') type = 'image'
    else return
    printJS({
      printable: fileUrl,
      documentTitle: '',
      type: type,
      targetStyles: ['*'],
      onError: () => {
        showErrorToast(t('somethingWentWrongPleaseCheckYourNetwork'))
      },
    })
  }

  return (
    <div>
      <Modal
        shouldCloseOnOverlayClick={false}
        shouldCloseOnEsc={false}
        header={
          <div className={styles.modalHeader}>
            <Heading
              children={
                feeType === FEES_STEPPER_IDS.FORM_FEE
                  ? t('formFee')
                  : t('admissionFee')
              }
              textSize={HEADING_CONSTANTS.TEXT_SIZE.X_SMALL}
            />
            <Icon
              onClick={() => setShowReciept(!showReciept)}
              name="close"
              size={ICON_CONSTANTS.SIZES.SMALL}
              className={styles.closeIconStyle}
            />
          </div>
        }
        isOpen={showReciept}
        onClose={() => setShowReciept(!showReciept)}
        actionButtons={[
          {
            onClick: () => {
              handleDownload(
                getTransactionList?.data[0]?.receipt_url != null
                  ? getTransactionList?.data[0]?.receipt_url
                  : getReceiptUrl?.data?.receipt_url
              )
            },
            body: t('downloadReceiptLeadProfile'),
            type: BUTTON_CONSTANTS.TYPE.OUTLINE,
            prefixIcon: 'download',
            isDisabled: getReceiptUrl.isLoading || getTransactionList.isLoading,
          },
          {
            onClick: () => {
              handlePrint(
                getTransactionList?.data[0]?.receipt_url != null
                  ? getTransactionList?.data[0]?.receipt_url
                  : getReceiptUrl?.data?.receipt_url
              )
            },
            body: t('printReceiptLeadProfile'),
            type: BUTTON_CONSTANTS.TYPE.OUTLINE,
            prefixIcon: 'print',
            isDisabled: getReceiptUrl.isLoading || getTransactionList.isLoading,
          },
        ]}
        classes={{modal: styles.modalSize}}
      >
        {getReceiptUrl.isLoading || getTransactionList.isLoading ? (
          <div className="loading"></div>
        ) : (
          <div className={styles.modalContentWrapper}>
            <div className={styles.feeDataWrapper}>
              <Para children={leadName} className={styles.textTransform} />
              <div className={styles.separator}></div>
              <Para children={`${t('classLeadProfilePage')} ${leadClass}`} />
              <div className={styles.separator}></div>
              {getTransactionList?.data != null ? (
                <div className={styles.receiptAmount}>
                  <Para
                    children={getSymbolFromCurrency(
                      instituteInfo.currency || DEFAULT_CURRENCY
                    )}
                  />
                  <Para children={getTransactionList?.data[0]?.amount} />
                </div>
              ) : (
                <Para />
              )}
              <div className={styles.separator}></div>
              {getTransactionList?.data != null ? (
                <Para children={getTransactionList?.data[0]?.payment_mode} />
              ) : (
                <Para />
              )}
              <div className={styles.separator}></div>
              {getTransactionList?.data != null ? (
                <Para
                  children={`${t('receiptGeneratedLeadProfile')} ${
                    getTransactionList?.data[0]?.receipt_no ?? ''
                  }`}
                />
              ) : (
                <Para />
              )}
            </div>
            <div
              className={classNames(
                styles.pdfOuterWrapper,
                'show-scrollbar',
                'show-scrollbar-small'
              )}
            >
              <div className={styles.pdfInnerWrapper}>
                {getTransactionList?.data != null ? (
                  typeof getTransactionList?.data[0]?.receipt_url !=
                  'string' ? (
                    getReceiptUrl &&
                    getReceiptUrl?.loaded &&
                    getReceiptUrl?.data &&
                    getReceiptUrl?.data?.receipt_url && (
                      <PDFViewer
                        file={getReceiptUrl?.data?.receipt_url}
                        scale={0.7}
                      />
                    )
                  ) : (
                    <PDFViewer
                      file={getTransactionList?.data[0]?.receipt_url}
                      scale={0.7}
                    />
                  )
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
