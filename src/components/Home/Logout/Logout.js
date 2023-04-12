import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {
  logoutUser,
  showErrorOccuredAction,
  showLoadingAction,
  showLogoutPopupAction,
} from '../../../redux/actions/commonAction'
import logoutIcon from '../../../assets/images/icons/popup/logout.svg'
import {utilsLogout} from '../../../routes/login'
import {
  REACT_APP_BASE_URL,
  REACT_APP_TEACHMINT_ACCOUNTS_URL,
} from '../../../constants'
import ConfirmationPopup from '../../Common/ConfirmationPopup/ConfirmationPopup'
import {LOGIN} from '../../../utils/SidebarItems'
import {events} from '../../../utils/EventsConstants'
import {
  deleteAdminSpecificToLocalStorage,
  getFromSessionStorage,
} from '../../../utils/Helpers'
import {BROWSER_STORAGE_KEYS} from '../../../constants/institute.constants'

export default function Logout() {
  const {eventManager} = useSelector((state) => state)
  const dispatch = useDispatch()
  const {t} = useTranslation()

  const setShowLogoutPopup = (flag) => dispatch(showLogoutPopupAction(flag))

  const logout = () => {
    dispatch(showLoadingAction(true))
    setShowLogoutPopup(false)
    const adminUUID = getFromSessionStorage(BROWSER_STORAGE_KEYS.ADMIN_UUID)

    utilsLogout()
      .then(async () => {
        eventManager.send_event(events.LOGOUT_SUCCESSFUL_TFI)
        deleteAdminSpecificToLocalStorage(adminUUID)

        dispatch(logoutUser())
        window.location.href = `${REACT_APP_TEACHMINT_ACCOUNTS_URL}?client_id=tfi&redirect_uri=${REACT_APP_BASE_URL}${String(
          LOGIN
        ).substring(1)}&state=default&scope=all&utype=4&logout=${adminUUID}`
      })
      .catch(() => {
        dispatch(showLoadingAction(false))
        dispatch(showErrorOccuredAction(true))
      })
  }

  return (
    <ConfirmationPopup
      onClose={setShowLogoutPopup}
      onAction={logout}
      icon={logoutIcon}
      title={t('logout')}
      desc={t('logoutConfirmationPopupDesc')}
      primaryBtnText={t('cancel')}
      secondaryBtnText={t('logoutBtnText')}
    />
  )
}
