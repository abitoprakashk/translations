import {useEffect, useState} from 'react'
// import userDefaultIcon from '../../../../assets/images/icons/user-profile.svg'
import styles from './CollectFees.module.css'
import classNames from 'classnames'
import {
  Table,
  StickyFooter,
  Icon,
  Tooltip,
  // formatDateTime,
} from '@teachmint/common'
import {
  Button,
  // Datepicker,
  Divider,
  Heading,
  Input,
  Radio,
} from '@teachmint/krayon'
import produce from 'immer'
// import ToggleSwitch from '../ToggleSwitch/ToggleSwitch'
// import {useActiveAcademicSessionId} from '../../../../utils/CustomHooks/AcademicSessionHook'
import {
  useFeeCollection,
  useInstituteId,
} from '../../redux/feeCollectionSelectors'
import {useDispatch, useSelector} from 'react-redux'
import {
  collectFeesRequestedAction,
  collectFeesSucceededAction,
  setCollctFeesDurationAction,
  submitFeesRequestAction,
} from '../../redux/feeCollectionActions'
import {
  // convertTimestampToLocalTime,
  getAmountFixDecimalWithCurrency,
  getPlainAmountFixDecimalWithCurrency,
  roundWithPrecision,
} from '../../../../utils/Helpers'
import ConfirmationPopup from '../../../../components/Common/ConfirmationPopup/ConfirmationPopup'
// import InputField from '../../../../components/Common/InputField/InputField'
import {DateTime} from 'luxon'
import {events} from '../../../../utils/EventsConstants'
import {
  collectFeeOptions,
  collectFeeOptionsIds,
  LUMPSUM_DISCOUNT,
  paymentStatus,
  paymentStatusLabels,
  simplePaymentModes,
  transactionMethods,
} from '../../fees.constants'
import {Trans, useTranslation} from 'react-i18next'
import AdHocDiscountModal from './AdHocDiscountModal/AdHocDiscountModal'
import {useFeeDiscount} from '../../redux/feeDiscounts.selectors'
import {setDiscountStatesAction} from '../../redux/feeDiscountsActions'
import FeeFineData from './FeeFineData/FeeFineData'
import {useStudentProfileFeeTabSelector} from '../../../../components/SchoolSystem/StudentDirectory/redux/selectros/feeTabSelectors'
// import RadioInput from '../../../../components/Common/RadioInput/RadioInput'
import LumpSumAmount from './LumpSumAmount/LumpSumAmount'
import StudentInfo from './StudentInfo/StudentInfo'
import FormFields from './FormFields/FormFields'
import {
  getRecoredByValueForEvents,
  getValuesOfDiscountForEvents,
} from '../../helpers/helpers'
import {DEFAULT_CURRENCY} from '../../../../constants/common.constants'
import {getSymbolFromCurrency} from '../../../../utils/Helpers'

