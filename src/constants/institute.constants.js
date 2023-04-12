// Institute type - possible values:
// NONE
// TUITION
// SCHOOL
// HOBBY
// COLLEGE

export const INSTITUTE_TYPES = {
  SCHOOL: 'SCHOOL',
  COLLEGE: 'COLLEGE',
  TUITION: 'TUITION',
  HOBBY: 'HOBBY',
  NONE: 'NONE',
}

export const INSTITUTE_TYPES_OPTIONS = [
  {value: 'Select', key: 'Select'},
  {value: 'School', key: INSTITUTE_TYPES.SCHOOL},
  {value: 'College', key: INSTITUTE_TYPES.COLLEGE},
  {value: 'Tuition', key: INSTITUTE_TYPES.TUITION},
]

export const INSTITUTE_TYPES_INFO = {
  [INSTITUTE_TYPES.SCHOOL]: {
    id: INSTITUTE_TYPES.SCHOOL,
    title: 'school',
    imgSrc:
      'https://storage.googleapis.com/tm-assets/icons/primary/school-primary.svg',
    desc: 'instituteTypesSchoolDesc',
  },
  [INSTITUTE_TYPES.COLLEGE]: {
    id: INSTITUTE_TYPES.COLLEGE,
    title: 'college',
    imgSrc:
      'https://storage.googleapis.com/tm-assets/icons/primary/mortarboards-primary.svg',
    desc: 'instituteTypesCollegeDesc',
  },
  [INSTITUTE_TYPES.TUITION]: {
    id: INSTITUTE_TYPES.TUITION,
    title: 'coachingCenter',
    imgSrc:
      'https://storage.googleapis.com/tm-assets/icons/primary/book-primary.svg',
    desc: 'instituteTypesCoachingCenterDesc',
  },
  [INSTITUTE_TYPES.HOBBY]: {
    id: INSTITUTE_TYPES.HOBBY,
    title: 'hobby',
    imgSrc: '',
    desc: 'instituteTypesHobbyDesc',
  },
  [INSTITUTE_TYPES.NONE]: {
    id: INSTITUTE_TYPES.NONE,
    title: 'institute',
    imgSrc: '',
    desc: 'instituteTypesNoneDesc',
  },
}

export const INSTITUTE_TYPES_ENABLED_LIST = [
  INSTITUTE_TYPES.SCHOOL,
  INSTITUTE_TYPES.COLLEGE,
  INSTITUTE_TYPES.TUITION,
]

export const INSTITUTE_TYPES_ENABLED_LIST_INFO =
  INSTITUTE_TYPES_ENABLED_LIST.map(
    (instituteTypeId) => INSTITUTE_TYPES_INFO[instituteTypeId]
  )

export const SECTION_COUNT_LIMIT = 25

export const BROWSER_STORAGE_KEYS = {
  ADMIN_UUID: 'ADMIN_UUID',
  ADMINS_GLOBAL: 'ADMINS_GLOBAL',
  CURRENT_INSTITUTE_ID: 'CURRENT_INSTITUTE_ID',
  ACTIVE_ACADEMIC_SESSION_ID: 'ACTIVE_ACADEMIC_SESSION_ID',
  ACTIVE_CRM_SESSION_ID: 'ACTIVE_CRM_SESSION_ID',
  ADMIN_NOTIFICATIONS: 'ADMIN_NOTIFICATIONS',
  COUNTRY_CODE_LIST: 'COUNTRY_CODE_LIST',
  LANGUAGE: 'i18nextLng',
  CURRENT_ORG_ID: 'CURRENT_ORG_ID',
}

export const INSTITUTE_MEMBER_TYPE = {
  NONE: 0,
  ADMIN: 1,
  TEACHER: 2,
  SUPER_ADMIN: 3,
  STUDENT: 4,
  OTHER: 5,
}

// organisation

export const ORGANISATION_TYPES = {
  ORGANISATION: 'ORGANISATION',
  INSTITUTE: 'INSTITUTE',
}
