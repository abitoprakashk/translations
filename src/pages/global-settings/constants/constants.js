import {
  OPTION_TYPES,
  TITLE_OPTIONS,
} from '../components/common/containers/options-box/OptionsBox'
import {sidebarData} from '../../../utils/SidebarItems'
import {Icon} from '@teachmint/common'
import i18n from 'i18next'

export const MANAGMENT_SETTINGS_SUB_CATEGORIES = {
  TEACHER: 'teacher',
  STUDENT: 'student',
}

export const CLASSROOM_SETTINGS_TYPES = {
  MAIN: 'classroomSettings',
  COMMUNICATION_SETTINGS: 'communication',
  MANAGEMENT_SETTINGS: 'management',
  CONTENT_SETTINGS: 'content',
  EXAM_SETTINGS: 'exam',
}

export const YOUR_PREFERENCES_TYPES = {
  MAIN: 'yourPreferencesSettings',
  LANGUAGE_SETTINGS: 'language',
}

export const FEE_SETTINGS_TYPES = {
  MAIN_HEADER: 'Main Header',
  SUB_HEADER: 'Sub Header',
  MAIN_BODY: 'Body',
}
export const ONLINE_FEE_SETTINGS_TYPES = {
  PARTIAL_PAYMENT: 'Partial Payment',
}
export const SETTINGS_CATEGORY_TYPES = {
  CLASSROOM_SETTINGS: {
    title: 'classroomSettings',
    subCatgories: CLASSROOM_SETTINGS_TYPES,
  },
  YOUR_PREFERENCES_SETTINGS: {
    title: 'yourPreferencesSettings',
    subCatgories: YOUR_PREFERENCES_TYPES,
  },
  FEES_RECEIPT_SETTINGS: {
    title: 'feesReceiptSettings',
    subCatgories: FEE_SETTINGS_TYPES,
  },
  ONLINE_FEES_SETTINGS: {
    title: 'onlineFeesSettings',
    subCatgories: ONLINE_FEE_SETTINGS_TYPES,
  },
}

export const classroomSettingsOptions = {
  management: {
    id: CLASSROOM_SETTINGS_TYPES.MANAGEMENT_SETTINGS,
    title: 'management',
    desc: i18n.t('setPermissionInClassroomText'),
    icon: (
      <Icon name="management" size="xs" type="outlined" color="secondary" />
    ),
    iconSelected: (
      <Icon name="management" size="xs" type="outlined" color="inverted" />
    ),
    headerIcon: (
      <Icon name="management" size="xs" type="outlined" color="success" />
    ),
    settings: [],
  },
  communication: {
    id: CLASSROOM_SETTINGS_TYPES.COMMUNICATION_SETTINGS,
    title: 'communicationText',
    desc: i18n.t('setPermissionInClassroomText'),
    icon: <Icon name="audio" size="xs" type="outlined" color="secondary" />,
    iconSelected: (
      <Icon name="audio" size="xs" type="outlined" color="inverted" />
    ),
    headerIcon: <Icon name="audio" size="xs" type="outlined" color="success" />,
    settings: [],
  },

  content: {
    id: CLASSROOM_SETTINGS_TYPES.CONTENT_SETTINGS,
    title: 'contentText',
    desc: i18n.t('setPermissionForContentText'),
    icon: (
      <Icon name="studyMaterial" size="xs" type="outlined" color="secondary" />
    ),
    iconSelected: (
      <Icon name="studyMaterial" size="xs" type="outlined" color="inverted" />
    ),
    headerIcon: (
      <Icon name="studyMaterial" size="xs" type="outlined" color="success" />
    ),
    settings: [],
  },
  exam: {
    id: CLASSROOM_SETTINGS_TYPES.EXAM_SETTINGS,
    title: 'exam',
    desc: i18n.t('setPermissionForExamText'),
    icon: (
      <Icon name="assessment" size="xs" type="outlined" color="secondary" />
    ),
    iconSelected: (
      <Icon name="assessment" size="xs" type="outlined" color="inverted" />
    ),
    headerIcon: (
      <Icon name="assessment" size="xs" type="outlined" color="success" />
    ),
    settings: [],
  },
}

export const yourPreferencesOptions = {
  language: {
    id: YOUR_PREFERENCES_TYPES.LANGUAGE_SETTINGS,
    title: 'languageText',
    desc: 'youCanUseTeachmintInYourLanguageText',
    icon: <Icon name="language" size="xs" type="outlined" color="secondary" />,
    iconSelected: (
      <Icon name="language" size="xs" type="outlined" color="inverted" />
    ),
    headerIcon: (
      <Icon name="language" size="xs" type="outlined" color="success" />
    ),
    settings: [],
  },
}

export const settingsOptions = {
  classroomSettings: {
    id: SETTINGS_CATEGORY_TYPES.CLASSROOM_SETTINGS.title,
    title: 'classroomSettingsText',
    icon: '',
    iconSelected: '',
    settingsList: classroomSettingsOptions,
    titleType: TITLE_OPTIONS.ACCORDION_TITLE,
    optionType: OPTION_TYPES.SIMPLE_OPTION,
    desc: null,
  },
}

export const preferrenceSettingsOptions = {
  yourPreferencesSettings: {
    id: SETTINGS_CATEGORY_TYPES.YOUR_PREFERENCES_SETTINGS.title,
    title: 'yourPreferencesText',
    icon: '',
    iconSelected: '',
    settingsList: yourPreferencesOptions,
    titleType: TITLE_OPTIONS.ACCORDION_TITLE,
    optionType: OPTION_TYPES.SIMPLE_OPTION,
    desc: null,
  },
}
export function capitalizeTxt(txt) {
  return txt.charAt(0).toUpperCase() + txt.slice(1)
}

export function capitalizeFirstLetter(txt) {
  return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
}

export function splitWordCapitalize(txt) {
  let title = txt.split('_')
  let fTitle = capitalizeTxt(title.join(' '))
  return fTitle
}

export const SETTINGS_URL = sidebarData.CLASSROOM_SETTING.route
export const CLASSROOM_SETTINGS_URL = SETTINGS_URL
export const COMMUNICATION_SETTINGS_URL =
  CLASSROOM_SETTINGS_URL + '/communication'
export const MANAGEMENT_SETTINGS_URL = CLASSROOM_SETTINGS_URL + '/management'
export const CONTENT_SETTINGS_URL = CLASSROOM_SETTINGS_URL + '/content'
export const EXAM_SETTINGS_URL = CLASSROOM_SETTINGS_URL + '/exam'
export const YOUR_PREFERENCES_URL = sidebarData.PREFERENCES.route
export const LANGUAGE_SETTINGS_URL = YOUR_PREFERENCES_URL + '/language'
