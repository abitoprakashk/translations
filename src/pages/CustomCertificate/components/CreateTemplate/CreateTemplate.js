import React, {useCallback, useEffect, useRef, useState} from 'react'
import TemplateGeneratorWrapper from '../../../../components/TemplateGenerator/TemplateGeneratorWrapper'
import {
  Breadcrumb,
  Button,
  BUTTON_CONSTANTS,
  Icon,
  Popup,
  ICON_CONSTANTS,
  Input,
} from '@teachmint/krayon'
import styles from './CreateTemplate.module.css'
import {
  useEditorRef,
  useTemplateData,
} from '../../../../components/TemplateGenerator/redux/TemplateGenerator.selectors'
import {useDispatch} from 'react-redux'
import {Trans, useTranslation} from 'react-i18next'
import globalActions from '../../../../redux/actions/global.actions'
import {
  eventManagerSelector,
  getGlobalCertificateData,
} from '../../redux/CustomCertificate.selectors'
import Loader from '../../../../components/Common/Loader/Loader'
import DocumentPreviewModal from '../DocumentPreviewModal/DocumentPreviewModal'
import {toSnakeCasedKeysRecursive} from '../../../../utils/Helpers'
import {generatePath, useHistory, useParams} from 'react-router-dom'
import {CUSTOM_CERTIFICATE_SUB_ROUTES} from '../../CustomCertificates.routes'
import {MAX_IMAGE_COUNT} from '../../CustomCertificate.constants'
import classNames from 'classnames'
import {orientation} from '../../../../components/TemplateGenerator/TemplateGenerator.constants'
import {templatePageSettingsActions} from '../../../../components/TemplateGenerator/redux/TemplateGenerator.actionTypes'
import {
  PREVIEW,
  PREVIEW_SAVE,
} from '../../pages/GeneratedDocuments/GeneratedDocuments.constants'
import {BACKGROUND} from './CreateTemplate.constant'
import {leftPanelItems} from './CreateTemplate.utils'
import {CERTIFICATE_EVENTS} from '../../CustomCertificate.events'
import {getAllImages} from '../../../../components/TemplateGenerator/TemplateGenerator.utils'

