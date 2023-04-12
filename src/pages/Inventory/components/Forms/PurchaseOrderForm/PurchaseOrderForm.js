import {useEffect, useState} from 'react'
import {Button, Input} from '@teachmint/common'
import styles from './purchaseOrderForm.module.css'
import {v4 as uuidv4} from 'uuid'
import {useTranslation} from 'react-i18next'
import {PurchaseOrderItemsForm} from '../PurchaseOrderItemsForm/PurchaseOrderItemsForm'
import {
  alphaNumericRegex,
  alphaNumericNoSpaceRegex,
} from '../../../../../utils/Validations'
import {CONST_INPUTS_MAX_LENGTH} from '../../../../../constants/inventory.constants'
import {useDispatch, useSelector} from 'react-redux'
import {
  AddInventoryPurchaseOrderAction,
  UpdateInventoryPurchaseOrderAction,
} from '../../../pages/PurchaseOrders/redux/actions/actions'
import {getAllCategoriesRequestAction} from '../../../pages/Overview/redux/actions/actions'
import classNames from 'classnames'
import {events} from '../../../../../utils/EventsConstants'

export function PurchaseOrderForm({
  checkForConfirmationPopup,
  setSliderOpen,
  isEdit = false,
  data,
  setFilterTitle,
}) {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const {eventManager} = useSelector((state) => state)
  const inventoryState = useSelector((state) => state.inventoryOverview)
  const [merchantNameError, setMerchantNameError] = useState(false)
  const [invoiceNumber, setInvoiceNumber] = useState(
    isEdit ? data.invoiceNumber : ''
  )
  const [merchantName, setMerchantName] = useState(
    isEdit ? data.merchantName : ''
  )
  const [purchaseDate, setPurchaseDate] = useState(
    isEdit ? new Date(data.purchaseDate * 1000) : ''
  )
  const [purchaseDescription, setPurchaseDescription] = useState(
    isEdit ? data.purchaseDescription : ''
  )

  const purchaseOrdersState = useSelector(
    (state) => state.inventoryPurchaseOrder
  )

  const [allInvoices, setAllInvoices] = useState()

  const getAllInvoices = () => {
    let invoices = {}
    purchaseOrdersState.purchaseOrdersListData?.obj?.hits?.forEach((order) => {
      invoices[order.invoice_no] = true
    })
    if (isEdit) {
      delete invoices[data.invoiceNumber]
    }
    setAllInvoices(invoices)
  }

  useEffect(() => {
    getAllInvoices()
    if (setFilterTitle) {
      setFilterTitle('Filter By')
    }
  }, [])

  const itemKey = uuidv4()
  const itemData = {categoryName: '', itemName: '', quantity: '', price: ''}

  const [inputFieldErrors, setInputFieldErrors] = useState(
    isEdit
      ? {}
      : {
          merchantName: true,
          purchaseDate: true,
          purchaseDescription: true,
        }
  )

  const [items, setItems] = useState(
    isEdit ? data.items : {[itemKey]: itemData}
  )

  const onItemsChange = (newItems, hasError) => {
    let newInputErrors = {...inputFieldErrors}
    if (hasError) {
      newInputErrors = {...newInputErrors, ['items']: true}
    } else {
      delete newInputErrors['items']
    }
    setInputFieldErrors(newInputErrors)
    setItems(newItems)
  }

  useEffect(() => {
    checkForConfirmationPopup(
      invoiceNumber,
      merchantName,
      purchaseDate,
      purchaseDescription,
      items
    )
  }, [invoiceNumber, merchantName, purchaseDate, purchaseDescription, items])

  const handleInputError = (field, value) => {
    let newInputErrors = {...inputFieldErrors}
    if (field == 'invoiceNumber' && value != '') {
      handleInvoiceError(value)
        ? (newInputErrors = {...newInputErrors, [field]: true})
        : delete newInputErrors[field]
    } else if (field == 'merchantName') {
      value?.length < 2
        ? (newInputErrors = {...newInputErrors, [field]: true})
        : delete newInputErrors[field]
    } else if (value != '') {
      delete newInputErrors[field]
    } else if (field != 'invoiceNumber') {
      newInputErrors = {...newInputErrors, [field]: true}
    }
    setInputFieldErrors(newInputErrors)
  }

  const handleAddDispatch = () => {
    let itemList = Object.keys(items).map((item) => {
      return {
        category_id: items[item]['categoryName'],
        item_id: items[item]['itemName'],
        unit_price: parseFloat(items[item]['price']),
        quantity: parseInt(items[item]['quantity']),
      }
    })
    let payload = {
      invoice_no: invoiceNumber,
      vendor_name: merchantName,
      purchase_date: (purchaseDate.getTime() / 1000).toString(),
      description: purchaseDescription,
      data: itemList,
    }
    dispatch(AddInventoryPurchaseOrderAction(payload))
  }

  const handleEditDispatch = () => {
    let payload = {
      _id: data._id,
      new_invoice_name: invoiceNumber,
      new_description: purchaseDescription,
    }
    dispatch(UpdateInventoryPurchaseOrderAction(payload))
    return
  }

  const onAddButtonClick = () => {
    if (isEdit) {
      let isEdited =
        data.invoiceNumber != invoiceNumber ||
        data.purchaseDescription != purchaseDescription
      if (isEdited) {
        handleEditDispatch()
        eventManager.send_event(events.IM_PO_EDITED_TFI, {id: data._id})
      }
    } else {
      handleAddDispatch()
    }
    setSliderOpen(false)
    setInvoiceNumber('')
    setPurchaseDate('')
    setPurchaseDescription('')
    setMerchantName('')
  }

  useEffect(() => {
    Object.keys(inventoryState.allCategories).length === 0
      ? dispatch(getAllCategoriesRequestAction())
      : ''
  }, [])

  const [invoiceError, setInvoiceError] = useState('')

  const handleInvoiceError = (invoiceNumber) => {
    if (
      Object.prototype.hasOwnProperty.call(
        allInvoices,
        invoiceNumber.toUpperCase()
      )
    ) {
      setInvoiceError('Invoice number already exists')
      return true
    }
    setInvoiceError('')
    return false
  }

  return (
    <div>
      <div className={styles.formTop}>
        <div className={styles.formHeading}>
          {isEdit ? t('editPurchaseOrder') : t('addPurchaseOrder')}
        </div>
      </div>
      <div className={styles.purchaseOrderFormWrapper}>
        <div className={styles.purchaseOrderCard}>
          <div className={styles.inputsWrapper}>
            <Input
              classes={{wrapper: styles.inputWrapper, title: 'tm-para'}}
              type="text"
              title={t('invoiceNumber')}
              fieldName="invoiceNumber"
              maxLength={CONST_INPUTS_MAX_LENGTH.name}
              placeholder={t('invoiceNumberPlaceHolder')}
              value={invoiceNumber}
              showError={invoiceError ? true : false}
              errorMsg={invoiceError}
              onChange={(e) => {
                if (alphaNumericNoSpaceRegex(e.value)) {
                  setInvoiceNumber(e.value)
                  handleInputError(e.fieldName, e.value)
                }
              }}
            />
            <Input
              classes={{
                wrapper: styles.inputWrapper,
                input: isEdit ? styles.disabledInputBackground : '',
                title: 'tm-para',
              }}
              type="text"
              title={t('merchantName')}
              fieldName="merchantName"
              showError={merchantNameError}
              errorMsg={t('merchantNameLengthError')}
              disabled={isEdit}
              placeholder={t('merchantNamePlaceHolder')}
              maxLength={CONST_INPUTS_MAX_LENGTH.name}
              value={merchantName}
              isRequired={true}
              className={isEdit ? styles.disabledInputBackground : ''}
              onChange={(e) => {
                if (alphaNumericRegex(e.value)) {
                  setMerchantName(e.value)
                  if (e.value?.length < 2) {
                    setMerchantNameError(true)
                  } else {
                    setMerchantNameError(false)
                  }
                  handleInputError(e.fieldName, e.value)
                }
              }}
            />
            <Input
              classes={{
                wrapper: classNames(styles.inputWrapper),
                title: 'tm-para',
              }}
              type="date"
              title={t('dateOfPurchase')}
              disabled={isEdit}
              fieldName="purchaseDate"
              className={isEdit ? styles.disabledDatePicker : ''}
              placeholder={t('selectDateOfPurchase')}
              value={purchaseDate}
              isRequired={true}
              maxDate={new Date()}
              onChange={(e) => {
                setPurchaseDate(e.value)
                handleInputError(e.fieldName, e.value)
              }}
            />
          </div>
          <Input
            classes={{
              wrapper: styles.purchaseDescriptionInputWrapper,
              title: 'tm-para',
            }}
            type="text"
            title={t('descriptionOfPurchase')}
            fieldName="purchaseDescription"
            placeholder={t('descriptionOfPurchasePlaceHolder')}
            maxLength={CONST_INPUTS_MAX_LENGTH.description}
            value={purchaseDescription}
            isRequired={true}
            onChange={(e) => {
              setPurchaseDescription(e.value)
              handleInputError(e.fieldName, e.value)
            }}
          />
          <PurchaseOrderItemsForm
            items={items}
            onItemsChange={onItemsChange}
            isEdit={isEdit}
          />
        </div>
      </div>
      <div className={styles.addButtonWrapper}>
        <Button
          disabled={Object.keys(inputFieldErrors).length ? true : false}
          className={styles.addButton}
          onClick={onAddButtonClick}
        >
          {isEdit ? t('done') : t('add')}
        </Button>
      </div>
    </div>
  )
}
