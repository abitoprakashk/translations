import React, {useEffect, useState} from 'react'
import styles from './ImportPreviousSessionDuesModal.module.css'
import classNames from 'classnames'
import {useDispatch, useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {Modal, MODAL_CONSTANTS, BUTTON_CONSTANTS} from '@teachmint/krayon'
import {IMPORT_CSV_MODAL_HEADER_TEXT} from '../../PreviousSessionDues.constants'
import {JSObjectToCSV} from '../../../../../../../utils/Helpers'
import {createAndDownloadCsvAppendAttr} from '../../../../../helpers/helpers'
import {useFeeStructure} from '../../../../../redux/feeStructure/feeStructureSelectors'
import {utilsGetUsersListDetailed} from '../../../../../../../routes/dashboard'
import {
  validateStudentDuesCSV,
  formatStudentsList,
} from '../../../../FeeStructure/StructureSlider/PreviousSessionDues/PreviousSessionDuesSliderValidation'
import feeStructureActionTypes from '../../../../../redux/feeStructure/feeStructureActionTypes'
import {
  showToast,
  showErrorToast,
} from '../../../../../../../redux/actions/commonAction'
import {events} from '../../../../../../../utils/EventsConstants'
import InstructionWrapper from './components/InstructionWrapper'
import UploadCSVSection from './components/UploadCSVSection'
import ReceiptPrefixSettings from './components/ReceiptPrefixSettings'

export default function ImportPreviousSessionDuesModalCSV({
  setIsImportModalCSVOpen,
  structure,
  modalType,
  checkForReceiptPrefix,
}) {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const {
    eventManager,
    instituteActiveAcademicSessionId,
    instituteAcademicSessionInfo,
  } = useSelector((state) => state)
  const {feeTypes, importedSessionDueData, previousYearDuesLoading} =
    useFeeStructure()
  const [importResponse, setImportResponse] = useState({})
  const [uploadedCSVData, setUploadedCSVData] = useState({})
  const currentSession = instituteAcademicSessionInfo.find(
    (session) => session._id == instituteActiveAcademicSessionId
  )
  const [formFields, setFormFields] = useState({
    due_date: currentSession.start_time / 1000,
    is_previous_due: true,
    applicable_students: 'NONE',
    fee_type: 'CUSTOM',
    receipt_prefix: structure?.receipt_prefix || '',
    series_starting_number: structure?.series_starting_number || '',
    _id: modalType == 'update' ? structure?._id : null,
    fee_categories: [],
    fee_types: [],
  })
  // if we're updating via CSV then prepare previously used fee types array
  const [usedFeeTypesInCurrentStructure] = useState([])
  if (structure._id) {
    Object.keys(importedSessionDueData)?.map((record) => {
      importedSessionDueData[record].map((category) => {
        usedFeeTypesInCurrentStructure.includes(category.master_id)
          ? null
          : usedFeeTypesInCurrentStructure.push(category.master_id)
      })
    })
  }

  useEffect(() => {
    setFormFields((formFields) => ({
      ...formFields,
      fee_types: usedFeeTypesInCurrentStructure,
    }))
  }, [usedFeeTypesInCurrentStructure])

  useEffect(() => {
    if (modalType == 'update') {
      dispatch({
        type: feeStructureActionTypes.FETCH_IMPORTED_SESSION_DUE_DATA,
        payload: {structure_id: structure?._id},
      })
    }
  }, [])

  const handleImportAction = () => {
    eventManager.send_event(
      events.FEE_PREVIOUS_SESSION_DUES_CSV_UPLOAD_SELECTED_TFI,
      {
        action: 'import',
        receipt_prefix: formFields.receipt_prefix,
        receipt_starting_no: formFields.receipt_starting_no,
        due_date: formFields.due_date,
      }
    )
    formFields.schedule_timestamps = [parseInt(formFields.due_date)]
    dispatch({
      type: feeStructureActionTypes.PREVIOUS_YEAR_DUES_REQUESTED,
      payload: formFields,
      onSuccess: onSuccess,
      updateResponse: updateResponse,
    })
  }

  const onSuccess = () => {
    eventManager.send_event(events.FEE_PREVIOUS_SESSION_DUES_CSV_UPLOADED_TFI)
  }

  const updateResponse = (response) => {
    if (
      response['students_not_found']?.length +
        response['negative_due_students']?.length ==
      0
    )
      setIsImportModalCSVOpen(modalType == 'update' ? true : false)

    setImportResponse({
      ...response,
      ...{
        successCount:
          [...new Set(formFields.fee_categories.map((item) => item.student_id))]
            .length -
          (response['students_not_found']?.length || 0) -
          (response['negative_due_students']?.length || 0),
        notFoundCount: response['students_not_found']?.length || 0,
        negativeDueCount: response['negative_due_students']?.length || 0,
      },
    })
  }

  const formatSheetData = (check, processedCSVObject) => {
    // save uploaded CSV data for future use
    setUploadedCSVData(processedCSVObject)

    if (!processedCSVObject) {
      eventManager.send_event(events.FEE_PREVIOUS_SESSION_DUES_FILE_ERROR_TFI)
      dispatch(showToast({type: 'error', message: t('fileTypeNotSupported')}))
      return
    }
    eventManager.send_event(events.FEE_PREVIOUS_SESSION_DUES_FILE_UPLOADED_TFI)

    const csvFeeCategories = processedCSVObject.headers.slice(
      processedCSVObject.headers.indexOf('Email') + 1
    )
    let validationObject = validateStudentDuesCSV(
      processedCSVObject,
      feeTypes,
      csvFeeCategories,
      t
    )
    if (!validationObject.status) {
      dispatch(showErrorToast(validationObject.msg))
      setUploadedCSVData({})
      return
    }

    let feeCategories = []
    let selectedCategories = {}
    feeTypes.forEach((type) => {
      selectedCategories[type.name] = type._id
    })
    processedCSVObject.rows.forEach((row) => {
      csvFeeCategories.forEach((type) => {
        feeCategories.push({
          student_id: row['UID*'],
          master_id: selectedCategories[type],
          name: type,
          amount: row[type] ? parseFloat(row[type]) : 0,
          is_delete: false,
        })
      })
    })
    setFormFields({
      ...formFields,
      fee_categories: feeCategories,
    })
  }

  const downloadExistingStudentCSV = () => {
    eventManager.send_event(
      events.FEE_PREVIOUS_SESSION_DUES_DOWNLOAD_STUDENT_LIST_CLICKED_TFI
    )
    utilsGetUsersListDetailed().then(({status, obj}) => {
      if (status) {
        const {header, list} = formatStudentsList(
          [...obj],
          feeTypes,
          formFields,
          importedSessionDueData
        )
        createAndDownloadCsvAppendAttr({
          fileName: 'Previous-Year-Dues',
          text: JSObjectToCSV(header, list),
        })
      }
    })
  }

  const prepareErrorCSV = () => {
    const errorCSVHeaders = uploadedCSVData.headers
    const errorCSVRows = uploadedCSVData.rows
    errorCSVRows.map((row) => {
      row['error'] = ''
      if (importResponse['negative_due_students'].includes(row['UID*']))
        row['error'] = t('negativeDueError')
      if (importResponse['students_not_found'].includes(row['UID*']))
        row['error'] = t('notFoundError')
      return row
    })
    createAndDownloadCsvAppendAttr({
      fileName: 'Previous-Year-Dues-Errors',
      text: JSObjectToCSV([...errorCSVHeaders, 'Error'], errorCSVRows),
    })
  }

  const actionButtons = [
    {
      body: t('cancelButton'),
      onClick: () => {
        eventManager.send_event(
          events.FEE_PREVIOUS_SESSION_DUES_CSV_UPLOAD_SELECTED_TFI,
          {
            action: 'cancel',
            receipt_prefix: formFields.receipt_prefix,
            receipt_starting_no: formFields.receipt_starting_no,
            due_date: formFields.due_date,
          }
        )
        setIsImportModalCSVOpen(false)
      },
      type: BUTTON_CONSTANTS.TYPE.OUTLINE,
      width: BUTTON_CONSTANTS.WIDTH.FIT,
    },
    {
      body: (
        <div className={styles.buttonLoadingSection}>
          {previousYearDuesLoading && (
            <div className={classNames('loading', styles.buttonLoading)}></div>
          )}
          {modalType == 'update' ? t('upload') : t('importButton')}
        </div>
      ),
      onClick: () => handleImportAction(),
      width: BUTTON_CONSTANTS.WIDTH.FIT,
      isDisabled:
        formFields.receipt_prefix &&
        Object.keys(uploadedCSVData).length > 0 &&
        formFields.series_starting_number &&
        formFields.fee_types?.length > 0
          ? false
          : true,
    },
  ]

  const handleOnModalClose = () => {
    eventManager.send_event(
      events.FEE_PREVIOUS_SESSION_DUES_CSV_UPLOAD_SELECTED_TFI,
      {
        action: 'cancel',
        receipt_prefix: formFields.receipt_prefix,
        receipt_starting_no: formFields.receipt_starting_no,
        due_date: formFields.due_date,
      }
    )
    setIsImportModalCSVOpen(false)
  }

  return (
    <>
      <Modal
        isOpen={true}
        actionButtons={actionButtons}
        header={t(IMPORT_CSV_MODAL_HEADER_TEXT[modalType])}
        classes={{
          modal: styles.modal,
          content: classNames('show-scrollbar show-scrollbar-big'),
        }}
        onClose={() => handleOnModalClose()}
        size={MODAL_CONSTANTS.SIZE.LARGE}
      >
        <div className={styles.wrapper}>
          <div className={styles.inputGroup}>
            <UploadCSVSection
              formFields={formFields}
              setFormFields={setFormFields}
              downloadExistingStudentCSV={downloadExistingStudentCSV}
              formatSheetData={formatSheetData}
              setUploadedCSVData={setUploadedCSVData}
            />
            <div className={styles.verticalDivider}></div>
            <InstructionWrapper
              importResponse={importResponse}
              prepareErrorCSV={prepareErrorCSV}
            />
          </div>
          {modalType == 'import' && (
            <div className={styles.horizontalDivider}></div>
          )}
          {modalType == 'import' && (
            <ReceiptPrefixSettings
              formFields={formFields}
              setFormFields={setFormFields}
              modalType={modalType}
              checkForReceiptPrefix={checkForReceiptPrefix}
              currentSession={currentSession}
            />
          )}
        </div>
      </Modal>
    </>
  )
}
