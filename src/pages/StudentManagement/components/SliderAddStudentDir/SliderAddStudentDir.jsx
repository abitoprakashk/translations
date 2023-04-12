import React from 'react'
import {t} from 'i18next'
import SliderScreen from '../../../../components/Common/SliderScreen/SliderScreen'
import SliderScreenHeader from '../../../../components/Common/SliderScreenHeader/SliderScreenHeader'
import SliderAddStudent from '../../../../components/SchoolSystem/SectionDetails/SliderAddStudent'
import {getSliderHeaderIcon} from '../../../user-profile/commonFunctions'
import classNames from 'classnames'
import styles from './SliderAddStudentDir.module.css'

export default function SliderAddStudentDir({setSliderScreen}) {
  const headerIcon = getSliderHeaderIcon({
    color: 'basic',
    name: 'student',
    size: 's',
    type: 'filled',
    className: styles.sliderHeaderIcon,
  })
  return (
    <SliderScreen setOpen={() => setSliderScreen(null)} width="900">
      <>
        <SliderScreenHeader icon={headerIcon} title={t('addStudents')} />

        <div className={classNames(styles.userSliderInnerContainer)}>
          <SliderAddStudent
            showClassSectionField={true}
            callback={() => {
              setSliderScreen(null)
            }}
            screenName="student_directory"
          />
        </div>
      </>
    </SliderScreen>
  )
}
