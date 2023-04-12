export const CUSTOM_CERTIFICATE_ROUTE =
  '/institute/dashboard/certificate-templates'

export const CUSTOM_CERTIFICATE_SUB_ROUTES = {
  USER_TYPE: `${CUSTOM_CERTIFICATE_ROUTE}/:userType/`,
  ALL_TYPES_DOC: `${CUSTOM_CERTIFICATE_ROUTE}/:userType/:type/`,
  EDIT: `${CUSTOM_CERTIFICATE_ROUTE}/:userType/:type/edit`,
  CREATE: `${CUSTOM_CERTIFICATE_ROUTE}/:userType/:type/create`,
  SELECT_USER: `${CUSTOM_CERTIFICATE_ROUTE}/:userType/:type/:templateId/user-list/`,
  FILL_DETAILS: `${CUSTOM_CERTIFICATE_ROUTE}/:userType/:type/:templateId/fill-details`,
  GENERATED_LIST: `${CUSTOM_CERTIFICATE_ROUTE}/:userType/generated-list`,
  OLD_CERTIFICATE: `/institute/dashboard/certificate-templates/old-certificate`,
}
