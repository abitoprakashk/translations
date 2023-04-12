import {Route} from 'react-router-dom'
import ClassList from './components/ClassList/ClassList'
import EditTemplate from './components/EditTemplate/EditTemplateNew'
import REPORT_CARD_ROUTES from './ReportCard.routes'

export default function ReportCard() {
  return (
    <div>
      <Route path={REPORT_CARD_ROUTES.DASHBOARD} exact component={ClassList} />
      <Route path={REPORT_CARD_ROUTES.EDIT_TEMPLATE} component={EditTemplate} />
    </div>
  )
}
