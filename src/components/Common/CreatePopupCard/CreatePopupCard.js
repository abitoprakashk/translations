import React from 'react'
import crossIcon from '../../../assets/images/icons/cross-gray.svg'

export default function CreatePopupCard({title, onClose, htmlContent}) {
  return (
    <div
      className="tm-popup-bg hidden lg:flex justify-center items-center"
      onClick={() => onClose(false)}
    >
      <div
        className="bg-white w-4/12 tm-border-radius1"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 py-3 hidden lg:flex items-center justify-between tm-border1-dark-bottom">
          <div className="tm-h5">{title}</div>
          <img
            src={crossIcon}
            alt="cross"
            className="w-6 h-6 cursor-pointer"
            onClick={() => onClose(false)}
          />
        </div>

        {htmlContent}
      </div>
    </div>
  )
}
