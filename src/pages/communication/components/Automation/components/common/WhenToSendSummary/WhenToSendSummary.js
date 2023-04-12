import classNames from 'classnames'
import {t} from 'i18next'
import {
  REPEAT_ENDS,
  SCHEDULER_TEMPLATE_TYPES,
} from '../../../Automation.constants'
import {addOrdinalSuffix} from '../../../utils'
import styles from './WhenToSendSummary.module.css'

export default function WhenToSendSummary({
  inputData,
  showTitle = true,
  showBullets = false,
  classes = {},
}) {
  const getContent = (trigger_params) => {
    const template = inputData.template_id || inputData._id
    const itemClassName = classNames({[styles.listItemMsg]: showBullets})

    switch (template) {
      case SCHEDULER_TEMPLATE_TYPES.BIRTHDAY:
        return <span className={itemClassName}>{t('onUserBirthday')}</span>
      case SCHEDULER_TEMPLATE_TYPES.HOLIDAY:
        return (
          <span className={itemClassName}>
            {t('messageBeforeDays', {
              count: trigger_params.days_before_holiday,
            })}
          </span>
        )
      case SCHEDULER_TEMPLATE_TYPES.ATTENDANCE:
        return (
          <AttendanceWhenToSend
            trigger_params={trigger_params}
            className={itemClassName}
          />
        )
      case SCHEDULER_TEMPLATE_TYPES.FEE_REMINDER:
        return (
          <FeeWhenToSendSummary
            trigger_params={trigger_params}
            showBullets={showBullets}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className={classes.wrapper}>
      {showTitle && (
        <span className={styles.listItemTitle}>{t('whenToSend')}</span>
      )}
      {getContent(inputData.trigger_params)}
    </div>
  )
}

const AttendanceWhenToSend = ({trigger_params, className}) => {
  const event_triggers = trigger_params?.event_trigger || []

  return (
    <span className={className}>
      {t('attendanceWhenInfoWithType', {
        type: event_triggers.map((event) => event.toLowerCase()).join(' or '),
      })}
    </span>
  )
}

const FeeWhenToSendSummary = ({trigger_params, showBullets}) => {
  const startingOnMessage = t('startingOnDate', {
    date: addOrdinalSuffix(trigger_params.due_date),
  })

  const repeatEveryMessage = t('repeatingEveryNthDay', {
    day: trigger_params.repeat_every,
  })

  const numRemindersMessages = t('endsAfterSendingNumReminders', {
    count: trigger_params.no_of_reminders,
  })

  if (trigger_params.repeat === REPEAT_ENDS.NO_REPEAT) {
    return (
      <span className={classNames({[styles.listItemMsg]: showBullets})}>
        {startingOnMessage}
      </span>
    )
  } else if (showBullets) {
    return (
      <ul className={styles.listItemMsg}>
        <li>{startingOnMessage}</li>
        <li>{repeatEveryMessage}</li>
        <li>{numRemindersMessages}</li>
      </ul>
    )
  }

  return (
    <div>
      <div>{startingOnMessage}</div>
      <div>
        {repeatEveryMessage} and
        <span className={styles.numReminders}>{numRemindersMessages}</span>
      </div>
    </div>
  )
}
