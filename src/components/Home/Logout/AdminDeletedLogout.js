import React from 'react'
import {useDispatch} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {
  showErrorOccuredAction,
  showLoadingAction,
  showLogoutPopupAction,
} from '../../../redux/actions/commonAction'
import logoutIcon from '../../../assets/images/icons/popup/logout.svg'
import {utilsLogout} from '../../../routes/login'
import AcknowledgementPopup from '../../Common/AcknowledgementPopup/AcknowledgementPopup'

export default function AdminDeletedLogout() {
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const setShowLogoutPopup = (flag) => dispatch(showLogoutPopupAction(flag))
  const logout = () => {
    dispatch(showLoadingAction(true))
    setShowLogoutPopup(false)

    utilsLogout()
      .then(() => {
        window.localStorage.clear()
        window.sessionStorage.clear()
        window.location.href = 'https://www.teachmint.com/tfi'
      })
      .catch(() => {
        dispatch(showLoadingAction(false))
        dispatch(showErrorOccuredAction(true))
      })
  }
  return (
    <AcknowledgementPopup
      onClose={setShowLogoutPopup}
      onAction={logout}
      icon={logoutIcon}
      title={t('logout')}
      desc={t('logoutAcknowledgementPopupDesc')}
      primaryBtnText={t('ok')}
      closeActive={false}
    />
  )
}
