import {useDispatch} from 'react-redux'
import ToggleAccordion from '../../common/options/toggle-accordion/ToggleAccordion'
import SettingsHeader from '../SettingsHeader/SettingsHeader'
import {postGlobalSettingsAction} from '../../../redux/GlobalSettingsActions'
import {useInstituteId} from '../../../../../redux/reducers/CommonSelectors'
import styles from './GlobalManagementSettings.module.css'
import {useGlobalSettings} from '../../../redux/GlobalSettingsSelectors'
import {MANAGMENT_SETTINGS_SUB_CATEGORIES} from '../../../constants/constants'
import {PERMISSION_CONSTANTS} from '../../../../../utils/permission.constants'
import {useTranslation} from 'react-i18next'

const GlobalManagementSettings = () => {
  const instituteId = useInstituteId()
  const globalSettings = useGlobalSettings()
  const managementSettings = globalSettings.settings.management
  const dispatch = useDispatch()
  const handleSettingsChange = (id, value) => {
    dispatch(postGlobalSettingsAction(instituteId, {id, value}))
  }
  const {t} = useTranslation()
  return (
    <>
      <div>
        <SettingsHeader />
        <div>
          {managementSettings &&
            managementSettings[
              MANAGMENT_SETTINGS_SUB_CATEGORIES.TEACHER
            ].settings
              .filter((item) => item.id !== 'student_delete')
              .map(({id, title, status}) => (
                <div key={id}>
                  <ToggleAccordion
                    id={id}
                    title={t(title)}
                    isOn={status}
                    handleActions={handleSettingsChange}
                    permissionId={
                      PERMISSION_CONSTANTS.classroomSettingController_updateGlobalclassroomsettings_update
                    }
                  />
                  <hr className={styles.managementSettingHorizontalLine} />
                </div>
              ))}
          {/* <div className={styles.managementSettingStudent}>Student</div>
          {managementSettings &&
            managementSettings[
              MANAGMENT_SETTINGS_SUB_CATEGORIES.STUDENT
            ].settings.map(({id, title, status}) => (
              <div key={id}>
                <ToggleAccordion
                  id={id}
                  title={title}
                  isOn={status}
                  handleActions={handleSettingsChange}
                />
                <hr className={styles.managementSettingHorizontalLine} />
              </div>
            ))} */}
        </div>
      </div>
    </>
  )
}

export default GlobalManagementSettings
