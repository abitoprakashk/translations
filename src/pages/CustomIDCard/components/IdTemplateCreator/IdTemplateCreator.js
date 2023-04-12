import React, {useEffect, useState, useRef} from 'react'
import {
  Breadcrumb,
  Button,
  BUTTON_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  TabGroup,
  Popup,
  Input,
} from '@teachmint/krayon'
import {useTranslation} from 'react-i18next'
import {generatePath, useHistory, useParams} from 'react-router-dom'
import LeftPanel from '../../../../components/TemplateGenerator/LeftPanel/LeftPanel'
import TemplateHtmlEditor from '../../../../components/TemplateGenerator/TemplateHTMLEditor/TemplateHtmlEditor'
import {templateFieldsSelector} from '../../../CustomCertificate/redux/CustomCertificate.selectors'
import {
  FRONT,
  BACK,
  ID_DESIGN,
  PREVIEW_SAVE,
  PREVIEW,
} from '../../CustomId.constants'
import styles from './IdTemplateCreator.module.css'
import {
  useEditorRef,
  usePageSettings,
  useTemplateData,
} from '../../../../components/TemplateGenerator/redux/TemplateGenerator.selectors'
import {useDispatch} from 'react-redux'
import {templatePageSettingsActions} from '../../../../components/TemplateGenerator/redux/TemplateGenerator.actionTypes'
import classNames from 'classnames'
import {
  CUSTOM_ID_CARD_ROOT_ROUTE,
  CUSTOM_ID_CARD_SUB_ROUTE,
} from '../../CustomId.routes'
import {
  generateHTMLSkeletonIDCard,
  generateIdHTMLTemplate,
  getHtmlForIndividualId,
} from '../../CustomId.utils'
import {
  getAllFieldsUsed,
  pageSizes,
  getAllImages,
} from '../../../../components/TemplateGenerator/TemplateGenerator.utils'
import {BACKGROUND, leftPanelItems} from './IdTemplateCreator.utils'
import {substituteTemplateVariables} from '../../../../components/TemplateGenerator/TemplateGenerator.utils'
import globalActions from '../../../../redux/actions/global.actions'
import {
  customIdPreviewSelector,
  customIdTemplateDetailsSelector,
  savedCustomIdTemplateSelector,
  updateCustomIdTemplateSelector,
} from '../../redux/CustomId.selector'
import CustomIdPreview from '../CustomIdPreview/CustomIdPreview'
import Loader from '../../../../components/Common/Loader/Loader'
import {toSnakeCasedKeysRecursive} from '../../../../utils/Helpers'
import {useCheckPermission} from '../../../../utils/Permssions'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'
import Permission from '../../../../components/Common/Permission/Permission'

