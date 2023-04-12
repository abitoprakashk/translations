import React from 'react'
import {useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {Button, Modal, Icon, Divider, Alert, Dropdown} from '@teachmint/krayon'
import styles from '../Roles.module.css'
import globalActions from '../../../redux/actions/global.actions'
import {permissionListToMap} from '../utils/permissionMap.utils'
import Permission from '../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../utils/permission.constants'
import Loader from '../../../components/Common/Loader/Loader'
import classname from 'classnames'
import useSendEvent from '../../AttendanceReport/hooks/useSendEvent'
import events from '../constant/events.constants'

export default function ImportRoleModal({setSelectedPermissionMap, roleName}) {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const sendEvent = useSendEvent()
  const {isLoading} = useSelector((state) => state?.globalData?.importRole)
  const [showModal, setShowModal] = useState(false)
  const [selectedRole, setSelectedRole] = useState([])
  const allRoleList = useSelector((state) => [
    ...(state?.globalData?.getAllRoles?.data?.default || []),
    ...(state?.globalData?.getAllRoles?.data?.custom || []),
  ])
  const permissionMap = useSelector(
    (state) => state?.globalData?.getPermissionMap?.data?.permissionMap
  )

  const toggleModal = () => {
    setShowModal((show) => !show)
  }

  const importPermission = () => {
    sendEvent(events.CUSTOM_ROLE_IMPORT_PERMISSION_BUTTON_CLICKED_TFI, {
      role_name_for: roleName,
      role_name_of: selectedRole,
    })

    dispatch(
      globalActions?.importRole?.request(
        {
          roles: selectedRole,
        },
        (response) => {
          setSelectedPermissionMap(
            permissionListToMap(permissionMap, response?.permissions)
          )
        }
      )
    )
    toggleModal()
  }

  return (
    <div className={styles.inline}>
      <Loader show={isLoading} />

      <Permission
        permissionId={
          PERMISSION_CONSTANTS.InstituteRoleController_importRole_read
        }
      >
        <Button
          onClick={() => {
            sendEvent(events.CUSTOM_ROLE_IMPORT_PERMISSION_INITITATED_TFI)
            toggleModal()
          }}
          classes={{button: styles.floatRight}}
          type="text"
          prefixIcon={
            <Icon
              name="import"
              type="primary"
              size="xxx_s"
              className={classname(styles.icon, styles.importIcon)}
            />
          }
        >
          {t('roleManagement.importPermission')}
        </Button>
      </Permission>

      <Modal
        isOpen={showModal}
        onClose={toggleModal}
        size="s"
        header={
          <>
            <div className={styles.modalHeader}>
              <div>{t('roleManagement.importPermission')}</div>
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
        actionButtons={[
          {
            onClick: selectedRole?.length > 0 ? importPermission : toggleModal,
            body: t('roleManagement.import'),
          },
        ]}
        classes={{
          modal: styles.modalImportRole,
          content: styles.modalContent,
        }}
      >
        <div>
          <Alert
            content={t('roleManagement.importRoleAlert')}
            hideClose
            textSize="m"
            type="info"
            className={styles.modalAlert}
          />
          <div className={styles.modalDesc}>
            {t('roleManagement.importRoleDesc')}
          </div>

          <Dropdown
            classes={{
              chipClass: '',
              chipsClass: '',
              dropdownClass: '',
              optionClass: '',
              wrapperClass: '',
            }}
            fieldName={'importRole'}
            isMultiSelect={true}
            withChips={true}
            options={allRoleList?.map((role) => ({
              label: role?.name,
              value: role?._id,
            }))}
            selectedOptions={selectedRole}
            title={t('roleManagement.importPermission')}
            onChange={({value}) => {
              setSelectedRole([...value])
            }}
          />
        </div>
      </Modal>
    </div>
  )
}
