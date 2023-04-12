import {ErrorBoundary} from '@teachmint/common'
import {
  Alert,
  ALERT_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  Para,
} from '@teachmint/krayon'
import classNames from 'classnames'
import {t} from 'i18next'
import {DateTime} from 'luxon'
import React, {useEffect, useMemo} from 'react'
import {Trans} from 'react-i18next'
import {useDispatch} from 'react-redux'
import {showErrorToast} from '../../../../redux/actions/commonAction'
import {
  constructExistingStudentObj,
  createAndDownloadCSV,
  JSObjectToCSV,
} from '../../../../utils/Helpers'
import {mapping} from '../../../../utils/Validations'
import useInstituteAssignedStudents from '../../../AttendanceReport/pages/StudentWiseAttendance/hooks/useInstituteAssignedStudents'
import {
  BACKDATED_PAYMENT_CSV_ERROR_HEADERS,
  BACKDATED_PAYMENT_CSV_ERROR_STATUS,
  BACKDATED_PAYMENT_CSV_ERROR_STATUS_IDS,
  BACKDATED_PAYMENT_CSV_HEADERS,
  CSV_PROCESS_STATUS,
  FILE_UPLOAD_ERROR_STATS_IDS,
  UPLOAD_BACKDATED_PAYMENT_OPTION_VALUES,
} from '../../fees.constants'
import {findInstituteStudent} from '../../helpers/helpers'
import {feeCollectBackDatedPaymentTaskAcknowledgeRequest} from '../../redux/feeCollectionActions'
import {fetchFeeCategoriesRequestedAction} from '../../redux/feeStructure/feeStructureActions'
import {useFeeStructure} from '../../redux/feeStructure/feeStructureSelectors'
import styles from './CsvUploadAlerts.module.css'

