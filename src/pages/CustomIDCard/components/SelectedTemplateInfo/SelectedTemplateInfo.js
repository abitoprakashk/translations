import {
  Badges,
  BADGES_CONSTANTS,
  Button,
  BUTTON_CONSTANTS,
  Divider,
  Heading,
  HEADING_CONSTANTS,
  Para,
  PlainCard,
} from '@teachmint/krayon'
import classNames from 'classnames'
import React from 'react'
import {useEffect} from 'react'
import {useState} from 'react'
import {useTranslation} from 'react-i18next'
import {Trans} from 'react-i18next'
import {useDispatch} from 'react-redux'
import {generatePath, useHistory, useParams} from 'react-router-dom'
import Loader from '../../../../components/Common/Loader/Loader'
import globalActions from '../../../../redux/actions/global.actions'
import {CUSTOM_ID_CARD_SUB_ROUTE} from '../../CustomId.routes'
import {customIdDefaultPreviewSelector} from '../../redux/CustomId.selector'
import CustomIdPreview from '../CustomIdPreview/CustomIdPreview'

import styles from './SelectedTemplateInfo.module.css'

const SelectedTemplateInfo = ({
  userCount,
  missingFieldsForUsersCount,
  customIdTemplateDetails,
}) => {
  useEffect(() => {
    return function () {
      dispatch(globalActions.customIdDefaultPreview.reset())
    }
  }, [])
  const {userType, templateId, isDefault} = useParams()
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const history = useHistory()
  const [openPreview, showPreview] = useState()
  const name = customIdTemplateDetails?.frontTemplate?.name
  const {data: defaultPreview, isLoading: defaultPreviewLoading} =
    customIdDefaultPreviewSelector()

  const previewData = {
    title: customIdTemplateDetails?.frontTemplate?.name,
    id: customIdTemplateDetails._id,
    isDefault: customIdTemplateDetails.default,
    url: customIdTemplateDetails.default
      ? null
      : `${
          customIdTemplateDetails?.combinedPreviewUrl
        }?timestamp=${+new Date()}`,
  }

  return (
    <>
      <Loader show={defaultPreviewLoading} />
      {(defaultPreview || previewData?.url) && openPreview && (
        <CustomIdPreview
          onClose={() => {
            showPreview(null)
            dispatch(globalActions.customIdDefaultPreview.reset())
          }}
          {...previewData}
          url={previewData?.url || defaultPreview}
        ></CustomIdPreview>
      )}
      <div className={styles.selectedTemplateWrapper}>
        <PlainCard
          className={classNames(
            styles.card,
            styles.templateCardContent,
            'templateCard'
          )}
          onClick={(e) => {
            if (!e.target.closest('[data-qa="kebab"]')) {
              if (customIdTemplateDetails.default) {
                // triggerEvent(CERTIFICATE_EVENTS.CERTIFICATE_TEMPLATE_NODE_CLICKED_TFI)
                showPreview(true)
                dispatch(
                  globalActions.customIdDefaultPreview.request(
                    customIdTemplateDetails._id
                  )
                )
              } else showPreview(true)
            }
          }}
        >
          <div className={styles.flipContainer}>
            <span className={styles.orientationLabel}>
              {customIdTemplateDetails?.frontTemplate?.pageSettings?.orientation.toLowerCase()}
            </span>
            <div
              className={classNames(styles.templateImageContainer, {
                [styles.noTransition]: !customIdTemplateDetails?.backTemplate,
              })}
            >
              <div className={classNames(styles.img, styles.frontImg)}>
                <img
                  alt=""
                  src={`${
                    customIdTemplateDetails?.frontTemplate?.thumbnailUrl
                  }?timestamp=${+new Date()}`}
                />
              </div>

              <div className={classNames(styles.img, styles.backImg)}>
                <img
                  alt=""
                  src={`${
                    customIdTemplateDetails?.backTemplate?.thumbnailUrl ||
                    customIdTemplateDetails?.frontTemplate?.thumbnailUrl
                  }?timestamp=${+new Date()}`}
                />
              </div>
            </div>
          </div>
        </PlainCard>
        <div className={styles.templateInfo}>
          <div>
            <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.SMALL}>
              {name}
            </Heading>
            <Para>
              <Trans i18nKey="customId.generatedFor">
                Generated for {{userCount}} {{userType}}
              </Trans>
            </Para>
            {missingFieldsForUsersCount > 0 && (
              <Badges
                type={BADGES_CONSTANTS.TYPE.WARNING}
                label={
                  <Trans i18nKey="customId.totalMissingFor">
                    Info missing for {{missingFieldsForUsersCount}} {{userType}}
                  </Trans>
                }
                showIcon={true}
                iconName="caution"
              />
            )}
          </div>
          <div className={styles.actionRow}>
            <Button
              type={BUTTON_CONSTANTS.TYPE.TEXT}
              size={BUTTON_CONSTANTS.SIZE.LARGE}
              onClick={() => {
                history.push(
                  generatePath(CUSTOM_ID_CARD_SUB_ROUTE.EDIT, {
                    userType,
                    templateId,
                    isDefault,
                  })
                )
              }}
            >
              {t('editTemplate')}
            </Button>
            <Divider isVertical spacing={8} />
            <Button
              type={BUTTON_CONSTANTS.TYPE.TEXT}
              size={BUTTON_CONSTANTS.SIZE.LARGE}
              onClick={() => {
                history.push(
                  generatePath(CUSTOM_ID_CARD_SUB_ROUTE.VIEW_ALL, {
                    userType,
                  })
                )
              }}
            >
              {t('customId.changeTemplate')}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default SelectedTemplateInfo
