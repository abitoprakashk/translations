import {
  Badges,
  Heading,
  HEADING_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  KebabMenu,
  PlainCard,
  BADGES_CONSTANTS,
} from '@teachmint/krayon'
import classNames from 'classnames'
import React from 'react'
import {useTranslation} from 'react-i18next'
import {useDispatch} from 'react-redux'
import {generatePath, useHistory, useParams} from 'react-router-dom'
import Permission from '../../../../components/Common/Permission/Permission'
import globalActions from '../../../../redux/actions/global.actions'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'
import {ACTIVE, INACTIVE} from '../../CustomId.constants'
import {CUSTOM_ID_CARD_SUB_ROUTE} from '../../CustomId.routes'
import styles from './IdTemplateCard.module.css'

const IdTemplateCard = ({template, showPreview}) => {
  const {t} = useTranslation()
  const {userType} = useParams()
  const history = useHistory()
  const dispatch = useDispatch()

  const previewData = {
    title: template?.front_template?.name,
    id: template._id,
    isDefault: template.default,
    url: template.default
      ? null
      : `${template?.combined_preview_url}?timestamp=${+new Date()}`,
  }

  const editTemplate = () => {
    history.push(
      generatePath(CUSTOM_ID_CARD_SUB_ROUTE.EDIT, {
        userType,
        templateId: template._id,
        isDefault: template.default,
      })
    )
  }

  const handleArchive = () => {
    const status = template.status === ACTIVE
    dispatch(
      globalActions.updateCustomIdTemplate.request(
        {
          id: template._id,
          status: status ? INACTIVE : ACTIVE,
          default: template.default,
          isUpdate: true,
        },
        () => dispatch(globalActions.customIdTemplateList.request())
      )
    )
  }

  const options = [
    {
      content: (
        <Permission
          permissionId={
            PERMISSION_CONSTANTS.IdCardTemplateController_update_route_update
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
    },
    {
      content: (
        <Permission
          permissionId={
            PERMISSION_CONSTANTS.IdCardTemplateController_update_route_update
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
            {template.status === 'ACTIVE'
              ? t('customCertificate.archiveTemplate')
              : t('customCertificate.unarchiveTemplate')}
          </div>
        </Permission>
      ),
    },
  ]
  if (template?.selected) options.pop()
  if (template?.status !== ACTIVE) options.shift()
  return (
    <PlainCard
      className={classNames(
        styles.card,
        styles.templateCardContent,
        'templateCard'
      )}
      onClick={(e) => {
        if (!e.target.closest('[data-qa="kebab"]')) {
          if (template.status === INACTIVE) return
          if (template.default) {
            // triggerEvent(CERTIFICATE_EVENTS.CERTIFICATE_TEMPLATE_NODE_CLICKED_TFI)
            showPreview?.(previewData)
            dispatch(globalActions.customIdDefaultPreview.request(template._id))
          } else showPreview?.(previewData)
        }
      }}
    >
      {!template.default && (
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
      <div className={styles.flipContainer}>
        <span className={styles.orientationLabel}>
          {template?.front_template?.page_settings?.orientation.toLowerCase()}
        </span>
        <div
          className={classNames(styles.templateImageContainer, {
            [styles.noTransition]: !template?.back_template,
          })}
        >
          <div className={classNames(styles.img, styles.frontImg)}>
            <img
              alt=""
              src={`${
                template?.front_template?.thumbnail_url
              }?timestamp=${+new Date()}`}
            />
          </div>

          <div className={classNames(styles.img, styles.backImg)}>
            <img
              alt=""
              src={`${
                template?.back_template?.thumbnail_url ||
                template?.front_template?.thumbnail_url
              }?timestamp=${+new Date()}`}
            />
          </div>
        </div>
      </div>
      <div className={styles.cardDetails}>
        <Heading
          title={template?.front_template?.name}
          textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}
        >
          {template?.front_template?.name}
        </Heading>
        {template?.selected && (
          <Badges
            type={BADGES_CONSTANTS.TYPE.SUCCESS}
            label={t('customId.inUse')}
            showIcon={false}
            className={styles.badge}
          ></Badges>
        )}
      </div>
    </PlainCard>
  )
}

export default IdTemplateCard
