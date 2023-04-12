import {Icon} from '@teachmint/common'
import {t} from 'i18next'
import styles from './closeSliderConfirmPopUp.module.css'
import classNames from 'classnames'
import React from 'react'

export default function CloseSliderConfirmPopup({onClose, onAction}) {
  const closeConfirmObject = {
    onClose: onClose,
    onAction: onAction,
    icon: <Icon name="inactive" size="4xl" color="error" type="filled" />,
    title: t('closeConfirmationPopupTitleInventory'),
    desc: t('closeConfirmationPopupDesc'),
    primaryBtnText: t('btnTextYesExit'),
    secondaryBtnText: t('btnTextContinueEditing'),
    closeOnBackgroundClick: false,
  }
  return (
    <div className={styles.closeConfirmPopupWrapper}>
      <ConfirmationPopupInventory {...closeConfirmObject} />
    </div>
  )
}
const ConfirmationPopupInventory = ({
  onClose,
  onAction,
  icon = null,
  title,
  desc,
  primaryBtnText,
  primaryBtnStyle,
  secondaryBtnText,
  secondaryBtnStyle = '',
  iconClassName = '',
  hideButtons = false,
  closeOnBackgroundClick = true,
}) => {
  return (
    <div
      className="tm-popup-bg z-20 flex items-center justify-center"
      onClick={() => closeOnBackgroundClick && onClose(false)}
    >
      <div
        className="w-11/12 bg-white p-6 tm-border-radius1 lg:w-6/12 lg:p-12"
        onClick={(e) => e.stopPropagation()}
      >
        {icon ? (
          typeof icon == 'object' ? (
            <div
              className={classNames('w-20 h-20 flex mx-auto', iconClassName)}
            >
              {icon}
            </div>
          ) : (
            <img className="w-20 h-20 flex mx-auto" src={icon} alt="Icon" />
          )
        ) : null}
        <div className="tm-h5 text-center my-3">{title}</div>
        <div className="tm-para2 text-center whitespace-pre-line break-words">
          {desc}
        </div>
        {!hideButtons ? (
          <div
            className={`flex flex-row mt-6 ${
              onAction && secondaryBtnText
                ? 'justify-between'
                : 'justify-center'
            }`}
          >
            <div
              className={
                primaryBtnStyle ? primaryBtnStyle : `tm-btn2-white w-9/10 h-11`
              }
              onClick={onAction}
            >
              {primaryBtnText}
            </div>
            {onAction && secondaryBtnText && (
              <div
                className={`tm-btn2-blue w-9/10 h-11 ${secondaryBtnStyle}`}
                onClick={() => onClose(false)}
              >
                {secondaryBtnText}
              </div>
            )}
          </div>
        ) : (
          <div className="loading" />
        )}
      </div>
    </div>
  )
}
