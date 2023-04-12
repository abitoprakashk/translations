import React from 'react'
import {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import history from '../../../history'
import {Breadcrumb, Button, Divider, Para} from '@teachmint/krayon'
import styles from '../Roles.module.css'
import {parseAdminList} from '../utils/adminInfo.utils'
import RoleListCardView from './RoleListCardView'
import {pathName} from '../constant/path.constant'
import {ROLE_TYPE} from '../constant/constant'
import {isMobile} from '@teachmint/krayon'
import classname from 'classnames'
import Permission from '../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../utils/permission.constants'
import Loader from '../../../components/Common/Loader/Loader'
import useSendEvent from '../../AttendanceReport/hooks/useSendEvent'
import events from '../constant/events.constants'

export default function RoleListPage() {
  const {t} = useTranslation()
  const isMWeb = isMobile()
  const {instituteAdminList} = useSelector((state) => state)
  const {isLoading} = useSelector((state) => state?.globalData?.getAllRoles)
  const [userInfo, setUserInfo] = useState({})
  const [rolesVisible, SetRolesVisible] = useState('all')

  useEffect(() => {
    if (instituteAdminList) {
      setUserInfo(parseAdminList(instituteAdminList))
    }
  }, [instituteAdminList])

  useEffect(() => {
    if (isMobile()) {
      SetRolesVisible('default')
    }
  }, [])

  return (
    <div className={styles.contentAreaWrapper}>
      <Loader show={isLoading} />
      <PageHeader />

      {isMWeb && (
        <Rolestab
          rolesVisible={rolesVisible}
          SetRolesVisible={SetRolesVisible}
        />
      )}

      {(rolesVisible === 'custom' || rolesVisible === 'all') && (
        <RoleListCardView
          title={t('roleManagement.customRoles')}
          desc={t('roleManagement.customRolesDesc')}
          roleType={ROLE_TYPE.custom}
          userInfo={userInfo}
        />
      )}

      {(rolesVisible === 'default' || rolesVisible === 'all') && (
        <RoleListCardView
          title={t('roleManagement.defaultRoles')}
          desc={t('roleManagement.defaultRolesDesc')}
          roleType={ROLE_TYPE.default}
          userInfo={userInfo}
        />
      )}
    </div>
  )
}

function PageHeader() {
  const {t} = useTranslation()
  const isMWeb = isMobile()
  const sendEvent = useSendEvent()

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
        ]}
      />
      <div className={styles.pageHeaderBox}>
        <div className={styles.pageHeading}>
          {t('roleManagement.rolesPageHeading')}
        </div>
        {!isMWeb && (
          <div className={styles.pageButtonBox}>
            <Permission
              permissionId={
                PERMISSION_CONSTANTS.InstituteRoleController_createRoute_create
              }
            >
              <Button
                category="primary"
                size="s"
                onClick={() => {
                  sendEvent(events.CREATE_USER_ROLE_CLICKED_TFI)
                  history.push({
                    pathname: pathName.createRolePage,
                  })
                }}
              >
                {t('roleManagement.createRole')}
              </Button>
            </Permission>
          </div>
        )}
      </div>
      <Divider spacing={isMWeb ? '16px' : '20px'} />
    </div>
  )
}

function Rolestab({rolesVisible, SetRolesVisible}) {
  const {t} = useTranslation()
  const customRoleSize = useSelector(
    (state) => state?.globalData?.getAllRoles?.data?.custom?.length
  )
  return customRoleSize > 0 ? (
    <>
      <div className={styles.flex}>
        <Para
          onClick={() => SetRolesVisible('default')}
          className={classname(
            styles.rolesTab,
            rolesVisible === 'default' ? styles.rolesActive : ''
          )}
        >
          {t('roleManagement.defaultRoles')}
        </Para>
        <Para
          onClick={() => SetRolesVisible('custom')}
          className={classname(
            styles.rolesTab,
            rolesVisible === 'custom' ? styles.rolesActive : ''
          )}
        >
          {t('roleManagement.customRoles')}
        </Para>
      </div>
      <Divider spacing="0" />
    </>
  ) : (
    <div className={styles.h2}>{t('roleManagement.defaultRoles')}</div>
  )
}
