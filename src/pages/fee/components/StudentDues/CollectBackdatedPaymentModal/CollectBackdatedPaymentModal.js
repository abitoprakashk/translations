import React, {useEffect, useMemo, useState} from 'react'
import styles from './CollectBackdatedPaymentModal.module.css'
import {
  Divider,
  Icon,
  IconFrame,
  ICON_CONSTANTS,
  ICON_FRAME_CONSTANTS,
  Modal,
  Para,
} from '@teachmint/krayon'
import {t} from 'i18next'
import {ErrorBoundary} from '@teachmint/common'
import Instruction from './Instruction/Instruction'
import {mapping} from '../../../../../utils/Validations'
import {
  BACKDATED_PAYMENT_CSV_HEADERS,
  collectFeeOptionsEvents,
  CSV_PROCESS_STATUS,
  UPLOAD_BACKDATED_PAYMENT_OPTION_VALUES,
} from '../../../fees.constants'
import {
  constructExistingStudentObj,
  createAndDownloadCSV,
  JSObjectToCSV,
} from '../../../../../utils/Helpers'
import {handleSheetUpload} from '../../../../../utils/fileUtils'
import {useBackdatedPaymentCollection} from '../../../redux/feeTransacationSelectors'
import {useDispatch, useSelector} from 'react-redux'
import feeCollectionActionTypes from '../../../redux/feeCollectionActionTypes'
import classNames from 'classnames'
import ErrorInfo from './ErrorInfo/ErrorInfo'
import {DEFAULT_COLLECT_BACKDATED_PAYMENT_STATES} from '../../../redux/feeCollectionReducer'
import SuccessComp from './SuccessComp/SuccessComp'
// import {useHistory} from 'react-router-dom'
import {events} from '../../../../../utils/EventsConstants'
import {DateTime} from 'luxon'
import {feeCollectBackDatedPaymentTaskRequest} from '../../../redux/feeCollectionActions'
import UploadSection from './UploadSection/UploadSection'
import {
  backDatedCsvErrorData,
  getCsvProgressStatus,
} from '../../../helpers/helpers'
import useInstituteAssignedStudents from '../../../../AttendanceReport/pages/StudentWiseAttendance/hooks/useInstituteAssignedStudents'
import {fetchInstituteFeeTypesAction} from '../../../redux/feeReports/feeReportsAction'

