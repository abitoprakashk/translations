import {
  Breadcrumb,
  BUTTON_CONSTANTS,
  HeaderTemplate,
  Heading,
  HEADING_CONSTANTS,
  Divider,
  ICON_CONSTANTS,
  Icon,
  Popup,
} from '@teachmint/krayon'
import React, {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useDispatch} from 'react-redux'
import {generatePath, useHistory, useParams} from 'react-router-dom'
import Loader from '../../../../components/Common/Loader/Loader'
import globalActions from '../../../../redux/actions/global.actions'
import CustomIdPreview from '../../components/CustomIdPreview/CustomIdPreview'
import {ACTIVE, STUDENT} from '../../CustomId.constants'
import {
  CUSTOM_ID_CARD_ROOT_ROUTE,
  CUSTOM_ID_CARD_SUB_ROUTE,
} from '../../CustomId.routes'
import {
  getTemplateListSelector,
  customIdDefaultPreviewSelector,
  savedCustomIdTemplateSelector,
} from '../../redux/CustomId.selector'
import IdTemplateCard from '../../components/IdTemplateCard/IdTemplateCard'
import styles from './ViewAllTemplatesId.module.css'
import {templatePageSettingsActions} from '../../../../components/TemplateGenerator/redux/TemplateGenerator.actionTypes'
import {useCheckPermission} from '../../../../utils/Permssions'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'

