import React from 'react'
import emptyInventory from '../../../../../../src/assets/images/dashboard/empty-inventory.svg'
import Onboarding from '../../../components/Onboarding/OnboardingUI'
import {useTranslation} from 'react-i18next'
import {PERMISSION_CONSTANTS} from '../../../../../utils/permission.constants'

export default function StoresOnboarding({setIsAddStoreSliderOpen}) {
  const {t} = useTranslation()
  const config = {
    image: emptyInventory,
    messageText: t('noStoreYet'),
    helpText: t('whatIsStore'),
    descriptionText: t('emptyStoreDescription'),
    buttonText: t('addStoreText'),
    clickHandler: () => setIsAddStoreSliderOpen(true),
    permissionId: PERMISSION_CONSTANTS.inventoryItemStoreController_add_create,
  }
  return <Onboarding {...config} />
}
