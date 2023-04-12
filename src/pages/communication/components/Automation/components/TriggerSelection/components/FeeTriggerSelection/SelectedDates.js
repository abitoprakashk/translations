import {Button, BUTTON_CONSTANTS, Datepicker} from '@teachmint/krayon'
import classNames from 'classnames'
import {useTranslation} from 'react-i18next'
import {REPEAT_ENDS} from '../../../../Automation.constants'
import {formatDate, getFirstDayOfMonth} from '../../../../utils'
import styles from './FeeTriggerSelection.module.css'
import useReminderSchedule from './hooks/useReminderSchedule'

export default function SelectedDates({trigger_params}) {
  const {t} = useTranslation()
  const [scheduledDates, activeSessionEndDate] = useReminderSchedule({
    trigger_params,
  })

  const isRepeating = trigger_params.repeat === REPEAT_ENDS.AFTER

  const dayContentRenderer = (day) =>
    scheduledDates.has(formatDate(day)) && (
      <div className={styles.selectedDate}>
        <span className={styles.selectedDay}>{day.getDate()}</span>
      </div>
    )

  return (
    <Datepicker
      minDate={getFirstDayOfMonth()}
      maxDate={activeSessionEndDate}
      classes={{
        calendar: classNames(styles.calendar, {
          [styles.calendarBelow]: isRepeating,
        }),
      }}
      showMonthAndYearPickers={false}
      dayContentRenderer={dayContentRenderer}
      getCustomTriggerElement={() => (
        <Button
          size={BUTTON_CONSTANTS.SIZE.SMALL}
          type={BUTTON_CONSTANTS.TYPE.TEXT}
          classes={{label: styles.seeScheduleBtn}}
          prefixIcon="calendar"
        >
          {t('seeScheduleLabel')}
        </Button>
      )}
      value={null}
    />
  )
}
