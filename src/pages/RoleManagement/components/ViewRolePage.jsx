import React from 'react'
import {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {useHistory} from 'react-router-dom'
import history from '../../../history'
import {Divider, Breadcrumb, KebabMenu, Icon} from '@teachmint/krayon'
import styles from '../Roles.module.css'
import PermissionTable from './PermissionTable'
import {pathName} from '../constant/path.constant'
import globalActions from '../../../redux/actions/global.actions'
import {isMobile} from '@teachmint/krayon'
import {permissionListToMap} from '../utils/permissionMap.utils'
import AssignUserModal from './AssignUserModal'
import UserListModal from './UserListModal'
import Permission from '../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../utils/permission.constants'
import Loader from '../../../components/Common/Loader/Loader'
import useSendEvent from '../../AttendanceReport/hooks/useSendEvent'
import events from '../constant/events.constants'

export default function ViewRolePage() {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const {data: roleInfo, isLoading} = useSelector(
    (state) => state?.globalData?.getRoleInfo
  )
  const permissionMap = useSelector(
    (state) => state?.globalData?.getPermissionMap?.data?.permissionMap
  )
  const {location} = useHistory()
  const roleId = location?.state?.roleId
  const roleName = location?.state?.roleName

  useEffect(() => {
    if (roleId) {
      dispatch(
        globalActions?.getRoleInfo?.request(
          {
            role_id: roleId,
          },
          (response) => {
            location.state.roleName = response?.name
          }
        )
      )
    } else {
      history.push({
        pathname: pathName.roleListPage,
      })
    }
  }, [])

  return (
    <div className={styles.contentAreaWrapper}>
      <Loader show={isLoading} />
      <PageHeader
        roleId={roleId}
        roleName={roleName}
        roleDesc={roleInfo?.description}
      />
      <div className={styles.h2}>{t('roleManagement.accessAndPermission')}</div>
      <div className={styles.p2}>{t('roleManagement.accessDesc')}</div>
      <PermissionTable
        type="view"
        selectedPermissionMap={permissionListToMap(
          permissionMap,
          roleInfo?.permissions
        )}
      />
    </div>
  )
}

function PageHeader({roleId, roleName, roleDesc}) {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const sendEvent = useSendEvent()
  const {currentAdminInfo} = useSelector((state) => state)
  const isMWeb = isMobile()
  const customRoleList = useSelector(
    (state) => state?.globalData?.getAllRoles?.data?.custom
  )
  const [isCustomRole, setIsCustomRole] = useState(false)

  useEffect(() => {
    setIsCustomRole(
      customRoleList?.filter((role) => role._id === roleId)?.length > 0 || false
    )
  }, [customRoleList])

  const deleteRole = () => {
    sendEvent(events.DELETE_USER_ROLE_CLICKED_TFI, {
      role_id: roleId,
      role_name: roleName,
      screen_name: 'user_roles',
    })
    dispatch(
      globalActions?.deleteCustomRole?.request(
        {
          role_id: roleId,
          name: roleName,
        },
        // success Action on DELETE Role: refresh Roles list and navigate to RoleListPage
        () => {
          sendEvent(events.USER_ROLE_DELETED_CLICKED_TFI, {
            role_id: roleId,
            role_name: roleName,
            screen_name: 'user_roles',
          })
          dispatch(globalActions?.getAllRoles?.request())
          history.push({
            pathname: pathName.roleListPage,
          })
        }
      )
    )
  }

  return (
    <div>
      <Breadcrumb
        textSize={isMWeb ? 'm' : 'l'}
        paths={[
          {
            label: t('roleManagement.settings'),
            to: pathName.settingPage,
          },
          {
            label: t('roleManagement.rolesPageHeading'),
            to: pathName.roleListPage,
          },
          {
            label: roleName,
            to: pathName.viewRolePage,
          },
        ]}
      />
      <div className={styles.pageHeaderBox}>
        <div className={styles.pageHeading}>{roleName}</div>
        <div className={styles.pageDesc}>{roleDesc}</div>
        <div className={styles.pageButtonBox}>
          <UserListModal />
          {roleId === 'owner' &&
          !currentAdminInfo?.role_ids?.includes('owner') ? null : (
            <AssignUserModal />
          )}

          {isCustomRole && !isMWeb && (
            <KebabMenu
              isVertical={true}
              classes={{
                content: styles.menuTooltip,
                option: styles.menuOption,
              }}
              options={[
                {
                  content: (
                    <Permission
                      permissionId={
                        PERMISSION_CONSTANTS.InstituteRoleController_updateRoute_update
                      }
                    >
                      <div
                        className={styles.menuItem}
                        onClick={() => {
                          sendEvent(events.EDIT_USER_ROLE_CLICKED_TFI, {
                            role_id: roleId,
                            role_name: roleName,
                            screen_name: 'user_roles',
                          })
                          history.push({
                            pathname: pathName.createRolePage,
                            state: {roleId: roleId},
                          })
                        }}
                      >
                        <Icon name="edit2" size="x_s" />
                        {t('roleManagement.edit')}
                      </div>
                    </Permission>
                  ),
                  handleClick: () => {},
                },
                {
                  content: (
                    <Permission
                      permissionId={
                        PERMISSION_CONSTANTS.InstituteRoleController_deleteRoute_delete
                      }
                    >
                      <div className={styles.menuItem} onClick={deleteRole}>
                        <Icon name="delete1" size="x_s" />
                        {t('roleManagement.delete')}
                      </div>
                    </Permission>
                  ),

                  handleClick: () => {},
                },
              ]}
            />
          )}
        </div>
      </div>
      <Divider spacing={isMWeb ? '16px' : '20px'} />
    </div>
  )
}