const ViewAllTemplatesId = () => {
  const {userType} = useParams()
  const history = useHistory()
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const {data: defaultPreview, isLoading: defaultPreviewLoading} =
    customIdDefaultPreviewSelector()
  const [previewDoc, setDocPreview] = useState()
  const {data: templateList, isLoading: templateListLoading} =
    getTemplateListSelector(userType)
  const {data: saveTemplateId} = savedCustomIdTemplateSelector()

  const updatePermission = useCheckPermission(
    PERMISSION_CONSTANTS.IdCardTemplateController_update_route_update
  )
  const generatePermission = useCheckPermission(
    PERMISSION_CONSTANTS.IdCardDocumentController_generate_single_create
  )
  const createPermission = useCheckPermission(
    PERMISSION_CONSTANTS.IdCardTemplateController_create_route_create
  )
  useEffect(() => {
    if (defaultPreview)
      setDocPreview({
        ...previewDoc,
        url: defaultPreview,
      })
    else setDocPreview(null)
  }, [defaultPreview])

  useEffect(() => {
    dispatch(globalActions.customIdTemplateList.request())
    dispatch({type: templatePageSettingsActions.RESET_PAGE_SETTINGS})
  }, [])

  const myTemplates = templateList?.filter((template) => !template.default)
  const activeMyTemplates = myTemplates?.filter(
    (item) => item.status === ACTIVE
  )
  const inactiveTemplates = myTemplates?.filter((item) => item.status != ACTIVE)
  const defaultTemplates = templateList?.filter((template) => template.default)

  const selectTemplate = () => {
    dispatch(
      globalActions.setActiveTemplate.request(
        {
          id: (previewDoc && previewDoc?.id) || saveTemplateId,
          default: previewDoc?.isDefault || false,
        },
        () => dispatch(globalActions.customIdTemplateList.request())
      )
    )
  }

  const closePopup = () => {
    dispatch(globalActions.saveCustomIdTemplate.reset())
  }

  return (
    <div className={styles.wrapper}>
      <Loader show={templateListLoading || defaultPreviewLoading} />
      <Popup
        isOpen={saveTemplateId}
        classes={{popup: styles.cardWidth}}
        showCloseIcon={true}
        shouldCloseOnEsc={false}
        onClose={closePopup}
        actionButtons={[
          {
            id: 'cancel-btn',
            onClick: () => {
              // triggerEvent(
              //   CERTIFICATE_EVENTS.CERTIFICATE_BACK_TO_LISTING_PAGE_CLICKED_TFI
              // )
              closePopup()
            },
            body: t('cancel'),
            type: BUTTON_CONSTANTS.TYPE.OUTLINE,
            category: BUTTON_CONSTANTS.CATEGORY.PRIMARY,
          },
          {
            id: 'redirect-btn',
            onClick: () => {
              // triggerEvent(
              //   CERTIFICATE_EVENTS.NEW_TEMPLATE_CERTIFICATE_SELECT_USER_CLICKED_TFI,
              //   {
              //     user_screen: userType,
              //     template_name: updatedTemplateName || name,
              //   }
              // )
              selectTemplate()
              history.push(
                generatePath(CUSTOM_ID_CARD_SUB_ROUTE.GENERATE, {
                  templateId: previewDoc?.id || saveTemplateId,
                  isDefault: previewDoc?.isDefault || false,
                  userType,
                })
              )
              closePopup()
            },
            body: t('customId.generate'),
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
          {t(
            userType === STUDENT
              ? 'customId.savedSuccessSubStudent'
              : 'customId.savedSuccessSubStaff'
          )}
        </div>
      </Popup>
      <CustomIdPreview
        {...previewDoc}
        onClose={() => {
          dispatch(globalActions.customIdDefaultPreview.reset())

          setDocPreview(null)
        }}
        actionButtons={[
          {
            id: 'edit-btn',
            onClick: () => {
              dispatch(globalActions.customIdDefaultPreview.reset())
              history.push(
                generatePath(CUSTOM_ID_CARD_SUB_ROUTE.EDIT, {
                  userType,
                  templateId: previewDoc.id,
                  isDefault: previewDoc.isDefault,
                })
              )
            },
            body: t('edit'),
            type: BUTTON_CONSTANTS.TYPE.OUTLINE,
            isDisabled: !updatePermission,
          },
          {
            id: 'generate-btn',
            onClick: () => {
              selectTemplate()
              dispatch(globalActions.customIdDefaultPreview.reset())
              history.push(
                generatePath(CUSTOM_ID_CARD_SUB_ROUTE.GENERATE, {
                  userType,
                  templateId: previewDoc.id,
                  isDefault: previewDoc.isDefault,
                })
              )
            },
            body: t('customCertificate.generate'),
            type: BUTTON_CONSTANTS.TYPE.FILLED,
            category: BUTTON_CONSTANTS.CATEGORY.PRIMARY,
            isDisabled: !generatePermission,
          },
        ]}
      />
      <div>
        <Breadcrumb
          paths={[
            {
              label: t('customId.idCards'),
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
              label: `${t('customId.allTemplates')} ${userType}s`,
            },
          ]}
        />
      </div>
      <div>
        <HeaderTemplate
          mainHeading={`${t('customId.allTemplates')} ${userType}s`}
          actionButtons={[
            {
              onClick: () => {
                history.push(
                  generatePath(CUSTOM_ID_CARD_SUB_ROUTE.CREATE, {
                    userType,
                  })
                )
              },
              type: BUTTON_CONSTANTS.TYPE.OUTLINE,
              size: BUTTON_CONSTANTS.SIZE.MEDIUM,
              children: t('customId.createTemplate'),
              isDisabled: !createPermission,
            },
          ]}
        />
      </div>
      {activeMyTemplates?.length > 0 && (
        <div>
          <div className={styles.sectionHead}>
            <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
              {`${t('customId.myTemplates')} (${activeMyTemplates.length})`}
            </Heading>
          </div>
          <div className={styles.templateList}>
            {activeMyTemplates.map((template) => (
              <IdTemplateCard
                showPreview={setDocPreview}
                key={template._id}
                template={template}
              />
            ))}
          </div>
          <Divider />
        </div>
      )}
      {defaultTemplates?.length > 0 && (
        <div>
          <div className={styles.sectionHead}>
            <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
              {`${t('customId.defaultTemplates')} (${defaultTemplates.length})`}
            </Heading>
          </div>
          <div className={styles.templateList}>
            {defaultTemplates.map((template) => (
              <IdTemplateCard
                showPreview={setDocPreview}
                key={template._id}
                template={template}
              />
            ))}
          </div>
        </div>
      )}
      {inactiveTemplates?.length > 0 && (
        <div>
          <Divider />
          <div className={styles.sectionHead}>
            <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
              {`${t('customId.templateArchive')} (${inactiveTemplates.length})`}
            </Heading>
          </div>
          <div className={styles.templateList}>
            {inactiveTemplates.map((template) => (
              <IdTemplateCard
                showPreview={setDocPreview}
                key={template._id}
                template={template}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ViewAllTemplatesId
