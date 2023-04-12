import {useState} from 'react'
import {useSelector} from 'react-redux'
import {t} from 'i18next'
import {
  ButtonDropdown,
  Icon,
  ICON_CONSTANTS,
  Para,
  PARA_CONSTANTS,
} from '@teachmint/krayon'
import {
  admissionCrmFormType,
  admissionCrmFormTypes,
  defaultAdmissionFormSteps,
} from '../../utils/constants'
import styles from './Leads.module.css'
import AdmissionFormModal from '../AddLead/AdmissionFormModal'
import EnquiryFormModal from '../AddLead/EnquiryFormModal'
import classNames from 'classnames'
import {events} from '../../../../utils/EventsConstants'

export default function AddLeadDropdown({className}) {
  const [formType, setFormType] = useState('')
  const eventManager = useSelector((state) => state.eventManager)

  const handleOptionClick = (value) => {
    eventManager.send_event(
      value === admissionCrmFormType.ADMISSION_FORM
        ? events.ADD_NEW_LEAD_ADMISSION_FORM_CLICKED_TFI
        : events.ADD_NEW_LEAD_ENQUIRY_FORM_CLICKED_TFI
    )
    setFormType(admissionCrmFormType[value])
  }

  const renderForm = () => {
    return formType === admissionCrmFormType.ENQUIRY_FORM ? (
      <EnquiryFormModal formType={formType} setFormType={setFormType} />
    ) : (
      <AdmissionFormModal
        formType={formType}
        setFormType={setFormType}
        stepperSteps={defaultAdmissionFormSteps}
      />
    )
  }

  return (
    <>
      {formType && renderForm()}
      <div
        className={classNames(styles.dropdownWrapper, className)}
        onClick={() => {
          eventManager.send_event(events.ADD_NEW_LEAD_CLICKED_TFI, {
            screen_name: 'admission_management',
          })
        }}
      >
        <ButtonDropdown
          buttonObj={{
            suffixIcon: (
              <Icon
                name="downArrow"
                size={ICON_CONSTANTS.SIZES.XX_SMALL}
                type={ICON_CONSTANTS.TYPES.INVERTED}
              />
            ),
            children: t('addNewLeadPlaceholderText'),
          }}
          handleOptionClick={({event, value}) => {
            event.stopPropagation()
            handleOptionClick(value)
          }}
          classes={{
            wrapper: className,
            dropdownContainer: styles.dropdownContainer,
          }}
          options={Object.values(admissionCrmFormTypes).map((option) => ({
            ...option,
            label: (
              <Para
                type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
                weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
              >
                {option.label}
              </Para>
            ),
          }))}
        />
      </div>
    </>
  )
}
