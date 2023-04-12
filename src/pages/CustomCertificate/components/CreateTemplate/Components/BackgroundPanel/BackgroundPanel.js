import React from 'react'
import ColorPicker from '../../../../../../components/TemplateGenerator/LeftPanel/Components/ColorPicker/ColorPicker'
import ImagesComponent from '../../../../../../components/TemplateGenerator/LeftPanel/Components/ImageComponent/ImagesComponent'
import {templatePageSettingsActions} from '../../../../../../components/TemplateGenerator/redux/TemplateGenerator.actionTypes'
import {useDispatch} from 'react-redux'
import {useTranslation} from 'react-i18next'
import OrDivider from '../../../../../../components/Common/OrDivider/OrDivider'
import {useLocation} from 'react-router-dom'
import {eventManagerSelector} from '../../../../../../redux/reducers/CommonSelectors'
import {TEMPLATE_GENERATOR_EVENTS} from '../../../../../../components/TemplateGenerator/TemplateGenerator.events'
import {CERTIFICATE} from '../../../../CustomCertificate.constants'
import {DEFAULT_COLORS} from '../../../../../../components/TemplateGenerator/TemplateGenerator.constants'
import styles from './BackgroundPanel.module.css'

const BackgroundPanel = () => {
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const {search} = useLocation()
  const templateType = new URLSearchParams(search).get('templateType')
  const eventManager = eventManagerSelector()

  const triggerEvent = (eventName, data) => {
    eventManager.send_event(eventName, {
      template_type: templateType,
      ...data,
    })
  }

  const addBackgroundImage = (url) => {
    triggerEvent(
      TEMPLATE_GENERATOR_EVENTS.TEMPLATE_MAKER_TEMPLATE_BACKGROUND_SELECTED_TFI
    )
    dispatch({
      type: templatePageSettingsActions.SET_BACKGROUND,
      payload: {imageUrl: url},
    })
  }

  const addBackgroundColor = (color) => {
    triggerEvent(
      TEMPLATE_GENERATOR_EVENTS.TEMPLATE_MAKER_TEMPLATE_BACKGROUND_COLOUR_CLICKED_TFI
    )
    dispatch({
      type: templatePageSettingsActions.SET_BACKGROUND,
      payload: {color: color},
    })
  }

  return (
    <>
      <div className={styles.sections}>
        <ColorPicker
          colors={DEFAULT_COLORS}
          onColorChange={addBackgroundColor}
          label={t('templateGenerator.colors')}
        />
      </div>
      <OrDivider />
      <div className={styles.sections}>
        <ImagesComponent
          type="BACKGROUND"
          onImageClick={addBackgroundImage}
          allowedFormates={['image/jpg', 'image/jpeg', '.jpg', 'jpeg']}
          label={t('templateGenerator.backgroundImages')}
          triggerEvent={triggerEvent}
          module={CERTIFICATE}
        />
      </div>
    </>
  )
}

export default BackgroundPanel