export default function CsvUploadAlerts({
  ongoingCsvUploads = [],
  setOngoingCsvUploads = () => {},
}) {
  // this constant used only in this file
  const ACKNOWLEDGE_TYPES = {
    acknowledged: 'acknowledged',
    perceived: 'perceived',
  }

  const dispatch = useDispatch()
  const instituteActiveStudentList = useInstituteAssignedStudents()
  const {feeTypes} = useFeeStructure()

  useEffect(() => {
    if (feeTypes?.length === 0) {
      dispatch(fetchFeeCategoriesRequestedAction())
    }
  }, [feeTypes])

  const feeTypesToFeeNameDictionary = useMemo(() => {
    if (feeTypes.length !== 0) {
      return feeTypes?.reduce((acc, curr) => {
        return {...acc, [curr._id]: curr.name}
      }, {})
    }
  }, [feeTypes])

  const handleAlertTypeChange = (taskId) => {
    let newTasks = ongoingCsvUploads.map((item) => {
      if (taskId === item._id) {
        return {...item, [ACKNOWLEDGE_TYPES.perceived]: true}
      } else {
        return item
      }
    })
    setOngoingCsvUploads(newTasks)
  }

  const handleTaskAcknowledge = ({type, taskId}) => {
    dispatch(
      feeCollectBackDatedPaymentTaskAcknowledgeRequest({
        _id: taskId,
        [type]: true,
      })
    )

    // remove from list if user clicked on cross (X) button
    if (type === ACKNOWLEDGE_TYPES.acknowledged) {
      setOngoingCsvUploads(
        ongoingCsvUploads.filter((item) => item._id !== taskId)
      )
    }
  }

  const handleDownloadErrorCsv = (taskId) => {
    let todaysDate = DateTime.now().toFormat('DD')

    let findInvalidData = ongoingCsvUploads.find((item) => item._id === taskId)

    if (!findInvalidData) return
    let invalidData = findInvalidData?.result?.data

    let headers = [
      ...BACKDATED_PAYMENT_CSV_HEADERS,
      ...BACKDATED_PAYMENT_CSV_ERROR_HEADERS,
    ]

    if (
      findInvalidData?.result?.collection_mode ===
      UPLOAD_BACKDATED_PAYMENT_OPTION_VALUES.LUMPSUM_AMOUNT
    ) {
      headers.splice(10, 0, 'Fee Amount*')
    } else if (
      findInvalidData?.result?.collection_mode ===
      UPLOAD_BACKDATED_PAYMENT_OPTION_VALUES.INSTALLMENT_WISE
    ) {
      let fee_type_headers = []
      Object.keys(invalidData[0].amount).forEach((master_category_id) =>
        fee_type_headers.push(feeTypesToFeeNameDictionary[master_category_id])
      )

      headers.splice(10, 0, ...fee_type_headers)
    }

    let dataMapping = {
      ...mapping,
      'Payment Mode*': 'payment_mode',
      'Collection Date*': 'collection_date',
      'Reference Number (if Cheque/DD)': 'reference_number_for_cheque_and_dd',
      'Disbursal Date (if Cheque/DD)': 'disbursal_date',
      'Transaction Id (Optional)': 'additional_notes',
      'Upload Status': 'status',
    }
    if (
      findInvalidData?.result?.collection_mode ===
      UPLOAD_BACKDATED_PAYMENT_OPTION_VALUES.LUMPSUM_AMOUNT
    ) {
      dataMapping = {...dataMapping, 'Fee Amount*': 'fee_amount'}
    } else if (
      findInvalidData?.result?.collection_mode ===
      UPLOAD_BACKDATED_PAYMENT_OPTION_VALUES.INSTALLMENT_WISE
    ) {
      Object.keys(invalidData[0].amount).forEach((master_category_id) => {
        dataMapping = {
          ...dataMapping,
          [feeTypesToFeeNameDictionary[master_category_id]]: master_category_id,
        }
      })
    }

    try {
      let data = invalidData
        .filter(
          (item) =>
            item.status !== FILE_UPLOAD_ERROR_STATS_IDS.OK || item.status === ''
        )
        .map((item) => {
          let findStudent = findInstituteStudent(
            instituteActiveStudentList,
            item
          )

          let statusText = ''
          if (item?.status) {
            statusText =
              item?.status ===
              BACKDATED_PAYMENT_CSV_ERROR_STATUS_IDS.AMOUNT_GREATER_THAN_DUE
                ? `${
                    BACKDATED_PAYMENT_CSV_ERROR_STATUS[item?.status]
                  } (${item?.due_applicable?.toFixed(2)})`
                : BACKDATED_PAYMENT_CSV_ERROR_STATUS[item?.status]
          }

          let obj = {
            ...findStudent,
            _id: item?.student_id,
            status: statusText,
            payment_mode: item?.payment_mode,
            collection_date: item?.collection_date,
            reference_number_for_cheque_and_dd:
              item?.reference_number_for_cheque_and_dd,
            disbursal_date: item?.disbursal_date,
            additional_notes: item?.additional_notes,
          }

          if (
            findInvalidData?.result?.collection_mode ===
            UPLOAD_BACKDATED_PAYMENT_OPTION_VALUES.LUMPSUM_AMOUNT
          ) {
            obj = {...obj, fee_amount: item?.amount ?? ''}
          } else if (
            findInvalidData?.result?.collection_mode ===
            UPLOAD_BACKDATED_PAYMENT_OPTION_VALUES.INSTALLMENT_WISE
          ) {
            Object.keys(invalidData[0].amount).forEach((master_category_id) => {
              obj = {
                ...obj,
                [master_category_id]: item?.amount[master_category_id] ?? '',
              }
            })
          }

          return obj
        })

      let list = constructExistingStudentObj(headers, dataMapping, data)
      let title = 'Collect-Backdated-Payment-Error'
      createAndDownloadCSV(
        `${title} ${todaysDate}`,
        JSObjectToCSV(headers, list)
      )
      handleTaskAcknowledge({type: ACKNOWLEDGE_TYPES.perceived, taskId})
      handleAlertTypeChange(taskId)
    } catch (error) {
      dispatch(showErrorToast(t('ongoingTaskCsvDownloadErrorMsg')))
    }
  }

  const newData = useMemo(
    () =>
      ongoingCsvUploads
        .filter((csvData) =>
          [
            CSV_PROCESS_STATUS.RUNNING,
            CSV_PROCESS_STATUS.CREATED,
            CSV_PROCESS_STATUS.COMPLETED,
            CSV_PROCESS_STATUS.FAILED,
          ].includes(csvData?.status)
        )
        .sort((a, b) => (a?.c < b?.c ? 1 : a?.c > b?.c ? -1 : 0))
        .map((csvData) => {
          let successCount = 0
          let failedCount = 0
          let contentText = t('backdatedPaymentRunningMsg')
          let alertType = ALERT_CONSTANTS.TYPE.ERROR
          let iconName = 'error'

          let data = csvData?.result?.data

          if (
            [CSV_PROCESS_STATUS.RUNNING, CSV_PROCESS_STATUS.CREATED].includes(
              csvData?.status
            )
          ) {
            alertType = ALERT_CONSTANTS.TYPE.WARNING
            iconName = 'sync'
          } else if (csvData?.status === CSV_PROCESS_STATUS.FAILED) {
            alertType = ALERT_CONSTANTS.TYPE.ERROR
            iconName = 'error'
            contentText = t('csvOngoingFailedMsg')
          } else if (csvData?.status === CSV_PROCESS_STATUS.COMPLETED) {
            successCount = data.filter(
              (resultData) =>
                resultData?.status === FILE_UPLOAD_ERROR_STATS_IDS.OK &&
                resultData.amount !== 0
            ).length
            failedCount = data.filter(
              (resultData) =>
                resultData?.status !== FILE_UPLOAD_ERROR_STATS_IDS.OK
            ).length

            if (csvData?.perceived) {
              alertType = ALERT_CONSTANTS.TYPE.INFO
              iconName = 'error'
              contentText = t('perceivedCsvMsg')
            } else {
              if (failedCount > 0) {
                alertType = ALERT_CONSTANTS.TYPE.ERROR
                iconName = 'error'
                contentText = (
                  <Trans i18nKey={'unsuccessfullCountErrorMsg'}>
                    {{unsuccessfullCount: failedCount}} errors found while
                    updating backdated payment through CSV file
                  </Trans>
                )
              } else {
                alertType = ALERT_CONSTANTS.TYPE.SUCCESS
                iconName = 'checkCircle'
                contentText = (
                  <Trans i18nKey={'successfullCountMsg'}>
                    {{successfullCount: successCount}} backdated payment rows
                    successfully updated through CSV file
                  </Trans>
                )
              }
            }
          }

          return {
            ...csvData,
            successCount,
            failedCount,
            contentText,
            alertType,
            iconName,
            date: ` ${DateTime.fromSeconds(csvData?.c).toFormat(
              `hh:mm a, dd LLL yyyy`
            )}`,
          }
        }),
    [ongoingCsvUploads]
  )

  useEffect(() => {
    return () => {
      setOngoingCsvUploads([])
    }
  }, [])

  return (
    <ErrorBoundary>
      <div className={classNames(styles.alertSection)}>
        {newData.map(
          ({
            _id,
            failedCount,
            iconName,
            alertType,
            contentText,
            date,
            status,
          }) => {
            return (
              <div key={_id}>
                <ErrorBoundary>
                  <Alert
                    hideIcon
                    content={
                      <div className={styles.width100}>
                        <div className={styles.spaceBetween}>
                          <div className={styles.iconAndTextSection}>
                            <Icon
                              version={ICON_CONSTANTS.VERSION.FILLED}
                              size={ICON_CONSTANTS.SIZES.XX_SMALL}
                              name={iconName}
                              type={
                                alertType === ALERT_CONSTANTS.TYPE.INFO
                                  ? ICON_CONSTANTS.TYPES.PRIMARY
                                  : alertType
                              }
                            />
                            <span>
                              {contentText}
                              {status !== CSV_PROCESS_STATUS.FAILED &&
                                failedCount > 0 &&
                                ![
                                  ALERT_CONSTANTS.TYPE.WARNING,
                                  ALERT_CONSTANTS.TYPE.INFO,
                                ].includes(alertType) && (
                                  <span
                                    className={styles.errorLink}
                                    onClick={() => handleDownloadErrorCsv(_id)}
                                  >
                                    {t('downloadErrorFile')}
                                  </span>
                                )}
                            </span>
                          </div>
                          {![ALERT_CONSTANTS.TYPE.WARNING].includes(
                            alertType
                          ) && (
                            <div
                              className={styles.close}
                              onClick={() =>
                                handleTaskAcknowledge({
                                  type: ACKNOWLEDGE_TYPES.acknowledged,
                                  taskId: _id,
                                })
                              }
                            >
                              <Icon
                                name="close"
                                version={ICON_CONSTANTS.VERSION.OUTLINED}
                                size={ICON_CONSTANTS.SIZES.XX_SMALL}
                                type={ICON_CONSTANTS.TYPES.SECONDARY}
                              />
                            </div>
                          )}
                        </div>
                        <div>
                          <Para className={styles.createdDate}>
                            {t('uploadedAt')} {date}
                          </Para>
                        </div>
                      </div>
                    }
                    className={styles.alertWidth}
                    type={alertType}
                    hideClose
                  />
                </ErrorBoundary>
              </div>
            )
          }
        )}
      </div>
    </ErrorBoundary>
  )
}
