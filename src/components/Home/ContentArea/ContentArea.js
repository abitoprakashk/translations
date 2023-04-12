import React, {lazy, Suspense, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {Switch, Route, Redirect} from 'react-router-dom'
import {secondaryItems, sidebarData} from '../../../utils/SidebarItems'
import Header from '../Header/Header'
import ErrorBoundary from '../../ErrorBoundary/ErrorBoundary'
import HRMSConfigurationLandingPage from '../../../pages/HRMSConfiguration/HRMSConfigLandingPage'
import PreferrenceSettings from '../../../pages/global-settings/components/settings/PreferrenceSettings'
import {
  checkSubscriptionType,
  getFromSessionStorage,
  setToSessionStorage,
} from '../../../utils/Helpers'
import Loader from '../../Common/Loader/Loader'
import {
  instituteActiveStudentListAction,
  instituteActiveTeacherListAction,
  instituteInActiveStudentListAction,
  instituteInActiveTeacherListAction,
} from '../../../redux/actions/instituteInfoActions'
import {useDispatch} from 'react-redux'
import GetVerloop from '../../../components/Verloop/Verloop'
import Dashboard from '../Dashboard/Dashboard'
import {FEE_CUSTOMIZATION_ROUTES} from '../../../pages/FeeCustomization/constants/feeCustomization.routes.constants'
import StudentManagement from '../../../pages/StudentManagement/StudentManagement'
import TeacherDirectory from '../../../pages/TeacherDirectory/TeacherDirectory'
import history from '../../../history'

const RoleListPage = lazy(() =>
  import('../../../pages/RoleManagement/components/RoleListPage')
)
const ViewRolePage = lazy(() =>
  import('../../../pages/RoleManagement/components/ViewRolePage')
)
const CreateRolePage = lazy(() =>
  import('../../../pages/RoleManagement/components/CreateRolePage')
)
const DetailAttendancePage = lazy(() =>
  import('../../Dashboard/DetailAttendancePage/DetailAttendancePage')
)
const EditInstitute = lazy(() => import('../EditInstitute/EditInstitute'))
const NotFoundPage = lazy(() => import('../../../pages/NotFound/NotFound'))
const UnauthorisedPage = lazy(() => import('../UnauthorisedPage/Unauthorised'))
const UserProfileComponent = lazy(() =>
  import('../../../pages/user-profile/UserProfileComponent')
)
const FeeReports = lazy(() => import('../FeeReports/FeeReports'))
const GlobalSettings = lazy(() =>
  import('../../../pages/global-settings/components/settings/GlobalSettings')
)

const Notification = lazy(() => import('../Notification/Notification'))
const Content = lazy(() => import('../../../pages/contentMvp/Content'))
const Communication = lazy(() =>
  import('../../../pages/communication/Communication')
)
const ContactUs = lazy(() => import('../ContactUs/ContactUs'))
const FeedbackPage = lazy(() => import('../FeedbackPage/FeedbackPage'))
const HelpPage = lazy(() => import('../HelpPage/HelpPage'))
const YearlyCalendar = lazy(() =>
  import('../../../pages/YearlyCalendar/YearlyCalendar')
)
const AdmissionManagement = lazy(() =>
  import('../../../pages/AdmissionManagement/AdmissionManagement')
)
const FeesCompanyAndAccountPage = lazy(() =>
  import('../../../pages/fee/components/FeesPage/FeesCompanyAndAccountPage')
)
const FeesConfigurationPage = lazy(() =>
  import('../../../pages/fee/components/FeesPage/FeesConfigurationPage')
)
const FeeTransactionPage = lazy(() =>
  import('../../../pages/fee/components/FeesPage/FeeTransactionPage')
)
const FeesCollectionPage = lazy(() =>
  import('../../../pages/fee/components/FeesPage/FeesCollectionPage')
)
const FeeReportsOverview = lazy(() =>
  import('../../../pages/fee/components/FeeReports/FeeReports')
)
const RoomPage = lazy(() => import('../HostelManagement/RoomPage'))
const TodaysSchedule = lazy(() => import('../TodaysSchedule/TodaysSchedule'))
const System = lazy(() => import('../System/System'))
const StudentAttendance = lazy(() =>
  import('../../Attendance/components/StudentAttendance/StudentAttendance')
)
const StaffAttendance = lazy(() =>
  import(`../../Attendance/components/StaffAttendance/StaffAttendance`)
)
const AdminPageNew = lazy(() => import('../Admin/AdminPage'))
const LibraryPage = lazy(() => import('../LibraryManagement/LibraryPage'))
const InventoryLandingView = lazy(() =>
  import('../../../pages/Inventory/pages/LandingPage/components/LandingView')
)
const HostelPage = lazy(() => import('../HostelManagement/HostelPage'))
const TransportPage = lazy(() =>
  import('../../../pages/Transport/pages/LandingPage/LandingPage')
)
const WebsiteBuilder = lazy(() => import('../WebsiteBuilder/WebsiteBuilder'))
const ProfileSettings = lazy(() =>
  import('../../../pages/ProfileSettings/ProfileSettings')
)
const CreateFeeCustomizationReport = lazy(() =>
  import(
    /* webpackChunkName: "CreateFeeCustomizationReport" */ '../../../pages/FeeCustomization/pages/CreateReport/CreateFeeCustomizationReport'
  )
)
const LeaveManagement = lazy(() =>
  import(
    /* webpackChunkName: "LeaveManagement" */ '../../../pages/LeaveManagement/LeaveManagement'
  )
)
const IDCard = lazy(() =>
  import(
    /* webpackChunkName: "IDCard" */ '../../../pages/CustomIDCard/CustomIDCardWrapper'
  )
)

const ExamModule = lazy(() =>
  import(
    /* webpackChunkName: "ExamModule" */ '../../../pages/exam-module/ExamModule'
  )
)
const ClassroomReports = lazy(() =>
  import(
    /* webpackChunkName: "classroomReports" */ '../../../pages/classroom-reports/ClassroomReports'
  )
)

const AttendanceReportModule = lazy(() =>
  import('../../../pages/AttendanceReport/AttendanceReportLanding')
)

const CustomCertificate = lazy(() =>
  import(
    /* webpackChunkName: "CustomCertificate" */ '../../../pages/CustomCertificate/CustomCertificateWrapper'
  )
)

const AdmitCard = lazy(() =>
  import(
    /* webpackChunkName: "AdmitCard" */ '../../../pages/AdmitCard/admit-card/AdmitCard'
  )
)

const BillingPage = lazy(() => import('../../../pages/BillingPage/BillingPage'))
const BillingPageStatus = lazy(() =>
  import('../../../pages/BillingPage/components/CheckStatus/CheckStatus')
)

export default function ContentArea() {
  const dispatch = useDispatch()
  const {sidebar, instituteInfo, instituteStudentList, instituteTeacherList} =
    useSelector((state) => state)
  const isMobile = useSelector((state) => state.isMobile)

  useEffect(() => {
    const redirect = getFromSessionStorage('allow_redirect')
    if (redirect) {
      const redirect_url = getFromSessionStorage('post_login_redirect_url')
      if (redirect_url) {
        history.push(redirect_url)
      }
      setToSessionStorage('post_login_redirect_url', '')
      setToSessionStorage('allow_redirect', false)
    }
  }, [])
  useEffect(() => {
    if (instituteStudentList?.length > 0) {
      const active_students = [],
        inactive_students = []
      instituteStudentList.forEach((student) => {
        if (student?.verification_status === 4) {
          inactive_students.push(student)
        } else {
          active_students.push(student)
        }
      })
      dispatch(instituteActiveStudentListAction(active_students))
      dispatch(instituteInActiveStudentListAction(inactive_students))
    } else {
      dispatch(instituteActiveStudentListAction([]))
      dispatch(instituteInActiveStudentListAction([]))
    }
  }, [instituteStudentList])

  useEffect(() => {
    if (instituteTeacherList?.length > 0) {
      const active_teachers = [],
        inactive_teachers = []
      instituteTeacherList.forEach((teacher) => {
        if (teacher?.verification_status === 4) {
          inactive_teachers.push(teacher)
        } else {
          active_teachers.push(teacher)
        }
      })
      dispatch(instituteActiveTeacherListAction(active_teachers))
      dispatch(instituteInActiveTeacherListAction(inactive_teachers))
    } else {
      dispatch(instituteActiveTeacherListAction([]))
      dispatch(instituteInActiveTeacherListAction([]))
    }
  }, [instituteTeacherList])

  const isPremium = checkSubscriptionType(instituteInfo)

  const checkFeatureAuthorization = (subModuleId) => {
    const isPremiumFeature = sidebar?.premiumItems?.has(subModuleId)
    const isfeatureAllowed = sidebar?.allowedMenus?.has(subModuleId)

    if (isPremiumFeature) {
      return isPremium && isfeatureAllowed
    } else {
      return isfeatureAllowed
    }
  }
  // We want to keep the admissions dashboard open when user is coming from ekaakshara admission management solution so we are using that information from local storage
  const isAdmissionOpen =
    sidebar?.allowedMenus?.has(sidebarData.ADMISSION.id) &&
    (isPremium || localStorage.getItem('admission_open') == 'true')
  return (
    <div
      className={
        'tm-bg-light-blue lg:tm-margin-l-1/5 h-full overflow-y-auto show-scrollbar show-scrollbar-big'
      }
    >
      <ErrorBoundary>
        <Header />
        <div className="h-full">
          <ErrorBoundary>
            <Suspense fallback={<Loader />}>
              <Switch>
                {/* Redirection routes */}
                <Route path="/institute/dashboard/cumulative">
                  <Redirect to={sidebarData.DASHBOARD.route} />
                </Route>
                <Route path="/institute/dashboard/comparative">
                  <Redirect to={sidebarData.DASHBOARD.route} />
                </Route>

                {/* public routes , common for all , no permission check */}
                <Route path={sidebarData.HELP.route} component={HelpPage} />
                <Route
                  path={sidebarData.FEEDBACK.route}
                  component={FeedbackPage}
                />
                <Route
                  path={sidebarData.CONTACTUS.route}
                  component={ContactUs}
                />

                <Route
                  exact
                  path={sidebarData.DASHBOARD.route}
                  component={Dashboard}
                />
                {/* protected routes */}
                <Route
                  exact
                  path={sidebarData.MANAGE_SCHOOL.route}
                  component={
                    checkFeatureAuthorization(sidebarData.SCHOOL_SETUP.id)
                      ? System
                      : UnauthorisedPage
                  }
                />
                <Route
                  path={sidebarData.CLASSROOM_ATTENDANCE.route}
                  component={
                    checkFeatureAuthorization(
                      sidebarData.CLASSROOM_ATTENDANCE.id
                    )
                      ? StudentAttendance
                      : UnauthorisedPage
                  }
                />
                <Route
                  path={sidebarData.STAFF_ATTENDANCE.route}
                  component={
                    checkFeatureAuthorization(sidebarData.STAFF_ATTENDANCE.id)
                      ? StaffAttendance
                      : UnauthorisedPage
                  }
                />
                <Route
                  path={sidebarData.ADMIN.route}
                  component={
                    checkFeatureAuthorization(sidebarData.ADMIN.id)
                      ? AdminPageNew
                      : UnauthorisedPage
                  }
                />

                <Route
                  path={sidebarData.PROFILE_SETTINGS.route}
                  component={
                    checkFeatureAuthorization(sidebarData.PROFILE_SETTINGS.id)
                      ? ProfileSettings
                      : UnauthorisedPage
                  }
                />

                <Route
                  path={sidebarData.LIBRARY_MANAGEMENT.route}
                  component={
                    checkFeatureAuthorization(sidebarData.LIBRARY_MANAGEMENT.id)
                      ? LibraryPage
                      : UnauthorisedPage
                  }
                />
                <Route
                  path={sidebarData.INVENTORY_MANAGEMENT.route}
                  component={
                    checkFeatureAuthorization(
                      sidebarData.INVENTORY_MANAGEMENT.id
                    )
                      ? InventoryLandingView
                      : UnauthorisedPage
                  }
                />
                <Route
                  path={sidebarData.HOSTEL_MANAGEMENT.route}
                  component={
                    checkFeatureAuthorization(sidebarData.HOSTEL_MANAGEMENT.id)
                      ? HostelPage
                      : UnauthorisedPage
                  }
                />
                <Route
                  path={sidebarData.HOSTEL_MANAGEMENT.subRoutes[0]}
                  component={
                    checkFeatureAuthorization(sidebarData.HOSTEL_MANAGEMENT.id)
                      ? RoomPage
                      : UnauthorisedPage
                  }
                />
                <Route
                  path={sidebarData.TRANSPORT_MANAGEMENT.route}
                  component={
                    checkFeatureAuthorization(
                      sidebarData.TRANSPORT_MANAGEMENT.id
                    )
                      ? TransportPage
                      : UnauthorisedPage
                  }
                />
                <Route
                  path={sidebarData.HRMS_CONFIGURATION.route}
                  component={
                    checkFeatureAuthorization(
                      'HRMS_CONFIGURATION',
                      'HRMS_CONFIGURATION'
                    )
                      ? HRMSConfigurationLandingPage
                      : UnauthorisedPage
                  }
                />
                <Route
                  path={sidebarData.REPORT_CARD.route}
                  component={
                    checkFeatureAuthorization(sidebarData.REPORT_CARD.id)
                      ? ExamModule
                      : UnauthorisedPage
                  }
                />
                <Route
                  path={sidebarData.WEBSITE_BUILDER.route}
                  component={
                    checkFeatureAuthorization(sidebarData.WEBSITE_BUILDER.id)
                      ? WebsiteBuilder
                      : UnauthorisedPage
                  }
                />
                <Route
                  path={FEE_CUSTOMIZATION_ROUTES.CREATE.fullPath}
                  exact
                  render={(props) =>
                    isMobile ? (
                      <Redirect to={sidebarData.FEE_REPORTS.route} />
                    ) : checkFeatureAuthorization(
                        'FEE_REPORTS',
                        'FEE_REPORTS'
                      ) ? (
                      <CreateFeeCustomizationReport {...props} />
                    ) : (
                      <UnauthorisedPage {...props} />
                    )
                  }
                />

                <Route
                  path={FEE_CUSTOMIZATION_ROUTES.EDIT.fullPath}
                  exact
                  render={(props) =>
                    isMobile ? (
                      <Redirect to={sidebarData.FEE_REPORTS.route} />
                    ) : checkFeatureAuthorization(
                        'FEE_REPORTS',
                        'FEE_REPORTS'
                      ) ? (
                      <CreateFeeCustomizationReport {...props} />
                    ) : (
                      <UnauthorisedPage {...props} />
                    )
                  }
                />

                <Route
                  path={FEE_CUSTOMIZATION_ROUTES.VIEW.fullPath}
                  exact
                  render={(props) =>
                    isMobile ? (
                      <Redirect to={sidebarData.FEE_REPORTS.route} />
                    ) : checkFeatureAuthorization(
                        'FEE_REPORTS',
                        'FEE_REPORTS'
                      ) ? (
                      <CreateFeeCustomizationReport {...props} />
                    ) : (
                      <UnauthorisedPage {...props} />
                    )
                  }
                />

                <Route
                  path="/institute/dashboard/fee-reports/:type"
                  component={
                    checkFeatureAuthorization(sidebarData.FEE_REPORTS.id)
                      ? FeeReports
                      : UnauthorisedPage
                  }
                />

                <Route
                  path={sidebarData.FEE_REPORTS.route}
                  component={
                    checkFeatureAuthorization(sidebarData.FEE_REPORTS.id)
                      ? FeeReportsOverview
                      : UnauthorisedPage
                  }
                />
                <Route
                  path={sidebarData.FEE_COLLECTION.route}
                  component={
                    checkFeatureAuthorization(sidebarData.FEE_COLLECTION.id)
                      ? FeesCollectionPage
                      : UnauthorisedPage
                  }
                />
                <Route
                  path={sidebarData.FEE_CONFIGURATION.route}
                  component={
                    checkFeatureAuthorization(sidebarData.FEE_CONFIGURATION.id)
                      ? FeesConfigurationPage
                      : UnauthorisedPage
                  }
                />
                <Route
                  path={sidebarData.FEE_TRANSACTION.route}
                  component={
                    checkFeatureAuthorization(sidebarData.FEE_TRANSACTION.id)
                      ? FeeTransactionPage
                      : UnauthorisedPage
                  }
                />
                <Route
                  path={sidebarData.FEE_COMPANY_AND_ACCOUNT.route}
                  component={
                    checkFeatureAuthorization(
                      sidebarData.FEE_COMPANY_AND_ACCOUNT.id
                    )
                      ? FeesCompanyAndAccountPage
                      : UnauthorisedPage
                  }
                />
                <Route
                  path={sidebarData.SCHEDULE.route}
                  component={
                    checkFeatureAuthorization(sidebarData.ACADEMICS.id)
                      ? TodaysSchedule
                      : UnauthorisedPage
                  }
                />
                <Route
                  path={sidebarData.ADMISSION.route}
                  component={
                    isAdmissionOpen ? AdmissionManagement : UnauthorisedPage
                  }
                />
                <Route
                  path={sidebarData.YEARLY_CALENDAR.route}
                  component={
                    checkFeatureAuthorization(sidebarData.YEARLY_CALENDAR.id)
                      ? YearlyCalendar
                      : UnauthorisedPage
                  }
                />
                <Route
                  path={sidebarData.CERTIFICATE.route}
                  component={
                    checkFeatureAuthorization(sidebarData.CERTIFICATE.id)
                      ? CustomCertificate
                      : UnauthorisedPage
                  }
                />
                <Route
                  path={sidebarData.ANNOUNCEMENTS.route}
                  component={
                    checkFeatureAuthorization(sidebarData.ANNOUNCEMENTS.id)
                      ? Communication
                      : UnauthorisedPage
                  }
                />
                <Route
                  path={sidebarData.CONTENT_MVP.route}
                  component={
                    checkFeatureAuthorization(sidebarData.CONTENT_MVP.id)
                      ? Content
                      : UnauthorisedPage
                  }
                />
                <Route
                  path={secondaryItems.NOTIFICATION.route}
                  component={Notification}
                />
                <Route
                  path={secondaryItems.ATTENDANCE_MOBILE.route}
                  component={DetailAttendancePage}
                />
                <Route
                  path={secondaryItems.EDIT_USER_DETAILS.route}
                  component={EditInstitute}
                />
                <Route
                  path={secondaryItems.USER_PROFILE.route}
                  component={UserProfileComponent}
                />
                <Route
                  path={sidebarData.CLASSROOM_SETTING.route}
                  component={
                    checkFeatureAuthorization(sidebarData.CLASSROOM_SETTING.id)
                      ? GlobalSettings
                      : UnauthorisedPage
                  }
                />
                <Route
                  path={sidebarData.PREFERENCES.route}
                  component={PreferrenceSettings}
                />
                <Route
                  path={sidebarData.LEAVE_MANAGEMENT.route}
                  component={
                    checkFeatureAuthorization(sidebarData.LEAVE_MANAGEMENT.id)
                      ? LeaveManagement
                      : UnauthorisedPage
                  }
                />
                <Route
                  path={sidebarData.ID_CARD.route}
                  component={
                    checkFeatureAuthorization(sidebarData.ID_CARD.id)
                      ? IDCard
                      : UnauthorisedPage
                  }
                />
                <Route
                  path={sidebarData.ADMIT_CARD.route}
                  component={
                    checkFeatureAuthorization(sidebarData.ADMIT_CARD.id)
                      ? AdmitCard
                      : UnauthorisedPage
                  }
                />
                <Route
                  path={sidebarData.ATTENDANCE_REPORTS.route}
                  component={
                    checkFeatureAuthorization(sidebarData.ATTENDANCE_REPORTS.id)
                      ? AttendanceReportModule
                      : UnauthorisedPage
                  }
                />
                <Route
                  path={sidebarData.CLASSROOM_REPORTS.route}
                  component={
                    checkFeatureAuthorization(sidebarData.CLASSROOM_REPORTS.id)
                      ? ClassroomReports
                      : UnauthorisedPage
                  }
                />
                <Route
                  exact
                  path={sidebarData.USER_ROLE_SETTING.route}
                  component={
                    checkFeatureAuthorization(sidebarData.USER_ROLE_SETTING.id)
                      ? RoleListPage
                      : UnauthorisedPage
                  }
                />
                <Route
                  exact
                  path={sidebarData.USER_ROLE_SETTING.subRoutes[2]}
                  component={
                    checkFeatureAuthorization(sidebarData.USER_ROLE_SETTING.id)
                      ? CreateRolePage
                      : UnauthorisedPage
                  }
                />
                <Route
                  path={sidebarData.USER_ROLE_SETTING.subRoutes[1]}
                  component={
                    checkFeatureAuthorization(sidebarData.USER_ROLE_SETTING.id)
                      ? ViewRolePage
                      : UnauthorisedPage
                  }
                />
                <Route
                  path={sidebarData.TEACHER_DIRECTORY.route}
                  component={
                    checkFeatureAuthorization(sidebarData.TEACHER_DIRECTORY.id)
                      ? TeacherDirectory
                      : UnauthorisedPage
                  }
                />
                <Route
                  path={sidebarData.STUDENT_DIRECTORY.route}
                  component={
                    checkFeatureAuthorization(sidebarData.STUDENT_DIRECTORY.id)
                      ? StudentManagement
                      : UnauthorisedPage
                  }
                />
                <Route
                  exact
                  path={sidebarData.BILLING.route}
                  component={
                    checkFeatureAuthorization(sidebarData.BILLING.id)
                      ? BillingPage
                      : UnauthorisedPage
                  }
                />
                <Route
                  exact
                  path={sidebarData.BILLING.subRoutes[0]}
                  component={
                    checkFeatureAuthorization(sidebarData.BILLING.id)
                      ? BillingPageStatus
                      : UnauthorisedPage
                  }
                />
                <Route component={NotFoundPage} />
              </Switch>
            </Suspense>
          </ErrorBoundary>
          {<GetVerloop isPremium={isPremium} />}
        </div>
      </ErrorBoundary>
    </div>
  )
}
