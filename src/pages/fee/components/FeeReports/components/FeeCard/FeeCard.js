import {PlainCard} from '@teachmint/krayon'
import classNames from 'classnames'
import styles from './styles.module.css'

const FeeCard = ({children, className, onClick = () => {}}) => {
  return (
    <PlainCard onClick={onClick} className={classNames(styles.card, className)}>
      {children}
    </PlainCard>
  )
}

const Header = ({children, className}) => {
  return (
    <div className={classNames(styles.cardHeader, className)}>{children}</div>
  )
}

const Body = ({children, className}) => {
  return (
    <div className={classNames(styles.cardBody, className)}>{children}</div>
  )
}

FeeCard.Header = Header
FeeCard.Body = Body

export default FeeCard
