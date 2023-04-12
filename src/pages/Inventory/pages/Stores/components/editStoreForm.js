import {Button, Input} from '@teachmint/common'
import {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import styles from './store.module.css'
import {updateInventoryItemStoreAction} from '../redux/actions/actions'
import {events} from '../../../../../utils/EventsConstants'
import {alphaNumericRegex} from '../../../../../utils/Validations'
import {CONST_INPUTS_MAX_LENGTH} from '../../../../../constants/inventory.constants'

export default function EditStoreForm({
  id,
  desc,
  name,
  setIsEditStoreSliderOpen,
  checkForConfirmationPopup,
}) {
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const [storeNameInput, setStoreNameInput] = useState('')
  const [storeDescInput, setStoreDescInput] = useState('')
  const inventoryStoresState = useSelector((state) => state.inventoryStores)
  const {eventManager} = useSelector((state) => state)
  const [nameError, setNameError] = useState('')
  const [backendError, setBackendError] = useState('')
  const [disableAddButtonName, setDisableAddButtonName] = useState(false)
  const storeNames = inventoryStoresState?.storeItemsData?.obj

  const storeNameDict = {}
  storeNames?.map((object) => {
    storeNameDict[object?.name?.toLowerCase()] = object?._id
  })

  const handleOnChange = ({fieldName, value}) => {
    switch (fieldName) {
      case 'storeName':
        setStoreNameInput(value)
        if (value?.length >= 2) {
          if (!alphaNumericRegex(value)) {
            setNameError(t('storeNameInputMsg'))
            setDisableAddButtonName(true)
          } else if (
            value.toLowerCase() in storeNameDict &&
            storeNameDict[value.toLowerCase()] != id
          ) {
            setNameError(t('storeNameAlreadyExists'))
            setDisableAddButtonName(true)
          } else {
            setNameError('')
            setDisableAddButtonName(false)
          }
        } else {
          setNameError(t('storeNameCannotBeEmpty'))
          setDisableAddButtonName(true)
        }
        break
      case 'storeDescription':
        setStoreDescInput(value)
        break
      default:
        break
    }
  }

  useEffect(() => {
    if (!inventoryStoresState?.updateStoreLoading) {
      if (inventoryStoresState?.updateStoreError) {
        setIsEditStoreSliderOpen(true)
        setBackendError(inventoryStoresState.updateStoreData)
      }
      if (inventoryStoresState?.updateStoreData?.status) {
        eventManager.send_event(events.IM_STORE_DETAILS_EDITED_TFI, {})
      }
    }
  }, [inventoryStoresState?.updateStoreLoading])

  useEffect(() => {
    setStoreNameInput(name)
    setStoreDescInput(desc)
    setNameError('')
  }, [name, desc])

  useEffect(() => {
    checkForConfirmationPopup(storeNameInput, storeDescInput)
  }, [storeDescInput, storeNameInput])

  const onclickHandler = () => {
    let data = {
      _id: id,
      name: storeNameInput,
      description: storeDescInput,
    }
    dispatch(updateInventoryItemStoreAction(data))
  }

  return (
    <div className={styles.contentWrapper}>
      <div className={styles.headingWrapper}>
        <div className={styles.heading}>{t('editStore')}</div>
      </div>
      <div className={styles.formWrapper}>
        <Input
          placeholder={t('storeNamePlaceHolder')}
          title={t('storeName')}
          type="text"
          isRequired
          value={storeNameInput}
          fieldName="storeName"
          onChange={handleOnChange}
          showError={nameError ? true : false}
          errorMsg={nameError}
          maxLength={CONST_INPUTS_MAX_LENGTH.name}
        ></Input>
        <div className={styles.descriptionWrapper}>
          <div className={styles.descriptionTitle}>{t('storeDescription')}</div>
          <textarea
            rows={8}
            placeholder={t('storeDescriptionPlaceHolder')}
            className={styles.description}
            onChange={(e) =>
              handleOnChange({
                fieldName: 'storeDescription',
                value: String(e.target.value),
              })
            }
            value={storeDescInput}
          ></textarea>
        </div>
        <hr></hr>
        <p className={styles.error}>
          {backendError != '' ? `${backendError}` : ''}
        </p>
      </div>
      <div className={styles.doneButtonWrapper}>
        <Button
          onClick={onclickHandler}
          className={styles.doneButton}
          disabled={disableAddButtonName}
        >
          {t('done')}
        </Button>
      </div>
    </div>
  )
}
