import React from 'react'
import {useTranslation} from 'react-i18next'

export default function EmptyScreen({img, text}) {
  const {t} = useTranslation()
  return (
    <div className="flex items-center justify-center flex-col mx-16 mt-32">
      <img src={img} alt={t('empty')} className="w-36 h-36" />
      <div className="tm-para2 mt-4 text-center">{text}</div>
    </div>
  )
}
