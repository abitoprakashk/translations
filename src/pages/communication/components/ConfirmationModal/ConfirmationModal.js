import React from 'react'
import {useSelector, useDispatch} from 'react-redux'
import styles from './ConfirmationModal.module.css'
import {Modal} from '@teachmint/common'
import {
  createNewCommunicationAction,
  updateCommunicationAction,
  editCommunicationPost,
} from './../../redux/actions/commonActions'
import dotIcon from '../../../../assets/images/icons/small-ellipse-gray.svg'
import classNames from 'classnames'
import {
  ASK_TEACHER_AND_STUDENT_TO_UPDATE_THEIR_APP,
  announcementType,
  COMMUNICATION_TYPE,
} from '../../constants'
import {Trans, useTranslation} from 'react-i18next'
import {setPopupAction} from '../../../Nudge/redux/actions/popupActions'
import {
  CommonActionType,
  DefaultSegmentType,
  SaveDraftType,
} from '../../redux/actionTypes'
import {sendSms} from '../../redux/actions/smsActions'
import {Accordion, Divider} from '@teachmint/krayon'
import {roleType} from '../../constants'
import history from '../../../../history'
export default function ConfirmationModal(props) {
  const {t} = useTranslation()
  const userSegment = t('userSegment')
  const allUserTypes = t('allUserTypes')
  const users = t('users')
  const duration = t('duration')
  const day = t('day')
  const days = t('days')
  const preview = t('preview')
  const TheWayItWillAppearToYourUsersInTheirDevice = t(
    'TheWayItWillAppearToYourUsersInTheirDevice'
  )
  const tMessage = t('sMessage')
  const tQuestion = t('questionLabel')
  const tCancel = t('cancel')
  const tConfirm = t('confirm')
  const tOption = t('optionLabel')
  const tTitle = t('sTitle')

  const {
    communicationInfo,
    instituteActiveAcademicSessionId,
    popup: {popupInfo},
  } = useSelector((state) => state)
  const {announcement, feedback, poll, common, sms} = communicationInfo

  const {total_no_of_users, segments, selected_users, redirectOnSuccess} =
    common
  const {title, message} = announcement
  const {selectedTemplateId, userInputData, unusedQuota, creditsRequired} = sms

  const dispatch = useDispatch()

  const onSubmit = () => {
    let obj = {...common, draft: false}
    if (common.announcement_type === announcementType.ANNOUNCEMENT) {
      obj = {...announcement, ...obj}
    } else if (common.announcement_type === announcementType.FEEDBACK) {
      obj = {...feedback, ...obj}
    } else if (common.announcement_type === announcementType.POLL) {
      obj = {...poll, ...obj}
    } else if (common.announcement_type === announcementType.SMS) {
      obj = {
        template_id: selectedTemplateId,
        input_variables: userInputData,
        ...obj,
      }
    }
    if (!obj.node_ids.length) {
      obj.node_ids = [instituteActiveAcademicSessionId]
    }
    if (obj._id) {
      if (obj.editPost) {
        dispatch(editCommunicationPost(obj))
      } else {
        dispatch(updateCommunicationAction(obj))
      }
    } else {
      if (common.announcement_type === announcementType.SMS) {
        dispatch(sendSms(obj))
      } else {
        dispatch(createNewCommunicationAction(obj))
      }

      if (redirectOnSuccess) {
        let redirectOnSuccessTemp = redirectOnSuccess
        dispatch({type: CommonActionType.REDIRECT_ON_SUCCESS, payload: null})
        dispatch({type: CommonActionType.REDIRECT_ON_CLOSE, payload: null})
        history.push(redirectOnSuccessTemp)
      }
    }
    if (communicationInfo.common.selectAll) {
      dispatch(
        setPopupAction({
          pop_up: popupInfo._id,
          popup_type: popupInfo.popup_type,
          api_type: 'ACCEPTED',
        })
      )
    }
    dispatch({type: SaveDraftType.SET_SAVE_DRAFT, payload: false})
    dispatch({
      type: DefaultSegmentType.SET_DEFAULT_SEGMENT,
      payload: [],
    })
    props.handleConfirmationSubmit()
  }

  const UserSegmentSection = () => {
    return (
      <div className={styles.userSegmentSection}>
        <label className={classNames(styles.confirmationDetailsLabel, 'mr-3')}>
          {userSegment}:
        </label>
        <span
          className={classNames(
            styles.confirmationDetailsBadge,
            styles.confirmationDetailUserSegmentAndChannel
          )}
        >
          {segments &&
            segments.length < 3 &&
            segments.map((item) => (
              <span className="mx-2 capitalize" key={item}>
                {item}
              </span>
            ))}
          {segments && segments.length >= 3 && <span>{allUserTypes}</span>} (
          {total_no_of_users} {users})
        </span>
      </div>
    )
  }

  const DurationSection = () => {
    return (
      <div className={styles.confirmationDurationSection}>
        <label className={classNames(styles.confirmationDetailsLabel, 'mr-3')}>
          {duration}:
        </label>
        <span
          className={classNames(
            styles.confirmationDetailsBadge,
            styles.confirmationDetailUserSegmentAndChannel
          )}
        >
          {common.duration} {common.duration > 1 ? ` ${days}` : ` ${day}`}
        </span>
      </div>
    )
  }
  return (
    <div className={styles.confirmationModalParentDiv}>
      <Modal
        show={props.isConfirmModalOpen}
        className={styles.confirmationModal}
      >
        <div className={styles.confirmationModalSection}>
          <div className={styles.mainHeadingSection}>
            <div>
              <div className={classNames(styles.headingTitle)}>
                {common.announcement_type === announcementType.SMS ? (
                  t('smsConfirmationHeading')
                ) : (
                  <Trans i18nKey="areYouSureAboutPostingThe">
                    Are you sure about posting the
                    {COMMUNICATION_TYPE[common.announcement_type]}?
                  </Trans>
                )}
              </div>
              <div className={styles.confirmationTagsSection}>
                {common.announcement_type !== announcementType.SMS && (
                  <UserSegmentSection />
                )}

                {common?.duration > 0 && (
                  <>
                    {
                      <div className={styles.confirmationDetailsDot}>
                        <img src={dotIcon} alt="dot icon" />
                      </div>
                    }
                    <DurationSection />
                  </>
                )}
              </div>
              <Divider spacing="0px" />
              {common.announcement_type !== announcementType.SMS && (
                <div className={classNames(styles.headingSubTitle)}>
                  <span
                    className={classNames(
                      styles.confirmationModalSubTitlePreviewText,
                      'mr-2'
                    )}
                  >
                    {preview}
                  </span>
                  <span
                    className={styles.confirmationModalSubTitlePreviewBracket}
                  >
                    {/* (the way it will appear to your users in their device) */}
                    {TheWayItWillAppearToYourUsersInTheirDevice}
                    <div className={classNames('mt-4')}>
                      <span>
                        <Trans i18nKey="askTeacherAndStudentToUpdateTheirAppData">
                          {ASK_TEACHER_AND_STUDENT_TO_UPDATE_THEIR_APP}
                        </Trans>
                      </span>
                    </div>
                  </span>
                </div>
              )}
            </div>
          </div>

          <div
            className={classNames(
              styles.confirmationDetailsSec,
              'tm-bg-light-blue',
              {
                [styles.smsPreviewContainer]:
                  common.announcement_type === announcementType.SMS,
              }
            )}
          >
            {common.announcement_type === announcementType.ANNOUNCEMENT && (
              <>
                <div className={classNames(styles.dFlex, 'align-baseline ')}>
                  <div className={styles.confirmationDetailsLabel}>
                    {tTitle}:
                  </div>
                  <div className={styles.confirmationDetailsMessage}>
                    {title}
                  </div>
                </div>
                <div
                  className={classNames(
                    styles.dFlex,
                    styles.confirmationDetailsMessageSec
                  )}
                >
                  <div className={styles.confirmationDetailsLabel}>
                    {tMessage}:
                  </div>
                  <div
                    className={classNames(
                      styles.confirmationDetailsMessage,
                      styles.whiteSpaceBreakSpaces,
                      'word-break'
                    )}
                  >
                    {message}
                  </div>
                </div>
              </>
            )}
            {common.announcement_type === announcementType.FEEDBACK && (
              <div className={classNames(styles.confirmationFeedbackSection)}>
                <div className={styles.confirmationDetailsLabel}>
                  {tQuestion}:
                </div>
                <div
                  className={classNames(
                    styles.confirmationDetailTitle,
                    styles.whiteSpaceBreakSpaces,
                    'word-break'
                  )}
                >
                  {feedback.message}
                </div>
              </div>
            )}

            {common.announcement_type === announcementType.POLL && (
              <>
                <div
                  className={classNames(
                    styles.dFlex,
                    styles.alignCenter,
                    'section',
                    'mb-4'
                  )}
                >
                  <div className={styles.confirmationDetailsLabel}>
                    {tQuestion}:
                  </div>
                  <div
                    className={classNames(
                      styles.confirmationDetailTitle,
                      styles.whiteSpaceBreakSpaces,
                      'word-break'
                    )}
                  >
                    {poll.message}
                  </div>
                </div>

                <div className={classNames('px-3')}>
                  {poll.question_options &&
                    Object.keys(poll.question_options).map((option, idx) => {
                      return (
                        <div
                          className={classNames(
                            styles.dFlex,
                            styles.alignCenter,
                            'mb-3'
                          )}
                          key={idx}
                        >
                          <span
                            className={styles.confirmationDetailsLabel}
                          >{`${tOption} ${idx + 1}:`}</span>
                          <span
                            className={classNames(
                              styles.confirmationDetailsOption,
                              styles.wordBreak
                            )}
                          >
                            {poll.question_options[option]}
                          </span>
                        </div>
                      )
                    })}
                </div>
              </>
            )}
            {common.announcement_type === announcementType.SMS && (
              <div className={styles.contentContainer}>
                <div className={styles.smsPreviewTitle}>
                  <Trans
                    i18nKey="smsPreviewHeading"
                    values={{
                      role: roleType[sms.smsPreview.user?.type] || '',
                      userName: sms.smsPreview.user?.name,
                    }}
                  />
                </div>
                <div className={styles.smsBodyContainer}>
                  {sms.smsPreview.template_message}
                </div>
                <div className={styles.userCountContainer}>
                  <div>
                    <Trans
                      i18nKey="smsUserCount"
                      values={{count: selected_users.length}}
                    />
                  </div>
                  <div className={styles.invoiceContainer}>
                    <div className={styles.balanceDisplayContainer}>
                      <div className={styles.balanceVals}>
                        <div className={styles.balanceLabel}>
                          {t('smsCurrBalance')}
                        </div>
                        <div className={styles.balanceCount}>{unusedQuota}</div>
                      </div>
                      <div className={styles.balanceVals}>
                        <div className={styles.balanceLabel}>
                          {t('smsNeeded')}
                        </div>
                        <div className={styles.balanceCount}>
                          {creditsRequired}
                        </div>
                      </div>
                      <div className={styles.balanceVals}>
                        <div className={styles.balanceLabel}>
                          {t('smsBalanceAfter')}
                        </div>
                        <div
                          className={classNames(styles.balanceCount, {
                            [styles.redText]: !(unusedQuota - creditsRequired),
                          })}
                        >
                          {unusedQuota - creditsRequired}
                        </div>
                      </div>
                    </div>
                    {creditsRequired >= selected_users.length ? (
                      <Accordion
                        isOpen={false}
                        headerContent={
                          <Trans
                            i18nKey="smsBalanceExplain"
                            values={{count: creditsRequired}}
                          />
                        }
                        children={t('smsAccordionBody')}
                        allowHeaderClick={true}
                        classes={{
                          accordionHeader: styles.accordionHeader,
                          accordionBody: styles.accordionBody,
                        }}
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            )}
          </div>
          <Divider spacing="0px" />
          <div className={styles.confirmationBtnSec}>
            <button
              className={classNames(styles.confirmationBtns, styles.declineBtn)}
              onClick={props.handleConfirmationModalClose}
            >
              {tCancel}
            </button>
            <button
              className={classNames(styles.confirmationBtns, styles.comfirmBtn)}
              onClick={onSubmit}
            >
              {tConfirm}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
