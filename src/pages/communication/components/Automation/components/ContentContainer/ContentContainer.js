import {
  Icon,
  ICON_CONSTANTS,
  Tooltip,
  TOOLTIP_CONSTANTS,
} from '@teachmint/krayon'
import {useEffect, useRef} from 'react'
import {useSelector} from 'react-redux'
import {t} from 'i18next'
import MediumSelection from '../MediumSelection/MediumSelection'
import TriggerSelection from '../TriggerSelection/TriggerSelection'
import RecipientSelection from '../RecipientSelection/RecipientSelection'
import PreviewPage from '../PreviewPage/PreviewPage'
import useInstituteHeirarchy from '../../../../../AttendanceReport/pages/StudentWiseAttendance/hooks/useInstituteHeirarchy'
import {
  RULE_CREATION_STEPS,
  SCHEDULER_TEMPLATE_TYPES,
} from '../../Automation.constants'
import {getFeeDueDates} from '../../utils'
import styles from './ContentContainer.module.css'

export default function ContentContainer({
  step,
  inputData,
  setInputData,
  preSelectedIds,
}) {
  const handleHierarchyRef = useRef(0)
  const {heirarchy, handleSelection, allselectedSections} =
    useInstituteHeirarchy({
      allSelected: false,
    })

  useEffect(() => {
    if (
      preSelectedIds?.length &&
      handleHierarchyRef.current < preSelectedIds.length &&
      heirarchy
    ) {
      handleSelection({_id: preSelectedIds[handleHierarchyRef.current]})
      handleHierarchyRef.current += 1
    }
  }, [preSelectedIds, heirarchy])

  const contentHandler = () => {
    let title = ''
    let content = ''
    switch (step) {
      case RULE_CREATION_STEPS.how.id:
        title = t('howToSend')
        content = (
          <MediumSelection inputData={inputData} setInputData={setInputData} />
        )
        break
      case RULE_CREATION_STEPS.when.id:
        title = <WhenToCommunicateTitle inputData={inputData} />
        content = (
          <TriggerSelection inputData={inputData} setInputData={setInputData} />
        )
        break

      case RULE_CREATION_STEPS.whom.id:
        title = t('whomToSend')
        content = (
          <RecipientSelection
            inputData={inputData}
            setInputData={setInputData}
            heirarchy={heirarchy}
            handleSelection={handleSelection}
            allselectedSections={allselectedSections}
          />
        )
        break

      case RULE_CREATION_STEPS.final.id:
        title = t('previewSend')
        content = <PreviewPage inputData={inputData} heirarchy={heirarchy} />
        break
    }
    return {title, content}
  }
  const contentObj = contentHandler()
  return (
    <>
      <div className={styles.title}>{contentObj.title}</div>
      <div className={styles.content}>{contentObj.content}</div>
    </>
  )
}

const WhenToCommunicateTitle = ({inputData}) => {
  const template = inputData.template_id || inputData._id
  const feeStructures = useSelector(
    (state) => state.feeStructure?.feeStructures
  )

  const feeDueDates = getFeeDueDates(feeStructures)

  if (template === SCHEDULER_TEMPLATE_TYPES.FEE_REMINDER) {
    return (
      <div className={styles.triggerHeader}>
        <div>{t('whenToCommunicate')}</div>
        {!!feeDueDates.length && (
          <div className={styles.viewDueDateSection}>
            <Icon
              name="formatListBulleted"
              size={ICON_CONSTANTS.SIZES.XX_SMALL}
              version={ICON_CONSTANTS.VERSION.FILLED}
              type={ICON_CONSTANTS.TYPES.PRIMARY}
              className={styles.dueDateIcon}
            />
            <div>
              <a data-tip data-for="dueDatesInfo">
                <span className={styles.primaryText}>
                  {t('viewAllDueDate')}
                </span>
              </a>
              <Tooltip
                toolTipId="dueDatesInfo"
                place={TOOLTIP_CONSTANTS.TOOLTIP_POSITIONS.LEFT}
                toolTipBody={
                  <div>
                    <ul className={styles.list}>
                      {feeDueDates.map(({name, dueDate}) => (
                        <li key={dueDate}>
                          {dueDate} - {name}
                        </li>
                      ))}
                    </ul>
                  </div>
                }
                effect={TOOLTIP_CONSTANTS.TOOLTIP_EFFECTS.SOLID}
              />
            </div>
          </div>
        )}
      </div>
    )
  }

  return t('whenToCommunicate')
}
