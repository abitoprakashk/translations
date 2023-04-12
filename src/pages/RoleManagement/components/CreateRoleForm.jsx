import React from 'react'
import {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {Trans} from 'react-i18next'
import {useHistory} from 'react-router-dom'
import history from '../../../history'
import {
  Button,
  Divider,
  Heading,
  Input,
  Para,
  Popup,
  Stepper,
} from '@teachmint/krayon'
import PermissionTable from './PermissionTable'
import {SCREEN_NAME} from '../constant/constant'
import {STEPPER_STATUS} from '../constant/constant'
import styles from '../Roles.module.css'
import {pathName} from '../constant/path.constant'
import globalActions from '../../../redux/actions/global.actions'
import {
  permissionListToMap,
  permissionMapToList,
} from '../utils/permissionMap.utils'
import ImportRoleModal from './ImportRoleModal'
import classname from 'classnames'
import Loader from '../../../components/Common/Loader/Loader'
import useSendEvent from '../../AttendanceReport/hooks/useSendEvent'
import events from '../constant/events.constants'

export default function CreateRoleForm() {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const sendEvent = useSendEvent()
  const {isLoading: isLoadingCreateRole} = useSelector(
    (state) => state?.globalData?.createCustomRole
  )
  const {data: roleInfo, isLoading: isLoadingGetRole} = useSelector(
    (state) => state?.globalData?.getRoleInfo
  )
  const permissionMap = useSelector(
    (state) => state?.globalData?.getPermissionMap?.data?.permissionMap
  )
  const [screen, setScreen] = useState(SCREEN_NAME.DEFINE_ROLE)
  const {location} = useHistory()
  const roleId = location?.state?.roleId
  const [roleName, setRoleName] = useState('')
  const [roleDesc, setRoleDesc] = useState('')
  const [selectedPermissionMap, setSelectedPermissionMap] = useState({})
  const [formStatus, setFormStatus] = useState([
    STEPPER_STATUS.IN_PROGRESS,
    STEPPER_STATUS.NOT_STARTED,
  ])
  const [isPopUpOpen, setIsPopUpOpen] = useState(false)

  // in case of update role :
  // fetch current roles information from redux store and show in input fields.
  // if role info not in redux store fetch from BACKEND
  useEffect(() => {
    if (roleId && !roleInfo) {
      dispatch(
        globalActions?.getRoleInfo?.request({
          role_id: roleId,
        })
      )
    }
  }, [])

  useEffect(() => {
    if (roleId && roleInfo) {
      setFormStatus([STEPPER_STATUS.COMPLETED, STEPPER_STATUS.COMPLETED])
      setRoleName(roleInfo?.name)
      setRoleDesc(roleInfo?.description)
    }
  }, [roleInfo])

  useEffect(() => {
    if (roleId) {
      setFormStatus([STEPPER_STATUS.COMPLETED, STEPPER_STATUS.COMPLETED])
      setSelectedPermissionMap(
        permissionListToMap(permissionMap, roleInfo?.permissions)
      )
    }
  }, [permissionMap, roleInfo])

  const createRole = () => {
    sendEvent(events.CREATE_CUSTOM_ROLE_POPUP_CLICKED_TFI, {
      role_id: roleId,
      role_name: roleName,
      action: 'published',
    })
    dispatch(
      globalActions?.createCustomRole?.request(
        {
          role_id: roleId,
          name: roleName,
          description: roleDesc,
          permissions: permissionMapToList(
            permissionMap,
            selectedPermissionMap
          ),
        },
        // success Action on CREATE / UPDATE Role: refresh Roles list and navigate to ViewRolePage
        (response) => {
          sendEvent(events.CUSTOM_ROLE_PUBLISHED_TFI, {
            role_id: roleId,
            role_name: roleName,
          })
          dispatch(globalActions?.getAllRoles?.request())
          history.push({
            pathname: pathName.viewRolePage,
            state: {roleId: roleId || response?._id, roleName: roleName},
          })
        }
      )
    )
  }

  switch (screen) {
    case SCREEN_NAME.DEFINE_ROLE: {
      return (
        <>
          <Loader show={isLoadingCreateRole || isLoadingGetRole} />
          <div className={styles.formWrapper}>
            <div className={styles.stepperDiv}>
              <FormStepper formStatus={formStatus} setScreen={setScreen} />
            </div>
            <Divider spacing="0" />
            <div className={styles.formDiv}>
              <Heading textSize="s">{t('roleManagement.defineRole')}</Heading>
              <div className={styles.formInputDiv}>
                <Input
                  title={t('roleManagement.roleName')}
                  placeholder={t('roleManagement.roleNamePlaceholder')}
                  value={roleName}
                  isRequired
                  maxLength={30}
                  onChange={(obj) => {
                    setRoleName(obj.value)
                  }}
                  showMsg
                  type="text"
                  classes={{wrapper: styles.textInput}}
                />

                <Input
                  title={t('roleManagement.roleDesc')}
                  placeholder={t('roleManagement.roleDescPlaceholder')}
                  value={roleDesc}
                  isRequired
                  maxLength={240}
                  onChange={(obj) => {
                    setRoleDesc(obj.value)
                  }}
                  showMsg
                  rows={4}
                  type="textarea"
                  classes={{wrapper: styles.textInput}}
                />
              </div>
            </div>
          </div>

          <div className={styles.fixedFooter}>
            <Button
              isDisabled={!(roleName && roleDesc)}
              onClick={() => {
                sendEvent(events.CREATE_CUSTOM_ROLE_NEXT_CLICKED_TFI)
                setScreen(SCREEN_NAME.DEFINE_PERMISSION)
                if (!roleId) {
                  setFormStatus([
                    STEPPER_STATUS.COMPLETED,
                    STEPPER_STATUS.IN_PROGRESS,
                  ])
                }
              }}
              classes={{button: styles.floatRight}}
            >
              {t('roleManagement.next')}
            </Button>
          </div>
        </>
      )
    }
    case SCREEN_NAME.DEFINE_PERMISSION: {
      return (
        <>
          <Loader show={isLoadingCreateRole || isLoadingGetRole} />
          <div className={styles.formWrapper}>
            <div className={styles.stepperDiv}>
              <FormStepper formStatus={formStatus} setScreen={setScreen} />
            </div>
            <Divider spacing="0" />
            <div className={classname(styles.formDiv, styles.formTable)}>
              <Heading className={styles.inline} textSize="s">
                {t('roleManagement.definePermissions')}
              </Heading>
              <ImportRoleModal
                setSelectedPermissionMap={setSelectedPermissionMap}
                roleName={roleName}
              />
              <Para className={styles.formDesc}>
                {t('roleManagement.grantUsersAccess')}
              </Para>
              <PermissionTable
                type="edit"
                selectedPermissionMap={selectedPermissionMap}
                setSelectedPermissionMap={setSelectedPermissionMap}
              />
              <Popup
                isOpen={isPopUpOpen}
                actionButtons={[
                  {
                    body: t('roleManagement.cancel'),
                    id: 'cancel-btn',
                    onClick: () => {
                      sendEvent(events.CREATE_CUSTOM_ROLE_POPUP_CLICKED_TFI, {
                        role_id: roleId,
                        role_name: roleName,
                        action: 'cancel',
                      })
                      setIsPopUpOpen(false)
                    },
                    type: 'outline',
                  },
                  {
                    body: roleId
                      ? t('roleManagement.update')
                      : t('roleManagement.publish'),
                    category: 'constructive',
                    id: 'activate-btn',
                    onClick: createRole,
                  },
                ]}
                header={
                  roleId
                    ? t('roleManagement.update') + ' ' + roleName + ' ? '
                    : t('roleManagement.popUpTitle')
                }
                onClose={() => {
                  setIsPopUpOpen(false)
                }}
                classes={{
                  content: styles.popupContent,
                  header: styles.popUpHeader,
                  popup: styles.popUpWrapper,
                }}
              >
                <Para>
                  {roleId ? (
                    <Trans i18nKey="popUpContentUpdate">
                      Access permissions associated with {roleName} role will
                      get updated
                    </Trans>
                  ) : (
                    t('roleManagement.popUpContent')
                  )}
                </Para>
              </Popup>
            </div>
          </div>

          <div className={styles.fixedFooter}>
            <Button
              isDisabled={!(roleName && roleDesc)}
              onClick={() => {
                sendEvent(events.CREATE_CUSTOM_ROLE_PUBLISH_CLICKED_TFI, {
                  role_id: roleId,
                  role_name: roleName,
                })
                setIsPopUpOpen(true)
              }}
              classes={{button: styles.floatRight}}
            >
              {t('roleManagement.publish')}
            </Button>
          </div>
        </>
      )
    }
  }
}

function FormStepper({formStatus, setScreen}) {
  const {t} = useTranslation()
  return (
    <Stepper
      onClickOfStep={(step) => setScreen(step?.id)}
      isVertical={false}
      steps={[
        {
          id: SCREEN_NAME.DEFINE_ROLE,
          title: t('roleManagement.defineRole'),
          status: formStatus[0],
          description: t('roleManagement.nameAndDescription'),
        },
        {
          id: SCREEN_NAME.DEFINE_PERMISSION,
          title: t('roleManagement.definePermissions'),
          status: formStatus[1],
          description: t('roleManagement.accessesAndPermissions'),
        },
      ]}
      classes={{wrapper: styles.stepperWrapper, step: styles.stepperStep}}
    />
  )
}
