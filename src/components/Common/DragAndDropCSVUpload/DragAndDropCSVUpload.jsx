import React, {useState} from 'react'
import {useTranslation} from 'react-i18next'
import {
  Icon,
  Button,
  PlainCard,
  Para,
  BUTTON_CONSTANTS,
  Divider,
  PARA_CONSTANTS,
  ICON_CONSTANTS,
  Heading,
  HEADING_CONSTANTS,
} from '@teachmint/krayon'
import styles from './dragAndDropCSVUpload.module.css'
import {
  ACCEPTED_SHEET_EXTENSIONS,
  handleSheetUpload,
  SUPPORTED_SHEET_FORMATS,
} from '../../../utils/fileUtils'
import {createAndDownloadCSV, JSObjectToCSV} from '../../../utils/Helpers'
import sampleFileImg from './microsoft-excel.png'

function DragAndDropCSVUpload({
  beforeSheetDataLoad,
  onUpload,
  onRemove,
  sampleCSVObj,
  uploadHelperText,
}) {
  const [uploadedFile, setUploadedFile] = useState(null)
  const [isUploadComplete, setIsUploadComplete] = useState(false)
  const {t} = useTranslation()

  const onSheetDataLoad = (status, processedCSVObject) => {
    if (status) {
      setIsUploadComplete(true)
      onUpload(processedCSVObject)
    }
  }

  const handleFileUpload = (file) => {
    if (
      !file?.name ||
      !SUPPORTED_SHEET_FORMATS?.includes(file?.name?.split('.')?.pop())
    )
      return
    setUploadedFile(file)
    handleSheetUpload(file, beforeSheetDataLoad, onSheetDataLoad)
  }

  const onRemoveButtonClick = () => {
    setUploadedFile(null)
    setIsUploadComplete(false)
    onRemove()
  }

  const handleSampleCSVDownload = () => {
    createAndDownloadCSV(
      `${sampleCSVObj?.title}`,
      JSObjectToCSV(sampleCSVObj?.headers, sampleCSVObj?.rows)
    )
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const files = e.dataTransfer.files
    if (files && files.length) {
      handleFileUpload(files[0])
    }
  }

  return (
    <div>
      {uploadedFile && isUploadComplete ? (
        <PlainCard className={styles.uploadedFile}>
          <img src={sampleFileImg} height="60" width="60" />
          <Para>{uploadedFile?.name}</Para>
          <Button
            type={BUTTON_CONSTANTS.TYPE.TEXT}
            category={BUTTON_CONSTANTS.CATEGORY.DESTRUCTIVE}
            onClick={onRemoveButtonClick}
          >
            {t('remove')}
          </Button>
        </PlainCard>
      ) : (
        <div onDragOver={handleDragOver} onDrop={handleDrop}>
          <PlainCard className={styles.dropbox}>
            <div className={styles.iconHolder}>
              <Icon name="cloudUpload" />
            </div>
            <div className={styles.description}>
              <Para textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}>
                {t('dragAndDropCSV')}
              </Para>
              <label htmlFor="csv-file" className={styles.inputLabel}>
                <Para
                  textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}
                  type={PARA_CONSTANTS.TYPE.PRIMARY}
                  className={styles.hideInMobile}
                >
                  {t('browseThisDevice')}
                </Para>
                <Para
                  textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}
                  type={PARA_CONSTANTS.TYPE.PRIMARY}
                  className={styles.hideInLaptop}
                >
                  {t('browse')}
                </Para>
              </label>
            </div>
          </PlainCard>
          <input
            type="file"
            id="csv-file"
            className={styles.hidden}
            accept={ACCEPTED_SHEET_EXTENSIONS}
            onChange={(e) => {
              if (!e.target.files || !e.target.files[0]) return
              handleFileUpload(e.target.files[0])
            }}
          />
        </div>
      )}
      {sampleCSVObj && (
        <div className={styles.sampleCSV}>
          <Button
            type={BUTTON_CONSTANTS.TYPE.TEXT}
            classes={{label: styles.downloadSampleCSVButtonLabel}}
            onClick={handleSampleCSVDownload}
          >
            {t('clickHere')}
          </Button>
          <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
            {t('toDownloadSampleCSV')}
          </Heading>
        </div>
      )}
      {uploadHelperText && (
        <>
          <Divider spacing="20px" />
          <Para
            type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
            className={styles.helperTextHeading}
          >
            {uploadHelperText.heading}
          </Para>
          <div className={styles.helperTextRowsWrapper}>
            {uploadHelperText?.rows?.map((info) => (
              <div key={info} className={styles.helperTextrow}>
                <Icon
                  name="checkCircle"
                  type={ICON_CONSTANTS.TYPES.SUCCESS}
                  size={ICON_CONSTANTS.SIZES.XX_SMALL}
                />
                <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>{info}</Para>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default DragAndDropCSVUpload
