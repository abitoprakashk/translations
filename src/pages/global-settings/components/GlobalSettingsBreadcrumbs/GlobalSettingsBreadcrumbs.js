import BreadCrumb from '../common/breadcrumb/BreadCrumb'
import {
  classroomSettingsOptions,
  CLASSROOM_SETTINGS_URL,
  yourPreferencesOptions,
} from '../../constants/constants'
import {DASHBOARD} from '../../../../utils/SidebarItems'
import {
  useSelectedSettingSubCategory,
  useSelectedSettingCategory,
} from '../../redux/GlobalSettingsSelectors'
import {useDispatch} from 'react-redux'
import {setSelectedSettingSubCategoryAction} from '../../redux/GlobalSettingsActions'
const GlobalSettingsBreadcrumbs = () => {
  const selectedSettingSubCategory = useSelectedSettingSubCategory()
  const selectedSettingCategory = useSelectedSettingCategory()
  const dispatch = useDispatch()
  const getTitle = () => {
    return selectedSettingSubCategory
      ? selectedSettingCategory === 'classroomSettings'
        ? classroomSettingsOptions[selectedSettingSubCategory]?.title
        : yourPreferencesOptions[selectedSettingSubCategory]?.title
      : 'Settings'
  }
  const getLink = () => {
    return selectedSettingSubCategory ? CLASSROOM_SETTINGS_URL : DASHBOARD
  }
  const handleAction = () => {
    dispatch(setSelectedSettingSubCategoryAction(null))
  }
  return (
    <>
      <BreadCrumb
        title={getTitle()}
        link={getLink()}
        handleAction={handleAction}
      />
    </>
  )
}

export default GlobalSettingsBreadcrumbs
