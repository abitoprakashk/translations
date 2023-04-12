import {
  Button,
  BUTTON_CONSTANTS,
  HeaderTemplate,
  Heading,
  HEADING_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  Popup,
  TabGroup,
} from '@teachmint/krayon'
import React, {useEffect, useState} from 'react'
import {t} from 'i18next'
import {useDispatch} from 'react-redux'
import {generatePath, useHistory, useParams} from 'react-router-dom'
import Loader from '../../../../components/Common/Loader/Loader'
import globalActions from '../../../../redux/actions/global.actions'
import {ACTIVE, STAFF, STUDENT} from '../../CustomId.constants'
import {
  CUSTOM_ID_CARD_ROOT_ROUTE,
  CUSTOM_ID_CARD_SUB_ROUTE,
} from '../../CustomId.routes'
import {
  customIdDefaultPreviewSelector,
  getTemplateListSelector,
  savedCustomIdTemplateSelector,
} from '../../redux/CustomId.selector'
import styles from './IdTemplatesOverview.module.css'
import IdTemplateCard from '../../components/IdTemplateCard/IdTemplateCard'
import CustomIdPreview from '../../components/CustomIdPreview/CustomIdPreview'
import {templatePageSettingsActions} from '../../../../components/TemplateGenerator/redux/TemplateGenerator.actionTypes'
import {useCheckPermission} from '../../../../utils/Permssions'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'
import Permission from '../../../../components/Common/Permission/Permission'

export const TAB_OPTION = [
  {
    id: STUDENT,
    label: t('students'),
  },
  {
    id: STAFF,
    label: t('staff'),
  },
]

const IdTemplatesOverview = () => {
  const dispatch = useDispatch()
  const {userType} = useParams()
  const history = useHistory()
  const [activeTab, setActiveTab] = useState('')
  const [previewDoc, setDocPreview] = useState()
  const {data: saveTemplateId} = savedCustomIdTemplateSelector()
  const {data: templateList, isLoading: templateListLoading} =
    getTemplateListSelector(userType)
  const {data: defaultPreview, isLoading: defaultPreviewLoading} =
    customIdDefaultPreviewSelector()
  const myTemplates = templateList?.filter((template) => !template.default)
  const activeMyTemplates = myTemplates?.filter(
    (item) => item.status === ACTIVE
  )
  const inActiveMyTemplates = myTemplates?.filter(
    (item) => item.status != ACTIVE
  )
  const defaultTemplates = templateList?.filter((template) => template.default)

  const updatePermission = useCheckPermission(
    PERMISSION_CONSTANTS.IdCardTemplateController_update_route_update
  )
  const generatePermission = useCheckPermission(
    PERMISSION_CONSTANTS.IdCardDocumentController_generate_single_create
  )

  useEffect(() => {
    dispatch({type: templatePageSettingsActions.RESET_PAGE_SETTINGS})
    dispatch(globalActions.updateCustomIdTemplate.reset())
  }, [])

  useEffect(() => {
    if (defaultPreview)
      setDocPreview({
        ...previewDoc,
        url: defaultPreview,
      })
    else setDocPreview(null)
  }, [defaultPreview])

  useEffect(() => {
    setActiveTab(userType)
  }, [userType])

  const onTabClick = ({id}) => {
    // eventManager.send_event(
    //   id === STUDENT
    //     ? CERTIFICATE_EVENTS.CERTIFICATE_STUDENT_TAB_CLICKED_TFI
    //     : CERTIFICATE_EVENTS.CERTIFICATE_STAFF_TAB_CLICKED_TFI
    // )
    history.push(
      generatePath(CUSTOM_ID_CARD_ROOT_ROUTE, {
        userType: id,
      })
    )
  }

  const closePopup = () => {
    dispatch(globalActions.saveCustomIdTemplate.reset())
  }

  const createNewTemplate = () => {
    // eventManager.send_event(
    //   CERTIFICATE_EVENTS.CERTIFICATE_CREATE_NEW_TEMPLATE_CLICKED_TFI,
    //   {user_screen: userType}
    // )

    history.push({
      pathname: generatePath(CUSTOM_ID_CARD_SUB_ROUTE.CREATE, {
        userType,
      }),
      search: `templateType=idcard${userType}`,
    })
  }

  const selectTemplate = () => {
    dispatch(
      globalActions.setActiveTemplate.request(
        {
          id: previewDoc?.id || saveTemplateId,
          default: previewDoc?.isDefault || false,
        },
        () => {
          dispatch(globalActions.customIdTemplateList.request())
        }
      )
    )
  }

  return (
    <>
      <Loader show={defaultPreviewLoading} />
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
      <div className={styles.wrapper}>
        <Loader show={templateListLoading} />
        <CustomIdPreview
          {...previewDoc}
          onClose={() => {
            setDocPreview(null)
            dispatch(globalActions.customIdDefaultPreview.reset())
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
              isDisabled: !updatePermission,
              body: t('edit'),
              type: BUTTON_CONSTANTS.TYPE.OUTLINE,
            },
            {
              id: 'generate-btn',
              isDisabled: !generatePermission,
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
              body: t('customId.generate'),
              type: BUTTON_CONSTANTS.TYPE.FILLED,
              category: BUTTON_CONSTANTS.CATEGORY.PRIMARY,
            },
          ]}
        />
        <HeaderTemplate mainHeading={t('customId.idCards')} />
        <div className={styles.topNav}>
          <div className={styles.tabsWrapper}>
            <TabGroup
              tabOptions={TAB_OPTION}
              onTabClick={onTabClick}
              selectedTab={activeTab}
              tabGroupType="primary"
              moredivClass={styles.tabsWrapper}
              showMoreTab={false}
            />
          </div>
          <Permission
            permissionId={
              PERMISSION_CONSTANTS.IdCardImageController_save_create
            }
          >
            <Button
              type={BUTTON_CONSTANTS.TYPE.OUTLINE}
              size={BUTTON_CONSTANTS.SIZE.LARGE}
              onClick={createNewTemplate}
            >
              {t('customCertificate.createNew')}
            </Button>
          </Permission>
        </div>
        <div>
          {myTemplates?.length > 0 && (
            <>
              <div className={styles.sectionHead}>
                <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
                  {`${t('customId.myTemplates')} (${activeMyTemplates.length})`}
                </Heading>
                {(activeMyTemplates.length > 4 ||
                  inActiveMyTemplates?.length > 0) && (
                  <Button
                    onClick={() =>
                      history.push(
                        generatePath(CUSTOM_ID_CARD_SUB_ROUTE.VIEW_ALL, {
                          userType,
                        })
                      )
                    }
                    type={BUTTON_CONSTANTS.TYPE.TEXT}
                  >
                    {t('customId.viewAll')}
                  </Button>
                )}
              </div>
              {activeMyTemplates?.length > 0 && (
                <div className={styles.templateList}>
                  {activeMyTemplates.slice(0, 4).map((template) => (
                    <IdTemplateCard
                      showPreview={setDocPreview}
                      key={template._id}
                      template={template}
                    />
                  ))}
                </div>
              )}
            </>
          )}
          {defaultTemplates?.length > 0 && (
            <>
              <div className={styles.sectionHead}>
                <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
                  {`${t('customId.defaultTemplates')} (${
                    defaultTemplates.length
                  })`}
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
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default IdTemplatesOverview
