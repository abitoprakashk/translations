import React, {useState} from 'react'
import {Button, Modal, Icon} from '@teachmint/common'
import {Trans, useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import TemplateThumbnail from '../TemplateThumbnail/TemplateThumbnail'
import PreviewTemplate from '../../../../../common/PreviewTemplate/PreviewTemplate'
import {events} from '../../../../../../../../../utils/EventsConstants'
import styles from './SelectTemplate.module.css'

export default function SelectTemplate({
  isOpen,
  onClose,
  onProceed,
  templates,
  standard,
  onCreateNew,
}) {
  const {t} = useTranslation()
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0])
  const {eventManager} = useSelector((state) => state)

  const createNewTemplate = () => {
    eventManager.send_event(events.REPORT_CARD_CREATE_NEW_CLICKED_TFI, {
      class_id: standard.id,
    })
    onCreateNew()
  }

  const handleProceedClick = () => {
    eventManager.send_event(events.REPORT_CARD_TEMPLATE_PROCEED_CLICKED_TFI, {
      class_id: standard.id,
      template: selectedTemplate.name,
    })
    onProceed(selectedTemplate)
  }

  const renderTemplates = () => {
    return templates.map((template) => (
      <TemplateThumbnail
        key={template._id}
        details={template}
        isSelected={selectedTemplate._id === template._id}
        onTemplateClick={() => setSelectedTemplate(template)}
      />
    ))
  }

  return (
    <Modal show={isOpen} className={styles.modalWrapper}>
      <div className={styles.heading}>
        <Trans i18nKey="selectTemplateForClass">
          Report Card template for Class {standard}
        </Trans>
        <span onClick={onClose}>
          <Icon name="close" size="xs" className={styles.closeIcon} />
        </span>
      </div>
      <div className={styles.container}>
        <div className={styles.templates}>
          <div className={styles.createNewWrapper} onClick={createNewTemplate}>
            <div className={styles.createNew}>
              <Icon name="add" size="l" color="primary" />
            </div>
            <div>{t(`createNew`)}</div>
          </div>
          {renderTemplates()}
        </div>
        <PreviewTemplate
          url={selectedTemplate.url}
          wrapperStyle={styles.preview}
        />
      </div>
      <Button className={styles.proceedButton} onClick={handleProceedClick}>
        {t('proceed')}
      </Button>
    </Modal>
  )
}
