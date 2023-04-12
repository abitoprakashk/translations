import {useDispatch} from 'react-redux'
import SettingsHeader from '../SettingsHeader/SettingsHeader'
import OptionsBox, {
  TITLE_OPTIONS,
} from '../../common/containers/options-box/OptionsBox'
import {postGlobalSettingsAction} from '../../../redux/GlobalSettingsActions'
import {useInstituteId} from '../../../../../redux/reducers/CommonSelectors'
import {useGlobalSettings} from '../../../redux/GlobalSettingsSelectors'

const GlobalContentSettings = () => {
  const instituteId = useInstituteId()
  const globalSettings = useGlobalSettings()
  const contentSettings = globalSettings?.settings?.content.settings

  const dispatch = useDispatch()
  const handleSettingsChange = (id, optionId, value) => {
    let payload = {id, value}
    if (id === 'is_recording_visible' && (optionId || optionId === 0)) {
      payload = {id: 'recording_cliff_days', value: optionId}
    }
    dispatch(postGlobalSettingsAction(instituteId, payload))
  }
  return (
    <>
      <div>
        <SettingsHeader />
        <div>
          {contentSettings &&
            contentSettings.map(
              ({id, title, options, option_type, desc, status}) => (
                <OptionsBox
                  key={id}
                  id={id}
                  title={title}
                  optionsList={options ? Object.values(options) : []}
                  handleAction={handleSettingsChange}
                  titleType={TITLE_OPTIONS.TOGGLE_TITLE}
                  optionType={option_type}
                  desc={desc}
                  showOptions={false}
                  isOn={status}
                />
              )
            )}
        </div>
      </div>
    </>
  )
}
export default GlobalContentSettings
