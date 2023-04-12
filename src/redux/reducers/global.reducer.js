import {reportActions} from '../../pages/AttendanceReport/redux/globalAction.report'
import {reducerHandler} from '../../utils/redux.helpers'
import globalActions from '../actions/global.actions'
import {ProfileSettingsReducerMapping} from '../../pages/ProfileSettings/redux/ProfileSettingsReducerMapping'
import {documentUploadReducerMapping} from '../../pages/DocumentUpload/Redux/DocumentActionsReducersMapping'
import {feeCustomizationGlobalActions} from '../../pages/FeeCustomization/redux/feeCustomization.globalAction'

import {biometricActionReducerMapping} from '../../pages/HRMSConfiguration/BiometricAttendance/redux/reducer/actionReducerMapping'

import {GLOBAL_ACTIONS_COMPANY_ACCOUNT} from '../../pages/fee/components/CompanyAndAccount/companyAccConstants'

import {customIdGlobalReducers} from '../../pages/CustomIDCard/redux/CustomId.globalActionsReducers'
import {attendanceShiftActionReducerMapping} from '../../pages/HRMSConfiguration/AttendanceShifts/redux/reducers/shift.reducer'
import {attendanceReducerMapping} from '../../components/Attendance/components/StaffAttendance/redux/reducers/StaffAttendanceReducer'
/*
  Action reducers mapping object
  Key -> Action name as written in global action array (String)
  Value -> Key of reducer in which you have to store particular data
  Eg: {getPublicInstituteInfo: 'publicInstituteInfo'}
*/
const actionReducerMapping = {
  institutePersonaSettings: 'institutePersonaSettings',
  institutePersonaMembers: 'institutePersonaMembers',
  addPersonaMembers: 'addPersonaMembers',
  updatePersonaMembers: 'updatePersonaMembers',
  ...ProfileSettingsReducerMapping,
  ...documentUploadReducerMapping,
  userRolePermission: 'userRolePermission',
  getAllRoles: 'getAllRoles',
  getRoleInfo: 'getRoleInfo',
  assignUserRole: 'assignUserRole',
  createCustomRole: 'createCustomRole',
  deleteCustomRole: 'deleteCustomRole',
  importRole: 'importRole',
  getPermissionMap: 'getPermissionMap',
  // Transport Management
  transportAggregates: 'transportAggregates',
  transportPassengers: 'transportPassengers',
  deleteTransportPassengers: 'deleteTransportPassengers',
  updateUserWiseTransport: 'updateUserWiseTransport',
  transportStops: 'transportStops',
  updateTransportStops: 'updateTransportStops',
  deleteTransportStops: 'deleteTransportStops',
  transportVehicles: 'transportVehicles',
  updateTransportVehicles: 'updateTransportVehicles',
  deleteTransportVehicles: 'deleteTransportVehicles',
  transportStaff: 'transportStaff',
  updateTransportStaff: 'updateTransportStaff',
  deleteTransportStaff: 'deleteTransportStaff',
  fetchSchoolTransportSettings: 'schoolTransportSettings',
  updateSchoolLocation: 'updateSchoolLocation',
  transportRoutes: 'transportRoutes',
  updateTransportRoutes: 'updateTransportRoutes',
  deleteTransportRoutes: 'deleteTransportRoutes',
  transportLiveTracking: 'transportLiveTracking',
  requestTransportGPS: 'requestTransportGPS',
  acknowledgeVehicleSOS: 'acknowledgeVehicleSOS',
  customTemplatePreview: 'customTemplatePreview',
  saveDocumentTemplate: 'saveDocumentTemplate',
  getDocumentImageUploadSignedUrl: 'getDocumentImageUploadSignedUrl',
  storePublicUrlInDB: 'storePublicUrlInDB',
  getImageDirectory: 'getImageDirectory',
  templateList: 'templateList',
  templateDetails: 'templateDetails',
  updateDocumentTemplate: 'updateDocumentTemplate',
  staffList: 'staffList',
  templateFields: 'templateFields',
  customTemplateFieldValues: 'customTemplateFieldValues',
  generateSingleCertificate: 'generateSingleCertificate',
  generatedDocumentStatus: 'generatedDocumentStatus',
  generatedDocuments: 'generatedDocuments',
  bulkCertificateGenerate: 'bulkCertificateGenerate',
  defaultTemplatePreview: 'defaultTemplatePreview',
  submitNPSFormTemplate: 'submitNPSFormTemplate',
  NPSTemplateList: 'NPSTemplateList',
  postDashboardPreference: 'postDashboardPreference',
  getDashboardPreference: 'getDashboardPreference',
  // Admission CRM Actions
  allSessionHierarchies: 'allSessionHierarchies',
  initiateAdmissionCrmSettings: 'initiateCrmSettings',
  getAdmissionCrmSettings: 'admissionCrmSettings',
  updateAdmissionCrmSettings: 'updateAdmissionCrmSettings',
  deleteLeadStage: 'deleteLeadStage',
  checkCrmReceiptPrefix: 'crmReceiptPrefix',
  checkCrmPgKycStatus: 'crmPgKycStatus',
  admissionCrmSettingsProgress: 'admissionCrmSettingsProgress',
  addLead: 'addLead',
  updateLead: 'updateLead',
  createAdmissionCrmOfflinePayment: 'admissionCrmOfflinePayment',
  admissionFormDocument: 'admissionFormDocument',
  transactionList: 'transactionList',
  getLeadList: 'leadList',
  updateLeadStage: 'updateLeadStage',
  getApplicableFeeStructures: 'leadApplicableFeeStructures',
  confirmLeadAdmission: 'confirmLeadAdmission',
  addUpdateFollowups: 'addUpdateFollowups',
  getFeeReceiptUrl: 'getFeeReceiptUrl',
  refreshTransactionStatus: 'refreshTransactionStatus',
  updateFollowups: 'updateFollowups',
  getTransactionListWithStatusSuccess: 'getTransactionListWithStatusSuccess',
  getLeadData: 'leadData',
  getFollowups: 'getFollowups',
  getLeadRecentActivity: 'getLeadRecentActivity',
  addFollowUps: 'addFollowUps',
  updateLeadStageFromLeadProfile: 'updateLeadStageFromLeadProfile',
  getFollowupList: 'getFollowupList',
  getReciept: 'getReciept',
  sendSMS: 'sendSMS',
  deleteLead: 'deleteLead',
  instituteStaffList: 'instituteStaffList',
  ...reportActions,
  customIdPreview: 'customIdPreview',
  saveCustomIdTemplate: 'saveCustomIdTemplate',
  customIdTemplateList: 'customIdTemplateList',
  customIdTemplateDetails: 'customIdTemplateDetails',
  updateCustomIdTemplate: 'updateCustomIdTemplate',
  syncAdmissionFee: 'syncAdmissionFee',
  ...customIdGlobalReducers,
  printAdmissionForm: 'printAdmissionForm',
  printAdmissionFormForLead: 'printAdmissionFormForLead',
  getQrCode: 'getQrCode',
  getQrCodeImage: 'getQrCodeImage',

  // Fees
  getReceiptPrefixesRequest: 'getReceiptPrefixesRequest',
  addStudentAddOnFees: 'addStudentAddOnFees',
  deleteAddOnFee: 'deleteAddOnFee',
  addStudentAddOnDiscount: 'addStudentAddOnDiscount',

  templateGeneratorImageDelete: 'templateGeneratorImageDelete',
  updateStaffAttendance: 'updateStaffAttendance',
  staffMonthlyAttendanceSummary: 'staffMonthlyAttendanceSummary',

  // Admit Card
  getAdmitCardTemplateList: 'getAdmitCardTemplateList',
  getStudentListSectionWise: 'getStudentListSectionWise',
  generateAdmitCards: 'generateAdmitCards',
  bulkDownloadAdmitCard: 'bulkDownloadAdmitCard',
  getAdmitCardDownloadUrl: 'getAdmitCardDownloadUrl',

  //enable teachpay in fee Management
  enableTeachpay: 'enableTeachpay',
  adminToTeachPay: 'adminToTeachPay',
  studentDataSendToTeachPay: 'studentDataSendToTeachPay',
  leaveWidgetData: 'leaveWidgetData',

  ...reportActions,
  ...GLOBAL_ACTIONS_COMPANY_ACCOUNT,
  ...biometricActionReducerMapping,
  ...feeCustomizationGlobalActions,
  feeWidget: 'feeWidget',
  getLatestWidgetAnnouncement: 'getLatestWidgetAnnouncement',
  getSetupProgressWidget: 'getSetupProgressWidget',
  getAttendanceWidgetData: 'getAttendanceWidgetData',

  // Organisation Reducer
  getOrgOverviewDetails: 'orgOverviewDetails',
  getOrgFeeReport: 'orgFeeReport',
  getOrgAdmissionReport: 'orgAdmissionReport',
  getOrgStudentAttendanceReport: 'orgStudentAttendanceReport',
  getOrgStaffAttendanceReport: 'orgStaffAttendanceReport',
  ...attendanceShiftActionReducerMapping,
  ...attendanceReducerMapping,
}

// Initial State
export const initialAsyncState = {
  isLoading: false,
  loaded: false,
  data: null,
  error: null,
}

// Initial Reducer State
const initialState = {}

//  Output -> {
//   publicInstituteInfo: initialAsyncState,
//   adminProfile: initialAsyncState,
//   ....
// }

const orderedReducer = Object.keys(actionReducerMapping)
  .sort()
  .reduce((obj, key) => {
    obj[key] = actionReducerMapping[key]
    return obj
  }, {})
Object.values(orderedReducer).forEach((item) => {
  initialState[item] = initialAsyncState
})

// Global Reducer
// action -> e.g: getUserProfile_REQUEST
export const globalReducers = (state = initialState, action) => {
  const actionParent = String(action.type).split('_')?.[0] // getUserProfile_REQUEST -> getUserProfile
  const actionReducerKey = orderedReducer[actionParent]
  if (actionReducerKey) {
    return {
      ...state,
      [actionReducerKey]: reducerHandler(
        state[actionReducerKey],
        action,
        globalActions[actionParent]
      ),
    }
  }

  return state
}
