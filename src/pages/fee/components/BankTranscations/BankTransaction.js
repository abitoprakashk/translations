import {useEffect, useRef, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import * as EPC from '../../fees.constants.js'
import {
  Chip,
  DateRangePicker,
  ErrorBoundary,
  ErrorOverlay,
  Icon,
  Tag,
  Tooltip,
  useOutsideClickHandler,
} from '@teachmint/common'

import styles from '../FeeTransaction/FeeTransaction.module.css'
import {Table} from '@teachmint/common'
import {
  useFeeTransactionCollection,
  useInstituteId,
} from '../../redux/feeTransacationSelectors'
import userDefaultIcon from '../../../../assets/images/icons/user-profile.svg'
import {
  fetchChequeTranscationListAction,
  fetachChequeApplyFilterDataAction,
  setSliderScreenAction,
} from '../../redux/feeTransactionActions'
import {useActiveAcademicSessionId} from '../../../../utils/CustomHooks/AcademicSessionHook'
import {
  camelCaseText,
  convertTimestampToLocalDateTime,
  getAmountFixDecimalWithCurrency,
  getShortTxnId,
} from '../../../../utils/Helpers'

import filterBlue from '../../../../assets/images/icons/filterBlue.svg'
import filterWhite from '../../../../assets/images/icons/filter.svg'

import classNames from 'classnames'
import SearchBar from '../tfi-common/SearchBar/SearchBar.js'

import SubjectTooltipOptions from '../../../../components/SchoolSystem/SectionDetails/SubjectTooltipOptions'
import {
  defaultPaymentStatus,
  FEE_TRANSACTION_LABEL,
  FEE_TRANSACTION_CANCELLED_OPTIONS,
  FEE_TRANSACTION_FAILED_OPTIONS,
  FEE_TRANSACTION_PENDING_OPTIONS,
  FEE_TRANSACTION_SUCCESS_OPTIONS,
  paymentStatus,
  payModeLabel,
  payStatusTag,
  FEE_TRANSACTION_ONLINE_SUCCESS_OPTIONS,
} from '../FeeTransaction/FeeTransactionConstants'
import FeeTransactionModal from '../FeeTransactionModal/FeeTransactionModal'
import feeTransactionActionTypes from '../../redux/feeTransactionActionTypes.js'
import EmptyScreenV1 from '../../../../components/Common/EmptyScreenV1/EmptyScreenV1.jsx'
import emptyFeeTrasanctionImage from '../../../../assets/images/dashboard/empty/empty_fee_transaction_report.svg'
import {showToast} from '../../../../redux/actions/commonAction.js'
import {events} from '../../../../utils/EventsConstants'
import ConfirmationPopup from '../../../../components/Common/ConfirmationPopup/ConfirmationPopup.js'
import ChequeTransactionFilters from './ChequeTransactionFilters.js'

export default function BankTransaction() {
  const {t} = useTranslation()
  const [showDropDown, setShowDropDown] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showFeeTransactionModal, setShowFeeTransactionModal] = useState(false)
  const [feeTransacationModel, setFeeTransacationModel] = useState(null)
  const [feeTransacationPassData, setfeeTransacationPassData] = useState(null)
  const eventManager = useSelector((state) => state.eventManager)
  const {instituteInfo} = useSelector((state) => state)

  const ref = useRef(null)
  useOutsideClickHandler(ref, () => {
    setShowDropDown(false)
  })
  const dispatch = useDispatch()
  const instituteId = useInstituteId()
  const academicSessionId = useActiveAcademicSessionId()
  const {
    chequeTransacationlistData,
    chequeTransacationlistDataLoading,
    chequeTransacationListErrMsg,
  } = useFeeTransactionCollection()

  const studentsList = useSelector((state) => state.instituteStudentList)
  const {bankTransacationlistDataFilters: filter} = useSelector(
    (state) => state.feeTransactionCollection
  )

  const {instituteAcademicSessionInfo} = useSelector((state) => state)
  const startEndDate = instituteAcademicSessionInfo.find(
    (session) => session._id == academicSessionId
  )

  const [minStartDate] = useState(new Date(parseInt(startEndDate.start_time)))
  const [sessionEndDate, setSessionEndDate] = useState(new Date())
  let prior = new Date().setDate(sessionEndDate.getDate() - 7)
  if (new Date(prior) < minStartDate) {
    const date = new Date()
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
    prior = firstDay
  }
  const [sessionStartDate, setSessionStartDate] = useState(new Date(prior))
  const [showConfirmPopup, setShowConfirmPopup] = useState(false)
  const [revokeTransactionData, setRevokeTransactionData] = useState({})

  const handleDateChange = (dateType, date) => {
    if (dateType == 'start') {
      setSessionStartDate(date)
    }
    if (dateType == 'end') {
      setSessionEndDate(date)
    }
  }

  const getPayStatusTag = (statusTag) => {
    if (
      statusTag === EPC.bankTransactionModes.RECEIVED ||
      statusTag === EPC.bankTransactionModes.DEPOSITED
    ) {
      return payStatusTag['PENDING']
    }
    if (
      statusTag === EPC.bankTransactionModes.BOUNCED ||
      statusTag === EPC.bankTransactionModes.RETURNED ||
      statusTag === EPC.bankTransactionModes.CANCELLED
    ) {
      return payStatusTag['FAILED']
    }
    if (statusTag === EPC.bankTransactionModes.CLEARED) {
      return payStatusTag['SETTLED']
    }
  }
  const cols = [
    {key: 'txn_id', label: 'TXN ID'},
    {key: 'studentDetails', label: 'Student Details'},
    {key: 'class', label: 'Class'},
    {key: 'amount', label: 'Amount'},
    {key: 'disbursalDate', label: 'Disbursal Date'},
    {key: 'mode', label: 'Mode'},
    {key: 'status', label: 'Status'},
    {key: 'action', label: ' '},
  ]

  const handleApplyFilters = async (f) => {
    dispatch(fetachChequeApplyFilterDataAction(f))
    setShowDropDown(false)
  }

  const handleFilterRemove = (type, removeValue) => {
    if (type == 'status') {
      let statusArr = filter.paymentStatus ? [...filter.paymentStatus] : []
      if (statusArr.includes(removeValue)) {
        dispatch(
          fetachChequeApplyFilterDataAction({
            ...filter,
            paymentStatus: statusArr.filter((status) => status !== removeValue),
          })
        )
      }
    } else if (type == 'method') {
      let modeArr = filter.paymentModes ? [...filter.paymentModes] : []
      if (modeArr.includes(removeValue)) {
        dispatch(
          fetachChequeApplyFilterDataAction({
            ...filter,
            paymentModes: modeArr.filter((mode) => mode !== removeValue),
          })
        )
      }
    }
  }

  useEffect(() => {
    if (instituteId && academicSessionId) {
      dispatch(
        fetchChequeTranscationListAction(sessionStartDate, sessionEndDate)
      )
    }
  }, [instituteId, academicSessionId, sessionStartDate, sessionEndDate])

  const openLinkInNewTab = (link) => {
    const win = window.open(link, '_blank')
    if (win != null) {
      win.focus()
    }
  }

  const confirmRevokeTransaction = () => {
    setShowConfirmPopup(false)
    eventManager.send_event(
      revokeTransactionData.action === EPC.ACTION_DELETE_TRANSACTION
        ? events.CHEQUE_DD_DELETE_RECEIPT_POPUP_CLICKED_TFI
        : events.CHEQUE_DD_CANCEL_TRANSACTION_POP_CLICKED_TFI,
      {
        action: 'confirm',
        txn_id: revokeTransactionData.txnId,
      }
    )
    eventManager.send_event(
      revokeTransactionData.action === EPC.ACTION_DELETE_TRANSACTION
        ? events.CHEQUE_DD_RECEIPT_DELETED_TFI
        : events.CHEQUE_DD_TRANSACTION_CANCELLED_TFI,
      {
        txn_id: revokeTransactionData.txnId,
      }
    )
    dispatch({
      type: feeTransactionActionTypes.REVOKE_CHEQUE_TRANSACTION_REQUESTED,
      payload: {
        receiptNo: revokeTransactionData.receiptNo,
        isCancelled:
          revokeTransactionData.action === EPC.ACTION_CANCEL_TRANSACTION,
        sessionStartDate: sessionStartDate,
        sessionEndDate: sessionEndDate,
      },
    })
  }

  const handleOnclickModel = (action, transData) => {
    if (!action) return null

    if (
      action === EPC.TRANSACTION_UPDATE_STATUS ||
      action === EPC.VIEW_TXN_TIMELINE
    ) {
      if (action === EPC.TRANSACTION_UPDATE_STATUS) {
        eventManager.send_event(
          events.CHEQUE_DD_UPDATE_TXN_STATUS_CLICKED_TFI,
          {
            txn_id: transData.transaction_id,
            mode: transData.payment_mode,
          }
        )
      }
      if (action === EPC.VIEW_TXN_TIMELINE) {
        eventManager.send_event(
          events.CHEQUE_DD_VIEW_TXN_TIMELINE_CLICKED_TFI,
          {
            txn_id: transData.transaction_id,
            mode: transData.payment_mode,
          }
        )
      }
      setShowFeeTransactionModal(true)
      setFeeTransacationModel(action)
      setfeeTransacationPassData(transData)
    } else if (
      action === EPC.ACTION_DELETE_TRANSACTION ||
      action === EPC.ACTION_CANCEL_TRANSACTION
    ) {
      let confirmModalData = {}
      if (action === EPC.ACTION_DELETE_TRANSACTION) {
        eventManager.send_event(
          events.CHEQUE_DD_DELETE_RECEIPT_POPUP_CLICKED_TFI,
          {
            txn_id: transData.transaction_id,
            mode: transData.payment_mode,
          }
        )
        confirmModalData = {
          modalTitle: EPC.DELETE_TRANSACTION_TITLE,
          modalDesc: EPC.DELETE_TRANSACTION_DESC,
          primaryBtnText: EPC.DELETE_TRANSACTION_PRIMARY_BTN_TEXT,
          secondaryBtnText: EPC.DELETE_TRANSACTION_SECONDARY_BTN_TEXT,
        }
      } else {
        eventManager.send_event(
          events.CHEQUE_DD_CANCEL_TRANSACTION_CLICKED_TFI,
          {
            txn_id: transData.transaction_id,
            mode: transData.payment_mode,
          }
        )
        confirmModalData = {
          modalTitle: EPC.CANCELLED_TRANSACTION_TITLE,
          modalDesc: EPC.CANCELLED_TRANSACTION_DESC,
          primaryBtnText: EPC.CANCELLED_TRANSACTION_PRIMARY_BTN_TEXT,
          secondaryBtnText: EPC.CANCELLED_TRANSACTION_SECONDARY_BTN_TEXT,
        }
      }
      setRevokeTransactionData({
        ...revokeTransactionData,
        ...confirmModalData,
        txnId: transData.transaction_id,
        receiptNo: transData.receipt_no,
        action: action,
      })
      setShowConfirmPopup(true)
    } else if (
      action === EPC.ACTION_CANCEL_TRANSACTION_RECEIPT ||
      action === EPC.ACT_DOWNLOAD_RECEIPT
    ) {
      const isCancelled = action === EPC.ACTION_CANCEL_TRANSACTION_RECEIPT
      const receiptData = {
        receiptNo: isCancelled ? 'canc_receipt_no' : 'receipt_no',
        receiptUrl: isCancelled ? 'canc_receipt_url' : 'receipt_url',
      }
      eventManager.send_event(
        isCancelled
          ? events.CHEQUE_DD_DOWNLOAD_CANCELLED_RECEIPT_CLICKED_TFI
          : events.CHEQUE_DD_DOWNLOAD_RECEIPT_CLICKED_TFI,
        {
          txn_id: transData.transaction_id,
          mode: transData.payment_mode,
        }
      )
      if (transData[receiptData.receiptUrl] !== '') {
        eventManager.send_event(
          isCancelled
            ? events.CANCELLED_RECEIPT_DOWNLOADED_TFI
            : events.RECEIPT_DOWNLOADED_TFI,
          {
            txn_id: transData.transaction_id,
          }
        )
        openLinkInNewTab(transData[receiptData.receiptUrl])
      } else {
        dispatch({
          type: feeTransactionActionTypes.FEE_TRANSACTION_DOWNLOAD_REQUESTED,
          payload: {
            isCancelled: isCancelled,
            studentId: transData.student_id,
            receiptNo: transData[receiptData.receiptNo].replace('CAN/', ''),
            filters: {
              sessionStartDate: sessionStartDate,
              sessionEndDate: sessionEndDate,
              paymentStatus: filter.paymentStatus ?? defaultPaymentStatus,
              paymentModes: filter.paymentModes ?? [],
            },
          },
        })
      }
    }
  }

  const handleNameClick = (studentData) => {
    dispatch(
      setSliderScreenAction(
        EPC.SliderScreens.STUDENT_DETAILS_SLIDER,
        studentData
      )
    )
  }

  const getTransactionModelScreen = (status) => {
    if (
      status === EPC.TRANSACTION_UPDATE_STATUS ||
      status === EPC.VIEW_TXN_TIMELINE
    ) {
      return (
        <FeeTransactionModal
          showFeeTransactionModal={showFeeTransactionModal}
          setShowFeeTransactionModal={setShowFeeTransactionModal}
          feeTransacationModel={feeTransacationModel}
          feeTransacationPassData={feeTransacationPassData}
          paymentStatus={paymentStatus}
          sessionStartDate={sessionStartDate}
          sessionEndDate={sessionEndDate}
        />
      )
    } else {
      return null
    }
  }

  const payModeNameFn = (transactionData) => {
    if (transactionData.payment_mode) {
      if (
        transactionData.payment_mode == 'DD' ||
        transactionData.payment_mode == 'POS'
      ) {
        return transactionData.payment_mode
      }
      return (
        payModeLabel[transactionData.payment_mode] ??
        camelCaseText(transactionData.payment_mode)
      )
    } else {
      return 'None'
    }
  }

  const toolTipsOptions = (transactionData) => {
    if (transactionData.revoked) {
      return false
    }
    const tooltipsPassData = () => {
      if (transactionData.transaction_status == paymentStatus.PENDING) {
        // return FEE_TRANSACTION_FAILED_OPTIONS
        if (transactionData.payment_mode == 'ONLINE') {
          return FEE_TRANSACTION_FAILED_OPTIONS
        } else {
          return FEE_TRANSACTION_PENDING_OPTIONS
        }
      } else if (transactionData.transaction_status == paymentStatus.FAILED) {
        return FEE_TRANSACTION_FAILED_OPTIONS
      } else if (
        transactionData.transaction_status == paymentStatus.SUCCESS ||
        transactionData.transaction_status == paymentStatus.SETTLED
      ) {
        if (transactionData.payment_mode == 'ONLINE') {
          return FEE_TRANSACTION_ONLINE_SUCCESS_OPTIONS
        } else {
          return FEE_TRANSACTION_SUCCESS_OPTIONS
        }
      } else if (
        transactionData.transaction_status == paymentStatus.CANCELLED
      ) {
        return FEE_TRANSACTION_CANCELLED_OPTIONS
      } else {
        return FEE_TRANSACTION_SUCCESS_OPTIONS
      }
    }
    return (
      <SubjectTooltipOptions
        subjectItem={transactionData}
        options={tooltipsPassData()}
        trigger={
          <img
            src="https://storage.googleapis.com/tm-assets/icons/secondary/settings-dots-secondary.svg"
            alt=""
            className="w-4 h-4"
          />
        }
        handleChange={handleOnclickModel}
      />
    )
  }

  const getStudentDetails = (studentId) => {
    return studentsList
      ? studentsList.find((student) => student._id === studentId)
      : null
  }

  const handleCopy = (str) => {
    dispatch(showToast({type: 'success', message: 'Copied Successfully'}))
    navigator && navigator.clipboard.writeText(str)
  }
  const rowsData = chequeTransacationlistData
    .filter((transaction) => {
      //for Cheque and DD Transcation Only.
      return (
        transaction.payment_mode === 'CHEQUE' ||
        transaction.payment_mode === 'DD'
      )
    })
    .filter((transaction) => {
      if (filter.paymentStatus.includes(transaction.cheque_status)) {
        return filter.paymentModes.length === 0
          ? true
          : filter.paymentModes.includes(transaction.payment_mode)
      }
      return false
    })
    .filter((transaction) => {
      if (searchTerm) {
        const student = getStudentDetails(transaction.student_id)
        return !student
          ? false
          : student?.name
              .toLowerCase()
              .replace('  ', ' ')
              .includes(searchTerm.toLowerCase()) ||
              student?.phone_number.includes(searchTerm)
      }
      return true
    })
    .filter(
      (transactionDataObj) =>
        typeof transactionDataObj.cheque_status !== 'undefined' &&
        Object.keys(EPC.bankTransactionModes).includes(
          transactionDataObj?.cheque_status
        )
    )
    .map((transactionDataObj, i) => {
      const student = getStudentDetails(transactionDataObj.student_id)
      if (!student) {
        return transactionDataObj
      }
      const transactionData = {
        ...transactionDataObj,
        classroom: student?.classroom,
        student_name: student?.name,
        phone_number: student?.phone_number,
      }

      return {
        txn_id: transactionData.transaction_id ? (
          <div className="cstTxnbl">
            <span
              className={classNames(styles.cstTxnId)}
              data-tip
              data-for={`${transactionData.transaction_id}_${i}`}
            >
              {`# ${getShortTxnId(transactionData.transaction_id, 8)}`}
            </span>
            <img
              className={classNames(styles.cstTxnIdCopyIcon)}
              src="https://storage.googleapis.com/tm-assets/icons/blue/copy-blue.svg"
              alt="Copy"
              onClick={() => {
                handleCopy(transactionData.transaction_id)
              }}
            />
            <Tooltip
              toolTipId={`${transactionData.transaction_id}_${i}`}
              place="top"
              type="info"
            >
              <span>{transactionData.transaction_id}</span>
            </Tooltip>
          </div>
        ) : (
          <span className="tm-para tm-para-14">NA</span>
        ),
        studentDetails: (
          <div className={styles.flex}>
            <img
              className={styles.img}
              src={transactionData.pic_url || userDefaultIcon}
              alt=""
            />
            <div>
              <div
                className={classNames(styles.link)}
                onClick={() =>
                  handleNameClick({
                    Id: student?._id,
                    name: student?.name,
                    phoneNumber: student?.phone_number,
                    selectedSliderTab: 'FEE_HISTORY',
                  })
                }
              >
                {student.name ?? '-'}
              </div>
              <div className={classNames(styles.displayData)}>
                {student.phone_number ?? '-'}
              </div>
            </div>
          </div>
        ),
        class: student?.classroom,
        amount: (
          <div>
            <div className="bold">
              {getAmountFixDecimalWithCurrency(
                transactionData.amount,
                instituteInfo.currency
              )}
            </div>
            <div
              className={classNames(styles.displayData, styles.cstTimestamp)}
            >
              {convertTimestampToLocalDateTime(transactionData.timestamp)}
            </div>
          </div>
        ),
        mode: <div>{payModeNameFn(transactionData)}</div>,
        disbursalDate: (
          <div>
            <div
              className={classNames(styles.displayData, styles.cstTimestamp)}
            >
              {transactionData.disbursal_timestamp
                ? convertTimestampToLocalDateTime(
                    transactionData.disbursal_timestamp
                  )
                : '-'}
            </div>
          </div>
        ),
        status: (
          <div>
            <div className="tm-para tm-para-14">
              <Tag
                accent={getPayStatusTag(transactionData.cheque_status)}
                content={camelCaseText(transactionData.cheque_status)}
              />
            </div>
          </div>
        ),
        action: (
          <div
            id={
              transactionData.transaction_id
                ? transactionData.transaction_id
                : transactionData.receipt_no
            }
          >
            {toolTipsOptions(transactionData)}
          </div>
        ),
        hidden: transactionData.hidden,
      }
    })

  return (
    <div>
      {showConfirmPopup && (
        <div>
          <ConfirmationPopup
            onClose={() => {
              if (
                revokeTransactionData.action === EPC.ACTION_CANCEL_TRANSACTION
              ) {
                eventManager.send_event(
                  events.CHEQUE_DD_CANCEL_TRANSACTION_POP_CLICKED_TFI,
                  {
                    action: 'cancel',
                    txn_id: revokeTransactionData.txnId,
                  }
                )
              } else {
                eventManager.send_event(
                  events.CHEQUE_DD_DELETE_RECEIPT_POPUP_CLICKED_TFI,
                  {
                    action: 'deleted',
                    txn_id: revokeTransactionData.txnId,
                  }
                )
              }
              setRevokeTransactionData({})
              setShowConfirmPopup(false)
            }}
            onAction={() => confirmRevokeTransaction()}
            icon={
              <Icon
                name="removeCircle"
                color="error"
                className={classNames(
                  styles.higherSpecificity,
                  styles.higherSpecificity2,
                  styles.confirmIcon
                )}
              />
            }
            title={revokeTransactionData.modalTitle}
            desc={revokeTransactionData.modalDesc}
            primaryBtnText={revokeTransactionData.primaryBtnText}
            secondaryBtnText={revokeTransactionData.secondaryBtnText}
            secondaryBtnStyle={classNames(
              styles.higherSpecificity,
              styles.higherSpecificity2,
              styles.modalDeleteBtn
            )}
          />
        </div>
      )}
      <div className="tm-box-shadow1 tm-border-radius1 bg-white my-3 pb-4">
        <div className={classNames(styles.filtersAndSearchBar, 'p-4 pb-0')}>
          <div style={{position: 'relative', display: 'flex'}}>
            <DateRangePicker
              startDate={sessionStartDate}
              endDate={sessionEndDate}
              onChange={handleDateChange}
              className={styles.filterDateRangePicker}
              classes={{
                wrapper: styles.dateRangePickerWrapper,
                textInputBox: styles.dateRangePickerTextInputBox,
              }}
            />
            <div
              ref={ref}
              className={classNames(styles.feeTransactionFiltersBl)}
            >
              <button
                className={classNames(
                  showDropDown ? 'fill' : 'border',
                  styles.cstAddFiltersBtn
                )}
                onClick={() => setShowDropDown(!showDropDown)}
              >
                <img
                  src={showDropDown ? filterWhite : filterBlue}
                  alt={FEE_TRANSACTION_LABEL.ADD_FILTERS}
                  className={classNames(styles.cstFilterIcon)}
                />
                {FEE_TRANSACTION_LABEL.ADD_FILTERS}
              </button>

              {showDropDown && (
                <ChequeTransactionFilters
                  filters={filter}
                  onApplyFilters={handleApplyFilters}
                />
              )}
            </div>
          </div>
          {/* <div className={styles.searchContainer}>
            <img
              src="https://storage.googleapis.com/tm-assets/icons/secondary/search-secondary.svg"
              className={styles.searchIcon}
            />
            <input
              type="text"
              value={searchTerm}
              placeholder="Search by student name"
              onChange={(e) => setSearchTerm(e.target.value)}
              className={classnames(styles.input, 'tm-para-14')}
            />
          </div> */}
          <SearchBar
            onChange={setSearchTerm}
            placeholder={t('searchPlaceholder')}
            inputValue={searchTerm}
            wrapperClassName={classNames(
              'py-2 px-4',
              styles.higherSpecificity,
              styles.higherSpecificity2,
              styles.searchInputDiv
            )}
          />
        </div>

        <div className={classNames(styles.filters, 'px-4')}>
          {filter.paymentStatus.map((status) => {
            const actualStatus =
              status === 'REVOKED'
                ? camelCaseText(paymentStatus.REVOKED)
                : camelCaseText(status)
            return (
              <Chip
                key={status}
                label={camelCaseText(actualStatus)}
                value={status}
                onChange={() => handleFilterRemove('status', status)}
              />
            )
          })}
          {filter.paymentModes.map((mode) => {
            return (
              <Chip
                key={mode}
                label={payModeLabel[mode] ?? camelCaseText(mode)}
                value={mode}
                onChange={() => handleFilterRemove('method', mode)}
              />
            )
          })}
        </div>
        <ErrorBoundary>
          {chequeTransacationlistDataLoading ? <div className="loading" /> : ''}
          {chequeTransacationListErrMsg ? (
            <ErrorOverlay>{chequeTransacationListErrMsg}</ErrorOverlay>
          ) : (
            <div>
              {rowsData.length > 0 ? (
                <Table
                  rows={rowsData}
                  cols={cols}
                  className={styles.width100}
                />
              ) : (
                <div className="text-center">
                  <EmptyScreenV1
                    image={emptyFeeTrasanctionImage}
                    title="There are no transactions to report"
                  />
                </div>
              )}
            </div>
          )}
        </ErrorBoundary>
      </div>
      <div>{getTransactionModelScreen(feeTransacationModel)}</div>
    </div>
  )
}
