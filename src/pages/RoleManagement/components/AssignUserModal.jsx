import React from 'react'
import {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {useHistory} from 'react-router-dom'
import {
  Button,
  Alert,
  Modal,
  Checkbox,
  SearchBar,
  Avatar,
  Icon,
  Divider,
} from '@teachmint/krayon'
import styles from '../Roles.module.css'
import globalActions from '../../../redux/actions/global.actions'
import {utilsGetAdminsList} from '../../../routes/dashboard'
import {instituteAdminListAction} from '../../../redux/actions/instituteInfoActions'
import {showErrorOccuredAction} from '../../../redux/actions/commonAction'
import {parseRoleList} from '../utils/roleInfo.utils'
import {Trans} from 'react-i18next'
import classname from 'classnames'
import {isMobile} from '@teachmint/krayon'
import Permission from '../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../utils/permission.constants'
import Loader from '../../../components/Common/Loader/Loader'
import useSendEvent from '../../AttendanceReport/hooks/useSendEvent'
import events from '../constant/events.constants'

export default function AssignUserModal() {
  const {t} = useTranslation()
  const isMWeb = isMobile()
  const dispatch = useDispatch()
  const sendEvent = useSendEvent()
  const {isLoading} = useSelector((state) => state?.globalData?.assignUserRole)
  const {instituteAdminList} = useSelector((state) => state)
  const [rolesUserList, setRolesUserList] = useState([])
  const [selectedList, setSelectedList] = useState([])
  const [showModal, setShowModal] = useState(false)
  const {location} = useHistory()
  const roleId = location?.state?.roleId
  const roleName = location?.state?.roleName

  useEffect(() => {
    const rolesUser = instituteAdminList
      ?.filter(
        (user) =>
          user?.roles?.[0] === roleId || user?.roles_to_assign?.[0] === roleId
      )
      ?.map((user) => user?._id)

    setSelectedList(rolesUser || [])
    setRolesUserList(rolesUser || [])
  }, [instituteAdminList])

  const updateInstituteAdmins = () => {
    utilsGetAdminsList()
      .then(({obj}) => {
        dispatch(instituteAdminListAction(obj?.admin))
      })
      .catch(() => dispatch(showErrorOccuredAction(true)))
  }

  const toggleModal = () => {
    setShowModal((show) => !show)
    setSelectedList(rolesUserList)
  }

  const assignUser = () => {
    sendEvent(events.USERS_ASSIGN_CLICKED_TFI, {
      role_id: roleId,
      role_name: roleName,
      screen_name: 'user_roles',
      users: selectedList,
    })

    if (selectedList?.length > 0) {
      dispatch(
        globalActions?.assignUserRole?.request(
          {
            role_id: roleId,
            iids: selectedList,
          },
          // success action  update instituteAdminList
          () => {
            updateInstituteAdmins()
            sendEvent(events.USERS_ASSIGNED_TFI, {
              role_id: roleId,
              role_name: roleName,
              screen_name: 'user_roles',
              users: selectedList,
            })
          }
        )
      )
    }
    toggleModal()
  }

  return (
    <div>
      <Loader show={isLoading} />
      <Permission
        permissionId={
          PERMISSION_CONSTANTS.InstituteRoleController_assignUsers_update
        }
      >
        <Button
          onClick={() => {
            sendEvent(events.ASSIGN_USERS_CLICKED_TFI, {
              role_id: roleId,
              role_name: roleName,
              screen_name: 'user_roles',
            })
            toggleModal()
          }}
          type={rolesUserList?.length > 0 ? 'outline' : 'filled'}
          size={!isMWeb && rolesUserList?.length > 0 ? 's' : 'm'}
        >
          {t('roleManagement.assignUsers')}
        </Button>
      </Permission>

      <Modal
        isOpen={showModal}
        onClose={toggleModal}
        size="s"
        header={
          <>
            <div className={styles.modalHeader}>
              <div>
                <Trans i18nKey="assignUserTo">Assign users to {roleName}</Trans>
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
        footerLeftElement={`${selectedList.length}/${
          instituteAdminList.length
        } ${t('roleManagement.selected')}`}
        actionButtons={[
          {
            onClick: assignUser,
            body: t('roleManagement.assign'),
          },
        ]}
        classes={{
          modal: styles.modalAssignUser,
          content: styles.modalContent,
          footer: styles.modalFooter,
        }}
      >
        <StaffCheckList
          rolesUserList={rolesUserList}
          selectedList={selectedList}
          setSelectedList={setSelectedList}
        />
      </Modal>
    </div>
  )
}

function StaffCheckList({rolesUserList, selectedList, setSelectedList}) {
  const {t} = useTranslation()
  const {instituteAdminList, currentAdminInfo} = useSelector((state) => state)
  const roleList = useSelector((state) => state?.globalData?.getAllRoles?.data)
  const [searchValue, setSearchValue] = useState('')
  const {location} = useHistory()
  const roleName = location?.state?.roleName
  const [allRoleInfo, setAllRoleInfo] = useState({})

  useEffect(() => {
    setAllRoleInfo(parseRoleList([...roleList?.custom, ...roleList?.default]))
  }, [roleList])

  return (
    <div>
      <Alert
        content={t('roleManagement.selectedUsersAssignedAs') + roleName}
        hideClose
        textSize="l"
        type="warning"
        className={styles.modalAlert}
      />

      <SearchBar
        handleChange={({value}) => setSearchValue(value)}
        placeholder={t('roleManagement.search')}
        value={searchValue}
      />
      <div className={styles.staffListBox}>
        {instituteAdminList?.map((user, i) =>
          user?.name?.toLowerCase()?.includes(searchValue?.toLowerCase()) ? (
            <div
              key={user._id}
              className={classname(
                styles.modalRow,
                i % 2 == 1 ? styles.evenRow : ''
              )}
            >
              <div className={styles.modalC1}>
                <Checkbox
                  name={user?._id}
                  fieldName={user?._id}
                  handleChange={() => {
                    setSelectedList(
                      selectedList?.includes(user?._id)
                        ? selectedList.filter((userId) => userId !== user?._id)
                        : selectedList.concat(user?._id)
                    )
                  }}
                  isDisabled={
                    rolesUserList?.includes(user?._id) ||
                    user?.roles?.includes('owner') ||
                    user?.roles_to_assign?.includes('owner') ||
                    user?.user_id === currentAdminInfo?.user_id
                  }
                  isSelected={selectedList?.includes(user?._id)}
                  classes={{
                    wrapper: styles.modalCheckbox,
                  }}
                />
              </div>
              <div className={styles.modalC2}>
                <Avatar
                  name={user?.name}
                  imgSrc={user?.img_url}
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
              <div className={classname(styles.modalC4, styles.truncate)}>
                {allRoleInfo?.[user?.roles?.[0] || user?.roles_to_assign?.[0]]}
              </div>
            </div>
          ) : null
        )}
      </div>
    </div>
  )
}
