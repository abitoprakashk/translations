import React, {useMemo} from 'react'
import {useSelector} from 'react-redux'
import styles from '../DeleteRecieptsModal.module.css'
import {Button, Heading, Para} from '@teachmint/krayon'
import FeeTransactionTable from '../../../../pages/fee/components/FeeTransaction/FeeTransactionTable/FeeTransactionTable'
import CalloutCard from '../../../../pages/fee/components/Fine/components/CalloutCard/CalloutCard'
import {t} from 'i18next'
import {
  DELETE_ALL_RECEIPTS_TRANSACTION_CSV_HEADERS,
  DELETE_ALL_RECEIPTS_TRANSACTION_CSV_MAPPING,
} from '../../../../pages/user-profile/components/Student/studentConstants'
import {DateTime} from 'luxon'
import {
  constructExistingStudentObj,
  JSObjectToCSV,
} from '../../../../utils/Helpers'
import useInstituteAssignedStudents from '../../../../pages/AttendanceReport/pages/StudentWiseAttendance/hooks/useInstituteAssignedStudents'
import {payStatusLabel} from '../../../../pages/fee/components/FeeTransaction/FeeTransactionConstants'
import {createAndDownloadCsvAppendAttr} from '../../../../pages/fee/helpers/helpers'
import {events} from '../../../../utils/EventsConstants'

export default function DeleteReceiptsInfo({
  isCsvDownloadBtn = true,
  summaryInfoText = '',
  summaryInfo = [],
  deleteHeading = '',
  transactions = [],
  strutureInfo = {},
  eventManager = {},
}) {
  const IS_STRUCTURE_PREVIOUS_SESSION_DUE = strutureInfo.is_previous_due
  const {instituteStudentList} = useSelector((state) => state)
  const instituteActiveStudentList = useInstituteAssignedStudents()

  const filteredStudents = useMemo(() => {
    if (IS_STRUCTURE_PREVIOUS_SESSION_DUE) {
      if (instituteStudentList && transactions) {
        let studentIds = transactions?.map((item) => item?.student_id)
        return instituteStudentList.filter((item) =>
          studentIds.includes(item?._id)
        )
      }
    } else {
      if (instituteActiveStudentList && transactions) {
        let studentIds = transactions?.map((item) => item?.student_id)
        return instituteActiveStudentList.filter((item) =>
          studentIds.includes(item?._id)
        )
      }
    }
  }, [instituteStudentList, instituteActiveStudentList, transactions])

  const handleDownloadSampleCsv = ({spot = 'top'}) => {
    eventManager?.send_event(events.DELETE_RECEIPTS_DOWNLOAD_CSV_CLICKED_TFI, {
      struture_id: strutureInfo?._id,
      spot,
      type: strutureInfo?.clickEventType,
    })

    let todaysDate = DateTime.now().toFormat('DD')

    let data = [...transactions].map((transaction) => {
      let student = filteredStudents.find(
        (student) => student?._id === transaction?.student_id
      )

      return {
        student_name: student ? student?.full_name : '-',
        class_section: student ? student?.sectionName : '-',
        enrollment_number: student ? student?.enrollment_number : '-',
        receipt_no: transaction?.receipt_no ?? '-',
        transaction_id: transaction?.transaction_id ?? '-',
        transaction_status:
          payStatusLabel[transaction.transaction_status] ?? '-',
        payment_mode: transaction?.payment_mode?.toLowerCase(),
        amount: transaction?.amount,
      }
    })

    let list = constructExistingStudentObj(
      DELETE_ALL_RECEIPTS_TRANSACTION_CSV_HEADERS,
      DELETE_ALL_RECEIPTS_TRANSACTION_CSV_MAPPING,
      data
    )

    let fileName = `Transactions ${todaysDate}`
    let text = JSObjectToCSV(DELETE_ALL_RECEIPTS_TRANSACTION_CSV_HEADERS, list)
    createAndDownloadCsvAppendAttr({
      fileName,
      text,
      appendAttr: '#DeleteReceiptsInfoDiv',
    })
  }

  const clickEventForDownloadReceipt = () => {
    eventManager?.send_event(events.DOWNLOAD_RECEIPT_CLICKED_TFI, {
      struture_id: strutureInfo?._id,
      screen_name: 'delete_receipts',
      type: strutureInfo?.clickEventType,
    })
  }

  const DownloadCsvButton = ({spot = 'top'}) => {
    return (
      <Button
        onClick={(e) => {
          e.stopPropagation()
          handleDownloadSampleCsv({spot})
        }}
        type="text"
        prefixIcon={'download'}
      >
        {t('downloadFullDataAsCsv')}
      </Button>
    )
  }

  return (
    <div id="DeleteReceiptsInfoDiv">
      {summaryInfoText && (
        <Para className={styles.paymentAlreadyDoneInfo}>{summaryInfoText}</Para>
      )}
      {summaryInfo && (
        <div className={styles.calloutCardSection}>
          {summaryInfo.map((item, idx) => (
            <CalloutCard
              key={`deleteRecieptsModalSummary${idx}`}
              borderClassName={
                item?.borderClassName ? styles[item?.borderClassName] : ''
              }
              type={item?.type ?? null}
            >
              <div className={styles.calloutInfoSection}>
                <div className={styles.calloutHeadingText}>{item?.heading}</div>
                {item?.subText && <Para>{item?.subText}</Para>}
              </div>
            </CalloutCard>
          ))}
        </div>
      )}

      <div className={styles.deleteHeadingAndDownloadCsvSection}>
        <div className={styles.deleteHeadingSec}>
          {deleteHeading && <Heading textSize="xx_s">{deleteHeading}</Heading>}
        </div>
        <div>{isCsvDownloadBtn && <DownloadCsvButton spot={'top'} />}</div>
      </div>

      {transactions && transactions?.length > 0 && (
        <div>
          <FeeTransactionTable
            transactions={transactions.slice(0, 50)}
            handleClickEvent={clickEventForDownloadReceipt}
            strutureInfo={strutureInfo}
          />
        </div>
      )}
      {isCsvDownloadBtn && transactions.length > 50 && (
        <div className={styles.downloadCsvAfterTable}>
          <Para type="text-primary">
            {t('thereAreMoreTransactionsToViewAll')}
          </Para>
          <DownloadCsvButton spot={'bottom'} />{' '}
        </div>
      )}
    </div>
  )
}
