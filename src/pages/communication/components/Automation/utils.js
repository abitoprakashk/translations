import {STEPPER_CONSTANTS} from '@teachmint/krayon'
import {DateTime} from 'luxon'
import {t} from 'i18next'
import {
  CUSTOM_CLASS_ID,
  DATE_FORMAT,
  INSTANCE_STATUS,
  SHORT_ID_NUM_CHARS,
  RECIPIENT_TYPE_LABELS,
  REPEAT_ENDS,
  RULE_CREATION_STEPS,
  SCHEDULER_TEMPLATE_TYPES,
  SEND_OPTIONS_LABELS,
  SHORT_DATE,
  ATTENDANCE_EVENTS_LABELS,
} from './Automation.constants'

export const addOrdinalSuffix = (num) => {
  let suffix = 'th'
  if (num % 100 < 11 || num % 100 > 13) {
    switch (num % 10) {
      case 1:
        suffix = t('ordinalIndicatorSt')
        break
      case 2:
        suffix = t('ordinalIndicatorNd')
        break
      case 3:
        suffix = t('ordinalIndicatorRd')
        break
    }
  }
  return num + suffix
}

export const getFeeDueDates = (feeStructure) => {
  const feeStructures = Object.values(feeStructure?.structureView || [])

  return feeStructures.reduce((acc, structure) => {
    if (structure.schedule_timestamps?.length) {
      structure.schedule_timestamps.forEach((timeStamp) => {
        acc.push({
          name: structure.name,
          dueDate: DateTime.fromSeconds(timeStamp).toFormat(SHORT_DATE),
        })
      })
    }
    return acc
  }, [])
}

/**
 * Given lastReminderDate (Datetime) and dueDate (day), then it finds the next due date (same day next month)
 * If next month does not have the required day (ex: 31), then returns the date of last day of next month
 */
const getNextDueDate = (lastReminderDate, dueDate) => {
  const nextDueDate = lastReminderDate.set({day: 1}).plus({months: 1})
  const daysInNextMonth = nextDueDate.daysInMonth

  if (dueDate > daysInNextMonth) {
    return nextDueDate.set({day: daysInNextMonth})
  }

  return lastReminderDate.plus({months: 1}).set({day: dueDate})
}

export const getMessageSchedule = (trigger_params = {}, sessionEndDate) => {
  const {repeat_every, due_date, no_of_reminders} = trigger_params

  if (!sessionEndDate) {
    return []
  }

  const reminderDates = []
  const endDate = DateTime.fromMillis(Number(sessionEndDate))

  // Set the initial reminder date to the due date
  let reminderDate = DateTime.local()

  if (reminderDate.daysInMonth < due_date) {
    reminderDate = reminderDate.set({day: reminderDate.daysInMonth})
  } else {
    reminderDate = reminderDate.set({day: due_date})
  }

  // Generate reminder dates until the end date
  while (reminderDate < endDate) {
    reminderDates.push(reminderDate.toFormat(DATE_FORMAT))

    const nextDueDate = getNextDueDate(reminderDate, due_date)

    if (trigger_params.repeat === REPEAT_ENDS.AFTER) {
      let repeatReminderDate = reminderDate
      for (let i = 1; i < no_of_reminders; i++) {
        repeatReminderDate = repeatReminderDate.plus({days: repeat_every})

        if (repeatReminderDate < nextDueDate) {
          reminderDates.push(repeatReminderDate.toFormat(DATE_FORMAT))
        } else {
          break
        }
      }
    }

    reminderDate = nextDueDate
  }

  return reminderDates
}

export const getHierarchyGroups = (
  hierarchy,
  selectedSections,
  customClasses
) => {
  const groups = {}
  const CHILDREN_KEYS = ['department', 'standard', 'section']
  if (!selectedSections?.size) {
    return groups
  }

  const getName = (node) => {
    if (node.standardId) {
      const className = node.standard?.replace(/^class/i, '')
      return t('classLabel', {
        section: ((className ? className + '-' : '') + node.name).trim(),
      })
    }

    return node.name
  }

  const processNode = (node) => {
    if (node && selectedSections.has(node._id)) {
      groups[node._id] = getName(node)
      return true
    }

    if (node) {
      const childrenKey = CHILDREN_KEYS.find((key) => Array.isArray(node[key]))
      if (childrenKey) {
        let allSelected = true
        node[childrenKey].forEach((child) => {
          allSelected = processNode(child) && allSelected
        })

        if (allSelected) {
          node[childrenKey].forEach((child) => {
            delete groups[child._id]
          })

          groups[node._id] = getName(node)
          return true
        }
      }
    }

    return false
  }

  hierarchy?.department.forEach(processNode)

  // Group custom classes
  if (customClasses?.length) {
    const selectedCustomClasses = {}

    customClasses.forEach((customClass) => {
      if (selectedSections.has(customClass._id)) {
        selectedCustomClasses[customClass._id] = customClass.name
      }
    })

    return Object.keys(selectedCustomClasses).length === customClasses.length
      ? {...groups, [CUSTOM_CLASS_ID]: t('customClassrooms')}
      : {
          ...groups,
          ...selectedCustomClasses,
        }
  }

  return groups
}

