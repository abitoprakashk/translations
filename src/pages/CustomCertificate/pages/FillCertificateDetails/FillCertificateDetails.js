import React, {useEffect, useState} from 'react'
import {
  HeaderTemplate,
  HEADING_CONSTANTS,
  Alert,
  ALERT_CONSTANTS,
  Input,
  Button,
  BUTTON_CONSTANTS,
  Divider,
  Heading,
  Popup,
} from '@teachmint/krayon'
import {useDispatch} from 'react-redux'
import {
  useParams,
  useLocation,
  generatePath,
  useHistory,
} from 'react-router-dom'
import globalActions from '../../../../redux/actions/global.actions'
import {
  customTemplateFieldValuesSelector,
  eventManagerSelector,
  generatedDocumentStatusSelector,
  singleGeneratedDocumentIdSelector,
  templateDetailsSelector,
  templateListSelector,
  templatePreviewSelector,
} from '../../redux/CustomCertificate.selectors'
import {Trans, useTranslation} from 'react-i18next'
import {CUSTOM_CERTIFICATE_SUB_ROUTES} from '../../CustomCertificates.routes'
import styles from './FillCertificateDetails.module.css'
import PDFViewer from '../../../../components/Common/PdfViewer/PdfViewer'
import Loader from '../../../../components/Common/Loader/Loader'
import {TEMPLATE_STATUS} from '../../CustomCertificate.constants'
import usePolling from '../../../../utils/CustomHooks/usePolling'
import {pdfPrint} from '../../../../utils/Helpers'
import {downloadFromLink} from '../../../../utils/fileUtils'
import {orientation} from '../../../../components/TemplateGenerator/TemplateGenerator.constants'
import classNames from 'classnames'
import {CERTIFICATE_EVENTS} from '../../CustomCertificate.events'

