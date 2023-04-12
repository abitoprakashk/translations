import {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {t} from 'i18next'
import {DateTime} from 'luxon'
import {
  Button,
  Datepicker,
  Divider,
  Heading,
  HEADING_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  Input,
  INPUT_TYPES,
  Modal,
  MODAL_CONSTANTS,
  Para,
  RequiredSymbol,
  TimePicker,
} from '@teachmint/krayon'
import {ErrorBoundary} from '@teachmint/common'
import styles from './FollowUps.module.css'
import globalActions from '../../../../../redux/actions/global.actions'
import {useAddUpdateFollowups} from '../../../redux/admissionManagement.selectors'
import {events} from '../../../../../utils/EventsConstants'

export default function FollowUps({
  showModal,
  setShowModal,
  eventName,
  leadId,
  followupId,
  formValues = {
    note: '',
    followupDate: DateTime.now().toJSDate(),
    followupTime: DateTime.now().toFormat('hh:mm a'),
  },
  isProfilePage = false,
  isFollowupPage = false,
}) {
  const dispatch = useDispatch()
  const eventManager = useSelector((state) => state.eventManager)
  const addUpdateFollowups = useAddUpdateFollowups()
  const [formData, setFormData] = useState(formValues)
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (fieldName, fieldValue) => {
    setFormData({
      ...formData,
      [fieldName]: fieldValue,
    })
  }

  const handleSave = () => {
    setErrorMessage('')
    let payload = {...formData}

    eventManager.send_event(events.LEAD_FOLLOW_UP_SAVE_CLICKED_TFI, {
      date: DateTime.fromJSDate(payload.followupDate).toFormat('dd-MM-yyyy'),
      time: payload.followupTime,
      message: payload.note ? 'y' : 'n',
      screenName: eventName,
    })

    if (leadId) {
      // Add follow-ups against specific lead
      payload.lead_id = leadId
    } else {
      // Update existing follow-up
      payload._id = followupId
    }
    const successAction = () => {
      if (isFollowupPage) {
        // If requested from FollowUps Page, then refresh the list
        dispatch(globalActions.getFollowupList.request())
      } else if (isProfilePage) {
        // If requested from Profile Page, then refresh
        // followup count along with recent activity list
        dispatch(globalActions.getLeadData.request(payload.lead_id))
        dispatch(globalActions.getLeadRecentActivity.request(payload.lead_id))
      }
      setShowModal(false)
    }
    dispatch(
      globalActions.addUpdateFollowups.request(
        {
          payload,
          isFollowupPage,
        },
        successAction,
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
              {t('followUpModalHeader')}
            </Heading>
          </div>
          <div>
            <Icon
              onClick={() => setShowModal(!showModal)}
              name="close"
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
            onClick={handleSave}
            isDisabled={
              !formData.followupDate || !formData.followupTime || !formData.note
            }
          >
            {t('followUpModalSaveBtnText')}
          </Button>
        </div>
      </div>
    )
  }

  const followupTime = formData.followupTime
    ? DateTime.fromFormat(formData.followupTime, 'hh:mm a')
    : DateTime.fromFormat(DateTime.now().toFormat('hh:mm a'), 'hh:mm a')

  return (
    <Modal
      isOpen={showModal}
      size={MODAL_CONSTANTS.SIZE.AUTO}
      onClose={() => setShowModal(!showModal)}
      header={getModalHeader()}
      footer={getModalFooter()}
      shouldCloseOnEsc={false}
      shouldCloseOnOverlayClick={false}
      classes={{modal: styles.modal, content: styles.modalContent}}
    >
      <ErrorBoundary>
        {addUpdateFollowups.isLoading ? (
          <div className="loader"></div>
        ) : (
          <>
            <div className={styles.followupDateTime}>
              <div>
                <div className={styles.formLabel}>
                  <Para>{t('followUpLabelFollowupDate')}</Para>
                  <RequiredSymbol />
                </div>
                <div>
                  <Datepicker
                    closeOnChange={true}
                    value={formData.followupDate}
                    showMonthAndYearPickers={false}
                    minDate={DateTime.now().toJSDate()}
                    className={{calendarWrapper: styles.calendar}}
                    onChange={(date) => handleChange('followupDate', date)}
                  />
                </div>
              </div>
              <div>
                <div className={styles.formLabel}>
                  <Para>{t('followUpLabelFollowupTime')}</Para>
                  <RequiredSymbol />
                </div>
                <TimePicker
                  className={styles.timepicker}
                  hr={
                    followupTime?.hour > 12
                      ? followupTime?.hour - 12 < 10
                        ? `0${(followupTime?.hour - 12).toString()}`
                        : followupTime?.hour - 12
                      : followupTime?.hour < 10
                      ? `0${followupTime?.hour.toString()}`
                      : followupTime?.hour
                  }
                  mi={
                    followupTime?.minute < 10
                      ? `0${followupTime?.minute.toString()}`
                      : followupTime?.minute
                  }
                  setTime={(time) => handleChange('followupTime', time)}
                  typeFormat={followupTime ? followupTime.toFormat('a') : ''}
                  initialTime={
                    formData.followupTime
                      ? formData.followupTime
                      : DateTime.now().toFormat('hh:mm a')
                  }
                />
              </div>
            </div>
            <div>
              <div className={styles.followupNote}>
                <Input
                  maxLength={200}
                  fieldName="note"
                  value={formData.note}
                  type={INPUT_TYPES.TEXT_AREA}
                  isRequired={true}
                  title={t('followUpLabelMessage')}
                  placeholder={t('followUpPlaceholderMessage')}
                  onChange={(e) => {
                    handleChange(e.fieldName, e.value)
                  }}
                />
              </div>
            </div>
          </>
        )}
      </ErrorBoundary>
    </Modal>
  )
}
