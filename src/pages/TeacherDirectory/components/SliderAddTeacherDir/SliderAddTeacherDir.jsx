import React from 'react'
import {t} from 'i18next'
import SliderScreen from '../../../../components/Common/SliderScreen/SliderScreen'
import SliderScreenHeader from '../../../../components/Common/SliderScreenHeader/SliderScreenHeader'
import SliderAddTeacher from '../../../../components/SchoolSystem/SectionDetails/SliderAddTeacher'

export default function SliderAddTeacherDir({setSliderScreen}) {
  return (
    <SliderScreen setOpen={() => setSliderScreen(null)} width="900">
      <>
        <SliderScreenHeader
          icon="https://storage.googleapis.com/tm-assets/icons/primary/teacher-primary.svg"
          title={t('addTeachers')}
        />

        <div className="h-5/6 lg:h-full overflow-y-auto">
          <SliderAddTeacher
            callback={() => setSliderScreen(null)}
            showBulkTeacherUpload={true}
            screenName="teacher_directory"
          />
        </div>
      </>
    </SliderScreen>
  )
}
