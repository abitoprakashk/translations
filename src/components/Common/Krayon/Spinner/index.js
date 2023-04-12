import classNames from 'classnames'
import styles from './styles.module.css'

const Spinner = ({spin = true, speed = 2, className = null, children}) => {
  if (!spin) return <span className={className}>{children}</span>
  return (
    <span
      className={classNames(styles.spinner, className)}
      style={{animationDuration: `${speed}s`}}
    >
      {children}
    </span>
  )
}

export default Spinner
