const base = '/institute/dashboard/fee-reports/'
export const FEE_CUSTOMIZATION_ROUTES = {
  CREATE: {
    fullPath: `${base}custom-reports/create`,
  },
  EDIT: {
    fullPath: `${base}custom-reports/edit/:id`,
  },
  VIEW: {
    fullPath: `${base}custom-reports/view/:id`,
  },
}
