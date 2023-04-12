import {
  Button,
  BUTTON_CONSTANTS,
  Checkbox,
  CHECKBOX_CONSTANTS,
  Datepicker,
  Divider,
  Heading,
  HEADING_CONSTANTS,
  Icon,
  IconFrame,
  ICON_CONSTANTS,
  ICON_FRAME_CONSTANTS,
  Input,
  INPUT_TYPES,
  Para,
  PARA_CONSTANTS,
  PlainCard,
} from '@teachmint/krayon'
import {useTranslation} from 'react-i18next'
import {
  MAX_VEHICLE_DOCUMENT_SIZE,
  VEHICLE_DOCUMENT_OPTIONS,
} from '../../constants'
import {useEffect, useState} from 'react'
import styles from './vehicleDocumentsForm.module.css'
import PreviewDocumentModal from '../../../../components/PreviewDocumentModal.jsx/PreviewDocumentModal'
import {DateTime} from 'luxon'
import {useSelector} from 'react-redux'

export default function DocumentForm({
  document,
  index,
  onDocumentAdd,
  onDocumentEdit,
  onDocumentDelete,
}) {
  const [documentData, setDocumentData] = useState(document || {})
  const [checkBoxData, setCheckBoxData] = useState({
    reminder_date: document?.reminder_date ? true : false,
    expiry_date: document?.expiry_date ? true : false,
  })
  const [isPreviewState, setIsPreviewState] = useState(document ? true : false)
  const [isEditState, setIsEditState] = useState(false)
  const [showDocPreview, setShowDocPreview] = useState(false)

  const {t} = useTranslation()

  useEffect(() => {
    setDocumentData(document || {})
    setIsPreviewState(document ? true : false)
    setIsEditState(false)
    setCheckBoxData({
      reminder_date: document?.reminder_date ? true : false,
      expiry_date: document?.expiry_date ? true : false,
    })
  }, [document])

  const handleInputChange = ({fieldName, value}) => {
    let newData = {...documentData}
    switch (fieldName) {
      case 'reminder_date':
        if (!value) delete newData[fieldName]
        else value = DateTime.fromJSDate(value).startOf('day').toSeconds()
        break
      case 'expiry_date':
        if (!value) delete newData[fieldName]
        else value = DateTime.fromJSDate(value).startOf('day').toSeconds()
        break
      case 'blob':
        if (value?.size > MAX_VEHICLE_DOCUMENT_SIZE) {
          value = null
          delete newData[fieldName]
        }
    }
    if (value) newData[fieldName] = value
    setDocumentData(newData)
  }

  const handleCheckboxChange = ({fieldName, value}) => {
    let newCheckboxData = {...checkBoxData}
    newCheckboxData[fieldName] = value
    if (!value) handleInputChange({fieldName: fieldName, value: ''})
    setCheckBoxData(newCheckboxData)
  }

  const handleSaveDocument = () => {
    isEditState
      ? onDocumentEdit(documentData, index)
      : onDocumentAdd(documentData)
    setIsPreviewState(true)
  }

  const handlePreviewDocument = () => {
    setShowDocPreview(true)
  }

  const instituteTimeZone = useSelector(
    (state) => state?.instituteInfo?.timezone
  )

  const epochToLocaleTimeSring = (epochTime) => {
    return new Date(epochTime * 1000).toLocaleString('en-US', {
      timeZone: instituteTimeZone,
      dateStyle: 'short',
    })
  }

  const getPreviewContent = () => {
    const row = (title, desc) => (
      <div className={styles.previewStateRow}>
        <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>{title}</Para>
        <Para
          type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
          className={styles.textOverflow}
        >
          {desc}
        </Para>
      </div>
    )
    return (
      <div>
        <div className={styles.previewStateHeader}>
          <div className={styles.headerLeft}>
            <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.SMALL}>
              {`${t('document')} ${index + 1}`}
            </Heading>
            <Button
              type={BUTTON_CONSTANTS.TYPE.TEXT}
              onClick={onDocumentDelete}
            >
              <Icon
                size={ICON_CONSTANTS.SIZES.X_SMALL}
                name="delete1"
                type={ICON_CONSTANTS.TYPES.ERROR}
              />
            </Button>
          </div>
          <Button
            type={BUTTON_CONSTANTS.TYPE.TEXT}
            onClick={() => {
              setIsEditState(true)
              setIsPreviewState(false)
            }}
          >
            {t('edit')}
          </Button>
        </div>
        <PlainCard className={styles.documentDetailsCard}>
          {row(t('documentType'), documentData?.type)}
          <Divider spacing="0px" />
          {row(
            t('document'),
            documentData?.blob?.name ||
              documentData?.public_url?.split('/')?.pop()
          )}
          <Divider spacing="0px" />
          {row(
            t('expiresOn'),
            documentData?.expiry_date
              ? epochToLocaleTimeSring(documentData?.expiry_date)
              : '-'
          )}
        </PlainCard>
        {documentData?.reminder_date && (
          <PlainCard className={styles.reminderCard}>
            <IconFrame
              size={ICON_FRAME_CONSTANTS.SIZES.LARGE}
              type={ICON_FRAME_CONSTANTS.TYPES.INVERTED}
            >
              <Icon size={ICON_CONSTANTS.SIZES.XX_SMALL} name="alarm" />
            </IconFrame>
            <div>
              <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
                {t('reminderSetOn')}
              </Para>
              <Para type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}>
                {epochToLocaleTimeSring(documentData?.reminder_date)}
              </Para>
            </div>
          </PlainCard>
        )}
      </div>
    )
  }

  return (
    <div className={styles.documentFormWrapper}>
      {isPreviewState ? (
        getPreviewContent()
      ) : (
        <div>
          <Heading
            textSize={HEADING_CONSTANTS.TEXT_SIZE.SMALL}
            className={styles.addNewDocument}
          >
            {isEditState
              ? `${t('document')} ${index + 1}`
              : t('addNewDocument')}
          </Heading>
          <div className={styles.inputsWrapper}>
            <Input
              type={INPUT_TYPES.DROPDOWN}
              isRequired={true}
              title={t('documentType')}
              fieldName="type"
              options={VEHICLE_DOCUMENT_OPTIONS}
              selectedOptions={documentData?.type || ''}
              onChange={handleInputChange}
              placeholder={t('select')}
            />
            <Input
              type={INPUT_TYPES.FILE}
              title={t('document')}
              id={`${index}-vehicleFileInput`}
              infoMsg={t('staffFileHelperText')}
              showMsg={true}
              fileName={
                documentData?.blob?.name ||
                documentData?.public_url?.split('/')?.pop() ||
                ''
              }
              isRequired={true}
              fieldName="blob"
              value={documentData?.blob}
              onChange={handleInputChange}
              acceptableTypes={'.jpeg, .jpg, .pdf, .png'}
              placeholder={t('staffFilePlaceholder')}
              classes={{wrapper: styles.fileInputWrapper}}
            />
            {/* <div>
              <Checkbox
                size={CHECKBOX_CONSTANTS.SIZE.SMALL}
                fieldName="reminder_date"
                isSelected={checkBoxData?.reminder_date}
                handleChange={handleCheckboxChange}
                classes={{wrapper: styles.checkboxWrapper}}
              >
                <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
                  {t('setReminder')}
                </Para>
              </Checkbox>
              {checkBoxData?.reminder_date ? (
                <Datepicker
                  inputProps={{placeholder: t('selectDate')}}
                  closeOnChange
                  onChange={(val) => {
                    handleInputChange({fieldName: 'reminder_date', value: val})
                  }}
                  value={
                    documentData?.reminder_date
                      ? DateTime.fromSeconds(
                          documentData?.reminder_date
                        ).toJSDate()
                      : ''
                  }
                />
              ) : null}
            </div> */}
            <div>
              <Checkbox
                size={CHECKBOX_CONSTANTS.SIZE.SMALL}
                fieldName="expiry_date"
                isSelected={checkBoxData?.expiry_date}
                handleChange={handleCheckboxChange}
                classes={{wrapper: styles.checkboxWrapper}}
              >
                <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
                  {t('setExpiryDate')}
                </Para>
              </Checkbox>
              {checkBoxData?.expiry_date ? (
                <Datepicker
                  inputProps={{placeholder: t('selectDate')}}
                  closeOnChange
                  onChange={(val) =>
                    handleInputChange({fieldName: 'expiry_date', value: val})
                  }
                  value={
                    documentData?.expiry_date
                      ? DateTime.fromSeconds(
                          documentData?.expiry_date
                        ).toJSDate()
                      : ''
                  }
                />
              ) : null}
            </div>
          </div>
        </div>
      )}
      <Button
        type={BUTTON_CONSTANTS.TYPE.OUTLINE}
        onClick={isPreviewState ? handlePreviewDocument : handleSaveDocument}
        classes={{button: styles.footerButton}}
        isDisabled={
          !(
            isPreviewState ||
            (documentData?.type &&
              (documentData?.blob || documentData?.public_url))
          )
        }
      >
        {isPreviewState ? t('previewDocument') : t('saveDocument')}
      </Button>
      {showDocPreview && (
        <PreviewDocumentModal
          showModal={showDocPreview}
          setShowModal={setShowDocPreview}
          src={documentData?.blob || documentData?.public_url}
        />
      )}
    </div>
  )
}
