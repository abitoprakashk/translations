import {
  Button,
  Divider,
  HeaderTemplate,
  Heading,
  HEADING_CONSTANTS,
  TabGroup,
  BUTTON_CONSTANTS,
  Para,
  PARA_CONSTANTS,
} from '@teachmint/krayon'
import {useTranslation} from 'react-i18next'
import {CUSTOM_CERTIFICATE_SUB_ROUTES} from '../../CustomCertificates.routes'
import {generatePath, useParams} from 'react-router-dom'
import {useEffect, useState} from 'react'
import {
  DOCUMENT,
  DOC_CATEGORIES,
  STUDENT,
  TAB_OPTION,
  TEMPLATE_STATUS,
} from '../../CustomCertificate.constants'
import styles from './TemplatesOverview.module.css'
import CardsList from '../../components/Cards/CardsList'
import {
  eventManagerSelector,
  generatedDocumentsListSelector,
  getGlobalCertificateData,
  templateDetailsSelector,
} from '../../redux/CustomCertificate.selectors'
import {useHistory} from 'react-router-dom'
import DocumentPreviewModal from '../../components/DocumentPreviewModal/DocumentPreviewModal'
import globalActions from '../../../../redux/actions/global.actions'
import {useDispatch} from 'react-redux'
import Loader from '../../../../components/Common/Loader/Loader'
import GeneratedDocumentsTable from '../../components/GeneratedDocumentsTable/GeneratedDocumentsTable'
import {downloadFromLink} from '../../../../utils/fileUtils'
import {STATUS} from '../GeneratedDocuments/GeneratedDocuments.constants'
import {CERTIFICATE_EVENTS} from '../../CustomCertificate.events'
import Permission from '../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'
import {useCheckPermission} from '../../../../utils/Permssions'

const TemplatesOverview = () => {
  const {userType} = useParams()
  const history = useHistory()
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState('')
  const [previewDoc, showPreviewModal] = useState(false)
  const {data: generatedDocsList, isLoading} = generatedDocumentsListSelector()
  const {isLoading: templateDataLoading} = templateDetailsSelector()
  const eventManager = eventManagerSelector()
  const {t} = useTranslation()

  const {
    templateList: {data: templates},
  } = getGlobalCertificateData()

  useEffect(() => {
    dispatch(
      globalActions.generatedDocuments.request({
        c: parseInt(+new Date() / 1000),
        userType: userType.toUpperCase(),
        count: 10,
      })
    )
  }, [userType])

  useEffect(() => {
    setActiveTab(userType)
  }, [userType])

  const redirectToGeneratedDocsPage = () => {
    triggerEvent(
      CERTIFICATE_EVENTS.CERTIFICATE_RECENTLY_GENERATED_VIEW_CLICKED_TFI
    )
    history.push(
      generatePath(CUSTOM_CERTIFICATE_SUB_ROUTES.GENERATED_LIST, {
        userType,
      })
    )
  }

  const onTabClick = ({id}) => {
    eventManager.send_event(
      id === STUDENT
        ? CERTIFICATE_EVENTS.CERTIFICATE_STUDENT_TAB_CLICKED_TFI
        : CERTIFICATE_EVENTS.CERTIFICATE_STAFF_TAB_CLICKED_TFI
    )
    history.push(
      generatePath(CUSTOM_CERTIFICATE_SUB_ROUTES.USER_TYPE, {
        userType: id,
      })
    )
  }

  const toUserListPage = () => {
    history.push(
      generatePath(CUSTOM_CERTIFICATE_SUB_ROUTES.SELECT_USER, {
        userType,
        type: previewDoc.type.toLowerCase(),
        templateId: previewDoc._id,
      })
    )
  }

  const createNewTemplate = () => {
    eventManager.send_event(
      CERTIFICATE_EVENTS.CERTIFICATE_CREATE_NEW_TEMPLATE_CLICKED_TFI,
      {user_screen: userType}
    )

    history.push({
      pathname: generatePath(CUSTOM_CERTIFICATE_SUB_ROUTES.CREATE, {
        type: 'document',
        userType,
      }),
      search: `templateType=certificate_${userType}`,
    })
  }

  const redirectToEditPage = () => {
    history.push({
      pathname: generatePath(CUSTOM_CERTIFICATE_SUB_ROUTES.EDIT, {
        userType,
        type: previewDoc.type.toLowerCase(),
      }),
      search: `templateType=certificate_${userType}`,
    })
  }

  const triggerEvent = (eventName, data = {}) => {
    eventManager.send_event(eventName, {
      user_screen: userType,
      template_type: previewDoc?.default ? 'default' : 'my_templates',
      certificate_id: previewDoc?._id,
      screen: 'custom_template_home',
      ...data,
    })
  }

  return (
    <div className={styles.wrapper}>
      <Loader show={isLoading || templateDataLoading} />
      <DocumentPreviewModal
        isOpen={!!previewDoc}
        url={`${previewDoc.preview_url}?timestamp=${+new Date()}`}
        header={
          previewDoc && `${previewDoc.name} ${t('preview').toLowerCase()}`
        }
        showCloseIcon={true}
        onClose={() => {
          dispatch(globalActions.defaultTemplatePreview.reset())
          showPreviewModal(false)
        }}
        actionButtons={[
          {
            body: t('edit'),
            onClick: () => {
              dispatch(
                globalActions.templateDetails.request(
                  {
                    id: previewDoc._id,
                    isDefault: previewDoc.default,
                  },
                  redirectToEditPage
                )
              )
              dispatch(globalActions.defaultTemplatePreview.reset())
              triggerEvent(
                CERTIFICATE_EVENTS.CERTIFICATE_TEMPLATE_EDIT_CLICKED_TFI,
                {
                  triggered_from: 'preview_modal',
                }
              )
              showPreviewModal(false)
            },
            type: 'outline',
            isDisabled: useCheckPermission(
              PERMISSION_CONSTANTS.certificateController_createRoute_create
            ),
          },
          {
            body: t('customCertificate.generate'),
            onClick: () => {
              triggerEvent(
                CERTIFICATE_EVENTS.CERTIFICATE_TEMPLATE_SELECTED_TFI,
                {
                  triggered_from: 'preview_modal',
                }
              )
              dispatch(globalActions.defaultTemplatePreview.reset())
              toUserListPage()
            },
          },
        ]}
        classes={{modal: styles.previewModal, header: styles.modalHeader}}
        footerLeftElement={
          <Button
            prefixIcon="download"
            category={BUTTON_CONSTANTS.CATEGORY.PRIMARY}
            type={BUTTON_CONSTANTS.TYPE.OUTLINE}
            classes={{button: styles.modalDownloadButton}}
            onClick={() => {
              triggerEvent(
                CERTIFICATE_EVENTS.CERTIFICATE_TEMPLATE_DOWNLOAD_CLICKED_TFI,
                {
                  triggered_from: 'preview_modal',
                }
              )
              downloadFromLink(
                previewDoc.preview_url,
                `${previewDoc.name.trim()}.pdf`
              )
            }}
          ></Button>
        }
      />
      <HeaderTemplate
        mainHeading={t('customCertificate.docsAndCertificatesHeading')}
      />
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
          permissionId={PERMISSION_CONSTANTS.IdCardImageController_save_create}
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
      {templates && (
        <TemplatesCategory
          templates={templates}
          activeTab={userType}
          showDocPreview={showPreviewModal}
        />
      )}
      {generatedDocsList && generatedDocsList.length > 0 && (
        <>
          <div className={styles.documentHeader}>
            <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
              {t('customCertificate.recentlyGenerated')}
            </Heading>
            {generatedDocsList.length > 6 && (
              <span onClick={() => redirectToGeneratedDocsPage()}>
                {t('viewAll')}
              </span>
            )}
          </div>
          <GeneratedDocumentsTable rows={[...generatedDocsList.slice(0, 6)]} />
        </>
      )}
      <div className={styles.oldCertificate}>
        <Para type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}>
          {t('customCertificate.oldCertificate')}{' '}
          <span
            onClick={() => {
              triggerEvent(CERTIFICATE_EVENTS.VIEW_OLD_CERTIFICATES_CLICKED_TFI)
              history.push(CUSTOM_CERTIFICATE_SUB_ROUTES.OLD_CERTIFICATE)
            }}
          >
            {t('clickHere')}
          </span>
        </Para>
      </div>
    </div>
  )
}

