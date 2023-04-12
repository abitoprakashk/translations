import React, {useEffect, useState} from 'react'
import styles from './InstalmentWiseDetails.module.css'
import FeeTabStyles from '../../FeeTab.module.css'
import {Heading, Button, ICON_CONSTANTS, Icon} from '@teachmint/krayon'
import classNames from 'classnames'
import InstalmentInfo from './InstalmentInfo/InstalmentInfo'
import {useDispatch, useSelector} from 'react-redux'
import {DateTime} from 'luxon'
import {useTranslation} from 'react-i18next'
import FeePaymentHistoryModal from '../FeePaymentHistoryModal/FeePaymentHistoryModal'
import AddInstallmentModal from '../AddInstallmentModal/AddInstallmentModal'
import {setFeeCollectSliderScreen} from '../../../redux/feeAndWallet/actions'
import {
  EVENTS_SCREEN_NAMES,
  PAYMENT_HISTORY_MODALS_FOR,
} from '../../FeeTabConstant'
import {ErrorBoundary, ErrorOverlay} from '@teachmint/common'
import NoDataComp from '../NoDataComp/NoDataComp'
import InstalmentWiseDetailsSkeleton from '../../skeletons/InstalmentWiseDetailsSkeleton/InstalmentWiseDetailsSkeleton'
import {events} from '../../../../../../utils/EventsConstants'
import SubjectTooltipOptions from '../../../../SectionDetails/SubjectTooltipOptions'
import {
  INSTALLMENT_WISE_DETAILS_DOT_BUTTON_OPTION,
  INSTALLMENT_WISE_DETAILS_DOT_BUTTON_OPTION_IDS,
} from '../../../../../../pages/fee/fees.constants'
import globalActions from '../../../../../../redux/actions/global.actions'
import EditInstallmentModal from '../EditInstallmentModal/EditInstallmentModal'
import {PERMISSION_CONSTANTS} from '../../../../../../utils/permission.constants'
import Permission from '../../../../../Common/Permission/Permission'