const CollectFees = ({studentId, classId}) => {
  let today = DateTime.now().toFormat('yyyy-MM-dd')
  const {t} = useTranslation()
  const showFooter = true
  const {collectFeeSlider} = useStudentProfileFeeTabSelector()
  const {
    collectFees,
    collectFeesLoading,
    collectFeesDuration,
    submitFeesLoading,
    studentDuesFilters,
  } = useFeeCollection()
  const {adHocDiscountReasons, isCreateReasonModalOpen, selectedAdHocReason} =
    useFeeDiscount()
  const rowsData =
    (collectFees && collectFeesDuration && collectFees[collectFeesDuration]) ||
    []
  const [total, setTotal] = useState(0)
  const [showConfirmPopup, setShowConfirmPopup] = useState(false)
  const [formValues, setFormValues] = useState({
    transactionStatus: '',
    paymentMethod: paymentStatus.SELECT_PAYMENT_METHOD,
    referenceNumber: null,
    payDate: today,
    disbursalDate: today,
  })
  const [formErrors, setFormErrors] = useState({})
  const instituteId = useInstituteId()
  // const academicSessionId = useActiveAcademicSessionId()
  const [advancePaymentStatus, setAdvancePaymentStatus] = useState('current')
  // const {instituteAcademicSessionInfo} = useSelector((state) => state)
  // const startEndDate = instituteAcademicSessionInfo.find(
  //   (session) => session._id == academicSessionId
  // )

  // const SessionStartDate = convertTimestampToLocalTime(startEndDate.start_time)
  // const SessionEndDate = convertTimestampToLocalTime(startEndDate.end_time)
  const [startDate, setStartDate] = useState(today)
  const [disbursalDate, setDisbursalDate] = useState(today)
  const [isFeeFineApplied, setIsFeeFineApplied] = useState(false)
  const [fineAmountValue, setFineAmountValue] = useState(
    collectFees !== null ? collectFees.fine.due : null
  )

  const eventManager = useSelector((state) => state.eventManager)
  const {instituteInfo} = useSelector((state) => state)
  // Ad hoc discount
  const [isAdHocModalOpen, setIsAdHocModalOpen] = useState(false)
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
  const [adHocDiscountValuesArr, setAdHocDiscountValuesArr] = useState([])
  const [isEditAdHocDiscount, setIsEditAdHocDiscount] = useState(false)
  // end Ad hoc discount

  const [collectFeeType, setCollectFeeType] = useState(
    collectFeeOptionsIds.BY_LUMPSUM_AMOUNT
  )
  const [lumpsumAmount, setLumpsumAmount] = useState(null)
  const [lumpsumAmountDiscount, setLumpsumAmountDiscount] = useState({
    error: '',
    discountAmount: null,
    reasonId: null,
    reasonIdError: '',
    remarks: '',
    isAdded: false,
  })
  const [lumpsumAmountError, setLumpsumAmountError] = useState(null)
  const [disabledBtn, setDisabledBtn] = useState(true)

  useEffect(() => {
    setDisabledBtn(
      formValues.paymentMethod === paymentStatus.SELECT_PAYMENT_METHOD ||
        total === 0 ||
        lumpsumAmountError?.isLumpErr ||
        (lumpsumAmountDiscount &&
          lumpsumAmountDiscount?.isAdded &&
          (!lumpsumAmountDiscount?.discountAmount ||
            !lumpsumAmountDiscount?.reasonId)) ||
        lumpsumAmountDiscount?.error
    )
  }, [
    lumpsumAmountError?.isLumpErr,
    formValues?.paymentMethod,
    lumpsumAmountDiscount?.isAdded,
    lumpsumAmountDiscount?.discountAmount,
    lumpsumAmountDiscount?.reasonId,
    lumpsumAmountDiscount?.error,
    total,
  ])

  useEffect(() => {
    if (instituteId && studentId) {
      dispatch(collectFeesRequestedAction(studentId, false))
    }
  }, [studentId, instituteId, advancePaymentStatus])
  useEffect(() => {
    if (instituteId && studentId && advancePaymentStatus === 'entire') {
      dispatch(collectFeesRequestedAction(studentId, true))
    }
  }, [studentId, instituteId, advancePaymentStatus])

  useEffect(() => {
    if (collectFees && collectFeesDuration) {
      refreshTotal(collectFees)
    }
  }, [collectFees, collectFeesDuration])

  useEffect(() => {
    if (selectedAdHocReason) {
      if (collectFeeType === collectFeeOptionsIds.BY_FEE_STRUCTURE) {
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

  useEffect(() => {
    if (collectFees && collectFeesDuration) {
      refreshTotal()
    }
  }, [isFeeFineApplied, fineAmountValue])

  useEffect(() => {
    refreshTotal()
  }, [lumpsumAmount, collectFeeType, lumpsumAmountDiscount?.discountAmount])

  useEffect(() => {
    return () => {
      setAdHocDiscountValuesArr([])
    }
  }, [])

  useEffect(() => {
    setFineAmountValue(collectFees?.fine?.due)
  }, [collectFees?.fine?.due])

  const handleStartDate = (fieldName, value) => {
    if (value) {
      setStartDate(`${value}`)
    } else {
      value = startDate
      setStartDate(`${value}`)
    }
    handleChange({target: {name: fieldName, value: value}})
  }

  const handleDisbursalDate = (fieldName, value) => {
    if (value) {
      setDisbursalDate(`${value}`)
    } else {
      value = disbursalDate
      setDisbursalDate(`${value}`)
    }
    handleChange({target: {name: fieldName, value: value}})
  }
  const dispatch = useDispatch()

  const setCollectFeesData = (feesData) => {
    dispatch(collectFeesSucceededAction(feesData))
  }
  const setDuration = (advancePaymentStatus) => {
    setAdvancePaymentStatus(advancePaymentStatus)
    dispatch(setCollctFeesDurationAction(advancePaymentStatus))
  }

  const refreshTotal = () => {
    let total = 0
    if (collectFeeType === collectFeeOptionsIds.BY_FEE_STRUCTURE) {
      if (!rowsData || (rowsData.length === 0 && collectFees?.fine.due === 0)) {
        return 0
      }
      total = rowsData
        .filter((f) => f.type === 'childLevel')
        .map((f) => f.paid)
        .reduce(
          (sum, a) => sum + (typeof a === 'number' ? a : parseFloat(a)),
          0
        )
      total >= 0 ? total : 0
    } else {
      total = parseFloat(+lumpsumAmount)
    }

    if (isFeeFineApplied && collectFees?.fine.due) {
      total += parseFloat(+fineAmountValue)
    }

    setTotal(total <= 0 ? 0 : total)
  }

  if (collectFeesLoading) {
    return <div className="loading" />
  }

  if (!collectFees) {
    return ''
  }

  const cols = [
    {key: 'feeStructure', label: 'Fee Structure'},
    {key: 'totalFees', label: 'Total Fee'},
    {key: 'discount', label: 'Discount'},
    {key: 'dueAmount', label: 'Due Amount'},
    {key: 'amountPaid', label: 'Amount To Be Paid'},
  ]

  const handleExpandClick = (id) => {
    setCollectFeesData(
      produce(collectFees, (draft) => {
        const rows = draft[collectFeesDuration]
        const row = rows.find((r) => r.id === id)
        if (row.type === 'month') {
          row.childrenShowing = !row.childrenShowing
          const children = rows.filter((r) => r.parentId === id)
          children.forEach((c) => (c.hidden = !row.childrenShowing))
        } else if (row.type === 'topLevel') {
          row.childrenShowing = !row.childrenShowing
          const children = rows.filter((r) => r.parentId === id)
          children.forEach((c) => {
            c.hidden = !row.childrenShowing
            c.childrenShowing = row.childrenShowing
            const grandChildren = rows.filter((r) => r.parentId === c.id)
            grandChildren.forEach((g) => (g.hidden = !row.childrenShowing))
          })
        }
      })
    )
  }

  const handleAdHocDiscountCheckboxValue = ({key, id}) => {
    if (adHocDiscountValuesArr.length > 0) {
      const newAdHocDiscountValuesArr = adHocDiscountValuesArr.filter(
        (adHoc) => adHoc[key] !== id
      )

      setAdHocDiscountValuesArr([...newAdHocDiscountValuesArr])
    }
  }

  const handleCheckboxClick = (e, id) => {
    const checked = e.target.checked
    let keyForAdHoc = 'childLevelId'
    setCollectFeesData(
      produce(collectFees, (draft) => {
        const rows = draft[collectFeesDuration]
        const row = rows.find((r) => r.id === id)
        row.selected = checked
        row.paid = checked ? row.due : 0
        if (row.type === 'childLevel') {
          row.adHocDiscountAmount = checked ? +row?.adHocDiscountAmount : 0
          refreshParent(row, rows)
          const parent = rows.find((r) => r.id === row.parentId)
          refreshParent(parent, rows)
        } else if (row.type === 'month') {
          keyForAdHoc = 'parentId'
          const children = rows.filter((r) => r.parentId === id)
          children.forEach((c) => {
            c.adHocDiscountAmount = checked ? +c?.adHocDiscountAmount : 0
            c.paid = checked ? c.due : 0
            c.selected = checked
          })
          refreshParent(row, rows)
        } else if (row.type === 'topLevel') {
          const children = rows.filter((r) => r.parentId === id)
          children.forEach((c) => {
            c.paid = checked ? c.due : 0
            c.selected = checked
            const grandChildren = rows.filter((r) => r.parentId === c.id)
            grandChildren.forEach((g) => {
              g.paid = checked ? g.due : 0
              g.selected = checked
              g.adHocDiscountAmount = checked ? +g?.adHocDiscountAmount : 0
            })
          })
          keyForAdHoc = 'grandParentId'
        }
        refreshTotal()
        handleAdHocDiscountCheckboxValue({
          key: keyForAdHoc,
          id,
          isChecked: checked,
        })
      })
    )
  }

  const refreshParent = (row, rows) => {
    const parent = rows.find((r) => r.id === row.parentId)
    const silblings = rows.filter((r) => r.parentId === parent.id)
    parent.discount = silblings
      .map((s) => s.discount)
      .reduce((sum, e) => sum + (e === '' ? 0 : parseInt(e)), 0)
    parent.paid = silblings
      .map((s) => s.paid)
      .reduce((sum, e) => sum + (e === '' ? 0 : parseInt(e)), 0)
  }

  const handleInputChange = (e, id) => {
    setCollectFeesData(
      produce(collectFees, (draft) => {
        const rows = draft[collectFeesDuration]
        const row = rows.find((r) => r.id === id)
        row.paid = e.target.value

        refreshParent(row, rows)
        const parent = rows.find((r) => r.id === row.parentId)
        refreshParent(parent, rows)
        refreshTotal()
      })
    )

    const row = collectFees[collectFeesDuration].find((r) => r.id === id)
    setFormErrors(
      produce(formErrors, (draft) => {
        if (e.target.value > roundWithPrecision(row.due))
          draft[id] = "Can't be more than due amount"
        else if (e.target.value < 0) draft[id] = 'Cannot be less than zero'
        else draft[id] = null
      })
    )
  }

  const handleDurationChange = (nextValue) => {
    eventManager.send_event(events.SHOW_FULL_ACADEMIC_SESSION_FEE_CLICKED_TFI, {
      acadamicSession: nextValue,
      payment_type:
        formValues.paymentMethod !== 'select payment method'
          ? formValues.paymentMethod
          : null,
    })
    setDuration(nextValue)
  }

  const handleFinalPayment = () => {
    if (!submitFeesLoading) {
      setShowConfirmPopup(false)
      eventManager.send_event(events.PAYMENT_CONFIRMATION_POPUP_CLICKED_TFI, {
        student_id: studentId,
        amount: total,
        payment_type: formValues.paymentMethod,
        action: 'confirm',
        record_by: getRecoredByValueForEvents(collectFeeType),
        ...getValuesOfDiscountForEvents(
          lumpsumAmountDiscount,
          adHocDiscountReasons
        ),
      })
      const data = {
        ...collectFees,
        ...formValues,
        collectFeesDuration,
      }
      data.fine_amount = isFeeFineApplied ? parseFloat(+fineAmountValue) : 0

      const recordPaymentDetailForDownloadOrPrintReceipt = {
        studentId: collectFees?.Id,
        name: collectFees?.name,
        amount: getAmountFixDecimalWithCurrency(total, instituteInfo.currency),
        classroom: `${collectFees?.class} - ${collectFees?.section}`,
        paymentMode: formValues.paymentMethod,
      }

      // lumpsum amount data
      let lumpsumData = null
      if (collectFeeType === collectFeeOptionsIds.BY_LUMPSUM_AMOUNT) {
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

      dispatch(
        submitFeesRequestAction(studentId, data, studentDuesFilters, {
          adHocDiscountValuesArr,
          recordPaymentDetailForDownloadOrPrintReceipt,
          isFeeCollectedFromStudentProfile: collectFeeSlider?.isOpen,
          lumpsumData,
        })
      )
    }
  }

  const handleChange = (e) => {
    const {name, value} = e.target
    const formData = {...formValues}
    formData.classId = classId
    if (name === 'paymentMethod' && simplePaymentModes.includes(value)) {
      formData.transactionStatus = 'OFFLINE'
    }
    if (name === 'transactionStatus') {
      formData.transactionStatus = value
    }
    if (name === 'paymentMethod' && value !== paymentStatus.CASH) {
      formData.disbursalDate = null
      formData.referenceNumber = null
    }

    if (
      (name === 'paymentMethod' && value === paymentStatus.CHEQUE) ||
      (name === 'paymentMethod' && value === paymentStatus.DD)
    ) {
      setDisbursalDate(today)
      formData.disbursalDate = disbursalDate
    }
    formData[name] = value
    setFormValues(formData)
  }

  // Ad hoc function
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

  const handleAddAdHocDiscountValue = (params) => {
    let monthDetail = rowsData.find((row) => row.id === params.parentId)
    let feeTypeDetail = rowsData.find((row) => row.id === monthDetail.parentId)

    let recordedAdHoc = {
      ...params,
      studentId: collectFees.Id,
      studentName: collectFees.name,
      monthDetail: monthDetail ? monthDetail.name : '',
      feeTypeName: feeTypeDetail ? feeTypeDetail.name : '',
    }

    setRecordSelectedForAdHoc(recordedAdHoc)

    let adHocDiscountData = adHocDiscountValuesArr.find(
      (adHoc) => adHoc.childLevelId === params.id
    )

    if (adHocDiscountData) {
      setAdHocDiscountValues({
        ...adHocDiscountValues,
        ...adHocDiscountData,
      })
      setIsEditAdHocDiscount(true)

      eventManager.send_event(events.EDIT_AD_HOC_DISCOUNT_CLICKED_TFI, {
        fee_type: recordedAdHoc.name,
        student_id: studentId,
      })
    } else {
      setAdHocDiscountValues({
        ...adHocDiscountValues,
        childLevelId: params.id,
        isChecked: true,
        parentId: params.parentId,
        grandParentId: monthDetail.parentId,
      })

      eventManager.send_event(events.AD_HOC_DISCOUNT_CLICKED_TFI, {
        student_id: studentId,
      })
    }

    setIsAdHocModalOpen(true)
  }

  const handleChangeAdHocDiscountValue = (obj) => {
    let modalValue = false
    let adHocValues = {...adHocDiscountValues}
    if (obj.fieldName === 'discountAmount') {
      let value = obj.value !== '' && obj.value >= 0 ? +obj.value : ''
      let dueAmount =
        collectFeeType === collectFeeOptionsIds.BY_FEE_STRUCTURE
          ? recordSelectedForAdHoc?.due
          : +lumpsumAmount

      if (dueAmount < value) {
        value = ''
        setRecordSelectedForAdHoc({
          ...recordSelectedForAdHoc,
          discountAmountError:
            collectFeeType === collectFeeOptionsIds.BY_FEE_STRUCTURE ? (
              `Amount can't be more than due amount ${roundWithPrecision(
                dueAmount
              )}`
            ) : (
              <Trans i18nKey={'lumpsumpAmountErrorMsg'}>
                Lump sum can&quot;t be more than due fee{' '}
                <div className="inline-flex">
                  <span>
                    {getSymbolFromCurrency(
                      instituteInfo.currency || DEFAULT_CURRENCY
                    )}
                  </span>
                  <span className="ml-1">{`${getPlainAmountFixDecimalWithCurrency(
                    dueAmount,
                    instituteInfo.currency
                  )}`}</span>
                </div>
              </Trans>
            ),
        })
      } else if (recordSelectedForAdHoc?.discountAmountError) {
        setRecordSelectedForAdHoc({
          ...recordSelectedForAdHoc,
          discountAmountError: '',
        })
      }
      setAdHocDiscountValues({...adHocValues, discountAmount: value})
    } else if (obj.fieldName === 'remarks') {
      setAdHocDiscountValues({...adHocValues, remarks: obj.value})
    } else if (obj.fieldName === 'reason') {
      if (obj?.value === 'noneOfAbove') {
        modalValue = true
      } else if (isCreateReasonModalOpen) {
        modalValue = false
      }

      setAdHocDiscountValues({...adHocValues, adHocReasonId: obj.value})

      dispatch(
        setDiscountStatesAction({
          isCreateReasonModalOpen: modalValue,
        })
      )
    }
  }

  const handleAddAdHocDiscountClick = () => {
    // Fee structure
    let isRecord = adHocDiscountValuesArr.find(
      (adHoc) => adHoc.childLevelId === adHocDiscountValues.childLevelId
    )

    if (isRecord) {
      eventManager.send_event(events.UPDATE_ADD_HOC_DISCOUNT_CLICKED_TFI, {
        student_id: studentId,
        fee_type: recordSelectedForAdHoc?.name,
        reason: adHocDiscountValues?.remarks,
      })

      eventManager.send_event(events.AD_HOC_DISCOUNT_UPDATED_TFI, {
        student_id: studentId,
        fee_type: recordSelectedForAdHoc?.name,
        reason: adHocDiscountValues?.remarks,
      })
    } else {
      eventManager.send_event(events.ADD_ADHOC_DISCOUNT_CLICKED_TFI, {
        student_id: studentId,
        fee_type: recordSelectedForAdHoc?.name,
        reason: adHocDiscountValues?.remarks,
      })

      eventManager.send_event(events.ADHOC_DISCOUNT_ADDED_TFI, {
        student_id: studentId,
        fee_type: recordSelectedForAdHoc?.name,
        reason: adHocDiscountValues?.remarks,
      })
    }

    let newAdHocDiscountValues = adHocDiscountValuesArr.filter(
      (adHoc) => adHoc.childLevelId !== adHocDiscountValues.childLevelId
    )
    setAdHocDiscountValuesArr([
      ...newAdHocDiscountValues,
      {...adHocDiscountValues},
    ])

    setCollectFeesData(
      produce(collectFees, (draft) => {
        const rows = draft[collectFeesDuration]
        const row = rows.find((r) => r.id === recordSelectedForAdHoc.id)
        row.paid = (row.due - +adHocDiscountValues.discountAmount).toFixed(2)
        // row.discount += +adHocDiscountValues.discountAmount
        row.adHocDiscountAmount = +adHocDiscountValues.discountAmount

        refreshParent(row, rows)
        const parent = rows.find((r) => r.id === row.parentId)
        refreshParent(parent, rows)
        refreshTotal()
      })
    )

    const row = collectFees[collectFeesDuration].find(
      (r) => r.id === recordSelectedForAdHoc.id
    )
    setFormErrors(
      produce(formErrors, (draft) => {
        if (+adHocDiscountValues.discountAmount > row.fee)
          draft[recordSelectedForAdHoc.id] = 'Can not be more than total fees'
        else if (+adHocDiscountValues.discountAmount < 0)
          draft[recordSelectedForAdHoc.id] = 'Cannot be less than zero'
        else draft[recordSelectedForAdHoc.id] = null
      })
    )

    setIsAdHocModalOpen(false)
  }

  const handleCancleAddAdHocDiscount = () => {
    let isRecord = adHocDiscountValuesArr.find(
      (adHoc) => adHoc.childLevelId === adHocDiscountValues.childLevelId
    )
    if (isRecord) {
      eventManager.send_event(events.UPDATE_ADD_HOC_DISCOUNT_CLICKED_TFI, {
        student_id: studentId,
        fee_type: recordSelectedForAdHoc?.name,
        reason: adHocDiscountValues?.remarks,
        action: 'cancel',
      })
    } else {
      eventManager.send_event(events.ADD_ADHOC_DISCOUNT_CLICKED_TFI, {
        student_id: studentId,
        fee_type: recordSelectedForAdHoc?.name,
        reason: adHocDiscountValues?.remarks,
        action: 'cancel',
      })
    }
    setIsAdHocModalOpen(false)
  }

  const validate = (values) => {
    eventManager.send_event(events.RECORD_PAYMENT_CLICKED_TFI, {
      amount: total,
      payment_type: formValues.paymentMethod,
      record_by: getRecoredByValueForEvents(collectFeeType),
    })
    const errors = {...formErrors}
    errors.paymentMethod = !values.paymentMethod
      ? 'Payment method is required'
      : null
    errors.payDate = !values.payDate ? 'Pay date is required' : null
    return errors
  }

  const validateLumpSumAmountDiscount = () => {
    if (
      lumpsumAmountError?.isLumpErr ||
      lumpsumAmountDiscount?.error ||
      (lumpsumAmountDiscount?.isAdded && !lumpsumAmountDiscount?.reasonId)
    ) {
      return false
    }
    return true
  }

  const validateForm = () => {
    const errors = validate(formValues)
    if (Object.values(errors).filter((v) => v).length !== 0) {
      setFormErrors(errors)
      return false
    }

    if (!validateLumpSumAmountDiscount()) {
      return false
    }

    setShowConfirmPopup(true)
  }

  function getHeaderText() {
    const paymentMethods = formValues.paymentMethod
    const transactionStatus = formValues.transactionStatus
    if (simplePaymentModes.includes(paymentMethods)) {
      return (
        <p className={styles.confirmModalHeader}>
          {/* Confirm payment of <b>{getAmountFixDecimalWithCurrency(total)}</b> via */}
          Collect{' '}
          <b>
            {getAmountFixDecimalWithCurrency(total, instituteInfo.currency)}
          </b>{' '}
          via
          {' ' + t(paymentStatusLabels[paymentMethods].label)} from
          <b>{' ' + collectFees.name}</b>?
        </p>
      )
    }
    if (paymentMethods === paymentStatus.CHEQUE) {
      return (
        <p className={styles.confirmModalHeader}>
          {/* Confirm payment of <b>{getAmountFixDecimalWithCurrency(total, instituteInfo.currency)}</b> via */}
          Collect{' '}
          <b>
            {getAmountFixDecimalWithCurrency(total, instituteInfo.currency)}
          </b>{' '}
          via Cheque by <b>{collectFees.name}</b>?
        </p>
      )
    }
    if (paymentMethods === paymentStatus.DD) {
      return (
        <p className={styles.confirmModalHeader}>
          Collect{' '}
          <b>
            {getAmountFixDecimalWithCurrency(total, instituteInfo.currency)}
          </b>{' '}
          via DD by <b>{collectFees.name}</b>?
        </p>
      )
    }
    if (
      paymentMethods === paymentStatus.CHEQUE &&
      transactionStatus === transactionMethods.CLEARED
    ) {
      return (
        <p className={styles.confirmModalHeader}>
          Collect{' '}
          <b>
            {getAmountFixDecimalWithCurrency(total, instituteInfo.currency)}
          </b>
          Cheque by <b>{collectFees.name}</b>?
        </p>
      )
    }
    if (
      paymentMethods === paymentStatus.DD &&
      transactionStatus === transactionMethods.CLEARED
    ) {
      return (
        <p className={styles.confirmModalHeader}>
          Collect{' '}
          <b>
            {getAmountFixDecimalWithCurrency(total, instituteInfo.currency)}
          </b>{' '}
          via DD by <b>{collectFees.name}</b>?
        </p>
      )
    }
  }

  function getSubText() {
    const paymentMethods = formValues.paymentMethod
    const transactionStatus = formValues.transactionStatus
    if (
      simplePaymentModes.includes(paymentMethods) ||
      transactionStatus === transactionMethods.CLEARED
    ) {
      return (
        <p>
          Payment via {t(paymentStatusLabels[paymentMethods].label)} will be
          confirmed. Student will receive payment receipt in the app
        </p>
      )
    }
    if (
      (transactionStatus === '' ||
        transactionStatus === transactionMethods.RECEIVED) &&
      paymentMethods === paymentStatus.CHEQUE
    ) {
      return (
        <p>
          {t('chequeStatusWillBeMarkedAs')} {t('received')}
          {'. '}
          {t('afterAmountText')}
        </p>
      )
    }
    if (
      (transactionStatus === '' ||
        transactionStatus === transactionMethods.RECEIVED) &&
      paymentMethods === paymentStatus.DD
    ) {
      return (
        <p>
          {t('ddStatusWillBeMarkedAs')} {t('received')}
          {'. '}
          {t('afterAmountText')}
        </p>
      )
    }
  }

  const handleAppliedFineChecbox = (obj) => {
    setIsFeeFineApplied(obj.checked)
    if (obj.checked) {
      eventManager.send_event(events.RECORD_BY_ADD_DUE_FINE_TFI, {
        type: getRecoredByValueForEvents(collectFeeType),
      })
    } else {
      eventManager.send_event(events.RECORD_BY_DELETE_DUE_FINE_TFI, {
        type: getRecoredByValueForEvents(collectFeeType),
      })
    }
  }

  function dateFiledName() {
    const paymentMethods = formValues.paymentMethod
    if (paymentMethods === paymentStatus.CHEQUE || paymentStatus.DD)
      return 'Disbursal date'
  }

  const rowTypePaddingMap = {
    topLevel: 10,
    month: 30,
    childLevel: 50,
  }

  const isAdHocDiscountApplied = (rowData) => {
    return (
      adHocDiscountValuesArr.length > 0 &&
      adHocDiscountValuesArr.find((value) => value.childLevelId === rowData.id)
    )
  }

  const handleValidateLumpsumDiscount = (discountAmount = 0) => {
    let dueAmount = collectFees[`${collectFeesDuration}TotalDue`].toFixed(2)
    let totalofLumpsumAndDiscount = +lumpsumAmount + discountAmount
    // check if sum of lumpsum amount and discount amount can't be more than due amount
    // check if discount amount can't be more than due amount
    if (!discountAmount) {
      return {isSuccess: true, error: ''}
    }
    if (discountAmount > dueAmount) {
      return {isSuccess: false, error: t('discountCantBeMoreThanDueFee')}
    } else if (totalofLumpsumAndDiscount > dueAmount) {
      return {isSuccess: false, error: t('discountPlusLumpSumError')}
    } else {
      return {isSuccess: true, error: ''}
    }
  }

  const handleLumpsumAmountChange = (value) => {
    var validNumber = new RegExp(/^\d*\.?\d*$/)
    let dueAmount = collectFees[`${collectFeesDuration}TotalDue`]?.toFixed(2)
    let isValueValid = validNumber.test(value)
    let errorMsg = (
      <Trans i18nKey={'lumpsumpAmountErrorMsg'}>
        Lump sum can&quot;t be more than due fee{' '}
        <div className="inline-flex">
          <span>
            {getSymbolFromCurrency(instituteInfo.currency || DEFAULT_CURRENCY)}
          </span>
          <span className="ml-1">{`${getPlainAmountFixDecimalWithCurrency(
            dueAmount,
            instituteInfo.currency
          )}`}</span>
        </div>
      </Trans>
    )

    if (isValueValid) {
      if (
        lumpsumAmountDiscount?.isAdded &&
        lumpsumAmountDiscount?.discountAmount + +value < dueAmount &&
        lumpsumAmountDiscount?.error
      ) {
        setLumpsumAmountDiscount({
          ...lumpsumAmountDiscount,
          error: '',
        })
      } else if (
        lumpsumAmountDiscount?.isAdded &&
        lumpsumAmountDiscount?.discountAmount + +value > dueAmount
      ) {
        setLumpsumAmountError({
          ...lumpsumAmountError,
          isLumpErr: true,
          errorMsg: t('discountPlusLumpSumError'),
        })
      } else if (+value > dueAmount && !lumpsumAmountError?.isLumpErr) {
        setLumpsumAmountError({
          ...lumpsumAmountError,
          isLumpErr: true,
          errorMsg,
        })
      } else if (+value < dueAmount && lumpsumAmountError?.isLumpErr) {
        setLumpsumAmountError({
          ...lumpsumAmountError,
          isLumpErr: false,
          errorMsg: '',
        })
      }
    }

    setLumpsumAmount(value)
  }

  const handleRemoveLumpsumDiscount = () => {
    setLumpsumAmountDiscount(null)
  }

  const handleAddRemoveLumpsumDiscount = (
    addOrRemove = LUMPSUM_DISCOUNT.ADD
  ) => {
    if (addOrRemove === LUMPSUM_DISCOUNT.ADD) {
      setLumpsumAmountDiscount({...lumpsumAmountDiscount, isAdded: true})
      eventManager.send_event(events.RECORD_BY_ADD_DISCOUNT_TFI, {
        type: getRecoredByValueForEvents(collectFeeType),
      })
    } else if (addOrRemove === LUMPSUM_DISCOUNT.REMOVE) {
      eventManager.send_event(events.RECORD_BY_DELETE_DISCOUNT_TFI, {
        type: getRecoredByValueForEvents(collectFeeType),
        ...getValuesOfDiscountForEvents(
          lumpsumAmountDiscount,
          adHocDiscountReasons
        ),
      })
      setLumpsumAmountDiscount(null)
    }
  }

  const rows = rowsData.map((row, idx) => ({
    feeStructure: (
      <div style={{paddingLeft: rowTypePaddingMap[row.type]}}>
        <span onClick={() => handleExpandClick(row.id)} className={styles.icon}>
          <img
            src={
              row.type === 'childLevel'
                ? ''
                : row.childrenShowing
                ? 'https://storage.googleapis.com/tm-assets/icons/primary/down-arrow-primary.svg'
                : 'https://storage.googleapis.com/tm-assets/icons/primary/right-arrow-primary.svg'
            }
          />
        </span>
        <input
          type="checkbox"
          className="mr-1"
          checked={row.selected}
          onChange={(e) => handleCheckboxClick(e, row.id)}
        />
        <span>{row.name}</span>
      </div>
    ),
    totalFees: getAmountFixDecimalWithCurrency(row.fee, instituteInfo.currency),
    discount: (
      <div className={styles.discountValueSection}>
        {getAmountFixDecimalWithCurrency(
          typeof row.adHocDiscountAmount !== 'undefined'
            ? row.discount + row.adHocDiscountAmount
            : row.discount,
          instituteInfo.currency
        )}{' '}
        {row.selected && row.type === 'childLevel' && (
          <>
            {!isAdHocDiscountApplied(row) ? (
              <>
                <span
                  className={classNames(
                    styles.adHocDiscountAddBtn,
                    styles.adHocDiscountAddBtnIconRotate
                  )}
                  onClick={() => handleAddAdHocDiscountValue(row)}
                >
                  <a data-tip data-for={`tooltip${idx}`}>
                    <span>
                      <Icon
                        color="secondary"
                        name={'circledClose'}
                        size="xxs"
                        type="outlined"
                        className={styles.adHocDiscountAddBtn}
                      />
                    </span>
                  </a>
                </span>
                <Tooltip
                  toolTipId={`tooltip${idx}`}
                  className={styles.adOnDiscountSection}
                >
                  <span>+ {t('adOnDiscount')}</span>
                </Tooltip>
              </>
            ) : (
              <>
                <span
                  className={classNames(styles.adHocDiscountAddBtn)}
                  onClick={() => handleAddAdHocDiscountValue(row)}
                >
                  <a data-tip data-for={`tooltip${idx}`}>
                    <span>
                      <Icon
                        color="secondary"
                        name={'edit1'}
                        size="xxs"
                        type="outlined"
                      />
                    </span>
                  </a>
                </span>
                <Tooltip
                  toolTipId={`tooltip${idx}`}
                  className={styles.adOnDiscountSection}
                >
                  <span>{t('editAdOnDiscount')}</span>
                </Tooltip>
              </>
            )}
          </>
        )}
      </div>
    ),
    dueAmount: (
      <>
        <span className={classNames(styles.dueAmount, styles.tableDueAmount)}>
          {getAmountFixDecimalWithCurrency(row.due, instituteInfo.currency)}
        </span>
      </>
    ),
    amountPaid:
      row.selected && row.type === 'childLevel' ? (
        <>
          <div className={styles.textData}>
            <span className={styles.currency}>
              {getSymbolFromCurrency(
                instituteInfo.currency || DEFAULT_CURRENCY
              )}
            </span>
            <input
              className={classNames('w-48', styles.textInput)}
              type="number"
              // value={row.paid}
              value={roundWithPrecision(row.paid)}
              name={'amount'}
              maxLength={7}
              onChange={(e) => handleInputChange(e, row.id)}
            />
          </div>
          <div className={classNames(styles.error, styles.errorMsg)}>
            {formErrors[row.id]}
          </div>
        </>
      ) : (
        <span className="w-48 px-2 py-1 block">
          {getAmountFixDecimalWithCurrency(row.paid, instituteInfo.currency)}
        </span>
      ),
    hidden: row.hidden,
  }))

  return (
    <div className={styles.studentDetails}>
      {isAdHocModalOpen && (
        <AdHocDiscountModal
          isShowOpen={isAdHocModalOpen}
          handleCancleAddAdHocDiscount={handleCancleAddAdHocDiscount}
          adHocDiscountReasons={adHocDiscountReasons}
          selectedReasons={selectedReasons}
          setSelectedReasons={setSelectedReasons}
          isCreateReasonModalOpen={isCreateReasonModalOpen}
          recordSelectedForAdHoc={recordSelectedForAdHoc}
          handleAddAdHocDiscountClick={handleAddAdHocDiscountClick}
          adHocDiscountValues={adHocDiscountValues}
          handleChangeAdHocDiscountValue={handleChangeAdHocDiscountValue}
          resetAdHocValues={resetAdHocValues}
          setAdHocDiscountValues={setAdHocDiscountValues}
          isEditAdHocDiscount={isEditAdHocDiscount}
          collectFeeType={collectFeeType}
        />
      )}

      <div
        className={classNames(
          styles.feeHistory,
          'show-scrollbar show-scrollbar-big'
        )}
      >
        <div className={styles.contentSection}>
          <StudentInfo
            collectFees={collectFees}
            collectFeesDuration={collectFeesDuration}
            advancePaymentStatus={advancePaymentStatus}
            handleDurationChange={handleDurationChange}
          />

          <div>
            <Heading textSize="x_s" className={styles.recordBy}>
              {t('recordBy')}
            </Heading>
            <div
              className={classNames(styles.radioDiv, styles.higherSpecificity)}
            >
              {collectFeeOptions.map((radio, idx) => (
                <Radio
                  key={radio.key}
                  fieldName={radio.key}
                  handleChange={(obj) => {
                    eventManager.send_event(events.RECORD_BY_TYPE_TFI, {
                      type: getRecoredByValueForEvents(obj.fieldName),
                    })
                    setCollectFeeType(obj.fieldName)
                  }}
                  isSelected={collectFeeType === radio.key}
                  label={radio.label}
                  classes={{
                    wrapper: classNames(
                      styles.radioDiv,
                      styles.higherSpecificity,
                      {[styles.firstRadioMarginZero]: idx === 0}
                    ),
                    radio: classNames(
                      styles.radioDiv,
                      styles.higherSpecificity
                    ),
                    label: classNames(
                      styles.radioSpan,
                      styles.higherSpecificity
                    ),
                  }}
                />
              ))}
            </div>
          </div>

          {/*  HEAD
              <div
                className={classNames({
                  [styles.feeCount]: !parseInt(total),
                })}
              >
                {showFooter && (
                  <StickyFooter forSlider={true}>
                    <div>
                      <div className="pull-right">
                        <Button
                          onClick={(e) => {
                            e.preventDefault()
                            if (
                              formValues.paymentMethod !==
                              paymentStatus.SELECT_PAYMENT_METHOD
                            ) {
                              validateForm()
                            }
                          }}
                          disabled={
                            formValues.paymentMethod ===
                            paymentStatus.SELECT_PAYMENT_METHOD
                          }
                          className={
                            formValues.paymentMethod !==
                            paymentStatus.SELECT_PAYMENT_METHOD
                              ? styles.paidButton
                              : styles.disabledButton
                          }
                        >
                          {t('collectFeeOf')}{' '}
                          {getAmountFixDecimalWithCurrency(total)}
                        </Button>
                      </div>
                    </div>
                  </StickyFooter>
                )}
              </div>
              {(showConfirmPopup || submitFeesLoading) &&
                formValues.paymentMethod !==
                  paymentStatus.SELECT_PAYMENT_METHOD && (
                  <ConfirmationPopup
                    onClose={() => {
                      eventManager.send_event(
                        events.PAYMENT_CONFIRMATION_POPUP_CLICKED_TFI,
                        {
                          student_id: studentId,
                          amount: total,
                          payment_type: formValues.paymentMethod,
                          action: 'decline',
                        }
                      )
                      setShowConfirmPopup(false)
                    }}
                    onAction={handleFinalPayment}
                    icon={
                      (formValues.transactionStatus !==
                        transactionMethods.CLEARED &&
                        formValues.paymentMethod !==
                          paymentStatus.SELECT_PAYMENT_METHOD &&
                        formValues.paymentMethod === paymentStatus.CHEQUE) ||
                      (formValues.transactionStatus !==
                        transactionMethods.CLEARED &&
                        formValues.paymentMethod !==
                          paymentStatus.SELECT_PAYMENT_METHOD &&
                        formValues.paymentMethod === paymentStatus.DD)
                        ? 'https://storage.googleapis.com/tm-assets/icons/colorful/warning-orange.svg'
                        : 'https://storage.googleapis.com/tm-assets/icons/colorful/tick-bg-green.svg'
jjj*/}
          <Divider length="100%" spacing="20px" thickness="1px" />

          {collectFees[`${collectFeesDuration}TotalDue`] > 0 ||
          (collectFees !== null && collectFees?.fine?.due > 0) ? (
            <div>
              {collectFeeType === collectFeeOptionsIds.BY_FEE_STRUCTURE && (
                <div className={styles.studentFeeData}>
                  <Table rows={rows} cols={cols} />
                </div>
              )}

              {/* LUMPSUM AMOUNT */}
              {collectFeeType === collectFeeOptionsIds.BY_LUMPSUM_AMOUNT && (
                <>
                  <Heading textSize="x_s">{t('amountDetails')}</Heading>
                  <LumpSumAmount
                    handleLumpsumAmountChange={handleLumpsumAmountChange}
                    handleValidateLumpsumDiscount={
                      handleValidateLumpsumDiscount
                    }
                    lumpsumAmount={lumpsumAmount}
                    lumpsumAmountDiscount={lumpsumAmountDiscount}
                    setIsAdHocModalOpen={setIsAdHocModalOpen}
                    handleRemoveLumpsumDiscount={handleRemoveLumpsumDiscount}
                    lumpsumAmountError={lumpsumAmountError}
                    dueAmount={collectFees[`${collectFeesDuration}TotalDue`]}
                    handleAddRemoveLumpsumDiscount={
                      handleAddRemoveLumpsumDiscount
                    }
                    setLumpsumAmountDiscount={setLumpsumAmountDiscount}
                    isCreateReasonModalOpen={isCreateReasonModalOpen}
                    handleChangeAdHocDiscountValue={
                      handleChangeAdHocDiscountValue
                    }
                    adHocDiscountValues={adHocDiscountValues}
                    adHocDiscountReasons={adHocDiscountReasons}
                  />
                </>
              )}
              {/* FINE DATA */}
              {collectFees?.fine && collectFees.fine.due > 0 && (
                <FeeFineData
                  fineData={collectFees.fine}
                  formValues={formValues}
                  handleAppliedFineChecbox={handleAppliedFineChecbox}
                  isFeeFineApplied={isFeeFineApplied}
                  fineAmountValue={fineAmountValue}
                  setFineAmountValue={setFineAmountValue}
                  refreshTotal={refreshTotal}
                />
              )}

              <Divider length="100%" spacing="20px" thickness="1px" />

              <Heading textSize="x_s">{t('paymentInformation')}</Heading>

              <FormFields
                handleChange={handleChange}
                formValues={formValues}
                simplePaymentModes={simplePaymentModes}
                formErrors={formErrors}
                dateFiledName={dateFiledName}
                handleDisbursalDate={handleDisbursalDate}
                handleStartDate={handleStartDate}
                instituteInfo={instituteInfo}
              />

              <form>
                <Input
                  fieldName="optionalData"
                  onChange={(obj) =>
                    handleChange({
                      target: {name: obj.fieldName, value: obj.value},
                    })
                  }
                  placeholder={
                    formValues?.paymentMethod &&
                    formValues?.paymentMethod !== 'select payment method' &&
                    paymentStatusLabels[formValues.paymentMethod].placeholder
                  }
                  rows={3}
                  title={t('additionalNote')}
                  type="textarea"
                  value={formValues.optionalData}
                  classes={{wrapper: styles.optionalDataComp}}
                />

                <div
                  className={classNames({
                    [styles.feeCount]: !parseInt(total),
                  })}
                >
                  {showFooter && (
                    <StickyFooter forSlider={true}>
                      <div>
                        <div className="pull-right">
                          <Button
                            onClick={(e) => {
                              e.preventDefault()
                              if (
                                formValues.paymentMethod !==
                                paymentStatus.SELECT_PAYMENT_METHOD
                              ) {
                                validateForm()
                              }
                            }}
                            disabled={disabledBtn}
                            className={classNames({
                              [styles.disabledButton]: disabledBtn,
                              [styles.paidButton]: !disabledBtn,
                            })}
                          >
                            {t('collect')}{' '}
                            {getAmountFixDecimalWithCurrency(
                              collectFeeOptions ===
                                collectFeeOptionsIds.BY_LUMPSUM_AMOUNT
                                ? lumpsumAmount ?? 0
                                : total,
                              instituteInfo.currency
                            )}
                          </Button>
                        </div>
                      </div>
                    </StickyFooter>
                  )}
                </div>
                {(showConfirmPopup || submitFeesLoading) &&
                  formValues.paymentMethod !==
                    paymentStatus.SELECT_PAYMENT_METHOD && (
                    <ConfirmationPopup
                      onClose={() => {
                        eventManager.send_event(
                          events.PAYMENT_CONFIRMATION_POPUP_CLICKED_TFI,
                          {
                            student_id: studentId,
                            amount: total,
                            payment_type: formValues.paymentMethod,
                            action: 'decline',
                            record_by:
                              getRecoredByValueForEvents(collectFeeType),
                            ...getValuesOfDiscountForEvents(
                              lumpsumAmountDiscount,
                              adHocDiscountReasons
                            ),
                          }
                        )
                        setShowConfirmPopup(false)
                      }}
                      onAction={handleFinalPayment}
                      icon={
                        (formValues.transactionStatus !==
                          transactionMethods.CLEARED &&
                          formValues.paymentMethod !==
                            paymentStatus.SELECT_PAYMENT_METHOD &&
                          formValues.paymentMethod === paymentStatus.CHEQUE) ||
                        (formValues.transactionStatus !==
                          transactionMethods.CLEARED &&
                          formValues.paymentMethod !==
                            paymentStatus.SELECT_PAYMENT_METHOD &&
                          formValues.paymentMethod === paymentStatus.DD)
                          ? 'https://storage.googleapis.com/tm-assets/icons/colorful/warning-orange.svg'
                          : 'https://storage.googleapis.com/tm-assets/icons/colorful/tick-bg-green.svg'
                      }
                      title={getHeaderText()}
                      desc={getSubText()}
                      primaryBtnText={t('cancel')}
                      secondaryBtnText={t('collect')}
                      closeOnBackgroundClick={false}
                    />
                  )}
              </form>
            </div>
          ) : (
            <div>
              <p className={styles.textCenterData}>
                No fees data found for this student
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CollectFees