export default TemplatesOverview

const TemplatesCategory = ({templates, activeTab, showDocPreview}) => {
  const {t} = useTranslation()
  const {userType} = useParams()
  const history = useHistory()
  const eventManager = eventManagerSelector()
  const redirect = (key) => {
    eventManager.send_event(
      CERTIFICATE_EVENTS.CERTIFICATE_VIEW_ALL_TEMPLATE_CLICKED_TFI,
      {userType, template_type: key === DOCUMENT ? 'my_templates' : 'default'}
    )
    history.push(`${key.toLowerCase()}/`)
  }
  return Object.keys(DOC_CATEGORIES).map((key) => {
    const fieldToCheck = DOC_CATEGORIES[key].keyToCheck
    const listData = templates[activeTab].filter((item) => {
      return (
        (fieldToCheck == 'default' && item[fieldToCheck]) ||
        fieldToCheck == STATUS
      )
    })
    const activeTemplate =
      fieldToCheck === STATUS
        ? listData.filter((item) => item.status === TEMPLATE_STATUS.ACTIVE)
        : listData
    const inactiveTemplate =
      fieldToCheck === STATUS
        ? listData.filter((item) => item.status === TEMPLATE_STATUS.INACTIVE)
        : []
    return (
      <div key={key}>
        <div className={styles.documentHeader}>
          <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
            {`${DOC_CATEGORIES[key].name} - ${activeTemplate.length}`}
          </Heading>
          {(activeTemplate.length > 4 || inactiveTemplate.length > 0) && (
            <span onClick={() => redirect(key)}>{t('viewAll')}</span>
          )}
        </div>
        <CardsList
          showDocPreview={showDocPreview}
          showFirstRow={true}
          list={activeTemplate}
          category={key.toLowerCase()}
          itemsToShowInFirstRow={4}
        />
        <Divider />
      </div>
    )
  })
}
