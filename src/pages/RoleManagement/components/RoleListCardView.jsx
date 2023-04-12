import React from 'react'
import {useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import history from '../../../history'
import {Heading, HEADING_CONSTANTS, ICON_CONSTANTS} from '@teachmint/krayon'
import {Icon, AvatarGroup} from '@teachmint/krayon'
import styles from '../Roles.module.css'
import {pathName} from '../constant/path.constant'
import {isMobile} from '@teachmint/krayon'
import {ROLE_ID} from '../../../constants/permission.constants'

export default function RoleListCardView({title, desc, roleType, userInfo}) {
  const isMWeb = isMobile()
  const roleList = useSelector(
    (state) => state?.globalData?.getAllRoles?.data?.[roleType]
  )
  const handleCardClick = (roleId, roleName) => {
    history.push({
      pathname: pathName.viewRolePage,
      state: {roleId: roleId, roleName: roleName},
    })
  }

  return roleList && roleList?.length > 0 ? (
    <div className={styles.rolesCardBox}>
      {!isMWeb && <div className={styles.h2}>{title}</div>}
      <div className={styles.p2}>{desc}</div>
      <div className={styles.cardWrapper}>
        {roleList?.map(
          (role) =>
            role._id !== ROLE_ID.KAM && ( // don't show KAM role card
              <div
                key={role._id}
                className={styles.card}
                onClick={() => handleCardClick(role._id, role?.name)}
              >
                <div className={styles.cardHeaderDiv}>
                  <Heading
                    textSize={HEADING_CONSTANTS.TEXT_SIZE.X_SMALL}
                    className={styles.cardHeading}
                  >
                    {role?.name}
                  </Heading>
                  <Icon
                    name="forwardArrow"
                    size={ICON_CONSTANTS.SIZES.X_SMALL}
                  />
                </div>
                <AvatarDiv rolesUserList={userInfo?.[role._id]} />
              </div>
            )
        )}
      </div>
    </div>
  ) : null
}

function AvatarDiv({rolesUserList}) {
  const {t} = useTranslation()
  return rolesUserList?.length > 0 ? (
    <div className={styles.avatarDiv}>
      <AvatarGroup
        data={rolesUserList?.slice(0, 3)}
        size="s"
        classes={{wrapper: styles.avatarWrapper}}
      />
      {rolesUserList?.length > 3 && (
        <span className={styles.cardFooter}>
          {'+'}
          {rolesUserList?.length - 3} {t('roleManagement.users')}
        </span>
      )}
    </div>
  ) : (
    <div className={styles.avatarDiv}>
      <span className={styles.cardFooterText}>
        {t('roleManagement.noUser')}
      </span>
    </div>
  )
}
