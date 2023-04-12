import React, {useContext, useEffect, useMemo, useState} from 'react'
import styles from '../../FeeCollection/components/CollectFeeModal/CollectFeeModal.module.css'
import {
  BUTTON_CONSTANTS,
  Datepicker,
  Divider,
  formatDateTime,
  Heading,
  Input,
  Modal,
  MODAL_CONSTANTS,
  Para,
  PARA_CONSTANTS,
} from '@teachmint/krayon'
import getSymbolFromCurrency from 'currency-symbol-map'
import {useDispatch} from 'react-redux'
import {DEFAULT_CURRENCY} from '../../../../../constants/common.constants'
import {
  getAmountFixDecimalWithCurrency,
  roundWithPrecision,
} from '../../../../../utils/Helpers'
import {
  collectFeeOptionsEvents,
  collectFeeOptionsIds,
  paymentStatusLabels,
} from '../../../fees.constants'
import {
  collectFeesRequestedAction,
  collectFeesSucceededAction,
  setCollctFeesDurationAction,
  submitFeesRequestAction,
} from '../../../redux/feeCollectionActions'
import {
  fetchAdHocDiscountListingRequestAction,
  setDiscountStatesAction,
} from '../../../redux/feeDiscountsActions'
import CustomReason from '../../CollectFees/AdHocDiscountModal/components/CustomReason/CustomReason'
import ChequeDDFields from '../../FeeCollection/components/CollectFeeModal/components/ChequeDDFields/ChequeDDFields'
import ConfirmModal from '../../FeeCollection/components/CollectFeeModal/components/ConfirmModal/ConfirmModal'
import FeeStructure from '../../FeeCollection/components/CollectFeeModal/components/FeeStructure/FeeStructure'
import {RecordFeeTypeSelection} from '../../FeeCollection/components/CollectFeeModal/components/RecordFeeTypeSelection/RecordFeeTypeSelection'
import {ShowMoreDetails} from '../../FeeCollection/components/CollectFeeModal/components/ShowMoreDetails/ShowMoreDetails'
import {CollectFeeModalContext} from './CollectFeeModalContext'
import AdHocDiscountModal from '../../CollectFees/AdHocDiscountModal/AdHocDiscountModal'
import {onLumpsumAmountChange} from '../../CollectFees/DiscountFields/helpers'
import {events} from '../../../../../utils/EventsConstants'
import Permission from '../../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../utils/permission.constants'
import {useTranslation} from 'react-i18next'
import usePaymentStatusAccordingToCurrency from '../../../hooks/usePaymentStatusAccordingToCurrency'
import {useFeeCollectionContext} from '../FeeCollectionContext/FeeCollectionContext'
import {ErrorBoundary} from '@teachmint/common'

