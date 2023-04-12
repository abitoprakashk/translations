import React, {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {KebabMenu, Icon, PlainCard} from '@teachmint/krayon'
import PDFViewer from '../../../../components/Common/PdfViewer/PdfViewer'
import {DocumentViewModal} from '../DocumentViewModal/DocumentViewModal'
import Permission from '../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'
import {events} from '../../../../utils/EventsConstants'
import styles from './DocumentFields.module.css'
import {
  getDocumentPersonaMemberAction,
  resetDocumentPersona,
  updateMemberDocAction,
  uploadLinkAction,
} from '../../Redux/DocumentUpload.actions'
import {showToast} from '../../../../redux/actions/commonAction'
import {t} from 'i18next'

const DocumentFields = ({
  field,
  isFieldInMember,
  personaMember,
  setShowMemberLoader,
  persona,
  successAction,
  screenName = '',
}) => {
  const {eventManager} = useSelector((state) => state)
  const docUrl = personaMember?.[field.key_id]
  const [showModal, setShowModal] = useState(false)
  const htmlFor = 'upload_doc' + field.key_id
  const reuploadHtmlFor = 're-upload' + field.key_id
  let inputTypes = ''
  field.permissible_values.map((type) => {
    inputTypes = inputTypes + '.' + type + ','
  })
  const dispatch = useDispatch()

  const docUploadSuccess = (publicUrl, field) => {
    updateLink(field, publicUrl)
    successAction?.()
    eventManager.send_event(events.PROFILE_DOCUMENT_UPLOADED_TFI, {
      user_screen: personaMember?.type === 2 ? 'teacher' : 'student',
      document_type: field?.label,
    })
  }

  const docUploadFailure = (displayToast) => {
    if (displayToast === true) {
      dispatch(showToast({type: 'error', message: t('genericErrorMessage')}))
    }
    setShowMemberLoader?.(false)
  }

  const refreshPersona = (imemberiD) => {
    dispatch(resetDocumentPersona())
    dispatch(getDocumentPersonaMemberAction(imemberiD))
    setShowMemberLoader?.(false)
  }

  const uploadDocument = (file, field) => {
    const fileSize = file.size
    if (Number(fileSize) > 5000000) {
      dispatch(
        showToast({
          type: 'error',
          message: t('uploadDocumentsMaxFileSizeError'),
        })
      )
      return
    }
    let type = file.type
    type = type.split('/')
    const extension = '.' + type[type.length - 1]
    let newFileName = ''

    let fileName = file.name
    if (fileName.includes('.')) {
      let nameSplit = fileName.split('.')
      nameSplit[nameSplit.length - 1] = extension
      newFileName = nameSplit.join('')
    } else {
      newFileName = fileName + extension
    }

    setShowMemberLoader?.(true)
    dispatch(
      updateMemberDocAction({
        file: file,
        field: field,
        persona: persona,
        fileName: newFileName,
        successCallback: docUploadSuccess,
        failureCallback: docUploadFailure,
      })
    )
  }

  const deleteDocument = (field) => {
    setShowMemberLoader?.(true)
    updateLink(field, '')
  }

  const updateLink = (field, docVal) => {
    const keyId = field.key_id
    const imemberiD = String(personaMember?._id)
    const payload = {
      key_id: keyId,
      imember_id: imemberiD,
      doc_url: docVal,
      refreshPersona: refreshPersona,
    }
    successAction?.()
    dispatch(uploadLinkAction(payload))
  }

  const isUrlImage = () => {
    if (isFieldInMember) {
      const imageExtensions = ['jpg', 'png', 'jpeg']
      const keyId = field.key_id
      const keyIdType = keyId + '_type'
      if (keyIdType in personaMember) {
        const fieldType = personaMember?.[keyIdType]
        if (imageExtensions.includes(fieldType)) {
          return {isImage: true, extension: fieldType}
        } else {
          return {isImage: false, extension: fieldType}
        }
      } else {
        const urlSplit = docUrl.split('.')
        const extension = urlSplit[urlSplit.length - 1]
        if (imageExtensions.includes(extension)) {
          return {isImage: true, extension: extension}
        } else {
          return {isImage: false, extension: extension}
        }
      }
    }
    return {isImage: false, extension: ''}
  }
  const {isImage, extension} = isUrlImage()
  const options = [
    {
      // content: 'Re-Upload',
      handleClick: () => {},
      content: (
        <>
          <Permission
            permissionId={
              PERMISSION_CONSTANTS.userDocumentController_updateDocument_update
            }
          >
            <label
              htmlFor={reuploadHtmlFor}
              className={styles.reuploadLabel}
              onClick={(e) => {
                e.stopPropagation()
                eventManager.send_event(
                  events.PROFILE_DOCUMENT_RE_UPLOAD_CLICKED_TFI,
                  {
                    user_screen:
                      personaMember?.type === 2 ? 'teacher' : 'student',
                    document_type: field?.label,
                  }
                )
              }}
            >
              <Icon name="uploadAlt" size="x_s" />
              <input
                type="file"
                className={styles.uploadInput}
                accept={inputTypes}
                id={
                  personaMember?.verification_status === 4
                    ? ''
                    : reuploadHtmlFor
                }
                onChange={(e) => {
                  uploadDocument(e.target.files[0], field)
                }}
              />
              <span className={styles.reuploadTitle}>Re-upload</span>
            </label>
          </Permission>
        </>
      ),
    },
    {
      content: (
        <>
          <Permission
            permissionId={
              PERMISSION_CONSTANTS.userDocumentController_updateDocument_update
            }
          >
            <label
              className={styles.reuploadLabel}
              onClick={(e) => {
                if (personaMember?.verification_status === 4) {
                  return
                }
                deleteDocument(field)
                e.stopPropagation()
                eventManager.send_event(
                  events.PROFILE_DOCUMENT_REMOVE_CLICKED_TFI,
                  {
                    user_screen:
                      personaMember?.type === 2 ? 'teacher' : 'student',
                    document_type: field?.label,
                  }
                )
              }}
            >
              <Icon name="delete1" size="x_s" type="error" />
              <span className={styles.deleteTitle}>Remove</span>
            </label>
          </Permission>
        </>
      ),
    },
  ]

  const bodyComponent = () => {
    if (!isFieldInMember) {
      return (
        <Permission
          permissionId={
            PERMISSION_CONSTANTS.userDocumentController_updateDocument_update
          }
        >
          <label
            className={styles.iconLabel}
            htmlFor={htmlFor}
            onClick={(e) => {
              e.stopPropagation()
              eventManager.send_event(
                events.PROFILE_DOCUMENT_UPLOAD_NODE_CLICKED_TFI,
                {
                  user_screen:
                    personaMember?.type === 2 ? 'teacher' : 'student',
                  document_type: field?.label,
                }
              )
            }}
          >
            <div className={styles.addFileBodyWrapper}>
              <div className={styles.iconWrapper}>
                <Icon name="add" type="primary" />
                <input
                  id={personaMember?.verification_status === 4 ? '' : htmlFor}
                  type="file"
                  className={styles.uploadInput}
                  accept={inputTypes}
                  onChange={(e) => {
                    uploadDocument(e.target.files[0], field)
                    eventManager.send_event(
                      events.PROFILE_DOCUMENT_UPLOAD_CLICKED_TFI,
                      {
                        user_screen:
                          personaMember?.type === 2 ? 'teacher' : 'student',
                        document_type: field?.label,
                      }
                    )
                  }}
                />
              </div>
            </div>
          </label>
        </Permission>
      )
    } else {
      return (
        <div
          className={styles.bodyWrapper}
          onClick={(e) => {
            if (e.target?.nodeName !== 'SPAN') {
              setShowModal(true)
              eventManager.send_event(
                events.PROFILE_DOCUMENT_PREVIEW_CLICKED_TFI,
                {
                  user_screen:
                    personaMember?.type === 2 ? 'teacher' : 'student',
                  document_type: field?.label,
                }
              )
            }
          }}
        >
          {screenName !== 'profileOverviewPage' && (
            <div className={styles.kebabMenuWrapper}>
              <KebabMenu isVertical={true} options={options} />
            </div>
          )}
          {isImage ? (
            <img src={docUrl} className={styles.imageDesign} />
          ) : (
            <PDFViewer
              file={docUrl}
              scale={1}
              classes={{page: styles.pdfDesign}}
            />
          )}
        </div>
      )
    }
  }

  return (
    <>
      <PlainCard className={styles.cardDesign}>
        {bodyComponent()}
        <div className={styles.titleWrapper}>{field.label}</div>
      </PlainCard>

      <DocumentViewModal
        isOpen={showModal}
        docUrl={personaMember?.[field.key_id]}
        title={field.label}
        onClose={() => {
          setShowModal(false)
        }}
        isImage={isImage}
        personaMember={personaMember}
        field={field}
        extension={extension}
      />
    </>
  )
}

export default DocumentFields
