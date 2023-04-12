import {all} from 'redux-saga/effects'
import {
  watchFetchTaxonomyData,
  watchFetchContentListData,
  watchReportContent,
  watchRequestContentAccessCheck,
  watchFetchContent,
} from '../../pages/contentMvp/redux/sagas/contentMvpSagas'
import {
  watchCollectFees,
  watchFeeHistory,
  watchFeeReminder,
  watchFetchFeeStats,
  watchFetchStudentDues,
  watchKycStatus,
  watchSearchResults,
  watchSubmitCollectedFees,
  watchCreateMultiplePaymentGateway,
  watchDownloadDemandLetter,
  watchFeeSettingUpdate,
  watchFetchDashboardFeeStatistics,
  watchFetchStudentIdsForFeeReminder,
  watchFeeTransactionReceiptDownloadAndPrint,
  watchCollectBackdatedPayment,
  feeModuleCollectBackDatedPaymentWatchers,
} from '../../pages/fee/redux/feeCollectionSagas'
import {
  watchUpdateDigitalSignatureData,
  watchRemoveSignatureImage,
} from '../../pages/fee/redux/feeSettingsSagas'
import {
  watchFetchGlobalSettings,
  watchUpdateGlobalSettings,
} from '../../pages/global-settings/redux/GlobalSettingsSagas'
import {
  watchFetchFeeTransactionList,
  watchFeeTransactionTimelineStatusData,
  watchFeeTransactionTimelineUpdateStatus,
  watchDownloadFeeTransactionReceipt,
  watchRevokeTransaction,
  watchFetchChequeTransactionList,
  watchRevokeBankTransaction,
  watchRefreshOnlineTransaction,
} from '../../pages/fee/redux/feeTransactionSagas'
import {
  watchCreateDiscount,
  watchDeleteDiscount,
  watchEditDiscount,
  watchFetchDiscounts,
  watchFetchDiscountStudentsList,
  watchUpdateDiscount,
  watchDownloadDiscount,
  watchAdHocStudentListing,
  watchCreateAdHocDiscountReason,
  watchFetchAdHocDiscountList,
  watchDownloadAdHocDiscountReceipt,
  watchDeleteStudentAdHocDiscount,
} from '../../pages/fee/redux/feeDiscountsSagas'
import {
  watchAddNewCustomCategory,
  watchFetchFeeSetting,
  watchFeeStructureDownloadReport,
  watchFetchFeeCategories,
  watchFetchUsedFeeCategories,
  watchFetchFeeStructures,
  watchFetchPreviousSessionDues,
  watchFetchTransportPickupForFeeStructure,
  watchModifyFeeInstallment,
  watchCheckReceiptPrefixExists,
  watchPreviousSessionDues,
  watchImportPreviousSessionDues,
  watchDeleteStudentPreviousSessionDues,
  watchFetchImportedSessionDueData,
  watchFetchFailedSessionTransferTask,
  watchAcknowledgeFailedTask,
  watchModifyPreviousSessionDues,
  watchCreateFeeStructure,
  watchEditFeeStructure,
  watchUpdateFeeStructure,
  watchDeleteFeeStructure,
  watchGetFeeWebinarStatus,
} from '../../pages/fee/redux/feeStructure/feeStructureSagas'

import {
  watchAnnouncementData,
  watchFetchPostsData,
  watchCreateNewCommunication,
  watchUpdateCommunication,
  watchGetUsersList,
  watchFetchFeedbackResponseData,
  watchDraftData,
  watchFeedbackData,
  watchPollData,
  watchFetchUncategorisedClassesData,
  watchDeleteDraftRequest,
  watchSendReminder,
  watchGetPostReceiversList,
  watchRemovePostRequest,
  watchEditCommunicationPostRequest,
  watchFetchSelectedUsersData,
  watchFetchSmsTemplatesData,
  watchfetchSmsUnusedQuota,
  watchSendCommunicationSms,
  watchFetchSmsPreview,
  watchCreateSmsOrder,
  watchVerifySmsRecharge,
} from './../../pages/communication/redux/sagas/announcementSaga'
import {
  watchAddOrUpdateRule,
  watchFetchRulesList,
  watchFetchSchedulerTemplates,
  watchPostToggleRule,
  watchDeleteSchedulerRule,
  watchFetchAutomatedMessages,
  watchToggleRuleInstances,
  watchFetchRuleInstances,
} from './../../pages/communication/redux/sagas/automationSaga'

