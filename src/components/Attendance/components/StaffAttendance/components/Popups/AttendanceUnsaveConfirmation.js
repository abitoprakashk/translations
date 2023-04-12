import {
  BUTTON_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  Para,
  Popup,
} from '@teachmint/krayon'
import React from 'react'
import {useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {IS_MOBILE} from '../../../../../../constants'
import {PERMISSION_CONSTANTS} from '../../../../../../utils/permission.constants'
import {checkPermission} from '../../../../../../utils/Permssions'
import styles from './AttendanceUnsaveConfirmation.module.css'

const AttendanceUnsaveConfirmation = ({isOpen, onSave, onExit, onClose}) => {
  const {t} = useTranslation()
  const userRolePermission = useSelector(
    (state) => state.globalData?.userRolePermission
  )
  return (
    <Popup
      isOpen={isOpen}
      actionButtons={[
        {
          body: t('exitWithoutSaving'),
          onClick: onExit,
          type: 'outline',
          width: IS_MOBILE
            ? BUTTON_CONSTANTS.WIDTH.FULL
            : BUTTON_CONSTANTS.WIDTH.FIT,
        },
        {
          body: t('save'),
          onClick: onSave,
          category: BUTTON_CONSTANTS.CATEGORY.CONSTRUCTIVE,
          width: IS_MOBILE
            ? BUTTON_CONSTANTS.WIDTH.FULL
            : BUTTON_CONSTANTS.WIDTH.FIT,
          isDisabled: !checkPermission(
            userRolePermission,
            PERMISSION_CONSTANTS.staffAttendanceController_markAttendance_create
          ),
        },
      ]}
      header={t('youHaveUnsavedChanges')}
      headerIcon={
        <Icon
          name="error"
          size={ICON_CONSTANTS.SIZES.X_SMALL}
          type={ICON_CONSTANTS.TYPES.WARNING}
        />
      }
      onClose={onClose}
    >
      <Para className={styles.margin}>{t('unsavedAttendanceWarning')}</Para>
    </Popup>
  )
}

export default AttendanceUnsaveConfirmation
