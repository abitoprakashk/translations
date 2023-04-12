import React from 'react'
import {t} from 'i18next'

export default function ProfileCard({
  num,
  title,
  desc,
  imgSrc,
  isSelected,
  handleClick = (f) => f,
}) {
  return (
    <div
      key={num}
      className={`tm-profile-card bg-white w-full p-3.5 tm-border-radius1 ${
        num === isSelected ? 'tm-border1-blue' : 'tm-border1-dark'
      } flex items-center mb-4 cursor-pointer lg:p-6`}
      onClick={handleClick}
    >
      <div className="w-14 h-14 lg:w-16 lg:h-16 flex justify-center items-center tm-bgcr-gy-4 rounded-xl">
        <img src={imgSrc} alt="" className="w-8 h-8" />
      </div>
      <div className="w-3/5 tm-h5 ml-3">
        <div className="tm-h5">{t(title)}</div>
        <div className="tm-para3 mt-1">{t(desc)}</div>
      </div>
    </div>
  )
}
