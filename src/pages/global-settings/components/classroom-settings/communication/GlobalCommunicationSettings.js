import {useDispatch} from 'react-redux'
import SettingsHeader from '../SettingsHeader/SettingsHeader'
import ToggleAccordion from '../../common/options/toggle-accordion/ToggleAccordion'
import {postGlobalSettingsAction} from '../../../redux/GlobalSettingsActions'
import {useInstituteId} from '../../../../../redux/reducers/CommonSelectors'
import styles from './GlobalCommunicationSettings.module.css'
import {useGlobalSettings} from '../../../redux/GlobalSettingsSelectors'
import {PERMISSION_CONSTANTS} from '../../../../../utils/permission.constants'
import {useTranslation} from 'react-i18next'

const GlobalCommunicationSettings = () => {
  const instituteId = useInstituteId()
  const globalSettings = useGlobalSettings()
  const communicationSettings = globalSettings.settings.communication.settings
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
          {communicationSettings.map(({id, title, status}) => (
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
              <hr className={styles.communicationSettingHorizontalLine} />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
export default GlobalCommunicationSettings