// Student Dynamic Profile
import {watchStudentProfileSaga} from '../../pages/user-profile/redux/sagas/studentSaga'

import {
  watchAddTeacherProfile,
  watchUpdateTeacherProfile,
  watchDeleteTeacherProfile,
  watchGetTeacherList,
  watchUploadTeacherDP,
} from './../../pages/user-profile/redux/sagas/teacherSaga'

import {
  watchUpdateInstituteProfile,
  watchUploadLogo,
} from './../../pages/user-profile/redux/sagas/instituteSaga'

import {
  watchAddAdminProfile,
  watchUpdateAdminProfile,
  watchDeleteAdminProfile,
  watchGetAdminProfile,
  watchGetAdminList,
} from './../../pages/user-profile/redux/sagas/adminSaga'

import {watchGetSignedUrl} from './../../pages/user-profile/redux/sagas/commonSaga'
import {watchGetUserRolesPermissionV2Saga} from '../../pages/user-profile/redux/sagas/rolesSaga'

import {
  watchGetAllRolesSaga,
  watchGetRoleInfoSaga,
  watchAssignUserRoleSaga,
  watchCreateCustomRoleSaga,
  watchdeleteCustomRoleSaga,
  watchImportRoleSaga,
  watchGetPermissionMapSaga,
} from '../../pages/RoleManagement/redux/sagas/roleManagement.saga'

import {
  watchFetchTabInfoYearlyCalendar,
  watchAddCalendarItem,
  watchDeleteCalendarItem,
  watchFetchCalendarTabInfoYearlyCalendar,
} from '../../pages/YearlyCalendar/redux/sagas/yearlyCalendarSagas'
import {
  watchFetchTabInfoCertificate,
  watchGenerateCertificate,
  watchGetStudentProfileData,
} from '../../pages/Certificates/redux/sagas/certificateSagas'
import {watchLeaveManagemetSaga} from '../../pages/LeaveManagement/redux/saga/adminLeaveManagement.watchersaga'
import {
  watchFetchDownloadReportLog,
  watchFetchPreformanceReport,
  watchSaveReportLog,
} from './reportLog/reportLogSaga'

import {
  watchFetchPgList,
  watchFetchPgFields,
  watchUpdatePgData,
} from '../../pages/fee/redux/sagas/pgSagas'
import {
  watchDownloadAndSaveReport,
  watchFetchavedReports,
  watchFetchInstalmentDateTimestamp,
  watchFetchInstituteFeeTypes,
  watchFetchInstituteFeeData,
  watchFetchInstituteFeeDataStart,
  watchFetchInstituteFeeDataDefaulters,
  watchFetchInstituteTimeStampFeeData,
  watchFetchChequeCountData,
  watchFetchReportData,
} from '../../pages/fee/redux/feeReports/feeReportsSagas'
import {
  watchGetReportCardTemplateFields,
  watchGenerateReportCardTemplate,
  watchGenerateReportCardsForAClass,
  watchGetStudentsOfSection,
  watchGetReportCardTemplates,
  watchStudentExamStructure,
  watchGetExamMarksDetails,
  watchDownloadCurrentMarksheet,
  watchDownloadErrorMarksheet,
  watchValidateCSVdata,
  watchUpdateMarksFromCSV,
  watchSaveAsDraftReportCardTemplate,
  watchGetStudentFields,
} from '../../pages/exam-module/report-card/redux/sagas'