const IdTemplateCreator = () => {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const {userType, templateId, isDefault: isDefaultTemplate} = useParams()
  const {design, orientation} = usePageSettings()
  const editorRef = useEditorRef()
  const templateFields = templateFieldsSelector()
  const currentTemplate = useTemplateData()
  const {data: customIdTemplateDetailsForEdit} =
    customIdTemplateDetailsSelector()
  const [updatedTemplateName, setUpdatedTemplateName] = useState('')

  const createPermission = useCheckPermission(
    PERMISSION_CONSTANTS.IdCardTemplateController_create_route_create
  )

  const name = currentTemplate?.name
  const previewType = useRef('')
  const history = useHistory()
  const {isLoading: saveLoader, data: saveTemplateId} =
    savedCustomIdTemplateSelector()
  const {isLoading: updateLoader, data: updateTemplateId} =
    updateCustomIdTemplateSelector()
  const {data: customIdPreview, isLoading: previewLoading} =
    customIdPreviewSelector()

  const [selectedSide, setSelectedSide] = useState(FRONT)
  const [templateData, setTemplateData] = useState()
  const [showExitWarning, setExitWarning] = useState(false)

  if (saveTemplateId || updateTemplateId)
    history.push(
      generatePath(CUSTOM_ID_CARD_SUB_ROUTE.VIEW_ALL, {
        userType,
      })
    )

  useEffect(() => {
    if (templateId) {
      setTemplateData({
        [FRONT]: {...customIdTemplateDetailsForEdit.frontTemplate},
        [BACK]: {...customIdTemplateDetailsForEdit.backTemplate},
      })
    } else
      setTemplateData({
        [FRONT]: {...currentTemplate, body: '', html: ''},
        [BACK]: {...currentTemplate, body: '', html: ''},
      })
    toggleFullScreen(true)
    return () => {
      dispatch(globalActions.customIdPreview.reset())
      dispatch(globalActions.updateCustomIdTemplate.reset())
      dispatch({type: templatePageSettingsActions.RESET_PAGE_SETTINGS})
    }
  }, [])

  useEffect(() => {
    if (isDefault()) setUpdatedTemplateName(`Copy of ${name}`)
  }, [name])

  const isDefault = () => {
    if (isDefaultTemplate == 'true') return true
    return false
  }

  const idTabOptions = [
    {label: t('customId.frontView'), id: FRONT},
    {label: t('customId.backView'), id: BACK},
  ]

  const toggleFullScreen = (hideLeftNav) => {
    const content = document.getElementsByClassName(
      'createTemplateContainer'
    )[0]
    if (hideLeftNav) {
      content?.classList.add(styles.fullScreenContainer)
    } else {
      content?.classList.remove(styles.fullScreenContainer)
    }
  }

  const onTabChange = (side) => {
    const activeSideContent = editorRef.getEditorContent()
    const activeTemplateData = {
      ...templateData[selectedSide],
      ...currentTemplate,
    }

    setTemplateData({
      ...templateData,
      [selectedSide]: {...activeTemplateData, body: activeSideContent},
    })

    setSelectedSide(side)
    dispatch({
      type: templatePageSettingsActions.SET_TEMPLATE,
      payload: templateData[side],
    })
    editorRef.resetEditor({contentAfterReset: templateData[side]?.body || ''})
  }

  const getLatestTemplateData = () => {
    const activeSideContent = editorRef.getEditorContent()
    const frontTemplate =
      selectedSide === FRONT
        ? {...currentTemplate, body: activeSideContent}
        : templateData[FRONT]

    const backTemplate =
      selectedSide === BACK
        ? {...currentTemplate, body: activeSideContent}
        : templateData[BACK] || ''

    if (design === ID_DESIGN.FRONT) return {frontTemplate}

    return {frontTemplate, backTemplate}
  }

  const htmlForPreview = () => {
    const idContent = getHtmlForIndividualId({
      ...getLatestTemplateData(),
      orientation,
    })
    let html = generateHTMLSkeletonIDCard({
      pageHeight: pageSizes.IDCARD[orientation].height,
      pageWidth: pageSizes.IDCARD[orientation].width,
      content: idContent,
    })
    return substituteTemplateVariables(html)
  }
  const handlePreview = () => {
    const html = htmlForPreview()
    const fieldsUsed = getAllFieldsUsed(html)
    const fields = {}
    Object.entries(fieldsUsed).map((value) => {
      const key = value[0],
        data = value[1]
      if (!(key in fields)) fields[key] = {}
      data.forEach((item) => {
        fields[key] = {
          ...fields[key],
          [item.id]: '',
        }
      })
    })
    dispatch(globalActions.customIdPreview.request({html, fields}))
    return html
  }

  const onSave = () => {
    let {frontTemplate, backTemplate} = getLatestTemplateData()
    frontTemplate.html = substituteTemplateVariables(
      generateIdHTMLTemplate(frontTemplate, orientation)
    )
    frontTemplate = toSnakeCasedKeysRecursive(frontTemplate)
    frontTemplate.fields = getAllFieldsUsed(frontTemplate.html)
    frontTemplate.image_urls = getAllImages(frontTemplate.html)

    if (design === ID_DESIGN.FRONT_BACK) {
      backTemplate.html = substituteTemplateVariables(
        generateIdHTMLTemplate(backTemplate, orientation)
      )
      backTemplate = toSnakeCasedKeysRecursive(backTemplate)
      backTemplate.fields = getAllFieldsUsed(backTemplate.html)
      backTemplate.image_urls = getAllImages(backTemplate.html)
    }

    const data = {front_template: frontTemplate, back_template: backTemplate}

    data.design = design
    if (templateId) {
      data.id = templateId
      data.front_template.name = updatedTemplateName || name
      if (backTemplate) data.back_template.name = updatedTemplateName || name
    }

    data.default = isDefault()
    data.user_type = userType.toUpperCase()
    data.from_default_template_id = isDefault() ? templateId : ''
    data.combined_html = htmlForPreview()
    if (!backTemplate) delete data.back_template
    let actionName = 'saveCustomIdTemplate'
    if (templateId && !isDefault()) actionName = 'updateCustomIdTemplate'

    dispatch(
      globalActions[actionName].request(data, () => {
        dispatch(globalActions.customIdTemplateList.request())
      })
    )
  }
  const handleFocus = (event) => event.target.select()

  return (
    <>
      <Loader show={previewLoading || saveLoader || updateLoader} />
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
              history.goBack()
            },
            body: t('exit'),
            type: BUTTON_CONSTANTS.TYPE.OUTLINE,
          },
          {
            id: 'save-btn',
            onClick: () => {
              onSave()
              setExitWarning(false)
            },
            body: t('customCertificate.saveTemplate'),
            type: BUTTON_CONSTANTS.TYPE.FILLED,
            category: BUTTON_CONSTANTS.CATEGORY.PRIMARY,
            isDisabled: !createPermission,
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
      <div className={classNames(styles.wrapper)}>
        {customIdPreview && (
          <CustomIdPreview
            url={customIdPreview}
            title={
              isDefault() ? (
                <Input
                  value={updatedTemplateName}
                  onChange={({value}) => setUpdatedTemplateName(value)}
                  classes={{wrapper: styles.headerInput}}
                  maxLength={30}
                  onFocus={handleFocus}
                  isRequired
                  autoFocus
                />
              ) : (
                `${name} ${t('preview').toLowerCase()}`
              )
            }
            onClose={() => {
              dispatch(globalActions.customIdPreview.reset())
            }}
            actionButtons={
              previewType.current === PREVIEW_SAVE
                ? [
                    {
                      body: t(
                        isDefault()
                          ? 'customCertificate.saveAsNew'
                          : templateId
                          ? 'customCertificate.updateTemplate'
                          : 'customCertificate.saveTemplate'
                      ),
                      onClick: () => {
                        // triggerEvent(
                        //   CERTIFICATE_EVENTS.CERTIFICATE_NEW_TEMPLATE_SAVED_TFI
                        // )
                        onSave()
                        dispatch(globalActions.customIdPreview.reset())
                      },
                      isDisabled:
                        (isDefault() && !updatedTemplateName) ||
                        !createPermission,
                      size: BUTTON_CONSTANTS.SIZE.SMALL,
                    },
                  ]
                : []
            }
          />
        )}
        <div className={styles.breadcrumb}>
          <Breadcrumb
            paths={[
              {
                label: t('customId.idCardTemplates'),
                to: generatePath(CUSTOM_ID_CARD_ROOT_ROUTE, {
                  userType,
                }),
                onClick: (e) => {
                  e?.preventDefault()
                  history.push(
                    generatePath(CUSTOM_ID_CARD_ROOT_ROUTE, {
                      userType,
                    })
                  )
                },
              },
              {
                label: templateData?.[FRONT]?.name,
              },
            ]}
          />
          <div className={styles.proceedButtonDiv}>
            <Permission
              permissionId={
                PERMISSION_CONSTANTS.IdCardTemplateController_preview_read
              }
            >
              <Button
                size={BUTTON_CONSTANTS.SIZE.SMALL}
                type={BUTTON_CONSTANTS.TYPE.OUTLINE}
                onClick={() => {
                  previewType.current = PREVIEW
                  handlePreview()
                }}
              >
                {t('preview')}
              </Button>
            </Permission>
            <Permission
              permissionId={
                PERMISSION_CONSTANTS.IdCardTemplateController_preview_read
              }
            >
              <Button
                size={BUTTON_CONSTANTS.SIZE.SMALL}
                onClick={() => {
                  previewType.current = PREVIEW_SAVE
                  handlePreview()
                }}
              >
                {t(
                  isDefault()
                    ? 'customCertificate.saveAsNew'
                    : templateId
                    ? 'customCertificate.updateTemplate'
                    : 'customCertificate.saveTemplate'
                )}
              </Button>
            </Permission>
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

        {templateFields && templateFields[userType] && (
          <div className={styles.templateEditor}>
            <div className={styles.leftPanelWrapper}>
              <LeftPanel
                panelItems={leftPanelItems(userType)}
                defaultActivePanel={BACKGROUND}
              />
            </div>
            <div className={styles.editorWrapper}>
              {design === ID_DESIGN.FRONT_BACK && (
                <div className={styles.frontBackTabgroupDiv}>
                  <TabGroup
                    tabOptions={idTabOptions}
                    selectedTab={selectedSide}
                    onTabClick={({id}) => onTabChange(id)}
                    showMoreTab={false}
                  />
                </div>
              )}
              <TemplateHtmlEditor toolbarMode="floating" />
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default IdTemplateCreator
