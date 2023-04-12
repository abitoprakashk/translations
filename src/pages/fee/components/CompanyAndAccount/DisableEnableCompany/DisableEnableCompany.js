import React from 'react'
import styles from './DisableEnableCompany.module.css'
import {Popup} from '@teachmint/krayon'
import {useDispatch, useSelector} from 'react-redux'
import {t} from 'i18next'
import globalActions from '../../../../../redux/actions/global.actions'
import {events} from '../../../../../utils/EventsConstants'
import {showSuccessToast} from '../../../../../redux/actions/commonAction'

export default function DisableEnableCompany({
  onClose = () => {},
  companyDetails = {},
}) {
  const dispatch = useDispatch()
  const eventManager = useSelector((state) => state.eventManager)
  const handleDisableEnableBtnClick = () => {
    eventManager.send_event(events.FEE_COMPANY_STATUS_CHANGED_TFI, {
      status: !companyDetails?.disabled ? 'disabled' : 'enabled',
      company_id: companyDetails._id,
      action: 'confirm',
    })
    function failureAction() {
      // do nothing
    }

    function successAction() {
      dispatch(
        showSuccessToast(
          companyDetails?.disabled ? t('companyEnabled') : t('companyDisabled')
        )
      )
      onClose()
    }

    let data = {}
    data._id = companyDetails?._id
    data.disabled = !companyDetails?.disabled

    dispatch(
      globalActions.updateCompanyCA.request(data, successAction, failureAction)
    )
  }

  return (
    <Popup
      actionButtons={[
        {
          body: t('cancel'),
          id: 'cancel-btn',
          onClick: onClose,
          type: 'outline',
        },
        {
          body: companyDetails?.disabled ? t('enable') : t('disable'),
          category: companyDetails?.disabled ? 'constructive' : 'destructive',
          id: 'disable-enable-btn',
          onClick: () => handleDisableEnableBtnClick(),
        },
      ]}
      header={
        companyDetails?.disabled ? t('enableCompany') : t('disableCompany')
      }
      isOpen
      onClose={onClose}
    >
      <div className={styles.popupTextContainer}>
        {!companyDetails?.disabled && (
          <>
            <span className={styles.popupText}>
              {t('disableCompanyPopupText', {name: companyDetails?.name})}
            </span>
            <span className={styles.popupText}>
              {t('disableCompanyPopupText2')}
            </span>
            <span className={styles.popupText}>
              {t('disableCompanyPopupText3')}
            </span>
          </>
        )}
        {companyDetails?.disabled && (
          <span className={styles.popupText}>
            {t('enableCompanyPopupText', {name: companyDetails?.name})}
          </span>
        )}
      </div>
    </Popup>
  )
}
