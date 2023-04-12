import React from 'react'
import {useSelector} from 'react-redux'
import {
  ACCEPTED_SHEET_EXTENSIONS,
  handleSheetUpload,
} from '../../../utils/fileUtils'
import {Trans, useTranslation} from 'react-i18next'

export default function CSVUploadCardV1({
  beforeSheetDataLoad,
  onSheetDataLoad,
  userType,
}) {
  const {eventManager} = useSelector((state) => state)
  const {t} = useTranslation()
  const trackEvent = (eventName) => {
    eventManager.send_event(eventName)
  }

  return (
    <div>
      <label
        htmlFor="csv-file"
        onClick={() => {
          trackEvent(`UPLOAD_${userType.toUpperCase()}_CSV_CLICKED`)
        }}
      >
        <div
          style={{background: 'rgba(239, 249, 255, 0.6)'}}
          className="h-12 lg:h-28 tm-border1-blue-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer"
        >
          <img
            src="https://storage.googleapis.com/tm-assets/icons/blue/cloud-upload-blue.svg"
            alt=""
            className="hidden lg:block w-10 h-10"
          />
          <div className="hidden lg:block tm-para tm-para-14 mt-3">
            <Trans i18nKey="clickHereToBrowserFile">
              Click <span className="tm-cr-bl-2">here</span> to upload files
            </Trans>
          </div>
          <div className="lg:hidden tm-cr-bl-2 tm-para-14 mt-1">
            {t('uploadFile')}
          </div>
        </div>
      </label>

      <input
        type="file"
        id="csv-file"
        className="hidden"
        accept={ACCEPTED_SHEET_EXTENSIONS}
        onChange={(e) => {
          if (!e.target.files[0]) return 0
          handleSheetUpload(
            e.target.files[0],
            beforeSheetDataLoad,
            onSheetDataLoad
          )
          e.target.value = null
        }}
      />
    </div>
  )
}
