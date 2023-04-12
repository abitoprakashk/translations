import {useDispatch, useSelector} from 'react-redux'
import styles from './Transactions.module.css'
import {
  Avatar,
  Badges,
  Icon,
  Para,
  Tooltip,
  BADGES_CONSTANTS,
  ICON_CONSTANTS,
  PARA_CONSTANTS,
  TOOLTIP_CONSTANTS,
  EmptyState,
  Table,
  AVATAR_CONSTANTS,
} from '@teachmint/krayon'
import {ErrorBoundary} from '@teachmint/common'
import classNames from 'classnames'
import history from '../../../../history'
import {
  feeStatus,
  feeTypeStatus,
  paymentMode,
  paymentStatusSequence,
} from '../../utils/constants'
import {DateTime} from 'luxon'
import {useTranslation} from 'react-i18next'
import {showToast} from '../../../../redux/actions/commonAction'
import {getAmountFixDecimalWithCurrency} from '../../../../utils/Helpers'
import globalActions from '../../../../redux/actions/global.actions'
import {
  getSpecificLeadData,
  openLinkInNewTab,
  updateTransactionList,
} from '../../utils/helpers'
import {getReceiptUrl} from '../../redux/admissionManagement.selectors'
import {events} from '../../../../utils/EventsConstants'
import {useEffect} from 'react'

