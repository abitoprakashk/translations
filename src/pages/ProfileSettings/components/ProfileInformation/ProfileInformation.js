import React, {useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {SETTING_TYPE} from '../../ProfileSettings.constant'
import ProfileHeaderSection from './ProfileHeaderSection/ProfileHeaderSection'
import ProfileCategoriesSection from './ProfileCategoriesSection/ProfileCategoriesSection'
import {fetchCategoriesRequestAction} from '../../redux/actions/ProfileSettingsActions'
import {personaProfileSettingsSelector} from '../../redux/ProfileSettingsSelectors'
import {getCategoriesCollection} from '../../ProfileSettings.utils'
import styles from './ProfileInformation.module.css'

const ProfileInformation = ({persona}) => {
  const dispatch = useDispatch()
  const personaProfileSettingsData = personaProfileSettingsSelector()

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

  return (
    <div className={styles.profileImformationSection}>
      <div className={styles.headerSection}>
        <ProfileHeaderSection persona={persona} />
      </div>
      <div className={styles.categorySection}>
        <ProfileCategoriesSection persona={persona} />
      </div>
    </div>
  )
}

export default ProfileInformation
