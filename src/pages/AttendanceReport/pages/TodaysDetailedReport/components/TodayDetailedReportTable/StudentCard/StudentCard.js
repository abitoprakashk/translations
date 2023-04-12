import {Divider, PlainCard} from '@teachmint/krayon'
import classNames from 'classnames'
import React from 'react'
import SingleAttendanceBadge from '../../../../../components/SingleAttendanceBadge/SingleAttendanceBadge'
import styles from '../../../../../styles/StudentCard.module.css'

function StudentCard({item, index}) {
  return (
    <div key={index} className={styles.cardWrapper}>
      <PlainCard className={styles.mcard}>
        <div className={classNames(styles.flex, styles.column)}>
          <div className={styles.marginBottom}>
            <SingleAttendanceBadge {...item.attendance} />
          </div>
          <span className={styles.mtitle}>{item.name}</span>
          <span className={styles.mdesc}>{item.phone_number}</span>
          <Divider classes={{wrapper: styles.mcardWrapper}} />
          <span className={styles.mdesc}>{item.sectionName}</span>
        </div>
      </PlainCard>
    </div>
  )
}

export default StudentCard
