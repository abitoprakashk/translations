import {useEffect, useState} from 'react'
import {ErrorOverlay, Input, Table, Tag, Tooltip} from '@teachmint/common'
import styles from './FeeHistory.module.css'
import downloadIcon from '../../../../assets/images/icons/download-blue.svg'
import {useFeeCollection} from '../../redux/feeCollectionSelectors'
import {useDispatch, useSelector} from 'react-redux'
// import feeCollectionActionTypes from '../../redux/feeCollectionActionTypes'
import {feeHistoryRequestedAction} from '../../redux/feeCollectionActions'
import feeTransactionActionTypes from '../../redux/feeTransactionActionTypes'
import {
  convertTimestampToLocalDateTime,
  getAmountFixDecimalWithCurrency,
  getShortTxnId,
  numDifferentiation,
} from '../../../../utils/Helpers'
import classNames from 'classnames'
import {
  FEE_TRANSACTION_CANCELLED_OPTIONS,
  payStatusLabel,
  payStatusTag,
} from '../FeeTransaction/FeeTransactionConstants'
// import {showToast} from '../../../../redux/actions/commonAction'
import HistorySection from './HistorySection'
import {useTranslation} from 'react-i18next'
import SubjectTooltipOptions from '../../../../components/SchoolSystem/SectionDetails/SubjectTooltipOptions'
import Permission from '../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'
import {
  ACTION_CANCEL_TRANSACTION_RECEIPT,
  DUE_PAID_DROPDOWN,
  DUE_PAID_OPTIONS,
  paymentStatusLabels,
} from '../../fees.constants'

