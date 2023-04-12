import {instituteInfoActionTypes} from '../actionTypes'

export const instituteListInfoAction = (info) => {
  return {
    type: instituteInfoActionTypes.INSTITUTE_LIST_INFO,
    payload: info,
  }
}

export const pendingInstituteListInfoAction = (info) => {
  return {
    type: instituteInfoActionTypes.PENDING_INSTITUTE_LIST_INFO,
    payload: info,
  }
}

export const instituteAcademicSessionInfoAction = (academicDetails) => {
  return {
    type: instituteInfoActionTypes.INSTITUTE_ACADEMIC_SESSION_INFO,
    payload: academicDetails,
  }
}

export const instituteAcademicSessionLoadingAction = (isLoading = true) => {
  return {
    type: instituteInfoActionTypes.INSTITUTE_ACADEMIC_SESSION_LOADING,
    payload: isLoading,
  }
}

export const instituteAcademicSessionErrorAction = (isErrorOccurred = true) => {
  return {
    type: instituteInfoActionTypes.INSTITUTE_ACADEMIC_SESSION_ERROR,
    payload: isErrorOccurred,
  }
}

export const instituteActiveAcademicSessionIdAction = (activeAcademicId) => {
  return {
    type: instituteInfoActionTypes.INSTITUTE_ACTIVE_ACADEMIC_SESSION_ID,
    payload: activeAcademicId,
  }
}

export const showInstituteListAction = (info) => {
  return {
    type: instituteInfoActionTypes.SHOW_INSTITUTE_LIST,
    payload: info,
  }
}

export const instituteInfoAction = (info) => {
  return {
    type: instituteInfoActionTypes.INSTITUTE_INFO,
    payload: info,
  }
}

export const instituteStatsAction = (stats) => {
  return {
    type: instituteInfoActionTypes.INSTITUTE_STATS,
    payload: stats,
  }
}

export const instituteTeacherStatsAction = (stats) => {
  return {
    type: instituteInfoActionTypes.INSTITUTE_TEACHER_STATS,
    payload: stats,
  }
}

export const linkPendingRequestsAction = (requests) => {
  return {
    type: instituteInfoActionTypes.LINK_PENDING_REQUESTS,
    payload: requests,
  }
}

export const delinkPendingRequestsAction = (requests) => {
  return {
    type: instituteInfoActionTypes.DELINK_PENDING_REQUESTS,
    payload: requests,
  }
}

export const instituteAllClassesAction = (requests) => {
  return {
    type: instituteInfoActionTypes.INSTITUTE_ALL_CLASSES,
    payload: requests,
  }
}

export const instituteAttendanceAction = (requests) => {
  return {
    type: instituteInfoActionTypes.INSTITUTE_ATTENDANCE,
    payload: requests,
  }
}

export const instituteTeacherListAction = (requests) => {
  return {
    type: instituteInfoActionTypes.INSTITUTE_TEACHERS_LIST,
    payload: requests,
  }
}

export const instituteActiveTeacherListAction = (requests) => {
  return {
    type: instituteInfoActionTypes.INSTITUTE_ACTIVE_TEACHERS_LIST,
    payload: requests,
  }
}

export const instituteInActiveTeacherListAction = (requests) => {
  return {
    type: instituteInfoActionTypes.INSTITUTE_INACTIVE_TEACHERS_LIST,
    payload: requests,
  }
}

export const instituteAdminListAction = (requests) => {
  return {
    type: instituteInfoActionTypes.INSTITUTE_ADMINS_LIST,
    payload: requests,
  }
}

export const kamListAction = (requests) => {
  return {
    type: instituteInfoActionTypes.KAM_LIST,
    payload: requests,
  }
}

export const instituteStudentListAction = (requests) => {
  return {
    type: instituteInfoActionTypes.INSTITUTE_STUDENTS_LIST,
    payload: requests,
  }
}

export const studentListLoadingAction = (bool) => {
  return {
    type: instituteInfoActionTypes.INSTITUTE_STUDENTS_LIST_LOADING,
    payload: bool,
  }
}

export const teacherListLoadingAction = (bool) => {
  return {
    type: instituteInfoActionTypes.TEACHERS_LIST_LOADING,
    payload: bool,
  }
}

export const instituteActiveStudentListAction = (requests) => {
  return {
    type: instituteInfoActionTypes.INSTIUTE_ACTIVE_STUDENTS_LIST,
    payload: requests,
  }
}

export const instituteInActiveStudentListAction = (requests) => {
  return {
    type: instituteInfoActionTypes.INSTITUTE_INACTIVE_STUDENTS_LIST,
    payload: requests,
  }
}

export const instituteTodaysScheduleAction = (requests) => {
  return {
    type: instituteInfoActionTypes.INSTITUTE_TODAYS_SCHEDULE,
    payload: requests,
  }
}

export const instituteHierarchyAction = (requests) => {
  return {
    type: instituteInfoActionTypes.INSTITUTE_HIERARCHY,
    payload: requests,
  }
}

export const instituteBooksListAction = (requests) => {
  return {
    type: instituteInfoActionTypes.INSTITUTE_BOOKS_LIST,
    payload: requests,
  }
}

export const duplicateTeacherListAction = (requests) => {
  return {
    type: instituteInfoActionTypes.DUPLICATE_TEACHERS_LIST,
    payload: requests,
  }
}

export const duplicateStudentListAction = (requests) => {
  return {
    type: instituteInfoActionTypes.DUPLICATE_STUDENTS_LIST,
    payload: requests,
  }
}

export const getUnassignedClassTeachersToSectionAction = (info) => {
  return {
    type: instituteInfoActionTypes.UNASSIGNED_CLASS_TEACHERS_TO_SECTION,
    payload: info,
  }
}

export const bulkAssignClassTeachersToSectionAction = (requests) => {
  return {
    type: instituteInfoActionTypes.BULK_ASSIGN_CLASS_TEACHERS_TO_SECTION,
    payload: requests,
  }
}

export const getPendingStudentListAction = (info) => {
  return {
    type: instituteInfoActionTypes.GET_PENDING_STUDENT_LIST,
    payload: info,
  }
}

export const getFeeStatistics = () => ({
  type: instituteInfoActionTypes.GET_DASHBOARD_FEE_STATISTICS_REQUESTED,
  payload: null,
})

export const instituteBillingInfoAction = (subscriptionDetails) => {
  return {
    type: instituteInfoActionTypes.INSTITUTE_BILLING_INFO,
    payload: subscriptionDetails,
  }
}
