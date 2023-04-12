import {Alert} from '@teachmint/krayon'
import {useSelector} from 'react-redux'
import {t} from 'i18next'
import {getMessagePreview, listToString} from '../../utils'
import {
  ACTION_TEMPLATES,
  SCHEDULER_TEMPLATE_TYPES,
  SEND_OPTIONS_LABELS,
} from '../../Automation.constants'
import WhenToSendSummary from '../common/WhenToSendSummary/WhenToSendSummary'
import useHierarchyGroup from '../../hooks/useHierarchyGroup'
import styles from './PreviewPage.module.css'

export default function PreviewPage({inputData, heirarchy}) {
  const templateId = inputData.template_id || inputData._id

  const templateList = useSelector(
    (state) => state.communicationInfo.scheduler.templateList
  )

  const {groupNames} = useHierarchyGroup({
    ruleData: inputData,
    instHierarchy: heirarchy,
  })

  return (
    <div className={styles.infoWrapper}>
      <div className={styles.templateMessage}>
        {inputData.actions_list.map((action) => (
          <div key={action} className={styles.template}>
            <div className={styles.templateName}>
              {SEND_OPTIONS_LABELS[action]}
            </div>
            <div className={styles.templateMsgText}>
              {getMessagePreview(
                inputData,
                templateList,
                ACTION_TEMPLATES[action]
              )}
            </div>
          </div>
        ))}
      </div>
      {templateId === SCHEDULER_TEMPLATE_TYPES.BIRTHDAY && (
        <Alert
          content={t('greetingsWhenInfo')}
          hideClose
          className={styles.alert}
          textSize="m"
        />
      )}
      <div className={styles.filledInfo}>
        <div className={styles.listItem}>
          <span className={styles.listItemTitle}>{t('howToSend')}</span>
          <span className={styles.listItemMsg}>
            {listToString(inputData.actions_list, SEND_OPTIONS_LABELS)}
          </span>
        </div>
        <WhenToSendSummary
          inputData={inputData}
          showBullets
          classes={{wrapper: styles.listItem}}
        />
        <div className={styles.listItem}>
          <span className={styles.listItemTitle}>{t('whomToSend')}</span>
          <span className={styles.listItemMsg}>{groupNames}</span>
        </div>
      </div>
    </div>
  )
}
