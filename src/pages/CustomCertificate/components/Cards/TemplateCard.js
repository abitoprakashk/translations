import {
  Heading,
  HEADING_CONSTANTS,
  KebabMenu,
  PlainCard,
  Icon,
  ICON_CONSTANTS,
} from '@teachmint/krayon'
import classNames from 'classnames'
import styles from './Cards.module.css'
import {useTranslation} from 'react-i18next'
import {downloadFromLink} from '../../../../utils/fileUtils'
import globalActions from '../../../../redux/actions/global.actions'
import {useDispatch, useSelector} from 'react-redux'
import {generatePath, useHistory, useParams} from 'react-router-dom'
import {CUSTOM_CERTIFICATE_SUB_ROUTES} from '../../CustomCertificates.routes'
import {
  defaultTemplatePreviewSelector,
  eventManagerSelector,
} from '../../redux/CustomCertificate.selectors'
import Loader from '../../../../components/Common/Loader/Loader'
import {useEffect, useRef} from 'react'
import {CERTIFICATE_EVENTS} from '../../CustomCertificate.events'
import Permission from '../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'
import {checkPermission} from '../../../../utils/Permssions'

const TemplateCard = ({card, showDocPreview}) => {
  const {template} = card
  const {userType, type} = useParams()
  const currentActionState = useRef('')
  const {t} = useTranslation()
  const history = useHistory()
  const dispatch = useDispatch()
  const eventManager = eventManagerSelector()

  const {data: defaultTemplatePreviewUrl, isLoading} =
    defaultTemplatePreviewSelector()

  const userRolePermission = useSelector(
    (state) => state.globalData?.userRolePermission
  )

  useEffect(() => {
    if (defaultTemplatePreviewUrl) {
      if (currentActionState.current === 'preview') {
        showDocPreview({
          preview_url: `${defaultTemplatePreviewUrl}?timestamp=${+new Date()}`,
          name: template.name,
          type: card.type,
          _id: card._id,
          default: card.default,
        })
      } else if (currentActionState.current === 'download') {
        downloadFromLink(
          defaultTemplatePreviewUrl,
          `${template.name}-template.pdf`
        )
      }
    }
  }, [defaultTemplatePreviewUrl])

  const redirectToEditPage = () => {
    history.push({
      pathname: generatePath(CUSTOM_CERTIFICATE_SUB_ROUTES.EDIT, {
        userType,
        type: type || card.type.toLowerCase(),
      }),
      search: `templateType=certificate_${userType}`,
    })
  }

  const refreshTemplateList = () => {
    triggerEvent(
      CERTIFICATE_EVENTS.CERTIFICATE_TEMPLATE_NODE_ARCHIEVE_CLICKED_TFI,
      {
        triggered_from: 'kabab_menu',
        archive_status: card.status === 'ACTIVE' ? 'archived' : 'unarchived',
      }
    )
    dispatch(globalActions.templateList.request())
  }

  const editTemplate = () => {
    triggerEvent(CERTIFICATE_EVENTS.CERTIFICATE_TEMPLATE_EDIT_CLICKED_TFI, {
      triggered_from: 'kabab_menu',
    })
    dispatch(
      globalActions.templateDetails.request(
        {
          id: card._id,
          isDefault: card.default,
        },
        redirectToEditPage
      )
    )
  }

  const handleArchive = () => {
    const status = card.status === 'ACTIVE'
    dispatch(
      globalActions.updateDocumentTemplate.request(
        {
          id: card._id,
          status: status ? 'INACTIVE' : 'ACTIVE',
          default: card.default,
          isUpdate: true,
        },
        refreshTemplateList
      )
    )
  }

  const showPreview = () => {
    triggerEvent(CERTIFICATE_EVENTS.CERTIFICATE_PREVIEW_TEMPLATE_CLICKED_TFI)
    if (card.default) {
      currentActionState.current = 'preview'
      dispatch(globalActions.defaultTemplatePreview.request(card._id))
    } else {
      showDocPreview({...card, ...template})
    }
  }

  const handleDownload = () => {
    triggerEvent(CERTIFICATE_EVENTS.CERTIFICATE_TEMPLATE_DOWNLOAD_CLICKED_TFI, {
      triggered_from: 'kabab_menu',
    })
    if (card.default) {
      currentActionState.current = 'download'
      dispatch(globalActions.defaultTemplatePreview.request(card._id))
    } else {
      downloadFromLink(
        `${template.preview_url}?timestamp=${+new Date()}`,
        `${template.name}-template.pdf`
      )
    }
  }

  const options = [
    {
      content: (
        <Permission
          permissionId={
            PERMISSION_CONSTANTS.documentTemplateController_createRoute_create
          }
        >
          <div
            className={styles.menuItem}
            onClick={(e) => {
              e.stopPropagation()
              editTemplate()
            }}
          >
            <Icon
              size={ICON_CONSTANTS.SIZES.X_SMALL}
              name="edit2"
              version={ICON_CONSTANTS.VERSION.OUTLINED}
            />
            {t('customCertificate.editTemplate')}
          </div>
        </Permission>
      ),
      handleClick: () => {},
    },
    {
      content: (
        <Permission
          permissionId={
            PERMISSION_CONSTANTS.documentTemplateController_createRoute_create
          }
        >
          <div
            className={styles.menuItem}
            onClick={(e) => {
              e.stopPropagation()
              handleDownload()
            }}
          >
            <Icon
              size={ICON_CONSTANTS.SIZES.X_SMALL}
              name="download"
              version={ICON_CONSTANTS.VERSION.OUTLINED}
            />
            {t('customCertificate.downloadTemplate')}
          </div>
        </Permission>
      ),
      handleClick: () => {},
    },
  ]
  if (!card.default) {
    options.push({
      content: (
        <Permission
          permissionId={
            PERMISSION_CONSTANTS.documentTemplateController_updateRoute_update
          }
        >
          <div
            className={styles.menuItem}
            onClick={(e) => {
              e.stopPropagation()
              handleArchive()
            }}
          >
            <Icon
              size={ICON_CONSTANTS.SIZES.X_SMALL}
              name="archive"
              version={ICON_CONSTANTS.VERSION.FILLED}
            />
            {card.status === 'ACTIVE'
              ? t('customCertificate.archiveTemplate')
              : t('customCertificate.unarchiveTemplate')}
          </div>
        </Permission>
      ),
      handleClick: () => {},
    })
  }

  const triggerEvent = (eventName, data = {}) => {
    const path = window?.location?.pathname
    const location = path.split('/')

    eventManager.send_event(eventName, {
      user_type: userType,
      template_type: card.default ? 'default' : 'my_templates',
      certificate_id: card._id,
      screen:
        location.length === 6 ? 'custom_template_home' : 'view_all_templates',
      ...data,
    })
  }

  return (
    <>
      <Loader show={isLoading} />
      <PlainCard
        className={classNames(
          styles.card,
          styles.templateCardContent,
          'templateCard'
        )}
        onClick={(e) => {
          if (e.target?.nodeName !== 'SPAN') {
            triggerEvent(
              CERTIFICATE_EVENTS.CERTIFICATE_TEMPLATE_NODE_CLICKED_TFI
            )
            showDocPreview && showPreview({...card, ...template})
          }
        }}
      >
        <div>
          <div className={styles.templateImageContainer}>
            <div className={styles.img}>
              <img
                alt=""
                src={`${template.thumbnail_url}?timestamp=${+new Date()}`}
              />
            </div>
            {checkPermission(
              userRolePermission,
              PERMISSION_CONSTANTS.documentTemplateController_createRoute_create
            ) && (
              <KebabMenu
                options={options}
                classes={{
                  wrapper: styles.kabab,
                  optionsWrapper: styles.optionsWrapper,
                  content: styles.contentWrapper,
                }}
                isVertical={true}
              />
            )}
          </div>
        </div>
        <div className={styles.cardDetails}>
          <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
            {template.name}
          </Heading>
        </div>
      </PlainCard>
    </>
  )
}

export default TemplateCard
