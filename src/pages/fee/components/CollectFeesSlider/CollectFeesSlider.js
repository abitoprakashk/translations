import {useState} from 'react'
import {useTranslation} from 'react-i18next'
import ConfirmationPopup from '../../../../components/Common/ConfirmationPopup/ConfirmationPopup'
import SliderScreen from '../../../../components/Common/SliderScreen/SliderScreen'
import SliderScreenHeader from '../../../../components/Common/SliderScreenHeader/SliderScreenHeader'
import CollectFees from '../CollectFees/CollectFees'

const CollectFeesSlider = ({setSliderScreen, studentId, width, classId}) => {
  const {t} = useTranslation()

  const [showConfirmPopup, setShowConfirmPopup] = useState(false)
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
          title={t('collectingFeeCloseConfirmationPopupTitle')}
          desc={t('collectingFeeCloseConfirmationPopupDesc')}
          primaryBtnText={t('noContinuePayment')}
          secondaryBtnText={t('yesExit')}
          closeOnBackgroundClick={false}
        />
      )}
      <SliderScreen setOpen={() => setShowConfirmPopup(true)} width={width}>
        <SliderScreenHeader title={t('collectFee')} />
        <CollectFees studentId={studentId} classId={classId} />
      </SliderScreen>
    </>
  )
}

export default CollectFeesSlider
