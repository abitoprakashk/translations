import {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {
  getAmountFixDecimalWithCurrency,
  numDifferentiation,
} from '../../../../utils/Helpers'
import {getFeeStatistics} from '../../../../redux/actions/instituteInfoActions'
import ClassFeeSummary from '../ClassFeeSummary/ClassFeeSummary'
import styles from './FeeCollection.module.css'
import SearchBar from '../SearchBar/SearchBar'
import {
  useFeeCollection,
  useInstituteId,
} from '../../redux/feeCollectionSelectors'
import {
  fetchFeeStatsRequestedAction,
  feeReminderRequestedAction,
  fetchStudentIdsForFeeReminderAction,
  setIsTransactionZeroPopupAlreadyShownAction,
} from '../../redux/feeCollectionActions'
import {useActiveAcademicSessionId} from '../../../../utils/CustomHooks/AcademicSessionHook'
import {INSTITUTE_HIERARCHY_TYPES} from '../../fees.constants'
import {ErrorBoundary, ErrorOverlay, Input} from '@teachmint/common'
import {fetchAdHocDiscountListingRequestAction} from '../../redux/feeDiscountsActions'
import SendFeeReminderConfirmationPopup from '../SendFeeReminderConfirmationPopup/SendFeeReminderConfirmationPopup'
import {events} from '../../../../utils/EventsConstants'
import ZeroTransactionPopup from './components/ZeroTransactionPopup/ZeroTransactionPopup'
import {useFeeStructure} from '../../redux/feeStructure/feeStructureSelectors'
import {
  fetchFeeSettingRequestAction,
  fetchFeeStructuresRequestedAction,
} from '../../redux/feeStructure/feeStructureActions'
import ReceiptPreviewModal from '../ReceiptPreviewModal/ReceiptPreviewModal'
import FeeCollectionHeaderButtons from '../FeeCollectionHeaderButtons/FeeCollectionHeaderButtons'
import {useStudentProfileFeeTabSummarySelector} from '../../../../components/SchoolSystem/StudentDirectory/redux/selectros/feeTabSelectors'
import HistorySection from '../FeeHistory/HistorySection'
import CollectBackdatedPaymentModal from '../StudentDues/CollectBackdatedPaymentModal/CollectBackdatedPaymentModal'
import {Button} from '@teachmint/krayon'
import Permission from '../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'

const FeeCollection = () => {
  const instituteId = useInstituteId()
  const academicSessionId = useActiveAcademicSessionId()
  const {
    stats,
    statsLoading,
    stateErrMsg,
    feesReminderLoading,
    feesReminderErrorMsg,
    studentIdsForFeeReminder,
    isTransactionZeroPopupAlreadyShown,
    recordPaymentDetails,
    submitFees,
  } = useFeeCollection()

  const {instituteHierarchy, eventManager, feeStatistics, instituteInfo} =
    useSelector((state) => state)
  const {feeSettings} = useSelector((state) => state.feeStructure)
  const {collect_payment} = feeSettings
  const [showPopup, setShowPopup] = useState(false)
  const [classWithNonZeroDue, setClassWithNonZeroDue] = useState({
    classIds: [],
    classNames: [],
  })
  const {feeStructures} = useFeeStructure()
  const {data: studentProfileFeeTabSummaryData} =
    useStudentProfileFeeTabSummarySelector()
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const [showIsZeroTransactionPopupShown, setShowIsZeroTransactionPopupShown] =
    useState(false)

  const [selectedFeeFilterOption, setSelectedFilterOption] =
    useState('total_annual_fee')

  // Collect Backdated Payment
  const [isBackdatedPaymentModalOpen, setIsBackdatedPaymentModalOpen] =
    useState(false)
  // ---

  useEffect(() => {
    dispatch(getFeeStatistics())
  }, [])

  useEffect(() => {
    if (instituteId && academicSessionId) {
      if (Object.keys(feeStructures.structureView).length === 0) {
        dispatch(fetchFeeStructuresRequestedAction())
      }
      if (Object.keys(feeSettings).length === 0) {
        dispatch(fetchFeeSettingRequestAction())
      }
      dispatch(fetchFeeStatsRequestedAction())
      dispatch(fetchAdHocDiscountListingRequestAction())
    }
  }, [instituteId, academicSessionId])

  useEffect(() => {
    const classWithNonZeroDueData = {
      classIds: [],
      classNames: [],
    }
    stats.map((c) => {
      if (c.totalAmountDue !== 0) {
        classWithNonZeroDueData.classIds.push(c.classId)
        classWithNonZeroDueData.classNames.push(c.className)
      }
    })
    setClassWithNonZeroDue(classWithNonZeroDueData)
  }, [stats])

  // remove this "zeroTransactionPopup" if you want to use this functioanlity in futrue
  const zeroTransactionPopup = false
  useEffect(() => {
    if (
      zeroTransactionPopup &&
      !isTransactionZeroPopupAlreadyShown &&
      stats.length > 0 &&
      Object.keys(feeStructures.structureView).length &&
      stats.every((stat) => stat.totalPaid === 0)
    ) {
      dispatch(setIsTransactionZeroPopupAlreadyShownAction(true))
      setShowIsZeroTransactionPopupShown(true)
    }
  }, [stats, feeStructures])

  // Collect backdated payment function
  const handleOpenCloseBackdatedPaymentModal = (openOrClose) => {
    if (!openOrClose) {
      eventManager.send_event(events.FEE_BACKDATED_CLOSE_BUTTON_TFI, {
        screen_name: 'fee_collection',
      })
    }
    setIsBackdatedPaymentModalOpen(openOrClose)
  }
  // end Collect backdated payment function

  if (statsLoading || !instituteHierarchy) {
    return <div className="loading" />
  }

  const classCategories = []
  instituteHierarchy?.children?.map((dept) => {
    if (dept.type === INSTITUTE_HIERARCHY_TYPES.DEPARTMENT) {
      classCategories.push({
        subCategoryName: dept.name,
        classes: dept.children?.map((std) => {
          return std.name
        }),
      })
    }
  })

  const statsCategorized = classCategories.map((c) => ({
    ...c,
    classes: c.classes.map((className) =>
      stats.find((cl) => cl['className'] === className)
    ),
    showCategory: !!c.classes.filter((className) =>
      stats.find((cl) => cl['className'] === className)
    ).length,
  }))

  const feeStatisticsValue = {
    payable_amount:
      selectedFeeFilterOption == 'applicable_till_date'
        ? feeStatistics.payable_amount
        : feeStatistics.total_payable,
    discount_amount:
      selectedFeeFilterOption == 'applicable_till_date'
        ? feeStatistics.discount_amount
        : feeStatistics.total_discount,
    paid_amount:
      selectedFeeFilterOption == 'applicable_till_date'
        ? feeStatistics.paid_amount
        : feeStatistics.total_paid,
    due_amount:
      selectedFeeFilterOption == 'applicable_till_date'
        ? feeStatistics.due_amount
        : feeStatistics.total_due,
  }

  const attendanceItems = [
    {
      label: t('totalApplicable'),
      amount: feeStatisticsValue.payable_amount
        ? numDifferentiation(
            feeStatisticsValue.payable_amount,
            instituteInfo.currency
          )
        : numDifferentiation(0, instituteInfo.currency),
      value: feeStatisticsValue.payable_amount
        ? getAmountFixDecimalWithCurrency(
            feeStatisticsValue.payable_amount,
            instituteInfo.currency
          )
        : getAmountFixDecimalWithCurrency(0, instituteInfo.currency),
      className: styles.payableAmount,
    },
    {
      label: t('discountApplied'),
      amount: feeStatisticsValue.discount_amount
        ? numDifferentiation(
            feeStatisticsValue.discount_amount,
            instituteInfo.currency
          )
        : numDifferentiation(0, instituteInfo.currency),
      value: feeStatisticsValue.discount_amount
        ? getAmountFixDecimalWithCurrency(
            feeStatisticsValue.discount_amount,
            instituteInfo.currency
          )
        : getAmountFixDecimalWithCurrency(0, instituteInfo.currency),
      className: styles.discountAmount,
    },
    {
      label: t('paidFee'),
      amount: feeStatisticsValue.paid_amount
        ? numDifferentiation(
            feeStatisticsValue.paid_amount,
            instituteInfo.currency
          )
        : numDifferentiation(0, instituteInfo.currency),
      value: feeStatisticsValue.paid_amount
        ? getAmountFixDecimalWithCurrency(
            feeStatisticsValue.paid_amount,
            instituteInfo.currency
          )
        : getAmountFixDecimalWithCurrency(0, instituteInfo.currency),
      className: styles.paidAmount,
    },
    {
      label:
        selectedFeeFilterOption == 'applicable_till_date'
          ? t('overdueFee')
          : t('dueFee'),
      amount: feeStatisticsValue.due_amount
        ? numDifferentiation(
            feeStatisticsValue.due_amount,
            instituteInfo.currency
          )
        : numDifferentiation(0, instituteInfo.currency),
      value: feeStatisticsValue.due_amount
        ? getAmountFixDecimalWithCurrency(
            feeStatisticsValue.due_amount,
            instituteInfo.currency
          )
        : getAmountFixDecimalWithCurrency(0, instituteInfo.currency),
      className: styles.dueAmount,
    },
  ]

  const feeFilterOptions = [
    {
      value: 'applicable_till_date',
      label: t('applicableTillDate'),
    },
    {
      value: 'total_annual_fee',
      label: t('totalAnnualFee'),
    },
  ]
  const handleSendReminder = () => {
    dispatch(
      feeReminderRequestedAction(
        studentIdsForFeeReminder.studentIds.student_ids
      )
    )
    setShowPopup(false)
    eventManager.send_event(events.FEE_REMINDER_SENT_TFI, {
      screen_name: 'fee_collection',
      standard_id: classWithNonZeroDue.classIds,
      standard_name: classWithNonZeroDue.classNames,
      action: 'confirm',
    })
  }

  const handleReminderCloseClick = () => {
    setShowPopup(false)
    eventManager.send_event(events.FEE_REMINDER_SENT_TFI, {
      screen_name: 'fee_collection',
      standard_id: classWithNonZeroDue.classIds,
      standard_name: classWithNonZeroDue.classNames,
      action: 'cancel',
    })
  }

  const handleSendReminderButtonClick = () => {
    setShowPopup(true)
    dispatch(fetchStudentIdsForFeeReminderAction())
    eventManager.send_event(events.FEE_SEND_REMINDER_CLICKED_TFI, {
      screen_name: 'fee_collection',
      standard_id: classWithNonZeroDue.classIds,
      standard_name: classWithNonZeroDue.classNames,
    })
  }

  return (
    <>
      {showIsZeroTransactionPopupShown && (
        <ZeroTransactionPopup
          isOpen={showIsZeroTransactionPopupShown}
          setIsOpen={setShowIsZeroTransactionPopupShown}
        />
      )}

      {Object.keys(studentProfileFeeTabSummaryData).length === 0 && (
        <ReceiptPreviewModal
          isOpen={recordPaymentDetails?.isPopupOpen}
          recordPaymentDetails={recordPaymentDetails}
          receiptIds={submitFees?.receipts}
          submitFees={submitFees}
        />
      )}
      {/* Collect backdated payment */}
      {isBackdatedPaymentModalOpen && (
        <CollectBackdatedPaymentModal
          isOpen={isBackdatedPaymentModalOpen}
          handleOpenCloseBackdatedPaymentModal={
            handleOpenCloseBackdatedPaymentModal
          }
        />
      )}

      <div className="tm-box-shadow1 tm-border-radius1 p-4 bg-white my-3">
        <div className={styles.topBarWrapper}>
          <div className={styles.topBarItem}>
            <SearchBar />
          </div>
        </div>
        {stateErrMsg && <ErrorOverlay>{stateErrMsg}</ErrorOverlay>}
        <ErrorBoundary>
          <div className={styles.feeCollectionOptions}>
            <div className={styles.overviewText}>Overview</div>
            <div className={styles.headerButtons}>
              <Input
                type="select"
                fieldName="feeFilterType"
                value={selectedFeeFilterOption}
                options={feeFilterOptions}
                onChange={(e) => {
                  eventManager.send_event(
                    events.FEE_COLLECTION_DATE_FILTER_CLICKED_TFI,
                    {
                      screen_name: 'fee_collection_overview',
                      date_type: e.value,
                      class_id: null,
                    }
                  )
                  setSelectedFilterOption(e.value)
                }}
                classes={{wrapper: styles.inputWrapper}}
                className={styles.dropdown}
              />
              {collect_payment?.backdated_payment?.settings?.backdated_payment
                ?.status && (
                <div>
                  <Permission
                    permissionId={
                      PERMISSION_CONSTANTS.feeModuleController_collectBulkPayment_create
                    }
                  >
                    <Button
                      classes={{
                        button: styles.backdatedBtnWrapper,
                        label: styles.textCapitalize,
                      }}
                      onClick={() => {
                        eventManager.send_event(
                          events.FEE_COLLECT_BACKDATED_BUTTON_CLICKED_TFI
                        )
                        handleOpenCloseBackdatedPaymentModal(true)
                      }}
                      type="outline"
                    >
                      {t('uploadBackdatedPayment')}
                    </Button>
                  </Permission>
                </div>
              )}
              <FeeCollectionHeaderButtons
                handleSendReminderButtonClick={handleSendReminderButtonClick}
              />
            </div>
          </div>
          <div className="bg-white my-3 tm-border-radius1 tm-box-shadow1">
            <div className={styles.feeDetails}>
              {attendanceItems.map((detail, i) => {
                return <HistorySection key={i} feeDetail={detail} />
              })}
            </div>
          </div>
          {statsCategorized.map((subCategory, i) => (
            <div
              key={i}
              className={`${styles.feeSummaryWrapper} ${
                subCategory.showCategory ? '' : 'hidden'
              }`}
            >
              <div className={styles.subCategory}>
                {subCategory.subCategoryName}
              </div>

              <div className={styles.summaryData}>
                {subCategory.classes.map((classData, i) => (
                  <ClassFeeSummary
                    key={i}
                    {...classData}
                    selectedFeeFilterOption={selectedFeeFilterOption}
                  />
                ))}
              </div>
            </div>
          ))}
          {feesReminderErrorMsg ? (
            <ErrorOverlay>{feesReminderErrorMsg}</ErrorOverlay>
          ) : showPopup || feesReminderLoading ? (
            <SendFeeReminderConfirmationPopup
              getStudentIdsLoader={studentIdsForFeeReminder.showLoader}
              setShowPopup={handleReminderCloseClick}
              handleSendReminder={handleSendReminder}
              studentCount={
                studentIdsForFeeReminder?.studentIds?.student_ids?.length
              }
              feesReminderLoading={feesReminderLoading}
              isClassLevel={false}
            />
          ) : null}
        </ErrorBoundary>
      </div>
    </>
  )
}

export default FeeCollection
