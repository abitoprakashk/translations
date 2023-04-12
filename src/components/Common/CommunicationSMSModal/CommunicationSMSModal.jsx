import {
  Accordion,
  BUTTON_CONSTANTS,
  Modal,
  MODAL_CONSTANTS,
  Para,
  PARA_CONSTANTS,
  PlainCard,
} from '@teachmint/krayon'
import React, {useEffect} from 'react'
import {Trans, useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import {roleType} from '../../../pages/communication/constants'
import {
  getSmsPreview,
  getSmsUnusedQuotaRequest,
  sendSms,
} from '../../../pages/communication/redux/actions/smsActions'
import {events} from '../../../utils/EventsConstants'
import styles from './CommunicationSMSModal.module.css'

export default function CommunicationSMSModal({
  showModal,
  setShowModal,
  templateId,
  templateData,
  usersList,
}) {
  if (!showModal) return null

  const dispatch = useDispatch()
  const {t} = useTranslation()

  const eventManager = useSelector((state) => state.eventManager)
  const {sms} = useSelector((state) => state?.communicationInfo)
  const {unusedQuota, creditsRequired} = sms

  useEffect(() => {
    // Get SMS quota
    dispatch(getSmsUnusedQuotaRequest())

    // Get preview
    getSMSPreview()
  }, [])

  const getSMSSettingsObject = () => ({
    template_id: templateId,
    input_variables: templateData,
    selected_users: usersList,
    draft: false,
  })

  const handleClose = () => {
    eventManager.send_event(events.SIS_SEND_INVITE_POPUP_CLICKED_TFI, {
      user_count: usersList?.length || 0,
      action: 'close',
    })
    setShowModal(false)
  }

  const getSMSPreview = () => dispatch(getSmsPreview(getSMSSettingsObject()))

  const sendSMS = () => {
    eventManager.send_event(events.SIS_SEND_INVITE_POPUP_CLICKED_TFI, {
      user_count: usersList?.length || 0,
      action: 'confirm',
    })
    dispatch(sendSms(getSMSSettingsObject()))
    setShowModal(false)
  }

  return (
    <div>
      <Modal
        isOpen={showModal}
        onClose={handleClose}
        header={t('smsConfirmationHeading')}
        classes={{modal: styles.modal, content: styles.content}}
        actionButtons={[
          {
            onClick: handleClose,
            body: t('cancel'),
            type: BUTTON_CONSTANTS.TYPE.OUTLINE,
          },
          {onClick: sendSMS, body: t('send')},
        ]}
        size={MODAL_CONSTANTS.SIZE.SMALL}
      >
        <div>
          <div className={styles.contentContainer}>
            <Para>
              <Trans
                i18nKey="smsPreviewHeading"
                values={{
                  role: roleType[sms.smsPreview.user?.type] || '',
                  userName: sms.smsPreview.user?.name,
                }}
              />
            </Para>

            <div className={styles.smsBodyContainer}>
              <Para>{sms.smsPreview.template_message}</Para>
            </div>

            <div>
              <Para
                type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
                weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
              >
                <Trans
                  i18nKey="smsUserCount"
                  values={{count: usersList?.length || 0}}
                />
              </Para>

              <PlainCard className={styles.invoiceCard}>
                <div className={styles.balanceDisplayContainer}>
                  <div>
                    <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
                      {t('smsCurrBalance')}
                    </Para>
                    <Para type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}>
                      {unusedQuota}
                    </Para>
                  </div>
                  <div>
                    <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
                      {t('smsNeeded')}
                    </Para>
                    <Para type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}>
                      {creditsRequired}
                    </Para>
                  </div>
                  <div>
                    <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
                      {t('smsBalanceAfter')}
                    </Para>
                    <Para
                      type={
                        unusedQuota - creditsRequired >= 0
                          ? PARA_CONSTANTS.TYPE.TEXT_PRIMARY
                          : PARA_CONSTANTS.TYPE.ERROR
                      }
                    >
                      {unusedQuota - creditsRequired}
                    </Para>
                  </div>
                </div>

                {creditsRequired > usersList?.length && (
                  <Accordion
                    isOpen={false}
                    headerContent={
                      <Para type={PARA_CONSTANTS.TYPE.PRIMARY}>
                        <Trans
                          i18nKey="smsBalanceExplain"
                          values={{count: creditsRequired}}
                        />
                      </Para>
                    }
                    allowHeaderClick={true}
                    classes={{
                      accordionHeader: styles.accordionHeader,
                      accordionBody: styles.accordionBody,
                    }}
                  >
                    <Para>{t('smsAccordionBody')}</Para>
                  </Accordion>
                )}
              </PlainCard>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
