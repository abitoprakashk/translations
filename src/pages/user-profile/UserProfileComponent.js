import React, {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import Institute from './components/Institute/Institute'
import Student from './components/Student/Student'
import Teacher from './components/Teacher/Teacher'
import Admin from './components/Admin/Admin'
import {personaProfileSettingsSelector} from '../ProfileSettings/redux/ProfileSettingsSelectors'
import SliderScreen from '../../components/Common/SliderScreen/SliderScreen'
import SliderScreenHeader from '../../components/Common/SliderScreenHeader/SliderScreenHeader'
import {USER_TYPES} from './constants'
import globalActions from '../../redux/actions/global.actions'
import {getCategoriesCollection} from '../ProfileSettings/ProfileSettings.utils'
import {SETTING_TYPE} from '../ProfileSettings/ProfileSettings.constant'
import {fetchCategoriesRequestAction} from '../ProfileSettings/redux/actions/ProfileSettingsActions'
import {getPersonaValue} from './UserProfile.utils'
import InstiIcon from '../../assets/images/icons/Institute.svg'
import commonStyles from './UserProfileComponent.module.css'

export default function UserProfileComponent({
  userType,
  setSliderScreen,
  match,
  iMemberId,
  isSliderOpen = true,
  opened_from = null,
}) {
  const dispatch = useDispatch()
  let type = userType || match.params.type
  const [isOpen, setIsOpen] = useState(isSliderOpen)
  const userProfileValue = getPersonaValue(type)
  const personaProfileSettingsData = personaProfileSettingsSelector()

  // Get Category collection functions start
  useEffect(() => {
    const getProfileSettings = {
      persona: userProfileValue,
    }
    dispatch(
      globalActions?.fetchPersonaProfileSettingsRequestAction?.request(
        getProfileSettings
      )
    )
  }, [userProfileValue])

  useEffect(() => {
    let categoriesCollection = null
    if (
      personaProfileSettingsData.data &&
      personaProfileSettingsData.data.length > 0
    ) {
      categoriesCollection = getCategoriesCollection(
        personaProfileSettingsData.data,
        SETTING_TYPE.CATEGORY_FOR_INFO
      )
    }
    dispatch(fetchCategoriesRequestAction(categoriesCollection))
  }, [personaProfileSettingsData])
  // Get Category collection functions end

  const sliderContent = () => {
    switch (type?.toLowerCase()) {
      case USER_TYPES.STUDENT:
        return (
          <Student
            iMemberId={iMemberId || match?.params?.iMember}
            closeSlider={setSliderScreen}
            opened_from={opened_from}
          />
        )
      case USER_TYPES.TEACHER:
        return (
          <Teacher
            iMemberId={iMemberId || match.params.iMember}
            closeSlider={setSliderScreen}
            opened_from={opened_from}
          />
        )
      case USER_TYPES.ADMIN:
        return (
          <Admin
            iMemberId={iMemberId || match.params.iMember}
            isSliderOpen={true}
            closeSlider={setSliderScreen}
            opened_from={opened_from}
          />
        )
      case USER_TYPES.INSTITUTE:
        return (
          <Institute isSliderOpen={true} setSliderScreen={setSliderScreen} />
        )
      default:
        return (
          <Institute isSliderOpen={true} setSliderScreen={setSliderScreen} />
        )
    }
  }

  const sliderDesktopContent = () => {
    return (
      <>
        <SliderScreenHeader title={`${type} Details`} icon={InstiIcon} />
        <div className={commonStyles.contentWrapper}>{sliderContent()}</div>
      </>
    )
  }

  // const isMobile = getScreenWidth() < 1024

  // if (isMobile) return sliderContent()

  return (
    <SliderScreen
      open={isOpen}
      setOpen={() => {
        if (setSliderScreen) {
          setSliderScreen(false)
        } else {
          setIsOpen(false)
        }
      }}
      width="900"
    >
      {sliderDesktopContent()}
    </SliderScreen>
  )
}
