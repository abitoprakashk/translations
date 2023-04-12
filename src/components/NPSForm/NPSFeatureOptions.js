import styles from './NPSFormStyles.module.css'
import {IconFrame, Icon, CheckboxGroup} from '@teachmint/krayon'
import {useSelector} from 'react-redux'
import {events} from '../../utils/EventsConstants'
const NPSFeatureOptions = ({
  formDetails,
  options,
  NPSSubmissionData,
  fd,
  response,
  setResponse,
}) => {
  const eventManager = useSelector((state) => state.eventManager)
  const lastEvent = useSelector((store) => store.lastEvent)
  return (
    <>
      <div className={styles.NPSFeaturesAll}>
        <CheckboxGroup
          frozenOptions={[]}
          className={styles.NPSFeaturesCheckbox}
          name="sections"
          size="s"
          onChange={(newSelectedOptions) => {
            let payload = {...response}
            payload.selected_options = Object.fromEntries(
              newSelectedOptions.map((option) => [option, []])
            )
            setResponse(payload)
            eventManager.send_event(events.NPS_MAIN_FEATURE_SELECTED_TFI, {
              triggering_event: lastEvent,
              feature_list: newSelectedOptions,
              nps_score: NPSSubmissionData.rating,
              form_id: fd._id,
            })
          }}
          options={formDetails?.options?.map((option) => ({
            label: (
              <>
                <IconFrame
                  size="l"
                  type="success"
                  className={`${styles[options[option].icon_color]} ${
                    styles.optionIcon
                  }`}
                >
                  <Icon
                    name={options[option].icon}
                    type="inverted"
                    size="xx_s"
                  />
                </IconFrame>
                {options[option].lang_meta_data.en.text}
              </>
            ),
            value: options[option].lang_meta_data.en.text,
          }))}
          selectedOptions={Object.keys(response.selected_options)}
        />
      </div>
      <div className={styles.NPSFeaturesAllDesktop}>
        <CheckboxGroup
          frozenOptions={[]}
          className={styles.NPSFeaturesCheckbox}
          name="sections"
          size="s"
          onChange={(newSelectedOptions) => {
            let payload = {...response}
            payload.selected_options = Object.fromEntries(
              newSelectedOptions.map((option) => [option, []])
            )
            setResponse(payload)
            eventManager.send_event(events.NPS_MAIN_FEATURE_SELECTED_TFI, {
              triggering_event: lastEvent,
              feature_list: newSelectedOptions,
              nps_score: NPSSubmissionData.rating,
              form_id: fd._id,
            })
          }}
          options={formDetails?.options?.map((option) => ({
            label: (
              <>
                <IconFrame
                  size="l"
                  type="success"
                  className={`${styles[options[option].icon_color]} ${
                    styles.optionIcon
                  }`}
                >
                  <Icon
                    name={options[option].icon}
                    type="inverted"
                    size="xx_s"
                  />
                </IconFrame>
                {options[option].lang_meta_data.en.text}
              </>
            ),
            value: options[option].lang_meta_data.en.text,
          }))}
          selectedOptions={Object.keys(response.selected_options)}
        />
      </div>
    </>
  )
}

export default NPSFeatureOptions
