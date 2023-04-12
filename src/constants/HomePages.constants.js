import {t} from 'i18next'

export const CONSTS_HOME_PAGES = {
  // Admin Page ( admin/src/components/Home/Admin/AdminPage.jsx )
  userDeletedSuccessfully: 'User Deleted Successfully.',
  userTypeOptionsValAll: `All - {{sourceList.length}}`,
  userTypeOptionsValJoined: `Joined - {{joinedUsers.length}}`,
  userTypeOptionsValPending: `Pending - {{pendingUsers.length}}`,
  userTypeOptionsValRejected: `Rejected - {{rejectedUsers.length}}`,
  userWillBeRemovedConfirmationPopupTitle: `Are you sure you want to remove {{selectedAdminCard.name}}`,
  userWillBeRemovedConfirmationPopupDesc: `<0>User will be removed and will no longer have access to
  your Institute.</0>`,
  edit: 'Edit',
  editData: `<0>Edit</0>`,
  remove: 'Remove',
  removeData: `<0>Remove</0>`,

  // SliderAddAdmin ( admin/src/components/Home/Admin/SliderAddAdmin.jsx )
  adminName: 'Name*',
  adminNamePlaceholder: 'John Doe',
  phoneNumber: 'Mobile Number*',
  phoneNumberPlaceholder: 'mobile number',
  userRoles: 'User Role*',
  userRolesPlaceholder: 'Role',
  enterDigitPhoneNumber: 'Enter 10 digit phone number',
  userAddedSuccessfully: 'User Added Successfully.',
  userCannotBeAdded: 'User cannot be added.',
  addUser: 'Add User',
  userRoleUpdatedSuccessfully: 'User Role Updated Successfully.',
  userRoleCouldNotBeUpdated: 'User Role could not be updated.',
  update: 'Update',
  updateUser: 'Update User',

  // Admission Management ( admin/src/components/Home/AdmissionManagement/AdmissionManagement.js )
  manageYourAdmissions: 'Manage your admissions',
  manageNewJoinees: 'Manage new joinees',
  managePeopleWhoLeave: 'Manage people who leave',
  visitAdmissionsPortal: 'Visit Admissions Portal',
  admissionManagement: 'Admission Management',
  admissionManagementFeatureIsAvailableInOur:
    'Admission Management feature is available in our',
  pleaseContactOurSalesTeamTodayToUpgradeYourPlan:
    'Please contact our sales team today to upgrade your plan',
  contactSales: 'Contact Now',

  // Announcements Page ( admin/src/components/Home/AnnouncementsPage/AnnouncementsPage.js )
  totalAnnouncements: 'Total Announcements:',
  createAnnouncements: 'Create Announcements',
  noAnnouncements: 'No Announcements',

  // Attendance Page ( admin/src/components/Home/AttendancePage/AttendancePage.js )
  workingDay: 'Working <0></0> Day',
  avgAttendance: 'Avg <0></0> Attendance',
  classesTaken: 'Classes <0></0> Taken',
  totalTeachers: 'Total Teachers:',
  searchForTeacher: 'Search for Teacher',
  daysPresentItemName: `{{item.name}}`,
  daysPresent: 'Days Present: <0></0>',
  classesTakenData: `Classes Taken : {{item.class_attended}} / {{item.class_count}}`,

  // ContactUs ( admin/src/components/Home/ContactUs/ContactUs.js )
  callUs: 'Call Us',
  chatWithUs: 'Chat with Us',
  writeToUs: 'Write to us',
  sendEmail: 'Send Email',
  weAreHereTo: 'We are here to <0></0> help you!',
  helpYou: 'help you!',
  instituteName: 'Institute Name',
  save: 'Save',
  editInstituteDetails: 'Edit Institute Details',
  successfullyUpdated: 'Successfully Updated',

  successfullyCopied: 'Copied Successfully',
  inviteTeachers: 'Invite Teachers',
  cancel: 'Cancel',

  // Feature Lock ( admin/src/components/Home/FeatureLock/featureLock.js )
  featureLocked: 'Feature Locked',
  featureLockedDesc: `This feature is available in our Advanced Plan. Please view details of our Advanced Plan and contact us.`,
  viewPlans: 'View Plans',
  startFreeTrial: 'Start Free Trial',

  // Feedback Page ( admin/src/components/Home/FeedbackPage/FeedbackPage.js )
  feedbackReceived: 'Feedback Received',
  feedbackReceivedDesc: 'Thank you for sending your valuable feedback!',
  goToDashboard: 'Go to Dashboard',
  weValueYourFeedback: `We value your feedback. Tell us how we can improve to serve you
  better.`,
  writeYourFeedbackHere: 'Write your feedback here',
  submit: 'Submit',

  // Header ( admin/src/components/Home/Header/Header.js )
  getTitleLocation: `<0></0>`,

  // HelpPage ( admin/src/components/Home/HelpPage/HelpPage.js )
  faqsQuestion1: "What is 'Teachmint for Institute'?",
  faqsQuestionAnswer1: `&apos;Teachmint for Institute&apos; is a digital age Operating System
  for your school, college or coaching institute. It enables your
  institute to be future ready. With &apos;Teachmint for
  Institute&apos;, Owners and/or Admin can easily manage their Teachers,
  Classrooms, Students and more on the Teachmint platform.`,
  faqsQuestionAnswerString1:
    "'Teachmint for Institute' is a digital age Operating System for your school, college or coaching institute. It enables your institute to be future ready. With 'Teachmint for Institute', Owners and/or Admin can easily manage their Teachers, Classrooms, Students and more on the Teachmint platform.",

  faqsQuestion2: "How can I start using 'Teachmint for Institute'?",

  faqsQuestionAnswerStringData2: `Step 1 : Sign-up on
   <0>www.teachmint.com/login</0>
   <1></1>
   Step 2 : Share the &apos;Institute ID&apos; with your Teachers <br />
    Step 3 : Your Teachers will then have to create their classrooms and
    link the classrooms with Institute using the &apos;Institute ID&apos;
    Institute Owners and/or Admin will then be able to manage teachers,
    classrooms and students of the Institute using the &apos;Teachmint for
    Institute&apos; operating system.`,

  faqsQuestionAnswerString2:
    "Step 1 : Sign-up on www.teachmint.com/institute/login Step 2 : Share the 'Institute ID' with your Teachers Step 3 : Your Teachers will then have to create their classrooms and link the classrooms with Institute using the 'Institute ID' Institute Owners and/or Admin will then be able to manage teachers, classrooms and students of the Institute using the 'Teachmint for Institute' operating system.",

  faqsQuestion3: "What features do I get in 'Teachmint for Institute'",
  faqsQuestionAnswer3: `Plans and features of &apos;Teachmint for Institute&apos; are listed
  on the
  <0>&apos;View our Plans&apos;</0>
  page.`,
  faqsQuestionAnswerString3:
    "Plans and features of 'Teachmint for Institute' are listed on the 'View our Plans' page.",

  // Hostel Page ( admin/src/components/Home/HostelManagement/HostelPage.jsx )
  HOSTEL: 'HOSTEL',
  HOSTEL_TYPE: 'HOSTEL TYPE',
  WARDEN: 'WARDEN',
  VIEW_DETAILS: 'VIEW DETAILS',
  HOSTEL_DETAILS: 'HOSTEL DETAILS',
  hostelStatusUpdatedSuccessfully: 'Hostel Status Updated Successfully.',
  hostelStatusUpdationFailed: 'Hostel Status Updation Failed',
  hostelDeletedSuccessfully: 'Hostel Deleted Successfully.',
  failedToDeleteThisHostel: 'Failed to delete this Hostel.',
  hostelManagement: 'Hostel Management',
  areYouSureYouWantToRemoveThisHostel:
    'Are you sure you want to remove this Hostel?',
  hostelRemoveConfirmationPopup: `<0>If you remove the hostel you will not be able recover it
  later.</0>`,
  searchForHostel: t('searchForHostel'),
  addHostel: '+ Add Hostel',
  assign: 'Assign',
  removeWarden: 'Remove Warden',
  assignWarden: 'Assign Warden',
  removeHostel: 'Remove Hostel',
  manage: 'Manage',
  deleteHostel: `<0>Delete Hostel</0>`,

  // RoomPage ( admin/src/components/Home/HostelManagement/RoomPage.jsx )
  roomStatusUpdatedSuccessfully: 'Room Status Updated Successfully.',
  roomStatusUpdationFailed: 'Room Status Updation Failed',
  roomDeletedSuccessfully: 'Room Deleted Successfully.',
  areyouSureYouWantToRemoveThisRoom:
    'Are you sure you want to remove this room?',
  roomDeleteConfirmationPopup: `<0>If you will delete this room you will loose all
  occupancies and will not be able recover these later.</0>`,
  deleteRoom: '<0>Delete Room</0>',

  // Slider Add Hostel ( admin/src/components/Home/HostelManagement/SliderAddHostel.jsx )
  hostelName: 'Name*',
  hostelNamePlaceholder: 'Swami Vivekananda Hostel',
  address: 'Address*',
  addressPlaceholder: 'Address',
  rooms: 'Number of Rooms*',
  roomsPlaceholder: '12',
  hostelType: 'Select Hostel Type',
  boys: 'Boys',
  girls: 'Girls',
  required: 'Required',
  incorrect: 'Incorrect',
  hostelAddedSuccessfully: 'Hostel Added Successfully.',
  hostelCannotBeAdded: 'Hostel cannot be added.',
  addHostelLabel: 'Add Hostel',

  // Slider Add Room ( admin/src/components/Home/HostelManagement/SliderAddRoom.jsx )
  roomName: 'Name*',
  roomNamePlaceholder: '201',
  block: 'Block',
  blockPlaceholder: 'B Block',
  floor: 'Number of floor(s)',
  floorPlaceholder: '12',
  occupancy: 'Occupancy*',
  occupancyPlaceholder: '2',
  roomAddedSuccessfully: 'Room Added Successfully.',
  roomCannotBeAdded: 'Room cannot be added.',
  addRoom: 'Add Room',

  // Slider Assign Student ( admin/src/components/Home/HostelManagement/SliderAssignStudent.jsx )
  searchForUser: 'Search for User',

  // BookProfile ( admin/src/components/Home/LibraryManagement/BookProfile.jsx )
  bookProfileName: `{{name}}`,
  bookProfileIsbnNumber: `{{isbnNumber}}`,

  // Library Page ( admin/src/components/Home/LibraryManagement/LibraryPage.jsx )
  BOOK_DETAILS: 'BOOK DETAILS',
  ASSIGNED_ON: 'ASSIGNED ON',
  ASSIGNED_TO: 'ASSIGNED TO',
  ASSIGN_RETURN: 'ASSIGN/RETURN',
  bookStatusUpdatedSuccessfully: 'Book Status Updated Successfully.',
  bookStatusUpdationFailed: 'Book Status Updation Failed',
  bookDeletedSuccessfully: 'Book Deleted Successfully.',
  bookIssueReturnManagement: 'Book Issue/Return Management',
  bookRemoveConfirmationPopupTitle:
    'Are you sure you want to remove this book?',
  bookRemoveConfirmationPopupDesc: `<0>If you remove the book you will not be able recover it later.</0>`,
  addBook: '+ Add Book',

  // Slider Add Book ( admin/src/components/Home/LibraryManagement/SliderAddBook.jsx )
  bookName: 'Name*',
  bookNamePlaceholder: 'Concepts of Physics by H.C. Verma',
  isbnCode: 'ISBN Number*',
  isbnCodePlaceholder: 'ISBN number',
  authors: 'Author Name*',
  authorsPlaceholder: 'Author',
  bookAddedSuccessfully: 'Book Added Successfully.',
  bookCannotBeAdded: 'Book cannot be added.',

  // Slider Assign Book  ( admin/src/components/Home/LibraryManagement/SliderAssignBook.jsx )
  searchForStudent: 'Search for Student',

  // Slider Edit Book ( admin/src/components/Home/LibraryManagement/SliderEditBook.jsx )
  bookDataUpdatedSuccessfully: 'Book data Updated Successfully.',
  bookDataCouldNotBeUpdated: 'Book data could not be updated.',
  updateBook: 'Update Book',

  // Admin Deleted Logout ( admin/src/components/Home/Logout/AdminDeletedLogout.js )
  Logout: 'Logout',
  logoutAcknowledgementPopupDesc:
    'Login not allowed. Your admin access have been removed from your Institute',

  // Logout ( admin/src/components/Home/Logout/Logout.js )
  logoutConfirmationPopupDesc: 'Are you sure you want to log out?',
  logoutBtnText: 'Log Out',

  // Navbar ( admin/src/components/Home/Navbar/Navbar.jsx )
  bannerTextFreeTrialExpired:
    'Your free trial for Advanced plan has expired. Please contact us to upgrade your plan.',
  navBarWarningNotice: `We have scheduled a downtime from 10 PM, 29 Jan, 2022 to 2 AM, 30 Jan,
    2022 for maintenance. We regret the inconvenience caused.`,
  clickHereToBuyNow: 'Click here to Buy now',

  // Slider Heading ( admin/src/components/Home/Navbar/components/SliderHeading/SliderHeading.js )
  sliderHeadingIcon: 'slider heading icon',
  addNew: t('addNewPlus'),

  // Slider Academic Session ( admin/src/components/Home/Navbar/components/SliderAcademicSession.jsx )
  selectValidDate: 'Select a valid date',
  changesAcademicSessionTitle:
    'Are you sure, you want to make changes in the academic session?',
  changesAcademicSessionDesc:
    'These updates may lead to some data loss or classroom being hidden from teachers and students.',
  createNewAcademicSessionTitle:
    'Are you sure you want to create a new academic session?',
  createNewAcademicSessionDesc:
    'A new academic session will help you manage your institute data separately for different academic sessions.',

  academicSessionIsSuccessfullyUpdated:
    'Academic Session is successfully updated',
  academicSessionIsSuccessfullyCreated:
    'Academic Session is successfully created',

  sessionName: 'Session Name',
  sessionNamePlaceholder: 'Batch of 2022',
  startDate: 'Start Date',
  endDate: 'End Date',

  affiliatedBoard: 'Select affiliated board',
  affiliatedBoarPlaceholder: 'CBSE, ICSE, etc...',
  selectDepartmentsInYourSchool: 'Select departments in your school',

  // Notification ( admin/src/components/Home/Notification/Notification.js )
  addClassroom: 'Add Classroom',
  removeClassroom: 'Remove Classroom',
  youAreUpToDate: 'You are up-to-date!',

  // MultipleRequestPopup ( admin/src/components/Home/PendingRequest/MultipleRequestPopup/MultipleRequestPopup.js )
  acceptRequestAsTitle: `Accept request as {{selectedItem.title}}?`,

  // PendingRequest ( admin/src/components/Home/PendingRequest/PendingRequest.js )
  classroomRemoveRequestCancelled: 'Classroom remove request cancelled',
  classroomRemovedSuccessfully: 'Classroom removed successfully',
  removeTeacherConfirmationPopupTitle: 'Remove Teacher',
  removeTeacherConfirmationPopupDesc:
    'Are you sure you want to remove the teacher? You will lose all data related to the teacher and will not be able to recover it later.',
  classroomRequestsFromTeachersWillAppearHere:
    'Request from teachers and students to join your institute will appear here.',
  entityAddedSuccessfully: `{{entity}} added successfully`,

  // ProfileDropdown ( admin/src/components/Home/ProfileDropdown/ProfileDropdown.jsx )
  manageInstitute: 'Manage Institute',

  // Todays Schedule ( admin/src/components/Home/TodaysSchedule/TodaysSchedule.js )
  ongoingLabel: 'Ongoing',
  todayScheduleTabOngoingDesc: 'Ongoing classes will appear here',
  upcomingLabel: 'Upcoming',
  todayScheduleTabUpcomingDesc: 'Upcoming classes will appear here.',
  completedLabel: 'Completed',
  todayScheduleTabCompletedDesc: 'Completed classes will appear here.',
  scheduledLabel: 'Scheduled',
  todayScheduleTabScheduledDesc: 'All scheduled classes will appear here.',

  // Unauthorised ( admin/src/components/Home/UnauthorisedPage/Unauthorised.jsx )
  ooops: 'Ooops!',
  goToHomepage: 'Go to homepage',
  authorisedPara: `It seems you are not authorised to access <br /> the page.`,

  // WebsiteBuilder ( admin/src/components/Home/WebsiteBuilder/WebsiteBuilder.js )
  createYourInstituteWebsite: 'Create your institute website',
  growYourInstituteOnlinePresence: 'Grow your institute online presence',
  buildAndPublishYourWebsiteWithOurWebsiteBuilder:
    'Build and publish your website with our website builder',
  websiteBuilder: 'Website Builder',
  visitWebsiteBuilderPortal: 'Visit Website Builder Portal',
  websiteBuilderFeatureIsAvailableInOur:
    'Website builder feature is available in our',
  advancedPlan: 'Advanced Plan',
  websiteBuilderFeatureIsAvailableInOurDynamic: `Website builder feature is available in our
  <0>Advanced Plan</0>
  Please contact our sales team today to upgrade your plan`,

  // Home ( admin/src/containers/Home/Home.js )
  unableToAccessSchoolSystem: 'Unable to access school system',
  pleaseUnblockToReceiveNotifications:
    'Please unblock to receive notifications',
  switchInstitute: 'Switch Institute',
  academicSessionsCouldNotBeLoadedErrorOverlay: `Academic sessions could not be loaded. Please retry or contact
  support if the issue persists...`,

  // Pricing ( admin/src/containers/Pricing/Pricing.js )
  digitiseYourInstituteToday: 'Digitise your institute today!',
  simpleAndSecureAccessForEveryone: 'Simple and secure access for everyone',
  exploreEverythingThatYourInstituteNeeds:
    'Explore everything that your institute needs',
}
