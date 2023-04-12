import React from 'react'
import styles from './DisableEnableAccount.module.css'
import {Popup} from '@teachmint/krayon'
import {useDispatch, useSelector} from 'react-redux'
import globalActions from '../../../../../../../redux/actions/global.actions'
import {t} from 'i18next'
import {events} from '../../../../../../../utils/EventsConstants'
import {showSuccessToast} from '../../../../../../../redux/actions/commonAction'

export default function DisableEnableAccount({
  onClose = () => {},
  accountDetails = {},
}) {
  const dispatch = useDispatch()
  const eventManager = useSelector((state) => state.eventManager)
  const handleDisableEnableBtnClick = () => {
    eventManager.send_event(events.FEE_ACCOUNT_STATUS_CHANGED_TFI, {
      status: !accountDetails?.disabled ? 'disabled' : 'enabled',
      action: 'confirm',
      account_id: accountDetails?._id,
    })
    function failureAction() {
      // do nothing
    }

    function successAction() {
      dispatch(
        showSuccessToast(
          accountDetails?.disabled ? t('accountEnabled') : t('accountDisabled')
        )
      )
      onClose()
    }

    let data = {}
    data._id = accountDetails?._id
    data.disabled = !accountDetails?.disabled

    dispatch(
      globalActions.updateAccountCA.request(data, successAction, failureAction)
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
          body: accountDetails?.disabled ? t('enable') : t('disable'),
          category: accountDetails?.disabled ? 'constructive' : 'destructive',
          id: 'disable-enable-btn',
          onClick: () => handleDisableEnableBtnClick(),
        },
      ]}
      header={
        accountDetails?.disabled ? t('enableAccount') : t('disableAccount')
      }
      isOpen
      onClose={onClose}
    >
      <div className={styles.popupTextContainer}>
        {!accountDetails?.disabled && (
          <>
            <span className={styles.popupText}>
              {t('disableAccountPopupText', {
                name: accountDetails?.account_name,
              })}
            </span>
            <span className={styles.popupText}>
              {t('disableAccountPopupText2')}
            </span>
          </>
        )}
        {accountDetails?.disabled && (
          <span className={styles.popupText}>
            {t('enableAccountPopupText', {name: accountDetails?.account_name})}
          </span>
        )}
      </div>
    </Popup>
  )
}
