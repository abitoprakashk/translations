/*
 * All module level API constants should be defined here
 */

import {Trans} from 'react-i18next'
import {generatePath} from 'react-router-dom'
import {REACT_APP_API_URL} from '../../../constants'
import {
  getFromSessionStorage,
  setToSessionStorage,
} from '../../../utils/Helpers'
import {BROWSER_STORAGE_KEYS} from '../../../constants/institute.constants'

export const generateUrl = (url, data) => {
  return `${REACT_APP_API_URL}${generatePath(url, data)}`
}

export const somethingWentWrong = (
  <Trans i18nKey={'somethingWentWrong'}>Something went wrong</Trans>
)

export const apiErrorResponse = {
  status: false,
  msg: somethingWentWrong,
}

export const ACTIVE_CRM_SESSION_ID = 'X-CrmSessionId'

export const getCrmHeaders = () => {
  return {
    [ACTIVE_CRM_SESSION_ID]: getFromSessionStorage(
      BROWSER_STORAGE_KEYS.ACTIVE_CRM_SESSION_ID
    ),
  }
}

export const setCrmHeaders = (sessionId) => {
  setToSessionStorage(BROWSER_STORAGE_KEYS.ACTIVE_CRM_SESSION_ID, sessionId)
}

// All API URLs goes here
export const ADMISSION_MANAGEMENT_API_URLS = {
  URL_ALL_SESSION_HIERARCHY: `institute-class/institute/all/hierarchy`,
  URL_INITIATE_CRM_SETTINGS: `crm-setting/initialize/settings`,
  URL_GET_CRM_SETTINGS: `crm-setting/list`,
  URL_UPDATE_CRM_SETTINGS: `crm-setting/update`,
  URL_DELETE_LEAD_STAGE: `crm-setting/remove/lead/stage`,
  URL_CHECK_CRM_RECEIPT_PREFIX: `crm-fees/receipt/series`,
  URL_CHECK_PG_KYC_STATUS: `crm-fees/kyc/status`,
  URL_ADMISSION_CRM_ADD_LEAD: `crm-lead/add`,
  URL_ADMISSION_CRM_UPDATE_LEAD: `crm-lead/update`,
  URL_ADMISSION_CRM_OFFLINE_PAYMENT: `crm-fees/payment/create`,
  URL_ADMISSION_CRM_UPLOAD_DOCUMENT: `crm-lead/upload/document`,
  URL_GET_ADMISSION_LEAD_LIST: `crm-lead/list`,
  URL_UPDATE_LEAD_STAGE: `crm-lead/update`,
  URL_GET_FEE_STRUCTURES: `crm-fees/user/fee/structure?lead_id=:leadId`,
  URL_ADD_FOLLOWUP: `crm-followup/add`,
  URL_UPDATE_FOLLOWUP: `crm-followup/update`,
  URL_GET_ADMISSION_TRANSACTION_LIST: `crm-fees/transactions/list`,
  URL_GET_ADMISSION_TRANSACTION_LIST_WITH_DATERANGE: `crm-fees/transactions/list?start_date=:startDate&end_date=:endDate`,
  URL_GET_TRANSACTION_RECEIPT_URL: `crm-fees/payment/receipt?transaction_id=:transactionId`,
  URL_REFRESH_TRANSACTION_STATUS: `crm-fees/transaction/status?transaction_id=:transactionId`,
  URL_GET_FOLLOWUP_LIST: `crm-followup/list`,
  URL_GET_CRM_LEAD_DETAILS: `crm-lead/profile`,
  URL_GET_LEAD_RECENT_ACTIVITY: `crm-lead/activity`,
  URL_ADD_FOLLOW_UP: `crm-followup/add`,
  URL_ADMISSION_CRM_GET_RECIEPT: `crm-fees/payment/receipt`,
  URL_ADMISSION_CRM_GET_TRANSACTION_LIST_WITH_SUCCESS: `crm-fees/transactions/list`,
  URL_ADMISSION_CRM_SEND_SMS: `crm-sms/send/dynamic/sms`,
  URL_ADMISSION_CRM_DELETE_LEAD: `crm-lead/remove`,
  URL_ADMISSION_CRM_SYNC_ADM_FEE: `crm-fees/settlement`,
  URL_PRINT_ADMISSION_FORM: `crm-lead/admission/form/url`,
  URL_GET_QR_CODE: `crm-lead/qr/code/url`,
  URL_GET_QR_CODE_IMAGE: `crm-lead/qr/code/image/url`,
}
