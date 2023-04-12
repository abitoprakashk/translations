import classNames from 'classnames'
import React from 'react'
import {LEAVE_TYPE} from '../../../../../LeaveManagement.constant'
import defaultUserImage from '../../../../../../../assets/images/icons/user-profile.svg'
import styles from './LeaveList.module.css'
import {Trans} from 'react-i18next'

const LeaveListCard = ({item}) => {
  return item ? (
    <div className={styles.rowWrapper}>
      <div className={styles.flex}>
        <img className={styles.img} src={item?.img_url || defaultUserImage} />
        <div className={styles.alignCenter}>
          <div className={styles.link}>{item.name}</div>
          <div className={styles.staffType}>{item.rollName}</div>
        </div>
      </div>
      <div className={classNames(styles.alignCenter, styles.flexEnd)}>
        <div className={styles.leavedate}>
          <Trans key={'leaveTypeDynamic'}>
            {{leave: `${LEAVE_TYPE[item.type]}`}} Leave
          </Trans>
        </div>
        <div className={styles.staffType}>
          <Trans i18nKey={'requestedon'}>
            Requested on {{requestedOn: item.requestedOn}}
          </Trans>
        </div>
      </div>
    </div>
  ) : null
}

export default LeaveListCard
