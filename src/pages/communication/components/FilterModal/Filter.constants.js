import {announcementType} from '../../constants'
import {t} from 'i18next'

export const FILTER_KEYS = {
  TIME: 'time',
  MESSAGE: 'message',
  RECEIVER: 'receiver',
  SMS_TYPE: 'smsType',
}
export const FILTER_OPTIONS = {
  [FILTER_KEYS.TIME]: {
    label: t('timeOfCreation'),
    type: 'radio',
    children: [
      {label: t('today'), value: 0},
      {label: t('last7days'), value: 7},
      {label: t('last30days'), value: 30},
      {label: t('customDateRange'), value: 'custom'},
    ],
    additional: [{for: 'custom', onclick: 'daterangepicker'}],
  },
  [FILTER_KEYS.MESSAGE]: {
    label: t('typeOfMessage'),
    type: 'checkbox',
    children: [
      {label: t('announcement'), value: announcementType.ANNOUNCEMENT},
      {
        label: t('smsSent'),
        value: announcementType.SMS,
      },
      {
        label: t('poll'),
        value: announcementType.POLL,
      },
      {
        label: t('feedback'),
        value: announcementType.FEEDBACK,
      },
    ],
  },
  [FILTER_KEYS.RECEIVER]: {
    label: t('typeOfReceiver'),
    type: 'checkbox',
    children: [
      {label: t('student'), value: 'student'},
      {label: t('teacher'), value: 'teacher'},
    ],
  },
  [FILTER_KEYS.SMS_TYPE]: {
    label: t('smsType'),
    type: 'checkbox',
    children: [
      {label: t('manual'), value: 0},
      {label: t('automated'), value: 1},
    ],
  },
}
