import {t} from 'i18next'
export const COMMUNICATION_TYPE = ['announcement', 'feedback', 'poll', 'sms']

export const announcementType = {
  ANNOUNCEMENT: 0,
  FEEDBACK: 1,
  POLL: 2,
  SMS: 3,
}

export const roleType = {
  2: 'Teacher',
  4: 'Student',
}

export const ANNOUNCEMENT_SUBTEXT =
  'Share information with teachers and students through a notification'

export const POLL_CREATE_SUBTEXT =
  'Generate opinion from audience as they vote amongst the multiple options provided by you'

export const FEEDBACK_CREATE_SUBTEXT =
  'Receive helpful information about particular questions from teachers and students'

export const FEEDBACK_SUBTEXT = `Allows you to generate deeper insights from audience as they declare
their preference.`

export const POLL_SUBTEXT = `Allows you to generate opinion precisely from audience as they vote as per their preference from among the multiple options which you provide.`

export const USER_FILTER_RADIO = [
  {
    value: 'all',
    label: 'All Users',
  },
  {
    value: 'student',
    label: 'Students',
  },
  {
    value: 'teacher',
    label: 'Teachers',
  },
]

export const CHANNEL_TITLE = 'Choose how will the receiver get this '

export const VERIFICATION_STATUS_ENUM = {
  1: 'Joined',
  2: 'Pending',
  3: 'Rejected',
}

export const VERIFICATION_STATUS = {
  JOINED: 'Joined',
  PENDING: 'Pending',
  REJECTED: 'Rejected',
}

export const announcementCharacterLimit = {
  TITLE: 150,
  MESSAGE: 500,
}

export const pollCharacterLimit = {
  question: 500,
  option: 150,
}

export const feedbackCharacterLimit = {
  QUESTION: 500,
}

export const ANNOUNCEMENT_FORM_STEPS = ['Message', 'Receivers']

export const FEEDBACK_FORM_STEPS = [
  'Question',
  'Duration',
  'Receivers',
  'Settings',
]

export const POLL_FORM_STEPS = ['Question', 'Duration', 'Receivers', 'Settings']

export const CHANNEL_DEFAULT_VALUES = ['notification']

export const SEGMENTS_DEFAULT_VALUES = ['teacher', 'student', 'unassigned']

export const SELECT_USER_SEGMENT = 'Select Receivers'

export const ASK_TEACHER_AND_STUDENT_TO_UPDATE_THEIR_APP = `(Please ask Teachers and Students to update their Teachmint app to receive the notification)`
export const DURATIONS = [0, 1, 10, 15, 20]

export const CUSTOM_DAYS = 'Custom Days'

export const MAX_30_DAYS = 'max: 30 days'

export const DURATION_TOOLTIP_TEXT =
  'This the time duration which you set for the post to be visible as active post'

export const BUTTON_PANNEL = {
  previous: 'Previous',
  next: 'Next',
  post: 'Post',
}

export const POST_TYPE = {
  announcement: 'announcement',
  feedback: 'feedback',
  poll: 'poll',
  sms: 'sms',
}

export const SORT_BY_VAL = {
  today: '2',
  yesterday: '3',
  week: '4',
  month: '5',
  lastSixMonth: '6',
  dateRange: '7',
}

export const HOLIDAY_EVENT_TYPE = {
  holiday: 2,
  event: 3,
}

export const SMS_CREATION_STEPS = [
  {
    id: 1,
    title: t('selectTemplate'),
  },
  {
    id: 2,
    title: t('reviewMessage'),
  },
  {
    id: 3,
    title: t('selectUserSegment'),
  },
]

export const MAX_REQUEST_SIZE = 10 * 1000000

export const allowedFileTypes =
  'image/png,image/jpeg,image/jpg,application/pdf,audio/mp3,audio/mp4'

export const SMS_VARIABLE_TYPES = {
  TEXT: 'text',
  DATE: 'date',
  TIME: 'time',
}

export const COMMUNICATION_TAB_LISTS = {
  allPosts: {id: 1, route: 'all-posts', label: t('allPosts')},
  automation: {id: 2, route: 'automation', label: t('automatedRules')},
  sms: {id: 3, route: 'sms', label: t('sms')},
}

export const RECEIVER_LIST_TABS = {
  READ: 'read',
  UNREAD: 'unread',
  SMS: 'sms',
}

export const ANALYTICS_TABS = {
  ALL: 'ALL',
  MY_POSTS: 'MY_POSTS',
  DRAFTS: 'DRAFTS',
}