import {
  watchSetExamStructureForClass,
  watchSetClassesExamStructuresList,
  watchImportExamStructureForClass,
  watchAddToTerm,
  watchFetchExamResult,
  watchPostExamStructureForClass,
  watchFetchGradesCriteria,
  watchUpdateGradesCriteria,
  watchImportStatusInfo,
} from '../../pages/exam-module/ExamStructure/Redux/ExamStructuresSagas'

import {
  watchSetExistingExams,
  watchGetSubjectListFromSchedule,
  watchPostExistingExamSchedule,
  watchGetSubjectWithoutStructureList,
} from '../../pages/YearlyCalendar/components/ExamPlanner/redux/ExamPlannerSagas'

import {
  watchDeleteFeeFineRule,
  watchFetchFeeFineRules,
  watchFetchFeeFineStudentListing,
  watchSaveRuleConfiguration,
} from '../../pages/fee/components/Fine/redux/FineSaga'

import {
  watchStaffAttendanceSaga,
  watchFetchAttendanceRequests,
  watchResolveAttendanceRequest,
  watchFetchStaffAttendanceSummary,
  watchFetchNonTeachingStaffAttendance,
  watchFetchTodayNonTeachingStaffAttendance,
} from '../../components/Attendance/components/StaffAttendance/redux/sagas/StaffAttendanceSaga'
import {watchProfileSettingsSaga} from '../../pages/ProfileSettings/redux/saga/ProfileSettingsSaga'

import {
  watchGetAggregateData,
  watchGetAllCategories,
  watchCheckCategoryNameAvailability,
  watchcheckItemNameAvailability,
  watchcreatePrefix,
  watchAddInventoryItem,
  watchDeleteInventoryItemCategory,
  watchDeleteInventoryItem,
  watchUpdateInventoryItemCategory,
  watchUpdateInventoryItem,
  watchUpdateInventoryItemUnitCondition,
  watchgetAllItemsList,
  watchgetSingleItemByID,
  watchAllocateItemsAutomatically,
  watchAllocateItemsManually,
  watchSearchInventoryCategory,
  watchSearchInventoryItem,
  watchGetAllItemsBySearchText,
} from '../../pages/Inventory/pages/Overview/redux/sagas/overViewPageSaga'

import {
  watchAddInventoryPurchaseOrder,
  watchUpdateInventoryPurchaseOrder,
  watchSearchInventoryPurchaseOrderVendor,
  watchGetPurchaseOrderList,
  watchDeletePurchaseOrder,
} from '../../pages/Inventory/pages/PurchaseOrders/redux/sagas/overViewPageSaga'

import {
  watchUpdateInventoryItemStore,
  watchAddInventoryItemStore,
  watchSearchInventoryItemStore,
  watchGetInventoryStoreList,
  watchDeleteInventoryItemStore,
  watchFetchInventoryStoreItemsSaga,
} from '../../pages/Inventory/pages/Stores/redux/sagas/overViewPageSaga'
import {
  watchFetchPopup,
  watchSetPopup,
  watchSetPopupTime,
} from '../../pages/Nudge/redux/sagas/nudgeSagas'
import {watchAttendanceReportSaga} from '../../pages/AttendanceReport/redux/AttendanceReportSaga'
import {watchFetchTodayCollectedFeeData} from './dashboardQuickActions/dashboardQuickActionsSaga'

