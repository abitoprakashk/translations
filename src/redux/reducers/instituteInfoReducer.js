import {instituteInfoActionTypes} from '../actionTypes'

export const instituteListInfoReducer = (state = [], {type, payload}) => {
  switch (type) {
    case instituteInfoActionTypes.INSTITUTE_LIST_INFO:
      return payload
    default:
      return state
  }
}

export const pendingInstituteListInfoReducer = (
  state = [],
  {type, payload}
) => {
  switch (type) {
    case instituteInfoActionTypes.PENDING_INSTITUTE_LIST_INFO:
      return payload
    default:
      return state
  }
}

export const showInstituteListReducer = (state = false, {type, payload}) => {
  switch (type) {
    case instituteInfoActionTypes.SHOW_INSTITUTE_LIST:
      return payload
    default:
      return state
  }
}

export const instituteInfoReducer = (state = {}, {type, payload}) => {
  switch (type) {
    case instituteInfoActionTypes.INSTITUTE_INFO:
      return payload
    default:
      return state
  }
}

export const instituteAcademicSessionInfoReducer = (
  state = [],
  {type, payload}
) => {
  switch (type) {
    case instituteInfoActionTypes.INSTITUTE_ACADEMIC_SESSION_INFO:
      return payload
    default:
      return state
  }
}

export const instituteActiveAcademicSessionIdReducer = (
  state = null,
  {type, payload}
) => {
  switch (type) {
    case instituteInfoActionTypes.INSTITUTE_ACTIVE_ACADEMIC_SESSION_ID:
      return payload
    default:
      return state
  }
}

export const instituteAcademicSessionLoadingReducer = (
  state = false,
  {type, payload}
) => {
  switch (type) {
    case instituteInfoActionTypes.INSTITUTE_ACADEMIC_SESSION_LOADING:
      return payload
    default:
      return state
  }
}

export const instituteAcademicSessionErrorReducer = (
  state = false,
  {type, payload}
) => {
  switch (type) {
    case instituteInfoActionTypes.INSTITUTE_ACADEMIC_SESSION_ERROR:
      return payload
    default:
      return state
  }
}

export const instituteStatsReducer = (state = {}, {type, payload}) => {
  switch (type) {
    case instituteInfoActionTypes.INSTITUTE_STATS:
      return payload
    default:
      return state
  }
}

export const instituteTeacherStatsReducer = (state = [], {type, payload}) => {
  switch (type) {
    case instituteInfoActionTypes.INSTITUTE_TEACHER_STATS:
      return payload
    default:
      return state
  }
}

export const linkPendingRequestsReducer = (state = [], {type, payload}) => {
  switch (type) {
    case instituteInfoActionTypes.LINK_PENDING_REQUESTS:
      return payload
    default:
      return state
  }
}

export const delinkPendingRequestsReducer = (state = [], {type, payload}) => {
  switch (type) {
    case instituteInfoActionTypes.DELINK_PENDING_REQUESTS:
      return payload
    default:
      return state
  }
}

export const instituteAllClassesReducer = (state = [], {type, payload}) => {
  switch (type) {
    case instituteInfoActionTypes.INSTITUTE_ALL_CLASSES:
      return payload
    default:
      return state
  }
}

export const instituteAttendanceReducer = (state = [], {type, payload}) => {
  switch (type) {
    case instituteInfoActionTypes.INSTITUTE_ATTENDANCE:
      return payload
    default:
      return state
  }
}

export const instituteTeacherListReducer = (state = [], {type, payload}) => {
  switch (type) {
    case instituteInfoActionTypes.INSTITUTE_TEACHERS_LIST:
      return payload
    default:
      return state
  }
}

export const instituteActiveTeacherListReducer = (
  state = [],
  {type, payload}
) => {
  switch (type) {
    case instituteInfoActionTypes.INSTITUTE_ACTIVE_TEACHERS_LIST:
      return payload
    default:
      return state
  }
}

export const instituteInActiveTeacherListReducer = (
  state = [],
  {type, payload}
) => {
  switch (type) {
    case instituteInfoActionTypes.INSTITUTE_INACTIVE_TEACHERS_LIST:
      return payload
    default:
      return state
  }
}

