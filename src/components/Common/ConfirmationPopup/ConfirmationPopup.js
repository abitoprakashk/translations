import classNames from 'classnames'
import React from 'react'
import styles from './ConfirmationPopup.module.css'

export default function ConfirmationPopup({
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
  loaderClassName = '',
}) {
  return (
    <div
      className={classNames(
        'tm-popup-bg flex items-center justify-center',
        styles.zIndexWrapper
      )}
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
                primaryBtnStyle
                  ? primaryBtnStyle
                  : `tm-btn2-white w-9/10 lg:h-11`
              }
              onClick={() => onClose(false)}
            >
              {primaryBtnText}
            </div>
            {onAction && secondaryBtnText && (
              <div
                className={`tm-btn2-blue w-9/10 lg:h-11 ${secondaryBtnStyle}`}
                onClick={onAction}
              >
                {secondaryBtnText}
              </div>
            )}
          </div>
        ) : (
          <div className={classNames(loaderClassName)} />
        )}
      </div>
    </div>
  )
}
