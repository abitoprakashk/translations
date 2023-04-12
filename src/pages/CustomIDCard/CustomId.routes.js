export const CUSTOM_ID_CARD_ROUTE = '/institute/dashboard/idcard'
export const CUSTOM_ID_CARD_ROOT_ROUTE = `${CUSTOM_ID_CARD_ROUTE}/:userType`

export const CUSTOM_ID_CARD_SUB_ROUTE = {
  VIEW_ALL: `${CUSTOM_ID_CARD_ROOT_ROUTE}/all`,
  OVERVIEW: `${CUSTOM_ID_CARD_ROOT_ROUTE}/overview`,
  CREATE: `${CUSTOM_ID_CARD_ROOT_ROUTE}/new`,
  EDIT: `${CUSTOM_ID_CARD_ROOT_ROUTE}/edit/:templateId/:isDefault`,
  GENERATE: `${CUSTOM_ID_CARD_ROOT_ROUTE}/generate/:templateId/:isDefault`,
  GENERATED_LIST: `${CUSTOM_ID_CARD_ROOT_ROUTE}/generated-id-list`,
  PURCHASE_HISTORY: `${CUSTOM_ID_CARD_ROOT_ROUTE}/purchase-history`,
}