export default function InstalmentWiseDetails({
  studentId = null,
  isDataFetching = false,
  sendClickEvents = () => {},
}) {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  // const isSummaryDataFetching = useSelector(
  //   (state) => state.studentProfileFeeAndWalletTab.feeTab.summary.isDataFetching
  // )
  const {data, error} = useSelector(
    (state) => state.studentProfileFeeAndWalletTab.feeTab.instlamentwiseDetails
  )

  const [isPaymentHistoryModalOpen, setIsPaymentHistoryModalOpen] =
    useState(false)

  const [addInstallmentModal, setAddInstallmentModal] = useState(false)
  const [editInstallmentModal, setEditInstallmentModal] = useState(false)
  const [editInstallmentModalData, setEditInstallmentModalData] = useState(null)
  const [receiptPrefixList, setReceiptPrefixList] = useState([])
  const [modalForAndTimeStamp, setModalForAndTimeStamp] = useState({
    modalFor: PAYMENT_HISTORY_MODALS_FOR.viewPaymentHistory,
    installmentTimestamp: null,
  })

  useEffect(() => {
    const successAction = (receiptPrefix) => {
      setReceiptPrefixList(receiptPrefix)
    }
    dispatch(globalActions.getReceiptPrefixesRequest.request('', successAction))
  }, [])

  const instituteActiveAcademicSessionId = useSelector(
    (state) => state.instituteActiveAcademicSessionId
  )

  const currentDate = DateTime.now().startOf('day')

  const handlePaymentHistoryModalBtnClick = (
    openModalFor = PAYMENT_HISTORY_MODALS_FOR.viewPaymentHistory,
    installmentTimestamp = null
  ) => {
    setIsPaymentHistoryModalOpen(true)
    setModalForAndTimeStamp({
      ...modalForAndTimeStamp,
      modalFor: openModalFor,
      installmentTimestamp,
    })
  }

  const handleSetEditInstallmentModalData = (obj) => {
    setEditInstallmentModalData(obj)
    setEditInstallmentModal(true)
  }

  const handleTooltipOptions = (action) => {
    switch (action) {
      case INSTALLMENT_WISE_DETAILS_DOT_BUTTON_OPTION_IDS.ADD_INSTALLMENT: {
        if (receiptPrefixList.length == 0) break
        setAddInstallmentModal(true)
        break
      }
      case INSTALLMENT_WISE_DETAILS_DOT_BUTTON_OPTION_IDS.VIEW_PAYMENT_HISTORY: {
        sendClickEvents(events.STUDENT_FEE_VIEW_PAYMENT_HISTORY_CLICKED_TFI)
        handlePaymentHistoryModalBtnClick(
          PAYMENT_HISTORY_MODALS_FOR.viewPaymentHistory
        )
        break
      }
      default:
        break
    }
  }
  if (isDataFetching) {
    return <InstalmentWiseDetailsSkeleton />
  }

  return (
    <>
      {isPaymentHistoryModalOpen && (
        <ErrorBoundary>
          <FeePaymentHistoryModal
            studentId={studentId}
            isOpen={isPaymentHistoryModalOpen}
            setIsOpen={setIsPaymentHistoryModalOpen}
            modalForAndTimeStamp={modalForAndTimeStamp}
            sendClickEvents={sendClickEvents}
          />
        </ErrorBoundary>
      )}
      {addInstallmentModal && (
        <ErrorBoundary>
          <AddInstallmentModal
            studentId={studentId}
            isOpen={addInstallmentModal}
            setIsOpen={setAddInstallmentModal}
            sendClickEvents={sendClickEvents}
            receiptPrefixList={receiptPrefixList}
          />
        </ErrorBoundary>
      )}
      {editInstallmentModal && (
        <ErrorBoundary>
          <EditInstallmentModal
            studentId={studentId}
            isOpen={editInstallmentModal}
            setIsOpen={setEditInstallmentModal}
            sendClickEvents={sendClickEvents}
            receiptPrefixList={receiptPrefixList}
            editInstallmentModalData={editInstallmentModalData}
            setEditInstallmentModalData={setEditInstallmentModalData}
          />
        </ErrorBoundary>
      )}
      <ErrorBoundary>
        <div className={styles.section}>
          <div
            className={classNames(
              FeeTabStyles.dFlex,
              FeeTabStyles.justifyBetween
            )}
          >
            <div>
              <Heading textSize="s">{t('installmentDetails')}</Heading>
            </div>
            <div className={classNames(FeeTabStyles.dFlex, styles.gap20)}>
              <Permission
                permissionId={
                  PERMISSION_CONSTANTS.feeModuleController_feeStudentPayment_create
                }
              >
                <Button
                  classes={{button: FeeTabStyles.radius12}}
                  onClick={() => {
                    sendClickEvents(events.RECORD_PAYMENT_INITIALIZED_TFI, {
                      student_id: studentId,
                      screen_name: EVENTS_SCREEN_NAMES.student_details,
                      session_id: instituteActiveAcademicSessionId,
                    })
                    dispatch(
                      setFeeCollectSliderScreen(true, {
                        sliderData: {studentId, classId: ''},
                      })
                    )
                  }}
                  type="filled"
                >
                  {t('collectFee')}
                </Button>
              </Permission>
              <SubjectTooltipOptions
                options={INSTALLMENT_WISE_DETAILS_DOT_BUTTON_OPTION}
                trigger={
                  <div>
                    <Icon
                      name="ellipsisVertical"
                      type={ICON_CONSTANTS.TYPES.SECONDARY}
                      size={ICON_CONSTANTS.SIZES.MEDIUM}
                    />
                  </div>
                }
                handleChange={handleTooltipOptions}
              />
            </div>
          </div>

          <div className={styles.instalmentInfoSection}>
            {error ?? <ErrorOverlay>{error}</ErrorOverlay>}
            {data.length > 0 ? (
              data.map((instalment, idx) => {
                return (
                  <ErrorBoundary key={`instalmentInfoSection${idx}`}>
                    <InstalmentInfo
                      index={idx + 1}
                      instalmentInfo={instalment}
                      currentDate={currentDate}
                      handlePaymentHistoryModalBtnClick={
                        handlePaymentHistoryModalBtnClick
                      }
                      studentId={studentId}
                      sendClickEvents={sendClickEvents}
                      handleSetEditInstallmentModalData={
                        handleSetEditInstallmentModalData
                      }
                    />
                  </ErrorBoundary>
                )
              })
            ) : (
              <NoDataComp msg={t('noInstallmentsFound')} />
            )}
          </div>
        </div>
      </ErrorBoundary>
    </>
  )
}
