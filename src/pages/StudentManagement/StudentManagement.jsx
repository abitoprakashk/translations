import React, {useEffect} from 'react'
import {useDispatch} from 'react-redux'
import globalActions from '../../redux/actions/global.actions'
import {getInstitutePersonaSettingsAction} from '../DocumentUpload/Redux/DocumentUpload.actions'
import {SETTING_TYPE} from '../ProfileSettings/ProfileSettings.constant'
import {getCategoriesCollection} from '../ProfileSettings/ProfileSettings.utils'
import {fetchCategoriesRequestAction} from '../ProfileSettings/redux/actions/ProfileSettingsActions'
import {personaProfileSettingsSelector} from '../ProfileSettings/redux/ProfileSettingsSelectors'
import {USER_TYPE_SETTINGS} from '../user-profile/constants'
import StudentManagementRouting from './StudentManagementRouting'

export default function StudentManagement() {
  const dispatch = useDispatch()

  const personaProfileSettingsData = personaProfileSettingsSelector()

  // Get Category collection functions start
  useEffect(() => {
    const getProfileSettings = {persona: USER_TYPE_SETTINGS.STUDENT.id}
    dispatch(
      globalActions?.fetchPersonaProfileSettingsRequestAction?.request(
        getProfileSettings
      )
    )
    dispatch(getInstitutePersonaSettingsAction('STUDENT'))
  }, [])

  useEffect(() => {
    let categoriesCollection = null
    if (personaProfileSettingsData?.data?.length > 0) {
      categoriesCollection = getCategoriesCollection(
        personaProfileSettingsData.data,
        SETTING_TYPE.CATEGORY_FOR_INFO
      )
    }
    dispatch(fetchCategoriesRequestAction(categoriesCollection))
  }, [personaProfileSettingsData])
  // Get Category collection functions end

  return <StudentManagementRouting />
}
