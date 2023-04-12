import {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import styles from './RequestLiveTrackingCard.module.css'
import {
  Modal,
  MODAL_CONSTANTS,
  Para,
  Radio,
  Input,
  INPUT_TYPES,
} from '@teachmint/krayon'
import globalActions from '../../../../../../redux/actions/global.actions'
import {numericRegex} from '../../../../../../utils/Validations'
import {events} from '../../../../../../utils/EventsConstants'

const INITIAL_INPUT_VALUES = {
  NEW_DEVICES: {nDevices: '', specs: ''},
  EXISTING_DEVICES: {nDevices: '', specs: ''},
}

export default function LiveTrackingIntegrationModal({
  showModal,
  setShowModal,
}) {
  if (!showModal) return null

  const [selectedRequestOption, setSelectedRequestOption] = useState()
  const [inputFieldValues, setInputFieldValues] = useState(INITIAL_INPUT_VALUES)

  const dispatch = useDispatch()
  const {t} = useTranslation()
  const eventManager = useSelector((state) => state?.eventManager)

  const onModalClose = () => {
    setShowModal(false)
  }

  const getPayload = () => {
    if (selectedRequestOption === 'NEW_DEVICES') {
      return {
        request_info: {
          option: 'REQUESTED_NEW_GPS_DEVICES',
          n_devices: inputFieldValues.NEW_DEVICES.nDevices,
          specifications: inputFieldValues.NEW_DEVICES.specs,
        },
      }
    } else if (selectedRequestOption === 'EXISTING_DEVICES') {
      return {
        request_info: {
          option: 'INTEGRATE_EXISTING_GPS_DEVICES',
          n_devices: inputFieldValues.EXISTING_DEVICES.nDevices,
          specifications: inputFieldValues.EXISTING_DEVICES.specs,
        },
      }
    }
  }

  const handleFormSubmit = () => {
    eventManager.send_event(events.GPS_REQUEST_POPUP_CLICKED_TFI, {
      action: 'submit',
    })
    const successAction = () => {
      eventManager.send_event(events.GPS_REQUESTED_TFI, {})
      onModalClose()
    }
    const payload = getPayload()
    dispatch(
      globalActions?.requestTransportGPS?.request(payload, successAction)
    )
  }

  const getFormHasError = () => {
    if (selectedRequestOption === 'NEW_DEVICES') {
      return !(
        inputFieldValues.NEW_DEVICES.specs !== '' &&
        inputFieldValues.NEW_DEVICES.nDevices !== ''
      )
    } else if (selectedRequestOption === 'EXISTING_DEVICES') {
      return !(
        inputFieldValues.EXISTING_DEVICES.specs !== '' &&
        inputFieldValues.EXISTING_DEVICES.nDevices !== ''
      )
    }
    return true
  }

  const handleInputChange = ({fieldName, value}) => {
    let newInputFieldValues = {...inputFieldValues}
    switch (fieldName) {
      case 'NEW_DEVICES_nDevices':
        if (!numericRegex(value) || value.length > 10) return
        newInputFieldValues.NEW_DEVICES.nDevices = value
        break
      case 'NEW_DEVICES_specs':
        newInputFieldValues.NEW_DEVICES.specs = value
        break
      case 'EXISTING_DEVICES_nDevices':
        if (!numericRegex(value) || value.length > 10) return
        newInputFieldValues.EXISTING_DEVICES.nDevices = value
        break
      case 'EXISTING_DEVICES_specs':
        newInputFieldValues.EXISTING_DEVICES.specs = value
        break
      default:
        break
    }
    setInputFieldValues(newInputFieldValues)
  }

  return (
    <Modal
      header={t('liveTrackingIntegration')}
      classes={{modal: styles.modal, header: styles.modalHeader}}
      isOpen={showModal}
      onClose={() => {
        eventManager.send_event(events.GPS_REQUEST_POPUP_CLICKED_TFI, {
          action: 'closed',
        })
        onModalClose()
      }}
      actionButtons={[
        {
          onClick: handleFormSubmit,
          body: t('request'),
          isDisabled: getFormHasError(),
        },
      ]}
      size={MODAL_CONSTANTS.SIZE.LARGE}
      shouldCloseOnOverlayClick={false}
    >
      <div className={styles.formWrapper}>
        <Para type="text-primary" textSize="x_l" className={styles.question}>
          {t('whatIsYourRequirement')}
        </Para>
        <div className={styles.optionWrapper}>
          <div onClick={() => setSelectedRequestOption('NEW_DEVICES')}>
            <Radio
              className={styles.option}
              isSelected={selectedRequestOption === 'NEW_DEVICES'}
              label={t('liveTrackingIntegrationRequestOption1')}
            />
          </div>
          <div onClick={() => setSelectedRequestOption('EXISTING_DEVICES')}>
            <Radio
              className={styles.option}
              isSelected={selectedRequestOption === 'EXISTING_DEVICES'}
              label={t('liveTrackingIntegrationRequestOption2')}
            />
          </div>
        </div>
        {selectedRequestOption === 'NEW_DEVICES' && (
          <>
            <div className={styles.lineBreak}>
              <hr />
            </div>
            <Para
              type="text-primary"
              textSize="x_l"
              className={styles.question}
            >
              {t('howManyDevicesYouAreLookingFor')}
            </Para>
            <Input
              type={INPUT_TYPES.TEXT}
              fieldName="NEW_DEVICES_nDevices"
              value={inputFieldValues?.NEW_DEVICES?.nDevices}
              onChange={handleInputChange}
              required={true}
              placeholder={'15'}
              showMsg={true}
              classes={{wrapper: styles.inputWrapper, input: styles.textSize}}
            />
            <Para
              type="text-primary"
              textSize="x_l"
              className={styles.question}
            >
              {t('specificationsYouAreLookingFor')}
            </Para>
            <Input
              type={INPUT_TYPES.TEXT_AREA}
              rows={5}
              fieldName="NEW_DEVICES_specs"
              value={inputFieldValues?.NEW_DEVICES?.specs}
              onChange={handleInputChange}
              maxLength={500}
              classes={{wrapper: styles.inputWrapper, input: styles.textSize}}
            />
          </>
        )}
        {selectedRequestOption === 'EXISTING_DEVICES' && (
          <>
            <div className={styles.lineBreak}>
              <hr />
            </div>
            <Para
              type="text-primary"
              textSize="x_l"
              className={styles.question}
            >
              {t('howManyDevicesYouHave')}
            </Para>
            <Input
              fieldName="EXISTING_DEVICES_nDevices"
              value={inputFieldValues?.EXISTING_DEVICES?.nDevices}
              onChange={handleInputChange}
              showMsg={true}
              placeholder={'15'}
              required={true}
              classes={{wrapper: styles.inputWrapper, input: styles.textSize}}
            />
            <Para
              type="text-primary"
              textSize="x_l"
              className={styles.question}
            >
              {t('pleaseSpecifyGPSCompany')}
            </Para>
            <Input
              type={INPUT_TYPES.TEXT_AREA}
              rows={5}
              fieldName="EXISTING_DEVICES_specs"
              value={inputFieldValues?.EXISTING_DEVICES?.specs}
              maxLength={500}
              onChange={handleInputChange}
              classes={{
                wrapper: styles.inputWrapper,
                input: styles.textSize,
              }}
            />
          </>
        )}
      </div>
    </Modal>
  )
}
