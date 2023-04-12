export const CONSTS_EXAM_PLANNER = {
  // Exam Planner Table ( admin/src/components/ExamPlanner/components/ExamPlannerTable/ExamPlannerTable.jsx )
  unableToGetAssessments: 'Unable to get assessments',
  viewResult: 'View Result',
  holiday: 'Holiday',
  clickToAddSubject: 'Click to add subject',
  uniqueSubjects: `+ <0></0> more`,
  examPlannerClassName: `Class {{name}}`,
  weekdayShort: `{{date.weekdayShort}}`,
  examDay: `{{date.day}}`,
  monthShort: `{{date.monthShort}}`,

  // ScoreCard Progress Bar ( admin/src/components/ExamPlanner/components/ScoreCardProgressBar.jsx )
  classAverage: 'Class Average',
  classTop10: 'class Top 10%',
  marks: 'Marks',
  scoreCard1ProgressInfo: `<0></0> <1>/ {{paperMarks}}</1>`,
  scoreCard2ProgressInfo: `<0></0> <1>/ {{paperMarks}}</1>`,

  // Semi Circular ProgressBar ( admin/src/components/ExamPlanner/components/semiCircularProgressBar/index.js )
  semiCircularProgressBarChild: `{{child}}`,

  // Delete Exam  ( admin/src/components/ExamPlanner/components/DeleteExam.jsx )
  deleteTheExamSchedulePopupTitle:
    'Are you sure you want to delete the Exam Schedule?',

  deleteTheExamSchedulePopupDesc1: `<0>To delete the exam schedule, please remove each exam
  individually. Exam Schedule can only be deleted if there is no
  exam added in the calendar.</0>`,
  deleteTheExamSchedulePopupDesc2:
    'If you delete the exam schedule it will be removed from the calendar and will not be visible to teachers.',
  edit: 'Edit',
  delete: 'Delete',
  unableToDeleteExamSchedule: 'Unable to delete exam schedule',

  // Exam Planner Page ( admin/src/components/ExamPlanner/components/ExamPlannerPage.jsx )
  unableToGetExamSchedules: 'Unable to get exam schedules',
  examsSuccessfullyPublished: 'Exams successfully published',
  unableToPublishExams: 'Unable to publish exams',
  errorOverlayExamsNotFound: `Exams could not be loaded. Please retry or contact support if the
  issue persists...`,
  examPlannerEmptyScreenTitle:
    'To use the feature please open the page in Desktop',
  goToDashboard: 'Go to Dashboard',
  examPlannerAcademicSessionEmptyScreenTitle:
    'Exam Planner is only available for new academic session',
  examPlannerAcademicSessionEmptyScreenDesc:
    'You can create a new academic session and create exam schedule in it.',
  createSchedule: '+ Create Schedule',
  examNameValue: `{{item.exam_name}}`,
  examName: 'Exam Name',
  classes: 'Classes',
  publishDraft: 'Publish to inform teachers and students',
  publishNow: 'Publish Now',
  createScheduleEmptyScreenDesc:
    'Please click on create schedule button to create exam schedule.',
  examPlanerPagetfiClassesLength: `<0>+ {{item.tfi_classes.length - 3}} more </0>`,

  // Slider Create Exam ( admin/src/components/ExamPlanner/components/SliderCreateExam.jsx )
  selectFutureDate: 'Select future date',
  enterAValidDate: 'Enter a valid date',
  examScheduleSuccessfullyUpdated: 'Exam Schedule successfully updated',
  unableToUpdateExamSchedule: 'Unable to update exam schedule',
  examScheduleSuccessfullyCreated: 'Exam schedule successfully created',
  unableToCreateExamSchedule: 'Unable to create exam schedule',

  editExam: 'Edit Exam',
  editExamConfirmationPopupTitle:
    'You have exams scheduled for the dates edited',
  editExamConfirmationPopupDesc:
    'To update the exam schedule, please remove the exams added for the dates you want to edit. You can update the schedule once there are no exams added for the dates.',
  cancel: 'Cancel',
  updateExamSchedule: 'Update Exam Schedule',
  createExamSchedule: 'Create Exam Schedule',

  examNamePlaceholder: 'Enter exam name',
  selectClass: 'Select class',
  startDate: 'Start Date',
  endDate: 'End Date',
  saveExamSchedule: 'Save Exam Schedule',

  // Slider Create Single Test ( admin/src/components/ExamPlanner/components/SliderCreateSingleTest.jsx )
  enterValidTime: 'Enter Valid Time',
  assessmentSuccessfullyCreated: 'Assessment successfully created',
  unableToCreateAssessment: 'Unable to create assessment',
  addSubjectAndTimeToCreateAnExam: 'Add subject and time to create an exam',
  class: 'Class',
  markAsHoliday: 'Mark as a Holiday',
  noExamsEcheduledErrorMSG: 'There are no exams scheduled for this day.',
  addMoreSubject: '+ Add More Subject',
  save: 'Save',
  selectedClassName: `{{selectedClass.class.name}}`,
  startTime: 'Start Time',
  endTime: 'End Time',
  errObjTimeslot: `{{errObj[i].timeslot}}`,

  // Slider View Result ( admin/src/components/ExamPlanner/components/SliderViewResult.jsx )
  assessmentCouldNotBeLoadedErrorOverlay: `Assessment could not be loaded. Please retry or contact support if the
  issue persists...`,
  viewResults: 'View Results',
  submitted: 'Submitted',
  resultHasNotbeenPublishedYet: 'Result has not been published yet',
  studentName: 'Student Name',
  marksValue: `Marks({{ examResult.stats.totalMarks }})`,
}
