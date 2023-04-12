import {Input} from '@teachmint/krayon'
import classNames from 'classnames'
import styles from './MetricInput.module.css'

const classes = {
  wrapper: styles.wrapper,
  input: styles.input,
  infoMsg: styles.infoMsg,
}

const whiteClasses = {
  wrapper: classNames(styles.white, styles.wrapper),
  input: classNames(styles.white, styles.input),
  infoMsg: styles.infoMsg,
}

const MetricInput = ({value, setValue, suffix, white = false, ...rest}) => {
  return (
    <Input
      suffix={suffix}
      value={value}
      classes={white ? whiteClasses : classes}
      onChange={setValue}
      {...rest}
    />
  )
}

export default MetricInput
