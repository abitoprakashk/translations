import {React, useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {
  Modal,
  Timeline,
  TIMELINE_STATUS,
  Button,
  ErrorOverlay,
} from '@teachmint/common'
import crossIcon from '../../../../assets/images/icons/cross-gray.svg'
import styles from './FeeTransactionModal.module.css'
import {
  paymentStatus,
  paymentStatusLabels,
  TRANSACTION_UPDATE_STATUS,
  VIEW_TXN_TIMELINE,
} from '../../fees.constants.js'
import userDefaultIcon from '../../../../assets/images/icons/user-profile.svg'
import classNames from 'classnames'
import {
  camelCaseText,
  convertTimestampToLocalDateTime,
  getAmountFixDecimalWithCurrency,
} from '../../../../utils/Helpers'
import {
  FEE_TIMELINE_LABEL,
  FEE_TRANSACTION_LABEL,
  payStatusClass,
} from '../FeeTransaction/FeeTransactionConstants'
import {
  fetchFeeTimelineStatusRequestAction,
  updateFeeTimelineStatusRequestAction,
} from '../../redux/feeTransactionActions'
import {useFeeTransactionCollection} from '../../redux/feeTransacationSelectors'
import {events} from '../../../../utils/EventsConstants'

export default function FeeTransactionModal({
  showFeeTransactionModal,
  setShowFeeTransactionModal,
  feeTransacationModel = null,
  feeTransacationPassData = {},
  sessionStartDate = null,
  sessionEndDate = null,
}) {
  const updateStatus = {
    DEPOSITED: 'DEPOSITED',
    CLEARED: 'CLEARED',
    BOUNCED: 'BOUNCED',
    RETURNED: 'RETURNED',
    // FAILED: 'FAILED',
  }

  const dispatch = useDispatch()
  const [timelineStepsCollectData, setTimelineStepsCollectData] = useState([])
  const {transaction_id, payment_mode, cheque_status} = {
    ...feeTransacationPassData,
  }
  let [timelineStatus, setTimelineStatus] = useState(
    cheque_status === updateStatus.DEPOSITED
      ? updateStatus.CLEARED
      : updateStatus.DEPOSITED
  )

  const {feeTimelineStatusData, feeTimelineErrMsg} =
    useFeeTransactionCollection()
  const eventManager = useSelector((state) => state.eventManager)
  const {instituteInfo} = useSelector((state) => state)
  const {timeline} = {...feeTimelineStatusData}

  const classes = {
    wrapper: styles.wrapper,
    step: styles.step,
    inProgress: styles.inProgress,
    completed: styles.completed,
    notStarted: styles.notStarted,
    milestone: styles.milestone,
    inProgressMilestone: styles.inProgressMilestone,
    completedMilestone: styles.completedMilestone,
    notStartedMilestone: styles.notStartedMilestone,
    path: styles.path,
    inProgressPath: styles.inProgressPath,
    completedPath: styles.completedPath,
    notStartedPath: styles.notStartedPath,
    infoWrapper: styles.infoWrapper,
    title: styles.title,
    body: styles.body,
  }

  const payModeNameFn = (transactionData) => {
    if (transactionData.payment_mode) {
      if (
        transactionData.payment_mode == 'DD' ||
        transactionData.payment_mode == 'POS'
      ) {
        return transactionData.payment_mode
      }
      return camelCaseText(transactionData.payment_mode)
    } else {
      return 'None'
    }
  }
  useEffect(() => {
    setTimelineStatus(
      cheque_status == updateStatus.DEPOSITED
        ? updateStatus.CLEARED
        : updateStatus.DEPOSITED
    )
  }, [transaction_id, cheque_status])
  useEffect(() => {
    if (payment_mode) {
      dispatch(
        fetchFeeTimelineStatusRequestAction(transaction_id, payment_mode)
      )
    }
  }, [transaction_id, payment_mode])

  const paymentStatusLabel = (step) => {
    if (
      payment_mode === paymentStatus.CHEQUE ||
      payment_mode === paymentStatus.DD
    ) {
      return payment_mode === paymentStatus.CHEQUE
        ? paymentStatusLabels.CHEQUE.actualLabel
        : paymentStatusLabels.DD.actualLabel
    } else {
      return FEE_TIMELINE_LABEL['LABEL'][
        step.cheque_status ?? step.transaction_status
      ]
    }
  }

  useEffect(() => {
    if (!timeline) {
      return null
    }
    const timelineStepsData = timeline.map((step, i) => {
      const paymentStatus =
        paymentStatusLabel(step) +
        ' - ' +
        camelCaseText(step.cheque_status ?? step.transaction_status)

      const stepStatus = () => {
        if (i === 0) {
          return TIMELINE_STATUS.COMPLETED
        } else {
          return TIMELINE_STATUS.IN_PROGRESS
        }
      }

      return {
        id: `${i}`,
        title: <span>{paymentStatus}</span>,
        body: (
          <span>
            <li>{convertTimestampToLocalDateTime(step.timestamp)}</li>
            <li>
              Marked by :{' '}
              {payment_mode == 'ONLINE'
                ? feeTransacationPassData.student_name
                : step.marked_by}
            </li>
          </span>
        ),
        status: stepStatus(),
      }
    })
    // setTimelineStepsCollectData(...timelineStepsCollectData, timelineStepsData)
    setTimelineStepsCollectData(timelineStepsData)
  }, [timeline])

  const handleSelectionChange = (e) => {
    setTimelineStatus(e.target.value)
  }

  const handleOnclickUpdateStatus = (e) => {
    e.preventDefault()
    dispatch(
      updateFeeTimelineStatusRequestAction(
        transaction_id,
        timelineStatus,
        sessionStartDate,
        sessionEndDate,
        feeTransacationPassData.payment_mode
      )
    )
    setShowFeeTransactionModal(false)
    // eventManager.send_event(events.TXN_STATUS_UPDATED_TFI, {
    eventManager.send_event(events.CHEQUE_DD_TXN_STATUS_UPDATED_TFI, {
      txn_id: transaction_id,
      status: timelineStatus,
    })
  }

  return (
    <Modal
      show={showFeeTransactionModal}
      className={classNames(styles.modalModuleMain)}
    >
      <div
        className="bg-white lg:rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-8 pt-8 hidden lg:flex items-center justify-between">
          {feeTransacationModel == TRANSACTION_UPDATE_STATUS ? (
            <div className="tm-h5">{FEE_TRANSACTION_LABEL.EDIT_STATUS}</div>
          ) : feeTransacationModel == VIEW_TXN_TIMELINE ? (
            <div className="tm-h5">
              {FEE_TRANSACTION_LABEL.TRANSACTION_TIMELINE}
            </div>
          ) : null}
          <img
            src={crossIcon}
            alt="cross"
            className="w-6 h-6 cursor-pointer"
            onClick={() => setShowFeeTransactionModal(false)}
          />
        </div>
        <div className="py-4">
          <div className="lg:flex px-8 py-4">
            <div className={classNames(styles.feeCategoryAddFeeType)}>
              <div className="block w-full mt-2">
                <div className={styles.feeCategoryAddFeeTypeIcon}>
                  <img
                    src={feeTransacationPassData.pic_url || userDefaultIcon}
                    className={styles.imgData}
                  />
                </div>
                <div className="inline-block pl-1">
                  <div>
                    {feeTransacationPassData.student_name
                      ? feeTransacationPassData.student_name
                      : '-'}
                  </div>
                  <div className={styles.displayData}>
                    {feeTransacationPassData.phone_number
                      ? feeTransacationPassData.phone_number
                      : '-'}
                  </div>
                </div>
                <hr className="mt-6 mx-4 border-dashed border-1" />
                <div className="block w-full mt-2">
                  <div
                    className={classNames(
                      styles.student_trans_details_bl,
                      'my-6'
                    )}
                  >
                    <div className={classNames(styles.trans_details_children)}>
                      <span>
                        #
                        {feeTransacationPassData.transaction_id
                          ? feeTransacationPassData.transaction_id
                          : 'No Transacation ID'}
                      </span>
                      <span className="tm-para tm-para-14">
                        {FEE_TRANSACTION_LABEL.TXN_ID}
                      </span>
                    </div>
                    <div className={classNames(styles.trans_details_children)}>
                      <span>
                        {getAmountFixDecimalWithCurrency(
                          feeTransacationPassData.amount,
                          instituteInfo.currency
                        )}
                      </span>
                      <span className="tm-para tm-para-14">
                        {FEE_TRANSACTION_LABEL.AMOUNT}
                      </span>
                    </div>
                    <div className={classNames(styles.trans_details_children)}>
                      <span>
                        {convertTimestampToLocalDateTime(
                          feeTransacationPassData.timestamp
                        )}
                      </span>
                      <span className="tm-para-14">
                        {FEE_TRANSACTION_LABEL.DATE}
                      </span>
                    </div>
                    <div className={classNames(styles.trans_details_children)}>
                      <span className="transValue">
                        {payModeNameFn(feeTransacationPassData)}
                      </span>
                      <span className="tm-para tm-para-14 transLabel">
                        {FEE_TRANSACTION_LABEL.MODE}
                      </span>
                    </div>
                    <div className={classNames(styles.trans_details_children)}>
                      <span
                        className={classNames(
                          payStatusClass[
                            feeTransacationPassData.transaction_status
                          ]
                        )}
                      >
                        {camelCaseText(
                          // feeTransacationPassData.transaction_status
                          feeTransacationPassData.cheque_status ??
                            feeTransacationPassData.transaction_status
                        )}
                      </span>
                      <span className="tm-para tm-para-14">
                        {feeTransacationPassData.payment_mode === 'CHEQUE' &&
                          FEE_TRANSACTION_LABEL.CHEQUE_STATUS}
                        {feeTransacationPassData.payment_mode === 'DD' &&
                          FEE_TRANSACTION_LABEL.DD_STATUS}
                        {feeTransacationPassData.payment_mode !== 'CHEQUE' &&
                          feeTransacationPassData.payment_mode !== 'DD' &&
                          FEE_TRANSACTION_LABEL.CURRENT_STATUS}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={classNames(
              styles.custTimelineMainBl,
              'show-scrollbar',
              'show-scrollbar-small',
              'lg:flex',
              'w-full',
              'px-8',
              'py-4'
            )}
          >
            {feeTransacationModel == VIEW_TXN_TIMELINE ? (
              <>
                {feeTimelineErrMsg ? (
                  <ErrorOverlay>{feeTimelineErrMsg}</ErrorOverlay>
                ) : (
                  <Timeline
                    steps={timelineStepsCollectData}
                    classes={classes}
                  />
                )}
              </>
            ) : feeTransacationModel == TRANSACTION_UPDATE_STATUS ? (
              <div className={classNames('pt-1', styles.transFormGroup)}>
                <div className={classNames(styles.updateStatusBl)}>
                  <label className={styles.transLabel}>
                    {FEE_TRANSACTION_LABEL.UPDATE_STATUS_DROPDOWN}
                  </label>
                  <select
                    onChange={(e) => handleSelectionChange(e)}
                    name="transaction_status"
                    className={styles.transSelect}
                  >
                    <option disabled value={''}>
                      {FEE_TRANSACTION_LABEL.UPDATE_STATUS_DROPDOWN_PLACEHOLDER}
                    </option>
                    {Object.values(updateStatus)
                      .filter(
                        (st) => st !== feeTransacationPassData.cheque_status
                      )
                      .map((e) => {
                        const optionClass =
                          e === 'SUCCESS'
                            ? 'tm-color-green'
                            : e === 'FAILED'
                            ? 'tm-cr-rd-1'
                            : ''
                        return (
                          <option
                            key={e}
                            value={e}
                            className={optionClass}
                            selected={timelineStatus === e ? 'selected' : ''}
                          >
                            {camelCaseText(e)}
                          </option>
                        )
                      })}
                  </select>
                </div>
                <div className={classNames(styles.submitButtonBl)}>
                  <Button
                    size="big"
                    className={classNames(styles.updateStatusButton)}
                    onClick={(e) => {
                      handleOnclickUpdateStatus(e)
                    }}
                  >
                    {FEE_TRANSACTION_LABEL.UPDATE_STATUS_CONFIRM_BUTTON}
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Modal>
  )
}