const FillCertificateDetails = () => {
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const history = useHistory()
  const {userType, type, templateId} = useParams()
  const {search} = useLocation()
  const templatePreview = templatePreviewSelector()
  const singleGenerateRequestId = singleGeneratedDocumentIdSelector()
  const generatedDocumentStatus = generatedDocumentStatusSelector()
  const templateList = templateListSelector()
  const eventManager = eventManagerSelector()

  const {data: templateDetails, isLoading: templateDataLoading} =
    templateDetailsSelector()

  const [templateValues, setTemplateValues] = useState({})
  const [loading, setLoading] = useState(false)
  const queryParams = new URLSearchParams(search)
  const userId = queryParams.get('userId')

  const {clear, start, intervalId} = usePolling(
    () => {
      dispatch(
        globalActions.generatedDocumentStatus.request([
          singleGenerateRequestId.data,
        ])
      )
    },
    {delay: 1500}
  )

  const {_id, default: isDefault} = templateDetails || {}
  const {fields} = templateDetails?.template || {}
  const templateFieldValues = customTemplateFieldValuesSelector()

  useEffect(() => {
    const templateData = templateList[userType].find(
      (item) => item._id == templateId
    )
    dispatch(
      globalActions.templateDetails.request({
        id: templateId,
        isDefault: templateData.default,
      })
    )
    return () => {
      dispatch(globalActions.customTemplatePreview.reset())
      dispatch(globalActions.generateSingleCertificate.reset())
      dispatch(globalActions.generatedDocumentStatus.reset())
      dispatch(globalActions.customTemplateFieldValues.reset())
    }
  }, [])

  useEffect(() => {
    if (_id)
      dispatch(
        globalActions.customTemplateFieldValues.request({
          iid: userId,
          INSTITUTE: fields?.INSTITUTE?.map((item) => item.id) || [],
          IMIS: fields?.IMIS?.map((item) => item.id) || [],
        })
      )
  }, [_id])

  useEffect(() => {
    const values = templateFieldValues?.data || {IMIS: {}}
    const CUSTOM = {}
    if (fields?.CUSTOM?.length) {
      fields?.CUSTOM.map((item) => {
        CUSTOM[item.id] = ''
      })
    }
    setTemplateValues({...values, CUSTOM})
  }, [templateFieldValues?.data])

  useEffect(() => {
    if (
      (fields?.IMIS?.length || fields?.CUSTOM?.length) &&
      (Object.keys(templateValues?.IMIS || {}).length ||
        fields?.CUSTOM?.length) &&
      !templatePreview.data &&
      !templatePreview.isLoading &&
      _id &&
      Object.keys(templateValues)?.length
    ) {
      dispatch(
        globalActions.customTemplatePreview.request({
          template_id: _id,
          default: isDefault,
          fields: templateValues,
        })
      )
    } else if (!fields?.IMIS?.length && !fields?.CUSTOM?.length && _id) {
      dispatch(
        globalActions.customTemplatePreview.request({
          template_id: _id,
          default: isDefault,
          fields: {},
        })
      )
    }
  }, [templateValues])

  useEffect(() => {
    if (singleGenerateRequestId.data && !intervalId) {
      start()
      setLoading(true)
    }
    if (
      generatedDocumentStatus &&
      generatedDocumentStatus[0]?.file.status == TEMPLATE_STATUS.COMPLETED
    ) {
      clear()
      setLoading(false)
      triggerEvent(CERTIFICATE_EVENTS.CERTIFICATE_NEW_GENERATED_TFI, {
        user_screen: 'fill_details',
      })
    }
  }, [singleGenerateRequestId, generatedDocumentStatus])

  const previewDocument = () => {
    const container = document.getElementById('fillDetails')
    container.scrollIntoView()
    triggerEvent(CERTIFICATE_EVENTS.PREVIEW_CLICKED_TFI, {
      user_screen: 'fill_details',
    })
    dispatch(
      globalActions.customTemplatePreview.request({
        template_id: _id,
        default: isDefault,
        fields: templateValues,
      })
    )
  }

  const generate = () => {
    const obj = {
      template_id: _id,
      default: isDefault,
      iid: userId,
      data: {
        ...templateValues,
      },
    }
    dispatch(globalActions.generateSingleCertificate.request(obj))
    triggerEvent(
      CERTIFICATE_EVENTS.CERTIFICATE_GENERATE_CONFIRMATION_CLICKED_TFI,
      {
        screen: 'fill_details',
      }
    )
  }

  const onChange = ({fieldName, value}) => {
    const values = {...templateValues}
    const [category, key] = fieldName.split('.')
    values[category][key] = value
    setTemplateValues({...values})
  }

  const goBack = () => {
    dispatch(globalActions.generateSingleCertificate.reset())
    dispatch(globalActions.generatedDocumentStatus.reset())
    history.goBack()
  }

  const handleRouteSelection = (e, route) => {
    e?.preventDefault()
    history.push(route)
  }

  const triggerEvent = (eventName, data = {}) => {
    eventManager.send_event(eventName, {
      user_screen: userType,
      template_type: templateDetails?.default ? 'default' : 'my_templates',
      certificate_id: templateId,
      user_id: userId,
      ...data,
    })
  }

  return (
    <>
      <div className={styles.wrapper}>
        <Loader
          show={
            templatePreview?.isLoading ||
            templateFieldValues?.isLoading ||
            singleGenerateRequestId?.isLoading ||
            templateDataLoading ||
            loading
          }
        />
        <Popup
          isOpen={
            generatedDocumentStatus &&
            generatedDocumentStatus[0]?.file.status ===
              TEMPLATE_STATUS.COMPLETED
          }
          classes={{
            header: styles.popupHeader,
            content: styles.popupContent,
          }}
          onClose={() => {
            goBack()
          }}
          actionButtons={[
            {
              body: t('print'),
              id: 'print',
              onClick: () => {
                triggerEvent(CERTIFICATE_EVENTS.PRINT_CERTIFICATE_CLICKED_TFI, {
                  screen: 'fill_details',
                })
                pdfPrint(generatedDocumentStatus[0]?.file?.url)
                goBack()
              },
              type: 'outline',
            },
            {
              id: 'download',
              onClick: () => {
                triggerEvent(
                  CERTIFICATE_EVENTS.DOWNLOAD_CERTIFICATE_CLICKED_TFI,
                  {screen: 'fill_details'}
                )
                downloadFromLink(
                  generatedDocumentStatus[0]?.file?.url,
                  'document.pdf'
                )
                goBack()
              },
              body: t('download'),
              type: BUTTON_CONSTANTS.TYPE.FILLED,
              category: BUTTON_CONSTANTS.CATEGORY.PRIMARY,
            },
          ]}
          headerIcon="checkCircle"
          header={`${t(type)} ${t('customCertificate.generatedSuccess')}`}
        >
          {t('customCertificate.generatedSuccessBody')}
        </Popup>
        <HeaderTemplate
          breadcrumbObj={{
            className: '',
            paths: [
              {
                label: t('customCertificate.docsAndCertificatesHeading'),
                to: generatePath(CUSTOM_CERTIFICATE_SUB_ROUTES.USER_TYPE, {
                  userType,
                }),
                onClick: (e) => {
                  handleRouteSelection(
                    e,
                    generatePath(CUSTOM_CERTIFICATE_SUB_ROUTES.USER_TYPE, {
                      userType,
                    })
                  )
                },
              },
              {
                label: templateDetails?.template?.name,
                to: generatePath(CUSTOM_CERTIFICATE_SUB_ROUTES.SELECT_USER, {
                  userType,
                  type,
                  templateId,
                }),
                onClick: (e) => {
                  handleRouteSelection(
                    e,
                    generatePath(CUSTOM_CERTIFICATE_SUB_ROUTES.SELECT_USER, {
                      userType,
                      type,
                      templateId,
                    })
                  )
                },
              },
              {
                label: (
                  <Trans i18nKey="customCertificate.fillDetails">
                    Enter details to complete {{type}}
                  </Trans>
                ),
              },
            ],
          }}
          mainHeading={
            <Trans i18nKey="customCertificate.fillDetails">
              Enter details to complete {{type}}
            </Trans>
          }
        />
        <div className={styles.fillDetailsContainer} id="fillDetails">
          {((fields?.IMIS && fields?.IMIS?.length) ||
            fields?.CUSTOM?.length > 0) && (
            <div className={styles.fieldsContainer}>
              <Heading
                textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}
                weight={HEADING_CONSTANTS.WEIGHT.BOLD}
              >
                {`${t(userType)} ${t('information')}`}
              </Heading>
              <Alert
                type={ALERT_CONSTANTS.TYPE.INFO}
                content={t('customCertificate.fillDetailsAlert')}
                hideClose
                className={styles.alert}
              />
              <div className={styles.inputContainer}>
                {fields?.IMIS?.length > 0 &&
                  fields?.IMIS.map((item) => {
                    return (
                      <Input
                        key={item.id}
                        title={item.name}
                        value={templateValues?.IMIS?.[item.id]}
                        placeholder={item.name}
                        fieldName={`IMIS.${item.id}`}
                        onChange={onChange}
                      />
                    )
                  })}
                {fields?.CUSTOM?.length > 0 &&
                  fields?.CUSTOM.map((item) => {
                    return (
                      <Input
                        key={item.id}
                        title={item.name}
                        value={templateValues?.CUSTOM?.[item.id]}
                        placeholder={item.name}
                        fieldName={`CUSTOM.${item.id}`}
                        onChange={onChange}
                      />
                    )
                  })}
              </div>
              <div>
                <Divider />
                <Button
                  prefixIcon="refresh"
                  classes={{button: styles.previewButton}}
                  type={BUTTON_CONSTANTS.TYPE.OUTLINE}
                  onClick={previewDocument}
                >
                  <span>{t('showPreview')}</span>
                </Button>
              </div>
            </div>
          )}

          <div
            className={classNames({
              [styles.landscapePreview]:
                templateDetails?.page_settings?.orientation ===
                orientation.LANDSCAPE,
              [styles.portraitPreview]:
                templateDetails?.page_settings?.orientation ===
                orientation.PORTRAIT,
            })}
          >
            <PDFViewer
              file={templatePreview?.data}
              scale={
                templateDetails?.page_settings?.orientation ===
                orientation.LANDSCAPE
                  ? 0.94
                  : 1
              }
            />
          </div>
        </div>
      </div>
      <footer className={styles.footer}>
        <div>
          <Button size={BUTTON_CONSTANTS.SIZE.MEDIUM} onClick={generate}>
            {t('customCertificate.generate')}
          </Button>
        </div>
      </footer>
    </>
  )
}

export default FillCertificateDetails
