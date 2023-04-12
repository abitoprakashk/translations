import {useTranslation} from 'react-i18next'
import {useDispatch} from 'react-redux'
import styles from './requestBiometricModal.module.css'
import {useSelector} from 'react-redux'
import {
  Modal,
  MODAL_CONSTANTS,
  Para,
  Radio,
  Input,
  INPUT_TYPES,
} from '@teachmint/krayon'
import {useState, useEffect} from 'react'
import globalActions from '../../../../../../../redux/actions/global.actions'
import {numericRegex} from '../../../../../../../utils/Validations'
import {events} from '../../../../../../../utils/EventsConstants'
import biometricRequestType from '../../../../utils/constants'

export default function RequestBiometricModal({
  showModal,
  setShowModal,
  biometricRequestError,
  setBiometricRequestError,
}) {
  const onModalClose = () => {
    setShowModal(false)
  }
  const {eventManager} = useSelector((state) => state)
  const dispatch = useDispatch()
  const [showMachineRequest, setShowMachineRequest] = useState(0)
  const [machineList, setMachineList] = useState([])
  const [selectedMachines, setSelectedMachines] = useState([])
  const [question1Option1, setQuestion1Option1] = useState('')
  const [question1Option2, setQuestion1Option2] = useState('')
  const [question2Option2, setQuestion2Option2] = useState('')

  const fetchBiometricSettings = useSelector(
    (state) => state?.globalData?.fetchBiometricSettings?.data
  )

  const {t} = useTranslation()

  const handleFormSubmit = () => {
    let payload = {
      request_type:
        showMachineRequest === 1
          ? biometricRequestType.NEW
          : biometricRequestType.INTEGRATE,
      custom_data:
        showMachineRequest === 1
          ? {n_devices: question1Option1, additional_request: question1Option2}
          : {device_models: selectedMachines, n_devices: question2Option2},
    }

    eventManager.send_event(events.HRMS_BIOMETRIC_CONFIGURATION_REQUESTED_TFI, {
      looking_biometric_machine: showMachineRequest === 1 ? 'yes' : 'no',
      have_biometric_machine: showMachineRequest === 2 ? 'yes' : 'no',
      no_of_devices:
        showMachineRequest === 1 ? question1Option1 : question2Option2,
      specifications: question1Option2,
      company: selectedMachines,
    })

    dispatch(globalActions?.requestBiometricMachines?.request(payload))
    setShowModal(false)
  }

  useEffect(() => {
    setSelectedMachines([])
    setQuestion1Option1('')
    setQuestion1Option2('')
    setQuestion2Option2('')
    setBiometricRequestError({
      question1Option1: '',
      question1Option2: '',
      question2Option1: '',
      question2Option2: '',
    })
  }, [showMachineRequest])

  useEffect(() => {
    setShowMachineRequest(0)
    setSelectedMachines([])
    setQuestion1Option1('')
    setQuestion1Option2('')
    setQuestion2Option2('')
    setBiometricRequestError({
      question1Option1: '',
      question1Option2: '',
      question2Option1: '',
      question2Option2: '',
    })
  }, [showModal])

  const getFormHasError = () => {
    let hasError = false
    if (showMachineRequest === 1 && question1Option1 === '') {
      hasError = true
    }
    if (
      showMachineRequest === 2 &&
      (!selectedMachines?.length || question2Option2 === '')
    ) {
      hasError = true
    }

    hasError = hasError
      ? hasError
      : Object.values(biometricRequestError)?.some((value) => value)

    return hasError
  }

  useEffect(() => {
    let tempMachinesList = []
    fetchBiometricSettings?.machines_supported?.forEach((obj) =>
      tempMachinesList.push({value: obj, label: obj})
    )
    setMachineList(tempMachinesList)
  }, [showMachineRequest])

  const handleInputChange = ({fieldName, value}) => {
    switch (fieldName) {
      case 'question1Option1':
        if (!numericRegex(value)) {
          biometricRequestError.question1Option1 = t('onlyNumbersAllowed')
        } else biometricRequestError.question1Option1 = ''

        if (!value) biometricRequestError.question1Option1 = ''
        setQuestion1Option1(value)
        break
      case 'question1Option2':
        setQuestion1Option2(value)
        break
      case 'question2Option2':
        if (!numericRegex(value)) {
          biometricRequestError.question2Option2 = t('onlyNumbersAllowed')
        } else biometricRequestError.question2Option2 = ''

        if (!value) biometricRequestError.question2Option2 = ''
        setQuestion2Option2(value)
        break
      default:
        break
    }
  }

  return (
    <Modal
      header={t('biometricIntegration')}
      classes={{modal: styles.modal, header: styles.modalHeader}}
      isOpen={showModal}
      onClose={onModalClose}
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
        <Para
          type="text-primary"
          textSize="x_l"
          className={styles.biometricQuestion}
        >
          {t('biometricRequestWhatIsYourRequirement')}
        </Para>
        <div className={styles.biometricOptionWrapper}>
          <div onClick={() => setShowMachineRequest(1)}>
            <Radio
              className={styles.biometricOption}
              isSelected={showMachineRequest === 1}
              label={t('biometricRequestWhatIsYourRequirementOption1')}
            />
          </div>
          <div onClick={() => setShowMachineRequest(2)}>
            <Radio
              className={styles.biometricOption}
              isSelected={showMachineRequest === 2}
              label={t('biometricRequestWhatIsYourRequirementOption2')}
            />
          </div>
        </div>
        {showMachineRequest === 1 && (
          <>
            <div className={styles.lineBreak}>
              <hr />
            </div>
            <Para
              type="text-primary"
              textSize="x_l"
              className={styles.biometricQuestion}
            >
              {t('biometricRequestWhatIsYourRequirementOption1Question1')}
            </Para>
            <Input
              type={INPUT_TYPES.TEXT}
              fieldName="question1Option1"
              value={question1Option1}
              onChange={handleInputChange}
              required={true}
              placeholder={'5'}
              infoType={biometricRequestError?.question1Option1 ? 'error' : ''}
              infoMsg={
                biometricRequestError?.question1Option1
                  ? biometricRequestError.question1Option1
                  : ''
              }
              showMsg={true}
              classes={{wrapper: styles.inputWrapper, input: styles.textSize}}
            />
            <Para
              type="text-primary"
              textSize="x_l"
              className={styles.biometricQuestion}
            >
              {t('biometricRequestWhatIsYourRequirementOption1Question2')}
            </Para>
            <Input
              type={INPUT_TYPES.TEXT_AREA}
              rows={5}
              fieldName="question1Option2"
              value={question1Option2}
              onChange={handleInputChange}
              placeholder={t(
                'biometricRequestWhatIsYourRequirementOption1Question2Placeholder'
              )}
              maxLength={500}
              classes={{wrapper: styles.inputWrapper, input: styles.textSize}}
            />
          </>
        )}
        {showMachineRequest === 2 && (
          <>
            <div className={styles.lineBreak}>
              <hr />
            </div>
            <Para
              type="text-primary"
              textSize="x_l"
              className={styles.biometricQuestion}
            >
              {t('biometricRequestWhatIsYourRequirementOption2Question1')}
            </Para>
            <Input
              isRequired={false}
              type={INPUT_TYPES.DROPDOWN}
              isMultiSelect={true}
              fieldName="machineList"
              value={selectedMachines}
              placeholder={t('select')}
              options={machineList}
              required={true}
              onChange={({value}) => {
                setSelectedMachines([...value])
              }}
              classes={{
                wrapper: styles.dropdownWrapper,
                input: styles.textSize,
              }}
            />
            <Para
              type="text-primary"
              textSize="x_l"
              className={styles.biometricQuestion}
            >
              {t('biometricRequestWhatIsYourRequirementOption2Question2')}
            </Para>
            <Input
              type={INPUT_TYPES.TEXT}
              rows={5}
              fieldName="question2Option2"
              value={question2Option2}
              onChange={handleInputChange}
              infoType={biometricRequestError?.question2Option2 ? 'error' : ''}
              infoMsg={
                biometricRequestError?.question2Option2
                  ? biometricRequestError.question2Option2
                  : ''
              }
              showMsg={true}
              placeholder={'5'}
              required={true}
              classes={{wrapper: styles.inputWrapper, input: styles.textSize}}
            />
          </>
        )}
      </div>
    </Modal>
  )
}
