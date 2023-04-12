import {useSelector} from 'react-redux'
import {
  Heading,
  HEADING_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  Para,
  PARA_CONSTANTS,
} from '@teachmint/krayon'
import classNames from 'classnames'
import {useEffect, useRef, useState} from 'react'
import styles from './TeachPayGreeting.module.css'
import TeachPayLogo from '../../../../assets//images/companyLogos/TeachPayLogo.svg'
import {t} from 'i18next'
import {
  getTeachPayUrlByPhoneNo,
  getTeachPayUrlByEmail,
} from '../../fees.constants'

const TeachPayGreeting = ({setShowModal, setShowTeachPay}) => {
  const TIMER_VALUE = 3
  const [timer, setTimer] = useState(TIMER_VALUE)
  const timerId = useRef(null)
  const {instituteInfo, currentAdminInfo} = useSelector((state) => state)

  useEffect(() => {
    timerId.current = window.setInterval(() => {
      setTimer((timer) => timer - 1)
    }, 1000)
    return () => {
      clearInterval(timerId.current)
    }
  }, [])

  useEffect(() => {
    if (timer === 0) {
      clearInterval(timerId.current)
      setShowModal(false)
      setShowTeachPay(false)
      if (currentAdminInfo?.phone_number) {
        window.open(
          getTeachPayUrlByPhoneNo(
            instituteInfo._id,
            currentAdminInfo?.phone_number.split('-')[0],
            currentAdminInfo?.phone_number.split('-')[1]
          ),
          '_blank'
        )
      } else {
        window.open(
          getTeachPayUrlByEmail(instituteInfo._id, currentAdminInfo?.email),
          '_blank'
        )
      }
    }
  }, [timer])

  return (
    <div className={classNames(styles.container, styles.flexCenter)}>
      <div className={styles.flexCenter}>
        <Heading
          textSize={HEADING_CONSTANTS.TEXT_SIZE.MEDIUM}
          type={HEADING_CONSTANTS.TYPE.TEXT_PRIMARY}
          className={styles.margin}
        >
          {t('redirectingTo')}
        </Heading>
        <img src={TeachPayLogo} className={styles.imgStyles} />
        <Icon
          name="clock"
          type={ICON_CONSTANTS.TYPES.SECONDARY}
          version={ICON_CONSTANTS.VERSION.OUTLINED}
          size={ICON_CONSTANTS.SIZES.XX_SMALL}
        />
        <Para
          textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}
          type={PARA_CONSTANTS.TYPE.TEXT_SECONDARY}
          className={styles.boldText}
        >
          {`00:0${timer}`}
        </Para>
      </div>
    </div>
  )
}

export default TeachPayGreeting