import {watchGetTemplateData} from './../../pages/communication/redux/sagas/announcementSaga'
import {
  studentProfileFeeTabWatchers,
  watchAddStudentAddOnDiscountRequest,
  watchAddStudentAddOnFeesRequest,
  watchDeleteAddOnFeeRequest,
  watchGetReceiptPrefixesRequest,
} from '../../components/SchoolSystem/StudentDirectory/redux/feeAndWallet/saga'
import {watchInstituteSettingsAndMembers} from '../../pages/InstituteSettings/InstituteSettings.sagas'
import {watchDocumentUpload} from '../../pages/DocumentUpload/Redux/DocumentUpload.sagas'
import {watchTransportStopsSaga} from '../../pages/Transport/redux/sagas/stops.sagas'
import {watchTransportVehiclesSaga} from '../../pages/Transport/redux/sagas/vehicles.sagas'
import {watchTransportStaffSaga} from '../../pages/Transport/redux/sagas/staff.sagas'
import {watchTransportRoutesSaga} from '../../pages/Transport/redux/sagas/transportRoute.sagas'
import {watchTransportUsersSaga} from '../../pages/Transport/redux/sagas/transportUsers.saga'
import {watchTransportMiscellaneousSaga} from '../../pages/Transport/redux/sagas/miscellaneous.sagas'
import {watchNPSTemplate} from '../../components/NPSForm/redux/nps.sagas'
import {watchCustomTemplatePreview} from '../../pages/CustomCertificate/redux/CustomCertificate.saga'
import {watchTemplateFunctions} from '../../components/TemplateGenerator/redux/sagas/TemplateGenerator.saga'
import {watchDashboardPreference} from '../../components/Home/Dashboard/Redux/Sagas/dashboard.saga'
import {watchBiometricMachineSaga} from '../../pages/HRMSConfiguration/BiometricAttendance/redux/sagas/machine.saga'
import {watchBiometricUsersSaga} from '../../pages/HRMSConfiguration/BiometricAttendance/redux/sagas/user.saga'
import {watchBiometricOverviewSaga} from '../../pages/HRMSConfiguration/BiometricAttendance/redux/sagas/overview.saga'
import {watchBiometricSettingsSaga} from '../../pages/HRMSConfiguration/BiometricAttendance/redux/sagas/settings.saga'

import {watchFetchAllSessionHierarchies} from '../../pages/AdmissionManagement/saga/allSessionsHierarchy.saga'
import {
  watchCheckCrmPgKycStatusSaga,
  watchCheckCrmReceiptPrefixSaga,
  watchDeleteLeadStageSaga,
  watchFetchAdmissionSettingsSaga,
  watchInitializeAdmissionSettingsSaga,
  watchUpdateAdmissionSettingsSaga,
  watchAdmissionCrmPrintAdmissionForm,
  watchAdmissionCrmGetQrCode,
  watchAdmissionCrmGetQrCodeImage,
} from '../../pages/AdmissionManagement/saga/onboarding.saga'
import {
  watchAdmissionTransactionList,
  watchFeeRefreshTransactionStatus,
  watchGetReceiptUrl,
} from '../../pages/AdmissionManagement/saga/admissionTransaction.saga'
import {
  watchAdmissionAddLead,
  watchAdmissionUpdateLead,
} from '../../pages/AdmissionManagement/saga/addlead.saga'
import {
  watchConfirmLeadAdmissionSaga,
  watchFetchLeadListSaga,
  watchUpdateLeadStageSaga,
  watchSendSms,
  watchGetApplicableFeeStructuresSaga,
  watchDeleteLead,
  watchSyncAdmissionFee,
  watchPrintAdmissionFormForLead,
} from '../../pages/AdmissionManagement/saga/leads.saga'
import {
  watchAddUpdateFollowupsSaga,
  watchAdmissionUpdateFollowUp,
  watchFetchFollowupListSaga,
  watchGetFollowupsSaga,
} from '../../pages/AdmissionManagement/saga/followups.saga'
import {
  watchGetLeadDetailsSaga,
  watchGetLeadRecentActivitySaga,
  watchUpdateLeadStage,
  watchGetRecieptSaga,
  watchGetTransactionListWithStatusSuccessSaga,
} from '../../pages/AdmissionManagement/saga/leads.saga'

