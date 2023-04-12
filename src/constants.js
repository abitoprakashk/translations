import {isMobile} from '@teachmint/common'

const {
  REACT_APP_API_URL,
  REACT_APP_GOOGLE_RECAPTCHA,
  REACT_ENV_TYPE,
  REACT_APP_TEACHMINT_ACCOUNTS_URL,
  REACT_APP_BASE_URL,
  REACT_APP_TEACHMINT_COMPASS_URL,
  REACT_APP_TINY_EMC_API_KEY,
  REACT_APP_MOENGAGE_DEBUG_LOG,
  REACT_DEFAULT_INS_LOGO,
  REACT_APP_ENABLE_SENTRY,
  REACT_APP_ADMISSION_CRM_DOMAIN,
  REACT_APP_TEACHPAY_DASHBAORD,
  REACT_APP_REGISTER_SERVICEWORKER,
  REACT_APP_RAZORPAY_KEY,
  REACT_APP_PLR_FILE,
  REACT_APP_PRODUCT_FRUITS_KEY,
} = process.env

const PUBLIC_KEY = `
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDpExNNRLSVvV/oF7+/Me7zKdCr
LHqF2cVtnlmwx5b9iMpih25ZNt47S5xuu0Ex4g/oC9O4k2EwXE2M185xriSbLv8m
nADyyIjgU7DXSxmXfMOY5CwilDSy6rP23rCkuDuO2FUnlxpDdoKALm9XNlacyN9W
KKEOALdfUv0vwPX9UwIDAQAB
-----END PUBLIC KEY-----`

const BACKEND_HEADERS = {
  Accept: 'application/json',
}
const IS_MOBILE = isMobile()
const ANDROID_USERAGENT = 'TeachmintAppWebView'
const IOS_USERAGENT = 'IosTeachmintApp'

export {
  REACT_APP_API_URL,
  PUBLIC_KEY,
  REACT_APP_GOOGLE_RECAPTCHA,
  REACT_ENV_TYPE,
  BACKEND_HEADERS,
  REACT_APP_TEACHMINT_ACCOUNTS_URL,
  REACT_APP_BASE_URL,
  IS_MOBILE,
  REACT_APP_TEACHMINT_COMPASS_URL,
  ANDROID_USERAGENT,
  IOS_USERAGENT,
  REACT_APP_TINY_EMC_API_KEY,
  REACT_APP_MOENGAGE_DEBUG_LOG,
  REACT_DEFAULT_INS_LOGO,
  REACT_APP_ENABLE_SENTRY,
  REACT_APP_ADMISSION_CRM_DOMAIN,
  REACT_APP_TEACHPAY_DASHBAORD,
  REACT_APP_REGISTER_SERVICEWORKER,
  REACT_APP_RAZORPAY_KEY,
  REACT_APP_PLR_FILE,
  REACT_APP_PRODUCT_FRUITS_KEY,
}