const CreateTemplate = ({isEdit}) => {
  const [isPreviewOpen, setPreviewModal] = useState(false)
  const [showImageCountWarning, setImageCountWarning] = useState(false)
  const [isfullscreenMode, setFullScreenMode] = useState(true)
  const [showExitWarning, setExitWarning] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [updatedTemplateName, setUpdatedTemplateName] = useState('')

  const previewType = useRef('')

  const history = useHistory()
  const {userType, type} = useParams()
  const dispatch = useDispatch()
  const editorRef = useEditorRef()
  const {t} = useTranslation()

  const panelItems = useCallback(() => leftPanelItems(userType), [])

  const {
    pageSettings,
    name,
    backgroundConfig,
    defaultTemplate,
    _id,
    watermark,
  } = useTemplateData()

  const eventManager = eventManagerSelector()

  const {customTemplatePreview, saveDocumentTemplate, updateDocumentTemplate} =
    getGlobalCertificateData()
  const {isLoading, data: previewFile} = customTemplatePreview
  const {isLoading: saveLoader, data: saveTemplateId} = saveDocumentTemplate
  const {isLoading: updateLoader} = updateDocumentTemplate

  const toggleFullScreen = (hideLeftNav) => {
    const content = document.getElementsByClassName(
      'createTemplateContainer'
    )[0]
    setFullScreenMode(hideLeftNav)
    if (hideLeftNav) {
      content?.classList.add(styles.fullScreenContainer)
    } else {
      content?.classList.remove(styles.fullScreenContainer)
    }
  }

  useEffect(() => {
    if (defaultTemplate) setUpdatedTemplateName(`Copy of ${name}`)
  }, [name])

  useEffect(() => {
    if (isEdit && !_id) {
      history.push(
        generatePath(CUSTOM_CERTIFICATE_SUB_ROUTES.USER_TYPE, {
          userType: userType,
        })
      )
    }
    toggleFullScreen(true)
    return () => {
      toggleFullScreen(false)
      dispatch(globalActions.updateDocumentTemplate.reset())
      dispatch(globalActions.saveDocumentTemplate.reset())
      dispatch(globalActions.customTemplatePreview.reset())
      dispatch(globalActions.templateDetails.reset())
      dispatch({type: templatePageSettingsActions.RESET_PAGE_SETTINGS})
    }
  }, [])

  useEffect(() => {
    if (saveTemplateId) dispatch(globalActions.templateList.request())
  }, [saveTemplateId])

  useEffect(() => {
    if (previewFile) togglePreview()
  }, [previewFile])

  const togglePreview = () => {
    setPreviewModal(!isPreviewOpen)
  }

  const onPreview = () => {
    const content = editorRef?.getCompleteHTML()
    const fields = editorRef?.getFieldsUsed()
    const formatedFieldsWithValue = {}
    const images = getAllImages(content)
    if (images.length > MAX_IMAGE_COUNT) {
      setImageCountWarning(true)
      return
    }
    Object.entries(fields).map((value) => {
      const key = value[0],
        data = value[1]
      if (!(key in formatedFieldsWithValue)) formatedFieldsWithValue[key] = {}
      data.forEach((item) => {
        formatedFieldsWithValue[key] = {
          ...formatedFieldsWithValue[key],
          [item.id]: '',
        }
      })
    })

    dispatch(
      globalActions.customTemplatePreview.request({
        template_html: content,
        fields: formatedFieldsWithValue,
      })
    )
  }
  const refreshList = () => {
    dispatch(globalActions.templateList.request())
  }

  const onSave = () => {
    const fields = editorRef?.getFieldsUsed()
    const body = editorRef?.getEditorContent()
    const html = editorRef?.getCompleteHTML()

    const data = {
      template: {
        body,
        html,
        name,
        backgroundConfig,
        imageUrls: getAllImages(html),
        pageSettings,
        watermark,
      },
      type: type.toUpperCase(),
      userType: userType.toUpperCase(),
      fromDefaultTemplateId: '',
    }
    if (isEdit) {
      data.id = _id
      data.default = defaultTemplate
      data.template.name = updatedTemplateName || name
      data.fromDefaultTemplateId = defaultTemplate ? _id : ''
    }
    const convertedData = toSnakeCasedKeysRecursive(data)
    convertedData.template.fields = {...fields}

    const actionToDispatch =
      !defaultTemplate && isEdit
        ? 'updateDocumentTemplate'
        : 'saveDocumentTemplate'
    dispatch(
      globalActions[actionToDispatch].request(convertedData, () => {
        refreshList()
        setIsSaved(true)
        triggerEvent(CERTIFICATE_EVENTS.CERTIFICATE_NEW_TEMPLATE_SAVED_TFI, {
          template_name: updatedTemplateName || name,
        })
      })
    )
  }

  const handleFocus = (event) => event.target.select()

  const getHeading = () => {
    return isEdit ? (
      <>
        <Trans i18nKey="customCertificate.editTemplateHeading">
          Edit {{type}} template
        </Trans>{' '}
        ({name})
      </>
    ) : (
      <Trans i18nKey="customCertificate.createTemplateHeading">
        Create {{type}} template
      </Trans>
    )
  }

  const triggerEvent = (eventName, data = {}) => {
    eventManager.send_event(eventName, {
      user_screen: userType,
      template_type: defaultTemplate ? 'created_from_default' : 'new_template',
      certificate_id: _id,
      template_edit: isEdit ? true : false,
      ...data,
    })
  }

  const handleRouteSelection = (e, route) => {
    e?.preventDefault()
    history.push(route)
  }

  return (
    <>
      <div
        className={classNames(styles.wrapper, {
          [styles.fitContent]:
            !isfullscreenMode &&
            pageSettings.orientation === orientation.LANDSCAPE,
        })}
      >
        <Popup
          isOpen={showExitWarning}
          classes={{popup: styles.cardWidth}}
          showCloseIcon={true}
          onClose={() => setExitWarning(false)}
          shouldCloseOnEsc
          actionButtons={[
            {
              id: 'exit-btn',
              onClick: () => {
                triggerEvent(
                  CERTIFICATE_EVENTS.CERTIFICATE_NEW_TEMPLATE_EXIT_CLICKED
                )
                history.goBack()
              },
              body: t('exit'),
              type: BUTTON_CONSTANTS.TYPE.OUTLINE,
            },
            {
              id: 'save-btn',
              onClick: () => {
                triggerEvent(
                  CERTIFICATE_EVENTS.CERTIFICATE_NEW_TEMPLATE_SAVED_TFI
                )
                onSave()
                setExitWarning(false)
              },
              body: t('customCertificate.saveTemplate'),
              type: BUTTON_CONSTANTS.TYPE.FILLED,
              category: BUTTON_CONSTANTS.CATEGORY.PRIMARY,
            },
          ]}
          header={t('customCertificate.exitWithoutSaving')}
          headerIcon={
            <Icon
              name="exitToApp"
              type={ICON_CONSTANTS.TYPES.ERROR}
              size={ICON_CONSTANTS.SIZES.SMALL}
            />
          }
        >
          <div className={styles.savePopContent}>
            {t('customCertificate.exitSubText')}
          </div>
        </Popup>
        <Popup
          isOpen={showImageCountWarning}
          classes={{popup: styles.cardWidth}}
          showCloseIcon={false}
          shouldCloseOnEsc
          actionButtons={[
            {
              id: 'okay-btn',
              onClick: () => {
                setImageCountWarning(false)
              },
              body: t('okay'),
              type: BUTTON_CONSTANTS.TYPE.FILLED,
              category: BUTTON_CONSTANTS.CATEGORY.PRIMARY,
            },
          ]}
          header={t('customCertificate.addMoreImages')}
          headerIcon="caution"
        >
          <div className={styles.savePopContent}>
            <Trans i18nKey="'customCertificate.imageLimitExceeded'">
              You can add upto {{MAX_IMAGE_COUNT}} images only, to add more
              images, please delete other images first.
            </Trans>
          </div>
        </Popup>
        <Popup
          isOpen={isSaved}
          classes={{popup: styles.cardWidth}}
          showCloseIcon={true}
          shouldCloseOnEsc={false}
          onClose={() => setIsSaved(false)}
          actionButtons={[
            {
              id: 'back-btn',
              onClick: () => {
                triggerEvent(
                  CERTIFICATE_EVENTS.CERTIFICATE_BACK_TO_LISTING_PAGE_CLICKED_TFI
                )
                history.goBack()
              },
              body: t('customCertificate.goBack'),
              type: BUTTON_CONSTANTS.TYPE.OUTLINE,
              category: BUTTON_CONSTANTS.CATEGORY.PRIMARY,
            },
            {
              id: 'redirect-btn',
              onClick: () => {
                triggerEvent(
                  CERTIFICATE_EVENTS.NEW_TEMPLATE_CERTIFICATE_SELECT_USER_CLICKED_TFI,
                  {
                    user_screen: userType,
                    template_name: updatedTemplateName || name,
                  }
                )
                history.push(
                  generatePath(CUSTOM_CERTIFICATE_SUB_ROUTES.SELECT_USER, {
                    userType,
                    type,
                    templateId: saveTemplateId || _id,
                  })
                )
              },
              body: t(
                userType === 'student'
                  ? 'customCertificate.selectStudents'
                  : 'customCertificate.selectStaff'
              ),
              type: BUTTON_CONSTANTS.TYPE.FILLED,
              category: BUTTON_CONSTANTS.CATEGORY.PRIMARY,
            },
          ]}
          header={t('customCertificate.savedSuccessHeader')}
          headerIcon={
            <Icon
              name="checkCircle1"
              type={ICON_CONSTANTS.TYPES.SUCCESS}
              size={ICON_CONSTANTS.SIZES.SMALL}
              version={ICON_CONSTANTS.VERSION.OUTLINED}
            />
          }
        >
          <div className={styles.savePopContent}>
            {t('customCertificate.savedSuccessSub')}
          </div>
        </Popup>
        <Loader show={isLoading || saveLoader || updateLoader} />
        <DocumentPreviewModal
          isOpen={isPreviewOpen}
          url={previewFile}
          onClose={() => {
            togglePreview()
            dispatch(globalActions.customTemplatePreview.reset())
          }}
          header={
            defaultTemplate ? (
              <div className={styles.defaultTemplateHeader}>
                <Input
                  value={updatedTemplateName}
                  onChange={({value}) => setUpdatedTemplateName(value)}
                  classes={{wrapper: styles.headerInput}}
                  maxLength={30}
                  onFocus={handleFocus}
                  isRequired
                  autoFocus
                />
                <span
                  onClick={() => {
                    if (!updatedTemplateName)
                      setUpdatedTemplateName(`Copy of ${name}`)
                    togglePreview()
                  }}
                >
                  <Icon name="close" size={ICON_CONSTANTS.SIZES.XX_SMALL} />
                </span>
              </div>
            ) : (
              `${name} ${t('preview').toLowerCase()}`
            )
          }
          actionButtons={
            previewType.current === PREVIEW_SAVE
              ? [
                  {
                    body: t(
                      defaultTemplate
                        ? 'customCertificate.saveAsNew'
                        : isEdit
                        ? 'customCertificate.updateTemplate'
                        : 'customCertificate.saveTemplate'
                    ),
                    onClick: () => {
                      triggerEvent(
                        CERTIFICATE_EVENTS.CERTIFICATE_NEW_TEMPLATE_SAVED_TFI
                      )
                      onSave()
                      togglePreview()
                    },
                    isDisabled: defaultTemplate && !updatedTemplateName,
                    size: BUTTON_CONSTANTS.SIZE.SMALL,
                  },
                ]
              : []
          }
        />

        <div className={styles.breadcrumb}>
          <Breadcrumb
            paths={[
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
                label: getHeading(),
              },
            ]}
          />
          <div className={styles.proceedButtonDiv}>
            <Button
              size={BUTTON_CONSTANTS.SIZE.SMALL}
              type={BUTTON_CONSTANTS.TYPE.OUTLINE}
              onClick={() => {
                previewType.current = PREVIEW
                triggerEvent(
                  CERTIFICATE_EVENTS.CERTIFICATE_PREVIEW_TEMPLATE_CLICKED_TFI,
                  {user_screen: 'create_new_template'}
                )
                onPreview()
              }}
            >
              {t('preview')}
            </Button>
            <Button
              size={BUTTON_CONSTANTS.SIZE.SMALL}
              onClick={() => {
                previewType.current = PREVIEW_SAVE
                triggerEvent(
                  CERTIFICATE_EVENTS.CERTIFICATE_PREVIEW_TEMPLATE_CLICKED_TFI,
                  {
                    user_screen: 'create_new_template',
                    preview_before_save: true,
                  }
                )
                onPreview()
              }}
            >
              {t(
                defaultTemplate
                  ? 'customCertificate.saveAsNew'
                  : isEdit
                  ? 'update'
                  : 'save'
              )}
            </Button>
            <Button
              size={BUTTON_CONSTANTS.SIZE.SMALL}
              type={BUTTON_CONSTANTS.TYPE.OUTLINE}
              onClick={() => {
                setExitWarning(true)
              }}
              classes={{button: styles.iconButton}}
            >
              <Icon
                size={ICON_CONSTANTS.SIZES.XX_SMALL}
                name={'close'}
                type={ICON_CONSTANTS.TYPES.SECONDARY}
              />
            </Button>
          </div>
        </div>

        <div className={styles.TemplateGeneratorWrapper}>
          <TemplateGeneratorWrapper
            panelItems={panelItems()}
            defaultActivePanel={BACKGROUND}
            redirectURL={generatePath(CUSTOM_CERTIFICATE_SUB_ROUTES.USER_TYPE, {
              userType,
            })}
          />
        </div>
      </div>
    </>
  )
}

export default CreateTemplate