export default function TransactionTable({
  list,
  leadList,
  searchTerm,
  filterDate,
  filterData,
  instituteClasses,
  setDownloadData,
}) {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const instituteInfo = useSelector((state) => state.instituteInfo)
  const receiptUrl = getReceiptUrl()
  const eventManager = useSelector((state) => state.eventManager)

  const getEventDetail = (transaction) => {
    return {
      screen_name: 'transactions_tab',
      fee_type: transaction.fee_type,
      transaction_id: transaction._id,
      receipt_no: transaction.receipt_no,
    }
  }

  useEffect(() => {
    setDownloadData(getTableRows())
  }, [filterDate, filterData, searchTerm])

  const handleDownloadReceipt = (transaction) => {
    eventManager.send_event(
      events.FEE_RECEIPT_DOWNLOAD_CLICKED_TFI,
      getEventDetail(transaction)
    )
    if (transaction?.receipt_url) {
      openLinkInNewTab(transaction?.receipt_url)
    } else {
      const successAction = (transaction) => {
        openLinkInNewTab(transaction.receipt_url)
        dispatch(
          globalActions.transactionList.success(
            updateTransactionList(list.data, transaction._id, {
              receipt_url: transaction.receipt_url,
            })
          )
        )
      }
      dispatch(
        globalActions.getFeeReceiptUrl.request(transaction._id, successAction)
      )
    }
  }

  const handleRfreshTransaction = (transaction) => {
    eventManager.send_event(
      events.FEE_TRANSACTION_STATUS_REFRESH_CLICKED_TFI,
      getEventDetail(transaction)
    )

    const successAction = (response) => {
      if (transaction.status !== response.status) {
        dispatch(
          globalActions.transactionList.success(
            updateTransactionList(list.data, transaction._id, {
              status: response.status,
            })
          )
        )
      }
    }
    dispatch(
      globalActions.refreshTransactionStatus.request(transaction, successAction)
    )
  }

  if (receiptUrl.isLoading) return <div className="loading"></div>

  const convertDate = (timeStamp) =>
    DateTime.fromSeconds(timeStamp).toFormat('dd LLL, yyyy')

  const getStudentData = (fieldName, leadId) => {
    let studentData = getSpecificLeadData(leadList?.data, leadId)

    if (studentData) {
      if (fieldName === 'name') {
        return {
          name: `${studentData?.profile_data?.name ?? ''} ${
            studentData?.profile_data?.middle_name ?? ''
          } ${studentData?.profile_data?.last_name ?? ''}`,
          mobileNo: studentData?.phone_number,
        }
      } else {
        return instituteClasses.find(
          (classId) => classId.value === studentData?.profile_data?.standard
        )?.label
      }
    } else {
      return <Para children={t('na')} />
    }
  }

  const getStudentDetail = (leadId) => {
    let studentData = getSpecificLeadData(leadList?.data, leadId)
    let details
    if (studentData) {
      let leadName = `${studentData?.profile_data?.name ?? ''} ${
        studentData?.profile_data?.last_name ?? ''
      }`
      details = (
        <div className={styles.detailContainer}>
          <Avatar imgSrc={studentData?.profile_data?.img_url} name={leadName} />
          <div className={styles.detailSubContainer}>
            <div
              className={styles.studentName}
              title={leadName}
              onClick={() => {
                eventManager.send_event(
                  events.ADMISSION_STUDENT_NAME_CLICKED_TFI,
                  {
                    screen_name: 'transactions_tab',
                  }
                )
                history.push(
                  `/institute/dashboard/admission-management/leads/${leadId}`,
                  {
                    tab: t('tabTransactions'),
                    link: history.location.pathname,
                  }
                )
              }}
            >
              {leadName}
            </div>
            <div className={styles.studentPhoneNmber}>
              {`+${studentData?.phone_number ?? ''}`}
            </div>
          </div>
        </div>
      )
    } else {
      details = (
        <div className={styles.detailContainer}>
          <Avatar name="NA" variant={AVATAR_CONSTANTS.VARIANTS[6]} />
          <div className={styles.detailSubContainerDeleted}>
            <Para children={t('deletedUser')} />
          </div>
        </div>
      )
    }
    return details
  }

  const handleCopy = (str) => {
    dispatch(showToast({type: 'success', message: t('successfullyCopied')}))
    navigator && navigator.clipboard.writeText(str)
  }

  const getfeetype = (feeType) => {
    return (
      <div className={styles.badgesStyle}>
        <Badges
          size={BADGES_CONSTANTS.SIZE.SMALL}
          inverted={true}
          type={feeTypeStatus[feeType].type}
          label={feeTypeStatus[feeType].label}
          showIcon={false}
        />
      </div>
    )
  }

  const getfeeStatus = (status) => {
    return (
      <Badges
        size={BADGES_CONSTANTS.SIZE.SMALL}
        type={feeStatus[status].type}
        label={feeStatus[status].label}
        showIcon={false}
      />
    )
  }

  const getAmountData = (transaction) => {
    return (
      <div>
        <span>
          {getAmountFixDecimalWithCurrency(
            transaction?.amount,
            instituteInfo.currency
          )}
        </span>
        <Para className={styles.paymentDate}>
          {convertDate(transaction?.order_timestamp)}
        </Para>
      </div>
    )
  }

  const getFieldHeading = (fieldLabel) => {
    return <Para weight={PARA_CONSTANTS.WEIGHT.MEDIUM}>{fieldLabel}</Para>
  }

  const cols = [
    {
      key: 'transactionId',
      label: getFieldHeading(t('transactionId')),
    },
    {
      key: 'student',
      label: getFieldHeading(t('student')),
    },
    {
      key: 'class',
      label: getFieldHeading(t('class')),
    },
    {
      key: 'amountPaid',
      label: getFieldHeading(t('amountPaid')),
    },
    {
      key: 'feeType',
      label: getFieldHeading(t('tableFieldsFeeType')),
    },
    {
      key: 'paymentMethod',
      label: getFieldHeading(t('paymentMethod')),
    },
    {
      key: 'feeStatus',
      label: getFieldHeading(t('admissionCrmPaymentStatus')),
    },
    {
      key: 'downloadReceipt',
      label: getFieldHeading(t('transactionsActions')),
    },
  ]

  const getTableRows = () => {
    return list?.data
      ?.filter((dateFilter) => {
        return (
          dateFilter?.order_timestamp >= filterDate?.startDate &&
          dateFilter?.order_timestamp <= filterDate?.endDate
        )
      })
      ?.filter((lead) => {
        if (searchTerm) {
          const studentData = getStudentData('name', lead?.lead_id)
          return !studentData
            ? false
            : lead?._id?.includes(searchTerm) ||
                lead?.receipt_no?.toString().includes(searchTerm) ||
                studentData.name
                  .toLowerCase()
                  ?.includes(searchTerm.toLowerCase()) ||
                studentData.mobileNo?.toString().includes(searchTerm)
        }
        return true
      })
      ?.filter((transaction) => {
        if (filterData.classes.length !== 0) {
          return filterData.classes.includes(
            Object.values(leadList?.data).find(
              (lead) => lead._id === transaction.lead_id
            )?.class_id
          )
        }
        return true
      })
      ?.filter((filter) => {
        if (filterData.feeTypes.length !== 0) {
          return filterData.feeTypes.includes(filter.fee_type)
        }
        return true
      })
      ?.filter((filter) => {
        if (filterData.paymentModes.length !== 0) {
          return filterData.paymentModes.includes(filter.payment_mode)
        }
        return true
      })
      ?.filter((filter) => {
        if (filterData.paymentStatus.length !== 0) {
          return filterData.paymentStatus.includes(filter.status)
        }
        return true
      })
  }

  const rows = getTableRows()?.map((transaction) => ({
    transactionId: transaction?._id ? (
      <div className={styles.tooltipStyle}>
        <a
          data-tip
          data-for={transaction?._id}
          className={styles.tooltipEllipsis}
        >
          {`#${transaction?._id}`}
        </a>
        <div
          onClick={() => handleCopy(transaction?._id)}
          className={classNames(styles.cstTxnIdCopyIcon)}
        >
          <Icon
            name="copy2"
            size={ICON_CONSTANTS.SIZES.XX_SMALL}
            type={ICON_CONSTANTS.TYPES.PRIMARY}
            version={ICON_CONSTANTS.VERSION.OUTLINED}
          />
        </div>
        <Tooltip
          toolTipId={transaction?._id}
          toolTipBody={transaction?._id}
          place={TOOLTIP_CONSTANTS.TOOLTIP_POSITIONS.TOP}
          classNames={{toolTipBody: styles.toolTipipBody}}
        />
      </div>
    ) : (
      t('na')
    ),
    student: transaction?.lead_id
      ? getStudentDetail(transaction?.lead_id)
      : t('na'),
    class: transaction?.lead_id
      ? getStudentData('classroomName', transaction?.lead_id)
      : t('na'),
    amountPaid: getAmountData(transaction),
    feeType: getfeetype(transaction?.fee_type) ?? t('na'),
    feeStatus: getfeeStatus(transaction?.status) ?? t('na'),
    paymentMethod: (
      <>
        {transaction?.payment_mode
          ? paymentMode[transaction?.payment_mode]
          : t('na')}
        <Para
          textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
          className={styles.paraMargin}
        >
          {transaction?.receipt_no
            ? t('transactionRecieptNo') + transaction?.receipt_no
            : t('na')}
        </Para>
      </>
    ),
    downloadReceipt:
      transaction?.status === paymentStatusSequence.SUCCESS ? (
        <Icon
          name="download"
          title={t('transactionReceiptDownload')}
          size={ICON_CONSTANTS.SIZES.X_SMALL}
          className={styles.downloadPointer}
          onClick={() => handleDownloadReceipt(transaction)}
        />
      ) : (
        <Icon
          name="refresh1"
          title={t('refreshTransaction')}
          size={ICON_CONSTANTS.SIZES.X_SMALL}
          className={styles.downloadPointer}
          onClick={() => handleRfreshTransaction(transaction)}
        />
      ),
  }))

  return (
    <ErrorBoundary>
      {rows?.length ? (
        <Table cols={cols} rows={rows} />
      ) : (
        <div className={styles.emptystateStyle}>
          <EmptyState content={t('noRecordFound')} button={false} />
        </div>
      )}
    </ErrorBoundary>
  )
}
