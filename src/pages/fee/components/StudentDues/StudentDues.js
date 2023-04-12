import classNames from 'classnames'
import {useEffect, useMemo, useRef, useState} from 'react'
import styles from './StudentDues.module.css'
import {useTranslation} from 'react-i18next'
import {Table, ErrorOverlay, Input, Chip} from '@teachmint/common'
import {Icon, ICON_CONSTANTS} from '@teachmint/krayon'
import userDefaultIcon from '../../../../assets/images/icons/user-profile.svg'
import {useDispatch, useSelector} from 'react-redux'
import StudentFilters from '../StudentFIlters/StudentFilters'
import {Link, useLocation} from 'react-router-dom'
import classnames from 'classnames'
import {
  SliderScreens,
  STUDENT_DUES_TOOLTIP_OPTIONS,
  STUDENT_DUES_TOOLTIP_OPTION_IDS,
} from '../../fees.constants'
import {useFeeCollection} from '../../redux/feeCollectionSelectors'
import SendFeeReminderConfirmationPopup from '../SendFeeReminderConfirmationPopup/SendFeeReminderConfirmationPopup'
import {
  feeHistoryTabFalseActions,
  feeReminderRequestedAction,
  setSliderScreenAction,
  setStudentDuesFiltersAction,
  studentDuesRequestedAction,
} from '../../redux/feeCollectionActions'
import {useHistory} from 'react-router-dom'
import {
  camelCaseText,
  getAmountFixDecimalWithCurrency,
  numDifferentiation,
} from '../../../../utils/Helpers'
import {INSTITUTE_HIERARCHY_TYPES} from '../../fees.constants'
import {useOutsideClickHandler} from '@teachmint/common'
import ErrorBoundary from '../../../../components/ErrorBoundary/ErrorBoundary'
import {events} from '../../../../utils/EventsConstants'
import {useInstituteId} from '../../redux/feeStructure/feeStructureSelectors'
import {useActiveAcademicSessionId} from '../../../../utils/CustomHooks/AcademicSessionHook'
import HistorySection from '../FeeHistory/HistorySection'
import feeCollectionActionTypes from '../../redux/feeCollectionActionTypes'
import SubjectTooltipOptions from '../../../../components/SchoolSystem/SectionDetails/SubjectTooltipOptions'
import FeeCollectionHeaderButtons from '../FeeCollectionHeaderButtons/FeeCollectionHeaderButtons'
import ReceiptPreviewModal from '../ReceiptPreviewModal/ReceiptPreviewModal'
import {useStudentProfileFeeTabSummarySelector} from '../../../../components/SchoolSystem/StudentDirectory/redux/selectros/feeTabSelectors'
import Permission from '../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'
import filterBlue from '../../../../assets/images/icons/filterBlue.svg'
import filterWhite from '../../../../assets/images/icons/filter.svg'

const useQuery = () => {
  const {search} = useLocation()
  return useMemo(() => new URLSearchParams(search), [search])
}

