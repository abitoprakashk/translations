import {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {events} from '../../../../../utils/EventsConstants'
import {t} from 'i18next'
import {
  Modal,
  Heading,
  Icon,
  ICON_CONSTANTS,
  HEADING_CONSTANTS,
  Divider,
  Button,
  Input,
  INPUT_TYPES,
} from '@teachmint/krayon'
import {ErrorBoundary} from '@teachmint/common'
import {sendSMSTemplate, smsTemplates} from './constants'
import {useSendSMS} from '../../../redux/admissionManagement.selectors'
import globalActions from '../../../../../redux/actions/global.actions'
import styles from './SendSms.module.css'

export default function SendSms({
  leadId,
  showModal,
  setShowModal,
  eventName,
  isProfilePage,
}) {
  const dispatch = useDispatch()
  const eventManager = useSelector((state) => state.eventManager)
  const sendSMSData = useSendSMS()

  const [errorMessage, setErrorMessage] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState(
    sendSMSTemplate.CRM_APP_FORM_REMINDER
  )

  const templateData = Object.values(smsTemplates)

  const sendSmsAction = () => {
    setErrorMessage('')
    dispatch(
      globalActions.sendSMS.request(
        {
          lead_id: leadId,
          sms_template_id: selectedTemplate,
        },
        () => {
          if (isProfilePage) {
            dispatch(globalActions.getLeadRecentActivity.request(leadId))
          }
          eventManager.send_event(events.LEAD_SMS_SEND_CLICKED_TFI, {
            screee_name: eventName,
          })
          setShowModal(false)
        },
        (error) => setErrorMessage(error)
      )
    )
  }

  const getModalHeader = () => {
    return (
      <div>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>
            <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.X_SMALL}>
              {t('leadProfileSendSms')}
            </Heading>
          </div>
          <div>
            <Icon
              name="close"
              onClick={() => setShowModal(!showModal)}
              size={ICON_CONSTANTS.SIZES.XX_SMALL}
              className={styles.modalClickable}
            />
          </div>
        </div>
        <Divider spacing="0" />
      </div>
    )
  }

  const getModalFooter = () => {
    return (
      <div>
        <Divider spacing="0" />
        <div className={styles.modalFooter}>
          <div className={styles.modalErrorSection}>
            {errorMessage && (
              <>
                <Icon name="info" type={ICON_CONSTANTS.TYPES.ERROR} />
                <div>{errorMessage}</div>
              </>
            )}
          </div>
          <Button
            isDisabled={sendSMSData?.isLoading}
            onClick={sendSmsAction}
            classes={{button: styles.changeLeadStageButton}}
          >
            {t('leadProfileSend')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Modal
      isOpen={showModal}
      onClose={() => setShowModal(!showModal)}
      header={getModalHeader()}
      footer={getModalFooter()}
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
      classes={{
        modal: styles.modal,
      }}
    >
      <ErrorBoundary>
        <div className={styles.modalContent}>
          {sendSMSData?.isLoading ? (
            <div className="loader" />
          ) : (
            <>
              <Input
                isRequired={true}
                type={INPUT_TYPES.DROPDOWN}
                value={selectedTemplate}
                fieldName="selectedTemplate"
                title={t('leadProfileSendSmsChooseTemplate')}
                onChange={({value}) => setSelectedTemplate(value)}
                options={templateData.map((item) => ({
                  label: item.label,
                  value: item.templateId,
                }))}
                classes={{
                  wrapperClass: styles.dropDownSize,
                  optionsClass: styles.dropDownOptions,
                }}
              />
              <div className={styles.messageBox}>
                <Input
                  isDisabled={true}
                  type={INPUT_TYPES.TEXT_AREA}
                  title={t('followUpLabelMessage')}
                  classes={{
                    wrapper: styles.messageWrapper,
                  }}
                  value={
                    templateData.find(
                      ({templateId}) => templateId === selectedTemplate
                    ).content
                  }
                />
              </div>
            </>
          )}
        </div>
      </ErrorBoundary>
    </Modal>
  )
}
