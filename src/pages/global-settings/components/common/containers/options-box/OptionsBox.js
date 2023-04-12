import Accordion from '../../../../../../components/Common/Accordion/Accordion'
import {PERMISSION_CONSTANTS} from '../../../../../../utils/permission.constants'
import RadioButtonOption from '../../options/radio-option/RadioButtonOption'
import SimpleOption from '../../options/simple-option/SimpleOption'
import SimpleTitle from '../../options/simple-title/SimpleTitle'
import ToggleAccordion from '../../options/toggle-accordion/ToggleAccordion'
import styles from './OptionsBox.module.css'
import {useTranslation} from 'react-i18next'

const OptionsBox = ({
  id,
  icon = null,
  iconSelected = null,
  title,
  optionsList = null,
  handleAction,
  optionType,
  titleType,
  desc = null,
  isOn = true,
  selectedOption,
  isLeafNode,
}) => {
  const getTitleComponent = () => {
    const {t} = useTranslation()

    switch (titleType) {
      case TITLE_OPTIONS.SIMPLE_TITLE:
        return (
          <SimpleTitle
            id={id}
            title={t(title)}
            handleAction={() => {
              handleAction(id, null, null)
            }}
          />
        )
      case TITLE_OPTIONS.TOGGLE_TITLE:
        return (
          <ToggleAccordion
            id={id}
            title={t(title)}
            icon={icon}
            isOn={isOn}
            handleActions={(id, value) => {
              handleAction(id, null, value)
            }}
            permissionId={
              PERMISSION_CONSTANTS.classroomSettingController_updateGlobalclassroomsettings_update
            }
          />
        )
      case TITLE_OPTIONS.ACCORDION_TITLE:
        return (
          <Accordion
            title={t(title)}
            icon={icon}
            iconSelected={iconSelected}
            isOpen={isOn}
            isLeafNode={isLeafNode}
            handleActions={() => {
              handleAction(id, null, true)
            }}
          />
        )
      default:
        return null
    }
  }
  const getOptionComponent = () => {
    switch (optionType) {
      case OPTION_TYPES.SIMPLE_OPTION:
        return (
          <SimpleOption
            titleId={id}
            intiallySelectedOption={selectedOption}
            optionsList={optionsList}
            handleAction={handleAction}
          />
        )
      case OPTION_TYPES.RADIO_OPTION:
        return (
          <RadioButtonOption
            titleId={id}
            intiallySelectedOption={selectedOption}
            optionsList={optionsList}
            handleAction={(value) => {
              handleAction(id, value, null)
            }}
          />
        )
      default:
        return null
    }
  }
  return (
    <>
      <div className={styles.optionsBoxWrapper}>
        {getTitleComponent()}
        {desc && <div className={styles.optionsBoxDesc}> {desc}</div>}
        {isOn && optionsList && optionsList.length > 0 && (
          <div className={styles.optionsContainer}>{getOptionComponent()}</div>
        )}
      </div>
    </>
  )
}

const TITLE_OPTIONS = {
  SIMPLE_TITLE: 'SIMPLE_TITLE',
  TOGGLE_TITLE: 'TOGGLE_TITLE',
  ACCORDION_TITLE: 'ACCORDION_TITLE',
}

const OPTION_TYPES = {
  SIMPLE_OPTION: 'SIMPLE_OPTION',
  CHECKBOX_OPTION: 'CHECKBOX_OPTION',
  RADIO_OPTION: 'RADIO_OPTION',
}

export default OptionsBox
export {TITLE_OPTIONS, OPTION_TYPES}
