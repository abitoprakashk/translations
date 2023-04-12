import {t} from 'i18next'

export const WEEKLY_OFF = 'WEEKLY_OFF'
export const HOLIDAY = 'HOLIDAY'
export const EVENTS_ACTIVITIES = 'EVENTS_ACTIVITIES'
export const EXAM = 'EXAM'
export const TAB_OPTIONS = {
  WEEKLY_OFF: {
    id: WEEKLY_OFF,
    label: t('weeklyOff'),
    eventType: 1,
    type: 5,
    header: 'Weekly Off',
    buttonText: t('createWeeklyOffDay'),
    emptyStateText: t('thereAreNoWeeklyOffDays'),
  },
  HOLIDAY: {
    id: HOLIDAY,
    label: t('holidays'),
    eventType: 2,
    type: 1,
    header: 'Holiday',
    buttonText: t('createHoliday'),
    emptyStateText: t('thereAreNoHolidays'),
  },
  EVENTS_ACTIVITIES: {
    id: EVENTS_ACTIVITIES,
    label: t('eventsActivities'),
    eventType: 3,
    header: 'Event & Activity',
    buttonText: t('createEventActivity'),
    type: 1,
    emptyStateText: t('thereAreNoEventsActivities'),
  },
  EXAM: {
    id: EXAM,
    label: t('examPlanner'),
    eventType: 4,
    header: 'Exam Planner',
    buttonText: t('createExam'),
    type: 1,
    onlySchool: true,
  },
}

export const applicableForOptions = {
  3: {key: 3, value: 'Both'},
  1: {key: 1, value: 'Teachers'},
  2: {key: 2, value: 'Students'},
}

export const tagTypeOptions = [
  {key: 'fullday', value: 'Full Day'},
  {key: 'halfday', value: 'Half Day'},
]

export const WEEKLY_OFF_COLS = [
  {key: 'day', label: 'Day'},
  {
    key: 'frequency',
    label: 'Frequency',
  },
  {key: 'type', label: 'Type'},
  {key: 'applicableFor', label: 'Applicable For'},
  {
    key: 'classes',
    label: 'Classes',
  },
  {key: 'action', label: ''},
]

export const HOLIDAY_EVENT_OFF_COLS = [
  {key: 'day', label: 'Day'},
  {
    key: 'frequency',
    label: 'Date',
  },
  {key: 'applicableFor', label: 'Applicable For'},
  {
    key: 'classes',
    label: 'Classes',
  },
  {key: 'action', label: ''},
]

export const INSTITUTE_HIERARCHY_TYPES = {
  DEPARTMENT: 'DEPARTMENT',
  UAC: 'UAC',
  STANDARD: 'STANDARD',
}

export const YEARLY_LABELS = {
  YEARLY_CALENDAR: t('yearlyCalendar'),
  REASON_FOR_HOLIDAY: 'Reason for holiday',
  EVENT_NAME: 'Event Name',
  MORE: '+ More',
  CLASSES_AND_SECTIONS: 'Classes and Sections',
  APPLICABLE_FOR: 'Applicable For',
  APPLY_FILTER: 'Apply Filter',
  CLEAR_ALL: 'Clear All',
  APPLICABLE_TO_ALL: 'Applicable to all students',
  SELECT_CLASSES_STUDENT_ONLY: 'Select Classes (only for students)',
  SELECT_CLASSES: 'Select Classes',
  SAVE: 'Save',
  BOTH_STUDENTS_TEACHERS: 'Students and Teachers',
}
