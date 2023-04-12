import {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {DndProvider} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'
import classNames from 'classnames'
import {t} from 'i18next'
import {BUTTON_CONSTANTS, Para, PARA_CONSTANTS, Popup} from '@teachmint/krayon'
import {ErrorBoundary} from '@teachmint/common'
import FollowUps from '../../Common/FollowUps/FollowUps'
import KanbanStage from './KanbanStage'
import styles from './KanbanBoard.module.css'
import globalActions from '../../../../../redux/actions/global.actions'
import {useLeadList} from '../../../redux/admissionManagement.selectors'
import {events} from '../../../../../utils/EventsConstants'
import SendSms from '../../Common/SendSms/SendSms'
import ConfirmAdmissionModal from '../../Common/ConfirmAdmissionModal/ConfirmAdmissionModal'
import {updateLeadList} from '../../../utils/helpers'

export default function KanbanBoard({stages, filteredLeads}) {
  const dispatch = useDispatch()
  const leadList = useLeadList()
  const [leads, setLeads] = useState([])
  const eventManager = useSelector((state) => state.eventManager)
  const [selectedLead, setSelectedLead] = useState(null)
  const [showFollowUpsModal, setShowFollowUpsModal] = useState(false)
  const [showSendSmsModal, setShowSendSmsModal] = useState(false)
  const [showConfirmAdmissionPopup, setShowConfirmAdmissionPopup] =
    useState(false)
  const [showLeadDeletePopup, setShowLeadDeletePopup] = useState(false)
  const [showConfirmAdmissionModal, setShowConfirmAdmissionModal] =
    useState(false)
  const admissionConfirmedStageId = stages[stages.length - 1]._id

  useEffect(() => {
    setLeads(filteredLeads)
  }, [filteredLeads])

  const updateLeadStage = (leadId, newStageId, oldStageId) => {
    const successAction = (lead) => {
      // Update the lead stage in redux also on getting success from API
      dispatch(
        globalActions.getLeadList.success(
          updateLeadList(leadList.data, leadId, {...lead})
        )
      )
    }
    const failureAction = () => {
      // Reset the lead to old stage on getting error from API
      setLeads((leads) => {
        return updateLeadList(leads, leadId, {
          lead_stage_id: oldStageId,
        })
      })
    }
    dispatch(
      globalActions.updateLeadStage.request(
        {
          lead_id: leadId,
          lead_stage_id: newStageId,
        },
        successAction,
        failureAction
      )
    )
  }

  let stagewiseLeadCount = {}
  leads?.forEach((lead) => {
    if (lead.lead_stage_id) {
      stagewiseLeadCount[lead.lead_stage_id] =
        lead.lead_stage_id in stagewiseLeadCount
          ? stagewiseLeadCount[lead.lead_stage_id] + 1
          : 1
    }
  })

  return (
    <div
      className={classNames(
        styles.kanbanContainer,
        'show-scrollbar',
        'show-scrollbar-small'
      )}
    >
      {showFollowUpsModal && selectedLead && (
        <FollowUps
          eventName="lead_list"
          leadId={selectedLead._id}
          showModal={showFollowUpsModal}
          setShowModal={setShowFollowUpsModal}
        />
      )}
      {showSendSmsModal && selectedLead && (
        <SendSms
          eventName="lead_list"
          leadId={selectedLead._id}
          showModal={showSendSmsModal}
          setShowModal={setShowSendSmsModal}
        />
      )}
      {showConfirmAdmissionPopup && selectedLead && (
        <Popup
          isOpen
          onClose={() => setShowConfirmAdmissionPopup(false)}
          header={t('confirmAdmissionPopupTitle')}
          shouldCloseOnOverlayClick={false}
          shouldCloseOnEsc={false}
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
                setShowConfirmAdmissionPopup(false)
                setShowConfirmAdmissionModal(true)
                eventManager.send_event(
                  events.LEAD_CONFIRM_ADMISSION_CLICKED_TFI,
                  {action: 'confirm'}
                )
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

      {showLeadDeletePopup && selectedLead && (
        <Popup
          isOpen
          onClose={() => setShowLeadDeletePopup(false)}
          header={t('kanbanPageDeleteLeadPopupHeader')}
          shouldCloseOnOverlayClick={false}
          shouldCloseOnEsc={false}
          actionButtons={
            selectedLead.status_adm_fee === 'PAID' ||
            selectedLead.status_form_fee === 'PAID'
              ? [
                  {
                    onClick: () => setShowLeadDeletePopup(false),
                    body: t('ok'),
                    type: BUTTON_CONSTANTS.TYPE.FILLED,
                  },
                ]
              : [
                  {
                    onClick: () => setShowLeadDeletePopup(false),
                    body: t('cancel'),
                    type: BUTTON_CONSTANTS.TYPE.OUTLINE,
                  },
                  {
                    onClick: () => {
                      dispatch(
                        globalActions.deleteLead.request(selectedLead._id, () =>
                          dispatch(globalActions.getLeadList.request())
                        )
                      )
                      setShowLeadDeletePopup(false)
                    },
                    body: t('kanbanPageDeleteLeadPopupButtonText'),
                    category: BUTTON_CONSTANTS.CATEGORY.DESTRUCTIVE,
                  },
                ]
          }
        >
          <Para
            type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
            className={styles.descriptionStyle}
          >
            {selectedLead.status_adm_fee === 'PAID' ||
            selectedLead.status_form_fee === 'PAID'
              ? t('kanbanPageDeleteLeadMessageFeePaid')
              : t('kanbanPageDeleteLeadMessage')}
          </Para>
        </Popup>
      )}
      {showConfirmAdmissionModal && selectedLead && (
        <ConfirmAdmissionModal
          lead={selectedLead}
          showModal={showConfirmAdmissionModal}
          setShowModal={setShowConfirmAdmissionModal}
        />
      )}
      <ErrorBoundary>
        <DndProvider backend={HTML5Backend}>
          {stages.map((stage) => {
            const stageProps = {
              stage,
              leads,
              setLeads,
              updateLeadStage,
              stagewiseLeadCount,
              setSelectedLead,
              setShowSendSmsModal,
              setShowFollowUpsModal,
              setShowConfirmAdmissionPopup,
              setShowConfirmAdmissionModal,
              setShowLeadDeletePopup,
              admissionConfirmedStageId,
            }
            return <KanbanStage key={stage._id} {...stageProps} />
          })}
        </DndProvider>
      </ErrorBoundary>
    </div>
  )
}
