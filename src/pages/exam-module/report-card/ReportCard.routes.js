import {sidebarData} from '../../../utils/SidebarItems'

const BASE_ROUTE = `${sidebarData.REPORT_CARD.route}/reportcard`

const REPORT_CARD_ROUTES = {
  BASE_ROUTE,
  DASHBOARD: `${BASE_ROUTE}/:standardId?`,
  EDIT_TEMPLATE: `${BASE_ROUTE}/:standardId/edit-template/:sectionId?`,
  SECTION_VIEW: `${BASE_ROUTE}/:standardId/:sectionId/section-view`,
  EVALUATION_VIEW: `${BASE_ROUTE}/:standardId/:sectionId/section-view/evaluation`,
}

export default REPORT_CARD_ROUTES
