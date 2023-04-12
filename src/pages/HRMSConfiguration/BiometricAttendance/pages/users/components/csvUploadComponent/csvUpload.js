import React, {useState} from 'react'
import {useTranslation} from 'react-i18next'
import {Trans} from 'react-i18next'
import {useSelector} from 'react-redux'
import {
  Icon,
  Button,
  PlainCard,
  Para,
  BUTTON_CONSTANTS,
} from '@teachmint/krayon'
import styles from './csvUpload.module.css'
import {
  ACCEPTED_SHEET_EXTENSIONS,
  handleSheetUpload,
} from '../../../../../../../utils/fileUtils'
import {getDownloadCSV} from '../../../../../../../utils/Helpers'
import {events} from '../../../../../../../utils/EventsConstants'

const CSVUpload = ({
  beforeSheetDataLoad,
  onUpload,
  onRemove,
  sampleCSVString,
}) => {
  const [fileName, setFileName] = useState(null)
  const [uploadedFile, setUploadedFile] = useState(null)
  const {eventManager} = useSelector((state) => state)
  const {t} = useTranslation()

  const onSheetDataLoad = (status, processedCSVObject) => {
    if (status) {
      setUploadedFile(processedCSVObject)
      onUpload(processedCSVObject)
    }
  }

  const onRemoveButtonClick = () => {
    setUploadedFile(null)
    setFileName(null)
    onRemove()
  }

  return (
    <div className={styles.wrapper}>
      {uploadedFile ? (
        <PlainCard className={styles.dropbox}>
          <div className={styles.fileWrapper}>
            <div className={styles.iconHolder}>
              <Icon name="readerMode" />
            </div>
            <Para>{fileName}</Para>
            <Button
              type={BUTTON_CONSTANTS.TYPE.TEXT}
              category={BUTTON_CONSTANTS.CATEGORY.DESTRUCTIVE}
              onClick={onRemoveButtonClick}
            >
              {t('remove')}
            </Button>
          </div>
        </PlainCard>
      ) : (
        <div className={styles.csvUpload}>
          <label
            htmlFor="csv-file"
            onClick={() =>
              eventManager.send_event(
                events.HRMS_USER_MAPPING_BULK_CSV_UPLOAD_CLICKED_TFI
              )
            }
          >
            <PlainCard className={styles.dropbox}>
              <>
                <div className={styles.iconHolder}>
                  <Icon name="cloudUpload" />
                </div>
                <div className={styles.description}>
                  <Trans i18nKey="clickHereToBrowserFile">
                    Click {{here: 'here'}} to upload files
                  </Trans>
                </div>
                <div className={styles.subDescription}>
                  <Trans i18nKey="uploadDocumentsSupportedFileFormats">
                    Supported formats: {{fileFormats: '.csv .xls .xlsx'}}
                  </Trans>
                </div>
              </>
            </PlainCard>
          </label>
          <input
            type="file"
            id="csv-file"
            className={styles.hidden}
            accept={ACCEPTED_SHEET_EXTENSIONS}
            onChange={(e) => {
              if (!e.target.files || !e.target.files[0]) return
              handleSheetUpload(
                e.target.files[0],
                beforeSheetDataLoad,
                onSheetDataLoad
              )
              setFileName(e.target.files[0].name)
            }}
          />
        </div>
      )}
      {sampleCSVString && (
        <Button
          type={BUTTON_CONSTANTS.TYPE.TEXT}
          onClick={() => getDownloadCSV('sample.csv', sampleCSVString)}
        >
          {t('downloadSampleCSVFile')}
        </Button>
      )}
    </div>
  )
}

export default CSVUpload
