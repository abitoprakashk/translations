import styles from './FormError.module.css'
import classNames from 'classnames'

export default function FormError({errorMessage = '', className}) {
  return errorMessage ? (
    <div className={classNames(className, styles.errorMessage)}>
      {errorMessage}
    </div>
  ) : (
    ''
  )
}
