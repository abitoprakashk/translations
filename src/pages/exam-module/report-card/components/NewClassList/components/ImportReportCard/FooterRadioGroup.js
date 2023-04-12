import {Radio} from '@teachmint/krayon'
import {RC_IMPORT_TYPE} from '../../../../constants'
import styles from './ImportReportCard.module.css'

const FooterRadioGroup = ({onSelect, selected, evaluated = false}) => {
  return (
    <div className={styles.radioGroup}>
      <Radio
        fieldName={RC_IMPORT_TYPE.include_structure.value}
        handleChange={onSelect}
        label={RC_IMPORT_TYPE.include_structure.label}
        isSelected={selected == RC_IMPORT_TYPE.include_structure.value}
        isDisabled={evaluated}
      />
      <Radio
        fieldName={RC_IMPORT_TYPE.include_customization.value}
        handleChange={onSelect}
        label={RC_IMPORT_TYPE.include_customization.label}
        isSelected={selected == RC_IMPORT_TYPE.include_customization.value}
      />
      <Radio
        fieldName={RC_IMPORT_TYPE.include_both.value}
        handleChange={onSelect}
        label={RC_IMPORT_TYPE.include_both.label}
        isSelected={selected == RC_IMPORT_TYPE.include_both.value}
        isDisabled={evaluated}
      />
    </div>
  )
}

export default FooterRadioGroup
