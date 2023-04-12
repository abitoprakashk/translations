import React from 'react'
import {getDownloadCSV} from '../../../utils/Helpers'
import {Button, BUTTON_CONSTANTS} from '@teachmint/krayon'
import {t} from 'i18next'
import useSendEvent from '../../AttendanceReport/hooks/useSendEvent'
import events from '../constant/events'

export const DownloadReport = ({fileName, data}) => {
  const sendEvent = useSendEvent()

  const handleDownload = () => {
    sendEvent(events.MULTI_INSTITUTE_REPORT_DOWNLOADED_TFI, {
      report_type: fileName,
    })

    getDownloadCSV(fileName, data)
  }
  return (
    <Button
      type={BUTTON_CONSTANTS.TYPE.TEXT}
      prefixIcon="download"
      onClick={handleDownload}
    >
      {t('report')}
    </Button>
  )
}
