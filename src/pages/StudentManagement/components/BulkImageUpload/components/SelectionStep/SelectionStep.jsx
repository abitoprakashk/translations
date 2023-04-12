import {
  Button,
  BUTTON_CONSTANTS,
  Para,
  PARA_CONSTANTS,
  PlainCard,
} from '@teachmint/krayon'
import classNames from 'classnames'
import React, {useRef} from 'react'
import styles from '../../BulkImageUpload.module.css'
import imageUploadImg from '../../../../../../assets/images/icons/image-upload.png'
import {t} from 'i18next'
import {createPortal} from 'react-dom'
import FileUploadInstrutionText from '../../../../../../components/Common/FileUploadInstrutionText/FileUploadInstrutionText'

const helperTextRows = [
  t('bulkUploadPhotosHelperText1'),
  t('bulkUploadPhotosHelperText2'),
  t('bulkUploadPhotosHelperText3'),
  t('bulkUploadPhotosHelperText3'),
]

export default function SelectionStep({
  selectedClass,
  selectedSection,
  validatedFiles,
  setValidatedFiles,
  errorFiles,
  setErrorFiles,
  ALLOWED_EXTENSIONS,
  handleFileValidation,
  setOngoingStep,
  setShow,
  handleSubmit,
}) {
  const portalContainer = useRef(null)
  if (!portalContainer.current) {
    portalContainer.current = document.getElementById(
      'student-update-data-modal'
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
    if (files?.length) handleFileValidation(files)
  }

  return (
    <div onDragOver={handleDragOver} onDrop={handleDrop}>
      <PlainCard
        className={classNames(
          styles.dropbox,
          (!selectedClass || !selectedSection) && styles.dropboxDisabled
        )}
      >
        <img src={imageUploadImg} alt="" className={styles.uploadImage} />

        {validatedFiles?.length || errorFiles?.length ? (
          <div className={styles.fileUploadedInfoWrapper}>
            <Para>{`${
              (validatedFiles?.length || 0) + (errorFiles?.length || 0)
            } ${t('imagesSelected')}`}</Para>

            <div className={styles.removeBtnWrapper}>
              <Button
                type={BUTTON_CONSTANTS.TYPE.TEXT}
                category={BUTTON_CONSTANTS.CATEGORY.DESTRUCTIVE}
                onClick={() => {
                  setValidatedFiles(null)
                  setErrorFiles(null)
                }}
              >
                {t('remove')}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.description}>
              <Para
                textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}
                className={styles.hideInMobile}
              >
                {t('dragAndDropImages')}
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

            <input
              type="file"
              id="csv-file"
              className={styles.hidden}
              accept={ALLOWED_EXTENSIONS}
              multiple={true}
              onChange={(e) => {
                if (!e.target.files?.length) return
                handleFileValidation(e.target.files)
              }}
              disabled={!selectedClass || !selectedSection}
            />
          </>
        )}
      </PlainCard>

      {portalContainer.current &&
        createPortal(
          <>
            <Button
              type={BUTTON_CONSTANTS.TYPE.OUTLINE}
              onClick={() => setShow(false)}
            >
              {t('cancel')}
            </Button>

            <Button
              type={BUTTON_CONSTANTS.TYPE.FILLED}
              onClick={() => {
                if (errorFiles?.length > 0) setOngoingStep(2)
                else {
                  setOngoingStep(3)
                  handleSubmit()
                }
              }}
              isDisabled={!(validatedFiles?.length || errorFiles?.length)}
            >
              {t('upload')}
            </Button>
          </>,
          portalContainer.current
        )}

      <FileUploadInstrutionText
        heading={t('howToUploadStopsInBulk')}
        helperTextList={helperTextRows}
      />
    </div>
  )
}
