import React, {useState} from 'react'
import styles from './NPSFormStyles.module.css'
import {Button, Icon, Divider, Input} from '@teachmint/krayon'
import {t} from 'i18next'
import {events} from '../../utils/EventsConstants'
import {useSelector} from 'react-redux'
import NPSFeatureSubOptions from './NPSFeatureSubOptions'
import NPSFeatureOptions from './NPSFeatureOptions'
import classNames from 'classnames'

const NPSFormContainer = ({
  setPopupPageNumber,
  NPSSubmissionData,
  fd,
  options,
  handleCloseClick,
}) => {
  const [activeFeature, setActiveFeature] = useState(-1)
  const [textFeedback, setTextFeedback] = useState('')
  const [response, setResponse] = useState({text_ans: '', selected_options: {}})
  const eventManager = useSelector((state) => state.eventManager)
  const lastEvent = useSelector((store) => store.lastEvent)
  const handleSubmitClick = () => {
    let payload = {...NPSSubmissionData, ...response}
    handleCloseClick('SUBMIT', payload, 2)
    setPopupPageNumber(2)
    eventManager.send_event(events.NPS_FEATURE_SELECT_SUBMIT_CLICKED_TFI, {
      triggering_event: lastEvent,
      nps_score: NPSSubmissionData.rating,
      form_id: fd._id,
      response: Object.keys(response.selected_options).map((feature) => ({
        feature: feature,
        sub_features: response.selected_options[feature],
      })),
      text_ans: response.text_ans,
    })
  }

  const handleBackButtonClick = () => {
    setPopupPageNumber(0)
    eventManager.send_event(events.NPS_BACK_CLICKED_TFI, {
      triggering_event: lastEvent,
      nps_score: NPSSubmissionData.rating,
      form_id: fd._id,
    })
  }

  const handleTextAreaChange = (fieldName, value) => {
    let payload = {
      ...response,
      text_ans: value,
    }
    setResponse(payload)
    if (fieldName) {
      setTextFeedback(value)
    }
    if (value.length === 1) {
      eventManager.send_event(events.NPS_TEXTBOX_USED_TFI, {
        triggering_event: lastEvent,
        nps_score: NPSSubmissionData.rating,
        form_id: fd._id,
      })
    }
  }

  const handleOptionClick = (i, option) => {
    setActiveFeature(i)
    eventManager.send_event(events.NPS_MAIN_FEATURE_CLICKED_TFI, {
      triggering_event: lastEvent,
      feature_name: options[option].lang_meta_data.en.text,
      nps_score: NPSSubmissionData.rating,
      form_id: fd._id,
    })
  }
  const detailsType =
    NPSSubmissionData?.rating > 8
      ? 'positive'
      : NPSSubmissionData?.rating < 7
      ? 'negative'
      : 'neutral'
  const formDetails = fd?.lang_meta_data?.en?.[detailsType]
  return (
    <div className={styles.NPSFormContainer}>
      <div className={styles.scorePopupHeader}>
        <div
          className={styles.PopupBack}
          onClick={() => handleBackButtonClick()}
        >
          <Icon name="backArrow" size="xx_s" />
        </div>
        <div className={styles.featureQuestionText}>
          {formDetails?.q1_text || t('recommendationLikelyhood')}
        </div>
        <div
          className={styles.PopupCross}
          onClick={() =>
            handleCloseClick('CANCEL', {...NPSSubmissionData, ...response}, 2)
          }
        >
          <Icon name="close" size="xx_s" />
        </div>
      </div>
      <div
        className={classNames(
          'show-scrollbar show-scrollbar-small',
          styles.body
        )}
      >
        {options[formDetails.options[0]].lang_meta_data.en.options.length !==
          0 && (
          <NPSFeatureSubOptions
            formDetails={formDetails}
            options={options}
            NPSSubmissionData={NPSSubmissionData}
            fd={fd}
            response={response}
            setResponse={setResponse}
            handleOptionClick={handleOptionClick}
            activeFeature={activeFeature}
          />
        )}
        {options[formDetails.options[0]].lang_meta_data.en.options.length ===
          0 && (
          <NPSFeatureOptions
            formDetails={formDetails}
            options={options}
            NPSSubmissionData={NPSSubmissionData}
            fd={fd}
            response={response}
            setResponse={setResponse}
          />
        )}
        <Divider length="95%" spacing="0px" className={styles.midDivider} />
        <div className={styles.NPSTextarea}>
          <div className={styles.NPSTextareaHeading}>
            {formDetails?.q2_text || t('recommendationLikelyhood')}
          </div>
          <div className={styles.NPSTextareaContent}>
            <Input
              type="textarea"
              title=""
              placeholder={t('typeHereDot')}
              value={textFeedback}
              onChange={(obj) => {
                handleTextAreaChange(obj.fieldName, obj.value)
              }}
              maxLength={1000}
              fieldName="textFeedback"
              className={styles.NPSTextareaContainer}
            />
          </div>
        </div>
      </div>
      <div className={styles.NPSFeaturesButtonContainer}>
        <Button
          onClick={() => handleSubmitClick()}
          width={'full'}
          isDisabled={Object.keys(response.selected_options).length === 0}
        >
          {fd?.lang_meta_data?.en?.cta_3 || t('submit')}
        </Button>
      </div>
    </div>
  )
}

export default NPSFormContainer
