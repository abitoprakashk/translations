import {useTranslation} from 'react-i18next'
import {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import styles from './vehicleDocumentsModal.module.css'
import {Modal, Icon, ICON_CONSTANTS, MODAL_CONSTANTS} from '@teachmint/krayon'
import globalActions from '../../../../../../redux/actions/global.actions'
import {events} from '../../../../../../utils/EventsConstants'
import VehicleDocumentsForm from '../VehicleDocumentsForm/VehicleDocumentsForm'

export default function VehicleDocumentsModal({
  showModal,
  setShowModal,
  vehicleData,
}) {
  const [documents, setDocuments] = useState(vehicleData?.documents || [])

  const {t} = useTranslation()
  const dispatch = useDispatch()
  const eventManager = useSelector((state) => state.eventManager)

  const getPayload = () => {
    let newVehicleData = {...vehicleData}
    newVehicleData.documents = documents
    return {vehicles_list: [newVehicleData]}
  }

  const onSave = () => {
    eventManager.send_event(events.ADD_VEHICLE_POPUP_CLICKED_TFI, {
      screen_name: 'add_vehicle',
      action: 'confirm',
    })
    const payload = getPayload()
    const successAction = () => {
      onModalClose()
    }
    dispatch(
      globalActions?.updateTransportVehicles?.request(payload, successAction)
    )
  }

  const onModalClose = () => {
    setShowModal(false)
  }

  const onVehicleDocumentsChange = (newDocuments) => {
    setDocuments(newDocuments)
  }

  return (
    <Modal
      header={`${t('documentsOf')} ${vehicleData.number}`}
      headerIcon={
        <Icon
          size={ICON_CONSTANTS.SIZES.SMALL}
          name="topic"
          type={ICON_CONSTANTS.TYPES.BASIC}
        />
      }
      isOpen={showModal}
      onClose={onModalClose}
      actionButtons={[
        {
          body: t('saveChanges'),
          onClick: onSave,
        },
      ]}
      size={MODAL_CONSTANTS.SIZE.LARGE}
      shouldCloseOnOverlayClick={false}
      classes={{modal: styles.modal, content: styles.modalContent}}
    >
      <VehicleDocumentsForm
        documents={documents || []}
        onDocumentsChange={onVehicleDocumentsChange}
      />
    </Modal>
  )
}
