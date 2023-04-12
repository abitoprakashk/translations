import React from 'react'
import copyIcon from '../../../assets/images/icons/copy-blue.svg'
import {t} from 'i18next'

export default function CopyInput({
  copyText,
  handleCopy,
  btnText = 'copyLink',
}) {
  return (
    <div className="flex w-full">
      <div className="w-full flex tm-border-radius1 tm-border1-dark px-3 py-2.5 justify-between items-center tm-copy-input-width tm-remove-right-radius">
        <div className="w-11/12 overflow-hidden tm-para2 tm-color-text-primary whitespace-nowrap">
          {copyText}
        </div>
        <img
          src={copyIcon}
          alt=""
          className="w-4 h-4 lg:hidden"
          onClick={handleCopy}
        />
      </div>
      <div
        className="hidden lg:block tm-btn1-blue w-48 tm-remove-left-radius"
        onClick={handleCopy}
      >
        {t(btnText)}
      </div>
    </div>
  )
}
