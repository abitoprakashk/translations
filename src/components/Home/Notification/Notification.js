import React from 'react'
import {useDispatch} from 'react-redux'
import {useTranslation} from 'react-i18next'
import addIcon from '../../../assets/images/icons/add-green.svg'
import removeIcon from '../../../assets/images/icons/minus-red.svg'
import {notificationCountAction} from '../../../redux/actions/commonAction'
import {
  getAdminSpecificFromLocalStorage,
  getUnreadNotificationCount,
  setAdminSpecificToLocalStorage,
} from '../../../utils/Helpers'
import emptyNotificationIcon from '../../../assets/images/dashboard/empty/notification-empty.svg'
import {sidebarData} from '../../../utils/SidebarItems'
import history from '../../../history'
import ErrorBoundary from '../../ErrorBoundary/ErrorBoundary'
import {BROWSER_STORAGE_KEYS} from '../../../constants/institute.constants'

export default function Notification() {
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const getNotifications = () => {
    let data = JSON.parse(
      getAdminSpecificFromLocalStorage(BROWSER_STORAGE_KEYS.ADMIN_NOTIFICATIONS)
    )
    if (data && data.length > 0) {
      data.sort((a, b) => {
        if (a.date > b.date) return -1
        else if (a.date < b.date) return 1
        return 0
      })
    }
    if (data && data.length > 200) data = data.slice(0, 200)

    return data
  }

  const previewNotificationData = () => {
    let notificationData = getNotifications()

    if (notificationData && notificationData.length > 0) {
      return notificationData.map((item) => (
        <div
          key={item.notif_id}
          className="px-3 py-3 bg-white tm-border-radius1 my-3 flex flex-row lg:w-96"
          onClick={() => handleClickNotification(item)}
        >
          <img
            src={
              isRequestTypeAddClassroom(item.request_type)
                ? addIcon
                : removeIcon
            }
            className="w-12 h-12"
            alt="Add"
          />
          <div className="ml-3">
            <div className="tm-h6">
              {isRequestTypeAddClassroom(item.request_type)
                ? t('addClassroom')
                : t('removeClassroom')}
            </div>
            <div className="tm-para2 mt-1">{item.text}</div>
          </div>
        </div>
      ))
    }
    return (
      <div className="flex items-center justify-center flex-col mx-16 mt-32 lg:my-16">
        <img
          src={emptyNotificationIcon}
          alt="Empty"
          className="w-36 h-36 lg:w-24 lg:h-24"
        />
        <div className="tm-para2 mt-4 text-center">{t('youAreUpToDate')}</div>
      </div>
    )
  }

  const handleClickNotification = (obj) => {
    readNotification(obj)
    if (obj.request_type.includes('ADD') || obj.request_type.includes('DELETE'))
      history.push(sidebarData.PENDING_REQUESTS.route)
  }

  const readNotification = (obj) => {
    let data = JSON.parse(
      getAdminSpecificFromLocalStorage(BROWSER_STORAGE_KEYS.ADMIN_NOTIFICATIONS)
    )
    let index = data.findIndex((x) => x.notif_id === obj.notif_id)
    if (index !== -1) {
      data[index].read = true
      if (data[index].storage === 'No') data.splice(index, 1)
    }

    dispatch(notificationCountAction(getUnreadNotificationCount(data)))
    setAdminSpecificToLocalStorage(
      BROWSER_STORAGE_KEYS.ADMIN_NOTIFICATIONS,
      JSON.stringify(data)
    )
  }

  const isRequestTypeAddClassroom = (requestType) => {
    return requestType === 'TEACHMINT_SCHOOL_PENDING_REQUEST_ADD'
  }

  return (
    <>
      <div className="px-4 lg:hidden">{previewNotificationData()}</div>

      <div className="tm-dashboard-notification-dropdown hidden lg:flex min-w-max">
        <div className="arrow"></div>
        <div className="msg-box bg-white w-96 tm-box-shadow1 min-w-max">
          <ErrorBoundary>{previewNotificationData()}</ErrorBoundary>
        </div>
      </div>
    </>
  )
}
