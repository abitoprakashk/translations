import React from 'react'

export default function ImgText({icon, text, textStyle = ''}) {
  return (
    <div className="flex flex-row items-center">
      <img className="w-4 h-4 mr-1.5 lg:w-5 lg:h-5" src={icon} alt={text} />
      <div className={`tm-para3 ${textStyle}`}>{text}</div>
    </div>
  )
}
