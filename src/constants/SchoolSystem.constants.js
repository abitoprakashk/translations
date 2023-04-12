export const CONSTS_SCHOOL_SYSTEM = {
  // Uncategorized Classroom Card ( admin/src/components/SchoolSystem/ClassroomDirectory/UncategorizedClassroomCard/UncategorizedClassroomCard.jsx )
  viewClassroom: 'View Classroom',
  classroomItemTeacherName: `{{classroomItem.teacher.name}}`,
  classroomItemTimetable: `{{classroomItem.timetable}}`,

  // Classroom Directory ( admin/src/components/SchoolSystem/ClassroomDirectory/ClassroomDirectory.jsx )
  actUncClsRemoveTeacherTitle: 'Are you sure you want to remove teacher?',
  actUncClsRemoveTeacherDesc:
    'Removing teacher will hinder digital classroom activities for students. For smooth conduct of classroom activities, please keep a subject teacher.',
  actUncClsDeleteClassTitle: `Are you sure you want to delete {{node.name}} class?`,
  actUncClsDeleteClassDesc:
    'If you delete the class you will loose all data and you will not be able recover it later ever.',
  editClassName: 'Edit Class Name',
  nameSuccessfullyUpdated: 'Name successfully updated',
  unableToUpdateName: 'Unable to update name',
  classTeacherSuccessfullyRemoved: 'Class teacher successfully removed',
  unableToRemoveClassTeacher: 'Unable to remove class teacher',
  classroomSuccessfullyDeleted: 'Classroom successfully deleted',
  unableToDeleteClassroom: 'Unable to delete classroom',
  searchForClassrooms: 'Search for classrooms',
  addingClassroomsEmptyScreenTitle: 'Start adding classrooms to your institute',
  addingClassroomsEmptyScreenDesc:
    'There are no classrooms in your institute right now, classrooms added will appear here',
  addClassrooms: 'Add Classrooms',

  // Slider Add Classroom ( admin/src/components/SchoolSystem/ClassroomDirectory/SliderAddClassroom.jsx )
  classroomName: 'Classroom Name*',
  classroomNamePlaceholder: 'Enter Classroom Name',
  subject: 'Subject*',
  subjectPlaceholder: 'Enter Subject',
  teacher: 'Teacher',
  teacherPlaceholder: 'Select Teacher',
  classroomSuccessfullyCreated: 'Classroom successfully created',
  unableToAddTeacherToTheClassroom: 'Unable to add teacher to the classroom',
  unableToCreateClassroom: 'Unable to create classroom',
  selectDayAndTimeSlot: 'Select day and time slot',

  // ContentArea ( admin/src/components/SchoolSystem/ContentArea/ContentArea.jsx )
  archived: 'archived',

  // School Setup ( admin/src/components/SchoolSystem/SchoolSetup/SchoolSetup.jsx )
  addNewSection: '+ Add New Section',
  addNewBatch: '+ Add New Batch',
  viewBatch: 'View Batch',
  viewDept: 'View Department',

  // CheckBoxListWithSearch ( admin/src/components/SchoolSystem/SectionDetails/ImportStudents/CheckBoxListWithSearch.jsx )
  noResults: 'No Results',
  noStudentsFoundInThisClass: 'No students found in this class',

  // ImportStudents ( admin/src/components/SchoolSystem/SectionDetails/ImportStudents/ImportStudents.jsx )
  importStudents: 'Import Students',

  // constant ( admin/src/components/SchoolSystem/SectionDetails/constant.js )
  addStudent: 'Add Student',
  importStudent: 'From Previous Session',
  unassignedStudent: 'Unassigned Students',
  academicYear: 'Academic Session',
  selectClass: 'Select Class',
  selectYearText: 'Select Academic Session to import students from',
  selectClassText: 'Select Class to import students from',

  // Section Details ( admin/src/components/SchoolSystem/SectionDetails/SectionDetails.jsx )
  unableToGetSectionDetails: 'Unable to get section details',
  unableToUpdateData: 'Unable to update data',
  subjectSuccessfullyDeleted: 'Subject successfully deleted',
  unableToDeleteSubject: 'Unable to delete subject',
  subjectSuccessfullyAdded: 'Subject successfully added',
  unableToAddSubject: 'Unable to add subject',
  subjectTeacherSuccessfullyRemoved: 'Subject teacher successfully removed',
  unableToRemoveSubjectTeacher: 'Unable to remove subject teacher',
  classTeacherRemovedSuccessfully: 'Class teacher removed successfully',
  classSection: 'Class - Section',
  deleteClassroomShowConfirmationPopupTitle: `Are you sure you want to delete {{classFullName}}`,
  deleteClassroomShowConfirmationPopupDesc:
    'If you delete the classroom you will loose all data of the classroom and you will not be able recover it later ever.',
  actSecRemoveSubTeacherTitle: `Are you sure you want to remove teacher from {{node.name}} subject`,
  actSecRemoveSubTeacherDesc:
    'Removing the subject teacher will hinder digital classroom activities at the student end. For smooth conduct of classroom activities, please keep a subject teacher.',
  actSecRemoveClassTeacherTitle: 'Remove class teacher?',
  actSecRemoveClassTeacherDesc:
    'Removing the class teacher will hinder online classroom activities for students. Please keep a class teacher for conducting classroom activities easily.',
  actSecRemoveSubTitle: `Are you sure you want to delete {{node.name}} subject?`,
  actSecRemoveSubDesc:
    'If you delete the subject you will loose all data and you will not be able recover it later ever.',
  subjectName: 'Subject Name',
  editSubjectName: 'Edit Subject Name',
  editClassroomName: 'Edit Classroom Name',
  sectionName: 'Section Name',
  assignTeacher: 'Assign Teacher',
  addSubject: '+ Add Subject',
  addClassroom: '+ Add Classroom',
  manageClassTeacherNormalCardDesc:
    'Class teacher is responsible for day to day activities of the class',
  assignClassTeacher: '+ Assign Class Teacher',
  addStudents: '+ Add Students',
  assignMoreStudents: `+ Assign <0></0>`,

  // Slider AddOptional Students ( admin/src/components/SchoolSystem/SectionDetails/SliderAddOptionalStudents.jsx )
  studentsAssignedSuccessfully: 'Students Assigned Successfully.',
  failedToAssignStudents: 'Failed to Assign Students.',
  updateStudents: 'Update Students',
  getUpdatedstudentDetailsTempMsg: `{{studentDetailsTemp.name}} has been successfully added`,
  unableToAddStudent: 'Unable to add student',
  fileTypeNotSupported: 'File type not supported',
  studentsAddedSuccessfully: 'Students Added Successfully',
  unableToAddStudents: 'Unable to add students',
  bulkUpload: 'Bulk Upload',
  downloadSampleFile: 'Download Sample file',
  addstudentManually: 'Add Student Manually',
  studentDetailsTempAddedSuccessfully: `{{studentDetailsTemp.name}} has been successfully added as a student`,
  addStudentFailedConfirmationPopupDesc: `{{validationObject.msg}}`,
  addStudentAcknowledgementPopupDesc: `{{{validationObject.msg}}}`,

  // SliderAddTeacher ( admin/src/components/SchoolSystem/SectionDetails/SliderAddTeacher.jsx )
  dateOfBirth: 'Date of Birth',
  dateOfAppointment: 'Date of Appointment',
  teachersAddedSuccessfully: 'Teacher Added Successfully',
  addTeacher: 'Add Teacher',
  inviteTeachersToJoinYourInstituteViaLink:
    'Invite teachers to join your institute via link',
  enterValidInput: 'Enter a valid input',
  addTeacherConfirmationPopupDesc: `{{validationObject.msg}}`,
  addTeacherAcknowledgementPopup: `{{validationObject.msg}}`,
  addTeacherShowOptionalDetails: `<0></0> optional details`,
  assignClassTeacherClassName: `Assign as <0>Class Teacher</0> for {{nodeDetails.classroomName}}`,

  // SliderMoveStudent ( admin/src/components/SchoolSystem/SectionDetails/SliderMoveStudent.jsx )
  unableToMoveStudent: 'Unable to move student',
  unableToAssignStudent: 'Unable to assign student',
  moveStudentToDifferentClass: 'Move student to a different class',
  studentAssignedSuccessfully: 'Student Assigned Successfully',
  unableToAssignClassTeacher: 'Unable to assign class teacher',
  unableToAssignSubjectTeacher: 'Unable to assign subject teacher',
  addNewTeacher: '+ Add new teacher',
  searchForTeacher: 'Search for Teacher',
  moveStudentSuccessfullyMsg: `{{selectedStudent.name}} has been successfully moved`,
  assignStudentSuccessfullyMsg: `{{selectedStudent.name}} has been successfully assigned`,
  studentMovetoBelowClassAndRemovedFrom: `{{selectedStudent.name}} will be moved to the below class and will be removed from {{sectionDetails.name}}}`,
  addStudentTobelowClass: `Add {{selectedStudent.name}} to below class`,

  // SliderStudent ( admin/src/components/SchoolSystem/SectionDetails/SliderStudent.jsx )
  AssignStudentCheckBoxListWithSearchBtnText: `Assign students to {{sectionDetails?.parent?.name} - {{sectionDetails.name}}`,
  addStudentsSliderScreenHeader: `Add students to {{sectionDetails.parent.name}} - {{sectionDetails.name}}`,

  // Slider Teacher ( admin/src/components/SchoolSystem/SectionDetails/SliderTeacher.jsx )
  addingTeachersEmptyScreenTitle: 'Start adding teachers to your school',
  addingTeachersEmptyScreenDesc:
    'There are no teachers in your school right now, teachers added will appear here',
  addTeachers: 'Add Teachers',
  addedTeacherSuccessShowToast: `{{teacherName}} has been successfully added as a teacher`,

  // StudentsTable ( admin/src/components/SchoolSystem/SectionDetails/StudentsTable.jsx )
  searchForStudents: 'Search for Students',

  // Subject Tooltip Options ( admin/src/components/SchoolSystem/SectionDetails/SubjectTooltipOptions.jsx )
  sbjectTooltipOptionsLabel: `{{label}}`,

  // SliderStudentDetail ( admin/src/components/SchoolSystem/StudentDirectory/SliderStudentDetail.jsx )
  basicInfo: 'Basic Info',
  feeHistory: 'Fee History',
  unableToGetStudentDetails: 'Unable to get student details',
  detailsUpdatedSuccessfully: 'Details updated successfully',
  unableToUpdateStudentDetails: 'Unable to update student details',
  classroom: 'Classroom',
  transportFee: 'Transport Fee',
  updateChanges: 'Update Changes',
  thisWillDeleteAllYourDataWithCurrentProfile:
    'This will delete all your data with current profile',
  studentDetailsDeteledSuccesShowToast: `{{studentDetails.name}} has been successfully deleted`,
  areYouWantDeleteStudentConfirmationPopupTitle: `Are your sure you want to delete {{studentDetails.name}} as a student`,
  areYouWantDeleteStudentConfirmationPopupDesc: `If you delete the {{studentDetails.name}} you will loose all data of the student and you will not be able recover it later ever.`,

  // StudentDirectory ( admin/src/components/SchoolSystem/StudentDirectory/StudentDirectory.jsx )
  addingStudentsEmptyScreenTitle: 'Start adding students to your institute',
  addingStudentsEmptyScreenDesc:
    'There are no students in your institute right now, students added will appear here',

  // SliderTeacherDetail ( admin/src/components/SchoolSystem/TeacherDirectory/SliderTeacherDetail.jsx )
  unableToGetTeacherDetails: 'Unable to get teacher details',
  unableToDeleteTeacher: 'Unable to delete teacher',
  teacherDetailsDeletedSuccessShowToast: `{{teacherDetails.name}} has been successfully deleted`,
  areYouWantDeleteTeacherConfirmationPopupTitle: `Are your sure you want to delete {{teacherDetails.name}} as a teacher`,
  areYouWantDeleteTeacherConfirmationPopupDesc: `If you delete <1></1> you will lose all the data of the teacher. This data cannot be recovered later.`,

  // Teacher Directory ( admin/src/components/SchoolSystem/TeacherDirectory/TeacherDirectory.jsx )
  addingTeachersInstituteEmptyScreenTitle:
    'Start adding teachers to your institute',
  addingTeachersInstituteEmptyScreenDesc:
    'There are no teachers in your institute right now, teachers added will appear here',
}
