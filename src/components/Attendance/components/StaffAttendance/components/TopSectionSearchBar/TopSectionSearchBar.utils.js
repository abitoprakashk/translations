import {Button, ImageIcon} from '@teachmint/common'
import {t} from 'i18next'
import styles from './TopSectionSearchBar.module.css'
import Permission from '../../../../../Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../../utils/permission.constants'
export const getButtonRender = (onClickAction, className, text, btnType) => {
  return (
    <Button
      size="big"
      onClick={onClickAction}
      className={className}
      type={btnType}
    >
      {t(text)}
    </Button>
  )
}

export const updateViewAttendanceButtonRender = ({
  staffAttendanceStatesManageData,
  staffAttendanceListData,
  handleAttendancePart,
  handleUpdateAttendancePart,
  handleViewAttendancePart,
}) => {
  const {isShowMarkAttendance, isEditMarkAttendance} =
    staffAttendanceStatesManageData
  if (
    !isShowMarkAttendance &&
    (!staffAttendanceListData ||
      Object.keys(staffAttendanceListData).length == 0)
  ) {
    return (
      <Permission
        permissionId={
          PERMISSION_CONSTANTS.staffAttendanceController_markAttendance_create
        }
      >
        <Button
          size="big"
          onClick={handleAttendancePart}
          className={styles.markAttendanceButton}
        >
          <ImageIcon
            name="attendanceWhite"
            size="m"
            className={styles.markAttendanceIcon}
          />
          {t('markAttendance')}
        </Button>
      </Permission>
    )
  } else if (
    !isEditMarkAttendance &&
    staffAttendanceListData &&
    Object.keys(staffAttendanceListData).length > 0
  ) {
    const getButtonView = getButtonRender(
      handleUpdateAttendancePart,
      styles.markAttendanceButton,
      'updateAttendance',
      'border'
    )
    return getButtonView
  } else {
    const getButtonView = getButtonRender(
      handleViewAttendancePart,
      styles.markAttendanceButton,
      'cancel',
      'border'
    )
    return getButtonView
  }
}

export const getAttendanceButtonRender = ({
  staffAttendanceStatesManageData,
  handleMarkAllAbsent,
  handleMarkAllPresent,
}) => {
  const {
    isShowMarkAttendance,
    isEditMarkAttendance,
    isAllPresentAbsentAttendance,
  } = staffAttendanceStatesManageData
  if (
    (isShowMarkAttendance || isEditMarkAttendance) &&
    !isAllPresentAbsentAttendance
  ) {
    const getButtonView = getButtonRender(
      handleMarkAllAbsent,
      styles.markAttendanceButton,
      'markAllAsAbsent',
      'border'
    )
    return getButtonView
  } else if (
    (isShowMarkAttendance || isEditMarkAttendance) &&
    isAllPresentAbsentAttendance
  ) {
    const getButtonView = getButtonRender(
      handleMarkAllPresent,
      styles.markAttendanceButton,
      'markAllAsPresent',
      'border'
    )
    return getButtonView
  }
}
