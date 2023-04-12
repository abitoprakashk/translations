import {lazy, Suspense, useEffect} from 'react'
import {Redirect, Route, Switch, generatePath} from 'react-router-dom'
import {CUSTOM_CERTIFICATE_SUB_ROUTES} from './CustomCertificates.routes'
import TemplatesOverview from './pages/TemplatesOverview/TemplatesOverview'
import styles from './CustomCertificate.module.css'
import {useDispatch} from 'react-redux'
import globalActions from '../../redux/actions/global.actions'
import {getGlobalCertificateData} from './redux/CustomCertificate.selectors'
import Loader from '../../components/Common/Loader/Loader'
import classNames from 'classnames'
import {CERTIFICATE} from './CustomCertificate.constants'

const CertificatesLazy = lazy(() =>
  import(
    /* webpackChunkName: "Custom Template" */
    '../Certificates/Certificates'
  )
)

const CreateCertificateLazy = lazy(() =>
  import(
    /* webpackChunkName: "CreateTemplate" */
    './components/CreateTemplate/CreateTemplate'
  )
)
const CreateCertificate = (props) => (
  <Suspense fallback={<Loader show={true} />}>
    <CreateCertificateLazy {...props} />
  </Suspense>
)

const ViewAllTemplatesLazy = lazy(() =>
  import(
    /* webpackChunkName: "ViewAllTemplates" */
    './pages/ViewAllTemplates/ViewAllTemplates'
  )
)
const ViewAllTemplates = (props) => (
  <Suspense fallback={<Loader show={true} />}>
    <ViewAllTemplatesLazy {...props} />
  </Suspense>
)

const StudentStaffListLazy = lazy(() =>
  import(
    /* webpackChunkName: "StudentStaffList" */
    './pages/StudentStaffList/StudentStaffList'
  )
)
const StudentStaffList = (props) => (
  <Suspense fallback={<Loader show={true} />}>
    <StudentStaffListLazy {...props} />
  </Suspense>
)

const FillCertificateDetailsLazy = lazy(() =>
  import('./pages/FillCertificateDetails/FillCertificateDetails')
)

const FillCertificateDetails = (props) => (
  <Suspense fallback={<Loader show={true} />}>
    <FillCertificateDetailsLazy {...props} />
  </Suspense>
)

const GeneratedDocumentsLazy = lazy(() =>
  import('./pages/GeneratedDocuments/GeneratedDocuments')
)

const CustomCertificate = () => {
  // fetch all templates data here
  const allowedUserTypes = ['student', 'staff']
  const allowedDocTypes = ['document', 'certificate']
  const dispatch = useDispatch()
  const {
    templateList: {isLoading, loaded},
  } = getGlobalCertificateData()

  useEffect(() => {
    dispatch(globalActions.templateList.request())
    dispatch(globalActions.staffList.request())
    dispatch(globalActions.templateFields.request(CERTIFICATE))
  }, [])

  const defaultRoute = () => {
    return (
      <Redirect
        to={generatePath(CUSTOM_CERTIFICATE_SUB_ROUTES.USER_TYPE, {
          userType: 'student',
        })}
      />
    )
  }

  return (
    <>
      <Loader show={isLoading} />
      {loaded && (
        <div
          className={classNames(
            styles.desktopContainer,
            'createTemplateContainer'
          )}
        >
          <Switch>
            <Route
              path={CUSTOM_CERTIFICATE_SUB_ROUTES.OLD_CERTIFICATE}
              render={() => (
                <Suspense fallback={<Loader show={true} />}>
                  <CertificatesLazy />
                </Suspense>
              )}
            />
            <Route
              path={CUSTOM_CERTIFICATE_SUB_ROUTES.USER_TYPE}
              render={({match}) => {
                if (allowedUserTypes.includes(match?.params?.userType))
                  return (
                    <div className={styles.wrapper}>
                      <TemplatesOverview />
                    </div>
                  )
                else return defaultRoute()
              }}
              exact
            />
            <Route
              path={CUSTOM_CERTIFICATE_SUB_ROUTES.GENERATED_LIST}
              render={({match}) => {
                if (allowedUserTypes.includes(match?.params?.userType))
                  return (
                    <Suspense fallback={<Loader show={true} />}>
                      <GeneratedDocumentsLazy />
                    </Suspense>
                  )
                else return defaultRoute()
              }}
            />
            <Route
              path={CUSTOM_CERTIFICATE_SUB_ROUTES.ALL_TYPES_DOC}
              exact
              render={({match}) => {
                if (
                  allowedUserTypes.includes(match?.params?.userType) &&
                  allowedDocTypes.includes(match?.params?.type)
                )
                  return (
                    <div className={styles.wrapper}>
                      <ViewAllTemplates />
                    </div>
                  )
                else return defaultRoute()
              }}
            />

            <Route
              path={CUSTOM_CERTIFICATE_SUB_ROUTES.CREATE}
              exact
              render={({match}) => {
                if (
                  allowedUserTypes.includes(match?.params?.userType) &&
                  allowedDocTypes.includes(match?.params?.type)
                )
                  return <CreateCertificate isEdit={false} />
                else return defaultRoute()
              }}
            />

            <Route
              path={CUSTOM_CERTIFICATE_SUB_ROUTES.EDIT}
              exact
              render={({match}) => {
                if (
                  allowedUserTypes.includes(match?.params?.userType) &&
                  allowedDocTypes.includes(match?.params?.type)
                )
                  return <CreateCertificate isEdit={true} />
                else return defaultRoute()
              }}
            />
            <Route
              path={CUSTOM_CERTIFICATE_SUB_ROUTES.SELECT_USER}
              exact
              render={({match}) => {
                if (
                  allowedUserTypes.includes(match?.params?.userType) &&
                  allowedDocTypes.includes(match?.params?.type)
                )
                  return <StudentStaffList />
                else return defaultRoute()
              }}
            />
            <Route
              path={CUSTOM_CERTIFICATE_SUB_ROUTES.FILL_DETAILS}
              exact
              render={({match}) => {
                if (
                  allowedUserTypes.includes(match?.params?.userType) &&
                  allowedDocTypes.includes(match?.params?.type)
                )
                  return <FillCertificateDetails />
                else return defaultRoute()
              }}
            />
            {defaultRoute()}
          </Switch>
        </div>
      )}
    </>
  )
}

export default CustomCertificate
