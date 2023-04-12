import React, {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {HeaderTemplate, Icon, ICON_CONSTANTS} from '@teachmint/krayon'
import styles from './Header.module.css'
import history from '../../../../../../history'
import {
  feeReminderRequestedAction,
  fetchStudentIdsForFeeReminderAction,
} from '../../../../redux/feeCollectionActions'
import SendFeeReminderConfirmationPopup from '../../../SendFeeReminderConfirmationPopup/SendFeeReminderConfirmationPopup'
import {useFeeCollection} from '../../../../redux/feeCollectionSelectors'
import CollectBackdatedPaymentModal from '../../../StudentDues/CollectBackdatedPaymentModal/CollectBackdatedPaymentModal'
import {t} from 'i18next'
import {events} from '../../../../../../utils/EventsConstants'
import Permission from '../../../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../../utils/permission.constants'
import {ErrorBoundary} from '@teachmint/common'
import SubjectTooltipOptions from '../../../../../../components/SchoolSystem/SectionDetails/SubjectTooltipOptions'

export default function Header({sendClickEvent}) {
  const dispatch = useDispatch()
  const isMobile = useSelector((state) => state.isMobile)
  const [showPopup, setShowPopup] = useState(false)
  const [isBackdatedPaymentModalOpen, setIsBackdatedPaymentModalOpen] =
    useState(false)
  const {feesReminderLoading, studentIdsForFeeReminder} = useFeeCollection()
  const handleSendReminder = () => {
    dispatch(
      feeReminderRequestedAction(
        studentIdsForFeeReminder.studentIds.student_ids
      )
    )
    setShowPopup(false)
    sendClickEvent(events.FEE_REMINDER_SENT_TFI, {
      screen_name: 'fee_collection',
      standard_ids: studentIdsForFeeReminder.studentIds.student_ids,
    })
  }

  const handleReminderCloseClick = () => {
    setShowPopup(false)
  }

  const handleSendReminderButtonClick = () => {
    setShowPopup(true)
    dispatch(fetchStudentIdsForFeeReminderAction())
    sendClickEvent(events.FEE_SEND_REMINDER_CLICKED_TFI, {
      screen_name: 'fee_collection',
      standard_ids: studentIdsForFeeReminder.studentIds.student_ids,
    })
  }

  const getActions = () => {
    return (
      <>
        <SubjectTooltipOptions
          subjectItem={'1'}
          toolTipOptionsContainerClass={styles.studentMoreActionIcon}
          options={
            !isMobile
              ? [
                  {
                    label: t('uploadBackdatedPayment'),
                    action: () => {
                      setIsBackdatedPaymentModalOpen(true)
                      sendClickEvent(
                        events.FEE_COLLECT_BACKDATED_BUTTON_CLICKED_TFI
                      )
                    },
                    permissionId:
                      PERMISSION_CONSTANTS.feeModuleController_collectBulkPayment_create,
                  },
                ]
              : [
                  {
                    label: t('viewFeeReports'),
                    action: () => {
                      history.push(`/institute/dashboard/fee-reports`)
                      sendClickEvent(events.FEE_REPORT_CLICKED_TFI, {
                        screen_name: 'collection',
                      })
                    },
                  },
                ]
          }
          trigger={
            <span
              data-size="x_s"
              data-qa="icon-moreVertical"
              className="icon-moreVertical_outlined krayon__Icon-module__eRVVq krayon__Icon-module__szG-X SectionWiseStudents_studentMoreActionIcon__1Bl2U"
              data-type="primary"
            ></span>
          }
          handleChange={(action) => action()}
        />
      </>
    )
  }

  return (
    <ErrorBoundary>
      <HeaderTemplate
        classes={{
          mainHeading: styles.headerTitle,
          subHeading: styles.headerSubTitle,
          divider: styles.headerDivider,
        }}
        mainHeading={t('feeCollection')}
        showBreadcrumb={false}
        actionButtons={
          isMobile
            ? []
            : [
                {
                  category: 'primary',
                  children: (
                    <span className={styles.headerBtnWrapper}>
                      <Icon
                        name="barChart"
                        size={ICON_CONSTANTS.SIZES.X_SMALL}
                        type={ICON_CONSTANTS.TYPES.PRIMARY}
                      />
                      <span>{t('viewReports')}</span>
                    </span>
                  ),
                  classes: {},
                  id: 'sec-btn',
                  onClick: () => {
                    history.push(`/institute/dashboard/fee-reports`)
                  },
                  size: 'l',
                  type: 'outline',
                  width: 'fit',
                },
                {
                  category: 'primary',
                  children: (
                    <Permission
                      permissionId={
                        PERMISSION_CONSTANTS.feeModuleController_sendFeeReminder_create
                      }
                    >
                      <span className={styles.headerBtnWrapper}>
                        <Icon
                          name="alert"
                          size={ICON_CONSTANTS.SIZES.X_SMALL}
                          type={ICON_CONSTANTS.TYPES.PRIMARY}
                        />
                        <span>{t('sendReminder')}</span>
                      </span>
                    </Permission>
                  ),
                  classes: {},
                  id: 'sec-btn',
                  onClick: () => handleSendReminderButtonClick(),
                  size: 'l',
                  type: 'outline',
                  width: 'fit',
                },
              ]
        }
        headerTemplateRightElement={getActions()}
      />
      {showPopup && (
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
      )}
      {/* Collect backdated payment */}
      {isBackdatedPaymentModalOpen && (
        <CollectBackdatedPaymentModal
          isOpen={isBackdatedPaymentModalOpen}
          handleOpenCloseBackdatedPaymentModal={() =>
            setIsBackdatedPaymentModalOpen(!isBackdatedPaymentModalOpen)
          }
        />
      )}
    </ErrorBoundary>
  )
}
