import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {showErrorOccuredAction} from '../../../../redux/actions/commonAction'
import {
  instituteTeacherListAction,
  teacherListLoadingAction,
} from '../../../../redux/actions/instituteInfoActions'
import SliderScreen from '../../../../components/Common/SliderScreen/SliderScreen'
import SliderScreenHeader from '../../../../components/Common/SliderScreenHeader/SliderScreenHeader'
import {utilsGetUsersList} from '../../../../routes/dashboard'
import Teacher from '../../../user-profile/components/Teacher/Teacher'
import {INSTITUTE_MEMBER_TYPE} from '../../../../constants/institute.constants'
import Documents from '../../../DocumentUpload/Documents'
import {events} from '../../../../utils/EventsConstants'

const SLIDER_TAB_IDS = {
  BASIC_INFO: 'BASIC_INFO',
  DOCUMENTS: 'DOCUMENTS',
}

const SLIDER_TABS = [
  {id: SLIDER_TAB_IDS.BASIC_INFO, label: 'Profile'},
  {id: SLIDER_TAB_IDS.DOCUMENTS, label: 'Documents'},
]

export default function SliderTeacherDetail({
  setSliderScreen,
  selectedTeacher,
}) {
  const {instituteInfo, eventManager} = useSelector((state) => state)
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const [selectedTab, setSelectedTab] = useState(SLIDER_TAB_IDS.BASIC_INFO)

  const getInstituteTeachers = () => {
    if (instituteInfo?._id) {
      dispatch(teacherListLoadingAction(true))
      utilsGetUsersList({type: [INSTITUTE_MEMBER_TYPE.TEACHER]})
        .then(({status, obj}) => {
          if (status) dispatch(instituteTeacherListAction(obj))
        })
        .catch(() => dispatch(showErrorOccuredAction(true)))
        .finally(() => dispatch(teacherListLoadingAction(false)))
    }
  }

  useEffect(() => {
    if (selectedTab) {
      if (selectedTab === SLIDER_TAB_IDS.DOCUMENTS) {
        eventManager.send_event(
          events.PROFILE_DETAILS_DOCUMENTS_TAB_CLICKED_TFI,
          {
            user_screen: 'teacher',
          }
        )
      } else {
        eventManager.send_event(events.PROFILE_DETAILS_TAB_CLICKED_TFI, {
          user_screen: 'teacher',
        })
      }
    }
  }, [selectedTab])

  return (
    <div>
      <SliderScreen setOpen={() => setSliderScreen(null)} width="900">
        <>
          <SliderScreenHeader
            icon="https://storage.googleapis.com/tm-assets/icons/primary/teacher-primary.svg"
            title={t('teacherDetails')}
            options={SLIDER_TABS}
            optionsSelected={selectedTab}
            handleChange={setSelectedTab}
          />
          {selectedTab === SLIDER_TAB_IDS.BASIC_INFO && (
            <Teacher
              iMemberId={selectedTeacher._id}
              closeSlider={() => {
                getInstituteTeachers()
                setSliderScreen(false)
              }}
            />
          )}
          {selectedTab === SLIDER_TAB_IDS.DOCUMENTS && (
            <div className="h-full">
              <Documents memberId={selectedTeacher._id} persona="STAFF" />
            </div>
          )}
        </>
      </SliderScreen>
    </div>
  )
}
