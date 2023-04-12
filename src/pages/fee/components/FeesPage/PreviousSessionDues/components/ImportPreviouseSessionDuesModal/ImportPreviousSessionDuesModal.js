import React, {useEffect, useState} from 'react'
import styles from './ImportPreviousSessionDuesModal.module.css'
import classNames from 'classnames'
import {useDispatch, useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {
  Modal,
  MODAL_CONSTANTS,
  BUTTON_CONSTANTS,
  Input,
  Datepicker,
  Para,
  PARA_CONSTANTS,
} from '@teachmint/krayon'
import {useFeeStructure} from '../../../../../redux/feeStructure/feeStructureSelectors'
import feeStructureActionTypes from '../../../../../redux/feeStructure/feeStructureActionTypes'
import {fetchUsedFeeCategoriesRequestedAction} from '../../../../../redux/feeStructure/feeStructureActions'
import {events} from '../../../../../../../utils/EventsConstants'
import {alphaRegex} from '../../../../../../../utils/Validations'

export default function ImportPreviousSessionDuesModal({
  session,
  setIsImportModalOpen,
  setInProgress,
  checkForReceiptPrefix,
}) {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const {
    eventManager,
    instituteActiveAcademicSessionId,
    instituteAcademicSessionInfo,
  } = useSelector((state) => state)
  const [isReceiptNoDisabled, setIsReceiptNoDisabled] = useState(false)
  const currentSession = instituteAcademicSessionInfo.find(
    (session) => session._id == instituteActiveAcademicSessionId
  )
  const [formFields, setFormFields] = useState({
    receipt_prefix: '',
    due_date: currentSession.start_time / 1000,
    series_starting_number: '0',
  })
  const {feeTypes, usedFeeTypes, previousYearDuesLoading} = useFeeStructure()
  const [selectedFeeTypes, setSelectedFeeTypes] = useState([])

  useEffect(() => {
    dispatch(
      fetchUsedFeeCategoriesRequestedAction({
        session: session._id,
      })
    )
  }, [])

  const handleImportAction = () => {
    eventManager.send_event(
      events.FEE_PREVIOUS_SESSION_DUES_IMPORT_SELECTED_TFI,
      {
        action: 'import',
        session_id: session._id,
        receipt_prefix: formFields.receipt_prefix,
        receipt_starting_no: formFields.series_starting_number,
        due_date: formFields.due_date,
      }
    )
    formFields.master_categories_ids = [...selectedFeeTypes, ...usedFeeTypes]
    formFields.prev_session_id = session?._id
    formFields.schedule_timestamps = [parseInt(formFields.due_date)]
    dispatch({
      type: feeStructureActionTypes.IMPORT_PREVIOUS_SESSION_DUES_REQUESTED,
      payload: formFields,
      onSuccess: onSuccess,
    })
  }

  const onSuccess = () => {
    setInProgress(true)
    eventManager.send_event(events.FEE_PREVIOUS_SESSION_DUES_IMPORTED_TFI, {
      session_id: session._id,
      receipt_prefix: formFields.receipt_prefix,
      receipt_starting_no: formFields.series_starting_number,
      due_date: formFields.due_date,
    })
    setIsImportModalOpen(false)
  }

  return (
    <>
      <Modal
        isOpen={true}
        actionButtons={[
          {
            body: t('cancelButton'),
            onClick: () => {
              eventManager.send_event(
                events.FEE_PREVIOUS_SESSION_DUES_IMPORT_SELECTED_TFI,
                {
                  action: 'cancel',
                  session_id: session._id,
                  receipt_prefix: formFields.receipt_prefix,
                  receipt_starting_no: formFields.series_starting_number,
                  due_date: formFields.due_date,
                }
              )
              setIsImportModalOpen(false)
            },
            type: BUTTON_CONSTANTS.TYPE.OUTLINE,
            width: BUTTON_CONSTANTS.WIDTH.FIT,
            isDisabled: previousYearDuesLoading,
          },
          {
            body: (
              <div className={styles.buttonLoadingSection}>
                {previousYearDuesLoading && (
                  <div
                    className={classNames('loading', styles.buttonLoading)}
                  ></div>
                )}
                {t('importButton')}
              </div>
            ),
            onClick: () => handleImportAction(),
            width: BUTTON_CONSTANTS.WIDTH.FIT,
            isDisabled:
              previousYearDuesLoading ||
              !formFields.series_starting_number ||
              !formFields.receipt_prefix,
          },
        ]}
        header={t('importViaSessionTitle', {sessionName: session?.name})}
        classes={{content: classNames('show-scrollbar show-scrollbar-big')}}
        onClose={() => {
          eventManager.send_event(
            events.FEE_PREVIOUS_SESSION_DUES_IMPORT_SELECTED_TFI,
            {
              action: 'cancel',
              session_id: session._id,
              receipt_prefix: formFields.receipt_prefix,
              receipt_starting_no: formFields.series_starting_number,
              due_date: formFields.due_date,
            }
          )
          setIsImportModalOpen(false)
        }}
        size={MODAL_CONSTANTS.SIZE.MEDIUM}
      >
        <div className={styles.wrapper}>
          <Input
            fieldName="feeTypes"
            isMultiSelect={true}
            options={feeTypes.map((type) => {
              return {
                label: type.name,
                value: type._id,
              }
            })}
            frozenOptions={usedFeeTypes}
            placeholder={t('feeTypePlaceholder')}
            showMsg
            withChips={true}
            title={t('feeTypeTitle')}
            type="dropdown"
            value={
              selectedFeeTypes.length > 0
                ? selectedFeeTypes
                : [...selectedFeeTypes, ...(usedFeeTypes || [])]
            }
            selectionPlaceholder={
              (selectedFeeTypes.length > 0
                ? selectedFeeTypes.length
                : [...selectedFeeTypes, ...(usedFeeTypes || [])].length) == 0
                ? t('selectFeeTypes')
                : `${
                    selectedFeeTypes.length > 0
                      ? selectedFeeTypes.length
                      : [...selectedFeeTypes, ...(usedFeeTypes || [])].length
                  } selected`
            }
            onChange={({value}) => setSelectedFeeTypes([...value])}
            classes={{wrapper: styles.inputWrapperClass}}
          />
          <div className={styles.horizontalDivider}></div>
          <Para
            textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}
            type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
          >
            {t('receiptInfoSectionTitle')}
          </Para>
          <div className={styles.inputGroup}>
            <Input
              fieldName="receipt_prefix"
              isRequired
              onChange={(e) => {
                if (alphaRegex(e.value)) {
                  setFormFields((formFields) => ({
                    ...formFields,
                    receipt_prefix: e.value.toUpperCase(),
                  }))
                }
              }}
              onBlur={() =>
                checkForReceiptPrefix(
                  formFields,
                  setFormFields,
                  setIsReceiptNoDisabled
                )
              }
              placeholder={t('receiptPrefixPlaceholder')}
              showMsg
              value={formFields.receipt_prefix || ''}
              title={t('receiptPrefix')}
              type="text"
            />
            <Input
              fieldName="series_starting_number"
              isRequired
              onChange={(e) =>
                setFormFields((formFields) => ({
                  ...formFields,
                  series_starting_number: e.value,
                }))
              }
              placeholder="0"
              showMsg
              isDisabled={isReceiptNoDisabled}
              value={formFields.series_starting_number || ''}
              title={t('receiptStartingNo')}
              type="number"
            />
            <div className={styles.datePickerWrapper}>
              <span className={styles.inputTitle}>
                {t('paymentDueDataRequired')}
              </span>
              <Datepicker
                inputProps={{
                  placeholder: t('selectDate'),
                }}
                dateFormat={'dd-MM-yyyy'}
                onChange={(e) =>
                  setFormFields((formFields) => ({
                    ...formFields,
                    due_date: e.getTime() / 1000,
                  }))
                }
                value={new Date(formFields.due_date * 1000)}
                maxDate={new Date(parseInt(currentSession.end_time))}
                minDate={new Date(parseInt(currentSession.start_time))}
                classes={{
                  wrapper: styles.datePickerClassWrapper,
                  calendar: styles.rdrCalendarWrapper,
                }}
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}