import {watchAdmissionCrmOfflinePayment} from '../../pages/AdmissionManagement/saga/offlinePayment.saga'
import {watchAdmissionCrmUploadDocument} from '../../pages/AdmissionManagement/saga/uploadDocument.saga'
import {watchFeeCustomizationSaga} from '../../pages/FeeCustomization/redux/feeCustomization.saga'
import {
  watchAccountChangeHistoryRequest,
  watchChangeReceiptAccountRequest,
  watchFeeCompanyAccountRequest,
  watchGetAccountPassbookRequest,
} from '../../pages/fee/redux/sagas/companyAccountSaga'
import {watchCustomIdSaga} from '../../pages/CustomIDCard/redux/CustomId.saga'
import {watchStaffListSaga} from '../../utils/CustomHooks/useStaffListHook'
import {
  watchGetStaffShiftSaga,
  watchGetShiftListSaga,
  watchUpdateShiftSaga,
  watchDeleteShiftSaga,
  watchFetchShiftInfoSaga,
  watchFetchShiftQRCode,
  watchDownloadQRCode,
} from '../../pages/HRMSConfiguration/AttendanceShifts/redux/sagas/shift.saga'

import {
  watchGetStudentListSectionWiseSaga,
  watchGetAdmitCardSaga,
  watchGetBulkDownloadAdmitCard,
  watchGetAdmitCardDownloadUrl,
} from '../../pages/AdmitCard/saga/admitCard.saga'
import {watchGetSetupProgressWidget} from '../../components/Dashboard/SetupWidget/setupWidget.sagas'
// Organisation saga
import {
  watchGetOrgOverviewDetailsSaga,
  watchGetOrgFeeReportSaga,
  watchGetOrgAdmissionReportSaga,
  watchGetOrgStudentAttendanceReportSaga,
  watchGetOrgStaffAttendanceReportSaga,
} from '../../pages/GroupOwnerDashboard/redux/sagas/organisation.saga'
import {
  watchAdminToTeachPay,
  watchEnableTeachPay,
  watchStudentDataSendToTeachPay,
} from '../../pages/fee/redux/sagas/enableTeachpay.saga'
import {watchFeeWidgetSaga} from '../../components/Dashboard/FeeWidget/redux/feeWidget.saga'

import {watchLeaveWidget} from '../../components/Dashboard/LeaveWidget/redux/leaveWidget.sagas'

