import {useState} from 'react'
import {useSelector} from 'react-redux'
import classNames from 'classnames'
import {Icon} from '@teachmint/common'
import styles from './Slider.module.css'
import {events} from '../../../../../utils/EventsConstants'
import {
  ALL_STRUCTURE_SLIDER_TABS,
  FEE_STRUCTURE_SLIDER_TABS_IDS,
  FEE_STRUCTURE_TYPES,
  FEE_STRUCTURE_TYPES_IDS,
  getStructureFeeType,
  TRANSPORT_METHODS,
} from '../../../fees.constants'
import SliderContent from './SliderContent'
import {useTransportStructureSettings} from '../../../redux/feeStructure/feeStructureSelectors'
import SliderScreen from '../../../../../components/Common/SliderScreen/SliderScreen'
import ConfirmationPopup from '../../../../../components/Common/ConfirmationPopup/ConfirmationPopup'
import SliderScreenHeader from '../../../../../components/Common/SliderScreenHeader/SliderScreenHeader'
import {Trans, useTranslation} from 'react-i18next'
import {validateCurrentTab} from './Slider.helpers'

export default function Slider({setSliderScreen, data, width}) {
  const {t} = useTranslation()
  let {initialValues} = JSON.parse(JSON.stringify(data))
  const transportStructureSettings = useTransportStructureSettings()
  const {
    eventManager,
    instituteAcademicSessionInfo,
    instituteActiveAcademicSessionId,
  } = useSelector((state) => state)
  const sessionRange = instituteAcademicSessionInfo.find(
    (session) => session._id == instituteActiveAcademicSessionId
  )

  if (initialValues.fee_categories.length === 0) {
    let catagoriesVal = {master_id: '', tax: ''}
    if (initialValues.fee_type === FEE_STRUCTURE_TYPES_IDS.TRANSPORT_FEE) {
      catagoriesVal = {distanceFrom: 0, distanceTo: '', amount: ''}
      if (
        transportStructureSettings.transport_structure_exists.status &&
        transportStructureSettings.transport_structure_type.value ===
          TRANSPORT_METHODS.WAYPOINT
      ) {
        catagoriesVal = {pickup: '', amount: ''}
      }
    }
    initialValues.fee_categories.push({
      ...catagoriesVal,
      schedule: {},
      isDelete: false,
    })
  }

  const [formValues, setFormValues] = useState(initialValues)
  const [formErrors, setFormErrors] = useState({})
  const [showConfirmPopup, setShowConfirmPopup] = useState(false)
  const [currentTab, setCurrentTab] = useState(
    FEE_STRUCTURE_SLIDER_TABS_IDS.CLASSES
  )

  const tabEvents = {
    [FEE_STRUCTURE_SLIDER_TABS_IDS.CLASSES]: events.FEE_CLASS_CLICKED_TFI,
    [FEE_STRUCTURE_SLIDER_TABS_IDS.FEE_STRUCTURE]:
      events.FEE_USER_PROFILE_CLICKED_TFI,
    [FEE_STRUCTURE_SLIDER_TABS_IDS.FEE_TYPE]:
      events.FEE_USER_PROFILE_CLICKED_TFI,
    [FEE_STRUCTURE_SLIDER_TABS_IDS.DUE_DATES]: events.FEE_CLASS_CLICKED_TFI,
    [FEE_STRUCTURE_SLIDER_TABS_IDS.AMOUNT]: events.FEE_CLASS_CLICKED_TFI,
  }

  const switchCurrentTab = (tab) => {
    if (validateCurrentTab(formValues, setFormErrors, currentTab, tab)) {
      setCurrentTab(tab)
      eventManager.send_event(tabEvents[tab], {
        fee_type: formValues.fee_type,
      })
    }
    return false
  }

  const closeConfirmPopup = () => {
    eventManager.send_event(events.EXIT_POPUP_SHOWN_TFI, {
      fee_type: getStructureFeeType(formValues),
      screen_name: 'create_fee_structure',
    })
    setShowConfirmPopup(false)
    setSliderScreen(null)
  }

  return (
    <>
      {showConfirmPopup && (
        <ConfirmationPopup
          onClose={() => setShowConfirmPopup(false)}
          onAction={() => closeConfirmPopup()}
          icon={
            <Icon
              name="info"
              color="warning"
              className={classNames(
                styles.higherSpecificityFontSize,
                styles.higherSpecificityIcon,
                styles.infoIcon
              )}
            />
          }
          title={t('normalStructureExitConfirmModalTitle')}
          desc={t('normalStructureExitConfirmModalDesc')}
          primaryBtnText={t('btnTextContinueEditing')}
          secondaryBtnText={t('btnTextYesExit')}
        />
      )}
      <SliderScreen setOpen={() => setShowConfirmPopup(true)} width={width}>
        <>
          <SliderScreenHeader
            icon={FEE_STRUCTURE_TYPES[initialValues.fee_type].icon}
            title={
              <div className={styles.title}>
                <Trans i18nKey="feeStructureSliderHeading">
                  {FEE_STRUCTURE_TYPES[initialValues.fee_type].label} Structure
                </Trans>
              </div>
            }
            options={ALL_STRUCTURE_SLIDER_TABS[initialValues.fee_type]}
            rightSection={
              <div>
                <div className={styles.academicYearData}>
                  {sessionRange.name}
                </div>
                <div className={styles.academicYearTitle}>
                  {t('academicSession')}
                </div>
              </div>
            }
            optionsSelected={currentTab}
            handleChange={switchCurrentTab}
          />
          <SliderContent
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            formValues={formValues}
            setFormValues={setFormValues}
            formErrors={formErrors}
            setFormErrors={setFormErrors}
          />
        </>
      </SliderScreen>
    </>
  )
}
