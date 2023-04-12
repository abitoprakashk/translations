import {formatDateTime} from '@teachmint/krayon'
import React, {createContext, useState} from 'react'
import {useSelector} from 'react-redux'
import {collectFeeOptionsIds} from '../../../fees.constants'
import {useFeeCollection} from '../../../redux/feeCollectionSelectors'
import {useFeeDiscount} from '../../../redux/feeDiscounts.selectors'

export const CollectFeeModalContext = createContext()

export function CollectFeeModalProvider({children}) {
  const {instituteInfo, isMobile, eventManager} = useSelector((state) => state)
  const {adHocDiscountReasons, isCreateReasonModalOpen, selectedAdHocReason} =
    useFeeDiscount()
  const {collectFees, collectFeesDuration, studentDuesFilters} =
    useFeeCollection()

  const [selectedRecordType, changeSelectedRecordType] = useState(
    collectFeeOptionsIds.BY_LUMPSUM_AMOUNT
  )
  const [isAdHocModalOpen, setIsAdHocModalOpen] = useState(false)
  const [isPreviousSessionDueDiscount, setIsPreviousSessionDueDiscount] =
    useState(false)
  const [showFeeForFullSession, changeShowFeeForFullSession] = useState(false)
  const [referenceNumber, updateReferenceNumber] = useState('')
  const [paymentMethod, updatePaymentMethod] = useState('CASH')
  const [transactionStatus, updateTransactionStatus] = useState('RECEIVED')
  const [discountAmount, updateDiscountAmount] = useState('')
  const [discountReason, updateDiscountReason] = useState('')
  const [discountRemark, updateDiscountRemark] = useState('')
  const [dueFine, updateDueFine] = useState('')
  const [additionalNote, updateAdditionalNote] = useState('')
  const [showDiscount, setShowDiscount] = useState(false)
  const [selectedReasons, setSelectedReasons] = useState(null)
  const [recordSelectedForAdHoc, setRecordSelectedForAdHoc] = useState(null)
  const adHocDiscountInitState = {
    discountAmount: '',
    adHocReasonId: null,
    remarks: '',
    childLevelId: null,
    parentId: null,
    grandParentId: null,
    isChecked: true,
  }
  const [adHocDiscountValues, setAdHocDiscountValues] = useState({
    ...adHocDiscountInitState,
  })
  //   Lump sum
  const [lumpsumAmountDiscount, setLumpsumAmountDiscount] = useState({
    error: '',
    discountAmount: null,
    reasonId: null,
    reasonIdError: '',
    remarks: '',
    isAdded: false,
  })
  const [lumpsumAmountError, setLumpsumAmountError] = useState(null)
  const [lumpsumAmount, setLumpsumAmount] = useState(null)

  const [isEditAdHocDiscount, setIsEditAdHocDiscount] = useState(false)
  const [paymentDate, updatePaymentDate] = useState(
    formatDateTime(new Date(), 'yyyy-MM-dd')
  )
  const [disbursalDate, updateDisbursalDate] = useState(
    formatDateTime(new Date(), 'yyyy-MM-dd')
  )
  const [rowsData, setRowsData] = useState([])
  const [previousSessionRowsData, setPreviousSessionRowsData] = useState([])
  const [total, setTotal] = useState(0)
  const [totalPreviousSessionDue, setTotalPreviousSessionDue] = useState(0)
  const [showFine, setShowFine] = useState(false)
  const [studentDetails, setStudentDetails] = useState({})
  const [errorMessage, setErrorMessage] = useState({})
  const [showFeeCollectionConfirmation, setShowFeeCollectionConfirmation] =
    useState(false)
  const [adHocDiscountValuesArr, setAdHocDiscountValuesArr] = useState([])

  const sendClickEvent = (eventName, dataObj = {}) => {
    return eventManager.send_event(eventName, {...dataObj})
  }

  return (
    <CollectFeeModalContext.Provider
      value={{
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
        isAdHocModalOpen,
        setIsAdHocModalOpen,
        isPreviousSessionDueDiscount,
        setIsPreviousSessionDueDiscount,
        showFeeForFullSession,
        changeShowFeeForFullSession,
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
        selectedReasons,
        setSelectedReasons,
        recordSelectedForAdHoc,
        setRecordSelectedForAdHoc,
        adHocDiscountValues,
        setAdHocDiscountValues,
        lumpsumAmountDiscount,
        setLumpsumAmountDiscount,
        lumpsumAmountError,
        setLumpsumAmountError,
        isEditAdHocDiscount,
        setIsEditAdHocDiscount,
        paymentDate,
        updatePaymentDate,
        disbursalDate,
        updateDisbursalDate,
        rowsData,
        setRowsData,
        previousSessionRowsData,
        setPreviousSessionRowsData,
        total,
        setTotal,
        totalPreviousSessionDue,
        setTotalPreviousSessionDue,
        showFine,
        setShowFine,
        studentDetails,
        setStudentDetails,
        errorMessage,
        setErrorMessage,
        showFeeCollectionConfirmation,
        setShowFeeCollectionConfirmation,
        adHocDiscountValuesArr,
        setAdHocDiscountValuesArr,
        adHocDiscountInitState,
        sendClickEvent,
      }}
    >
      {children}
    </CollectFeeModalContext.Provider>
  )
}
