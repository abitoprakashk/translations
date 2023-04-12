import React from 'react'
import {useState, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {useHistory} from 'react-router-dom'
import {Modal, Avatar, Icon, Divider, AvatarGroup} from '@teachmint/krayon'
import styles from '../Roles.module.css'
import {Trans} from 'react-i18next'
import classname from 'classnames'

export default function UserListModal() {
  const {instituteAdminList} = useSelector((state) => state)
  const [rolesUserList, setRolesUserList] = useState([])
  const [showModal, setShowModal] = useState(false)
  const {location} = useHistory()
  const roleId = location?.state?.roleId
  const roleName = location?.state?.roleName

  useEffect(() => {
    setRolesUserList(
      instituteAdminList
        ?.filter(
          (user) =>
            user?.roles?.[0] === roleId || user?.roles_to_assign?.[0] === roleId
        )
        ?.map((user) => ({
          id: user?._id,
          name: user?.name,
          imgSrc: user?.img_url,
          phone_number: user?.phone_number,
          email: user?.email,
        })) || []
    )
  }, [instituteAdminList])

  const toggleModal = () => {
    setShowModal((show) => !show)
  }

  return (
    <div>
      <AvatarGroup
        data={rolesUserList}
        onClick={toggleModal}
        onMoreClick={toggleModal}
        classes={{wrapper: styles.avatarWrapper}}
      />

      <Modal
        isOpen={showModal}
        onClose={toggleModal}
        size="s"
        header={
          <>
            <div className={styles.modalHeader}>
              <div>
                <Trans i18nKey="userAssignedAs">
                  Users assigned as {roleName}
                </Trans>
              </div>
              <div>
                <Icon
                  onClick={toggleModal}
                  name="close"
                  size="x_s"
                  className={styles.modalCross}
                />
              </div>
            </div>
            <Divider spacing="0" />
          </>
        }
        classes={{
          modal: styles.modalUserList,
          content: styles.modalContent,
        }}
      >
        <UsersList rolesUserList={rolesUserList} />
      </Modal>
    </div>
  )
}

function UsersList({rolesUserList}) {
  return (
    <div>
      <div className={styles.userListBox}>
        {rolesUserList?.map((user, i) => (
          <div
            key={user._id}
            className={classname(
              styles.modalRow,
              i % 2 == 0 ? styles.evenRow : ''
            )}
          >
            <div className={styles.modalC2}>
              <Avatar
                name={user?.name}
                imgSrc={user?.imgSrc}
                classes={{wrapper: styles.modalAvatar}}
              />
            </div>
            <div className={styles.modalC3}>
              <div className={classname(styles.modalH1, styles.truncate)}>
                {user?.name}
              </div>
              <div className={classname(styles.modalP1, styles.truncate)}>
                {user?.phone_number || user?.email}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
