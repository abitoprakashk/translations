import React, {useState} from 'react'
import {useDispatch} from 'react-redux'
import {showPendingRequestTeacherPageAction} from '../../../redux/actions/commonAction'
import {
  dataByRoute,
  secondaryRouteDetail,
  sidebarData,
  DASHBOARD,
} from '../../../utils/SidebarItems'
import {useLocation, useHistory, Link} from 'react-router-dom'
import SwitchAdmin from './components/SwitchAdmin'
import GlobalSettingsBreadcrumbs from '../../../pages/global-settings/components/GlobalSettingsBreadcrumbs/GlobalSettingsBreadcrumbs'
import {useTranslation} from 'react-i18next'

export default function Header() {
  const {t} = useTranslation()
  const [showNotification, setShowNotification] = useState(false)
  const dispatch = useDispatch()

  window.addEventListener('click', () => {
    if (showNotification) setShowNotification(false)
  })
  let location = useLocation()
  location = location.pathname
  const history = useHistory()
  const getTitle = (url) => {
    if (Object.keys(secondaryRouteDetail).includes(url)) {
      return (
        <div>
          {secondaryRouteDetail[url].path.map(({title, route}) =>
            route ? (
              <span key={route} className="tm-dashboard-header-text">
                <Link to={route}>{title}</Link>
                <span className="tm-color-text-secondary-imp"> / </span>
              </span>
            ) : (
              <span key={title}>{title}</span>
            )
          )}
        </div>
      )
    }

    const regex = /pending-request\/[a-z0-9]/gi
    if (String(url).match(regex))
      return `${String(url).split('/').reverse()[0]} pending request`
    if (dataByRoute[url]) {
      return t(dataByRoute[url])
    }
    let urlStr = url.substr(0, url.lastIndexOf('/'))
    if (dataByRoute[urlStr]) {
      return t(dataByRoute[urlStr])
    }
  }

  const getParentRoute = () => {
    if (location.includes(sidebarData.CLASSROOM_SETTING.route))
      return sidebarData.CLASSROOM_SETTING.route
    else if (location.includes(DASHBOARD)) return DASHBOARD
    return null
  }

  const getHeader = () => {
    const parentRoute = getParentRoute()
    switch (parentRoute) {
      case DASHBOARD:
        return null
      case sidebarData.CLASSROOM_SETTING.route:
        return <GlobalSettingsBreadcrumbs />
      default:
        return (
          <>
            {location !== DASHBOARD && (
              <div className="flex flex-row items-center px-4 py-3 lg:hidden">
                <img
                  className="w-3 h-3"
                  src="https://storage.googleapis.com/tm-assets/icons/blue/left-full-arrow-blue.svg"
                  alt="back"
                  onClick={() => {
                    if (location === sidebarData.SCHOOL_SETUP.route)
                      history.push(DASHBOARD)
                    else history.goBack()
                    dispatch(showPendingRequestTeacherPageAction(false))
                  }}
                />

                <div className="tm-hdg tm-hdg-14 ml-1">
                  {getTitle(location)}
                </div>
              </div>
            )}
          </>
        )
    }
  }

  return (
    <>
      {getHeader()}
      <SwitchAdmin />
    </>
  )
}
