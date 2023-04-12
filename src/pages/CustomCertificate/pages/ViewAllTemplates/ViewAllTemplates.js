import React, {useState} from 'react'
import CardsList from '../../components/Cards/CardsList'
import {
  eventManagerSelector,
  getGlobalCertificateData,
  templateDetailsSelector,
} from '../../redux/CustomCertificate.selectors'
import {useHistory, useParams} from 'react-router-dom'
import {
  DOCUMENT,
  DOC_CATEGORIES,
  TEMPLATE_STATUS,
} from '../../CustomCertificate.constants'
import {
  Button,
  BUTTON_CONSTANTS,
  Divider,
  HeaderTemplate,
  Heading,
  HEADING_CONSTANTS,
} from '@teachmint/krayon'
import styles from './ViewAllTemplates.module.css'
import {useTranslation} from 'react-i18next'
import DocumentPreviewModal from '../../components/DocumentPreviewModal/DocumentPreviewModal'
import {CUSTOM_CERTIFICATE_SUB_ROUTES} from '../../CustomCertificates.routes'
import {generatePath} from 'react-router-dom'
import globalActions from '../../../../redux/actions/global.actions'
import {useDispatch} from 'react-redux'
import Loader from '../../../../components/Common/Loader/Loader'
import {downloadFromLink} from '../../../../utils/fileUtils'
import {CERTIFICATE_EVENTS} from '../../CustomCertificate.events'

const ViewAllTemplates = () => {
  const [previewDoc, showPreviewModal] = useState(false)
  const {userType, type} = useParams()
  const dispatch = useDispatch()
  const history = useHistory()
  const {t} = useTranslation()
  const eventManager = eventManagerSelector()
  const {
    templateList: {data: templates},
  } = getGlobalCertificateData()
  const {isLoading} = templateDetailsSelector()

  const templatesList = templates[userType].filter((item) => {
    if (type == 'document' && !item.default) return item
    else if (type == 'certificate' && item.default) return item
  })

  const activeTemplate = templatesList.filter(
    (item) => item.status === TEMPLATE_STATUS.ACTIVE || item.default
  )

  const archivedTemplate = templatesList.filter(
    (item) => item.status === TEMPLATE_STATUS.INACTIVE
  )

  const toUserListPage = () => {
    history.push(
      generatePath(CUSTOM_CERTIFICATE_SUB_ROUTES.SELECT_USER, {
        userType,
        type: previewDoc.type.toLowerCase(),
        templateId: previewDoc._id,
      })
    )
  }

  const handleRouteSelection = (e, route) => {
    e?.preventDefault()
    history.push(route)
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
      template_type: previewDoc.default ? 'default' : 'my_templates',
      certificate_id: previewDoc._id,
      screen: 'custom_template_home',
      ...data,
    })
  }

  return (
    <div className={styles.wrapper}>
      <Loader show={isLoading} />
      <HeaderTemplate
        mainHeading={DOC_CATEGORIES[type.toUpperCase()].pageHeader}
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
              label: DOC_CATEGORIES[type.toUpperCase()].pageHeader,
            },
          ],
        }}
        actionButtons={
          type === DOCUMENT.toLowerCase()
            ? [
                {
                  id: 'exit-btn',
                  onClick: () => {
                    history.push({
                      pathname: generatePath(
                        CUSTOM_CERTIFICATE_SUB_ROUTES.CREATE,
                        {
                          type: 'document',
                          userType,
                        }
                      ),
                      search: `templateType=certificate_${userType}`,
                    })
                  },
                  children: t('customCertificate.createNew'),
                  type: BUTTON_CONSTANTS.TYPE.OUTLINE,
                },
              ]
            : []
        }
      />
      <DocumentPreviewModal
        isOpen={!!previewDoc}
        url={previewDoc.preview_url}
        header={`${previewDoc.name} ${t('preview').toLowerCase()}`}
        showCloseIcon={true}
        onClose={() => {
          dispatch(globalActions.defaultTemplatePreview.reset())
          showPreviewModal(false)
        }}
        classes={{modal: styles.previewModal, header: styles.modalHeader}}
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
              triggerEvent(
                CERTIFICATE_EVENTS.CERTIFICATE_TEMPLATE_EDIT_CLICKED_TFI,
                {
                  triggered_from: 'preview_modal',
                }
              )
              dispatch(globalActions.defaultTemplatePreview.reset())
              showPreviewModal(false)
            },
            type: 'outline',
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
              toUserListPage()
            },
          },
        ]}
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
      {templates && (
        <div>
          <CardsList showDocPreview={showPreviewModal} list={activeTemplate} />
          {archivedTemplate.length > 0 && (
            <>
              <Divider />
              <div className={styles.archivedContainer}>
                <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.X_SMALL}>
                  {DOC_CATEGORIES[type.toUpperCase()].archive}
                </Heading>
                <CardsList
                  showDocPreview={showPreviewModal}
                  showNewCard={false}
                  list={archivedTemplate}
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default ViewAllTemplates
