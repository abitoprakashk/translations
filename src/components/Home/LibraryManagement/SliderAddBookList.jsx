import React from 'react'
import {t} from 'i18next'
import SliderScreen from '../../Common/SliderScreen/SliderScreen'
import SliderScreenHeader from '../../Common/SliderScreenHeader/SliderScreenHeader'
import {SliderAddBook} from './SliderAddBook'

export default function SliderAddBookList({setSliderScreen}) {
  return (
    <SliderScreen setOpen={() => setSliderScreen(null)}>
      <>
        <SliderScreenHeader
          icon="https://storage.googleapis.com/tm-assets/icons/primary/students-primary.svg"
          title={t('addBook')}
        />

        <div className="p-5 lg:p-10 h-4/5 overflow-y-auto">
          <SliderAddBook
            callback={() => setSliderScreen(null)}
            setSliderScreen={setSliderScreen}
          />
        </div>
      </>
    </SliderScreen>
  )
}
