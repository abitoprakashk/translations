import React, {useEffect, useState} from 'react'
import {t} from 'i18next'
import {useDispatch, useSelector} from 'react-redux'
import {
  Switch,
  Route,
  useRouteMatch,
  matchPath,
  useLocation,
} from 'react-router-dom'
import {Breadcrumb, TabGroup} from '@teachmint/krayon'
import SingleStudentPage from './pages/SingleStudentPage/SingleStudentPage'
import styles from './SingleStudentPageRouting.module.css'
import {sidebarData} from '../../../../utils/SidebarItems'
import DetailedProfilePage from './pages/DetailedProfilePage/DetailedProfilePage'
import DocumentsPage from './pages/DocumentsPage/DocumentsPage'
import history from '../../../../history'
import {
  showLoadingAction,
  showToast,
} from '../../../../redux/actions/commonAction'
import {utilsGetTransportPickup} from '../../../../routes/transport'
import StudentIssuedItemsPage from '../../../Inventory/components/StudentIssuedItemsPage/StudentIssuedItemsPage'
import ClassroomLearningPage from './pages/ClassroomLearningPage/ClassroomLearningPage'

export const SINGLE_STUDENT_PROFILE_ROUTE = `${sidebarData.STUDENT_DIRECTORY.route}/:uid`
export const SINGLE_STUDENT_DETAILED_PROFILE_ROUTE = '/profile'
export const SINGLE_STUDENT_DOCUMENTS_ROUTE = '/documents'
export const SINGLE_STUDENT_ISSUED_ITEMS_ROUTE = '/issued-items'
export const SINGLE_STUDENT_CLASSROOM_LEARNING_ROUTE = '/classroom-learning'

const labelForRoutes = {
  [SINGLE_STUDENT_DETAILED_PROFILE_ROUTE]: 'Profile',
  [SINGLE_STUDENT_DOCUMENTS_ROUTE]: 'Documents',
  [SINGLE_STUDENT_ISSUED_ITEMS_ROUTE]: 'Issued Items',
  [SINGLE_STUDENT_CLASSROOM_LEARNING_ROUTE]: 'Classroom Learning',
}

export default function RouteMapping() {
  const dispatch = useDispatch()
  const [currentStudent, setCurrentStudent] = useState(null)
  const [selectedTab, setSelectedTab] = useState(null)
  const [pickupPointList, setPickupPointList] = useState([])

  let {params} = useRouteMatch()
  let {pathname} = useLocation()

  const {instituteStudentList, instituteInfo} = useSelector((state) => state)

  useEffect(() => {
    if (instituteStudentList) {
      const currentStudentNew = instituteStudentList?.find(
        ({_id}) => _id === params?.uid
      )
      if (currentStudentNew) setCurrentStudent(currentStudentNew)
      else history.push(sidebarData.STUDENT_DIRECTORY.route)
    }
  }, [instituteStudentList, params?.uid])

  useEffect(() => {
    const lastSubroute = '/' + pathname?.split('/')?.reverse()?.[0]
    if (lastSubroute === SINGLE_STUDENT_DETAILED_PROFILE_ROUTE)
      setSelectedTab(1)
    else if (lastSubroute === SINGLE_STUDENT_DOCUMENTS_ROUTE) setSelectedTab(2)
    else setSelectedTab(null)
  }, [pathname])

  const getStudentBaseLink = () =>
    `${sidebarData.STUDENT_DIRECTORY.route}/${params?.uid}`

  const getBreadcrumbPath = () => {
    const paths = [
      {
        label: t('student'),
        onClick: () => history.push(sidebarData.STUDENT_DIRECTORY.route),
      },
      {
        label: `${currentStudent?.name}`,
        onClick: () => history.push(getStudentBaseLink()),
      },
    ]

    if (
      !matchPath(pathname, {
        path: SINGLE_STUDENT_PROFILE_ROUTE,
        exact: true,
        strict: true,
      })
    )
      paths.push({
        label: labelForRoutes['/' + pathname?.split('/')?.reverse()?.[0]] || '',
      })

    return paths
  }

  //Transport Pickup Fetch
  const getTransportPickup = () => {
    dispatch(showLoadingAction(true))
    utilsGetTransportPickup()
      .then(({obj}) => {
        setPickupPointList(obj)
      })
      .catch(() =>
        dispatch(
          showToast({type: 'error', message: t('unableToGetPickupPointList')})
        )
      )
      .finally(() => dispatch(showLoadingAction(false)))
  }

  // Get Transport Pickup
  useEffect(() => {
    getTransportPickup()
  }, [])

  return (
    <div className={styles.wrapper}>
      <Breadcrumb paths={getBreadcrumbPath()} className={styles.breadcrumb} />

      {selectedTab && (
        <div className={styles.tabGroupWrapper}>
          <TabGroup
            showMoreTab={false}
            tabOptions={[
              {
                id: 1,
                label: t('personalInformation'),
                link: `${getStudentBaseLink()}${SINGLE_STUDENT_DETAILED_PROFILE_ROUTE}`,
              },
              {
                id: 2,
                label: t('documents'),
                link: `${getStudentBaseLink()}${SINGLE_STUDENT_DOCUMENTS_ROUTE}`,
              },
            ]}
            selectedTab={selectedTab}
            onTabClick={({link}) => history.push(link)}
          />
        </div>
      )}

      <Switch>
        <Route
          path={SINGLE_STUDENT_PROFILE_ROUTE}
          render={(props) => (
            <SingleStudentPage
              {...props}
              currentStudent={currentStudent}
              instituteType={instituteInfo?.institute_type}
            />
          )}
          exact
        />
        <Route
          path={`${SINGLE_STUDENT_PROFILE_ROUTE}${SINGLE_STUDENT_DETAILED_PROFILE_ROUTE}`}
          render={(props) => (
            <DetailedProfilePage
              {...props}
              currentStudent={currentStudent}
              pickupPointList={pickupPointList}
            />
          )}
          exact
        />

        <Route
          path={`${SINGLE_STUDENT_PROFILE_ROUTE}${SINGLE_STUDENT_DOCUMENTS_ROUTE}`}
          render={(props) => (
            <DocumentsPage {...props} currentStudent={currentStudent} />
          )}
          exact
        />

        <Route
          path={`${SINGLE_STUDENT_PROFILE_ROUTE}${SINGLE_STUDENT_ISSUED_ITEMS_ROUTE}`}
          render={(props) => (
            <StudentIssuedItemsPage
              {...props}
              currentStudent={currentStudent}
            />
          )}
          exact
        />

        <Route
          path={`${SINGLE_STUDENT_PROFILE_ROUTE}${SINGLE_STUDENT_CLASSROOM_LEARNING_ROUTE}`}
          render={(props) => (
            <ClassroomLearningPage {...props} currentStudent={currentStudent} />
          )}
          exact
        />
      </Switch>
    </div>
  )
}