// Add the sagas in this array
const sagasList = [
  watchFetchFeeStats(),
  watchFetchDashboardFeeStatistics(),
  watchSearchResults(),
  watchFetchStudentDues(),
  watchDownloadDemandLetter(),
  watchFeeHistory(),
  watchFeeReminder(),
  watchCollectFees(),
  watchSubmitCollectedFees(),
  watchFetchGlobalSettings(),
  watchUpdateGlobalSettings(),
  // Fee Transacation List
  watchFetchFeeTransactionList(),
  watchFetchChequeTransactionList(),
  watchFeeTransactionTimelineStatusData(),
  watchFeeTransactionTimelineUpdateStatus(),
  watchDownloadFeeTransactionReceipt(),
  watchRevokeTransaction(),
  watchRevokeBankTransaction(),
  watchRefreshOnlineTransaction(),
  // Fee Structure List
  watchFetchFeeStructures(),
  watchFetchPreviousSessionDues(),
  watchCreateFeeStructure(),
  watchEditFeeStructure(),
  watchUpdateFeeStructure(),
  watchDeleteFeeStructure(),
  watchFetchFeeCategories(),
  watchFetchUsedFeeCategories(),
  watchModifyFeeInstallment(),
  watchCheckReceiptPrefixExists(),
  watchPreviousSessionDues(),
  watchImportPreviousSessionDues(),
  watchDeleteStudentPreviousSessionDues(),
  watchFetchImportedSessionDueData(),
  watchFetchFailedSessionTransferTask(),
  watchAcknowledgeFailedTask(),
  watchModifyPreviousSessionDues(),
  watchFeeStructureDownloadReport(),
  // Fees Discount
  watchFetchDiscounts(),
  watchCreateDiscount(),
  watchEditDiscount(),
  watchUpdateDiscount(),
  watchDeleteDiscount(),
  watchFetchDiscountStudentsList(),
  watchDownloadDiscount(),
  // Fee KYC Status
  watchKycStatus(),
  watchCreateMultiplePaymentGateway(),
  watchFeeSettingUpdate(),
  watchDraftData(),
  watchAnnouncementData(),
  watchFetchPostsData(),
  watchCreateNewCommunication(),
  watchUpdateCommunication(),
  watchGetUsersList(),
  watchFetchFeedbackResponseData(),
  watchFeedbackData(),
  watchPollData(),
  watchFetchUncategorisedClassesData(),
  watchDeleteDraftRequest(),
  watchUpdateDigitalSignatureData(),
  watchRemoveSignatureImage(),

  // Student Dynamic Profile
  watchStudentProfileSaga(),

  watchAddTeacherProfile(),
  watchUpdateTeacherProfile(),
  watchDeleteTeacherProfile(),
  watchFetchTaxonomyData(),
  watchFetchContentListData(),
  watchReportContent(),
  watchRequestContentAccessCheck(),
  watchFetchContent(),
  watchFetchTabInfoYearlyCalendar(),
  watchFetchCalendarTabInfoYearlyCalendar(),
  watchAddCalendarItem(),
  watchDeleteCalendarItem(),
  watchFetchTabInfoCertificate(),
  watchGenerateCertificate(),
  watchGetTeacherList(),
  watchFetchFeeSetting(),
  watchFetchTransportPickupForFeeStructure(),
  watchUpdateInstituteProfile(),
  watchUploadLogo(),
  watchGetStudentProfileData(),
  watchAddNewCustomCategory(),
  watchFetchPgList(),
  watchFetchPgFields(),
  watchUpdatePgData(),
  watchAddAdminProfile(),
  watchGetAdminProfile(),
  watchUpdateAdminProfile(),
  watchDeleteAdminProfile(),
  watchUploadTeacherDP(),
  watchLeaveManagemetSaga(),
  watchSaveReportLog(),
  watchFetchDownloadReportLog(),
  watchFetchPreformanceReport(),
  watchGetAdminList(),
  watchGetSignedUrl(),
  // Exam Structure List
  watchSetExamStructureForClass(),
  watchImportExamStructureForClass(),
  watchSetClassesExamStructuresList(),
  watchAddToTerm(),
  watchFetchExamResult(),
  watchPostExamStructureForClass(),
  watchDownloadCurrentMarksheet(),
  watchDownloadErrorMarksheet(),
  watchUpdateMarksFromCSV(),
  watchValidateCSVdata(),
  watchImportStatusInfo(),

  // Exam Planner
  watchSetExistingExams(),
  watchPostExistingExamSchedule(),

  // Staff Attendance
  watchStaffAttendanceSaga(),
  watchFetchAttendanceRequests(),
  watchResolveAttendanceRequest(),
  watchFetchStaffAttendanceSummary(),
  watchFetchNonTeachingStaffAttendance(),
  watchFetchTodayNonTeachingStaffAttendance(),

  // Profile Settings
  watchProfileSettingsSaga(),

  watchFetchReportData(),
  watchDownloadAndSaveReport(),
  watchFetchInstituteFeeTypes(),
  watchFetchInstalmentDateTimestamp(),
  watchFetchavedReports(),
  watchFetchInstituteFeeData(),
  watchFetchInstituteFeeDataStart(),
  watchFetchInstituteFeeDataDefaulters(),
  watchFetchChequeCountData(),
  watchFetchInstituteTimeStampFeeData(),
  watchFetchPopup(),
  watchSetPopup(),
  watchSetPopupTime(),
  watchGetReportCardTemplateFields(),
  watchGenerateReportCardTemplate(),
  watchGenerateReportCardsForAClass(),
  watchGetStudentsOfSection(),
  // watchGetStudentsOfSection123(),
  watchGetReportCardTemplates(),
  watchGetExamMarksDetails(),
  watchStudentExamStructure(),
  watchGetSubjectListFromSchedule(),
  watchAdHocStudentListing(),
  watchCreateAdHocDiscountReason(),
  watchFetchAdHocDiscountList(),
  watchDownloadAdHocDiscountReceipt(),
  watchDeleteStudentAdHocDiscount(),
  watchFetchFeeFineRules(),
  watchSaveRuleConfiguration(),
  watchFetchFeeFineStudentListing(),
  watchDeleteFeeFineRule(),
  //Inventory Sagas
  watchGetAggregateData(),
  watchGetAllCategories(),
  watchCheckCategoryNameAvailability(),
  watchcheckItemNameAvailability(),
  watchcreatePrefix(),
  watchAddInventoryItem(),
  watchSearchInventoryCategory(),
  watchSearchInventoryItem(),
  watchDeleteInventoryItemCategory(),
  watchDeleteInventoryItem(),
  watchUpdateInventoryItemCategory(),
  watchUpdateInventoryItem(),
  watchUpdateInventoryItemUnitCondition(),
  watchAddInventoryItemStore(),
  watchSearchInventoryItemStore(),
  watchGetInventoryStoreList(),
  watchDeleteInventoryItemStore(),
  watchAddInventoryPurchaseOrder(),
  watchUpdateInventoryPurchaseOrder(),
  watchSearchInventoryPurchaseOrderVendor(),
  watchgetAllItemsList(),
  watchUpdateInventoryItemStore(),
  watchFetchInventoryStoreItemsSaga(),
  watchGetPurchaseOrderList(),
  watchDeletePurchaseOrder(),
  watchgetSingleItemByID(),
  watchAllocateItemsAutomatically(),
  watchAllocateItemsManually(),
  watchGetAllItemsBySearchText(),
  watchGetFeeWebinarStatus(),
  watchFetchGradesCriteria(),
  watchUpdateGradesCriteria(),
  watchFetchStudentIdsForFeeReminder(),
  watchFeeTransactionReceiptDownloadAndPrint(),
  watchGetSubjectWithoutStructureList(),
  watchAttendanceReportSaga(),
  watchCustomTemplatePreview(),
  watchTemplateFunctions(),
  watchGetTemplateData(),
  watchFetchTodayCollectedFeeData(),
  ...studentProfileFeeTabWatchers,
  watchTransportVehiclesSaga(),
  watchSendReminder(),
  watchInstituteSettingsAndMembers(),
  watchTransportStopsSaga(),
  watchTransportStaffSaga(),
  watchTransportRoutesSaga(),
  watchTransportUsersSaga(),
  watchTransportMiscellaneousSaga(),
  watchNPSTemplate(),
  watchGetPostReceiversList(),
  watchDocumentUpload(),

  // User roles and permission
  watchGetUserRolesPermissionV2Saga(),
  watchGetAllRolesSaga(),
  watchGetRoleInfoSaga(),
  watchAssignUserRoleSaga(),
  watchCreateCustomRoleSaga(),
  watchdeleteCustomRoleSaga(),
  watchImportRoleSaga(),
  watchGetPermissionMapSaga(),

  watchGetSubjectWithoutStructureList(),
  watchRemovePostRequest(),
  watchEditCommunicationPostRequest(),
  watchFetchSelectedUsersData(),
  watchCollectBackdatedPayment(),

  ...feeModuleCollectBackDatedPaymentWatchers,
  watchFetchSmsTemplatesData(),
  watchfetchSmsUnusedQuota(),
  watchSendCommunicationSms(),
  watchFetchSmsPreview(),
  // dashboard preference
  watchDashboardPreference(),

  watchBiometricMachineSaga(),
  watchBiometricUsersSaga(),
  watchBiometricOverviewSaga(),
  watchBiometricSettingsSaga(),

  watchCreateSmsOrder(),
  watchVerifySmsRecharge(),

  // Admission CRM
  watchFetchAllSessionHierarchies(),
  watchFetchAdmissionSettingsSaga(),
  watchInitializeAdmissionSettingsSaga(),
  watchUpdateAdmissionSettingsSaga(),
  watchDeleteLeadStageSaga(),
  watchCheckCrmReceiptPrefixSaga(),
  watchCheckCrmPgKycStatusSaga(),
  watchAdmissionAddLead(),
  watchAdmissionUpdateLead(),
  watchAdmissionCrmOfflinePayment(),
  watchAdmissionCrmUploadDocument(),
  watchAdmissionTransactionList(),
  watchFetchLeadListSaga(),
  watchUpdateLeadStageSaga(),
  watchGetApplicableFeeStructuresSaga(),
  watchConfirmLeadAdmissionSaga(),
  watchAddUpdateFollowupsSaga(),
  watchFeeRefreshTransactionStatus(),
  watchGetReceiptUrl(),
  watchFetchFollowupListSaga(),
  watchAdmissionUpdateFollowUp(),
  watchGetFollowupsSaga(),
  watchGetLeadDetailsSaga(),
  watchGetLeadRecentActivitySaga(),
  watchUpdateLeadStage(),
  watchGetRecieptSaga(),
  watchGetTransactionListWithStatusSuccessSaga(),
  watchSendSms(),
  watchDeleteLead(),
  watchCustomIdSaga(),
  watchStaffListSaga(),
  watchSyncAdmissionFee(),
  watchAdmissionCrmGetQrCode(),
  watchAdmissionCrmGetQrCodeImage(),

  // Fee company and account
  watchFeeCompanyAccountRequest(),
  watchGetAccountPassbookRequest(),
  watchChangeReceiptAccountRequest(),
  watchAccountChangeHistoryRequest(),
  watchAdmissionCrmPrintAdmissionForm(),
  watchPrintAdmissionFormForLead(),
  watchAddOrUpdateRule(),
  watchFetchRulesList(),
  watchFetchSchedulerTemplates(),
  watchPostToggleRule(),
  watchDeleteSchedulerRule(),
  watchFetchAutomatedMessages(),
  watchFetchRuleInstances(),
  watchToggleRuleInstances(),

  // Fees
  watchGetReceiptPrefixesRequest(),
  watchAddStudentAddOnFeesRequest(),
  watchDeleteAddOnFeeRequest(),
  watchAddStudentAddOnDiscountRequest(),

  // TeachPay
  watchEnableTeachPay(),
  watchAdminToTeachPay(),
  watchStudentDataSendToTeachPay(),

  //Attendance Shifts
  watchGetStaffShiftSaga(),
  watchGetShiftListSaga(),
  watchUpdateShiftSaga(),
  watchDeleteShiftSaga(),
  watchFetchShiftInfoSaga(),
  watchFetchShiftQRCode(),
  watchDownloadQRCode(),

  // Admit Card
  watchGetStudentListSectionWiseSaga(),
  watchGetAdmitCardSaga(),
  watchGetBulkDownloadAdmitCard(),
  watchGetAdmitCardDownloadUrl(),

  //edit template report card
  watchSaveAsDraftReportCardTemplate(),
  watchGetStudentFields(),

  watchFeeCustomizationSaga(),
  watchFeeWidgetSaga(),
  watchLeaveWidget(),

  // New Dashbaord Widgets
  watchGetSetupProgressWidget(),

  // Organisation saga
  watchGetOrgOverviewDetailsSaga(),
  watchGetOrgFeeReportSaga(),
  watchGetOrgAdmissionReportSaga(),
  watchGetOrgStudentAttendanceReportSaga(),
  watchGetOrgStaffAttendanceReportSaga(),
]

// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield all(sagasList)
}
