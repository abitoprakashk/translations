import axios from 'axios'
import {
  ADMISSION_MANAGEMENT_API_URLS,
  generateUrl,
  getCrmHeaders,
} from '../utils/apis.constants'

// Fetch Admission CRM Settings
export const fetchAllSessionHierarchies = async () => {
  return await axios({
    method: 'GET',
    url: generateUrl(ADMISSION_MANAGEMENT_API_URLS.URL_ALL_SESSION_HIERARCHY),
  })
}

// Fetch Admission CRM Settings
export const fetchAdmissionSettings = async () => {
  return await axios({
    method: 'GET',
    url: generateUrl(ADMISSION_MANAGEMENT_API_URLS.URL_GET_CRM_SETTINGS),
  })
}

// Initiate Admission CRM Settings
export const initiateAdmissionSettings = async () => {
  return await axios({
    method: 'GET',
    headers: getCrmHeaders(),
    url: generateUrl(ADMISSION_MANAGEMENT_API_URLS.URL_INITIATE_CRM_SETTINGS),
  })
}

// Update Admission CRM Settings
export const updateAdmissionSettings = async (data) => {
  return await axios({
    method: 'POST',
    headers: getCrmHeaders(),
    url: generateUrl(ADMISSION_MANAGEMENT_API_URLS.URL_UPDATE_CRM_SETTINGS),
    data,
  })
}

// Delete lead stage
export const deleteLeadStage = async (data) => {
  return await axios({
    method: 'POST',
    headers: getCrmHeaders(),
    url: generateUrl(ADMISSION_MANAGEMENT_API_URLS.URL_DELETE_LEAD_STAGE),
    data,
  })
}

// Check CRM Receipt Prefix Exists or Not
export const checkCrmReceiptPrefix = async (receiptStartingNumber) => {
  return await axios({
    method: 'GET',
    headers: getCrmHeaders(),
    url: generateUrl(
      `${ADMISSION_MANAGEMENT_API_URLS.URL_CHECK_CRM_RECEIPT_PREFIX}?receipt_prefix=${receiptStartingNumber}`
    ),
  })
}

// Check CRM Payment Gateway Configured or Not
export const checkCrmPgKycStatus = async () => {
  return await axios({
    method: 'GET',
    headers: getCrmHeaders(),
    url: generateUrl(ADMISSION_MANAGEMENT_API_URLS.URL_CHECK_PG_KYC_STATUS),
  })
}

//Admission CRM Add New Lead
export const admissionCrmAddLead = async (crmData) => {
  return await axios({
    method: 'POST',
    headers: getCrmHeaders(),
    url: generateUrl(ADMISSION_MANAGEMENT_API_URLS.URL_ADMISSION_CRM_ADD_LEAD),
    data: crmData,
  })
}

//Admission CRM Update Lead
export const crmLeadUpdate = async (data) => {
  return await axios({
    method: 'POST',
    headers: getCrmHeaders(),
    url: generateUrl(
      ADMISSION_MANAGEMENT_API_URLS.URL_ADMISSION_CRM_UPDATE_LEAD
    ),
    data,
  })
}

//Recored Offline Payment
export const recordOfflineFees = async (feesData) => {
  return await axios({
    method: 'POST',
    headers: getCrmHeaders(),
    url: generateUrl(
      ADMISSION_MANAGEMENT_API_URLS.URL_ADMISSION_CRM_OFFLINE_PAYMENT
    ),
    data: feesData,
  })
}

//AdmissionCrm Upload Document
export const uploadDocument = async (data) => {
  return await axios({
    method: 'POST',
    headers: getCrmHeaders(),
    url: generateUrl(
      ADMISSION_MANAGEMENT_API_URLS.URL_ADMISSION_CRM_UPLOAD_DOCUMENT
    ),
    data,
  })
}

// Upload Document on SignedUrl
export const uploadFileToSignedUrl = ({signedUrl, file}) => {
  const fileAxios = axios.create()
  return fileAxios({
    method: 'PUT',
    url: signedUrl,
    withCredentials: false,
    data: file,
  })
}

