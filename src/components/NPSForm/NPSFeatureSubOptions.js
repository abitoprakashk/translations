import styles from './NPSFormStyles.module.css'
import {Accordion, IconFrame, Icon, CheckboxGroup} from '@teachmint/krayon'
import {useSelector} from 'react-redux'
import {events} from '../../utils/EventsConstants'

const NPSFeatureSubOptions = ({
  formDetails,
  options,
  NPSSubmissionData,
  fd,
  response,
  setResponse,
  handleOptionClick,
  activeFeature,
}) => {
  const eventManager = useSelector((state) => state.eventManager)
  const lastEvent = useSelector((store) => store.lastEvent)
  return (
    <>
      <div className={styles.NPSFeaturesAll}>
        {formDetails?.options.map((option, i) => (
          <Accordion
            key={i}
            allowHeaderClick={true}
            headerContent={
              <div className={styles.accordionHeader}>
                <IconFrame
                  size="x_l"
                  type="error"
                  className={`${styles[options[option].icon_color]} ${
                    styles.accordionIconFrame
                  }`}
                >
                  <Icon
                    name={options[option].icon}
                    type="inverted"
                    size="xx_s"
                    className={styles?.icon}
                  />
                </IconFrame>
                {options[option].lang_meta_data.en.text}
              </div>
            }
            toggleIconNames={{
              closed: 'downArrow',
              opened: 'upArrow',
            }}
            className={styles.NPSFeatures}
            onClick={() => {
              eventManager.send_event(events.NPS_MAIN_FEATURE_CLICKED_TFI, {
                triggering_event: lastEvent,
                feature_name: options[option].lang_meta_data.en.text,
                nps_score: NPSSubmissionData.rating,
                form_id: fd._id,
              })
            }}
          >
            <CheckboxGroup
              frozenOptions={[]}
              className={styles.NPSSubFeaturesList}
              name="sections"
              onChange={(newSelectedOptions) => {
                let payload = {...response}
                if (newSelectedOptions.length !== 0) {
                  payload.selected_options[
                    options[option].lang_meta_data.en.text
                  ] = newSelectedOptions
                } else {
                  delete payload.selected_options[
                    options[option].lang_meta_data.en.text
                  ]
                }
                setResponse(payload)
                eventManager.send_event(events.NPS_SUBFEATURE_CLICKED_TFI, {
                  triggering_event: lastEvent,
                  feature_name: options[option].lang_meta_data.en.text,
                  subfeature_list: newSelectedOptions,
                  nps_score: NPSSubmissionData.rating,
                  form_id: fd._id,
                })
              }}
              options={options[option].lang_meta_data.en.options.map(
                (option) => ({
                  label: option,
                  value: option,
                })
              )}
              selectedOptions={
                options[option].lang_meta_data.en.text in
                response.selected_options
                  ? response.selected_options[
                      options[option].lang_meta_data.en.text
                    ]
                  : []
              }
            />
          </Accordion>
        ))}
      </div>
      <div className={styles.NPSFeaturesAllDesktop}>
        {formDetails?.options.map((option, i) => (
          <div key={i}>
            <div
              className={
                i === activeFeature
                  ? styles.NPSActiveFeaturesDesktop
                  : styles.NPSFeaturesDesktop
              }
              onClick={() => handleOptionClick(i, option)}
            >
              <IconFrame
                size="x_l"
                type="success"
                className={styles[options[option].icon_color]}
              >
                <Icon name={options[option].icon} type="inverted" size="xx_s" />
              </IconFrame>
              <div className={styles.NPSFeaturesCardTitle}>
                {options[option].lang_meta_data.en.text}
              </div>
              {options[option].lang_meta_data.en.text in
              response.selected_options ? (
                <div className={styles.NPSFeaturesCardSubTitleActiveContainer}>
                  <span className={styles.NPSFeaturesCardSubTitleActive}>
                    {
                      response.selected_options[
                        options[option].lang_meta_data.en.text
                      ].length
                    }
                  </span>
                  <span className={styles.NPSFeaturesCardSubTitle}>
                    /{options[option].lang_meta_data.en.options.length} Selected
                  </span>
                </div>
              ) : (
                <div className={styles.NPSFeaturesCardSubTitle}>
                  {options[option].lang_meta_data.en.sub_text}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {activeFeature !== -1 && (
        <div className={styles.NPSSubfeaturesAllDesktop}>
          {formDetails.options.map((option, i) => {
            if (i === activeFeature)
              return (
                <div className={styles.activeSubfeature} key={i}>
                  <CheckboxGroup
                    className={styles.NPSSubFeaturesList}
                    name="subFeatures"
                    onChange={(newSelectedOptions) => {
                      let payload = {...response}
                      if (newSelectedOptions.length !== 0) {
                        payload.selected_options[
                          options[option].lang_meta_data.en.text
                        ] = newSelectedOptions
                      } else {
                        delete payload.selected_options[
                          options[option].lang_meta_data.en.text
                        ]
                      }
                      setResponse(payload)
                      eventManager.send_event(
                        events.NPS_SUBFEATURE_CLICKED_TFI,
                        {
                          triggering_event: lastEvent,
                          feature_name: options[option].lang_meta_data.en.text,
                          subfeature_list: newSelectedOptions,
                          nps_score: NPSSubmissionData.rating,
                          form_id: fd._id,
                        }
                      )
                    }}
                    options={options[option].lang_meta_data.en.options.map(
                      (option) => ({
                        label: option,
                        value: option,
                      })
                    )}
                    selectedOptions={
                      options[option].lang_meta_data.en.text in
                      response.selected_options
                        ? response.selected_options[
                            options[option].lang_meta_data.en.text
                          ]
                        : []
                    }
                  />
                </div>
              )
          })}
        </div>
      )}
    </>
  )
}

export default NPSFeatureSubOptions