const StudentDues = () => {
  const {
    instituteHierarchy,
    instituteInfo,
    eventManager,
    instituteActiveAcademicSessionId,
  } = useSelector((state) => state)
  const studentsList = useSelector((state) => state.instituteStudentList)
  const instituteId = useInstituteId()
  const {t} = useTranslation()
  const academicSessionId = useActiveAcademicSessionId()
  const query = useQuery()
  const studentClass = query.get('class')
  const classId = query.get('classId')
  const {
    studentDuesFilters: filters,
    studentDues,
    studentDuesLoading,
    feesReminderLoading,
    feeHistortyTab,
    studentDueErrMsg,
    feesReminderErrorMsg,
    recordPaymentDetails,
    submitFees,
  } = useFeeCollection()
  const {data: studentProfileFeeTabSummaryData} =
    useStudentProfileFeeTabSummarySelector()
  const [selectedFeeFilterOption, setSelectedFilterOption] =
    useState('total_annual_fee')

  const history = useHistory()

  const sections = []
  if (instituteHierarchy) {
    instituteHierarchy?.children?.map((dept) => {
      if (dept.type === INSTITUTE_HIERARCHY_TYPES.DEPARTMENT) {
        dept?.children?.map((sec) => {
          if (sec.id === classId) {
            sec?.children?.map((sec2) => {
              if (sec2.type === INSTITUTE_HIERARCHY_TYPES.SECTION) {
                sections.push({
                  id: sec2.id,
                  name: studentClass + ' - ' + sec2.name,
                })
              }
            })
          }
        })
      }
    })
  }

  const [showDropDown, setShowDropDown] = useState(false)
  const [academicSessionIdState] = useState(academicSessionId)
  const [instituteIdState] = useState(instituteId)
  const [searchTerm, setSearchTerm] = useState('')

  const ref = useRef(null)
  useOutsideClickHandler(ref, () => {
    setShowDropDown(false)
  })
  const dispatch = useDispatch()
  const [showPopup, setShowPopup] = useState(false)
  const [singleStudentfeeReminder, setSingleStudentfeeReminder] =
    useState(false)

  useEffect(() => {
    if (
      academicSessionIdState !== academicSessionId ||
      instituteIdState !== instituteId
    ) {
      history.push('/institute/dashboard/fees/collection')
    }
  }, [instituteId, academicSessionId])

  useEffect(() => {
    if (feeHistortyTab) {
      history.push('/institute/dashboard/fee-transactions/bank')
      dispatch(feeHistoryTabFalseActions(false))
    }
  }, [feeHistortyTab])

  useEffect(() => {
    dispatch(
      setStudentDuesFiltersAction({
        ...filters,
        classIds: [classId],
      })
    )
    dispatch(
      setStudentDuesFiltersAction({
        ...filters,
        classIds: [classId],
      })
    )
    dispatch(
      studentDuesRequestedAction(
        [classId],
        filters.sectionIds ? filters.sectionIds : null,
        filters.paymentStatus
      )
    )
  }, [filters.paymentStatus, filters.sectionIds, classId])

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

  const handleNameClick = (studentDuesData) => {
    eventManager.send_event(events.FEE_STUDENT_NAME_CLICKED_TFI, {
      student_id: studentDuesData.Id,
      screen_name: 'classroom_fee_details',
      session_id: instituteActiveAcademicSessionId,
    })

    dispatch(
      setSliderScreenAction(
        SliderScreens.STUDENT_DETAILS_SLIDER,
        studentDuesData
      )
    )
  }

  if (
    studentDuesLoading ||
    (!studentsList &&
      studentsList?.length === 0 &&
      studentDues?.students?.length > 0)
  ) {
    return <div className="loading"></div>
  }

  const getStudentDetails = (studentId) => {
    return studentsList
      ? studentsList.find((student) => student._id === studentId)
      : null
  }

  const handleCollectFeeBtnClick = (studentDuesData) => {
    eventManager.send_event(events.RECORD_PAYMENT_INITIALIZED_TFI, {
      student_id: studentDuesData.Id,
      screen_name: 'classroom_fee_details',
      session_id: instituteActiveAcademicSessionId,
    })
    dispatch(
      setSliderScreenAction(SliderScreens.COLLECT_FEES_SLIDER, {
        ...studentDuesData,
        classId: classId,
      })
    )
  }

  const handleApplyFilters = async (f) => {
    eventManager.send_event(events.FEE_APPLY_FILTER_CLICKED_TFI, {
      filters: f,
      screen_name: 'fee_collection',
    })
    f.classIds = [classId]

    dispatch(setStudentDuesFiltersAction(f))
    setShowDropDown(false)
  }

  const handleFilterRemove = (type, value) => {
    if (type == 'status') {
      dispatch(setStudentDuesFiltersAction({...filters, paymentStatus: 'ALL'}))
    }

    if (type === 'section') {
      dispatch(
        setStudentDuesFiltersAction({
          ...filters,
          sectionIds: filters.sectionIds.filter((cId) => cId !== value),
        })
      )
    }
  }

  const handleChange = (action, studentId) => {
    switch (action) {
      case STUDENT_DUES_TOOLTIP_OPTION_IDS.SEND_REMINDER: {
        setSingleStudentfeeReminder(true)
        dispatch(feeReminderRequestedAction(Array(studentId)))
        eventManager.send_event(events.FEE_REMINDER_SENT_TFI, {
          screen_name: 'class_page',
          standard_id: classId,
          standard_name: studentClass,
          student_id: studentId,
          action: 'single_confirm',
        })
        break
      }
      case STUDENT_DUES_TOOLTIP_OPTION_IDS.DOWNLOAD_DEMAND_LETTER: {
        eventManager.send_event(events.DOWNLOAD_DEMAND_LETTER_CLICKED_TFI)
        dispatch({
          type: feeCollectionActionTypes.DOWNLOAD_DEMAND_LETTER_REQUESTED,
          payload: {studentId, eventManager},
        })
        break
      }
      default:
        break
    }
  }

  const allFilteredDueStudents = studentDues.students
    .filter((s) => s.dueAmount !== 0)
    .map((s) => s.Id)

  const handleSendReminderButtonClick = () => {
    setSingleStudentfeeReminder(false)
    setShowPopup(true)
    eventManager.send_event(events.FEE_SEND_REMINDER_CLICKED_TFI, {
      screen_name: 'class_page',
      standard_id: classId,
      standard_name: studentClass,
    })
  }

  const handleReminderCloseClick = () => {
    setShowPopup(false)
    eventManager.send_event(events.FEE_REMINDER_SENT_TFI, {
      screen_name: 'class_page',
      standard_id: classId,
      standard_name: studentClass,
      action: 'cancel',
    })
  }

  const handleSendReminder = async () => {
    dispatch(feeReminderRequestedAction(allFilteredDueStudents))
    setShowPopup(false)
    eventManager.send_event(events.FEE_REMINDER_SENT_TFI, {
      screen_name: 'class_page',
      standard_id: classId,
      standard_name: studentClass,
      action: 'confirm',
    })
  }

  const studentDuesDetails = [
    {
      className: styles.payableAmount,
      amount:
        selectedFeeFilterOption == 'applicable_till_date'
          ? numDifferentiation(
              studentDues.payable_amount,
              instituteInfo.currency
            )
          : numDifferentiation(
              studentDues.total_payable,
              instituteInfo.currency
            ),
      value:
        selectedFeeFilterOption == 'applicable_till_date'
          ? getAmountFixDecimalWithCurrency(
              studentDues.payable_amount,
              instituteInfo.currency
            )
          : getAmountFixDecimalWithCurrency(
              studentDues.total_payable,
              instituteInfo.currency
            ),
      label: t('totalApplicable'),
    },
    {
      className: styles.discountAmount,
      amount:
        selectedFeeFilterOption == 'applicable_till_date'
          ? numDifferentiation(
              studentDues.discount_amount,
              instituteInfo.currency
            )
          : numDifferentiation(
              studentDues.total_discount,
              instituteInfo.currency
            ),
      value:
        selectedFeeFilterOption == 'applicable_till_date'
          ? getAmountFixDecimalWithCurrency(
              studentDues.discount_amount,
              instituteInfo.currency
            )
          : getAmountFixDecimalWithCurrency(
              studentDues.total_discount,
              instituteInfo.currency
            ),
      label: t('discountApplied'),
    },
    {
      className: styles.dueAmount,
      amount:
        selectedFeeFilterOption == 'applicable_till_date'
          ? numDifferentiation(studentDues.due_amount, instituteInfo.currency)
          : numDifferentiation(studentDues.total_due, instituteInfo.currency),
      value:
        selectedFeeFilterOption == 'applicable_till_date'
          ? getAmountFixDecimalWithCurrency(
              studentDues.due_amount,
              instituteInfo.currency
            )
          : getAmountFixDecimalWithCurrency(
              studentDues.total_due,
              instituteInfo.currency
            ),
      label:
        selectedFeeFilterOption == 'applicable_till_date'
          ? t('overdueFee')
          : t('dueFee'),
    },
    {
      className: styles.paidAmount,
      amount:
        selectedFeeFilterOption == 'applicable_till_date'
          ? numDifferentiation(studentDues.paid_amount, instituteInfo.currency)
          : numDifferentiation(studentDues.total_paid, instituteInfo.currency),
      value:
        selectedFeeFilterOption == 'applicable_till_date'
          ? getAmountFixDecimalWithCurrency(
              studentDues.paid_amount,
              instituteInfo.currency
            )
          : getAmountFixDecimalWithCurrency(
              studentDues.total_paid,
              instituteInfo.currency
            ),
      label: t('paidFee'),
    },
    {
      className: styles.pendingAmount,
      amount:
        selectedFeeFilterOption == 'applicable_till_date'
          ? numDifferentiation(
              studentDues.pending_amount,
              instituteInfo.currency
            )
          : numDifferentiation(
              studentDues.total_pending,
              instituteInfo.currency
            ),
      value:
        selectedFeeFilterOption == 'applicable_till_date'
          ? getAmountFixDecimalWithCurrency(
              studentDues.pending_amount,
              instituteInfo.currency
            )
          : getAmountFixDecimalWithCurrency(
              studentDues.total_pending,
              instituteInfo.currency
            ),
      label: t('pendingFees'),
    },
  ]

  const cols = [
    {key: 'studentDetails', label: 'student details'},
    {key: 'enrollmentNo', label: 'enrollment no.'},
    {key: 'section', label: 'class'},
    {key: 'paid', label: 'total paid', className: 'truncate'},
    {key: 'due', label: 'total due', className: 'truncate'},
    {key: 'action', label: 'action'},
    {key: 'otherOptions', label: ' '},
  ]
  const rows = studentDues.students
    .filter((dues) => {
      if (searchTerm) {
        const student = getStudentDetails(dues.Id)
        return !student
          ? false
          : student?.full_name
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
              student?.phone_number?.includes(searchTerm) ||
              student?.enrollment_number?.toString().includes(searchTerm) ||
              student?.email?.includes(searchTerm)
      }
      return true
    })
    .filter((el) => {
      // For "PAID", due should be less than 0.01. For "DUE", due should be greater than or equal to 0.01
      let due =
        selectedFeeFilterOption == 'applicable_till_date'
          ? el.dueAmount
          : el.totalDue
      if (filters?.paymentStatus === 'DUE') {
        return due >= 0.01
      } else if (filters?.paymentStatus === 'PAID') {
        return due < 0.01
      } else {
        return true
      }
    })
    .map((dues) => {
      let paid =
        selectedFeeFilterOption == 'applicable_till_date'
          ? dues.paidAmount
          : dues.totalPaid
      let due =
        selectedFeeFilterOption == 'applicable_till_date'
          ? dues.dueAmount
          : dues.totalDue
      const student = getStudentDetails(dues.Id)
      let classSection = ['NA', '']
      if (student?.classroom) {
        classSection = student?.classroom?.split('-')
      }
      dues = {
        ...dues,
        class: classSection[0],
        name: student?.full_name,
        phoneNumber: student?.phone_number,
        email: student?.email,
        section: classSection[1],
        selectedSliderTab: 'FEE_HISTORY',
        pic_url: student?.img_url,
      }
      return {
        id: dues.Id,
        enrollmentNo: dues.enrollmentNumber ? (
          dues.enrollmentNumber
        ) : (
          <span className={styles.displayData}>N/A</span>
        ),
        studentDetails: (
          <div className={styles.flex}>
            <img
              className={styles.img}
              src={dues.pic_url || userDefaultIcon}
              alt=""
            />
            <div>
              <div className="link" onClick={() => handleNameClick(dues)}>
                {dues.name}
              </div>
              <div className={styles.displayData}>
                {dues?.enrollmentNumber ||
                  (dues?.phoneNumber && (
                    <div className="teachmint zipy-block">
                      {dues?.phoneNumber}
                    </div>
                  )) ||
                  dues?.email}
              </div>
            </div>
          </div>
        ),
        section: (
          <div>
            {dues.class} {dues.section}
          </div>
        ),
        paid: (
          <div>
            <div className={styles.paid}>
              {paid == null ? (
                <span className={styles.displayData}>N/A</span>
              ) : (
                getAmountFixDecimalWithCurrency(
                  paid > 0 ? paid : 0,
                  instituteInfo.currency
                )
              )}
            </div>
            {/* <div className={styles.inputGrp}>
              {upcomingReminderDate(dues.lastPaidDate)} &nbsp;
              <span className={styles.spanSettings}>&bull; </span>
              {paymentMethods[dues.paymentMethod]}
            </div> */}
          </div>
        ),
        due: (
          <div>
            <div className={styles.due}>
              {due == null ? (
                <span className={styles.displayData}>N/A</span>
              ) : (
                getAmountFixDecimalWithCurrency(
                  due > 0 ? due : 0,
                  instituteInfo.currency
                )
              )}
            </div>
            {/* <div className={styles.inputGrp}>
              {upcomingReminderDate(dues.dueDate)}
            </div> */}
          </div>
        ),
        action: (
          <Permission
            permissionId={
              PERMISSION_CONSTANTS.feeModuleController_feeStudentPayment_create
            }
          >
            <button
              className="fill w-max"
              onClick={() => handleCollectFeeBtnClick(dues)}
            >
              {t('collectFee')}
            </button>
          </Permission>
        ),
        otherOptions: (
          <SubjectTooltipOptions
            subjectItem={dues.Id}
            options={
              dues.due === 0
                ? STUDENT_DUES_TOOLTIP_OPTIONS.filter(
                    (option) =>
                      option.action !==
                      STUDENT_DUES_TOOLTIP_OPTION_IDS.SEND_REMINDER
                  )
                : STUDENT_DUES_TOOLTIP_OPTIONS
            }
            trigger={
              <div className={styles.ellipsisIcon}>
                <Icon
                  name="ellipsisVertical"
                  type={ICON_CONSTANTS.TYPES.SECONDARY}
                  size={ICON_CONSTANTS.SIZES.MEDIUM}
                />
              </div>
            }
            handleChange={handleChange}
          />
        ),
        _data: dues,
        hidden: dues.hidden,
        selected: dues.selected,
      }
    })

  // const handleDownloadCSVClick = () => {
  //   const rows = [
  //     {className: 'Class ' + studentClass},
  //     {},
  //     {
  //       studentName: 'Student Name',
  //       feeStatus: 'Fee Status',
  //       fees: 'Fee applicable till date',
  //       discount: 'Discount applicable till date',
  //       paid: 'Paid Amount',
  //       due: 'Due Amount',
  //       phoneNumber: 'Mobile No',
  //     },
  //     ...studentDues.students.map((student) => {
  //       const studentDetails = getStudentDetails(student.Id)
  //       let dueAmount =
  //         selectedFeeFilterOption == 'applicable_till_date'
  //           ? student.dueAmount
  //           : student.totalDue
  //       let payableAmount =
  //         selectedFeeFilterOption == 'applicable_till_date'
  //           ? student.payableAmount
  //           : student.totalPayable
  //       let paidAmount =
  //         selectedFeeFilterOption == 'applicable_till_date'
  //           ? student.paidAmount
  //           : student.totalPaid
  //       let discountAmount =
  //         selectedFeeFilterOption == 'applicable_till_date'
  //           ? student.discountAmount
  //           : student.totalDiscount
  //       return {
  //         studentName: studentDetails?.name,
  //         feeStatus: dueAmount > 0 ? 'DUE' : 'PAID',
  //         fees: payableAmount.toFixed(2),
  //         discount: discountAmount.toFixed(2),
  //         paid: paidAmount.toFixed(2),
  //         due: dueAmount?.toFixed(2),
  //         phoneNumber: studentDetails?.phone_number,
  //       }
  //     }),
  //   ]
  //   const reportName =
  //     'Class-' +
  //     studentClass +
  //     '-Report-' +
  //     DateTime.now().toFormat('dd-LL-yyyy')
  //   createAndDownloadCSV(reportName, JSObjectToCSV([instituteInfo.name], rows))
  //   eventManager.send_event(events.DOWNLOAD_REPORT_CLICKED_TFI, {
  //     screenName: 'collection_classwise',
  //   })
  //   dispatch(showSuccessToast(FEES.CSV_REPORT_EXPORTED_MESSAGE))
  //   dispatch(
  //     saveReportLogAction({
  //       start_date: '',
  //       end_date: '',
  //       report_name: reportName,
  //       report_type: API_RESPONCE_OBJ_KEYS.FEE,
  //       meta_info: {
  //         fee_report_type: FEE_REPORT_TYPE.COLLECTIONS,
  //       },
  //     })
  //   )
  // }

  return (
    <ErrorBoundary>
      <div>
        {Object.keys(studentProfileFeeTabSummaryData).length === 0 &&
          recordPaymentDetails?.isPopupOpen && (
            <ReceiptPreviewModal
              isOpen={recordPaymentDetails?.isPopupOpen}
              recordPaymentDetails={recordPaymentDetails}
              receiptIds={submitFees?.receipts}
              submitFees={submitFees}
            />
          )}
        <div className={styles.headerOptions}>
          <div className={styles.dFlexCenterAlign}>
            <Link
              to="/institute/dashboard/fees/collection"
              className={classNames('link', styles.dFlexCenterAlign)}
            >
              <Icon
                name="backArrow"
                type={ICON_CONSTANTS.TYPES.PRIMARY}
                size={ICON_CONSTANTS.SIZES.X_SMALL}
              />
            </Link>
            <span className={styles.classLabel}>Class {studentClass}</span>
          </div>
          <div className={styles.headerOptionItem}>
            <Input
              type="select"
              fieldName="feeFilterType"
              value={selectedFeeFilterOption}
              options={feeFilterOptions}
              onChange={(e) => {
                eventManager.send_event(
                  events.FEE_COLLECTION_DATE_FILTER_CLICKED_TFI,
                  {
                    screen_name: 'fee_collection_class',
                    date_type: e.value,
                    class_id: classId,
                  }
                )
                setSelectedFilterOption(e.value)
              }}
              classes={{wrapper: styles.inputWrapper}}
              className={styles.dropdown}
            />
            <FeeCollectionHeaderButtons
              handleSendReminderButtonClick={handleSendReminderButtonClick}
            />
          </div>
        </div>
        {studentDues.students.length > 0 && (
          <div className="tm-box-shadow1 tm-border-radius1 p-4 bg-white my-3">
            <div className={styles.feeDetails}>
              {studentDuesDetails.map((detail, i) => {
                return <HistorySection key={i} feeDetail={detail} />
              })}
            </div>
          </div>
        )}
        <div className="tm-box-shadow1 tm-border-radius1 py-4 bg-white my-3">
          <div className={classnames(styles.filtersAndSearchBar, 'px-4')}>
            <div style={{position: 'relative', width: '100%'}}>
              <div ref={ref}>
                <button
                  className={classnames(
                    showDropDown ? 'fill' : 'border',
                    styles.addFilter
                  )}
                  onClick={() => setShowDropDown(!showDropDown)}
                >
                  <img
                    src={showDropDown ? filterWhite : filterBlue}
                    alt={'Add Filters'}
                    className={classnames(styles.cstFilterIcon)}
                  />
                  Add Filters
                </button>
                {showDropDown && (
                  <StudentFilters
                    filters={filters}
                    onApplyFilters={handleApplyFilters}
                    sections={sections}
                  />
                )}
              </div>
            </div>
            {/* <div> */}
            <div className={classnames(styles.searchContainer, 'py-2 px-4')}>
              <img
                src="https://storage.googleapis.com/tm-assets/icons/secondary/search-secondary.svg"
                className={styles.searchIcon}
              />
              <input
                type="text"
                placeholder="Search by student name, phone number"
                onChange={(e) => setSearchTerm(e.target.value)}
                className={classnames(styles.input, 'tm-para-14')}
              />
            </div>
            {/* </div> */}
          </div>
          <div
            className={
              !filters.paymentStatus ||
              filters.paymentStatus !== 'ALL' ||
              (!!sections && !!sections.length && filters.sectionIds)
                ? styles.filter
                : 'd-none'
            }
          >
            {(!filters.paymentStatus || filters.paymentStatus !== 'ALL') && (
              <Chip
                key={filters.paymentStatus}
                label={camelCaseText(filters.paymentStatus)}
                value={filters.paymentStatus}
                onChange={() =>
                  handleFilterRemove('status', filters.paymentStatus)
                }
                onClick={() =>
                  handleFilterRemove('status', filters.paymentStatus)
                }
              />
            )}
            {!!sections &&
              !!sections.length &&
              filters.sectionIds &&
              filters.sectionIds
                .map((defaultsections) =>
                  sections.find((s) => s.id === defaultsections)
                )
                .map(
                  (s) =>
                    s && (
                      <Chip
                        key={s}
                        label={camelCaseText(s.name)}
                        value={s}
                        onChange={() => handleFilterRemove('section', s.id)}
                        onClick={() => handleFilterRemove('section', s.id)}
                      />
                    )
                )}
          </div>
          {studentDueErrMsg ? (
            <ErrorOverlay>{studentDueErrMsg}</ErrorOverlay>
          ) : (
            <Table
              rows={rows}
              cols={cols}
              className={styles.width100}
              selectable={false}
              uniqueKey="id"
            />
          )}
        </div>

        {feesReminderErrorMsg ? (
          <ErrorOverlay>{feesReminderErrorMsg}</ErrorOverlay>
        ) : !singleStudentfeeReminder && (showPopup || feesReminderLoading) ? (
          <SendFeeReminderConfirmationPopup
            setShowPopup={handleReminderCloseClick}
            handleSendReminder={handleSendReminder}
            studentCount={allFilteredDueStudents.length}
            feesReminderLoading={feesReminderLoading}
            isClassLevel={true}
          />
        ) : null}
      </div>
    </ErrorBoundary>
  )
}

export default StudentDues
