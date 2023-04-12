import {PERMISSION_CONSTANTS} from './permission.constants'
import * as SHC from './SchoolSetupConstants'
import {t} from 'i18next'

export const SUBJECT_TYPE = [
  {id: 1, label: t('compulsory')},
  {id: 2, label: t('optional')},
]

export const SCHOOL_OVERVIEW_TABS = [
  // {
  //   id: SHC.SCN_SCHOOL_SETUP,
  //   label: 'Institute Setup',
  //   status: true,
  // },
  // {
  //   id: SHC.SCN_CLASSROOM_PAGE,
  //   label: 'Classrooms',
  //   status: false,
  // },
  {
    id: SHC.SCN_TEACHER_DIRECTORY,
    label: t('teacherDirectory'),
    status: true,
  },
  {
    id: SHC.SCN_STUDENT_DIRECTORY,
    label: t('studentDirectory'),
    status: true,
  },
]

export const SECTION_TEACHER_SLIDER_TABS = [
  {
    id: SHC.SCN_SLI_TEACHER_DIRECTORY,
    label: t('teacherDirectory'),
  },
  {
    id: SHC.SCN_SLI_ADD_TEACHER,
    label: t('addTeachers'),
  },
]

export const SECTION_SUBJECT_TABLE_HEADERS = [
  {key: 'subject_name', label: t('subjectName')},
  {key: 'subject_type', label: t('subjectType')},
  {key: 'subject_teacher', label: t('subjectTeacher')},
  {key: 'co_teacher', label: t('coTeacher')},
  {key: 'view_classroom', label: ''},
  {key: 'settings', label: ''},
]

export const DEPT_CLASSROOM_TABLE_HEADERS = [
  {key: 'subject_name', label: t('className')},
  {key: 'subject_type', label: t('classroomType')},
  {key: 'subject_teacher', label: t('classroomTeacher')},
  {key: 'co_teacher', label: t('coTeacher')},
  {key: 'view_classroom', label: ''},
  {key: 'settings', label: ''},
]

export const SECTION_OPTIONAL_ADD_STUDENT_TABLE_HEADERS = [
  {key: 'student_details', label: 'STUDENT DETAILS'},
  {key: 'action', label: 'ACTION'},
]

export const HIERARCHY_TEACHER_DIR_TABLE_HEADERS = [
  {key: 'teacher_details', label: 'TEACHER DETAILS'},
  {key: 'subjects', label: 'SUBJECTS'},
  {key: 'classes', label: 'CLASSES'},
]

export const HIERARCHY_TEACHER_DIR_TABLE_HEADERS_MOBILE = [
  {key: 'teacher_details', label: 'TEACHER DETAILS'},
]

export const HIERARCHY_STUDENT_DIR_TABLE_HEADERS = [
  {key: 'student_details', label: 'STUDENT DETAILS'},
  {key: 'class_section', label: 'CLASS & SECTION'},
  {key: 'action', label: 'ACTION'},
]

export const HIERARCHY_STUDENT_DIR_TABLE_HEADERS_TUITION = [
  {key: 'student_details', label: 'STUDENT DETAILS'},
  {key: 'class_section', label: 'DEPARTMENT & BATCH'},
  {key: 'action', label: 'ACTION'},
]

export const HIERARCHY_STUDENT_DIR_TABLE_HEADERS_MOBILE = [
  {key: 'student_details', label: 'STUDENT DETAILS'},
  {key: 'class_section', label: 'CLASS & SECTION'},
]

export const HIERARCHY_STUDENT_DIR_TABLE_HEADERS_MOBILE_TUITION = [
  {key: 'student_details', label: 'STUDENT DETAILS'},
  {key: 'class_section', label: 'DEPARTMENT & BATCH'},
]

export const NON_HIERARCHY_STUDENT_DIR_TABLE_HEADERS = [
  {key: 'student_details', label: 'STUDENT DETAILS'},
]

export const SUBJECT_TOOLTIP_OPTIONS = [
  {
    label: t('editName'),
    action: SHC.ACT_SEC_EDIT_SUB_NAME,
    labelStyle: '',
    permissionId:
      PERMISSION_CONSTANTS.instituteClassController_updateEntityName_update,
    active: true,
  },
  {
    label: t('replaceTeacher'),
    action: SHC.ACT_SEC_REASSIGN_SUB_TEACHER,
    labelStyle: '',
    permissionId:
      PERMISSION_CONSTANTS.instituteClassController_assignSubjectTeacher_update,
    active: true,
  },
  {
    label: t('removeTeacher'),
    action: SHC.ACT_SEC_REMOVE_SUB_TEACHER,
    labelStyle: '',
    permissionId:
      PERMISSION_CONSTANTS.instituteClassController_removeSubjectTeacher_update,
    active: true,
  },
  {
    label: t('addCoTeacher'),
    action: SHC.ACT_SEC_ADD_CO_TEACHER,
    labelStyle: '',
    permissionId:
      PERMISSION_CONSTANTS.instituteClassController_assignSubjectTeacher_update,
    active: true,
  },
  {
    label: t('removeCoTeacher'),
    action: SHC.ACT_SEC_REMOVE_CO_TEACHER,
    labelStyle: '',
    permissionId:
      PERMISSION_CONSTANTS.instituteClassController_removeCoTeacher_update,
    active: true,
  },
  {
    label: t('delete'),
    action: SHC.ACT_SEC_REMOVE_SUB,
    labelStyle: 'tm-cr-rd-1',
    permissionId:
      PERMISSION_CONSTANTS.instituteClassController_deleteSubject_delete,
    active: true,
  },
]

export const UNCATEGORIZED_CLASSROOM_TOOLTIP_OPTIONS = [
  {
    label: t('editClassroomName'),
    action: SHC.ACT_UNC_CLS_EDIT_CLASS_NAME,
    labelStyle: '',
    permissionId:
      PERMISSION_CONSTANTS.instituteClassController_updateEntityName_update,
    active: true,
  },
  {
    label: t('addStudents'),
    action: SHC.ACT_UNC_CLS_ADD_STUDENTS,
    labelStyle: '',
    permissionId:
      PERMISSION_CONSTANTS.instituteClassController_updateOptionalClassStudents_update,
    active: true,
  },
  {
    label: t('viewStudents'),
    action: SHC.ACT_UNC_CLS_VIEW_STUDENTS,
    labelStyle: '',
    active: false,
  },
  {
    label: t('replaceTeacher'),
    action: SHC.ACT_UNC_CLS_REPLACE_TEACHER,
    labelStyle: '',
    permissionId:
      PERMISSION_CONSTANTS.instituteClassController_assignSubjectTeacher_update,
    active: true,
  },
  {
    label: t('removeTeacher'),
    action: SHC.ACT_UNC_CLS_REMOVE_TEACHER,
    labelStyle: '',
    permissionId:
      PERMISSION_CONSTANTS.instituteClassController_removeSubjectTeacher_update,
    active: true,
  },
  {
    label: t('addTeacher'),
    action: SHC.ACT_UNC_CLS_REPLACE_TEACHER,
    labelStyle: '',
    permissionId:
      PERMISSION_CONSTANTS.instituteClassController_assignSubjectTeacher_update,
    active: false,
  },
  {
    label: t('deleteClassroom'),
    action: SHC.ACT_UNC_CLS_DELETE_CLASS,
    labelStyle: 'tm-cr-rd-1',
    permissionId:
      PERMISSION_CONSTANTS.instituteClassController_deleteSubject_delete,
    active: true,
  },
]
