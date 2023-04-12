import {useDispatch} from 'react-redux'
import SettingsHeader from '../SettingsHeader/SettingsHeader'
import ToggleAccordion from '../../common/options/toggle-accordion/ToggleAccordion'
import {postGlobalSettingsAction} from '../../../redux/GlobalSettingsActions'
import {useInstituteId} from '../../../../../redux/reducers/CommonSelectors'
import styles from './GlobalExamSettings.module.css'
import {useGlobalSettings} from '../../../redux/GlobalSettingsSelectors'
import {PERMISSION_CONSTANTS} from '../../../../../utils/permission.constants'
import {useTranslation} from 'react-i18next'

const GlobalExamSettings = () => {
  const instituteId = useInstituteId()
  const globalSettings = useGlobalSettings()
  const examSettings = globalSettings.settings.exam.settings
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
          {examSettings.map(({id, title, status}) => (
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
              <hr className={styles.examSettingHorizontalLine} />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
export default GlobalExamSettings
