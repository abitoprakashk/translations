import {Divider, Icon, ICON_CONSTANTS} from '@teachmint/krayon'
import React from 'react'
import Permission from '../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'
import {PREVIEW, PREVIEW_SAVE} from '../../CustomId.constants'
import styles from './StudentStaffTable.module.css'

const ActionButtons = ({
  user,
  previewTypeRef,
  setSelectedUserId,
  getPreviewUrl,
}) => {
  return (
    <div className={styles.actionButtons}>
      <Permission
        permissionId={PERMISSION_CONSTANTS.ipsController_updateUsers_update}
      >
        <span onClick={() => setSelectedUserId({...user})}>
          <Icon
            name="edit2"
            size={ICON_CONSTANTS.SIZES.XX_SMALL}
            type={ICON_CONSTANTS.TYPES.PRIMARY}
          />
        </span>
      </Permission>
      <Divider isVertical spacing={15} />
      <span
        onClick={() => {
          previewTypeRef.current = PREVIEW
          getPreviewUrl(user._id)
        }}
      >
        <Icon
          name="eye1"
          size={ICON_CONSTANTS.SIZES.XX_SMALL}
          type={ICON_CONSTANTS.TYPES.PRIMARY}
        />
      </span>
      <Divider isVertical spacing={15} />
      <span
        onClick={() => {
          previewTypeRef.current = PREVIEW_SAVE
          getPreviewUrl(user._id)
        }}
      >
        <Icon
          name="download"
          size={ICON_CONSTANTS.SIZES.XX_SMALL}
          type={ICON_CONSTANTS.TYPES.PRIMARY}
        />
      </span>
    </div>
  )
}

export default ActionButtons
