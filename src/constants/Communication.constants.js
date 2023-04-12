export const CONSTS_COMMUNICATION = {
  // Add Attachment ( admin/src/pages/communication/components/AddAttachment/AddAttachment.js )
  incorrectFileType: 'Incorrect file type',
  fileIsTooBig: 'File is too big',
  attachIcon: 'Attach icon',
  ATTACH: 'ATTACH',

  // UploadFile ( admin/src/pages/communication/components/AddAttachment/components/UploadFile.js )
  uploadFileFailIcon: 'upload file fail icon',
  uploadFailed: 'Upload failed',
  clickOnATTACHToRetry: '(click on ATTACH to retry)',
  uploadFileIcon: 'upload file icon',
  closeBtnIcon: 'close btn icon',

  // AnalyticsPage ( admin/src/pages/communication/components/AnalyticsPage/AnalyticsPage.js )
  createNew: '+ Create New',
  postsNotFound: 'Posts not found',

  // Message ( admin/src/pages/communication/components/Announcement/components/Message/Message.js )
  message: 'Message *',
  enterMoreDetailsAboutTheAnnouncement:
    'Enter more details about the announcement',
  title: 'Title *',
  enterTheTitleOfTheAnnouncement: 'Enter the title of the announcement',

  // AnnouncementPostContent ( admin/src/pages/communication/components/Announcement/components/AnnouncementPostContent.js )
  announcementPostContentTitle: `{{post.title}}`,
  announcementPostContentMsg: `{{post.message}}`,

  // Announcement ( admin/src/pages/communication/components/Announcement/Announcement.js )
  createAnnouncement: 'Create Announcement',

  // ( admin/src/pages/communication/components/Channel/Channel.js )
  channelTitleCommunicationType: `Choose how will the receiver get this  {{COMMUNICATION_TYPE[announcement_type]}}`,

  // Confirmation Modal ( admin/src/pages/communication/components/ConfirmationModal/ConfirmationModal.js )
  userSegment: 'User Segment:',
  allUserTypes: 'All User Types',
  channel: 'Channel:',
  duration: 'Duration:',
  areYouSureAboutPostingThe: `Are you sure about posting the
  {{COMMUNICATION_TYPE[common.announcement_type]}}`,
  preview: 'Preview',
  TheWayItWillAppearToYourUsersInTheirDevice:
    '(the way it will appear to your users in their device)',
  messageLabel: 'Message:',
  questionLabel: 'Question:',
  decline: 'Decline',
  confirm: 'Confirm',
  askTeacherAndStudentToUpdateTheirAppData: `<0>{ASK_TEACHER_AND_STUDENT_TO_UPDATE_THEIR_APP}</0>`,
  ConfirmationModalFeedbackMsg: `{feedback.message}`,

  // Create New Modal ( admin/src/pages/communication/components/CreateNewModal/CreateNewModal.js )
  announcement: 'Announcement',
  announcementIcon: 'Announcement icon',
  poll: 'Poll',
  surveyIcon: 'Survey icon',
  feedback: 'Feedback',
  SMSIcon: 'SMS icon',
  createNewTitle: 'Create New',
  selectOneToProceed: 'Select one to proceed',
  createNewModalOptionTitle: `{{option.title}}`,
  createNewModalOptionSubTitle: `{{option.subTitle}}`,

  // DeletePostModal ( admin/src/pages/communication/components/DeletePostModal/DeletePostModal.js )
  permanentlyDeletePostTitle: `Are you sure you want to permanently delete &apos;
  {{postTitleForDelete}} &apos; draft?`,

  // Feedback ( admin/src/pages/communication/components/Feedback/Feedback.js )
  createFeedback: 'Create Feedback',
  typeQuestionHere: 'Type question here',

  // Feedback Response ( admin/src/pages/communication/components/Feedback/components/FeedbackResponse/FeedbackResponse.js )
  feedbackResponse: 'Feedback response',
  noResponsesYet: 'No responses yet',
  responded: 'Responded',
  pending: 'Pending',
  addAnOption: '+ Add an option',
  enterChoicesBelow: 'Enter choices below',

  // Poll ( admin/src/pages/communication/components/Poll/Poll.js )
  createPoll: 'Create Poll',

  // PollOption ( admin/src/pages/communication/components/Poll/components/PollOption/PollOption.js )
  pollOptionResultPercentage: `<0>{{resultPercentage}}%</0>
  <1>{{votes}}
    <0>vote <1></1></0>
  </1>`,

  // PollQuestion ( admin/src/pages/communication/components/Poll/components/PollQuestion/PollQuestion.js )

  // Post Attached File ( admin/src/pages/communication/components/Posts/components/PostAttachedFile.js )
  clickHere: 'Click here',
  toViewFile: 'to view file',
  createdBy: 'Created by:',
  edit: 'Edit',
  clickHereToViewFile: `Click here <0>to view file</0>`,

  // Settings ( admin/src/pages/communication/components/Settings/Settings.js )
  settings: 'Settings',
  identityofRespondentsWillBeHidden: 'Identity of respondents will be hidden',
  allowRespondentsToSeePollResults: 'Allow respondents to see poll results',
  makeSurveyType: `Make <0></0> anonymous`,

  // SortByButton ( admin/src/pages/communication/components/SortByButton/SortByButton.js )
  today: 'Today',
  yesterday: 'Yesterday',
  thisWeek: 'This week',
  thisMonth: 'This month',
  last6Months: 'Last 6 months',
  filterBy: 'Filter by',

  // Hierarchy Chart ( admin/src/pages/communication/components/UserSegment/components/HierarchyChart.js )
  notAssignedToClass: 'Not assigned to a class',
  uncategorisedClassrooms: 'Uncategorised classrooms',

  // User List ( admin/src/pages/communication/components/UserSegment/components/UserList.js )
  addFilter: 'Add Filter',
  clearAll: 'Clear all',

  // Save Draft Modal ( admin/src/pages/communication/components/SaveDraftModal.js )
  closeConfirmationPopupTitle:
    'Are you sure you want to exit without completing?',

  closeConfirmationPopupDesc: 'You may have some unsaved changes',
  continueEditing: 'Continue editing',
  saveAsDraft: 'Save as draft',

  // Announcement Saga ( admin/src/pages/communication/redux/sagas/announcementSaga.js )
  fetchPostsListErrorToast: 'Something went wrong, please check your network',
  communicationCreatedSuccessfully: 'Communication created successfully',
  communicationUpdatedSuccessfully: 'Communication updated successfully',
  communicationDeletedSuccessfully: 'Communication deleted successfully',

  // Duration ( admin/src/pages/communication/components/Duration.js )
  blurCustomDaysErrorShowToastMsg: `You can create a {{COMMUNICATION_TYPE[announcement_type]}} for a maximum of 30 days`,
  selectDurationOfYour: `Select duration of your {{COMMUNICATION_TYPE[announcement_type]}}`,
  enterNumberHere: 'Enter Number Here',

  // constants ( admin/src/pages/communication/constants.js )
  announcementSubtext:
    'Share information with teachers and students through a notification',
  POLL_CREATE_SUBTEXT:
    'Gather opinions from the audience by providing multiple options to choose from',
  feedbackCreateSubtext:
    'Receive helpful insights from teachers and students about tasks, events, actions etc.',
  feedbackSubtext: `Allows you to generate deeper insights from audience as they declare
their preference.`,
  pollSubtext: `Allows you to generate opinion precisely from audience as they vote among multiple options to choose from`,
  channelTitle: 'Choose how will the receiver get this ',
  onlyOneFileUpload: '(Only one file can be uploaded)',

  selectUserSegment: 'Select Receivers',
  askTeacherAndStudentToUpdateTheirApp: `(Please ask Teachers and Students to update their Teachmint app to receive the notification)`,
  customDays: 'Custom Days',
  durationTooltipText:
    'This the time duration which you set for the post to be visible as active post',
}
