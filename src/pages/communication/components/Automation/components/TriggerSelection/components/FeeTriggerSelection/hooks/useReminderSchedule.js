import {useMemo} from 'react'
import useActiveSessionRangeSelector from '../../../../../hooks/useActiveSessionRangeSelector'
import {getMessageSchedule, toJSDateFromUnixMillis} from '../../../../../utils'

/**
 * Returns list of days in which the reminder will be sent and active session  end date
 * @param {Object} trigger_params - due_date, repeat_every and no_of_reminders
 */
const useReminderSchedule = ({trigger_params}) => {
  const {end_time} = useActiveSessionRangeSelector()

  const scheduledDates = useMemo(() => {
    const messageSchedule = getMessageSchedule(trigger_params, end_time)

    return new Set(messageSchedule)
  }, [trigger_params, end_time])

  return [scheduledDates, toJSDateFromUnixMillis(end_time)]
}

export default useReminderSchedule