const FeeHistory = ({studentId}) => {
  const {t} = useTranslation()

  const dispatch = useDispatch()
  const {feeHistory, feeHistoryLoading, feeHistoryErrMsg} = useFeeCollection()
  const {instituteInfo} = useSelector((state) => state)
  const [selectedFeeFilterOption, setSelectedFilterOption] = useState(
    DUE_PAID_DROPDOWN.TOTAL_ANNUAL_FEE
  )

  // useEffect(() => {
  //   if (studentId && (!feeHistory || feeHistory.studentId !== studentId)) {
  //     dispatch({
  //       type: feeCollectionActionTypes.FEE_HISTORY_REQUESTED,
  //       payload: {
  //         studentId,
  //       },
  //     })
  //   }
  // }, [studentId, academicSessionId, instituteId])

  useEffect(() => {
    if (studentId) {
      dispatch(feeHistoryRequestedAction(studentId))
    }
  }, [studentId])

  if (feeHistoryLoading) {
    return <div className="loading" />
  }

  if (!feeHistory) {
    // return <div>No data</div>
    return <div>{t('noData')}</div>
  }

  const openLinkInNewTab = (link) => {
    const win = window.open(link, '_blank')
    if (win != null) {
      win.focus()
    }
  }

  const checkForDownloadReceipt = (studentId, receipt, isCancelled = false) => {
    let receiptInfo = {
      receiptNo: isCancelled ? 'cancReceiptNo' : 'receiptNo',
      receiptUrl: isCancelled ? 'cancReceiptUrl' : 'receiptUrl',
    }
    if (receipt[receiptInfo.receiptUrl] !== '') {
      openLinkInNewTab(receipt[receiptInfo.receiptUrl])
    } else {
      dispatch({
        type: feeTransactionActionTypes.FEE_TRANSACTION_DOWNLOAD_REQUESTED,
        payload: {
          isCancelled: isCancelled,
          studentId: studentId,
          receiptNo: receipt[receiptInfo.receiptNo].replace('CAN/', ''),
          filters: {},
        },
      })
    }
  }

  const handleOnClickReceipt = (action, receiptData) => {
    checkForDownloadReceipt(
      receiptData.studentId,
      receiptData.receipt,
      action === ACTION_CANCEL_TRANSACTION_RECEIPT
    )
  }

  const downloadReceiptOptions = (studentId, receipt) => {
    if (['PENDING', 'FAILED', 'REVOKED'].includes(receipt.transactionStatus)) {
      return '-'
    } else if (receipt.transactionStatus === 'CANCELLED') {
      const receiptData = {
        studentId: studentId,
        receipt: receipt,
      }
      return (
        <Permission
          permissionId={
            PERMISSION_CONSTANTS.feeModuleController_getReceiptDownload_read
          }
        >
          <SubjectTooltipOptions
            subjectItem={receiptData}
            options={FEE_TRANSACTION_CANCELLED_OPTIONS}
            trigger={
              <img
                className="cursor-pointer"
                src={downloadIcon}
                alt="Download Receipt"
              />
            }
            handleChange={handleOnClickReceipt}
          />
        </Permission>
      )
    } else {
      return (
        <Permission
          permissionId={
            PERMISSION_CONSTANTS.feeModuleController_getReceiptDownload_read
          }
        >
          <div onClick={() => checkForDownloadReceipt(studentId, receipt)}>
            <img
              className="cursor-pointer"
              src={downloadIcon}
              alt="Download Receipt"
            />
          </div>
        </Permission>
      )
    }
  }

  const cols = [
    {key: 'feeStructure', label: t('fee')},
    {key: 'paymentDetails', label: t('paymentDetails')},
    {key: 'date', label: t('date')},
    {key: 'status', label: t('status')},
    {key: 'receipt', label: t('receipt')},
  ]
  let rows = []

  // const handleCopy = (str) => {
  //   dispatch(showToast({type: 'success', message: 'Copied Successfully'}))
  //   navigator && navigator.clipboard.writeText(str)
  // }

  if (feeHistory.receipts.length === 0) {
    rows = [
      {
        feeStructure: '',
        // paymentDetails: 'No Data Found',
        paymentDetails: t('noDataFound'),
        date: '',
        status: '',
        receipt: '',
      },
    ]
  } else {
    rows = feeHistory.receipts.map((receipt, i) => {
      const feeCatLabel =
        receipt.structureName && receipt.structureName.trim() !== ''
          ? receipt.structureName.trim()
          : `# ${receipt.transactionId}`
      return {
        feeStructure: (
          <div className="cstTxnbl">
            <span
              className={classNames(styles.cstTxnId)}
              data-tip
              data-for={`txnId_${i}`}
            >
              {getShortTxnId(feeCatLabel, 8)}
            </span>
            {/* <img
              className={classNames(styles.cstTxnIdCopyIcon)}
              src="https://storage.googleapis.com/tm-assets/icons/blue/copy-blue.svg"
              alt="Copy"
              onClick={() => {
                handleCopy(feeCatLabel)
              }}
            /> */}
            <Tooltip toolTipId={`txnId_${i}`} place="top" type="info">
              <span>{feeCatLabel}</span>
            </Tooltip>
            {}
          </div>
        ),
        paymentDetails: (
          <div className={classNames(styles.payment, 'bold')}>
            <div>
              {getAmountFixDecimalWithCurrency(
                receipt.amount,
                instituteInfo.currency
              )}
            </div>
            <span>
              {paymentStatusLabels[receipt.paymentMethod].actualLabel}
            </span>
          </div>
        ),
        date: <div>{convertTimestampToLocalDateTime(receipt.timestamp)}</div>,
        status: (
          <span>
            <Tag
              accent={payStatusTag[receipt.transactionStatus]}
              content={payStatusLabel[receipt.transactionStatus]}
            />
          </span>
        ),
        receipt: downloadReceiptOptions(studentId, receipt),
      }
    })
  }

  const feeDetails = [
    {
      className: styles.payableAmount,
      amount:
        selectedFeeFilterOption == DUE_PAID_DROPDOWN.APPLICABLE_TILL_DATE
          ? numDifferentiation(
              feeHistory?.payableAmount,
              instituteInfo.currency
            ) ?? numDifferentiation(0, instituteInfo.currency)
          : numDifferentiation(
              feeHistory?.totalPayable,
              instituteInfo.currency
            ) ?? numDifferentiation(0, instituteInfo.currency),
      value:
        selectedFeeFilterOption == DUE_PAID_DROPDOWN.APPLICABLE_TILL_DATE
          ? getAmountFixDecimalWithCurrency(
              feeHistory?.payableAmount,
              instituteInfo.currency
            ) ?? getAmountFixDecimalWithCurrency(0, instituteInfo.currency)
          : getAmountFixDecimalWithCurrency(
              feeHistory?.totalPayable,
              instituteInfo.currency
            ) ?? getAmountFixDecimalWithCurrency(0, instituteInfo.currency),
      label: t('totalApplicable'),
    },
    {
      className: styles.discountAmount,
      amount:
        selectedFeeFilterOption == DUE_PAID_DROPDOWN.APPLICABLE_TILL_DATE
          ? numDifferentiation(
              feeHistory?.discountAmount,
              instituteInfo.currency
            ) ?? numDifferentiation(0, instituteInfo.currency)
          : numDifferentiation(
              feeHistory?.totalDiscount,
              instituteInfo.currency
            ) ?? numDifferentiation(0, instituteInfo.currency),
      value:
        selectedFeeFilterOption == DUE_PAID_DROPDOWN.APPLICABLE_TILL_DATE
          ? getAmountFixDecimalWithCurrency(
              feeHistory?.discountAmount,
              instituteInfo.currency
            ) ?? getAmountFixDecimalWithCurrency(0, instituteInfo.currency)
          : getAmountFixDecimalWithCurrency(
              feeHistory?.totalDiscount,
              instituteInfo.currency
            ) ?? getAmountFixDecimalWithCurrency(0, instituteInfo.currency),
      label: t('discountApplied'),
    },
    {
      className: styles.dueAmount,
      amount:
        selectedFeeFilterOption == DUE_PAID_DROPDOWN.APPLICABLE_TILL_DATE
          ? numDifferentiation(feeHistory?.dueAmount, instituteInfo.currency) ??
            numDifferentiation(0, instituteInfo.currency)
          : numDifferentiation(feeHistory?.totalDue, instituteInfo.currency) ??
            numDifferentiation(0, instituteInfo.currency),
      value:
        selectedFeeFilterOption == DUE_PAID_DROPDOWN.APPLICABLE_TILL_DATE
          ? getAmountFixDecimalWithCurrency(
              feeHistory?.dueAmount,
              instituteInfo.currency
            ) ?? getAmountFixDecimalWithCurrency(0, instituteInfo.currency)
          : getAmountFixDecimalWithCurrency(
              feeHistory?.totalDue,
              instituteInfo.currency
            ) ?? getAmountFixDecimalWithCurrency(0, instituteInfo.currency),
      label:
        selectedFeeFilterOption == DUE_PAID_DROPDOWN.APPLICABLE_TILL_DATE
          ? t('overdueFee')
          : t('dueFee'),
    },
    {
      className: styles.paidAmount,
      amount:
        selectedFeeFilterOption == DUE_PAID_DROPDOWN.APPLICABLE_TILL_DATE
          ? numDifferentiation(
              feeHistory?.paidAmount,
              instituteInfo.currency
            ) ?? numDifferentiation(0, instituteInfo.currency)
          : numDifferentiation(feeHistory?.totalPaid, instituteInfo.currency) ??
            numDifferentiation(0, instituteInfo.currency),
      value:
        selectedFeeFilterOption == DUE_PAID_DROPDOWN.APPLICABLE_TILL_DATE
          ? getAmountFixDecimalWithCurrency(
              feeHistory?.paidAmount,
              instituteInfo.currency
            ) ?? getAmountFixDecimalWithCurrency(0, instituteInfo.currency)
          : getAmountFixDecimalWithCurrency(
              feeHistory?.totalPaid,
              instituteInfo.currency
            ) ?? getAmountFixDecimalWithCurrency(0, instituteInfo.currency),
      label: t('paidFee'),
    },
    {
      className: styles.pendingAmount,
      amount:
        selectedFeeFilterOption == DUE_PAID_DROPDOWN.APPLICABLE_TILL_DATE
          ? numDifferentiation(
              feeHistory?.pendingTillDate,
              instituteInfo.currency
            ) ?? numDifferentiation(0, instituteInfo.currency)
          : numDifferentiation(
              feeHistory?.totalPending,
              instituteInfo.currency
            ) ?? numDifferentiation(0, instituteInfo.currency),
      value:
        selectedFeeFilterOption == DUE_PAID_DROPDOWN.APPLICABLE_TILL_DATE
          ? getAmountFixDecimalWithCurrency(
              feeHistory?.pendingTillDate,
              instituteInfo.currency
            ) ?? getAmountFixDecimalWithCurrency(0, instituteInfo.currency)
          : getAmountFixDecimalWithCurrency(
              feeHistory?.totalPending,
              instituteInfo.currency
            ) ?? getAmountFixDecimalWithCurrency(0, instituteInfo.currency),
      label: t('pendingFees'),
    },
  ]

  return (
    <div className={styles.feeHistory}>
      <div className={styles.feeFilterAndDetailsSection}>
        <div className={styles.inputDropdown}>
          <div className={styles.summaryText}>{t('summary')}</div>
          <Input
            type="select"
            fieldName="feeFilterType"
            value={selectedFeeFilterOption}
            options={DUE_PAID_OPTIONS}
            onChange={(e) => setSelectedFilterOption(e.value)}
            classes={{wrapper: styles.inputWrapper}}
          />
        </div>
        <div className={styles.feeDetails}>
          {feeDetails.map((detail, i) => {
            return <HistorySection key={i} feeDetail={detail} />
          })}
        </div>
      </div>
      {feeHistoryErrMsg ?? <ErrorOverlay>{feeHistoryErrMsg}</ErrorOverlay>}
      <Table rows={rows} cols={cols} />
    </div>
  )
}

export default FeeHistory