//Get All Admission CRM Transaction List
export const getTransactionList = async () => {
  return await axios({
    method: 'GET',
    headers: getCrmHeaders(),
    url: generateUrl(
      ADMISSION_MANAGEMENT_API_URLS.URL_GET_ADMISSION_TRANSACTION_LIST
    ),
  })
}

export const getTransactionListWithDate = async (startDate, endDate) => {
  return await axios({
    method: 'GET',
    headers: getCrmHeaders(),
    url: generateUrl(
      ADMISSION_MANAGEMENT_API_URLS.URL_GET_ADMISSION_TRANSACTION_LIST_WITH_DATERANGE,
      {startDate, endDate}
    ),
  })
}

// Get Admission CRM Lead List
export const getLeadList = async () => {
  return await axios({
    method: 'GET',
    headers: getCrmHeaders(),
    url: generateUrl(ADMISSION_MANAGEMENT_API_URLS.URL_GET_ADMISSION_LEAD_LIST),
  })
}

// Get applicable fee structure for specific lead
export const getApplicableFeeStructures = async (leadId) => {
  return await axios({
    method: 'GET',
    headers: getCrmHeaders(),
    url: generateUrl(ADMISSION_MANAGEMENT_API_URLS.URL_GET_FEE_STRUCTURES, {
      leadId,
    }),
  })
}

// Update Lead Stage
export const updateLeadStage = async (data) => {
  return await axios({
    method: 'POST',
    headers: getCrmHeaders(),
    url: generateUrl(ADMISSION_MANAGEMENT_API_URLS.URL_UPDATE_LEAD_STAGE),
    data,
  })
}

export const updateLeadStageFromLeadProfile = async (data) => {
  return await axios({
    method: 'POST',
    headers: getCrmHeaders(),
    url: generateUrl(ADMISSION_MANAGEMENT_API_URLS.URL_UPDATE_LEAD_STAGE),
    data,
  })
}

// Add/Update Follow Up
export const addUpdateFollowups = async (data) => {
  return await axios({
    method: 'POST',
    headers: getCrmHeaders(),
    url: generateUrl(
      data.lead_id
        ? ADMISSION_MANAGEMENT_API_URLS.URL_ADD_FOLLOWUP
        : ADMISSION_MANAGEMENT_API_URLS.URL_UPDATE_FOLLOWUP
    ),
    data,
  })
}

export const getFollowupList = async () => {
  return await axios({
    method: 'GET',
    headers: getCrmHeaders(),
    url: generateUrl(ADMISSION_MANAGEMENT_API_URLS.URL_GET_FOLLOWUP_LIST),
  })
}

export const updateFollowup = async (data) => {
  return await axios({
    method: 'POST',
    headers: getCrmHeaders(),
    url: generateUrl(ADMISSION_MANAGEMENT_API_URLS.URL_UPDATE_FOLLOWUP),
    data,
  })
}

//Get Perticular Transaction Id Receipt Url
export const getFeeReceiptUrl = async (transactionId) => {
  return await axios({
    method: 'GET',
    headers: getCrmHeaders(),
    url: generateUrl(
      ADMISSION_MANAGEMENT_API_URLS.URL_GET_TRANSACTION_RECEIPT_URL,
      {transactionId}
    ),
  })
}

//update Perticular Transaction Id Status
export const refreshTransactionStatus = async (transactionId) => {
  return await axios({
    method: 'GET',
    headers: getCrmHeaders(),
    url: generateUrl(
      ADMISSION_MANAGEMENT_API_URLS.URL_REFRESH_TRANSACTION_STATUS,
      {transactionId}
    ),
  })
}

export const getLeadDetails = async (leadId) => {
  return await axios({
    method: 'GET',
    headers: getCrmHeaders(),
    url: generateUrl(
      `${ADMISSION_MANAGEMENT_API_URLS.URL_GET_CRM_LEAD_DETAILS}?lead_id=${leadId}&followup=true`
    ),
  })
}

