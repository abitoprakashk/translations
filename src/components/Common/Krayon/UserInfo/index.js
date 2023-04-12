import {Avatar, AVATAR_CONSTANTS} from '@teachmint/krayon'
import classNames from 'classnames'
import React from 'react'

import styles from './styles.module.css'

const UserInfo = ({
  className,
  name,
  designation,
  profilePic,
  avatarSize = AVATAR_CONSTANTS.SIZE.MEDIUM,
  avatarVariant,
}) => {
  if (!name) return null
  return (
    <div
      className={classNames(
        styles.flex,
        styles.flexRow,
        styles.wrapper,
        className
      )}
    >
      {avatarSize && (
        <Avatar
          variant={avatarVariant}
          name={name}
          size={avatarSize}
          className={styles.noShrink}
          imgSrc={profilePic}
        />
      )}
      <div
        className={classNames(
          styles.flex,
          styles.flexColumn,
          styles.infoWrapper,
          {[styles[avatarSize ? avatarSize?.toLowerCase() : '']]: avatarSize}
        )}
      >
        <span className={classNames(styles.name, styles.textEllipsis)}>
          {name}
        </span>
        {designation && (
          <span className={classNames(styles.designation, styles.textEllipsis)}>
            {designation}
          </span>
        )}
      </div>
    </div>
  )
}

export default UserInfo
