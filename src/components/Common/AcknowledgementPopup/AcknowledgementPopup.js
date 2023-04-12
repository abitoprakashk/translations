import React from 'react'
import crossIcon from '../../../assets/images/icons/cross-gray.svg'

export default function AcknowledgementPopup({
  onClose,
  onAction,
  icon,
  title,
  desc,
  primaryBtnText,
  secondaryBtnText = '',
  secondaryBtnAction = '',
  closeActive = true,
  hideButtons = false,
  dangerouslySetInnerHTML = false,
}) {
  return (
    <div
      className="tm-popup-bg flex items-center justify-center"
      onClick={() => closeActive && onClose(false)}
    >
      <div
        className="w-11/12 bg-white p-6 tm-border-radius1 lg:w-4/12 lg:p-12 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <img className="w-20 h-20 flex mx-auto" src={icon} alt="Icon" />
        <div className="tm-h5 text-center my-3">{title}</div>
        <div className="tm-para2 text-center whitespace-pre-line break-words">
          {dangerouslySetInnerHTML && (
            <div dangerouslySetInnerHTML={{__html: desc}}></div>
          )}
          {!dangerouslySetInnerHTML && desc}
        </div>
        {!hideButtons && (
          <div className="flex flex-row justify-center mt-6">
            <div className="tm-btn2-blue" onClick={onAction}>
              {primaryBtnText}
            </div>
          </div>
        )}
        {secondaryBtnAction && (
          <div className="flex flex-row justify-center mt-6">
            <div
              className="tm-para2 cursor-pointer"
              onClick={secondaryBtnAction}
            >
              {secondaryBtnText}
            </div>
          </div>
        )}

        {closeActive && (
          <img
            src={crossIcon}
            alt="Close"
            className="w-6 h-6 absolute top-4 right-4 cursor-pointer"
            onClick={() => onClose(false)}
          />
        )}
      </div>
    </div>
  )
}
