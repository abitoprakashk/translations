import {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import classNames from 'classnames'
import {DateTime} from 'luxon'
import {t} from 'i18next'
import {
  Badges,
  BADGES_CONSTANTS,
  Breadcrumb,
  Button,
  BUTTON_CONSTANTS,
  Divider,
  Heading,
  HEADING_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  Para,
  PlainCard,
  Avatar,
  Popup,
  PARA_CONSTANTS,
  Tooltip,
  TOOLTIP_CONSTANTS,
} from '@teachmint/krayon'
import {ErrorBoundary} from '@teachmint/common'
import {
  useAdmissionCrmSettings,
  useCrmInstituteHierarchy,
  useLeadData,
} from '../../../redux/admissionManagement.selectors'
import styles from './LeadData.module.css'
import history from '../../../../../history'
import ChangeLeadStage from './ChangeLeadStage'
import LeadFollowups from './LeadFollowups'
import {getClassName} from '../../../utils/helpers'
import globalActions from '../../../../../redux/actions/global.actions'
import {events} from '../../../../../utils/EventsConstants'
import ConfirmAdmissionModal from '../../Common/ConfirmAdmissionModal/ConfirmAdmissionModal'

export default function LeadData({leadData}) {
  const dispatch = useDispatch()
  const leadFollowupData = useLeadData()
  const eventManager = useSelector((state) => state.eventManager)
  const admissionFormFields = useAdmissionCrmSettings()
  const leadStages = Object.values(admissionFormFields?.data?.lead_stages)
  const instituteHierarchy = useCrmInstituteHierarchy()
  const [showConfirmAdmissionPopup, setShowConfirmAdmissionPopup] =
    useState(false)
  const [showConfirmAdmissionModal, setShowConfirmAdmissionModal] =
    useState(false)
  const [showChangeLeadModal, setShowChangeLeadModal] = useState(false)
  const [showFollowupModal, setShowFollowupModal] = useState(false)

  const timestamp =
    leadFollowupData?.data?.followup?.last_followup?.followup_timestamp
  const leadName = `${leadData?.profile_data?.name ?? ''} ${
    leadData?.profile_data?.middle_name ?? ''
  } ${leadData?.profile_data?.last_name ?? ''}`

  const admissionConfirmedStageId = leadStages[leadStages.length - 1]._id

  const currentLeadStage = leadStages.find(
    (stage) => stage._id === leadData.lead_stage_id
  )

  const isRejectedLead =
    currentLeadStage?._id === leadStages[leadStages.length - 2]?._id

  const getBreadcrumbPath = () => {
    let breadcrumbPath = []
    if (history.location.state?.link) {
      breadcrumbPath.push({
        label: (
          <div className={styles.cursorPointer}>
            {history.location.state?.tab}
          </div>
        ),
        onClick: () => history.push(history.location.state.link),
      })
    } else {
      breadcrumbPath.push({
        label: <div className={styles.cursorPointer}>{t('leadList')}</div>,
        onClick: () =>
          history.push('/institute/dashboard/admission-management/leads'),
      })
    }
    breadcrumbPath.push({
      label: `${leadName} ${t('leadProfile')}`,
    })
    return breadcrumbPath
  }

  useEffect(() => {
    dispatch(globalActions.getLeadData.request(leadData._id))
  }, [])

  const toggleFollowupModal = () => {
    setShowFollowupModal(true)
    eventManager.send_event(
      events.ADMISSION_LEAD_PROFILE_TOTAL_FOLLOWUPS_CLICKED_TFI
    )
  }

  return (
    <ErrorBoundary>
      {showChangeLeadModal && (
        <ChangeLeadStage
          leadData={leadData}
          showModal={showChangeLeadModal}
          setShowModal={setShowChangeLeadModal}
          setShowConfirmAdmissionPopup={setShowConfirmAdmissionPopup}
          setShowConfirmAdmissionModal={setShowConfirmAdmissionModal}
        />
      )}
      {showFollowupModal && (
        <LeadFollowups
          leadId={leadData?._id}
          showModal={showFollowupModal}
          setShowModal={setShowFollowupModal}
        />
      )}
      {showConfirmAdmissionPopup && (
        <Popup
          isOpen
          onClose={() => setShowConfirmAdmissionPopup(false)}
          header={t('confirmAdmissionPopupTitle')}
          actionButtons={[
            {
              onClick: () => {
                setShowConfirmAdmissionPopup(false)
                eventManager.send_event(
                  events.LEAD_CONFIRM_ADMISSION_CLICKED_TFI,
                  {action: 'cancel'}
                )
              },
              body: t('cancel'),
              type: BUTTON_CONSTANTS.TYPE.OUTLINE,
            },
            {
              onClick: () => {
                eventManager.send_event(
                  events.LEAD_CONFIRM_ADMISSION_CLICKED_TFI,
                  {action: 'confirm'}
                )
                setShowConfirmAdmissionPopup(false)
                setShowConfirmAdmissionModal(true)
                setShowChangeLeadModal(false)
              },
              body: t('confirm'),
              category: BUTTON_CONSTANTS.CATEGORY.PRIMARY,
            },
          ]}
        >
          <Para
            type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
            className={styles.descriptionStyle}
          >
            {t('confirmAdmissionPopupDescription')}
          </Para>
        </Popup>
      )}
      {showConfirmAdmissionModal && (
        <ConfirmAdmissionModal
          lead={leadData}
          showModal={showConfirmAdmissionModal}
          setShowModal={setShowConfirmAdmissionModal}
        />
      )}
      <Breadcrumb paths={getBreadcrumbPath()} />
      <div className={styles.leadProfileContainer}>
        <div className={styles.leadProfileData}>
          <Avatar
            name={`${leadData?.profile_data?.name ?? ''} ${
              leadData?.profile_data?.last_name ?? ''
            }`}
            imgSrc={leadData?.profile_data?.img_url}
            className={styles.leadProfileAvatar}
          />
          <div className={styles.leadDetails}>
            <Heading
              textSize={HEADING_CONSTANTS.TEXT_SIZE.MEDIUM}
              className={styles.textCapital}
            >
              {leadName}
            </Heading>
            <div className={styles.leadDataBasicDetails}>
              <Para>{leadData?.ext_lead_id || leadData._id}</Para>
              {leadData?.profile_data?.gender && (
                <>
                  <div className={styles.separator}></div>
                  <Para className={styles.textTransform}>
                    {leadData.profile_data.gender}
                  </Para>
                </>
              )}
              {leadData?.phone_number && (
                <>
                  <div className={styles.separator}></div>
                  <Para
                    className={classNames(
                      styles.flexItem,
                      styles.mobileVarifiedStatus
                    )}
                  >
                    <spna>{`+${leadData?.phone_number}`}</spna>
                    <a
                      data-tip
                      data-for={leadData?._id}
                      className={styles.tooltipEllipsis}
                    >
                      <Icon
                        name={
                          leadData?.verification_status
                            ? 'verifiedUser'
                            : 'privacyTip'
                        }
                        size={ICON_CONSTANTS.SIZES.XX_SMALL}
                        type={
                          leadData?.verification_status
                            ? ICON_CONSTANTS.TYPES.SUCCESS
                            : ICON_CONSTANTS.TYPES.WARNING
                        }
                      />
                    </a>
                    <Tooltip
                      toolTipId={leadData?._id}
                      toolTipBody={
                        leadData?.verification_status
                          ? t('verifiedPhoneNumber')
                          : t('notVerifiedPhoneNumber')
                      }
                      place={TOOLTIP_CONSTANTS.TOOLTIP_POSITIONS.TOP}
                      classNames={{toolTipBody: styles.toolTipipBody}}
                    />
                  </Para>
                </>
              )}
              {leadData?.profile_data?.email && (
                <>
                  <div className={styles.separator}></div>
                  <Para className={styles.flexItem}>
                    {leadData.profile_data.email}
                  </Para>
                </>
              )}
            </div>
            <div className={styles.leadDataAcademicDetails}>
              <Para className={styles.classStyle}>
                {`${t('classLeadProfilePage')} ${getClassName(
                  instituteHierarchy,
                  leadData?.profile_data?.standard
                )}`}
              </Para>
              <div className={styles.separator}></div>
              <Para className={styles.sessionStyle}>
                {instituteHierarchy?.name}
              </Para>
              <div className={classNames(styles.flexItem, styles.badge)}>
                <Badges
                  showIcon={false}
                  label={currentLeadStage?.name}
                  size={BADGES_CONSTANTS.SIZE.LARGE}
                  type={
                    isRejectedLead
                      ? BADGES_CONSTANTS.TYPE.ERROR
                      : BADGES_CONSTANTS.TYPE.SUCCESS
                  }
                />
              </div>
              {leadData.lead_stage_id !== admissionConfirmedStageId && (
                <div className={styles.flexItem}>
                  <Button
                    type={BUTTON_CONSTANTS.TYPE.TEXT}
                    size={BUTTON_CONSTANTS.SIZE.SMALL}
                    category={BUTTON_CONSTANTS.CATEGORY.PRIMARY}
                    onClick={() => {
                      eventManager.send_event(
                        events.ADMISSION_LEAD_PROFILE_CHANGE_STAGE_CLICKED_TFI
                      )
                      setShowChangeLeadModal(!showChangeLeadModal)
                    }}
                  >
                    {t('changeStage')}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        {leadFollowupData.isLoading ? (
          <div className="loading" />
        ) : (
          <div className={styles.cardContainer}>
            <PlainCard
              className={styles.card}
              onClick={() =>
                leadFollowupData?.data?.followup?.count !== 0
                  ? toggleFollowupModal()
                  : ''
              }
            >
              <div>
                <div className={styles.rightCard}>
                  <Heading
                    children={leadFollowupData?.data?.followup?.count}
                    textSize={HEADING_CONSTANTS.TEXT_SIZE.MEDIUM}
                  />
                  {leadFollowupData?.data?.followup?.count !== 0 && (
                    <Icon
                      name="forwardArrow"
                      size={ICON_CONSTANTS.SIZES.X_SMALL}
                      type={ICON_CONSTANTS.TYPES.SECONDARY}
                      className={styles.icon}
                    />
                  )}
                </div>
                <Para children={t('totalFollowUp')} />
              </div>
            </PlainCard>
            {typeof timestamp === 'number' && (
              <Para className={styles.followDate}>{`${t(
                'lastFollowUp'
              )} ${DateTime.fromSeconds(timestamp).toFormat(
                'dd LLL, yyyy'
              )}`}</Para>
            )}
          </div>
        )}
      </div>
      <Divider />
    </ErrorBoundary>
  )
}
