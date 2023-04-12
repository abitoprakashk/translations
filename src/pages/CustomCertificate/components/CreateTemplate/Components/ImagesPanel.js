import React from 'react'
import {useTranslation} from 'react-i18next'
import {useLocation} from 'react-router-dom'
import ImagesComponent from '../../../../../components/TemplateGenerator/LeftPanel/Components/ImageComponent/ImagesComponent'
import {useEditorRef} from '../../../../../components/TemplateGenerator/redux/TemplateGenerator.selectors'
import {TEMPLATE_GENERATOR_EVENTS} from '../../../../../components/TemplateGenerator/TemplateGenerator.events'
import {eventManagerSelector} from '../../../../../redux/reducers/CommonSelectors'
import {CERTIFICATE} from '../../../CustomCertificate.constants'

const ImagesPanel = () => {
  const {t} = useTranslation()
  const editorRef = useEditorRef()
  const insertImageInTemplateBody = (url) => {
    triggerEvent(
      TEMPLATE_GENERATOR_EVENTS.TEMPLATE_MAKER_TEMPLATE_IMAGE_CLICKED_TFI
    )
    editorRef?.addImage({url})
  }
  const {search} = useLocation()
  const templateType = new URLSearchParams(search).get('templateType')
  const eventManager = eventManagerSelector()

  const triggerEvent = (eventName, data) => {
    eventManager.send_event(eventName, {
      template_type: templateType,
      ...data,
    })
  }
  return (
    <div>
      <ImagesComponent
        type="GENERAL"
        onImageClick={insertImageInTemplateBody}
        alertContent={t('templateGenerator.uploadSizeLimitText')}
        allowedFormates={[
          'image/png',
          'image/jpg',
          'image/jpeg',
          '.png',
          '.jpg',
          '.jpeg',
        ]}
        label={t('templateGenerator.chooseImages')}
        triggerEvent={triggerEvent}
        module={CERTIFICATE}
      />
    </div>
  )
}

export default ImagesPanel
