import React, {useState, useEffect} from 'react'
import {Slider} from '@teachmint/common'
import emptyInventory from '../../../../../../src/assets/images/dashboard/empty-inventory.svg'
import Onboarding from '../../../components/Onboarding/OnboardingUI'
import {useTranslation} from 'react-i18next'
import {AddCategoryForm} from '../../../components/Forms/AddCategoryForm/AddCategoryForm'
import styles from './inventoryOnboarding.module.css'
import {events} from '../../../../../utils/EventsConstants'
import {useSelector} from 'react-redux'
import CloseSliderConfirmPopup from '../../../components/Common/CloseSliderConfirmPopUp'
import {PERMISSION_CONSTANTS} from '../../../../../utils/permission.constants'

export default function InventoryOnboarding() {
  const {t} = useTranslation()
  const [sliderOpen, setSliderOpen] = useState(false)
  const {eventManager} = useSelector((state) => state)

  // eslint-disable-next-line
  const [isDataChanged, setIsDataChanged] = useState(false)

  const clickHandler = () => {
    setSliderOpen(!sliderOpen)
    eventManager.send_event(events.IM_GET_STARTED_CLICKED_TFI, {
      screen_name: 'Inventory overview',
    })
  }

  const closeConfirmObject = {
    onClose: () => {
      setShowCloseConfirmPopup(false)
    },
    onAction: () => {
      setSliderOpen(false)
      setShowCloseConfirmPopup(false)
    },
  }

  const [showCloseConfirmPopup, setShowCloseConfirmPopup] = useState(false)

  const handleSliderClose = (setCurrentSliderOpen) => {
    if (isDataChanged) {
      setShowCloseConfirmPopup(true)
    } else {
      setCurrentSliderOpen(false)
    }
  }

  useEffect(() => [setIsDataChanged(false)], [sliderOpen])

  const config = {
    image: emptyInventory,
    messageText: t('noInventoryYet'),
    helpText: t('whatIsInventory'),
    descriptionText: t('inventoryOverviewOnboardingDescription'),
    buttonText: t('getStarted'),
    clickHandler: clickHandler,
    permissionId: PERMISSION_CONSTANTS.inventoryItemController_add_create,
  }
  return (
    <div>
      <Onboarding {...config} />
      {sliderOpen && (
        <div className={styles.slider}>
          <Slider
            open={sliderOpen}
            setOpen={() => handleSliderClose(setSliderOpen)}
            hasCloseIcon={true}
            widthInPercent={40}
            content={
              <AddCategoryForm
                setSliderOpen={setSliderOpen}
                screenName="Inventory overview"
                setIsDataChanged={setIsDataChanged}
              />
            }
          ></Slider>
        </div>
      )}
      {showCloseConfirmPopup && (
        <CloseSliderConfirmPopup {...closeConfirmObject} />
      )}
    </div>
  )
}
