import React from 'react'
import {lazy, Suspense} from 'react'
import {Redirect, Route, Switch, generatePath} from 'react-router-dom'
import {
  CUSTOM_ID_CARD_ROOT_ROUTE,
  CUSTOM_ID_CARD_SUB_ROUTE,
} from './CustomId.routes'
import Loader from '../../components/Common/Loader/Loader'
import CustomIdLandingPage from './CustomIdLandingPage'
import {useEffect} from 'react'
import {useDispatch} from 'react-redux'
import globalActions from '../../redux/actions/global.actions'
import {IDCARD} from './CustomId.constants'
import {templatePageSettingsActions} from '../../components/TemplateGenerator/redux/TemplateGenerator.actionTypes'
import {useSelector} from 'react-redux'
import PurchaseHistory from './pages/PurchaseHistory/PurchaseHistory'

const IdTemplatesOverview = lazy(() =>
  import('./pages/IdTemplatesOverview/IdTemplatesOverview')
)

const GenerateIdCard = lazy(() =>
  import('./pages/GenerateIdCard/GenerateIdCard')
)

const CreateEditIdTemplate = lazy(() =>
  import('./pages/CreateEditIdTemplate/CreateEditIdTemplate')
)
const ViewAllTemplatesId = lazy(() =>
  import('./pages/ViewAllTemplatesId/ViewAllTemplatesId')
)

const GeneratedIdCards = lazy(() =>
  import('./pages/GeneratedIdCards/GeneratedIdCards')
)

const CustomIDCard = () => {
  const allowUserTypes = ['student', 'staff']
  const dispatch = useDispatch()

  const templateFields = useSelector(
    (store) => store.globalData?.templateFields?.data
  )

  useEffect(() => {
    dispatch(globalActions.templateFields.request(IDCARD))
    dispatch(globalActions.customIdTemplateList.request())
    dispatch(globalActions.idCardAccessoriesConfig.request())
    return () =>
      dispatch({type: templatePageSettingsActions.RESET_PAGE_SETTINGS})
  }, [])

  const defaultRoute = (
    <Redirect
      to={generatePath(CUSTOM_ID_CARD_ROOT_ROUTE, {
        userType: 'student',
      })}
    />
  )

  if (!templateFields) return <Loader show={true} />
  return (
    <Switch>
      <Route
        path={CUSTOM_ID_CARD_ROOT_ROUTE}
        exact
        render={({match}) => {
          if (allowUserTypes.includes(match?.params?.userType))
            return (
              <Suspense fallback={<Loader show={true} />}>
                <CustomIdLandingPage />
              </Suspense>
            )
          return defaultRoute
        }}
      />
      <Route
        exact
        path={CUSTOM_ID_CARD_SUB_ROUTE.GENERATE}
        render={() => (
          <Suspense fallback={<Loader show={true} />}>
            <GenerateIdCard />
          </Suspense>
        )}
      />
      <Route
        exact
        path={CUSTOM_ID_CARD_SUB_ROUTE.OVERVIEW}
        render={() => (
          <Suspense fallback={<Loader show={true} />}>
            <IdTemplatesOverview />
          </Suspense>
        )}
      />
      <Route
        exact
        path={CUSTOM_ID_CARD_SUB_ROUTE.CREATE}
        render={() => (
          <Suspense fallback={<Loader show={true} />}>
            <CreateEditIdTemplate />
          </Suspense>
        )}
      />
      <Route
        exact
        path={CUSTOM_ID_CARD_SUB_ROUTE.EDIT}
        render={() => (
          <Suspense fallback={<Loader show={true} />}>
            <CreateEditIdTemplate />
          </Suspense>
        )}
      />
      <Route
        exact
        path={CUSTOM_ID_CARD_SUB_ROUTE.VIEW_ALL}
        render={() => (
          <Suspense fallback={<Loader show={true} />}>
            <ViewAllTemplatesId />
          </Suspense>
        )}
      />
      <Route
        exact
        path={CUSTOM_ID_CARD_SUB_ROUTE.GENERATED_LIST}
        render={() => (
          <Suspense fallback={<Loader show={true} />}>
            <GeneratedIdCards />
          </Suspense>
        )}
      />
      <Route
        exact
        path={CUSTOM_ID_CARD_SUB_ROUTE.PURCHASE_HISTORY}
        render={() => (
          <Suspense fallback={<Loader show={true} />}>
            <PurchaseHistory />
          </Suspense>
        )}
      />
      {defaultRoute}
    </Switch>
  )
}

export default CustomIDCard
