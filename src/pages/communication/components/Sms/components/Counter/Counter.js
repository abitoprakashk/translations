import {Button, BUTTON_CONSTANTS} from '@teachmint/krayon'
import {useState, useEffect} from 'react'
import {useTranslation} from 'react-i18next'
import styles from './Counter.module.css'
export const Counter = ({handleChange}) => {
  const [value, setValue] = useState(1)
  const {t} = useTranslation()

  const increaseCounter = () => {
    setValue(+value + 1)
  }
  const decreaseCounter = () => {
    setValue(+value - 1)
  }

  useEffect(() => {
    handleChange(+value)
  }, [value])
  return (
    <div className={styles.wrapper}>
      <Button
        prefixIcon="remove"
        onClick={decreaseCounter}
        isDisabled={value <= 1}
        type={BUTTON_CONSTANTS.TYPE.OUTLINE}
        classes={{button: styles.btn}}
      />
      <div className={styles.displayWrap}>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          type="number"
          min="1"
          className={styles.valueText}
        />
        <div className={styles.placeholder}>{t('smsMultiplier')}</div>
      </div>
      <Button
        prefixIcon="add"
        onClick={increaseCounter}
        type={BUTTON_CONSTANTS.TYPE.OUTLINE}
        classes={{button: styles.btn}}
      />
    </div>
  )
}
