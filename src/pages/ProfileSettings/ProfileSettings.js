import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {useRouteMatch, useLocation} from 'react-router-dom'
import classNames from 'classnames'
import TabNav from '../../components/Common/TabNav/TabNav'
import {
  PROFILE_SETTINGS_ALL_INFO,
  PROFILE_SETTINGS_TABS,
  PROFILE_SETTINGS_URLS,
} from './ProfileSettings.constant'
import {
  categoryURLVerification,
  getActiveClassName,
} from './ProfileSettings.utils'
import MainTitleBar from './components/UICommon/MainTitleBar'
import StudentSettings from './components/StudentSettings/StudentSettings'
import StaffSettings from './components/StaffSettings/StaffSettings'
import CategoryInside from './components/CategoryInside/CategoryInside'
import styles from './ProfileSettings.module.css'

const ProfileSettings = () => {
  let {path} = useRouteMatch()
  const url = (link) => `${path}/${link}`
  const location = useLocation()
  const lastSegment = location.pathname.split('/').pop()
  const activeClass = getActiveClassName(lastSegment)

  const defaultRoute = () => {
    return <Redirect to={url(PROFILE_SETTINGS_URLS.STUDENT_URL)} />
  }

  return (
    <div className={classNames(styles.profileSettingsContainer)}>
      <div className={styles.profileSettingsBody}>
        {/* Profile Settings Routes */}
        <Switch>
          <Route
            exact
            path={url(PROFILE_SETTINGS_URLS.CATEGORY_URL)}
            // component={CategoryInside}
            render={() => {
              if (location && location?.search.trim() !== '') {
                const isCategoryURLVerified = categoryURLVerification(
                  location.search
                )
                if (isCategoryURLVerified) {
                  return <CategoryInside />
                } else {
                  return defaultRoute()
                }
              } else {
                return defaultRoute()
              }
            }}
          />
          <Route>
            <div className={styles.mainHeaderBlock}>
              <MainTitleBar titleInfo={PROFILE_SETTINGS_ALL_INFO.mainTitle} />
            </div>
            <div className={styles.tabMenuContainer}>
              <div className={styles.tabMenuBlock}>
                <nav
                  className={classNames(styles.tabMenu, styles[activeClass])}
                >
                  <TabNav tabs={PROFILE_SETTINGS_TABS} />
                </nav>
                <hr className={styles.divider} />
              </div>
            </div>

            <div className={styles.tabInsideBody}>
              <Switch>
                <Route
                  exact
                  path={url(PROFILE_SETTINGS_URLS.STUDENT_URL)}
                  component={StudentSettings}
                />
                <Route
                  exact
                  path={url(PROFILE_SETTINGS_URLS.STAFF_URL)}
                  component={StaffSettings}
                />
                <Route>
                  <Redirect to={url(PROFILE_SETTINGS_URLS.STUDENT_URL)} />
                </Route>
              </Switch>
            </div>
          </Route>
        </Switch>
      </div>
    </div>
  )
}

export default ProfileSettings
