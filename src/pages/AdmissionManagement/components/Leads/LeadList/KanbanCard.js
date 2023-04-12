import {useSelector} from 'react-redux'
import {useRef} from 'react'
import {useDrag, useDrop} from 'react-dnd'
import {t} from 'i18next'
import {DateTime} from 'luxon'
import {
  Badges,
  BADGES_CONSTANTS,
  Divider,
  Icon,
  ICON_CONSTANTS,
  Para,
  PARA_CONSTANTS,
  PlainCard,
} from '@teachmint/krayon'
import {events} from '../../../../../utils/EventsConstants'
import {ErrorBoundary} from '@teachmint/common'
import history from '../../../../../history'
import styles from './KanbanCard.module.css'
import {
  kanbanCardLeadOptions,
  KANBAN_ITEM_TYPES,
} from '../../../utils/constants'
import SubjectTooltipOptions from '../../../../../components/SchoolSystem/SectionDetails/SubjectTooltipOptions'
import {useAdmissionCrmSettings} from '../../../redux/admissionManagement.selectors'
import {updateLeadList} from '../../../utils/helpers'

export default function KanbanCard(props) {
  const {
    index,
    lead,
    setLeads,
    updateLeadStage,
    setSelectedLead,
    setShowSendSmsModal,
    setShowFollowUpsModal,
    setShowConfirmAdmissionPopup,
    setShowConfirmAdmissionModal,
    setShowLeadDeletePopup,
    admissionConfirmedStageId,
  } = props

  const eventManager = useSelector((state) => state.eventManager)
  const admissionCrmSettings = useAdmissionCrmSettings()

  const changeLeadStatus = (draggedLead, stage) => {
    // Only update the lead stage if the current stage is different from the dropped stage
    if (lead.lead_stage_id !== stage._id) {
      setLeads((leads) => {
        return updateLeadList(leads, draggedLead._id, {
          lead_stage_id: stage._id,
          u: DateTime.now().toSeconds(),
        })
      })
      updateLeadStage(draggedLead._id, stage._id, lead.lead_stage_id)
    }
  }

  const isFeeNotApplicable =
    (!admissionCrmSettings?.data.fee_settings.form_fees_required &&
      !admissionCrmSettings?.data.fee_settings.admission_fees_required) ||
    (!admissionCrmSettings?.data.fee_settings?.form_fees?.class_fees?.[
      lead.profile_data.standard
    ]?.fee_amount &&
      !admissionCrmSettings?.data.fee_settings?.admission_fees?.class_fees?.[
        lead.profile_data.standard
      ]?.fee_amount)

  const renderLeadFormStatus = () => {
    if (lead.status_adm_fee === 'PAID') {
      return (
        <Badges
          inverted={true}
          iconName="checkCircle"
          label={t('kanbanCardBadgeAdmissionFee')}
          size={BADGES_CONSTANTS.SIZE.SMALL}
          type={BADGES_CONSTANTS.TYPE.SUCCESS}
          className={styles.admissionFeeBadgeColor}
        />
      )
    } else if (lead.status_form_fee === 'PAID') {
      return (
        <Badges
          iconName="checkCircle"
          label={t('kanbanCardBadgeFormFee')}
          size={BADGES_CONSTANTS.SIZE.SMALL}
          className={styles.formFeeBadgeColor}
        />
      )
    } else if (isFeeNotApplicable) {
      return (
        <Badges
          showIcon={false}
          size={BADGES_CONSTANTS.SIZE.SMALL}
          label={t('kanbanCardBadgeNoFeeApplicable')}
        />
      )
    } else {
      return (
        <Badges
          showIcon={false}
          label={t('kanbanCardBadgeFeeNotPaid')}
          size={BADGES_CONSTANTS.SIZE.SMALL}
          type={BADGES_CONSTANTS.TYPE.WARNING}
          className={styles.unpaidFeeBadgeColor}
        />
      )
    }
  }

  const handleChange = (action) => {
    setSelectedLead(lead)
    switch (action) {
      case kanbanCardLeadOptions.FOLLOW_UPS:
        setShowFollowUpsModal(true)
        break
      case kanbanCardLeadOptions.SEND_SMS:
        eventManager.send_event(events.LEAD_SMS_CLICKED_TFI, {
          screee_name: 'lead_profile',
        })
        setShowSendSmsModal(true)
        break
      case kanbanCardLeadOptions.CONFIRM_ADMISSION:
        !isFeeNotApplicable && lead.status_adm_fee !== 'PAID'
          ? setShowConfirmAdmissionPopup(true)
          : setShowConfirmAdmissionModal(true)
        break
      case kanbanCardLeadOptions.DELETE_LEAD:
        setShowLeadDeletePopup(true)
        break
    }
  }

  const getLeadOptions = () => {
    const leadOptions = [
      {
        icon: 'noteAdd',
        label: t('kanbanCardLeadOptionFollowUps'),
        action: kanbanCardLeadOptions.FOLLOW_UPS,
      },
      {
        icon: 'sms',
        label: t('kanbanCardLeadOptionSendSms'),
        action: kanbanCardLeadOptions.SEND_SMS,
      },
      {
        icon: 'downloadDone',
        label: t('kanbanCardLeadOptionConfirmAdmission'),
        action: kanbanCardLeadOptions.CONFIRM_ADMISSION,
      },
      {
        icon: 'delete',
        label: t('kanbanCardOptionsDeleteLead'),
        action: kanbanCardLeadOptions.DELETE_LEAD,
      },
    ]
    return leadOptions.map((option) => ({
      action: option.action,
      labelStyle: styles.kebabLabelWrapper,
      label: (
        <div className={styles.kebabOptionWrapper}>
          <Icon name={option.icon} size={ICON_CONSTANTS.SIZES.XX_SMALL} />
          <Para
            type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
            weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
          >
            {option.label}
          </Para>
        </div>
      ),
    }))
  }

  const ref = useRef(null)

  const [{handlerId}, drop] = useDrop({
    accept: KANBAN_ITEM_TYPES.CARD,
    collect: (monitor) => ({
      handlerId: monitor.getHandlerId(),
    }),
  })

  const [{isDragging}, drag] = useDrag({
    type: KANBAN_ITEM_TYPES.CARD,
    item: {...lead, index},
    end: (lead, monitor) => {
      const dropResult = monitor.getDropResult()
      if (dropResult && dropResult.stage) {
        eventManager.send_event(events.LEAD_NODE_MOVED_TFI, {
          form_fee_status: lead.status_form_fee,
          admission_fee_status: lead.status_adm_fee,
          admission_stage_from: lead.lead_stage_id,
          admission_stage_to: dropResult.stage._id,
          lead_id: lead._id,
        })
        if (dropResult.stage._id === admissionConfirmedStageId) {
          setSelectedLead(lead)
          !isFeeNotApplicable && lead.status_adm_fee !== 'PAID'
            ? setShowConfirmAdmissionPopup(true)
            : setShowConfirmAdmissionModal(true)
        } else {
          changeLeadStatus(lead, dropResult.stage)
        }
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const dragDropRef = drag(drop(ref))

  return (
    <>
      {isDragging ? (
        <PlainCard className={styles.draggingLeadCard} />
      ) : (
        <ErrorBoundary>
          <div
            ref={dragDropRef}
            data-handler-id={handlerId}
            className={styles.leadCardWrapper}
            // style={{opacity: isDragging ? 0.5 : 1}}
            onClick={() => {
              eventManager.send_event(events.LEAD_NODE_CLICKED_TFI, {
                form_fee_status: lead.status_form_fee,
                admission_fee_status: lead.status_adm_fee,
                lead_id: lead._id,
              })

              history.push(
                `/institute/dashboard/admission-management/leads/${lead._id}`
              )
            }}
          >
            <PlainCard className={styles.leadCard}>
              <div className={styles.leadStatus}>
                <div>{renderLeadFormStatus()}</div>
                <div>
                  {lead.lead_stage_id !== admissionConfirmedStageId && (
                    <SubjectTooltipOptions
                      subjectItem={lead}
                      wrapperClass={styles.kebabWrapper}
                      options={getLeadOptions()}
                      handleChange={handleChange}
                      trigger={
                        <div>
                          <Icon
                            name="moreVertical"
                            type={ICON_CONSTANTS.TYPES.SECONDARY}
                            size={ICON_CONSTANTS.SIZES.XX_SMALL}
                          />
                        </div>
                      }
                    />
                  )}
                </div>
              </div>
              <div className={styles.leadData}>
                <div className={styles.leadName}>
                  {`${lead.profile_data?.name ?? ''} ${
                    lead.profile_data?.last_name ?? ''
                  }`}
                </div>
                <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
                  {`${t('kanbanCardLeadIdLabel')} ${
                    lead.ext_lead_id ?? lead._id
                  }`}
                </Para>
              </div>
              <Divider className={styles.leadDetailsDivider} spacing="0px" />
              <div className={styles.leadDetails}>
                <Para
                  weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
                  textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
                  className={styles.mobileVarifiedStatus}
                >
                  {`+${lead.phone_number}`}
                  <Icon
                    name={
                      lead?.verification_status ? 'verifiedUser' : 'privacyTip'
                    }
                    size={ICON_CONSTANTS.SIZES.XXX_SMALL}
                    type={
                      lead?.verification_status
                        ? ICON_CONSTANTS.TYPES.SUCCESS
                        : ICON_CONSTANTS.TYPES.WARNING
                    }
                  />
                </Para>
                <div className={styles.dots}></div>
                <Para
                  weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
                  textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
                >
                  {lead.lead_from === 'OFFLINE'
                    ? t('kanbanCardLeadStatusOffline')
                    : t('kanbanCardLeadStatusOnline')}
                </Para>
              </div>
            </PlainCard>
          </div>
        </ErrorBoundary>
      )}
    </>
  )
}