export const getCreateSteps = (ruleInfo, stepperStatus) => {
  const descriptions = {}

  const {template_id, _id, actions_list, trigger_params, filter} = ruleInfo
  const template = template_id || _id

  // How to send
  if (actions_list?.length) {
    descriptions[RULE_CREATION_STEPS.how.id] = listToString(
      actions_list,
      SEND_OPTIONS_LABELS
    )
  }

  descriptions[RULE_CREATION_STEPS.when.id] = getWhenToSendLabel(
    template,
    trigger_params
  )

  // Whom to send
  if (template === SCHEDULER_TEMPLATE_TYPES.FEE_REMINDER) {
    descriptions[RULE_CREATION_STEPS.whom.id] = t('overdueFeeReceiver')
  } else if (template === SCHEDULER_TEMPLATE_TYPES.ATTENDANCE) {
    descriptions[RULE_CREATION_STEPS.whom.id] = t('students')
  } else if (filter?.recipient_type?.length) {
    descriptions[RULE_CREATION_STEPS.whom.id] = listToString(
      filter.recipient_type,
      RECIPIENT_TYPE_LABELS
    )
  }

  return Object.values(RULE_CREATION_STEPS)
    .slice(0, 3)
    .map((step, index) => ({
      ...step,
      status: stepperStatus[index],
      description:
        stepperStatus[index] === STEPPER_CONSTANTS.STATUS.COMPLETED &&
        descriptions[step.id]
          ? descriptions[step.id]
          : step.description,
    }))
}

const getWhenToSendLabel = (template, trigger_params) => {
  switch (template) {
    case SCHEDULER_TEMPLATE_TYPES.BIRTHDAY:
      return t('birthdayStepperDesc')
    case SCHEDULER_TEMPLATE_TYPES.ATTENDANCE:
      return t('attendanceWhenInfo')
    case SCHEDULER_TEMPLATE_TYPES.HOLIDAY: {
      return getHolidayWhenToSend(trigger_params?.days_before_holiday)
    }
    case SCHEDULER_TEMPLATE_TYPES.FEE_REMINDER: {
      if (!trigger_params?.due_date) {
        return null
      }

      const date = addOrdinalSuffix(trigger_params.due_date)
      return trigger_params.repeat !== REPEAT_ENDS.NO_REPEAT
        ? t('dateOfMonthRepeating', {date})
        : t('dateOfMonth', {date})
    }
    default:
      return null
  }
}

const getHolidayWhenToSend = (daysBeforeHoliday) => {
  if (daysBeforeHoliday === 0) {
    return t('holidayStepperDesc')
  }

  return daysBeforeHoliday
    ? t('numDaysBeforeHoliday', {count: daysBeforeHoliday})
    : null
}

export const getMessagePreview = (ruleInfo, templateList = [], templateKey) => {
  if (ruleInfo[templateKey]?.text) {
    return ruleInfo[templateKey].text
  }

  const templateId = ruleInfo.template_id || ruleInfo._id
  const template = templateList.find((item) => item._id === templateId)

  return template?.[templateKey]?.text || null
}

export const listToString = (words = [], labels, separator = ' and ') => {
  let validWords = words.filter((word) => word?.length)

  if (labels) {
    validWords = validWords.map((word) => labels[word]).filter(Boolean)
  }

  if (validWords.length <= 1) {
    return validWords.join('')
  }

  if (validWords.length == 2) {
    return validWords.join(separator)
  }

  return (
    validWords.slice(0, -1).join(', ') +
    `,${separator}` +
    validWords[validWords.length - 1]
  )
}

export const toJSDateFromUnixMillis = (timeStamp) => {
  return timeStamp ? DateTime.fromMillis(Number(timeStamp)).toJSDate() : null
}

export const formatDateFromUnixSeconds = (date) =>
  DateTime.fromSeconds(date).toFormat(DATE_FORMAT)

