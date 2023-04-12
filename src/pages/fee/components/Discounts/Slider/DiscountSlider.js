import {useState} from 'react'
import {useTranslation} from 'react-i18next'
import ConfirmationPopup from '../../../../../components/Common/ConfirmationPopup/ConfirmationPopup'
import SliderScreen from '../../../../../components/Common/SliderScreen/SliderScreen'
import SliderScreenHeader from '../../../../../components/Common/SliderScreenHeader/SliderScreenHeader'
import {
  DISCOUNT_SLIDER_TABS,
  DISCOUNT_SLIDER_TABS_IDS,
} from '../../../fees.constants'
// import {DISCOUNT, FEE_STRUCTURE} from '../../../intl'
import {validate} from '../Validations/DiscountValidations'
import DiscountSliderContent from './DiscountSliderContent'

const DiscountSlider = ({setSliderScreen, data, width}) => {
  const {t} = useTranslation()

  const [selectedTab, setSelectedTab] = useState(
    DISCOUNT_SLIDER_TABS_IDS.DISCOUNT
  )
  const [formValues, setFormValues] = useState(data.initialValues)
  const [formErrors, setFormErrors] = useState({})
  const [showConfirmPopup, setShowConfirmPopup] = useState(false)

  const validateTabData = (tab) => {
    const errors = validate(formValues, selectedTab)
    setFormErrors(errors)
    if (
      tab === DISCOUNT_SLIDER_TABS_IDS.STUDENT_PROFILES &&
      Object.keys(errors).length > 0
    ) {
      return false
    }
    setSelectedTab(tab)
  }

  return (
    <>
      {showConfirmPopup && (
        <ConfirmationPopup
          onClose={() => setShowConfirmPopup(false)}
          onAction={() => {
            setShowConfirmPopup(false)
            setSliderScreen(null)
          }}
          icon={
            'https://storage.googleapis.com/tm-assets/icons/colorful/remove-bg-red.svg'
          }
          title={t('exitConfirmModalTitle')}
          desc={t('exitConfirmModalDesc')}
          primaryBtnText={t('noContinueEditing')}
          secondaryBtnText={t('yesExit')}
        />
      )}
      <SliderScreen setOpen={() => setShowConfirmPopup(true)} width={width}>
        <>
          <SliderScreenHeader
            title={
              !formValues._id ? t('sliderTitleAddNew') : t('sliderTitleEdit')
            }
            options={DISCOUNT_SLIDER_TABS}
            optionsSelected={selectedTab}
            handleChange={validateTabData}
          />
          <DiscountSliderContent
            formValues={formValues}
            setFormValues={setFormValues}
            formErrors={formErrors}
            setFormErrors={setFormErrors}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        </>
      </SliderScreen>
    </>
  )
}

export default DiscountSlider