export const instituteAdminListReducer = (state = [], {type, payload}) => {
  switch (type) {
    case instituteInfoActionTypes.INSTITUTE_ADMINS_LIST:
      return payload
    default:
      return state
  }
}

export const kamListReducer = (state = [], {type, payload}) => {
  switch (type) {
    case instituteInfoActionTypes.KAM_LIST:
      return payload
    default:
      return state
  }
}

export const instituteStudentListReducer = (state = null, {type, payload}) => {
  switch (type) {
    case instituteInfoActionTypes.INSTITUTE_STUDENTS_LIST:
      return payload
    default:
      return state
  }
}

export const studentListLoadingReducer = (state = true, {type, payload}) => {
  switch (type) {
    case instituteInfoActionTypes.INSTITUTE_STUDENTS_LIST_LOADING:
      return payload
    default:
      return state
  }
}

export const instituteActiveStudentListReducer = (
  state = [],
  {type, payload}
) => {
  switch (type) {
    case instituteInfoActionTypes.INSTIUTE_ACTIVE_STUDENTS_LIST:
      return payload
    default:
      return state
  }
}

export const instituteInActiveStudentListReducer = (
  state = [],
  {type, payload}
) => {
  switch (type) {
    case instituteInfoActionTypes.INSTITUTE_INACTIVE_STUDENTS_LIST:
      return payload
    default:
      return state
  }
}

export const instituteTodaysScheduleReducer = (state = {}, {type, payload}) => {
  switch (type) {
    case instituteInfoActionTypes.INSTITUTE_TODAYS_SCHEDULE:
      return payload
    default:
      return state
  }
}

export const instituteHierarchyReducer = (state = null, {type, payload}) => {
  switch (type) {
    case instituteInfoActionTypes.INSTITUTE_HIERARCHY:
      return payload
    default:
      return state
  }
}

export const instituteBooksListReducer = (state = [], {type, payload}) => {
  switch (type) {
    case instituteInfoActionTypes.INSTITUTE_BOOKS_LIST:
      return payload
    default:
      return state
  }
}

export const duplicateStudentListReducer = (state = {}, {type, payload}) => {
  switch (type) {
    case instituteInfoActionTypes.DUPLICATE_STUDENTS_LIST:
      return payload
    default:
      return state
  }
}

export const duplicateTeacherListReducer = (state = [], {type, payload}) => {
  switch (type) {
    case instituteInfoActionTypes.DUPLICATE_TEACHERS_LIST:
      return payload
    default:
      return state
  }
}

export const teacherListLoadingReducer = (state = [], {type, payload}) => {
  switch (type) {
    case instituteInfoActionTypes.TEACHERS_LIST_LOADING:
      return payload
    default:
      return state
  }
}

export const getUnassignedClassTeachersToSectionReducer = (
  state = [],
  {type, payload}
) => {
  switch (type) {
    case instituteInfoActionTypes.UNASSIGNED_CLASS_TEACHERS_TO_SECTION:
      return payload
    default:
      return state
  }
}

export const getPendingStudentListReducer = (state = [], {type, payload}) => {
  switch (type) {
    case instituteInfoActionTypes.GET_PENDING_STUDENT_LIST:
      return payload
    default:
      return state
  }
}

export const updatePendingClassTeachersReducer = (
  state = [],
  {type, payload}
) => {
  switch (type) {
    case instituteInfoActionTypes.GET_PENDING_STUDENT_LIST:
      return payload
    default:
      return state
  }
}

export const getFeeStatisticsReducer = (state = [], {type, payload}) => {
  switch (type) {
    case instituteInfoActionTypes.GET_DASHBOARD_FEE_STATISTICS_SUCCEEDED:
      return payload
    default:
      return state
  }
}

export const instituteBillingInfoReducer = (state = [], {type, payload}) => {
  switch (type) {
    case instituteInfoActionTypes.INSTITUTE_BILLING_INFO:
      return payload
    default:
      return state
  }
}
