import React from 'react'
import {useTranslation} from 'react-i18next'
import SliderScreen from '../../Common/SliderScreen/SliderScreen'
import SliderScreenHeader from '../../Common/SliderScreenHeader/SliderScreenHeader'
import Admin from './../../../pages/user-profile/components/Admin/Admin'

export default function SliderAddAdminList({setSliderScreen}) {
  const {t} = useTranslation()
  return (
    <SliderScreen setOpen={() => setSliderScreen(null)} width="900">
      <>
        <SliderScreenHeader
          icon="https://storage.googleapis.com/tm-assets/icons/primary/students-primary.svg"
          title={t('addUser')}
        />
        <Admin
          isAddProfile={true}
          closeSlider={() => {
            // getList()
            setSliderScreen(false)
          }}
        />
      </>
    </SliderScreen>
  )
}
