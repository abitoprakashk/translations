import React, {useState, useEffect} from 'react'
import {Slider} from '@teachmint/common'
import emptyInventory from '../../../../../../src/assets/images/dashboard/empty-inventory.svg'
import Onboarding from '../../../components/Onboarding/OnboardingUI'
import {useTranslation} from 'react-i18next'
import {AddCategoryForm} from '../../../components/Forms/AddCategoryForm/AddCategoryForm'
import styles from './categoryOnboarding.module.css'
import CloseSliderConfirmPopup from '../../../components/Common/CloseSliderConfirmPopUp'
import {PERMISSION_CONSTANTS} from '../../../../../utils/permission.constants'

export default function CategoryOnboarding() {
  const {t} = useTranslation()
  const [sliderOpen, setSliderOpen] = useState(false)
  const [isDataChanged, setIsDataChanged] = useState(false)

  const clickHandler = () => {
    setSliderOpen(!sliderOpen)
  }

  const config = {
    image: emptyInventory,
    messageText: t('emptyItemCategoryOnboardingTitle'),
    helpText: t('whatIsItemCategory'),
    descriptionText: t('whatIsItemCategoryDescription'),
    buttonText: t('addCategoryPlus'),
    clickHandler: clickHandler,
    permissionId: PERMISSION_CONSTANTS.inventoryItemController_add_create,
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
