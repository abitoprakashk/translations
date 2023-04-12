import styles from './Passbook.module.css'
import {
  BackendPagination,
  Badges,
  BADGES_CONSTANTS,
  Button,
  ButtonDropdown,
  BUTTON_CONSTANTS,
  EmptyState,
  Icon,
  ICON_CONSTANTS,
  // SearchBar,
  Table,
  Tooltip,
} from '@teachmint/krayon'
import {
  PASSBOOK_COLUMNS,
  PASSBOOK_ROWS_LIMIT,
  PASSBOOK_TOOLTIP_OPTIONS,
  PASSBOOK_TOOLTIP_OPTIONS_IDS,
} from './passbookConstants'
import globalActions from '../../../../../redux/actions/global.actions'
import {useDispatch, useSelector} from 'react-redux'
import {useEffect, useMemo, useState} from 'react'
import StudentDetailsColumn from './StudentDetailsColumn/StudentDetailsColumn'
import {
  getAmountFixDecimalWithCurrency,
  getAmountWithCurrency,
  getShortTxnId,
} from '../../../../../utils/Helpers'
import {useFeeStructure} from '../../../redux/feeStructure/feeStructureSelectors'
import {fetchFeeTypesRequestedAction} from '../../../../../pages/fee/redux/feeStructure/feeStructureActions'
import {useTranslation} from 'react-i18next'
import {paymentStatusLabels, REVOKED} from '../../../fees.constants'
import {
  payStatusKrayonTag,
  payStatusLabel,
} from '../../FeeTransaction/FeeTransactionConstants'
import SubjectTooltipOptions from '../../../../../components/SchoolSystem/SectionDetails/SubjectTooltipOptions'
import {showToast} from '../../../../../redux/actions/commonAction'
import {openLinkInNewTab} from '../../../helpers/helpers'
import feeTransactionActionTypes from '../../../redux/feeTransactionActionTypes'
import ChangeAccountModal from './ChangeAccountModal/ChangeAccountModal'
import {ErrorBoundary} from '@teachmint/common'
import {useCompanyAndAccountSelector} from '../selectors'
import AccountChangeHistory from './AccountChangeHistoryModal/AccountChangeHistoryModal'
import useInstituteAssignedStudents from '../../../../../pages/AttendanceReport/pages/StudentWiseAttendance/hooks/useInstituteAssignedStudents'
import {
  ACCOUNT_ACTIVITY_FILTER_OPTIONS,
  ACCOUNT_ACTIVITY_FILTER_TYPES,
  TRANSLATIONS_CA,
} from '../companyAccConstants'

import FilterAccountMapping from '../AccountMapping/FilterAccountMapping/FilterAccountMapping'
import {FILTER_FOR} from '../companyAccConstants'
import useQueryParam from '../../../../AttendanceReport/pages/TodaysDetailedReport/hooks/useQueryParam'
import {DateTime} from 'luxon'

