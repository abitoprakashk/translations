import {
  Badges,
  BADGES_CONSTANTS,
  Button,
  BUTTON_CONSTANTS,
  Heading,
  HEADING_CONSTANTS,
  Para,
  PARA_CONSTANTS,
  PlainCard,
  Popup,
  Table,
} from '@teachmint/krayon'
import React, {useRef} from 'react'
import {Trans} from 'react-i18next'
import {BULK_IMAGE_UPLOAD_STATUS_TABLE_HEADERS} from '../../../../studentManagement.constants'
import styles from '../../BulkImageUpload.module.css'
import imageUploadSuccessImg from '../../../../../../assets/images/icons/image-upload-success.png'
import {createPortal} from 'react-dom'
import {t} from 'i18next'
import {useDispatch} from 'react-redux'
import {
  showErrorOccuredAction,
  showLoadingAction,
} from '../../../../../../redux/actions/commonAction'
import {utilsGetUsersList} from '../../../../../../routes/dashboard'
import {INSTITUTE_MEMBER_TYPE} from '../../../../../../constants/institute.constants'
import {instituteStudentListAction} from '../../../../../../redux/actions/instituteInfoActions'

export default function UploadStep({
  validatedFiles,
  successFilesList,
  errorFilesList,
  showCancelUploadPopup,
  setShowCancelUploadPopup,
  setShow,
}) {
  const dispatch = useDispatch()

  const portalContainer = useRef(null)
  if (!portalContainer.current) {
    portalContainer.current = document.getElementById(
      'student-update-data-modal'
    )
  }

  const getFileUploadSuccess = (successFileCount, validatedFiles) =>
    Math.round((successFileCount / (validatedFiles?.length || 1)) * 100) + '%'

  const getUploadStatusRows = (successFilesList, errorFilesList) => {
    const rows = []

    validatedFiles?.forEach(({file}, i) => {
      let status = 0

      if (successFilesList?.includes(file?.name)) status = 1
      if (errorFilesList?.includes(file?.name)) status = 2

      rows.push({
        id: i,
        imageName: file?.name,
        status: (
          <Badges
            inverted={true}
            type={
              status === 0
                ? BADGES_CONSTANTS.TYPE.WARNING
                : status === 1
                ? BADGES_CONSTANTS.TYPE.SUCCESS
                : BADGES_CONSTANTS.TYPE.ERROR
            }
            label={t(
              status === 0 ? 'pending' : status === 1 ? 'success' : 'failed'
            )}
          />
        ),
      })
    })

    return rows
  }

  const getInstituteStudents = () => {
    dispatch(showLoadingAction(true))
    utilsGetUsersList({type: [INSTITUTE_MEMBER_TYPE.STUDENT]})
      .then(({status, obj}) => {
        if (status) dispatch(instituteStudentListAction(obj))
      })
      .catch(() => dispatch(showErrorOccuredAction(true)))
      .finally(() => dispatch(showLoadingAction(false)))
  }

  return (
    <div>
      <PlainCard className={styles.dropbox}>
        <div className={styles.uploadFileAnimationWrapper}>
          <div
            className={styles.uploadFileAnimationContent}
            style={{
              height: getFileUploadSuccess(
                successFilesList?.length || 0,
                validatedFiles
              ),
            }}
          ></div>
          <Heading
            textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}
            className={styles.uploadFileAnimationHeading}
          >
            {getFileUploadSuccess(
              successFilesList?.length || 0,
              validatedFiles
            )}
          </Heading>
        </div>
        <Para>
          <Trans
            i18nKey="imageUploadingStatus"
            values={{
              currentCount: successFilesList?.length,
              totalCount: validatedFiles?.length || 0,
            }}
          />
        </Para>
      </PlainCard>
      <Table
        rows={getUploadStatusRows(successFilesList, errorFilesList)}
        cols={BULK_IMAGE_UPLOAD_STATUS_TABLE_HEADERS}
        classes={{table: styles.validationTable}}
      />
      {showCancelUploadPopup &&
        successFilesList?.length !== validatedFiles?.length &&
        validatedFiles?.length !== 0 && (
          <Popup
            isOpen={true}
            onClose={() => setShowCancelUploadPopup(false)}
            header={`${t('cancelUpload')}?`}
            actionButtons={[
              {
                id: 'activate-btn',
                onClick: () => setShowCancelUploadPopup(false),
                body: t('continueUpload'),
                type: BUTTON_CONSTANTS.TYPE.OUTLINE,
                classes: {button: styles.cancelButton},
              },
              {
                id: 'cancel-btn',
                onClick: () => setShow(false),
                body: t('cancel'),
                category: BUTTON_CONSTANTS.CATEGORY.DESTRUCTIVE,
              },
            ]}
          >
            <Para
              type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
              className={styles.uploadCancelContent}
            >
              {t('bulkImageCancelUploadDesc')}
            </Para>
          </Popup>
        )}

      {successFilesList?.length === validatedFiles?.length &&
        validatedFiles?.length !== 0 && (
          <Popup
            isOpen={true}
            onClose={() => {
              getInstituteStudents()
              setShow(false)
            }}
            header={t('dataUpdated')}
            actionButtons={[]}
            shouldCloseOnOverlayClick={false}
          >
            <div className={styles.successPopupBody}>
              <img
                src={imageUploadSuccessImg}
                alt="success"
                className={styles.successImg}
              />
              <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.X_SMALL}>
                {t('studentDataUpdatedSuccessfully')}
              </Heading>
            </div>
          </Popup>
        )}
      {portalContainer.current &&
        createPortal(
          <>
            <Button
              type={BUTTON_CONSTANTS.TYPE.FILLED}
              category={BUTTON_CONSTANTS.CATEGORY.PRIMARY}
              onClick={() => {
                if (validatedFiles?.length === successFilesList?.length)
                  setShow(false)
                else setShowCancelUploadPopup(true)
              }}
            >
              {t('close')}
            </Button>
          </>,
          portalContainer.current
        )}
    </div>
  )
}
