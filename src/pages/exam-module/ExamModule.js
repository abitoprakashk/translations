import {lazy, Suspense} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {useRouteMatch} from 'react-router-dom'
import styles from './ExamModule.module.css'
import classNames from 'classnames'
import {IS_MOBILE} from '../../constants'
import REPORT_CARD_ROUTES from './report-card/ReportCard.routes'

const NewReportCard = lazy(() => import('./report-card/NewReportCard'))

const ExamModule = () => {
  const isEditTemplate = useRouteMatch(REPORT_CARD_ROUTES.EDIT_TEMPLATE)

  return (
    <Switch>
      <Route
        path={[
          REPORT_CARD_ROUTES.EDIT_TEMPLATE,
          REPORT_CARD_ROUTES.SECTION_VIEW,
          REPORT_CARD_ROUTES.BASE_ROUTE,
        ]}
      >
        <div
          className={classNames(styles.krayonContainer, {
            [styles.mobile]: IS_MOBILE,
            [styles.fixedHeight]: isEditTemplate?.isExact,
            ['show-scrollbar show-scrollbar-big']: isEditTemplate?.isExact,
          })}
          id="krayonRCContainer"
        >
          <Suspense fallback="loading...">
            <NewReportCard />
          </Suspense>
        </div>
      </Route>
      <Redirect to={REPORT_CARD_ROUTES.BASE_ROUTE} />
    </Switch>
  )
}

export default ExamModule
