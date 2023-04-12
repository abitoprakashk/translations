import React from 'react'
import {useTranslation, Trans} from 'react-i18next'
import {useDispatch} from 'react-redux'
import {Icon, Button} from '@teachmint/krayon'
import styles from './CSVUpload.module.css'

import {
  ACCEPTED_SHEET_EXTENSIONS,
  handleSheetUpload,
} from '../../../utils/fileUtils'
import {showErrorToast} from '../../../redux/actions/commonAction'
import Permission from '../Permission/Permission'

const CSVUpload = ({
  headingText,
  downloadButtonText,
  downloadSampleCSVFile,
  beforeSheetDataLoad,
  handleCSV,
  hasExisting,
  onlyText,
  permissions,
}) => {
  const {t} = useTranslation()
  const dispatch = useDispatch()

  const preHandleCSV = (success, csvStr) => {
    if (!success) {
      dispatch(showErrorToast(t('wrongFileType')))
      return
    }
    handleCSV(success, csvStr)
  }

  return (
    <>
      <div className={styles.aboveSectionContainer}>
        <div>{headingText || `Bulk ${hasExisting ? 'Update' : 'Upload'}`}</div>
        {permissions?.downloadPermission ? (
          <Permission permissionId={permissions.downloadPermission}>
            <Button
              type="text"
              prefixIcon="download"
              onClick={downloadSampleCSVFile}
            >
              {downloadButtonText || `Download List`}
            </Button>
          </Permission>
        ) : (
          <Button
            type="text"
            prefixIcon="download"
            onClick={downloadSampleCSVFile}
          >
            {downloadButtonText || `Download List`}
          </Button>
        )}
      </div>
      <div>
        <label
          htmlFor="csv-file"
          // onClick={() => {
          //   trackEvent(`UPLOAD_${userType.toUpperCase()}_CSV_CLICKED`)
          // }}
        >
          <div className={styles.dropbox}>
            <div className={styles.iconHolder}>
              <Icon name="cloudUpload" />
            </div>
            <div className={styles.description}>
              <Trans i18nKey="clickHereToBrowserFile">
                Click <span className="tm-cr-bl-2">here</span> to upload files
              </Trans>
            </div>
            <div className={styles.subDescription}>{t('supportsFiles')}</div>
          </div>
        </label>

        {permissions?.uploadPermission ? (
          <Permission permissionId={permissions.downloadPermission}>
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
                  preHandleCSV,
                  onlyText
                )
                e.target.value = null
              }}
            />
          </Permission>
        ) : (
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
                preHandleCSV,
                onlyText
              )
              e.target.value = null
            }}
          />
        )}
      </div>
    </>
  )
}

export default CSVUpload
