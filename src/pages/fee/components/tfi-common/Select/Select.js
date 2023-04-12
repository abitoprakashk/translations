import classNames from 'classnames'
import {useComponentVisible} from '../../../utils'
import styles from './Select.module.css'

export function Select({options, selectedOption, onChange, className}) {
  const {ref, isComponentVisible, setIsComponentVisible} =
    useComponentVisible(false)
  return (
    <div className={classNames(className, styles.container)}>
      <div className={styles.input}>
        <span>{options.find((o) => o.value === selectedOption)?.label}</span>
        <img
          src="https://storage.googleapis.com/tm-assets/icons/primary/down-arrow-primary.svg"
          onClick={() => setIsComponentVisible(!isComponentVisible)}
        />
      </div>
      {isComponentVisible && (
        <div className={styles.dropdown} ref={ref}>
          {options.map((o) => (
            <div
              key={o.value}
              onClick={() => {
                onChange(o.value)
                setIsComponentVisible(false)
              }}
            >
              {o.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Select
