import {Icon, ICON_CONSTANTS, Para, PARA_CONSTANTS} from '@teachmint/krayon'
import React from 'react'
import styles from '../CollectBackdatedPaymentModal.module.css'

export default function StepComp({
  text = '',
  iconObj = {
    name: 'checkCircle',
    type: ICON_CONSTANTS.TYPES.SUCCESS,
    size: ICON_CONSTANTS.SIZES.XXX_SMALL,
  },
  isDot = false,
  type = PARA_CONSTANTS.TYPE.TEXT_SECONDARY,
}) {
  return (
    <div className={styles.stepDiv}>
      {isDot ? (
        <div className={styles.dot}></div>
      ) : (
        <Icon name={iconObj.name} type={iconObj.type} size={iconObj.size} />
      )}
      <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM} type={type}>
        {text}
      </Para>
    </div>
  )
}
