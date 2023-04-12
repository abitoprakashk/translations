import React from 'react'
import transactionStyles from '../FeeTransaction.module.css'
import styles from './FeeTransactionTable.module.css'
import {
  Avatar,
  Badges,
  BADGES_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  Para,
  Table,
  Tooltip,
} from '@teachmint/krayon'
import classNames from 'classnames'
import {useDispatch, useSelector} from 'react-redux'
import {showToast} from '../../../../../redux/actions/commonAction'
import {
  getAmountFixDecimalWithCurrency,
  getShortTxnId,
  toCamelCasedKeys,
} from '../../../../../utils/Helpers'
import {
  ACTION_CANCEL_TRANSACTION_RECEIPT,
  DELETE_FEE_STRUCTURE_DEPENDANCY_COLS,
  REVOKED,
} from '../../../fees.constants'
import {getStudentDetails, openLinkInNewTab} from '../../../helpers/helpers'
import {
  paymentStatus,
  payStatusKrayonTag,
  payStatusLabel,
} from '../FeeTransactionConstants'
import feeTransactionActionTypes from '../../../redux/feeTransactionActionTypes'
import useInstituteAssignedStudents from '../../../../AttendanceReport/pages/StudentWiseAttendance/hooks/useInstituteAssignedStudents'
import {t} from 'i18next'
import {DateTime} from 'luxon'

export default function FeeTransactionTable({
  transactions = [],
  handleClickEvent = () => {},
  strutureInfo = {},
}) {
  const IS_STRUCTURE_PREVIOUS_SESSION_DUE = strutureInfo.is_previous_due
  const {instituteStudentList} = useSelector((state) => state)
  const downloadTransText = t('download')
  const studentList = useInstituteAssignedStudents()
  const dispatch = useDispatch()

  const handleCopy = (str) => {
    dispatch(showToast({type: 'success', message: t('successfullyCopied')}))
    navigator && navigator.clipboard.writeText(str)
  }

  const checkForDownloadReceipt = (studentId, receipt, isCancelled = false) => {
    handleClickEvent()
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
    if (
      [
        paymentStatus.PENDING,
        paymentStatus.FAILED,
        paymentStatus.REVOKED,
        REVOKED,
      ].includes(receipt?.transactionStatus)
    ) {
      return (
        <div className={styles.downloadDiv}>
          <span>-</span>
        </div>
      )
    } else if (receipt?.transactionStatus === paymentStatus.CANCELLED) {
      const receiptData = {
        studentId: studentId,
        receipt: receipt,
      }
      return (
        <div title={downloadTransText} className={styles.downloadDiv}>
          <span
            className={styles.curserPointer}
            onClick={() =>
              handleOnClickReceipt(
                ACTION_CANCEL_TRANSACTION_RECEIPT,
                receiptData
              )
            }
          >
            <Icon
              name="download"
              type={ICON_CONSTANTS.TYPES.PRIMARY}
              size={ICON_CONSTANTS.SIZES.X_SMALL}
              version={ICON_CONSTANTS.VERSION.OUTLINED}
            />
          </span>
        </div>
      )
    } else {
      return (
        <div title={downloadTransText} className={styles.downloadDiv}>
          <span
            className={styles.curserPointer}
            onClick={() => checkForDownloadReceipt(studentId, receipt)}
          >
            <Icon
              name="download"
              type={ICON_CONSTANTS.TYPES.PRIMARY}
              size={ICON_CONSTANTS.SIZES.X_SMALL}
              version={ICON_CONSTANTS.VERSION.OUTLINED}
            />
          </span>
        </div>
      )
    }
  }

  const rows =
    transactions.length !== 0
      ? transactions?.map((item, i) => {
          let receipt = toCamelCasedKeys(item)
          const feeCatLabel = receipt?.receiptNo
            ? `#${receipt?.receiptNo}`
            : '--'
          const student = IS_STRUCTURE_PREVIOUS_SESSION_DUE
            ? getStudentDetails(instituteStudentList, receipt.studentId)
            : getStudentDetails(studentList, receipt.studentId)
          if (!student) {
            return receipt
          }

          return {
            txnId: receipt?.transactionId ? (
              <div className="cstTxnbl w-max">
                <span
                  className={classNames(transactionStyles.cstTxnId)}
                  data-tip
                  data-for={`${receipt?.transactionId}_${i}`}
                >
                  {`# ${getShortTxnId(receipt?.transactionId, 8)}`}
                </span>
                <img
                  className={classNames(transactionStyles.cstTxnIdCopyIcon)}
                  src="https://storage.googleapis.com/tm-assets/icons/blue/copy-blue.svg"
                  alt="Copy"
                  onClick={() => {
                    handleCopy(receipt?.transactionId)
                  }}
                />
                <Tooltip
                  toolTipId={`${receipt?.transactionId}_${i}`}
                  place="top"
                  type="info"
                  title={receipt?.transactionId}
                  classNames={{title: styles.tooltiptTitleText}}
                />
              </div>
            ) : (
              <span className="tm-para tm-para-14">NA</span>
            ),
            class: student ? student?.sectionName : '-',
            studentDetails: (
              <div className={styles.studentSection}>
                <Avatar
                  name={student.full_name ?? '-'}
                  imgSrc={receipt?.picUrl || ''}
                  variant="variant5"
                  classes={{wrapper: styles.avatarWrapper}}
                />
                <div className={styles.nameAndInfoSection}>
                  <div
                    className={styles.textEllipsis}
                    data-tip
                    data-for={`studentName_${i}`}
                  >
                    {student.full_name ?? '-'}
                  </div>
                  <Tooltip
                    toolTipId={`studentName_${i}`}
                    title={student.full_name ?? '-'}
                    place="top"
                    type="info"
                    classNames={{title: styles.tooltiptTitleText}}
                  />
                  <div className={classNames(transactionStyles.displayData)}>
                    {student?.enrollment_number ||
                      (student?.phone_number && (
                        <div className="teachmint zipy-block">
                          {student?.phone_number}
                        </div>
                      )) ||
                      student?.email}
                  </div>
                </div>
              </div>
            ),
            receiptNo: (
              <div>
                <span
                  className={classNames(transactionStyles.cstTxnId)}
                  data-tip
                  data-for={`txnId_${i}`}
                >
                  {getShortTxnId(feeCatLabel, 8)}
                </span>
                <Tooltip
                  toolTipId={`txnId_${i}`}
                  title={feeCatLabel}
                  place="top"
                  type="info"
                  classNames={{title: styles.tooltiptTitleText}}
                />
              </div>
            ),
            amount: (
              <div>
                <div>{getAmountFixDecimalWithCurrency(receipt?.amount)}</div>
                {receipt?.timestamp && (
                  <div>
                    <Para>
                      {DateTime.fromSeconds(receipt?.timestamp).toFormat(
                        'dd LLL yyyy'
                      )}
                    </Para>
                  </div>
                )}
              </div>
            ),
            mode: (
              <div className={transactionStyles.capitalized}>
                {receipt?.paymentMode?.toLowerCase()}
              </div>
            ),
            status: (
              <Badges
                size={BADGES_CONSTANTS.SIZE.SMALL}
                type={payStatusKrayonTag[receipt?.transactionStatus]}
                inverted
                label={payStatusLabel[receipt?.transactionStatus]}
                showIcon={false}
              />
            ),
            receipt: downloadReceiptOptions(receipt?.studentId, receipt),
          }
        })
      : []

  return (
    <div className={styles.tableSection}>
      <Table rows={rows} cols={DELETE_FEE_STRUCTURE_DEPENDANCY_COLS} />
    </div>
  )
}
