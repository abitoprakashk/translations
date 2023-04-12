import {combineReducers} from 'redux'
import {
  adminInfoReducer,
  rolesListReducer,
  currentAdminInfoReducer,
  sidebarReducer,
} from './adminInfo'
import {feesReducer} from '../../pages/fee/redux/fees.slice'
import {
  showSidebarReducer,
  showLoadingReducer,
  showErrorOccuredReducer,
  showLogoutPopupReducer,
  redirectReducer,
  notificationCountReducer,
  showPendingRequestTeacherPageReducer,
  showEditInstituteDetailsPopupReducer,
  showFeedbackLockPopupReducer,
  showErrorMessageReducer,
  showFreeTrialCongratsReducer,
  showProfileDropdownReducer,
  showNotificationReducer,
  toastDataReducer,
  authReducer,
  switchAdminReducer,
  countryListReducer,
  setIsMobileReducer,
  loadingListReducer,
  showEditSessionReducer,
} from './commonReducer'
import {eventManagerReducer, eventReducer} from './eventManagerReducer'
import {
  instituteListInfoReducer,
  showInstituteListReducer,
  instituteInfoReducer,
  pendingInstituteListInfoReducer,
  instituteStatsReducer,
  instituteTeacherStatsReducer,
  linkPendingRequestsReducer,
  delinkPendingRequestsReducer,
  instituteAllClassesReducer,
  instituteAttendanceReducer,
  instituteTeacherListReducer,
  instituteAdminListReducer,
  kamListReducer,
  instituteStudentListReducer,
  studentListLoadingReducer,
  instituteTodaysScheduleReducer,
  instituteHierarchyReducer,
  instituteAcademicSessionInfoReducer,
  instituteAcademicSessionLoadingReducer,
  instituteAcademicSessionErrorReducer,
  instituteActiveAcademicSessionIdReducer,
  instituteBooksListReducer,
  duplicateStudentListReducer,
  duplicateTeacherListReducer,
  getUnassignedClassTeachersToSectionReducer,
  getPendingStudentListReducer,
  updatePendingClassTeachersReducer,
  getFeeStatisticsReducer,
  instituteActiveStudentListReducer,
  instituteInActiveStudentListReducer,
  instituteActiveTeacherListReducer,
  instituteInActiveTeacherListReducer,
  teacherListLoadingReducer,
  instituteBillingInfoReducer,
} from './instituteInfoReducer'
import {toastsReducer} from './toasts.reducer'
import {
  schoolSystemSectionSelectedReducer,
  schoolSystemScreenSelectedReducer,
} from './schoolSystemReducers'
import communicationReducer from './../../pages/communication/redux/reducers'
import feeCollectionReducer from '../../pages/fee/redux/feeCollectionReducer'
import feeSettingsReducer from '../../pages/fee/redux/feeSettingsReducer'
import globalSettingsReducer from '../../pages/global-settings/redux/GlobalSettingsReducers'
import feeTransacationReducer from '../../pages/fee/redux/feeTransacationReducer'
import feeStructureReducer from '../../pages/fee/redux/feeStructure/feeStructureReducer'
import feeDiscountsReducer from '../../pages/fee/redux/feeDiscountsReducer'
import userProfileReducer from '../../pages/user-profile/redux/reducers'
import {commonActionTypes} from '../actionTypes'
import {
  hostelListReducer,
  hostelInfoReducer,
  hostelRoomsListReducer,
} from './hostelInfoReducer'
import contentMvpReducer from '../../pages/contentMvp/redux/reducers'
import yearlyCalendarReducer from '../../pages/YearlyCalendar/redux/reducers'
import yearlyCalendarBannerReducer from '../../pages/YearlyCalendar/redux/reducers'
import certificateReducer from '../../pages/Certificates/redux/reducers'
import leaveManagementReducer from '../../pages/LeaveManagement/redux/reducers'
import feeReportsReducer from '../../pages/fee/redux/feeReports/feeReportsReducer'
import downloadReportLogReducer from './downloadReportLogReducer'
import pgReducer from '../../pages/fee/redux/reducers/pgReducer'
import {default as popupDataReducer} from '../../pages/Nudge/redux/reducers/popupData'
import reportCardReducer from './../../pages/exam-module/report-card/redux/reducers'
import ExamStructureReducers from '../../pages/exam-module/ExamStructure/Redux/ExamStructureReducers'
import ExamPlannerReducers from '../../pages/YearlyCalendar/components/ExamPlanner/redux/ExamPlannerReducers'
import feeFineReducer from '../../pages/fee/components/Fine/redux/FineReducer'
import StaffAttendanceReducer from '../../components/Attendance/components/StaffAttendance/redux/reducers/StaffAttendanceReducer'
import ProfileSettingsReducer from '../../pages/ProfileSettings/redux/reducers/ProfileSettingsReducer'
import inventoryOverviewReducer from '../../pages/Inventory/pages/Overview/redux/reducers/reducers'
import inventoryPurchaseOrderReducer from '../../pages/Inventory/pages/PurchaseOrders/redux/reducers/reducers'
import inventoryStoresReducer from '../../pages/Inventory/pages/Stores/redux/reducers/reducers'
import {globalReducers} from './global.reducer'
import {calendarItemDeletedReducer} from './sagaEventsDeletedReducers'
import templateGeneratorReducer from '../../components/TemplateGenerator/redux/reducers/TemplateGenerator.reducers'
import editorRef from '../../components/TemplateGenerator/redux/reducers/EditorRefs.reducer'
import dashboardQuickActionsReducer from './dashboardQuickActionReducer'
import studentProfileFeeAndWalletTabReducer from '../../components/SchoolSystem/StudentDirectory/redux/feeAndWallet/reducer'
import attendanceReportReducer from '../../pages/AttendanceReport/redux/AttendanceReportReducer'
import feeCustomizationReducer from '../../pages/FeeCustomization/redux/feeCustomization.reducer'