export default function CollectBackdatedPaymentModal({
  isOpen = false,
  handleOpenCloseBackdatedPaymentModal = () => {},
}) {
  const {
    buttonLoader,
    invalidDataStats,
    invalidData,
    successfullyUpdated,
    successUpdateCount,
    isProccessCompleted,
    proccessTaskId,
    collectionModeOnResponse,
  } = useBackdatedPaymentCollection()

  const feeTypeList = useSelector((state) => state.feeReports?.feeTypeList)

  const dispatch = useDispatch()
  // const history = useHistory()

  const {eventManager, instituteInfo} = useSelector((state) => state)
  const instituteActiveStudentList = useInstituteAssignedStudents()
  const [isCsvAdded, setIsCsvAdded] = useState(false)
  const [csvErrors, setCsvErrors] = useState(null)
  const [csvRowsData, setCsvRowsData] = useState(null)
  const [ongoingCsvUploadsCount, setOngoingCsvUploadsCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedMode, setSelectedMode] = useState(
    UPLOAD_BACKDATED_PAYMENT_OPTION_VALUES.LUMPSUM_AMOUNT
  )

  useEffect(() => {
    setIsLoading(true)
    getCsvProgressStatus()
      .then((res) => {
        let runningCount = res?.data?.obj.filter((item) =>
          [CSV_PROCESS_STATUS.RUNNING, CSV_PROCESS_STATUS.CREATED].includes(
            item.status
          )
        ).length
        setIsLoading(false)
        setOngoingCsvUploadsCount(runningCount)
      })
      .catch(() => {
        setIsLoading(false)
      })

    return () => {
      dispatch({
        type: feeCollectionActionTypes.SET_COLLECT_BACKDATED_PAYMENT_STATES,
        payload: {...DEFAULT_COLLECT_BACKDATED_PAYMENT_STATES},
      })
      setOngoingCsvUploadsCount(0)
    }
  }, [])

  useEffect(() => {
    dispatch(fetchInstituteFeeTypesAction())
  }, [instituteInfo._id])

  const feeTypeMap = useMemo(() => {
    return feeTypeList.reduce((map, feeType) => {
      map[feeType.name] = feeType._id
      return map
    }, {})
  }, [feeTypeList])

  useEffect(() => {
    if (invalidDataStats) {
      eventManager.send_event(events.FEE_BACKDATED_FILE_ERROR_TFI, {
        ...invalidDataStats,
        file_type:
          collectionModeOnResponse ===
          UPLOAD_BACKDATED_PAYMENT_OPTION_VALUES.LUMPSUM_AMOUNT
            ? 'lumpsum'
            : 'installment',
      })
    }
  }, [invalidDataStats])

  const getHeadersBasedOnSelectedMode = (selectedMode) => {
    let headers = [...BACKDATED_PAYMENT_CSV_HEADERS]

    if (
      selectedMode === UPLOAD_BACKDATED_PAYMENT_OPTION_VALUES.LUMPSUM_AMOUNT
    ) {
      headers.splice(10, 0, 'Fee Amount*')
    } else {
      headers.splice(10, 0, ...Object.keys(feeTypeMap))
    }

    return headers
  }

  const handleDownloadSampleCsv = (downloadWithError = false) => {
    let headers = getHeadersBasedOnSelectedMode(selectedMode)
    let dataMapping = {...mapping}
    let data = [...instituteActiveStudentList]

    // downlod with error
    let defaultValues = {}
    if (downloadWithError) {
      headers = getHeadersBasedOnSelectedMode(collectionModeOnResponse)
      const newBackDatedCsvErrorData = backDatedCsvErrorData({
        filteredInstituteStudents: instituteActiveStudentList,
        invalidData,
        csvRowsData,
        dataMapping,
        headers,
        extraData: {collectionModeOnResponse, feeTypeMap},
      })

      headers = newBackDatedCsvErrorData.newHeaders
      dataMapping = newBackDatedCsvErrorData.newDataMapping
      data = newBackDatedCsvErrorData.newData
    } else {
      eventManager.send_event(
        events.FEE_BACKDATED_DOWNLOAD_STUDENT_LIST_CLICKED_TFI,
        {
          file_type:
            selectedMode ===
            UPLOAD_BACKDATED_PAYMENT_OPTION_VALUES.LUMPSUM_AMOUNT
              ? 'lumpsum'
              : 'installment',
        }
      )
      defaultValues = {
        'Collection Date*': new Date().toLocaleDateString('en-GB'),
        'Payment Mode*': 'Cash',
      }

      defaultValues['Fee Amount*'] = '0'
      Object.keys(feeTypeMap).forEach((feeType) => {
        defaultValues[feeType] = '0'
      })
    }

    let todaysDate = DateTime.now().toFormat('DD')

    let list = constructExistingStudentObj(
      headers,
      dataMapping,
      data,
      defaultValues
    )

    let title = downloadWithError
      ? `Collect-Backdated-Payment-Error-${selectedMode}`
      : `Collect-Backdated-Payment-Sample-${selectedMode}`

    createAndDownloadCSV(`${title} ${todaysDate}`, JSObjectToCSV(headers, list))
  }

  const formatData = (rows) => {
    var detectedLumpSumTypeUpload = false
    if ('Fee Amount*' in rows[0]) {
      detectedLumpSumTypeUpload = true
    }

    return rows.map((item) => {
      const data = {
        student_id: item['UID'],
        payment_mode: item['Payment Mode*'].trim().toLowerCase(),
        collection_date: item['Collection Date*'].trim(),
        reference_number_for_cheque_and_dd:
          item['Reference Number (if Cheque/DD)'].trim(),
        disbursal_date: item['Disbursal Date (if Cheque/DD)'].trim(),
        additional_notes: item['Transaction Id (Optional)'].trim(),
      }

      if (detectedLumpSumTypeUpload) {
        data.amount = item['Fee Amount*'].replace(/,/g, '')
      } else {
        const amount = {}
        Object.keys(feeTypeMap).forEach((key) => {
          amount[feeTypeMap[key]] = item[key].replace(/,/g, '')
        })
        data.amount = amount
      }

      return data
    })
  }

  const handleValidateCsv = (check, processedCSVObject) => {
    if (!processedCSVObject) {
      setCsvErrors(t('fileTypeNotSupported'))
      return
    }

    // valid headers
    if (processedCSVObject?.headers) {
      const headersToCheck = processedCSVObject?.headers.filter(
        (header) => header !== 'Upload Status'
      )
      let isValid = false

      for (const key in UPLOAD_BACKDATED_PAYMENT_OPTION_VALUES) {
        const headers = getHeadersBasedOnSelectedMode(
          UPLOAD_BACKDATED_PAYMENT_OPTION_VALUES[key]
        )
        const isHeadersValid = headers.every((header) =>
          headersToCheck.includes(header)
        )

        if (isHeadersValid) {
          isValid = true
          break
        }
      }

      if (!isValid) {
        setCsvErrors(t('incorrectFile'))
        return
      }
    }

    let rows = processedCSVObject.rows
    // No. of rows
    if (rows.length === 0) {
      setCsvErrors(t('fileIsEmpty'))
      return
    }

    // Rows structure
    if (!(rows && Array.isArray(rows))) {
      setCsvErrors(t('invalidRowsStructure'))
      return
    }

    setCsvRowsData(rows)
    return
  }

  const handleOnChangeCsv = (obj) => {
    if (csvErrors) setCsvErrors(null)
    if (!obj?.value) {
      eventManager.send_event(events.FEE_BACKDATED_FILE_DELETED_TFI)
      setIsCsvAdded(false)
      return false
    }

    setIsCsvAdded(true)
    return true
  }

  const handleUploadCsv = () => {
    if (!isCsvAdded) {
      setCsvErrors(t('noFileAdded'))
      return
    }

    if (csvErrors) return

    var detectedLumpSumTypeUpload = false
    if (csvRowsData.length > 0 && 'Fee Amount*' in csvRowsData[0]) {
      detectedLumpSumTypeUpload = true
    }

    eventManager.send_event(events.FEE_BACKDATED_UPLOAD_CLICKED_TFI, {
      file_type: detectedLumpSumTypeUpload
        ? collectFeeOptionsEvents.BY_LUMPSUM_AMOUNT
        : collectFeeOptionsEvents.BY_FEE_STRUCTURE,
    })

    dispatch({
      type: feeCollectionActionTypes.COLLECT_BACKDATED_PAYMENT_REQUEST,
      payload: {
        csvRowsData: formatData([...csvRowsData]),
        metaData: {eventManager, setIsCsvAdded},
      },
    })
  }

  const handleGoToTransactionPage = () => {
    handleOpenCloseBackdatedPaymentModal(false)
    // eventManager.send_event(events.TRANSACTIONS_CLICKED_TFI, {
    //   screen_name: 'backdate_collection',
    // })
    // history.push('/institute/dashboard/fee-transactions/bank')
  }

  useEffect(() => {
    let clearIntervalForCsvProgressStatus =
      proccessTaskId && !isProccessCompleted
        ? setInterval(async () => {
            dispatch(
              feeCollectBackDatedPaymentTaskRequest({
                proccessTaskId,
                csvRowsData,
                eventManager,
                clearIntervalForCsvProgressStatus,
              })
            )
          }, 3000)
        : null

    return () => {
      clearInterval(clearIntervalForCsvProgressStatus)
    }
  }, [proccessTaskId, isProccessCompleted])

  const modalButtonRender = () => {
    if (
      successfullyUpdated ||
      (proccessTaskId && !isProccessCompleted) ||
      ongoingCsvUploadsCount > 0
    ) {
      return [
        {
          // body: t('goToTransactions'),
          onClick: handleGoToTransactionPage,
          body: t('close'),
        },
      ]
    } else {
      return [
        {
          body: t('cancel'),
          onClick: () => handleOpenCloseBackdatedPaymentModal(false),
          type: 'outline',
        },
        {
          body: t('upload'),
          onClick: handleUploadCsv,
          isDisabled: feeTypeList.length === 0,
        },
      ]
    }
  }

  const handleSelectMode = (obj) => {
    setSelectedMode(obj)
  }

  return (
    <ErrorBoundary>
      <Modal
        isOpen={isOpen}
        actionButtons={modalButtonRender()}
        footer={
          buttonLoader && (
            <>
              <Divider spacing="20px" thickness="1px" />
              <div className={styles.footerSection}>
                <div
                  className={classNames('loading', styles.positionAbsolute)}
                ></div>
              </div>
            </>
          )
        }
        header={t('uploadBackdatedPayment')}
        onClose={() => handleOpenCloseBackdatedPaymentModal(false)}
        size="m"
      >
        <div className={styles.section}>
          {isLoading && <div className="loading"></div>}
          {!isLoading &&
            ((proccessTaskId && !isProccessCompleted) ||
              ongoingCsvUploadsCount > 0) && (
              <div className={styles.proccessingSection}>
                <IconFrame type={ICON_FRAME_CONSTANTS.TYPES.WARNING}>
                  <Icon
                    name="checkCircle"
                    type={ICON_CONSTANTS.TYPES.INVERTED}
                  />
                </IconFrame>

                <Para className={styles.fileUploadedMsgPara}>
                  <div>{t('fileIsBeingUploaded')}.</div>
                  <div>{t('closeAndCheckTransactionMsg')}</div>
                </Para>
              </div>
            )}

          {!isLoading && successfullyUpdated && (
            <ErrorBoundary>
              <SuccessComp rowCount={successUpdateCount} />
            </ErrorBoundary>
          )}

          {!isLoading &&
            !proccessTaskId &&
            !successfullyUpdated &&
            ongoingCsvUploadsCount === 0 && (
              <>
                <UploadSection
                  invalidData={invalidData}
                  buttonLoader={buttonLoader}
                  csvErrors={csvErrors}
                  selectedMode={selectedMode}
                  eventManager={eventManager}
                  feeTypeList={feeTypeList}
                  handleDownloadSampleCsv={handleDownloadSampleCsv}
                  handleOnChangeCsv={handleOnChangeCsv}
                  handleSheetUpload={handleSheetUpload}
                  handleValidateCsv={handleValidateCsv}
                  handleSelectMode={handleSelectMode}
                />
                <Divider
                  isVertical
                  length="100"
                  spacing="19px"
                  thickness="1px"
                />
                <div
                  className={classNames(
                    styles.flexGrow1,
                    styles.scroll,
                    'show-scrollbar show-scrollbar-big'
                  )}
                >
                  {invalidDataStats &&
                  Object.keys(invalidDataStats).length > 0 ? (
                    <ErrorBoundary>
                      <ErrorInfo
                        invalidDataStats={invalidDataStats}
                        successUpdateCount={successUpdateCount}
                      />
                    </ErrorBoundary>
                  ) : (
                    <ErrorBoundary>
                      <Instruction selectedMode={selectedMode} />
                    </ErrorBoundary>
                  )}
                </div>
              </>
            )}
        </div>
      </Modal>
    </ErrorBoundary>
  )
}
