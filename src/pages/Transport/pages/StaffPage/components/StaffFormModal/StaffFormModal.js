import {useTranslation} from 'react-i18next'
import {v4 as uuidv4} from 'uuid'
import {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import styles from './staffFormModal.module.css'
import {
  Modal,
  Button,
  Icon,
  ICON_CONSTANTS,
  MODAL_CONSTANTS,
} from '@teachmint/krayon'
import StaffCard from '../StaffCard/StaffCard'
import {NEW_STAFF_DATA, NEW_STAFF_ERROR} from '../../constants'
import globalActions from '../../../../../../redux/actions/global.actions'
import {events} from '../../../../../../utils/EventsConstants'
import {alphaRegex} from '../../../../../../utils/Validations'

export default function StaffFormModal({
  showModal,
  setShowModal,
  isEdit,
  editData,
}) {
  if (!showModal) return null

  const [staff, setStaff] = useState({})
  const [formErrors, setFormErrors] = useState({})

  const {t} = useTranslation()
  const dispatch = useDispatch()

  const {eventManager} = useSelector((state) => state)

  const putErrorForEditData = () => {
    const key = Object.keys(editData)[0]
    const editStaff = editData[key]
    let error = {}
    const getError = (field, value) => {
      let hasError = null
      switch (field) {
        case 'name':
          if (!alphaRegex(value)) hasError = t('onlyAlphabetsAreAllowed')
          if (!value) hasError = ''
          break
        case 'role':
          if (!value) hasError = ''
          break
        case 'contact':
          if (!value || value.length !== 10) hasError = ''
          break
        default:
          break
      }
      return hasError
    }
    for (const field in editStaff) {
      let value = editStaff[field]
      error[field] = getError(field, value)
    }
    setFormErrors({...formErrors, [key]: error})
  }

  const getNewStaff = () => {
    // If edit mode return edit data and no errors
    if (isEdit) {
      putErrorForEditData()
      return editData
    }
    const key = uuidv4()

    setFormErrors({...formErrors, [key]: {...NEW_STAFF_ERROR}})

    // handleStaffModalErrorObj(key, true)
    return {[key]: {...NEW_STAFF_DATA}}
  }

  useEffect(() => {
    setStaff(getNewStaff())
  }, [])

  const duplicateList = ['contact']

  const duplicateErrorMsgMap = {
    contact: t('staffContactNotUnique'),
  }

  const removeDuplicateError = (errors, staff, previousVal, field) => {
    if (!previousVal) return errors
    let newErrors = {...errors}
    let previousValIdList = []
    for (const key in staff) {
      let currentStaff = staff[key]
      if (
        currentStaff[field]?.toLowerCase()?.trim() ===
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

  const addDuplicateError = (errors, staff, currentVal, field) => {
    if (!currentVal) return errors
    let newErrors = {...errors}
    let currentValIdList = []
    for (const key in staff) {
      let currentStaff = staff[key]
      if (
        currentStaff[field]?.toLowerCase()?.trim() ===
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

  const onStaffChange = (data, error, id, field) => {
    let newStaff = {...staff, [id]: data}
    let newErrors = {...formErrors, [id]: error}
    let previousVal = staff[id][field]
    let currentVal = newStaff[id][field]
    if (duplicateList.includes(field)) {
      newErrors = addDuplicateError(newErrors, newStaff, currentVal, field)
      newErrors = removeDuplicateError(newErrors, newStaff, previousVal, field)
    }
    setStaff(newStaff)
    setFormErrors(newErrors)
  }

  const handleAddStaff = () => {
    setStaff({...staff, ...getNewStaff()})
    eventManager.send_event(events.ADD_ANOTHER_STAFF_CLICKED_TFI, {
      screen_name: 'add_staff',
    })
  }

  // handle staff card remove
  const onRemoveStaff = (staffId) => {
    let newStaff = {...staff}
    let newErrors = {...formErrors}
    delete newStaff[staffId]
    delete newErrors[staffId]
    duplicateList.forEach((field) => {
      let previousVal = staff[staffId][field]
      newErrors = removeDuplicateError(newErrors, newStaff, previousVal, field)
    })
    setStaff(newStaff)
    setFormErrors(newErrors)
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

  const getPayload = () => {
    let list = []

    for (const key in staff) {
      const currentData = staff[key]
      let staffObj = {}
      staffObj.name = currentData.name
      staffObj.phone_number = `${currentData.countryCode}-${currentData.contact}`
      staffObj.staff_type = currentData.role
      staffObj.document_url =
        currentData?.idProof && typeof currentData?.idProof === 'string'
          ? currentData?.idProof
          : ''
      staffObj.country_code = currentData.countryCode
      staffObj.show_contact_details_to_parents = currentData.isCheckboxSelected
      staffObj.idProof =
        currentData?.idProof && typeof currentData?.idProof !== 'string'
          ? currentData?.idProof
          : null
      if (isEdit) staffObj._id = key
      list.push(staffObj)
    }

    const payload = {staff_list: list}
    return payload
  }

  // Handle form submit
  const handleFormSubmit = () => {
    eventManager.send_event(events.ADD_TRANSPORT_STAFF_POPUP_CLICKED_TFI, {
      screen_name: 'staff_tab',
      action: 'confirm',
    })
    const payload = getPayload()

    const successAction = () => {
      if (isEdit) {
        const editedStaff = payload?.staff_list[0]
        eventManager.send_event(events.TRANSPORT_STAFF_EDITED_TFI, {
          staff_type: editedStaff?.staff_type,
        })
      } else {
        eventManager.send_event(events.TRANSPORT_STAFF_ADDED_TFI, {
          count: Object.keys(staff)?.length,
        })
      }
      onModalClose()
    }
    dispatch(
      globalActions?.updateTransportStaff?.request(payload, successAction)
    )
  }

  const onModalClose = () => {
    eventManager.send_event(events.ADD_TRANSPORT_STAFF_POPUP_CLICKED_TFI, {
      screen_name: 'staff_tab',
      action: 'close',
    })
    setShowModal(false)
  }

  return (
    <Modal
      header={isEdit ? t('editStaff') : t('addStaff')}
      classes={{header: styles.modalHeader}}
      headerIcon={
        <Icon
          size={ICON_CONSTANTS.SIZES.SMALL}
          name="people"
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
      size={MODAL_CONSTANTS.SIZE.X_LARGE}
      shouldCloseOnOverlayClick={false}
    >
      <div className={styles.formWrapper}>
        <div className={styles.staffCardsWrapper}>
          {Object.keys(staff).map((id, index) => {
            return (
              <StaffCard
                key={id}
                id={id}
                index={index + 1}
                isEdit={isEdit}
                staffData={staff[id]}
                cardError={formErrors[id]}
                onStaffChange={onStaffChange}
                onRemoveStaff={onRemoveStaff}
                removable={Object.keys(staff).length > 1 ? true : false}
              />
            )
          })}
        </div>

        {!isEdit && (
          <Button
            onClick={handleAddStaff}
            type="text"
            classes={{button: styles.addStaffButton}}
          >
            {`+ ${t('addAnotherMemeber')}`}
          </Button>
        )}
      </div>
    </Modal>
  )
}
