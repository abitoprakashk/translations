import styles from './timePickerInput.module.css'
import {RequiredSymbol, TimePicker} from '@teachmint/krayon'

export default function TimePickerInput({
  title,
  isRequired,
  fieldName,
  onChange,
  placeholder,
  ...props
}) {
  const handleChange = (value) => onChange({fieldName, value})

  return (
    <div>
      <div className={styles.titleContainer}>
        {title}
        {isRequired && <RequiredSymbol />}
      </div>
      <TimePicker setTime={handleChange} placeholder={placeholder} {...props} />
    </div>
  )
}