export default function CollectFeeModalContextComponent({
  studentId,
  studentName,
  setShowCollectFeeModal,
  classId,
}) {
  const {
    instituteInfo,
    isMobile,
    adHocDiscountReasons,
    isCreateReasonModalOpen,
    selectedAdHocReason,
    collectFees,
    collectFeesDuration,
    studentDuesFilters,
    selectedRecordType,
    changeSelectedRecordType,
    showFeeForFullSession,
    lumpsumAmount,
    setLumpsumAmount,
    referenceNumber,
    updateReferenceNumber,
    paymentMethod,
    updatePaymentMethod,
    transactionStatus,
    updateTransactionStatus,
    discountAmount,
    updateDiscountAmount,
    discountReason,
    updateDiscountReason,
    discountRemark,
    updateDiscountRemark,
    dueFine,
    updateDueFine,
    additionalNote,
    updateAdditionalNote,
    showDiscount,
    setShowDiscount,
    recordSelectedForAdHoc,
    setRecordSelectedForAdHoc,
    adHocDiscountValues,
    setAdHocDiscountValues,
    lumpsumAmountDiscount,
    setLumpsumAmountDiscount,
    lumpsumAmountError,
    setLumpsumAmountError,
    setIsEditAdHocDiscount,
    paymentDate,
    updatePaymentDate,
    disbursalDate,
    updateDisbursalDate,
    setRowsData,
    setPreviousSessionRowsData,
    total,
    totalPreviousSessionDue,
    showFine,
    setShowFine,
    studentDetails,
    setStudentDetails,
    errorMessage,
    setErrorMessage,
    showFeeCollectionConfirmation,
    setShowFeeCollectionConfirmation,
    adHocDiscountValuesArr,
    adHocDiscountInitState,
    sendClickEvent,
    rowsData,
    previousSessionRowsData,
  } = useContext(CollectFeeModalContext)
  const feeCollectionContext = useFeeCollectionContext()
  const handleGetStudentDueRequest =
    feeCollectionContext?.handleGetStudentDueRequest
      ? feeCollectionContext?.handleGetStudentDueRequest
      : () => {}
  const paymentStatusOptions = usePaymentStatusAccordingToCurrency()
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const [modalError, setModalError] = useState('')
  const [collectFeeLoader, setCollectFeeLoader] = useState(false)

  const setCollectFeesData = (feesData) => {
    dispatch(collectFeesSucceededAction(feesData))
  }

  const handleCollectFees = () => {
    setShowFeeCollectionConfirmation(true)
    sendClickEvent(events.RECORD_PAYMENT_CLICKED_TFI, {
      type:
        selectedRecordType === collectFeeOptionsIds.BY_FEE_STRUCTURE
          ? collectFeeOptionsEvents.BY_FEE_STRUCTURE
          : collectFeeOptionsEvents.BY_LUMPSUM_AMOUNT,
      reason: discountReason ?? '',
      remark: discountRemark ?? '',
      paymentMethod: paymentMethod ?? '',
      paymentDate: paymentDate,
      amount: getTotalAmountValue(),
    })
  }

  const resetAdHocValues = () => {
    setAdHocDiscountValues({
      ...adHocDiscountValues,
      ...adHocDiscountInitState,
    })
    setRecordSelectedForAdHoc({
      ...recordSelectedForAdHoc,
      discountAmountError: '',
    })
    setIsEditAdHocDiscount(false)
  }

  const refreshParent = (row, rows) => {
    const parent = rows.find((r) => r.id === row.parentId)
    const silblings = rows.filter((r) => r.parentId === parent.id)
    parent.discount = silblings
      .map((s) => s.discount)
      .reduce((sum, e) => sum + (e === '' ? 0 : parseInt(e)), 0)
    parent.amount = silblings
      .map((s) => s.amount)
      .reduce((sum, e) => sum + (e === '' ? 0 : parseInt(e)), 0)
  }

  const handleConfirmFeeCollection = () => {
    const formValues = {
      transactionStatus: transactionStatus,
      paymentMethod: paymentMethod,
      referenceNumber: referenceNumber,
      payDate: paymentDate,
      disbursalDate: disbursalDate,
      classId: classId,
    }
    const collectFeesData = {...collectFees}
    collectFeesData.entire = [...rowsData, ...previousSessionRowsData]
    const data = {
      ...collectFeesData,
      ...formValues,
      collectFeesDuration,
    }
    data.fine_amount = showFine ? parseFloat(dueFine) : 0
    data.optionalData = additionalNote

    const recordPaymentDetailForDownloadOrPrintReceipt = {
      studentId: collectFeesData?.Id,
      name: collectFeesData?.name,
      amount: getAmountFixDecimalWithCurrency(
        getTotalAmountValue(),
        instituteInfo.currency
      ),
      classroom: `${collectFeesData?.class} - ${collectFeesData?.section}`,
      paymentMode: formValues.paymentMethod,
    }

    // lumpsum amount data
    let lumpsumData = null
    if (selectedRecordType === collectFeeOptionsIds.BY_LUMPSUM_AMOUNT) {
      lumpsumData = {}
      lumpsumData.lumpsum_amount = +lumpsumAmount
      if (
        lumpsumAmountDiscount?.discountAmount &&
        lumpsumAmountDiscount?.reasonId
      ) {
        lumpsumData.lumpsum_amount_discount = {
          discount_amount: lumpsumAmountDiscount?.discountAmount,
          reason_id: lumpsumAmountDiscount?.reasonId,
          remarks: lumpsumAmountDiscount?.remarks,
        }
      }
    }

    setCollectFeeLoader(true)
    function onSuccess() {
      // close fee collection modal and confirmation popup
      setShowFeeCollectionConfirmation(false)
      setShowCollectFeeModal(false)
      handleGetStudentDueRequest()
      feeCollectionContext?.setSearchValue('')
      setCollectFeeLoader(false)
    }

    function onFailure(params) {
      setShowFeeCollectionConfirmation(false)
      setModalError(params?.msg)
      setCollectFeeLoader(false)
    }
    dispatch(
      submitFeesRequestAction(studentId, data, studentDuesFilters, {
        adHocDiscountValuesArr,
        recordPaymentDetailForDownloadOrPrintReceipt,
        lumpsumData,
        onFailure,
        onSuccess,
      })
    )
  }

  const removeDiscount = () => {
    // hide discount section and reset discount data
    setShowDiscount(false)
    setLumpsumAmountDiscount({
      error: '',
      discountAmount: null,
      reasonId: null,
      reasonIdError: '',
      remarks: '',
      isAdded: false,
    })
  }

  const removeDueFine = () => {
    // hide fine section and reset fine data
    setShowFine(false)
    updateDueFine('')
  }

  useEffect(() => {
    setRowsData(collectFees ? collectFees['entire'] : [])
    setPreviousSessionRowsData(
      collectFees ? collectFees['previous_session_entire'] : []
    )
    if (collectFees?.[`currentTotalDue`]) {
      setLumpsumAmount(collectFees?.[`currentTotalDue`])
    } else {
      setLumpsumAmount(null)
    }
  }, [showFeeForFullSession, collectFees])

  useEffect(() => {
    if (lumpsumAmount > collectFees?.[`entireTotalDue`]) {
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        lumpsumAmount: t('amountShouldNotBeMoreThanDue'),
      }))
    } else {
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        lumpsumAmount: null,
      }))
    }
  }, [lumpsumAmount])

  useEffect(() => {
    if (discountReason == 'noneOfAbove')
      dispatch(
        setDiscountStatesAction({
          isCreateReasonModalOpen: true,
        })
      )
  }, [discountReason])

  useEffect(() => {
    if (studentId) {
      dispatch(setCollctFeesDurationAction('entire'))
      dispatch(collectFeesRequestedAction(studentId, showFeeForFullSession))
      dispatch(fetchAdHocDiscountListingRequestAction())
    }
  }, [studentId, showFeeForFullSession])

  useEffect(() => {
    setStudentDetails(collectFees || {})
  }, [collectFees])

  useEffect(() => {
    if (selectedAdHocReason) {
      if (selectedRecordType === collectFeeOptionsIds.BY_FEE_STRUCTURE) {
        setAdHocDiscountValues({
          ...adHocDiscountValues,
          adHocReasonId: selectedAdHocReason,
        })
      } else {
        setLumpsumAmountDiscount({
          ...lumpsumAmountDiscount,
          reasonId: selectedAdHocReason,
        })
      }
    }
  }, [selectedAdHocReason])

  const handleLumpsumAmountChange = ({value}) => {
    onLumpsumAmountChange(value, {
      collectFees,
      collectFeesDuration,
      instituteInfo,
      lumpsumAmountDiscount,
      setLumpsumAmountDiscount,
      setLumpsumAmountError,
      lumpsumAmountError,
      setLumpsumAmount,
    })
  }

  const getTotal = () => {
    let myTotal = 0
    if (selectedRecordType == collectFeeOptionsIds.BY_FEE_STRUCTURE) {
      return (
        parseInt(total || 0) +
        parseInt(totalPreviousSessionDue || 0) +
        parseInt(dueFine || 0)
      )
    } else {
      myTotal = parseInt(lumpsumAmount || 0) + parseInt(dueFine || 0)
      if (showDiscount) myTotal += lumpsumAmountDiscount?.discountAmount
      return myTotal
    }
  }

  const getTotalAmountValue = () => {
    return selectedRecordType == collectFeeOptionsIds.BY_FEE_STRUCTURE
      ? roundWithPrecision(total || 0) +
          roundWithPrecision(totalPreviousSessionDue || 0) +
          roundWithPrecision(dueFine || 0)
      : roundWithPrecision(lumpsumAmount || 0) +
          roundWithPrecision(dueFine || 0) || 0
  }

  const isCollectFeeBtnDisabled = useMemo(
    () =>
      !paymentMethod ||
      getTotal() === 0 ||
      lumpsumAmountError?.isLumpErr ||
      (lumpsumAmountDiscount &&
        showDiscount &&
        (!lumpsumAmountDiscount?.discountAmount ||
          !lumpsumAmountDiscount?.reasonId)) ||
      lumpsumAmountDiscount?.error ||
      !Object.values(errorMessage).every((x) => x === null || x === ''),
    [
      lumpsumAmountError?.isLumpErr,
      paymentMethod,
      showDiscount,
      lumpsumAmountDiscount?.discountAmount,
      lumpsumAmountDiscount?.reasonId,
      lumpsumAmountDiscount?.error,
      errorMessage,
      selectedRecordType,
      total,
      totalPreviousSessionDue,
      dueFine,
    ]
  )

  return (
    <Modal
      isOpen={true}
      actionButtons={[
        {
          body: (
            <>
              <Permission
                permissionId={
                  PERMISSION_CONSTANTS.feeModuleController_feeStudentPayment_create
                }
              >
                {t('collect')}{' '}
                {getAmountFixDecimalWithCurrency(
                  getTotalAmountValue(),
                  instituteInfo.currency
                )}
              </Permission>
            </>
          ),
          onClick: () => handleCollectFees(),
          width: isMobile
            ? BUTTON_CONSTANTS.WIDTH.FULL
            : BUTTON_CONSTANTS.WIDTH.FIT,
          isDisabled: isCollectFeeBtnDisabled,
        },
      ]}
      header={`Collect fee for ${studentName || ''}`}
      onClose={() => setShowCollectFeeModal(false)}
      size={MODAL_CONSTANTS.SIZE.X_LARGE}
      footerLeftElement={
        modalError && <Para type={PARA_CONSTANTS.TYPE.ERROR}>{modalError}</Para>
      }
      classes={{header: styles.modalHeader}}
    >
      <ErrorBoundary>
        <div className={styles.wrapper}>
          {!isMobile && (
            <RecordFeeTypeSelection
              selectedRecordType={selectedRecordType}
              changeSelectedRecordType={changeSelectedRecordType}
              dueAmount={collectFees?.[`entireTotalDue`]}
              dueTillAmount={collectFees?.[`currentTotalDue`]}
              sendClickEvent={sendClickEvent}
            />
          )}
          {!isMobile && <Divider length="100" spacing="20px" thickness="1" />}
          <div className={styles.detailsWrapper}>
            {!isMobile &&
              selectedRecordType === collectFeeOptionsIds.BY_LUMPSUM_AMOUNT && (
                <span className={styles.title}>{t('details')}</span>
              )}
            <div className={styles.inputFieldGroup}>
              {selectedRecordType == collectFeeOptionsIds.BY_LUMPSUM_AMOUNT && (
                <Input
                  defaultText=""
                  fieldName="textField"
                  isRequired
                  onChange={handleLumpsumAmountChange}
                  placeholder="10000"
                  infoMsg={errorMessage.lumpsumAmount || ''}
                  infoType={errorMessage.lumpsumAmount ? 'error' : ''}
                  showMsg
                  value={roundWithPrecision(lumpsumAmount)}
                  title={
                    isMobile ? t('collectionAmount') : t('lumpsumAmountTitle')
                  }
                  type="number"
                  prefix={
                    <Heading textSize="s">
                      {getSymbolFromCurrency(
                        instituteInfo.currency || DEFAULT_CURRENCY
                      )}
                    </Heading>
                  }
                  classes={{wrapper: styles.inputWrapper}}
                />
              )}
              <div className={styles.datePickerWrapper}>
                <span className={styles.inputTitle}>{t('paymentDate')} *</span>
                <Datepicker
                  closeOnChange
                  inputProps={{
                    placeholder: t('selectDate'),
                  }}
                  dateFormat={'yyyy-MM-dd'}
                  onChange={(e) =>
                    updatePaymentDate(formatDateTime(e, 'yyyy-MM-dd'))
                  }
                  value={new Date(paymentDate)}
                  classes={{wrapper: styles.datePickerClassWrapper}}
                />
              </div>
              <Input
                fieldName="fieldName"
                isRequired
                onChange={(e) => updatePaymentMethod(e.value)}
                options={paymentStatusOptions}
                value={paymentStatusLabels[paymentMethod].key}
                placeholder={t('select')}
                showMsg
                title={t('paymentMethod')}
                type="dropdown"
                classes={{wrapper: styles.inputWrapper, optionsClass: 'z-1'}}
              />
            </div>
            {(paymentMethod == paymentStatusLabels['CHEQUE'].key ||
              paymentMethod == paymentStatusLabels['DD'].key) && (
              <ChequeDDFields
                paymentMethod={paymentMethod}
                transactionStatus={transactionStatus}
                updateTransactionStatus={updateTransactionStatus}
                referenceNumber={referenceNumber}
                updateReferenceNumber={updateReferenceNumber}
                disbursalDate={disbursalDate}
                updateDisbursalDate={updateDisbursalDate}
              />
            )}
            {selectedRecordType === collectFeeOptionsIds.BY_FEE_STRUCTURE && (
              <FeeStructure
                instituteCurrency={instituteInfo.currency || DEFAULT_CURRENCY}
                AdHocDiscountModal={AdHocDiscountModal}
                resetAdHocValues={resetAdHocValues}
                setCollectFeesData={setCollectFeesData}
                refreshParent={refreshParent}
              />
            )}
            <ShowMoreDetails
              additionalNote={additionalNote}
              updateAdditionalNote={updateAdditionalNote}
              showDiscount={showDiscount}
              removeDiscount={removeDiscount}
              removeDueFine={removeDueFine}
              setShowDiscount={setShowDiscount}
              updateDiscountAmount={updateDiscountAmount}
              discountAmount={discountAmount}
              updateDiscountReason={updateDiscountReason}
              adHocDiscountReasons={adHocDiscountReasons}
              discountReason={discountReason}
              updateDiscountRemark={updateDiscountRemark}
              discountRemark={discountRemark}
              showFine={showFine}
              setShowFine={setShowFine}
              updateDueFine={updateDueFine}
              collectFees={collectFees}
              dueFine={dueFine}
              selectedRecordType={selectedRecordType}
            />
          </div>
        </div>
        {showFeeCollectionConfirmation && (
          <ConfirmModal
            isOpen={showFeeCollectionConfirmation}
            onClose={setShowFeeCollectionConfirmation}
            onConfirm={handleConfirmFeeCollection}
            studentDetails={studentDetails}
            totalAmountValue={getTotalAmountValue()}
            paymentMethod={paymentMethod}
            selectedRecordType={selectedRecordType}
            sendClickEvent={sendClickEvent}
            paymentMode={paymentStatusLabels[paymentMethod].actualLabel}
            buttonLoader={collectFeeLoader}
          />
        )}
        {isCreateReasonModalOpen && (
          <CustomReason
            isModalOpen={isCreateReasonModalOpen}
            handleDecline={() => {
              dispatch(
                setDiscountStatesAction({
                  isCreateReasonModalOpen: false,
                })
              )
            }}
          />
        )}
      </ErrorBoundary>
    </Modal>
  )
}
