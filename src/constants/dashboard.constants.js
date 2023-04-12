import {t} from 'i18next'

export const CONSTS_DASHBOARD = {
  // Free Trial Banner Dashboard ( admin/src/components/Dashboard/FreeTrialBanner/FreeTrialBannerDashboard.js )
  LINK_COPIED: 'Link copied',
  ADD_TEACHER: 'Add Teacher',
  REMIND_TEACHERS: 'Remind Teachers',
  ADD_STUDENTS: 'Add Students',
  CREATE_CLASSROOM: 'Create Classroom',
  TRY_IT_FREE_FOR_14_DAYS: 'Try it Free for 14 days',
  START_SETUP: 'Start Setup',
  CONTINUE_SETUP: 'Continue Setup',
  COPY_LINK: 'Copy Link',
  INVITE_TEACHERS_AND_STUDENTS: 'Invite Teachers and Students',

  setupYourDigitalInstitute: 'Set up your digital institute',
  bannerTypesAddTeacherDesc:
    'Your digital institute is created. As a next step, start adding your teachers to set-up your digital institute.',
  bannerTypesRemindTeachersDesc:
    'Congratulations! You have added your teachers. Please remind them to accept your request and create their classroom by downloading the Teachmint app.',
  bannerTypesAddStudentsDesc:
    'For the best use of Teachmint for Institute, add atleast 20 students to your institute.',

  bannerTypesCreateClassroomDynamicDesc: `Congratulations!! {{totalTeachersJoined}} out of {{totalTeachers}} teacher <0></0> <1></1> joined your digital institute. Create your first digital classroom. You can also add more teachers in the Teachers section`,

  bannerTypesCreateClassroomDesc:
    'Create your first digital classroom. You can also add more teachers in the Teachers section',

  bannerTypesAddAllYourTeachersToExpandDynamicDesc: `{{totalTeachersJoined}} out of {{totalTeachers}} teacher<0></0> <1></1> joined your digital institute. Add all your teachers to expand your digital institute.`,

  addAllYourTeachersToExpandYourDigitalInstitute:
    'Add all your teachers to expand your digital institute.',

  upgradeYourInstitute: 'Upgrade your Institute',
  bannerTypesTryItFreeDesc:
    'You are using the free - Basic version of Teachmint For Institute. You can also upgrade your institute to the Advanced version to avail premium offerings like digital attendance tracking, communication, classroom monitoring, etc',
  continueSettingUpYourDigitalInstitute:
    'Continue setting up your Digital Institute',
  bannerTypesContinueSetupDesc: `Teachmint for Institute is the one stop destination for all your digital needs. Continue setting up your institute by clicking the button below.`,
  inviteYourTeachersAndStudents: 'Invite your Teachers and Students',
  bannerTypesInviteYourTeachersAndStudentsDesc: `Share the below link with your teachers and students on your institute groups to get them added to Teachmint.`,

  // Acknowledgement Popup
  ACK_POPUP_SMS_SENT: 'SMS Sent',
  ACK_POPUP_DESC: 'The SMS is successfully sent to teachers',
  ACK_POPUP_BTN_TEXT: 'Okay',

  // Pending Request
  PENDING_REQUESTS: 'Pending Requests',
  VIEW_REQUEST: 'View Request',

  // Total Stats
  TEACHERS: 'Teachers',
  CLASSROOMS: 'Classrooms',
  STUDENTS: 'Students',
  FEE_MANAGEMENT: 'Fee Management',
  JOIN_NOW: 'Join now',
  WAITLIST: 'Waitlist',

  // Statistics
  STATISTICS: 'Statistics',
  STATISTICS_SUB_TITLE: 'Updates every 6 hours. Last Updated ',
  LIVE_CLASSES_TAKEN: 'Live Classes Taken',
  TEACHING_HOURS: 'Teaching Hours',
  LEARNING_HOURS: 'Learning Hours',
  STUDENT_ATTENDANCE: 'Student Attendance (%)',
  today: 'Today',
  thisWeek: 'This Week',
  thisMonth: 'This Month',

  // Today Schedule
  ONGOING_LIVE_CLASSES: 'Ongoing Live Classes',
  UPCOMING_LIVE_CLASSES: 'Upcoming Live Classes',
  COMPLETED_LIVE_CLASSES: 'Completed Live Classes',
  LIVE_CLASSES_SCHEDULED: 'Live Classes Scheduled',
  VIEW_DETAILS: 'View Details',
  todaySchedule: "Today's Schedule",

  // Attendance
  ATTENDANCE: 'Attendance',
  TODAY_ATTENDANCE: "Today's Attendance",
  ATTENDANCE_LAST_UPDATES_INFO: 'Updates every 6 hours. Last Updated ',
  STUDENTS_PRESENT: 'Students present',
  TEACHERS_PRESENT: 'Teachers present',

  // Automated Insights ( admin/src/components/Dashboard/AutomatedInsights/AutomatedInsights.js )
  MOST_LIVE_CLASSES_TAKEN_BY: 'Most Live Classes taken by:',
  TEACHER_WITH_BEST_STUDENT_ATTENDANCE:
    "Teacher's with best student attendance:",
  AUTOMATED_INSIGHTS: 'Automated Insights',
  ADD_TEACHERS: 'Add Teachers',
  liveClasses: `<0></0> Classes`,
  liveClassesAvgAttendance: `<0></0> %`,

  // Benefits ( admin/src/components/Dashboard/Benefits/Benefits.js )
  liveClass: 'Live Class',
  benifitsItemLiveClassDesc: 'Monitor your classrooms from anywhere, anytime',
  Analytics: 'Analytics',
  benifitsItemAnalyticsDesc:
    'Now easily track number of classes taken, learning hours and much more',
  attendanceReport: 'Attendance Report',
  attendanceReportDesc: 'Daily attendance log of both teachers and students',
  feeCollection: 'Fee Collection',
  feeCollectionDesc:
    "Collect and manage your entire institute's fees in one place",

  benefitsOfTeachmintForInstitute: 'Benefits of Teachmint for Institute',
  inviteTeacher: 'Invite Teacher',

  // Congrats ( admin/src/components/Dashboard/Congrats/Congrats.js )
  congratulations: 'Congratulations!',
  instituteCreatedSuccessfullyMsg: `Your institute has been created successfully. Share this ID with
  Teachmint teachers`,
  instituteID: 'Institute ID',
  contrats: 'Congratulations',
  copy: 'Copy',

  // Detail Attendance Page ( admin/src/components/Dashboard/DetailAttendancePage/DetailAttendancePage.js )
  todayAttendanceOverview: "Today's Attendance Overview",
  studentsAttendance: 'Students Attendance',
  teacherAttendance: 'Teacher Attendance',
  last7DaysAttendance: 'Last 7 Days Attendance',

  // FreeTrialCongratsPopup ( admin/src/components/Dashboard/FreeTrialBanner/FreeTrialCongratsPopup.js )
  trialActivated14Days: '14 Days trial activated',
  freeTrialAcknowledgementPopupDesc: `Your 14 days free trial for Advanced plan is activated. Trial expires on <0></0>`,

  // Onboarding Steps ( admin/src/components/Dashboard/OnboardingSteps/OnboardingSteps.js )
  onboardingSteps1Desc: `Share Institute ID {{instituteId}} with your teachers`,
  onboardingSteps2Desc: 'Ask teacher to download Teachmint App',
  onboardingSteps3Desc:
    'Teachers can now create classrooms and add them using Institute ID',
  onboardingSteps4Desc: 'Approve their requests and you are done!',
  howDoesItWork: 'How does it work?',
  stepsIcon: 'StepsIcon',
  onboardingStepText: `Step {{item.index}}`,
  onboardingStepDesc: `{{item.desc}}`,

  // PendingRequest ( admin/src/components/Dashboard/PendingRequest/PendingRequest.js )
  yourRequestsPendingApproval: `You have {{pendingRequestCount}} requests pending for Approval.`,

  // Pending Request Card ( admin/src/components/Dashboard/PendingRequestCard/PendingRequestCard.js )
  youHaveMultipleRequestsFrom: `You have multiple requests from <0><{{teacherName}}/0>`,
  teacherName: `{{teacherName}}`,
  viewAllRequests: 'View All Requests',
  assignClassroom: 'Assign Classroom',
  acceptStudent: 'Accept Student',
  acceptTeacher: 'Accept Teacher',
  removeTeacher: 'Remove Teacher',
  teacherRequestParagraphCard: `<0>{{teacherName}}</0> wants to
  <1></1> <2></2>their
  <3>{{classroomName}}</3> classroom
  <4>Classroom Id: {{classroomId}}</4>
  <5></5> <6></6> your institute`,

  teacherPendingRequestCardIndividuals: `<0>{{data.name}}</0> wants to
  <1></1> your Institute
  <2>{{data.institute_id}}</2>
  as a <3></3> <4>of class {{data.class_detail}}</4> <5></5>`,

  // Pricing ( admin/src/components/Dashboard/Pricing/Pricing.js )
  plansBasic: 'Basic',
  planBasicDesc: 'Free',
  teachmintApplicationForTeachersAndStudents:
    'Teachmint Application for teachers and students',
  unlimitedTwoWayLiveClassAndRecording:
    'Unlimited Two-Way Live Class and recording',
  digitalContentSharing: 'Digital Content Sharing',
  onlineTestsIncludingAutoGradedMCQs:
    'Online Tests (including auto graded MCQs)',
  teacherStudentChatDiscussions: 'Teacher-Student Chat & Discussions',
  dashboardForInstituteAdministration: 'Dashboard for Institute Administration',
  adminControlsFeature:
    'Admin Controls (add/remove classroom, teacher, students)',
  basicStatistics: 'Basic Statistics',
  singleAdminAccess: 'Single Admin Access',

  advanced: 'Advanced',
  paidPlan: 'Paid Plan',
  everythingInTheBasicPlan: 'Everything in the Basic Plan',
  classroomMonitoring: 'Classroom Monitoring',
  studentAttendanceTracking: 'Student Attendance Tracking',
  studentPerformanceReports: 'Student Performance Reports',
  teacherAndStudentAnnouncements: 'Teacher and Student Announcements',
  insightfulStatistics: 'Insightful Statistics',
  parentCommunication: 'Parent Communication',
  instituteBranding: 'Institute Branding',
  feeManagement: 'Fee Management',
  multipleAdminAccess: 'Multiple Admin Access',
  dedicatedSupportManager: 'Dedicated Support Manager',
  periodicTeacherProductWorkshop: 'Periodic Teacher Product Workshop',

  pro: 'Pro',
  comingSoon: 'Coming Soon',
  everythingInTheAdvancedPlan: 'Everything in the Advanced Plan',
  lessonPlanning: 'Lesson Planning',
  digitalLearningContent: 'Digital Learning Content',
  admissionManagement: 'Admission Management',
  hrManagement: 'HR Management',
  inventoryManagement: 'Inventory Management',
  parentEngagementApp: 'Parent Engagement App',

  freeTrial14Days: '14 days free trial',
  buyNow: t('buyNow'),
  getStarted: 'Get Started',
  contactSales: 'Contact Now',

  plansDataItems: `{{item}}`,
  showTeacherCardTeacherName: `{{showTeacherCard.teacherData.teacher_name}}`,
  showTeacherCardTeacherPhoneNumber: `+91-{{showTeacherCard.teacherData.phone_number}}`,
  showTeacherCardTotalClasses: `{{showTeacherCard.teacherData.totalClasses}} Classrooms`,

  // TodaysSchedule ( admin/src/components/Dashboard/TodaysSchedule/TodaysSchedule.js )
  todaysScheduleTitle: `{{title}}`,
}
