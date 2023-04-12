import React from 'react'
import {useTranslation} from 'react-i18next'
import {Icon} from '@teachmint/common'
import {useSelector} from 'react-redux'

import styles from './SliderPreview.module.css'
import SliderScreen from '../../../../../../components/Common/SliderScreen/SliderScreen'
import PreviewTemplate from '../PreviewTemplate/PreviewTemplate'
import {pdfPrint} from '../../../../../../utils/Helpers'
import {events} from '../../../../../../utils/EventsConstants'

export default function SliderPreview({
  previewData,
  setPreviewData,
  screenName,
}) {
  const {t} = useTranslation()
  const {eventManager} = useSelector((state) => state)

  const downloadPreview = () => {
    eventManager.send_event(events.REPORT_CARD_DOWNLOAD_CLICKED_TFI, {
      screen_name: screenName,
      class_id: previewData.node_id || previewData.node_ids[0],
    })
    var link = document.createElement('a')
    link.href = previewData.url
    link.download = `${previewData.name}-reportcard.pdf`
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
  }

  const printPreview = () => {
    eventManager.send_event(events.REPORT_CARD_PRINT_REPORT_CARDS_CLICKED_TFI, {
      screen_name: screenName,
      class_id: previewData.node_id || previewData.node_ids[0],
    })
    pdfPrint(previewData.url)
  }

  let timer = null

  const handleClose = () => {
    if (!timer) {
      timer = setTimeout(() => setPreviewData(null), 200)
    }
  }

  return (
    <SliderScreen
      open={previewData ? true : false}
      setOpen={handleClose}
      width="940"
    >
      <div className={styles.previewHeader}>
        {previewData.name} {t('reportCardTemplate')}
        <span className={styles.previewHeaderButtons} onClick={downloadPreview}>
          <Icon name="download" size="xs" color="primary" />
        </span>
        <span className={styles.previewHeaderButtons} onClick={printPreview}>
          <Icon name="print" size="xs" color="primary" />
        </span>
      </div>
      <PreviewTemplate url={previewData?.url} wrapperStyle={styles.preview} />
    </SliderScreen>
  )
}