// organisation Reducer
import {organisationInfoReducer} from './organisationInfoReducer'

const allReducers = {
  isMobile: setIsMobileReducer,
  showSidebar: showSidebarReducer,
  showLoading: showLoadingReducer,
  loadingList: loadingListReducer,
  showEditSession: showEditSessionReducer,
  showErrorOccured: showErrorOccuredReducer,
  showLogoutPopup: showLogoutPopupReducer,
  showFeatureLock: showFeedbackLockPopupReducer,
  redirect: redirectReducer,
  notificationCount: notificationCountReducer,
  showPendingRequestTeacherPage: showPendingRequestTeacherPageReducer,
  showEditInstituteDetailsPopup: showEditInstituteDetailsPopupReducer,
  adminInfo: adminInfoReducer,
  instituteInfo: instituteInfoReducer,
  instituteAcademicSessionInfo: instituteAcademicSessionInfoReducer,
  instituteAcademicSessionLoading: instituteAcademicSessionLoadingReducer,
  instituteAcademicSessionError: instituteAcademicSessionErrorReducer,
  instituteActiveAcademicSessionId: instituteActiveAcademicSessionIdReducer,
  instituteStats: instituteStatsReducer,
  instituteTeacherStats: instituteTeacherStatsReducer,
  linkPendingRequests: linkPendingRequestsReducer,
  delinkPendingRequests: delinkPendingRequestsReducer,
  instituteAllClasses: instituteAllClassesReducer,
  instituteAttendance: instituteAttendanceReducer,
  instituteTeacherList: instituteTeacherListReducer,
  instituteActiveTeacherList: instituteActiveTeacherListReducer,
  instituteInActiveTeacherList: instituteInActiveTeacherListReducer,
  instituteAdminList: instituteAdminListReducer,
  kamList: kamListReducer,
  instituteStudentList: instituteStudentListReducer,
  studentListLoading: studentListLoadingReducer,
  instituteActiveStudentList: instituteActiveStudentListReducer,
  instituteInActiveStudentList: instituteInActiveStudentListReducer,
  instituteTodaysSchedule: instituteTodaysScheduleReducer,
  errorMessage: showErrorMessageReducer,
  eventManager: eventManagerReducer,
  lastEvent: eventReducer,
  showFreeTrialCongrats: showFreeTrialCongratsReducer,
  instituteListInfo: instituteListInfoReducer,
  showInstituteList: showInstituteListReducer,
  showProfileDropdown: showProfileDropdownReducer,
  showNotification: showNotificationReducer,
  fees: feesReducer,
  feeCollection: feeCollectionReducer,
  feeSettings: feeSettingsReducer,
  globalSettings: globalSettingsReducer,
  feeTransactionCollection: feeTransacationReducer,
  feeStructure: feeStructureReducer,
  feeDiscount: feeDiscountsReducer,
  toasts: toastsReducer,
  instituteHierarchy: instituteHierarchyReducer,
  schoolSystemSectionSelected: schoolSystemSectionSelectedReducer,
  schoolSystemScreenSelected: schoolSystemScreenSelectedReducer,
  rolesList: rolesListReducer,
  sidebar: sidebarReducer,
  toastData: toastDataReducer,
  communicationInfo: communicationReducer,
  currentAdminInfo: currentAdminInfoReducer,
  auth: authReducer,
  pendingInstituteListInfo: pendingInstituteListInfoReducer,
  instituteBooksList: instituteBooksListReducer,
  hostelList: hostelListReducer,
  hostelInfo: hostelInfoReducer,
  hostelRoomsList: hostelRoomsListReducer,
  userProfileInfo: userProfileReducer,
  contentMvpInfo: contentMvpReducer,
  yearlyCalendarInfo: yearlyCalendarReducer,
  yearlyCalendarBannerInfo: yearlyCalendarBannerReducer,
  showAdminSwitchPopup: switchAdminReducer,
  certificate: certificateReducer,
  duplicateStudentsList: duplicateStudentListReducer,
  duplicateTeachersList: duplicateTeacherListReducer,
  leaveManagement: leaveManagementReducer,
  feeReports: feeReportsReducer,
  downloadReportLog: downloadReportLogReducer,
  paymentGatewayData: pgReducer,
  popup: popupDataReducer,
  reportCard: reportCardReducer,
  examStructureData: ExamStructureReducers,
  examPlannerData: ExamPlannerReducers,
  getUnassignedClassTeachersToSection:
    getUnassignedClassTeachersToSectionReducer,
  getPendingStudentList: getPendingStudentListReducer,
  updatePendingClassTeachers: updatePendingClassTeachersReducer,
  feeStatistics: getFeeStatisticsReducer,
  feeFine: feeFineReducer,
  staffAttendance: StaffAttendanceReducer,
  profileSettings: ProfileSettingsReducer,
  countryList: countryListReducer,
  inventoryOverview: inventoryOverviewReducer,
  inventoryPurchaseOrder: inventoryPurchaseOrderReducer,
  inventoryStores: inventoryStoresReducer,
  calendarItemDeletedSaga: calendarItemDeletedReducer,
  globalData: globalReducers,
  templateGenerator: templateGeneratorReducer,
  editorRef: editorRef,
  dashboardQuickActions: dashboardQuickActionsReducer,
  studentProfileFeeAndWalletTab: studentProfileFeeAndWalletTabReducer,
  attendanceReportReducer: attendanceReportReducer,
  teacherListLoading: teacherListLoadingReducer,
  instituteBillingInfo: instituteBillingInfoReducer,
  feeCustomization: feeCustomizationReducer,

  // organisation Reducer
  organisationInfo: organisationInfoReducer,
}
// SORT top level reducer keys
const orderedReducer = Object.keys(allReducers)
  .sort()
  .reduce((obj, key) => {
    obj[key] = allReducers[key]
    return obj
  }, {})

const appReducer = combineReducers(orderedReducer)

export const rootReducer = (state, action) => {
  if (action.type === commonActionTypes.LOGOUT_USER) {
    return appReducer(undefined, action)
  }
  return appReducer(state, action)
}