export const formatDate = (jsDate) =>
  DateTime.fromJSDate(jsDate).toFormat(DATE_FORMAT)

export const getFirstDayOfMonth = () => {
  const current = DateTime.now()
  const firstDayOfMonth = current.set({day: 1})
  return firstDayOfMonth.toJSDate()
}

export const isValidFeeTriggerParams = (trigger_params) => {
  if (trigger_params.repeat === REPEAT_ENDS.AFTER) {
    return (
      trigger_params.due_date &&
      trigger_params.repeat_every &&
      trigger_params.no_of_reminders
    )
  }

  return !!trigger_params.due_date
}

export const hasValidReceivers = (ruleInfo) => {
  const template = ruleInfo.template_id || ruleInfo._id
  const filter = ruleInfo.filter || {}

  const hasRecipientNodes =
    !!filter.recipient_node_ids?.length || filter.include_unassigned

  return shouldSelectRecipientType(template)
    ? !!filter.recipient_type?.length && hasRecipientNodes
    : hasRecipientNodes
}

export const getNextTriggerTimeLabel = (rule) => {
  const template = rule.template_id || rule._id
  const triggerTimeKey = rule?.rule_id
    ? 'trigger_timestamp'
    : 'next_trigger_time'
  if (template === SCHEDULER_TEMPLATE_TYPES.ATTENDANCE) {
    return t('attendanceNextRunningOn')
  }

  if (rule[triggerTimeKey]) {
    return t('nextRunningOn', {
      date: formatDateFromUnixSeconds(rule[triggerTimeKey]),
    })
  }

  return null
}

export const getRulesRunningOnCurrentAndNextDay = (rules = []) => {
  const currentDate = DateTime.now()

  const rulesRunningToday = []
  const rulesRunningTomorrow = []

  rules.forEach((rule) => {
    const givenDate = DateTime.fromSeconds(rule.trigger_timestamp)
    if (currentDate.hasSame(givenDate, 'day')) {
      rulesRunningToday.push(rule)
    } else if (currentDate.plus({days: 1}).hasSame(givenDate, 'day')) {
      rulesRunningTomorrow.push(rule)
    }
  })

  return [rulesRunningToday, rulesRunningTomorrow]
}

export const getActiveRuleInstances = (instances) =>
  instances.filter((instance) => instance.status === INSTANCE_STATUS.PENDING)

export const hasSessionEndDatePassed = (sessionRange) => {
  if (sessionRange?.end_time) {
    const date = DateTime.fromMillis(Number(sessionRange.end_time))
    return date < DateTime.now()
  }

  return false
}

export const getReceiversList = (ruleInfo, groups) => {
  const template = ruleInfo.template_id || ruleInfo._id
  const receiverTypes = ruleInfo.filter?.recipient_type
  const eventTriggers = ruleInfo.trigger_params?.event_trigger

  const groupNames = listToString(Object.values(groups))

  if (template === SCHEDULER_TEMPLATE_TYPES.BIRTHDAY && receiverTypes?.length) {
    return `${listToString(
      receiverTypes,
      RECIPIENT_TYPE_LABELS
    )} of ${groupNames}`
  }

  if (
    template === SCHEDULER_TEMPLATE_TYPES.ATTENDANCE &&
    eventTriggers?.length
  ) {
    const events = listToString(eventTriggers, ATTENDANCE_EVENTS_LABELS, ' or ')
    return t('studentsOfClasses', {events, groups: groupNames})
  }

  if (template === SCHEDULER_TEMPLATE_TYPES.FEE_REMINDER) {
    return t('overdueFeeReceiverLabel', {classes: groupNames})
  }

  return groupNames
}

export const getNumberOptions = (
  limit,
  showOrdinalIndicator,
  includeZero = false
) => {
  const options = []
  for (let i = includeZero ? 0 : 1; i <= limit; i++) {
    options.push({
      label: showOrdinalIndicator ? addOrdinalSuffix(i) : i,
      value: i,
    })
  }

  return options
}

export const getDaysBeforeHolidayLabel = (daysBeforeHoliday) =>
  daysBeforeHoliday || daysBeforeHoliday === 0
    ? t('numDaysBefore', {count: daysBeforeHoliday})
    : null

export const shouldSelectRecipientType = (template) =>
  template === SCHEDULER_TEMPLATE_TYPES.BIRTHDAY ||
  template === SCHEDULER_TEMPLATE_TYPES.HOLIDAY

export const getIdLabel = (id) => `#${id.slice(-SHORT_ID_NUM_CHARS)}`
