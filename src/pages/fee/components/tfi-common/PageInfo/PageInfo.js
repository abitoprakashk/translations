import {Button} from '@teachmint/common'
import classNames from 'classnames'
import React from 'react'
import styles from './PageInfo.module.css'

export default function PageInfo({
  classes = {},
  buttonLeft = {},
  buttonRight = {},
}) {
  return (
    <div className={classNames(styles.wrapper, classes.wrapper)}>
      <Button
        size="big"
        type="primary"
        className={buttonLeft.className}
        onClick={buttonLeft.click}
      >
        {/* {buttonLeft.content} */}
        {'<'}
      </Button>
      <div className={styles.numberSection}>
        <div className={classNames(styles.numberText)}>1/3</div>
      </div>
      <Button
        size="big"
        type="primary"
        className={buttonRight.className}
        onClick={buttonRight.click}
      >
        {/* {buttonRight.content} */}
        {'>'}
      </Button>
    </div>
  )
}
