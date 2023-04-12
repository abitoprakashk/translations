import React from 'react'
import {useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import './SWW.scss'

import AdminDeletedLogout from '../../Home/Logout/AdminDeletedLogout'

export default function SWW() {
  const {errorMessage, showLogoutPopup} = useSelector((state) => state)
  const {t} = useTranslation()

  return (
    <>
      {showLogoutPopup ? <AdminDeletedLogout /> : null}
      <div id="error-occured">
        {errorMessage === 'ERR-035' ? '' : <div>{t('somethingWentWrong')}</div>}
      </div>
    </>
  )
}
