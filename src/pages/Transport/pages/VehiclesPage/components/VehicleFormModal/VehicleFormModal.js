import {useTranslation} from 'react-i18next'
import {useEffect, useState} from 'react'
import {v4 as uuidv4} from 'uuid'
import {useDispatch, useSelector} from 'react-redux'
import styles from './vehicleFormModal.module.css'
import {
  Modal,
  Button,
  Icon,
  ICON_CONSTANTS,
  MODAL_CONSTANTS,
  BUTTON_CONSTANTS,
} from '@teachmint/krayon'
import VehicleCard from '../VehicleCard/VehicleCard'
import globalActions from '../../../../../../redux/actions/global.actions'
import {NEW_VEHICLE_DATA, NEW_VEHICLE_ERROR} from '../../constants'
import {events} from '../../../../../../utils/EventsConstants'
import {alphaNumericRegex} from '../../../../../../utils/Validations'
import VehicleDocumentsForm from '../VehicleDocumentsForm/VehicleDocumentsForm'

export default function VehicleFormModal({
  showModal,
  setShowModal,
  isEdit,
  editData,
}) {
  const [vehicles, setVehicles] = useState({})
  const [formErrors, setFormErrors] = useState({})
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [showVehicleDocumentForm, setShowVehicleDocumentsForm] = useState(null)

  const {t} = useTranslation()
  const dispatch = useDispatch()
  const eventManager = useSelector((state) => state.eventManager)

  useEffect(() => setVehicles(getNewVehicle()), [])

  const putErrorForEditData = () => {
    const key = Object.keys(editData)[0]
    const editVehicle = editData[key]
    let error = {}
    const getError = (field, value) => {
      let hasError = null
      switch (field) {
        case 'number':
          if (!alphaNumericRegex(value))
            hasError = t('onlyAlphabetsNumbersAllowed')
          if (!value) hasError = ''
          break
        case 'type':
          if (!value) hasError = ''
          break
        case 'capacity':
          if (!value) hasError = ''
          break
        case 'name':
          if (!alphaNumericRegex(value))
            hasError = t('onlyAlphabetsNumbersAllowed')
          break
        default:
          break
      }
      return hasError
    }
    for (const field in editVehicle) {
      let value = editVehicle[field]
      error[field] = getError(field, value)
    }
    setFormErrors({...formErrors, [key]: error})
  }

  const getNewVehicle = () => {
    if (isEdit) {
      putErrorForEditData()
      return editData
    }
    // key to create a new vehicle
    let key = uuidv4()
    //set errors for newvehicle with all input fields as empty
    setFormErrors({...formErrors, [key]: {...NEW_VEHICLE_ERROR}})

    return {[key]: {...NEW_VEHICLE_DATA}}
  }

  const duplicateList = ['number']

  const duplicateErrorMsgMap = {
    number: t('vehicleNumberNotUnique'),
  }

  const removeDuplicateError = (errors, vehicles, previousVal, field) => {
    if (!previousVal) return errors
    let newErrors = {...errors}
    let previousValIdList = []
    for (const key in vehicles) {
      let currentVehicle = vehicles[key]
      if (
        currentVehicle[field]?.toLowerCase()?.trim() ===
        previousVal?.toLowerCase()?.trim()
      ) {
        previousValIdList.push(key)
      }
    }
    if (previousValIdList.length === 1) {
      if (
        newErrors[previousValIdList[0]][field] === duplicateErrorMsgMap[field]
      ) {
        newErrors[previousValIdList[0]][field] = null
      }
    }
    return newErrors
  }

  const addDuplicateError = (errors, vehicles, currentVal, field) => {
    if (!currentVal) return errors
    let newErrors = {...errors}
    const currentValIdList = []
    for (const key in vehicles) {
      let currentVehicle = vehicles[key]
      if (
        currentVehicle[field]?.toLowerCase()?.trim() ===
        currentVal?.toLowerCase()?.trim()
      ) {
        currentValIdList.push(key)
      }
    }
    if (currentValIdList.length > 1) {
      currentValIdList.forEach((id) => {
        if (newErrors[id][field] === null)
          newErrors[id][field] = duplicateErrorMsgMap[field]
      })
    }
    return newErrors
  }

  const onVehicleChange = (data, error, id, field) => {
    let newVehicles = {...vehicles, [id]: data}
    let newErrors = {...formErrors, [id]: error}
    let previousVal = vehicles[id][field]
    let currentVal = newVehicles[id][field]
    if (duplicateList.includes(field)) {
      newErrors = addDuplicateError(newErrors, newVehicles, currentVal, field)
      newErrors = removeDuplicateError(
        newErrors,
        newVehicles,
        previousVal,
        field
      )
    }
    setVehicles(newVehicles)
    setFormErrors(newErrors)
  }

  const handleAddVehicle = () => {
    setVehicles({...vehicles, ...getNewVehicle()})
    eventManager.send_event(events.ADD_ANOTHER_VEHICLE_CLICKED_TFI, {
      screen_name: 'add_vehicle',
    })
  }

  // handle vehicle card remove
  const onRemoveVehicle = (vehicleId) => {
    let newVehicles = {...vehicles}
    let newErrors = {...formErrors}
    delete newVehicles[vehicleId]
    delete newErrors[vehicleId]
    duplicateList.forEach((field) => {
      let previousVal = vehicles[vehicleId][field]
      newErrors = removeDuplicateError(
        newErrors,
        newVehicles,
        previousVal,
        field
      )
    })
    setVehicles(newVehicles)
    setFormErrors(newErrors)
  }

  const getPayload = () => {
    let list = []

    for (const key in vehicles) {
      const currentData = vehicles[key]
      let vehicleObj = {}
      vehicleObj.vehicle_name = currentData.name
      vehicleObj.number = currentData.number
      vehicleObj.gps_imei = currentData.imei || ''
      vehicleObj.seating_capacity = parseInt(currentData.capacity)
      vehicleObj.vehicle_type = currentData.type
      if (currentData.documents !== undefined)
        vehicleObj.documents = currentData.documents
      if (isEdit) vehicleObj._id = key

      list.push(vehicleObj)
    }

    const payload = {vehicles_list: list}
    return payload
  }

  const getFormHasError = () => {
    for (const key in formErrors) {
      const curError = formErrors[key]
      for (const fieldName in curError) {
        if (!(curError[fieldName] === null)) {
          return true
        }
      }
    }
    return false
  }

  const onConfirm = () => {
    eventManager.send_event(events.ADD_VEHICLE_POPUP_CLICKED_TFI, {
      screen_name: 'add_vehicle',
      action: 'confirm',
    })
    const payload = getPayload()
    const successAction = () => {
      if (isEdit) {
        const editedVehicle = payload?.vehicles_list[0]
        eventManager.send_event(events.VEHICLE_DETAILS_EDITED_TFI, {
          vehicle_capacity: editedVehicle?.seating_capacity,
          vehicle_type: editedVehicle?.vehicle_type,
        })
      } else {
        eventManager.send_event(events.VEHICLE_ADDED_TFI, {
          count: Object.keys(vehicles)?.length,
        })
      }
      onModalClose()
    }
    dispatch(
      globalActions?.updateTransportVehicles?.request(payload, successAction)
    )
  }

  const onModalClose = () => {
    setShowModal(false)
    eventManager.send_event(events.ADD_VEHICLE_POPUP_CLICKED_TFI, {
      screen_name: 'add_vehicle',
      action: 'close',
    })
  }

  const onVehicleDocumentsClick = (id) => {
    setSelectedVehicle(id)
    setShowVehicleDocumentsForm(vehicles[id]?.documents || [])
  }

  const onVehicleDocumentsChange = (newDocuments) => {
    setShowVehicleDocumentsForm(newDocuments)
  }

  const handleDocumentChangesSave = () => {
    let newVehicles = {...vehicles}
    newVehicles[selectedVehicle].documents = showVehicleDocumentForm
    setShowVehicleDocumentsForm(null)
    setVehicles(newVehicles)
  }

  return (
    <Modal
      header={isEdit ? t('editVehicle') : t('addVehicle')}
      headerIcon={
        <Icon
          size={ICON_CONSTANTS.SIZES.SMALL}
          name="bus1"
          type={ICON_CONSTANTS.TYPES.BASIC}
        />
      }
      isOpen={showModal}
      onClose={onModalClose}
      actionButtons={
        showVehicleDocumentForm
          ? [
              {
                body: t('saveChanges'),
                onClick: handleDocumentChangesSave,
              },
            ]
          : [
              {
                onClick: onConfirm,
                body: t('confirm'),
                isDisabled: getFormHasError(),
              },
            ]
      }
      footerLeftElement={
        showVehicleDocumentForm ? (
          <Button
            type={BUTTON_CONSTANTS.TYPE.TEXT}
            prefixIcon="backArrow"
            onClick={() => setShowVehicleDocumentsForm(null)}
          >
            {t('backToVehicles')}
          </Button>
        ) : null
      }
      size={MODAL_CONSTANTS.SIZE.LARGE}
      shouldCloseOnOverlayClick={false}
      classes={{modal: styles.modal, content: styles.modalContent}}
    >
      {showVehicleDocumentForm ? (
        <div className={styles.documentFormWrapper}>
          <VehicleDocumentsForm
            documents={showVehicleDocumentForm || []}
            onDocumentsChange={onVehicleDocumentsChange}
          />
        </div>
      ) : (
        <div className={styles.formWrapper}>
          <div className={styles.vehicleCardsWrapper}>
            {Object.keys(vehicles).map((id, index) => (
              <VehicleCard
                isEdit={isEdit}
                key={id}
                id={id}
                index={index + 1}
                vehicleData={vehicles[id]}
                cardError={formErrors[id]}
                onRemoveVehicle={onRemoveVehicle}
                removable={Object.keys(vehicles).length > 1}
                onVehicleChange={onVehicleChange}
                onVehicleDocumentsClick={onVehicleDocumentsClick}
              />
            ))}
          </div>

          {!isEdit && (
            <Button
              onClick={handleAddVehicle}
              type={BUTTON_CONSTANTS.TYPE.TEXT}
              classes={{button: styles.addVehicleButton}}
            >
              {`+ ${t('addAnotherVehicle')}`}
            </Button>
          )}
        </div>
      )}
    </Modal>
  )
}
