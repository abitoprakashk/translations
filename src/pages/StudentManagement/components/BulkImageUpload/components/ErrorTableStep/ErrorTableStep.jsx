import {
  Button,
  BUTTON_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  Para,
  PARA_CONSTANTS,
  Table,
} from '@teachmint/krayon'
import {t} from 'i18next'
import React, {useRef} from 'react'
import {createPortal} from 'react-dom'
import {BULK_IMAGE_UPLOAD_VALIDATION_TABLE_HEADERS} from '../../../../studentManagement.constants'
import styles from '../../BulkImageUpload.module.css'

const fileErrorTypes = {
  1: t('fileExtensionNotSupported'),
  2: t('enrolmentIDAlreadyExists'),
  3: t('enrolmentIDNotFound'),
  4: t('fileSizeIsTooLarge'),
}

export default function ErrorTableStep({
  validatedFiles,
  errorFiles,
  setShow,
  setOngoingStep,
  handleSubmit,
}) {
  const portalContainer = useRef(null)
  if (!portalContainer.current) {
    portalContainer.current = document.getElementById(
      'student-update-data-modal'
    )
  }
  const portalContainerLeft = useRef(null)
  if (!portalContainerLeft.current) {
    portalContainerLeft.current = document.getElementById(
      'student-update-data-modal-left'
    )
  }

  const getErrorRows = (errorFiles) => {
    const rows = []

    errorFiles?.forEach(({file, errorType}, i) => {
      rows.push({
        id: i,
        imageName: (
          <div>
            <Para type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}>{file?.name}</Para>
            <Para
              textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
              className={styles.hideInLaptop}
            >
              {fileErrorTypes[errorType]}
            </Para>
          </div>
        ),
        errorType: (
          <div className={styles.headingWrapper}>
            <Icon
              name="caution"
              type={ICON_CONSTANTS.TYPES.ERROR}
              size={ICON_CONSTANTS.SIZES.XX_SMALL}
            />
            <Para
              type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
              className={styles.hideInMobile}
            >
              {fileErrorTypes[errorType]}
            </Para>
          </div>
        ),
      })
    })

    return rows
  }

  return (
    <div>
      {errorFiles?.length > 0 && (
        <Table
          rows={getErrorRows(errorFiles)}
          cols={BULK_IMAGE_UPLOAD_VALIDATION_TABLE_HEADERS}
          classes={{table: styles.validationTable}}
        />
      )}

      {portalContainer.current &&
        createPortal(
          <div className={styles.footerWrapper}>
            <Button
              type={BUTTON_CONSTANTS.TYPE.OUTLINE}
              onClick={() => setOngoingStep(1)}
            >
              {t('back')}
            </Button>

            <div className={styles.footerRightWrapper}>
              <Button
                type={BUTTON_CONSTANTS.TYPE.OUTLINE}
                onClick={() => setShow(false)}
              >
                {t('cancel')}
              </Button>
              <Button
                type={BUTTON_CONSTANTS.TYPE.FILLED}
                category={BUTTON_CONSTANTS.CATEGORY.PRIMARY}
                onClick={() => {
                  setOngoingStep(3)
                  handleSubmit()
                }}
                isDisabled={!(validatedFiles?.length > 0)}
              >
                {t('SkipAndContinue')}
              </Button>
            </div>
          </div>,
          portalContainer.current
        )}
    </div>
  )
}
