import React from 'react'
import {useTranslation} from 'react-i18next'
import SliderScreen from '../../Common/SliderScreen/SliderScreen'
import SliderScreenHeader from '../../Common/SliderScreenHeader/SliderScreenHeader'
import SliderAddClassroom from './SliderAddClassroom'

export default function SliderAddClassroomDir({setSliderScreen}) {
  const {t} = useTranslation()
  return (
    <SliderScreen setOpen={() => setSliderScreen(null)} width={650}>
      <>
        <SliderScreenHeader
          icon="https://storage.googleapis.com/tm-assets/icons/primary/teacher-primary.svg"
          title={t('addClassroom')}
        />

        <div className="p-5 lg:p-10 h-5/6 overflow-y-auto">
          <SliderAddClassroom setSliderScreen={setSliderScreen} />
        </div>
      </>
    </SliderScreen>
  )
}
