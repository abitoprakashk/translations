import React, {useState} from 'react'
import emptyOrderList from '../../../../../../src/assets/images/dashboard/empty-orderlist.svg'
import Onboarding from '../../../components/Onboarding/OnboardingUI'
import {useTranslation} from 'react-i18next'
import {Slider} from '@teachmint/common'
import {PurchaseOrderForm} from '../../../components/Forms/PurchaseOrderForm/PurchaseOrderForm'
import {events} from '../../../../../utils/EventsConstants'
import {useSelector} from 'react-redux'
import CloseSliderConfirmPopup from '../../../components/Common/CloseSliderConfirmPopUp'
import {PERMISSION_CONSTANTS} from '../../../../../utils/permission.constants'

export default function PurchaseOrderOnboard() {
  const {t} = useTranslation()

  const [sliderOpen, setSliderOpen] = useState(false)
  const {eventManager} = useSelector((state) => state)
  const [dataAdded, setDataAdded] = useState(false)

  const clickHandler = () => {
    setSliderOpen(!sliderOpen)
    eventManager.send_event(events.IM_ADD_NEW_PO_TFI, {})
  }

  const [showCloseConfirmPopup, setShowCloseConfirmPopup] = useState(false)

  const closeConfirmObject = {
    onClose: () => {
      setShowCloseConfirmPopup(false)
    },
    onAction: () => {
      setSliderOpen(false)
      setShowCloseConfirmPopup(false)
    },
  }

  const handleSliderClose = () => {
    if (dataAdded) {
      setShowCloseConfirmPopup(true)
    } else {
      setSliderOpen(false)
    }
  }

  const checkForConfirmationPopupAdd = (
    invoiceNumber,
    merchantName,
    purchaseDate,
    purchaseDescription,
    items
  ) => {
    let check_empty = false
    for (var key in items) {
      if (
        items[key]['categoryName'] ||
        items[key]['itemName'] ||
        items[key]['price'] ||
        items[key]['quantity']
      ) {
        check_empty = true
        break
      }
    }
    if (check_empty) {
      setDataAdded(true)
    } else if (
      invoiceNumber ||
      merchantName ||
      purchaseDate ||
      purchaseDescription
    ) {
      setDataAdded(true)
    } else {
      setDataAdded(false)
    }
  }

  const config = {
    image: emptyOrderList,
    messageText: t('noPurchaseOrder'),
    helpText: t('howToCreatePurchaseOrder'),
    descriptionText: t('purchaseOrderOnboardingMsg'),
    descriptionText2: t('purchaseOrderOnboardingMsg2'),
    buttonText: t('addPurchaseOrderPlus'),
    clickHandler: clickHandler,
    permissionId:
      PERMISSION_CONSTANTS.inventoryPurchaseOrderController_add_create,
  }
  return (
    <div>
      <Onboarding {...config} />
      {sliderOpen && (
        <Slider
          open={sliderOpen}
          setOpen={handleSliderClose}
          hasCloseIcon={true}
          widthInPercent={70}
          content={
            <PurchaseOrderForm
              setSliderOpen={setSliderOpen}
              checkForConfirmationPopup={checkForConfirmationPopupAdd}
            />
          }
        ></Slider>
      )}
      {showCloseConfirmPopup && (
        <CloseSliderConfirmPopup {...closeConfirmObject} />
      )}
    </div>
  )
}
