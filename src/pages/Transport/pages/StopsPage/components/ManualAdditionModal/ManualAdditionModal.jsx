import React, {useState} from 'react'
import styles from './ManualAdditionModal.module.css'
import {Trans, useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import {
  Button,
  BUTTON_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  Modal,
  MODAL_CONSTANTS,
  Para,
  Stepper,
} from '@teachmint/krayon'
import ManualAddStop from '../ManualAddStop/ManualAddStop'
import ManualManagePassengers from '../ManualManagePassengers/ManualManagePassengers'
import globalActions from '../../../../../../redux/actions/global.actions'
import {t} from 'i18next'
import {useEffect} from 'react'
import {events} from '../../../../../../utils/EventsConstants'
import MultipleStopAdditionForm from '../MultipleStopAdditionForm/MultipleStopAdditionForm'
import {showSuccessToast} from '../../../../../../redux/actions/commonAction'

const additionSteps = [
  {
    id: 0,
    title: t('addLocation'),
    status: 'IN_PROGRESS',
    description: t('locationAdditionStepperDesc'),
  },
  {
    id: 1,
    title: t('addPassengers'),
    status: 'NOT_STARTED',
    description: t('passengersAdditionStepperDesc'),
  },
]

const getCurrentStep = (stepperData) => {
  let index = 0
  while (stepperData[index]) {
    if (stepperData[index]?.status === 'IN_PROGRESS') return stepperData[index]
    index++
  }
  return null
}

export default function ManualAdditionModal({
  showModal,
  setShowModal,
  isEdit,
  editData,
  step = 0,
  allotedPassengerIds,
  isOnboarding,
}) {
  if (!showModal) return null
  const [stepperData, setStepperData] = useState([...additionSteps])
  const [disableConfirmButton, setDisableConfirmButton] = useState(true)
  const [stopData, setStopData] = useState(
    isEdit
      ? editData
      : {
          name: '',
          address: '',
          distance: '',
        }
  )

  const [showMultipleStopAdditionForm, setShowMultipleStopAdditionForm] =
    useState(false)
  // state for storing all added stops to show in MultipleStopAdditionForm
  const [allAddedStops, setAllAddedStops] = useState([])

  useEffect(() => {
    if (!isEdit) {
      if (stopData['name'] && stopData['distance'] && stopData['latitude']) {
        setDisableConfirmButton(false)
      } else {
        setDisableConfirmButton(true)
      }
    } else {
      if (stopData['name'] && stopData['distance']) {
        setDisableConfirmButton(false)
      } else {
        setDisableConfirmButton(true)
      }
    }
  }, [stopData])

  const [passengersData, setPassengersData] = useState(
    isEdit ? {initialSelected: editData.passengersData} : []
  )

  const {t} = useTranslation()
  const dispatch = useDispatch()

  const {eventManager} = useSelector((state) => state)

  useEffect(() => {
    updateStepperData(step)
  }, [step])

  const closeModal = () => {
    sessionStorage.removeItem('stopName')
    sessionStorage.removeItem('stopId')
    setShowModal(false)
    eventManager.send_event(events.ADD_PASSENGERS_POPUP_CLICKED_TFI, {
      screen_name: 'add_stop',
      action: 'close',
    })
  }

  const updateStepperData = (step) => {
    let newStepperData = [...stepperData]

    switch (step) {
      case 0:
        newStepperData[0].status = 'IN_PROGRESS'
        newStepperData[1].status = isEdit ? 'COMPLETED' : 'NOT_STARTED'
        break
      case 1:
        newStepperData[0].status = 'COMPLETED'
        newStepperData[1].status = 'IN_PROGRESS'
        break
      default:
        break
    }

    setStepperData(newStepperData)
  }

  const handleSubmit = () => {
    const finalData = {...stopData}
    // Append passengers data
    finalData['passenger_ids'] = passengersData?.fullSelectedList || []

    finalData['distance'] = parseFloat(finalData['distance'])
    finalData['address'] = finalData['address']
      ? finalData['address']
      : finalData['name']

    delete finalData['passengersData']

    if (isEdit)
      finalData['_id'] = stopData._id || sessionStorage.getItem('stopId')

    if (!finalData['latitude'] || !finalData['longitude']) {
      delete finalData['latitude']
      delete finalData['longitude']
    }

    finalData['distance'] = !finalData['distance'] ? '' : finalData['distance']
    finalData['name'] = !finalData['name'] ? '' : finalData['name']
    finalData['address'] = !finalData['address'] ? '' : finalData['address']

    const payload = {pickup_points_list: [finalData]}
    const successAction = () => {
      if (isEdit) {
        eventManager.send_event(events.STOP_EDITED_TFI)
        dispatch(showSuccessToast(t('stopUpdatedSuccessfully')))
      } else {
        dispatch(showSuccessToast(t('stopCreatedSuccessfully')))
      }
      if (isOnboarding) {
        setAllAddedStops([...allAddedStops, finalData])
        updateStepperData(0)
        setStopData({
          name: '',
          address: '',
          distance: '',
        })
        setShowMultipleStopAdditionForm(true)
      } else {
        closeModal()
      }
    }

    dispatch(
      globalActions?.updateTransportStops?.request(payload, successAction)
    )

    sessionStorage.removeItem('stopName')
  }

  const NStopsCreatedFooterElement = () => {
    return (
      <div className={styles.nStopsFooter}>
        <Icon
          name="checkCircle1"
          version={ICON_CONSTANTS.VERSION.FILLED}
          type={ICON_CONSTANTS.TYPES.SUCCESS}
          size={ICON_CONSTANTS.SIZES.XX_SMALL}
        />
        <Para>
          <Trans
            i18nKey="nStopsCreatedSuccessfully"
            values={{nStops: allAddedStops.length}}
          />
        </Para>
      </div>
    )
  }

  return (
    <Modal
      header={isEdit ? t('editStop') : t('addStop')}
      classes={{modal: styles.modal, header: styles.modalHeader}}
      headerIcon={
        <Icon
          size={ICON_CONSTANTS.SIZES.SMALL}
          name="pinDropLocation"
          type={ICON_CONSTANTS.TYPES.BASIC}
        />
      }
      isOpen={showModal}
      onClose={closeModal}
      actionButtons={
        showMultipleStopAdditionForm
          ? [{onClick: closeModal, body: t('done')}]
          : getCurrentStep(stepperData)?.id === 0
          ? [
              {
                onClick: () => {
                  updateStepperData(1)
                  eventManager.send_event(
                    events.ADD_LOCATION_NEXT_CLICKED_TFI,
                    {screen_name: 'add_stop'}
                  )
                },
                body: t('next'),
                isDisabled: disableConfirmButton,
              },
            ]
          : [
              {
                onClick: () => {
                  handleSubmit()
                  eventManager.send_event(
                    events.ADD_PASSENGERS_POPUP_CLICKED_TFI,
                    {screen_name: 'add_stop', action: 'confirm'}
                  )
                },
                body: t('confirm'),
                isDisabled: disableConfirmButton,
              },
            ]
      }
      size={MODAL_CONSTANTS.SIZE.MEDIUM}
      footerLeftElement={
        showMultipleStopAdditionForm ? (
          <NStopsCreatedFooterElement />
        ) : (
          getCurrentStep(stepperData)?.id === 1 && (
            <Button
              type={BUTTON_CONSTANTS.TYPE.TEXT}
              prefixIcon="backArrow"
              onClick={() => {
                updateStepperData(0)
                eventManager.send_event(
                  events.ADD_PASSENGERS_POPUP_CLICKED_TFI,
                  {
                    screen_name: 'add_stop',
                    action: 'back',
                  }
                )
              }}
            >
              {t('back')}
            </Button>
          )
        )
      }
      shouldCloseOnOverlayClick={false}
    >
      {showMultipleStopAdditionForm ? (
        <MultipleStopAdditionForm
          addedStops={allAddedStops}
          setShowMultipleStopAdditionForm={setShowMultipleStopAdditionForm}
        />
      ) : (
        <div className={styles.wrapper}>
          <div className={styles.stepperWrapper}>
            <Stepper steps={additionSteps} />
          </div>
          <div className={styles.formsWrapper}>
            {getCurrentStep(stepperData)?.id === 0 ? (
              <ManualAddStop
                isEdit={isEdit}
                stopData={stopData}
                setStopData={setStopData}
              />
            ) : (
              <ManualManagePassengers
                passengersData={passengersData}
                setPassengersData={setPassengersData}
                allotedPassengerIds={allotedPassengerIds}
              />
            )}
          </div>
        </div>
      )}
    </Modal>
  )
}
