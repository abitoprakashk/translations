import {Alert, CheckboxGroup} from '@teachmint/krayon'
import {useTranslation} from 'react-i18next'
import {ATTENDANCE_EVENT_OPTIONS} from '../../../../Automation.constants'
import styles from './AttendanceTriggerSelection.module.css'

export default function AttendanceTrigger({ruleInfo, setRuleInfo}) {
  const {t} = useTranslation()
  const eventTriggers = ruleInfo.trigger_params?.event_trigger || []

  const onEventTriggerChange = (events) => {
    setRuleInfo((prevInfo) => ({
      ...prevInfo,
      trigger_params: {
        event_trigger: [...events],
      },
    }))
  }

  return (
    <div>
      <div className={styles.greyCard}>
        <div className={styles.label}>{t('selectAnEvent')}</div>
        <CheckboxGroup
          name="attendance-events"
          options={ATTENDANCE_EVENT_OPTIONS.map((option) => ({
            ...option,
            classes: {wrapper: styles.noLeftMargin},
          }))}
          wrapperClass={styles.checkboxWrapper}
          onChange={onEventTriggerChange}
          selectedOptions={eventTriggers}
        />
      </div>
      <Alert
        content={t('attendanceUpdatesInfo')}
        hideClose
        textSize="m"
        icon="error"
      />
    </div>
  )
}
