import {reportActions} from '../../pages/AttendanceReport/redux/globalAction.report'
import {actionCreator} from '../../utils/redux.helpers'
import {ProfileSettingsActionsMapping} from '../../pages/ProfileSettings/redux/ProfileSettingsActionsMapping'
import {documentUploadActionsMapping} from '../../pages/DocumentUpload/Redux/DocumentActionsReducersMapping'
import {feeCustomizationGlobalActions} from '../../pages/FeeCustomization/redux/feeCustomization.globalAction'
import {GLOBAL_ACTIONS_COMPANY_ACCOUNT} from '../../pages/fee/components/CompanyAndAccount/companyAccConstants'
import {customIdGlobalActions} from '../../pages/CustomIDCard/redux/CustomId.globalActionsReducers'
import {biometricActionsList} from '../../pages/HRMSConfiguration/BiometricAttendance/redux/actions/global.actions'
import {attendanceShiftActionList} from '../../pages/HRMSConfiguration/AttendanceShifts/redux/actions/shift.action'
import {attendanceActionList} from '../../components/Attendance/components/StaffAttendance/redux/actions/StaffAttendanceActions'

/*
  Array of global actions
  Item type -> String
  Eg: 'getPublicInstituteInfo'
*/

const GLOBAL_ACTIONS = [
  'institutePersonaSettings',
  'institutePersonaMembers',
  'addPersonaMembers',
  'updatePersonaMembers',
  ...ProfileSettingsActionsMapping,
  ...documentUploadActionsMapping,
  'userRolePermission',
  'getAllRoles',
  'getRoleInfo',
  'assignUserRole',
  'createCustomRole',
  'deleteCustomRole',
  'importRole',
  'getPermissionMap',
  //Transport Management
  'transportAggregates',
  'transportPassengers',
  'deleteTransportPassengers',
  'updateUserWiseTransport',
  'transportStops',
  'updateTransportStops',
  'deleteTransportStops',
  'transportVehicles',
  'updateTransportVehicles',
  'deleteTransportVehicles',
  'transportStaff',
  'updateTransportStaff',
  'deleteTransportStaff',
  'fetchSchoolTransportSettings',
  'updateSchoolLocation',
  'transportRoutes',
  'updateTransportRoutes',
  'deleteTransportRoutes',
  'transportLiveTracking',
  'requestTransportGPS',
  'acknowledgeVehicleSOS',
  'customTemplatePreview',
  'saveDocumentTemplate',
  'getDocumentImageUploadSignedUrl',
  'storePublicUrlInDB',
  'getImageDirectory',
  'templateList',
  'templateDetails',
  'updateDocumentTemplate',
  'staffList',
  'templateFields',
  'customTemplateFieldValues',
  'generateSingleCertificate',
  'generatedDocumentStatus',
  'generatedDocuments',
  'bulkCertificateGenerate',
  'defaultTemplatePreview',
  'submitNPSFormTemplate',
  'NPSTemplateList',
  'getDashboardPreference',
  'postDashboardPreference',
  ...Object.keys(reportActions),
  ...biometricActionsList,
  // Admission CRM Actions
  'allSessionHierarchies',
  'initiateAdmissionCrmSettings',
  'getAdmissionCrmSettings',
  'updateAdmissionCrmSettings',
  'deleteLeadStage',
  'checkCrmReceiptPrefix',
  'checkCrmPgKycStatus',
  'admissionCrmSettingsProgress',
  'addLead',
  'updateLead',
  'createAdmissionCrmOfflinePayment',
  'admissionFormDocument',
  'transactionList',
  'getLeadList',
  'updateLeadStage',
  'updateLeadStageFromLeadProfile',
  'getApplicableFeeStructures',
  'confirmLeadAdmission',
  'addUpdateFollowups',
  'getFeeReceiptUrl',
  'refreshTransactionStatus',
  'getFollowupList',
  'updateFollowups',
  'getLeadData',
  'getFollowups',
  'getLeadRecentActivity',
  'addFollowUps',
  'getReciept',
  'getTransactionListWithStatusSuccess',
  'sendSMS',
  'deleteLead',
  'getQrCode',
  'getQrCodeImage',
  ...customIdGlobalActions,
  'instituteStaffList',
  'syncAdmissionFee',
  // Fee comapny and account
  ...Object.keys(GLOBAL_ACTIONS_COMPANY_ACCOUNT),
  'printAdmissionForm',
  'printAdmissionFormForLead',
  //Attendance Shifts actions
  ...attendanceShiftActionList,

  //Attendance new apis
  ...attendanceActionList,
  'templateGeneratorImageDelete',
  'updateStaffAttendance',
  'staffMonthlyAttendanceSummary',

  // Fees
  'getReceiptPrefixesRequest',
  'addStudentAddOnFees',
  'deleteAddOnFee',
  'addStudentAddOnDiscount',
  // Admit Card
  'getAdmitCardTemplateList',
  'getStudentListSectionWise',
  'generateAdmitCards',
  'bulkDownloadAdmitCard',
  'getAdmitCardDownloadUrl',
  ...Object.keys(feeCustomizationGlobalActions),
  'getOrgOverviewDetails',
  'getOrgFeeReport',
  'getOrgAdmissionReport',
  'getOrgStudentAttendanceReport',
  'getOrgStaffAttendanceReport',

  // New Dashboard Widgets
  'getLatestWidgetAnnouncement',
  'getSetupProgressWidget',
  //enable teachpay in fee Management
  'enableTeachpay',
  'adminToTeachPay',
  'studentDataSendToTeachPay',
  'feeWidget',
  'leaveWidgetData',

  // New dashbaord widget
  'getAttendanceWidgetData',
]

const globalActions = {}
window.globalaction = globalActions

GLOBAL_ACTIONS.forEach((item) => {
  globalActions[item] = actionCreator(item)
})

export default globalActions
