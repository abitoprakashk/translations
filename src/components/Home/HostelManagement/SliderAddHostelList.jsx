import React from 'react'
import {useTranslation} from 'react-i18next'
import SliderScreen from '../../Common/SliderScreen/SliderScreen'
import SliderScreenHeader from '../../Common/SliderScreenHeader/SliderScreenHeader'
import {SliderAddHostel} from './SliderAddHostel'

export default function SliderAddHostelList({setSliderScreen}) {
  const {t} = useTranslation()
  return (
    <SliderScreen setOpen={() => setSliderScreen(null)}>
      <>
        <SliderScreenHeader
          icon="https://storage.googleapis.com/tm-assets/icons/primary/students-primary.svg"
          title={t('addHostelLabel')}
        />

        <div className="p-5 lg:p-10 h-4/5 overflow-y-auto">
          <SliderAddHostel setSliderScreen={setSliderScreen} />
        </div>
      </>
    </SliderScreen>
  )
}