export default function Passbook() {
  const accountId = useQueryParam('acc_id')

  const dispatch = useDispatch()
  const {t} = useTranslation()
  const instituteInfo = useSelector((state) => state.instituteInfo)
  const {feeTypes} = useFeeStructure()
  const [feeTypesToFeeNameDictionary, setFeeTypesToFeeNameDictionary] =
    useState({})
  // const [searchText, setSearchText] = useState('')
  const [isChangeAccountModalOpen, setIsChangeAccountModalOpen] =
    useState(false)
  const [isAccountChangeHistoryModalOpen, setIsAccountChangeHistoryModalOpen] =
    useState(false)
  const [selectedReceiptId, setSelectedReceiptId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [paginationInputs, setPaginationInputs] = useState({
    account_id: accountId,
    filters: {},
    limit: PASSBOOK_ROWS_LIMIT,
    next: true,
  })
  const [selectedFilterType, setSelectedFilterType] = useState(
    ACCOUNT_ACTIVITY_FILTER_TYPES.THIS_WEEK
  )

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)

  const {data: companies} =
    useCompanyAndAccountSelector()?.getCompanyAccountListCA

  const {data: passbookData, isLoading: passbookLoading} =
    useCompanyAndAccountSelector()?.getAccountPassbook

  const instituteActiveStudentList = useInstituteAssignedStudents()

  const current_date = new Date()
  const start_date = new Date(
    current_date.setDate(current_date.getDate() - current_date.getDay())
  )
  const end_date = new Date(
    current_date.setDate(current_date.getDate() - current_date.getDay() + 6)
  )

  // get session details
  const instituteActiveAcademicSessionId = useSelector(
    (state) => state.instituteActiveAcademicSessionId
  )
  const {start_time, end_time} = useSelector((state) =>
    state.instituteAcademicSessionInfo.find(
      ({_id}) => _id === instituteActiveAcademicSessionId
    )
  )

  let studentsList = instituteActiveStudentList?.reduce?.((acc, curr) => {
    return {
      ...acc,
      [curr?._id]: {
        fullName: curr?.full_name || '-',
        phoneNumber: curr?.phone_number,
        email: curr?.email,
        classroom: curr?.classroom,
        receiptNo: curr?.receipt_no,
        imgUrl: curr?.img_url,
      },
    }
  }, {})

  useEffect(() => {
    setPaginationInputs((prev) => {
      return {...prev, account_id: accountId}
    })
    if (feeTypes?.length === 0) {
      dispatch(fetchFeeTypesRequestedAction())
    }
    if (companies && Object.keys(companies).length === 0) {
      dispatch(globalActions.getCompanyAccountListCA.request())
    }
  }, [])

  useEffect(() => {
    if (accountId) {
      let start_timestamp = parseInt(start_date.getTime() / 1000)
      let end_timestamp = parseInt(end_date.getTime() / 1000)

      if (selectedFilterType == ACCOUNT_ACTIVITY_FILTER_TYPES.THIS_SESSION) {
        start_timestamp = parseInt(start_time / 1000)
        end_timestamp = parseInt(end_time / 1000)
      }

      const paginationInputsWithFilter = {
        ...paginationInputs,
        account_id: accountId,
        filters: {
          master_category_ids: paginationInputs?.filters?.feeTypes,
          payment_methods: paginationInputs?.filters?.mode,
          transaction_status: paginationInputs?.filters?.status,
        },
        start_timestamp,
        end_timestamp,
      }
      dispatch(
        globalActions.getAccountPassbook.request(paginationInputsWithFilter)
      )
    }
  }, [paginationInputs, paginationInputs?.filters, selectedFilterType])

  useEffect(() => {
    setFeeTypesToFeeNameDictionary(
      feeTypes.reduce((acc, curr) => {
        acc[curr._id] = curr.name
        return acc
      }, {})
    )
  }, [feeTypes])

  const feeTypeColumn = (fee_types, uniqueKey) => {
    if (!fee_types) {
      return '-'
    }
    if (fee_types.length === 0) {
      return '-'
    }
    if (fee_types.length === 1) {
      return fee_types[0]
    }

    return (
      <div>
        {fee_types[0]}
        <a
          data-for={`feeTypeColumn${uniqueKey}`}
          className={styles.feeTypeColumnMore}
          data-tip
        >
          {' '}
          + {fee_types.length - 1} {t('more')}
        </a>
        <Tooltip
          effect="float"
          place="top"
          toolTipBody={fee_types.slice(1).map((feeType) => (
            <span key={feeType} className={styles.amountColumn}>
              {feeType}
            </span>
          ))}
          toolTipId={`feeTypeColumn${uniqueKey}`}
        />
      </div>
    )
  }

  const handleMoreOptionsChange = (action, data) => {
    switch (action) {
      case PASSBOOK_TOOLTIP_OPTIONS_IDS.DOWNLOAD_RELATED_RECEIPT: {
        if (data?.receipt_url !== '') {
          openLinkInNewTab(data.receipt_url)
        } else {
          dispatch({
            type: feeTransactionActionTypes.FEE_TRANSACTION_DOWNLOAD_REQUESTED,
            payload: {
              isCancelled: data.is_cancelled,
              studentId: data.student_id,
              receiptNo: data.receipt_no.replace('CAN/', ''),
            },
          })
        }
        break
      }
      case PASSBOOK_TOOLTIP_OPTIONS_IDS.CHANGE_ACCOUNT: {
        setSelectedReceiptId(data._id)
        setIsChangeAccountModalOpen(true)
        break
      }
      case PASSBOOK_TOOLTIP_OPTIONS_IDS.ACCOUNT_CHANGE_HISTORY: {
        setSelectedReceiptId(data._id)
        setIsAccountChangeHistoryModalOpen(true)
        break
      }
      default:
        break
    }
  }

  const handleFilterBtnClick = () => {
    setIsFilterModalOpen(true)
  }
  const handleFilterModalCloseBtnClick = () => {
    setIsFilterModalOpen(false)
  }

  const handleApplyFilterBtnClick = (obj) => {
    setPaginationInputs((prev) => {
      return {...prev, filters: {...obj}}
    })
  }

  const handlePaginationClick = (params) => {
    const payload = {
      next: params.step === 'NEXT',
      reference_id: params.referenceId,
    }
    setPaginationInputs((prev) => {
      return {...prev, ...payload}
    })
  }

  const rows = useMemo(() => {
    if (!studentsList) {
      return []
    }

    return (
      passbookData?.hits
        /* ======== this filter will use in next release ====== */
        // .filter((rowData) => {
        //   const student = studentsList[rowData?.student_id] ?? {}
        //   const fullName = student?.fullName?.toLowerCase() ?? ''
        //   const phoneNumber = student?.phoneNumber?.toLowerCase() ?? ''
        //   const receiptNo = rowData?.receiptNo?.toLowerCase() ?? ''

        //   return searchText
        //     ? [fullName, phoneNumber, receiptNo].some((field) =>
        //         field.includes(searchText.toLowerCase())
        //       )
        //     : true
        // })
        .map((rowData) => {
          const student = studentsList[rowData?.student_id] ?? {}
          const fee_types =
            accountId && rowData?.account_master_category_breakdown
              ? rowData?.account_master_category_breakdown[accountId]?.map(
                  (x) => feeTypesToFeeNameDictionary[x.master_category_id] || ''
                )
              : []
          let fee_types_total_amount =
            accountId && rowData?.account_master_category_breakdown
              ? rowData?.account_master_category_breakdown[accountId]?.reduce(
                  (sum, item) => sum + item.amount,
                  0
                )
              : 0

          return {
            transactionId: (
              <div className={styles.transactionId}>
                <a data-for={`transactionId${rowData._id}`} data-tip>
                  {`# ${getShortTxnId(rowData?.unique_id || '', 8)}`}
                </a>
                <Tooltip
                  effect="float"
                  place="top"
                  toolTipId={`transactionId${rowData._id}`}
                  title={rowData?.unique_id}
                />
                <button>
                  <Icon
                    onClick={() => {
                      dispatch(
                        showToast({
                          type: 'success',
                          message: t('successfullyCopied'),
                        })
                      )
                      navigator &&
                        navigator.clipboard.writeText(rowData.unique_id)
                    }}
                    name="copy"
                    version={ICON_CONSTANTS.VERSION.OUTLINED}
                    size={ICON_CONSTANTS.SIZES.XX_SMALL}
                    type={ICON_CONSTANTS.TYPES.PRIMARY}
                  />
                </button>
              </div>
            ),
            receiptNo: rowData.receipt_no,
            studentDetails: (
              <div className={styles.studentDetails}>
                <StudentDetailsColumn student={student} />
              </div>
            ),
            class: student?.classroom || '-',
            amount: (
              <div className={styles.amountColumn}>
                <div className={styles.amountInfo}>
                  {getAmountFixDecimalWithCurrency(
                    parseFloat(fee_types_total_amount).toFixed(2),
                    instituteInfo.currency
                  )}
                  <a
                    data-for={`amount${rowData._id}`}
                    data-tip
                    className={styles.infoIconWrapper}
                  >
                    <Icon
                      name="info"
                      version={ICON_CONSTANTS.VERSION.OUTLINED}
                      size={ICON_CONSTANTS.SIZES.XX_SMALL}
                    />
                  </a>
                  <Tooltip
                    effect="float"
                    place="top"
                    toolTipBody={t('passbookTooltip', {
                      receipt_no: rowData.receipt_no,
                      amount: getAmountWithCurrency(
                        rowData.amount,
                        instituteInfo.currency
                      ),
                    })}
                    toolTipId={`amount${rowData._id}`}
                  />
                </div>
                <span className={styles.amountDate}>
                  {DateTime.fromSeconds(rowData.payment_timestamp).toFormat(
                    'dd LLL yyyy'
                  )}
                </span>
              </div>
            ),
            feeType: feeTypeColumn([...new Set(fee_types)], rowData._id),
            mode: t(paymentStatusLabels[rowData.payment_method]?.label) || '-',
            status: (
              <Badges
                inverted
                label={payStatusLabel[rowData.transaction_status] || '-'}
                showIcon={false}
                size={BADGES_CONSTANTS.SIZE.MEDIUM}
                type={payStatusKrayonTag[rowData.transaction_status]}
                className={styles.statusBadges}
              />
            ),
            action: (
              <SubjectTooltipOptions
                subjectItem={rowData}
                options={PASSBOOK_TOOLTIP_OPTIONS.filter((opt) =>
                  rowData?.transaction_status === REVOKED
                    ? opt?.action !==
                      PASSBOOK_TOOLTIP_OPTIONS_IDS.DOWNLOAD_RELATED_RECEIPT
                    : true
                )}
                trigger={
                  <div className={styles.ellipsisIcon}>
                    <Icon
                      name="ellipsisVertical"
                      type={ICON_CONSTANTS.TYPES.SECONDARY}
                      size={ICON_CONSTANTS.SIZES.MEDIUM}
                    />
                  </div>
                }
                handleChange={handleMoreOptionsChange}
              />
            ),
          }
        })
    )
  }, [
    passbookData,
    passbookData?.hits,
    studentsList,
    //  searchText
  ])

  return (
    <>
      {isChangeAccountModalOpen && (
        <ChangeAccountModal
          isOpen={isChangeAccountModalOpen}
          setIsOpen={setIsChangeAccountModalOpen}
          companies={companies?.companies}
          accountId={accountId}
          selectedReceiptId={selectedReceiptId}
        />
      )}

      {isAccountChangeHistoryModalOpen && (
        <AccountChangeHistory
          isOpen={isAccountChangeHistoryModalOpen}
          setIsOpen={setIsAccountChangeHistoryModalOpen}
          selectedReceiptId={selectedReceiptId}
          companies={companies?.companies}
        />
      )}

      {isFilterModalOpen && (
        <FilterAccountMapping
          isOpen={isFilterModalOpen}
          onClose={handleFilterModalCloseBtnClick}
          handleApplyFilterBtnClick={handleApplyFilterBtnClick}
          appliedFilter={paginationInputs.filters}
          feeTypeOptions={feeTypes}
          filterFor={FILTER_FOR.ACCOUNT_PASSBOOK}
        />
      )}

      <ErrorBoundary>
        <div className={styles.parentDiv}>
          <div className={styles.searchActionRow}>
            {/* WILL USE IN NEXT RELEASE */}
            <div></div>
            {/* <SearchBar
              value={searchText}
              classes={{
                wrapper: styles.searchBarWidth,
              }}
              handleChange={({value}) => setSearchText(value)}
              showClear={false}
              placeholder={t('passbookSearchBarText')}
            /> */}
            <div className={styles.actionButtons}>
              <ButtonDropdown
                buttonObj={{
                  buttonClasses: '',
                  children: t(
                    ACCOUNT_ACTIVITY_FILTER_OPTIONS[selectedFilterType].label
                  ),
                  suffixIcon: 'downArrow',
                  type: 'outline',
                  classes: {
                    button: styles.buttonDropdownButton,
                  },
                }}
                classes={{
                  dropdownContainer: styles.buttonDropdownContainer,
                }}
                handleOptionClick={(e) => setSelectedFilterType(e.value)}
                options={Object.keys(ACCOUNT_ACTIVITY_FILTER_OPTIONS).map(
                  (key) => {
                    return {
                      id: ACCOUNT_ACTIVITY_FILTER_OPTIONS[key].id,
                      label: t(ACCOUNT_ACTIVITY_FILTER_OPTIONS[key].label),
                    }
                  }
                )}
              />
              <Button
                type={BUTTON_CONSTANTS.TYPE.OUTLINE}
                onClick={handleFilterBtnClick}
              >
                <div className={styles.actionButton}>
                  <Icon
                    name="filterAlt"
                    type={ICON_CONSTANTS.TYPES.PRIMARY}
                    size={ICON_CONSTANTS.SIZES.X_SMALL}
                  />
                  {t('filters')}
                </div>
              </Button>
            </div>
          </div>
          {!studentsList || passbookLoading ? (
            <div className="loading"></div>
          ) : (
            <>
              <div>
                <Table
                  rows={rows}
                  cols={PASSBOOK_COLUMNS}
                  classes={{table: styles.table}}
                />
              </div>
              {rows?.length === 0 && (
                <EmptyState
                  button={false}
                  content={TRANSLATIONS_CA.passbookEmptyStateMsg}
                  classes={{wrapper: styles.emptyStateWrapper}}
                />
              )}
              <BackendPagination
                paginationObj={passbookData?.pagination || {}}
                pageSize={passbookData?.hits?.length || PASSBOOK_ROWS_LIMIT}
                onPageChange={handlePaginationClick}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            </>
          )}
        </div>
      </ErrorBoundary>
    </>
  )
}
