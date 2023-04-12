import {Button, Input} from '@teachmint/common'
import {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import styles from './store.module.css'
import {addInventoryItemStoreAction} from '../redux/actions/actions'
import {events} from '../../../../../utils/EventsConstants'
import {alphaNumericRegex} from '../../../../../utils/Validations'
import {CONST_INPUTS_MAX_LENGTH} from '../../../../../constants/inventory.constants'

export default function AddStoreForm({
  isAddStoreSliderOpen,
  screenName,
  checkForConfirmationPopup,
}) {
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const [storeNameInput, setStoreNameInput] = useState('')
  const [storeDescInput, setStoreDescInput] = useState('')
  const inventoryStoresState = useSelector((state) => state.inventoryStores)
  const [nameError, setNameError] = useState('')
  const [disableAddButtonName, setDisableAddButtonName] = useState(true)
  const {eventManager} = useSelector((state) => state)
  const storeNames = inventoryStoresState?.storeItemsData?.obj

  const storeNameDict = {}
  storeNames?.map((object) => {
    storeNameDict[object?.name?.toLowerCase()] = object?._id
  })

  useEffect(() => {
    setNameError('')
    setStoreNameInput('')
    setStoreDescInput('')
    eventManager.send_event(events.IM_ADD_STORE_CLICKED_TFI, {
      screen_name: screenName,
    })
  }, [isAddStoreSliderOpen])

  useEffect(() => {
    checkForConfirmationPopup(storeNameInput, storeDescInput)
  }, [storeDescInput, storeNameInput])

  const handleOnChange = ({fieldName, value}) => {
    switch (fieldName) {
      case 'storeName':
        setStoreNameInput(value)
        if (value?.length >= 2) {
          if (!alphaNumericRegex(value)) {
            setNameError(t('storeNameInputMsg'))
            setDisableAddButtonName(true)
          } else if (value.toLowerCase() in storeNameDict) {
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

  const onclickHandler = () => {
    let data = {
      name: storeNameInput,
      description: storeDescInput,
    }
    dispatch(addInventoryItemStoreAction(data))
    eventManager.send_event(events.IM_NEW_STORE_ADDED_TFI, {
      screen_name: screenName,
    })
  }

  return (
    <div className={styles.contentWrapper}>
      <div className={styles.headingWrapper}>
        <div className={styles.heading}>{t('addRoom')}</div>
      </div>
      <div className={styles.formWrapper}>
        <div>
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
            classes={{title: 'tm-para'}}
          />
          <div className={styles.descriptionWrapper}>
            <div className={styles.descriptionTitle}>
              {t('storeDescription')}
            </div>
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
        </div>
      </div>
      <div className={styles.doneButtonWrapper}>
        <Button
          onClick={onclickHandler}
          className={styles.doneButton}
          disabled={disableAddButtonName}
        >
          {t('add')}
        </Button>
      </div>
    </div>
  )
}
