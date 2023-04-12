import {useTranslation} from 'react-i18next'
import {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import styles from './bulkUpload.module.css'
import classNames from 'classnames'
import {
  createAndDownloadCSV,
  JSObjectToCSV,
} from '../../../../../../../utils/Helpers'
import {
  Modal,
  MODAL_CONSTANTS,
  Divider,
  Heading,
  Alert,
  HEADING_CONSTANTS,
} from '@teachmint/krayon'
import globalActions from '../../../../../../../redux/actions/global.actions'
import InstructionsForUserMapping from '../instructionsForBulkUpload/InstructionsForUserMapping'
import CSVUpload from '../csvUploadComponent/csvUpload'
import {alphaNumericRegex} from '../../../../../../../utils/Validations'
import {events} from '../../../../../../../utils/EventsConstants'

export default function BiometricUserMappingBulkUploadModal({
  showModal,
  setShowModal,
  allData,
}) {
  const onModalClose = () => {
    setShowModal(false)
  }
  const {eventManager} = useSelector((state) => state)
  const [csvErrors, setCsvErrors] = useState(false)
  // const [processedCSVObject, setProcessedCSVObject] = useState(null)
  const [csvRowsData, setCsvRowsData] = useState(null)
  const dispatch = useDispatch()

  const MAP_USER_DATA_HEADERS = [
    'UID',
    'Name',
    'Phone Number/ Email ID',
    'Role',
    'User ID',
  ]

  const {t} = useTranslation()

  const handleFormSubmit = () => {
    let list = []
    csvRowsData?.forEach((row) => {
      if (row['User ID']) {
        let newData = {}
        newData['iid'] = row['UID']
        newData['user_id'] = row['User ID']
        list.push(newData)
      }
    })
    let payload = {
      user_data: list,
    }
    dispatch(globalActions?.updateBiometricUsers?.request(payload))
    eventManager.send_event(
      events.HRMS_USER_MAPPING_BULK_CSV_UPLOAD_UPDATE_CLICKED_TFI
    )
    setShowModal(false)
  }

  const onUpload = (processedCSVObject) => {
    let csvValidationError = false
    eventManager.send_event(events.HRMS_USER_MAPPING_BULK_CSV_UPLOADED_TFI)

    let downloadedCSVData = []

    allData?.forEach((row) => {
      let newData = {}
      newData['UID'] = row?.imember_id
      newData['Name'] = row?.name
      newData['Phone Number/ Email ID'] =
        row?.phone_number || row?.email_id || 'NA'
      newData['Role'] = row?.role
      newData['User ID'] = row?.user_id !== '-' ? row?.user_id : ''
      downloadedCSVData.push(newData)
    })

    if (!processedCSVObject) {
      setCsvErrors(t('fileTypeNotSupported'))
    }
    // valid headers
    if (processedCSVObject?.headers) {
      let headers = [...MAP_USER_DATA_HEADERS]

      let isValidHeaders = headers.every((header) => {
        return processedCSVObject.headers.includes(header)
      })

      if (!isValidHeaders) {
        setCsvErrors(t('incorrectFile'))
      }
    }

    let rows = processedCSVObject.rows

    // No. of rows
    if (rows.length === 0) {
      setCsvErrors(t('fileIsEmpty'))
    }

    if (rows?.every((item) => item?.['User ID'] == '')) {
      setCsvErrors(t('biometricUsersBulkUploadNoData'))
    }

    // Rows structure
    if (!(rows && Array.isArray(rows))) {
      setCsvErrors(t('invalidRowsStructure'))
    }

    let headers = [...MAP_USER_DATA_HEADERS]

    let tempData = []
    const elementCounts = {}
    processedCSVObject.rows?.forEach((element) => {
      if (element['User ID']) {
        elementCounts[element['User ID']] =
          (elementCounts[element['User ID']] || 0) + 1
      }
    })

    if (processedCSVObject) {
      for (let i = 0; i < processedCSVObject.rows.length; i++) {
        let newData = {...processedCSVObject.rows[i]}
        newData['Issue'] = ''

        for (let j = 0; j < headers.length; j++) {
          if (
            processedCSVObject.rows[i][headers[j]]?.trim() !==
              downloadedCSVData[i][headers[j]]?.trim() &&
            headers[j] !== 'User ID'
          ) {
            setCsvErrors(t('biometricBulkUploadTamperedLeftHandSide'))
            csvValidationError = true
            newData['Issue'] = 'Tampered with pre-filled data'
          }
        }
        // Duplicate User ID
        if (
          processedCSVObject.rows[i]['User ID'] &&
          elementCounts[processedCSVObject.rows[i]['User ID']] > 1 &&
          !newData['Issue']
        ) {
          csvValidationError = true
          setCsvErrors(t('biometricBulkUploadDuplicateUserID'))
          newData['Issue'] = 'Duplicate User ID'
        }

        // User ID should be alphanumeric

        if (!alphaNumericRegex(processedCSVObject.rows[i]['User ID'])) {
          newData['Issue'] = t('onlyAlphabetsNumbersAllowed')
        }
        tempData.push(newData)
      }
    }

    headers.push('Issue')

    if (csvValidationError) {
      createAndDownloadCSV(
        'Biometric-User-Mapping-Error',
        JSObjectToCSV(headers, tempData)
      )
    } else {
      setCsvRowsData(processedCSVObject.rows)
    }
  }

  useEffect(() => {
    setCsvErrors('')
  }, [showModal])

  const onRemove = () => {
    eventManager.send_event(
      events.HRMS_USER_MAPPING_BULK_CSV_UPLOADED_REMOVE_CLICKED_TFI
    )
    setCsvErrors('')
    setCsvRowsData(null)
  }

  const handleDownloadSampleCsv = () => {
    let headers = [...MAP_USER_DATA_HEADERS]

    let downloadedCSVData = []

    allData?.forEach((row) => {
      let newData = {}
      newData['UID'] = row?.imember_id
      newData['Name'] = row?.name
      newData['Phone Number/ Email ID'] =
        row?.phone_number || row?.email_id || 'NA'
      newData['Role'] = row?.role
      newData['User ID'] = row?.user_id !== '-' ? row?.user_id : ''
      downloadedCSVData.push(newData)
    })

    let title = 'Biometric-User-Mapping-List'
    createAndDownloadCSV(`${title}`, JSObjectToCSV(headers, downloadedCSVData))
  }

  return (
    <Modal
      header={t('bulkUploadUsers')}
      classes={{modal: styles.modal, header: styles.modalHeader}}
      isOpen={showModal}
      onClose={onModalClose}
      actionButtons={[
        {
          onClick: handleFormSubmit,
          body: t('confirm'),
          isDisabled: csvErrors || !csvRowsData?.length,
        },
      ]}
      size={MODAL_CONSTANTS.SIZE.LARGE}
      shouldCloseOnOverlayClick={false}
    >
      <div className={classNames(styles.formWrapper, styles.wrapper)}>
        <div className={styles.csvCardsWrapper}>
          {csvErrors && (
            <Alert
              content={csvErrors}
              type={'error'}
              className={styles.fullWidth}
              hideClose
            />
          )}

          <CSVUpload onUpload={onUpload} onRemove={onRemove} />
          <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
            <span>{t('biometricDownloadEmployeeListCsvFile')}</span>
            <span
              onClick={() => {
                handleDownloadSampleCsv()
                eventManager.send_event(
                  events.HRMS_USER_MAPPING_BULK_UPLOAD_SAMPLE_CSV_DOWNLOAD_CLICKED_TFI
                )
              }}
              className={styles.clickHereSpan}
            >
              {t('csvFile')}
            </span>
          </Heading>
        </div>
        <div className={styles.downloadCSVWrapper}>
          <Divider length="100" spacing="10px" thickness="1px" />
          <InstructionsForUserMapping />
        </div>
      </div>
    </Modal>
  )
}
