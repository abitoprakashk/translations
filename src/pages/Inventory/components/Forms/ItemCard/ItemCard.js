import styles from './itemCard.module.css'
import {Input, Icon} from '@teachmint/common'
import {Trans, useTranslation} from 'react-i18next'
import {alphaNumericRegex} from '../../../../../utils/Validations'
import {useEffect, useState} from 'react'
import {CONST_INPUTS_MAX_LENGTH} from '../../../../../constants/inventory.constants'
import ConfirmationPopup from '../../../../../components/Common/ConfirmationPopup/ConfirmationPopup'
import {useDispatch, useSelector} from 'react-redux'
import {deleteInventoryItemAction} from '../../../pages/Overview/redux/actions/actions'
import {events} from '../../../../../utils/EventsConstants'
import ReactTooltip from 'react-tooltip'
import classNames from 'classnames'
import {getSymbolFromCurrency} from '../../../../../utils/Helpers'
import {DEFAULT_CURRENCY} from '../../../../../constants/common.constants'

export function ItemCard({
  _id,
  index,
  itemData,
  removable,
  onRemoveItem,
  onItemDataChange,
  isEdit,
  checkUniqueItemName,
  handleprefix,
}) {
  const {t} = useTranslation()

  const {eventManager, instituteInfo} = useSelector((state) => state)

  const dispatch = useDispatch()

  const [itemNameError, setItemNameError] = useState('')

  const [openingStockError, setOpeningStockError] = useState('')

  const handleItemNameError = (name) => {
    if (name.trimEnd().length < 2) {
      setItemNameError(t('itemNameLengthError'))
    } else if (!checkUniqueItemName(name)) {
      setItemNameError(t('itemNameExistsError'))
    } else {
      setItemNameError('')
      return false
    }
    return true
  }

  const handleInitialInputError = () => {
    let hasError = !itemData.name || !itemData.stock || !itemData.price
    onItemDataChange({...itemData}, hasError)
  }

  useEffect(() => {
    handleInitialInputError()
  }, [])

  const handleInputChange = (field, value) => {
    let hasError = !value
    for (let key in itemData) {
      if ((key == 'name' || key == 'stock' || key == 'price') && key != field) {
        hasError = hasError || !itemData[key]
      }
    }
    if (field == 'name') {
      let nameError = handleItemNameError(value)
      hasError = nameError || hasError
      if (!isEdit) {
        nameError ? (itemData = {...itemData, prefix: ''}) : handleprefix(value)
      }
    }
    onItemDataChange({...itemData, [field]: value}, hasError)
  }

  const confirmObject = {
    onClose: () => {
      setShowConfirmPopup(false)
    },
    onAction: () => {
      setShowConfirmPopup(false)
      dispatch(deleteInventoryItemAction({_id: _id}))
      eventManager.send_event(events.IM_ITEM_DELETE_CONFIRMED_TFI, {
        screen_name: 'Item Category',
        item_name: itemData.name,
      })
      onRemoveItem()
    },
    icon: <Icon name="delete" size="4xl" color="error" type="filled" />,
    title: (
      <Trans i18nKey={'deleteItemConfirmPopupTitle'}>
        Delete this item &apos;{itemData.name}&apos;?
      </Trans>
    ),
    desc: t('deleteItemConfirmPopupDesc'),
    primaryBtnText: t('cancel'),
    secondaryBtnText: t('delete'),
    secondaryBtnStyle: styles.popUpButtonRed,
    closeOnBackgroundClick: false,
  }

  const warningObject = {
    onClose: () => {
      setShowConfirmPopup(false)
    },
    icon: <Icon name="error" size="4xl" color="warning" type="filled" />,
    title: t('deleteItemWarningPopupTitle'),
    desc: t('deleteItemWarningPopupDesc'),
    primaryBtnText: t('ok'),
    primaryBtnStyle: styles.popUpButtonOk,
    closeOnBackgroundClick: false,
  }

  const [showConfirmPopup, setShowConfirmPopup] = useState(false)

  const OpeningStockPriceToolTip = () => {
    return (
      <>
        <a
          data-tip={t('addOpeningStockTooltipContent')}
          data-for="openingStock"
          className={styles.leftAlignToolTip}
        >
          <Icon name="info" size="xxxs" type="outlined" color="secondary" />
        </a>
        <ReactTooltip
          id="openingStock"
          multiline={true}
          type="light"
          effect="solid"
          place="bottom"
          scrollHide={true}
          className={styles.customTooltip}
        />
      </>
    )
  }

  return (
    <>
      {showConfirmPopup && (
        <div className={styles.confirmBoxWrapper}>
          {!itemData.totalAllocated ? (
            <ConfirmationPopup {...confirmObject} />
          ) : (
            <ConfirmationPopup {...warningObject} />
          )}
        </div>
      )}
      <div className={styles.itemCard}>
        <div className={styles.itemCardHeader}>
          <div className={styles.itemNo}>{`${t('item')} ${index}`}</div>
          {removable && (
            <span
              onClick={() => {
                if (isEdit) {
                  eventManager.send_event(events.IM_DELETE_ITEM_CLICKED_TFI, {
                    screen_name: 'Item Category',
                    item_name: itemData.name,
                  })
                  setShowConfirmPopup(true)
                  return
                }
                onRemoveItem()
              }}
              className={styles.cursorPointer}
            >
              <Icon name="close" color="secondary" size="xxxs"></Icon>
            </span>
          )}
        </div>
        <Input
          classes={{wrapper: styles.nameInputWrapper, title: 'tm-para'}}
          type="text"
          title={t('itemName')}
          fieldName="name"
          showError={itemNameError ? true : false}
          errorMsg={itemNameError}
          placeholder={t('itemNamePlaceHolder')}
          maxLength={CONST_INPUTS_MAX_LENGTH.name}
          isRequired={true}
          value={itemData.name}
          onChange={(e) => {
            if (!alphaNumericRegex(e.value)) {
              return
            }
            handleInputChange(e.fieldName, e.value)
          }}
        />
        <Input
          classes={{
            wrapper: styles.nameInputWrapper,
            input: styles.disabledInputBackground,
            title: 'tm-para',
          }}
          className={styles.disabledInputBackground}
          type="text"
          fieldName="prefix"
          title={t('itemCodePrefix')}
          isRequired={true}
          value={itemNameError.length ? '' : itemData.prefix}
          disabled={true}
        />
        <div className={styles.inputsWrapper}>
          <Input
            classes={{
              wrapper: styles.stockInputWrapper,
              input: isEdit ? styles.disabledInputBackground : '',
              title: 'tm-para',
            }}
            type="number"
            fieldName="stock"
            errorMsg={openingStockError}
            showError={openingStockError.length ? true : false}
            title={t('openingStock')}
            maxLength={CONST_INPUTS_MAX_LENGTH.number}
            className={isEdit ? styles.disabledInputBackground : ''}
            placeholder={t('openingStockPlaceHolder')}
            disabled={isEdit}
            errorClassName={styles.inputErrorClass}
            isRequired={true}
            value={itemData.stock}
            onChange={(e) => {
              if (parseInt(e.value) > 10000) {
                setOpeningStockError(t('openingStockLimitError'))
                setTimeout(() => {
                  setOpeningStockError('')
                }, 2000)
                return
              }
              handleInputChange(e.fieldName, e.value)
            }}
            tooltipComponent={<OpeningStockPriceToolTip />}
          />
          <Input
            classes={{
              wrapper: styles.stockInputWrapper,
              input: isEdit ? styles.disabledInputBackground : '',
              title: 'tm-para',
            }}
            type="number"
            disabled={isEdit}
            fieldName="price"
            title={t('purchasePrice')}
            prefix={getSymbolFromCurrency(
              instituteInfo.currency || DEFAULT_CURRENCY
            )}
            className={isEdit ? styles.disabledInputBackground : ''}
            maxLength={CONST_INPUTS_MAX_LENGTH.price}
            placeholder={t('purchasePricePlaceHolder')}
            isRequired={true}
            errorClassName={styles.inputErrorClass}
            value={itemData.price}
            onChange={(e) => {
              handleInputChange(e.fieldName, e.value)
            }}
          />
        </div>
        <div
          className={classNames(
            {[styles.editOpeningStockTooltipContent]: isEdit},
            {[styles.editOpeningStockTooltipContentHide]: !isEdit}
          )}
        >
          {t('editOpeningStockTooltipContent')}
        </div>
      </div>
      <hr></hr>
    </>
  )
}
