import classNames from 'classnames'
import React from 'react'
import styles from './StudentDetails.module.css'
import profileImg from '../../../../assets/images/icons/user-profile.svg'
import {Para} from '@teachmint/krayon'

function StudentDetails({title, desc, img}) {
  return (
    <div className={classNames('flex w-max')}>
      <img
        src={img || profileImg}
        className={classNames(
          'w-9 h-9 lg:w-11 lg:h-11 mr-3 cover rounded-full'
        )}
      />
      <div className={classNames('flex', 'flex-col')}>
        <Para className={styles.title}>{title}</Para>
        {desc ? <Para className={styles.desc}>{desc}</Para> : null}
      </div>
    </div>
  )
}

export default StudentDetails
