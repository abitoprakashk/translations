import {useDrop} from 'react-dnd'
import {Heading, HEADING_CONSTANTS} from '@teachmint/krayon'
import KanbanCard from './KanbanCard'
import styles from './KanbanStage.module.css'
import {KANBAN_ITEM_TYPES} from '../../../utils/constants'

export default function KanbanStage(props) {
  const {
    stage,
    leads,
    setLeads,
    stagewiseLeadCount,
    updateLeadStage,
    setSelectedLead,
    setShowSendSmsModal,
    setShowFollowUpsModal,
    setShowConfirmAdmissionPopup,
    setShowConfirmAdmissionModal,
    setShowLeadDeletePopup,
    admissionConfirmedStageId,
  } = props

  const [, drop] = useDrop({
    accept: KANBAN_ITEM_TYPES.CARD,
    drop: () => ({stage}),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
    canDrop: (lead) => {
      // Once the admission is confirmed, then lead stage can not be changed
      return lead?.lead_stage_id === admissionConfirmedStageId ? false : true
    },
  })

  return (
    <div ref={drop} key={stage._id} className={styles.kanbanStage}>
      <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
        {`${stage.name} (${stagewiseLeadCount[stage._id] ?? 0})`}
      </Heading>
      <div className={styles.cardSection}>
        {leads
          ?.filter((lead) => lead.lead_stage_id === stage._id)
          .map((lead, index) => {
            const cardProps = {
              lead,
              index,
              setLeads,
              updateLeadStage,
              setSelectedLead,
              setShowSendSmsModal,
              setShowFollowUpsModal,
              setShowConfirmAdmissionPopup,
              setShowConfirmAdmissionModal,
              setShowLeadDeletePopup,
              admissionConfirmedStageId,
            }
            return <KanbanCard key={lead._id} {...cardProps} />
          })}
      </div>
    </div>
  )
}
