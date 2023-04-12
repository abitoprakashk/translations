import React from 'react'
import {useTranslation} from 'react-i18next'
import {useEffect} from 'react'
import {useSelector} from 'react-redux'
import {useHistory} from 'react-router-dom'
import history from '../../../history'
import {Divider, Breadcrumb} from '@teachmint/krayon'
import styles from '../Roles.module.css'
import CreateRoleForm from './CreateRoleForm'
import {pathName} from '../constant/path.constant'
import {isMobile} from '@teachmint/krayon'
import {PERMISSION_CONSTANTS} from '../../../utils/permission.constants'
import UnauthorisedPage from '../../../components/Home/UnauthorisedPage/Unauthorised'

export default function CreateRolePage() {
  const usersPermission = useSelector(
    (state) => state?.globalData?.userRolePermission?.data?.permission_ids
  )

  useEffect(() => {
    if (isMobile()) {
      history.push({
        pathname: pathName.roleListPage,
      })
    }
  }, [])

  return usersPermission?.includes(
    PERMISSION_CONSTANTS.InstituteRoleController_createRoute_create
  ) ? (
    <div className={styles.contentAreaWrapper}>
      <PageHeader />
      <CreateRoleForm />
    </div>
  ) : (
    <UnauthorisedPage />
  )
}

function PageHeader() {
  const {t} = useTranslation()
  const {location} = useHistory()
  const roleId = location?.state?.roleId
  const roleInfo = useSelector((state) => state?.globalData?.getRoleInfo?.data)

  return (
    <div>
      <Breadcrumb
        textSize="l"
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
            label: roleId
              ? roleInfo?.name
              : t('roleManagement.createRolePageHeading'),
            to: pathName.createRolePage,
          },
        ]}
      />
      <div className={styles.pageHeaderBox}>
        <div className={styles.pageHeading}>
          {roleId ? roleInfo?.name : t('roleManagement.createRolePageHeading')}
        </div>
        <div className={styles.pageDesc}>
          {roleId
            ? roleInfo?.description
            : t('roleManagement.createRolePageSubHeading')}
        </div>
      </div>
      <Divider spacing="20px" />
    </div>
  )
}
