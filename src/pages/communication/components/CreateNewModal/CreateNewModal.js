import React from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {Modal} from '@teachmint/common'
import {checkSubscriptionType} from '../../../../utils/Helpers'
import {showFeatureLockAction} from '../../../../redux/actions/commonAction'

import {events} from '../../../../utils/EventsConstants'
import classNames from 'classnames'
import {announcementType} from '../../constants'
import styles from './CreateNewModal.module.css'
import {useTranslation} from 'react-i18next'
import {
  Icon,
  ICON_CONSTANTS,
  IconFrame,
  ICON_FRAME_CONSTANTS,
  Badges,
  BADGES_CONSTANTS,
  Divider,
} from '@teachmint/krayon'
export default function CreateNewModal(props) {
  const {t} = useTranslation()
  const {eventManager, instituteInfo} = useSelector((state) => state)
  const {unusedQuota} = useSelector((state) => state.communicationInfo.sms)
  const isPremium = checkSubscriptionType(instituteInfo)
  const countryCheck = instituteInfo['address']['country']
    ? instituteInfo['address']['country'] === 'India'
    : true
  const dispatch = useDispatch()

  const selectionOptions = {
    app: [
      {
        icon: (
          <IconFrame
            className={styles.announcementModalIcon}
            type={ICON_FRAME_CONSTANTS.TYPES.WARNING}
            size={ICON_FRAME_CONSTANTS.SIZES.X_LARGE}
            children={
              <Icon
                name="alert1"
                type={ICON_CONSTANTS.TYPES.INVERTED}
                size={ICON_CONSTANTS.SIZES.X_SMALL}
                className={styles.announcementIcon}
              />
            }
          />
        ),
        title: t('announcement'),
        subTitle: t('announcementSubtext'),
        altImg: t('announcementIcon'),
        isLocked: false,
        onClick: () => {
          eventManager.send_event(events.CREATE_NEW_POST_POPUP_CLICKED_TFI, {
            post_type: 'announcement',
          })
          props.handleOptionSelection(announcementType.ANNOUNCEMENT)
        },
        suffixIcon: (
          <Icon name="chevronRight" size={ICON_CONSTANTS.SIZES.XX_SMALL} />
        ),
      },
      {
        icon: (
          <IconFrame
            className={styles.feedbackModalIcon}
            type={ICON_FRAME_CONSTANTS.TYPES.PRIMARY}
            size={ICON_FRAME_CONSTANTS.SIZES.X_LARGE}
            children={
              <Icon
                name="description"
                type={ICON_CONSTANTS.TYPES.INVERTED}
                size={ICON_CONSTANTS.SIZES.X_SMALL}
              />
            }
          />
        ),
        title: t('feedback'),
        subTitle: t('feedbackCreateSubtext'),
        altImg: t('feedbackIcon'),
        isLocked: !isPremium,
        onClick: () => {
          eventManager.send_event(events.CREATE_NEW_POST_POPUP_CLICKED_TFI, {
            post_type: 'feedback',
          })
          if (isPremium) {
            props.handleOptionSelection(announcementType.FEEDBACK)
          } else {
            props.handleCreateNewModalClose()
            dispatch(showFeatureLockAction(true))
          }
        },
        suffixIcon: (
          <Icon name="chevronRight" size={ICON_CONSTANTS.SIZES.XX_SMALL} />
        ),
      },
      {
        icon: (
          <IconFrame
            className={styles.pollModalIcon}
            type={ICON_FRAME_CONSTANTS.TYPES.SUCCESS}
            size={ICON_FRAME_CONSTANTS.SIZES.X_LARGE}
            children={
              <Icon
                name="poll"
                type={ICON_CONSTANTS.TYPES.INVERTED}
                size={ICON_CONSTANTS.SIZES.X_SMALL}
              />
            }
          />
        ),
        title: t('poll'),
        subTitle: t('POLL_CREATE_SUBTEXT'),
        altImg: t('pollIcon'),
        isLocked: !isPremium,
        onClick: () => {
          eventManager.send_event(events.CREATE_NEW_POST_POPUP_CLICKED_TFI, {
            post_type: 'survey',
          })
          if (isPremium) {
            props.handleOptionSelection(announcementType.POLL)
          } else {
            props.handleCreateNewModalClose()
            dispatch(showFeatureLockAction(true))
          }
        },
        suffixIcon: (
          <Icon name="chevronRight" size={ICON_CONSTANTS.SIZES.XX_SMALL} />
        ),
      },
    ],
    sms: [
      {
        icon: (
          <IconFrame
            className={styles.smsModalIcon}
            type={ICON_FRAME_CONSTANTS.TYPES.SUCCESS}
            size={ICON_FRAME_CONSTANTS.SIZES.X_LARGE}
            children={
              <Icon
                name="chat"
                type={ICON_CONSTANTS.TYPES.INVERTED}
                size={ICON_CONSTANTS.SIZES.X_SMALL}
              />
            }
          />
        ),
        title: (
          <div className={styles.smsTitleContainer}>
            <span className={styles.smsTitleText}>SMS</span>
            <Badges
              label={unusedQuota + ' left'}
              showIcon={false}
              type={
                unusedQuota > 0
                  ? BADGES_CONSTANTS.TYPE.SUCCESS
                  : BADGES_CONSTANTS.TYPE.ERROR
              }
              size={BADGES_CONSTANTS.SIZE.SMALL}
              inverted={true}
            />
          </div>
        ),
        subTitle: t('smsSubText'),
        isLocked: false,
        onClick: () => {
          eventManager.send_event(events.CREATE_NEW_POST_POPUP_CLICKED_TFI, {
            post_type: 'sms',
          })
          props.handleOptionSelection(announcementType.SMS)
        },
        suffixIcon: (
          <Icon name="chevronRight" size={ICON_CONSTANTS.SIZES.XX_SMALL} />
        ),
      },
    ],
  }
  const renderOptions = (option) => {
    return (
      <div
        key={option.title}
        className={styles.selectionOptionCard}
        onClick={option.onClick}
      >
        <div>{option.icon}</div>
        <div className={classNames('ml-4', styles.selectionOptionContent)}>
          <div
            className={classNames(styles.common, styles.selectionOptionTitle)}
          >
            {option.title}
            {option.isLocked && (
              <img
                className={styles.lockIcon}
                alt="lock icon"
                src="https://storage.googleapis.com/tm-assets/icons/secondary/lock-secondary.svg"
              />
            )}
          </div>
          <div
            className={classNames(
              styles.common,
              styles.selectionOptionSubTitle
            )}
          >
            {option.subTitle}
          </div>
        </div>
        <div className={styles.suffixIcon}>{option.suffixIcon}</div>
      </div>
    )
  }

  return (
    <Modal
      show={props.isCreateModalOpen}
      // TODO: check why css order is wrong in production, remove extra classname once fixed
      className={classNames(styles.modalMain, styles.modalSection)}
    >
      <div className={styles.mainSection}>
        <div className={styles.mainHeadingSection}>
          <div>
            <div className={classNames(styles.common, styles.headingTitle)}>
              {t('createNewTitle')}
            </div>
          </div>
          <div>
            <button
              className={classNames(styles.headingSubTitle, 'mt-2')}
              onClick={props.handleCreateNewModalClose}
            >
              <Icon color="basic" name="close" size="s" />
            </button>
          </div>
        </div>
        <Divider spacing="0px" />
        <div className={styles.optionsContainer}>
          <div className={styles.sectionLabel}>
            <span>{t('appNotification')}</span>
            <Badges
              label={t('freeLabel')}
              showIcon={false}
              type={BADGES_CONSTANTS.TYPE.PRIMARY}
              size={BADGES_CONSTANTS.SIZE.SMALL}
            />
          </div>
          {selectionOptions['app'].map((option) => {
            return renderOptions(option)
          })}
          {countryCheck ? (
            <div>
              <div className={styles.sectionLabel}>
                <span>{t('smsSent')}</span>
                <Badges
                  label={t('newLabel')}
                  showIcon={false}
                  type={BADGES_CONSTANTS.TYPE.PRIMARY}
                  size={BADGES_CONSTANTS.SIZE.SMALL}
                />
              </div>
              {selectionOptions['sms'].map((option) => {
                return renderOptions(option)
              })}
            </div>
          ) : null}
        </div>
      </div>
    </Modal>
  )
}
