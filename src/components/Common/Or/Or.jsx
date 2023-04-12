import React from 'react'
import {useTranslation} from 'react-i18next'

export default function Or() {
  const {t} = useTranslation()
  return (
    <div className="tm-border1-dark-top flex justify-center mt-6 mb-4">
      <div className="relative -top-2.5 tm-para2 tm-bg-light-blue rounded-full">
        <i>{t('OR')}</i>
      </div>
    </div>
  )
}
