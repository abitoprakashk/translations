import {t} from 'i18next'
import {events} from '../../../../utils/EventsConstants'

export const SCHEDULER_TEMPLATE_TYPES = {
  BIRTHDAY: 'birthday',
  FEE_REMINDER: 'fee',
  ATTENDANCE: 'student_attendance',
  HOLIDAY: 'holiday_event',
}

export const REPEAT_ENDS = {
  NEVER: 'NEVER',
  ON: 'ON',
  AFTER: 'AFTER',
  NO_REPEAT: 'NO_REPEAT',
}

export const TEMPLATE_ICONS = {
  [SCHEDULER_TEMPLATE_TYPES.BIRTHDAY]: 'cake',
  [SCHEDULER_TEMPLATE_TYPES.FEE_REMINDER]: 'payments',
  [SCHEDULER_TEMPLATE_TYPES.ATTENDANCE]: 'people2',
  [SCHEDULER_TEMPLATE_TYPES.HOLIDAY]: 'event',
}

export const INSTANCE_STATUS = {
  DONE: 'DONE',
  PENDING: 'PENDING',
  CANCELLED: 'CANCELLED',
}

export const ACTIONS = {
  SEND_APP_NOTIFICATIONS: 'send_app_notification',
  SEND_SMS_NOTIFICATIONS: 'send_sms_notification',
  SEND_SMS_IF_APP_NOT_INSTALLED: 'send_sms_notification_if_app_not_installed',
}

export const ACTION_TEMPLATES = {
  [ACTIONS.SEND_APP_NOTIFICATIONS]: 'announcement_template',
  [ACTIONS.SEND_SMS_NOTIFICATIONS]: 'sms_template',
  [ACTIONS.SEND_SMS_IF_APP_NOT_INSTALLED]: 'sms_template',
}

export const SEND_OPTIONS_LABELS = {
  [ACTIONS.SEND_APP_NOTIFICATIONS]: t('appNotifications'),
  [ACTIONS.SEND_SMS_NOTIFICATIONS]: t('smsSent'),
  [ACTIONS.SEND_SMS_IF_APP_NOT_INSTALLED]: t('sendSMSIfAppNotInstalled'),
}

export const RECIPIENT_TYPE = {
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT',
}

export const RECIPIENT_TYPE_LABELS = {
  [RECIPIENT_TYPE.TEACHER]: t('teachers'),
  [RECIPIENT_TYPE.STUDENT]: t('students'),
}

export const ATTENDANCE_EVENTS = {
  ABSENT: 'ABSENT',
  PRESENT: 'PRESENT',
}

export const ATTENDANCE_EVENTS_LABELS = {
  [ATTENDANCE_EVENTS.ABSENT]: t('absent'),
  [ATTENDANCE_EVENTS.PRESENT]: t('present'),
}

export const ATTENDANCE_EVENT_OPTIONS = [
  {
    label: t('absentForDay'),
    value: ATTENDANCE_EVENTS.ABSENT,
  },
  {
    label: t('presentForDay'),
    value: ATTENDANCE_EVENTS.PRESENT,
  },
]

export const RULE_CREATION_STEPS = {
  how: {
    id: 1,
    title: t('howToSend'),
    eventName: events.COMMS_RULES_CREATION_HOW_TO_SEND_NEXT_TFI,
    description: t('selectChannel'),
  },
  when: {
    id: 2,
    title: t('whenToSend'),
    eventName: events.COMMS_RULES_CREATION_WHEN_TO_SEND_NEXT_TFI,
    description: t('selectDates'),
  },
  whom: {
    id: 3,
    title: t('whomToSend'),
    eventName: events.COMMS_RULES_CREATION_WHOM_TO_SEND_FINISH_TFI,
    description: t('selectUsers'),
  },
  final: {
    id: 4,
    eventName: events.COMMS_RULES_CREATION_EXIT_TFI,
  },
}

export const CUSTOM_CLASS_ID = 'CUSTOM_CLASS'

export const UNASSIGNED_USERS = 'UNASSIGNED_USERS'

export const SHORT_DATE = 'dd MMM'

export const DATE_FORMAT = 'dd MMM yyyy'

export const SHORT_ID_NUM_CHARS = 5

export const MAX_DAYS_BEFORE_HOLIDAY_REMINDER = 10

export const MAX_DAYS_IN_MONTH = 31

export const REPEAT_REMINDER_WINDOW = 28

export const MAX_DAYS_TO_SEND_REMINDER = 11
