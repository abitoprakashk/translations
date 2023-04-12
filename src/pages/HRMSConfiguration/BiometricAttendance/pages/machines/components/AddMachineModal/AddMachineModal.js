import {useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import styles from './addMachineModal.module.css'
import {Modal, Icon, ICON_CONSTANTS, MODAL_CONSTANTS} from '@teachmint/krayon'
import AddMachineCard from '../AddMachineCard/AddMachineCard'
import globalActions from '../../../../../../../redux/actions/global.actions'
import {events} from '../../../../../../../utils/EventsConstants'

export default function AddMachineModal({
  showModal,
  setShowModal,
  isEdit,
  machineData,
  cardError,
  setMachineData,
  setCardError,
  allRows,
}) {
  const onModalClose = () => {
    setShowModal(false)
  }
  const {eventManager} = useSelector((state) => state)
  const dispatch = useDispatch()

  const {t} = useTranslation()

  const handleFormSubmit = () => {
    let data = {
      ...(isEdit && {_id: machineData._id}),
      device_id: machineData.deviceID,
      model_name: machineData.companyName,
      machine_location: machineData.location,
    }

    let payload = {
      machine_data: [data],
    }
    if (!isEdit) {
      eventManager.send_event(events.HRMS_ADD_NEW_MACHINE_SAVE_CLICKED_TFI, {
        device_id: data.device_id,
        company_name: data.model_name,
        machine_location: data.machine_location,
      })
    }

    dispatch(globalActions?.updateBiometricMachines?.request(payload))
    setShowModal(false)
  }

  const getFormHasError = () => {
    let hasError = false
    hasError = !machineData?.deviceID ? true : false
    if (hasError) return hasError
    hasError = Object.values(cardError)?.some((value) => value)
    return hasError
  }

  return (
    <Modal
      header={isEdit ? t('editBiometricMachine') : t('addNewMachine')}
      classes={{modal: styles.modal}}
      headerIcon={
        <Icon
          size={ICON_CONSTANTS.SIZES.SMALL}
          name="fingerprint"
          type={ICON_CONSTANTS.TYPES.BASIC}
        />
      }
      isOpen={showModal}
      onClose={onModalClose}
      actionButtons={[
        {
          onClick: handleFormSubmit,
          body: t('confirm'),
          isDisabled: getFormHasError(),
        },
      ]}
      size={MODAL_CONSTANTS.SIZE.SMALL}
      shouldCloseOnOverlayClick={false}
    >
      <AddMachineCard
        machineData={machineData}
        setMachineData={setMachineData}
        cardError={cardError}
        setCardError={setCardError}
        allRows={allRows}
      />
    </Modal>
  )
}