export const getFollowups = async (leadId) => {
  return await axios({
    method: 'GET',
    headers: getCrmHeaders(),
    url: generateUrl(
      `${ADMISSION_MANAGEMENT_API_URLS.URL_GET_FOLLOWUP_LIST}?lead_id=${leadId}`
    ),
  })
}

export const getLeadRecentActivity = async (leadId) => {
  return await axios({
    method: 'GET',
    headers: getCrmHeaders(),
    url: generateUrl(
      `${ADMISSION_MANAGEMENT_API_URLS.URL_GET_LEAD_RECENT_ACTIVITY}?lead_id=${leadId}`
    ),
  })
}

export const addFollowUps = async (data) => {
  return await axios({
    method: 'POST',
    headers: getCrmHeaders(),
    url: generateUrl(ADMISSION_MANAGEMENT_API_URLS.URL_ADD_FOLLOW_UP),
    data,
  })
}

export const crmFeeReciept = async (transactionId) => {
  return await axios({
    method: 'GET',
    headers: getCrmHeaders(),
    url: generateUrl(
      `${ADMISSION_MANAGEMENT_API_URLS.URL_ADMISSION_CRM_GET_RECIEPT}?transaction_id=${transactionId}`
    ),
  })
}

export const admissionTransactionListWithSuccess = async ({
  leadId,
  feeType,
}) => {
  return await axios({
    method: 'GET',
    headers: getCrmHeaders(),
    url: generateUrl(
      `${ADMISSION_MANAGEMENT_API_URLS.URL_ADMISSION_CRM_GET_TRANSACTION_LIST_WITH_SUCCESS}?lead_id=${leadId}&status=SUCCESS&fee_type=${feeType}`
    ),
  })
}

export const admissionCrmSendSMS = async (data) => {
  return await axios({
    method: 'POST',
    headers: getCrmHeaders(),
    url: generateUrl(ADMISSION_MANAGEMENT_API_URLS.URL_ADMISSION_CRM_SEND_SMS),
    data,
  })
}

export const admissionCrmDeleteLead = async (leadId) => {
  return await axios({
    method: 'POST',
    headers: getCrmHeaders(),
    url: generateUrl(
      ADMISSION_MANAGEMENT_API_URLS.URL_ADMISSION_CRM_DELETE_LEAD
    ),
    data: {lead_id: leadId},
  })
}

export const admissionCrmSyncAdmissionFee = async (data) => {
  return await axios({
    method: 'POST',
    headers: getCrmHeaders(),
    url: generateUrl(
      ADMISSION_MANAGEMENT_API_URLS.URL_ADMISSION_CRM_SYNC_ADM_FEE
    ),
    data,
  })
}

export const admissionCrmPrintAdmissionForm = async () => {
  return await axios({
    method: 'GET',
    headers: getCrmHeaders(),
    url: generateUrl(ADMISSION_MANAGEMENT_API_URLS.URL_PRINT_ADMISSION_FORM),
  })
}

export const crmPrintAdmissionFormForLead = async (leadId) => {
  return await axios({
    method: 'GET',
    headers: getCrmHeaders(),
    url: generateUrl(
      `${ADMISSION_MANAGEMENT_API_URLS.URL_PRINT_ADMISSION_FORM}?lead_id=${leadId}`
    ),
  })
}

export const crmGetQRCodeUrl = async () => {
  return await axios({
    method: 'GET',
    headers: getCrmHeaders(),
    url: generateUrl(ADMISSION_MANAGEMENT_API_URLS.URL_GET_QR_CODE),
  })
}

export const crmGetQRCodeImageUrl = async () => {
  return await axios({
    method: 'GET',
    headers: getCrmHeaders(),
    url: generateUrl(ADMISSION_MANAGEMENT_API_URLS.URL_GET_QR_CODE_IMAGE),
  })
}
