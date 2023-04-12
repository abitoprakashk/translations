import classNames from 'classnames'
import React from 'react'
import {Button, StickyFooter} from '@teachmint/common'
import styles from './Footer.module.css'
import {Trans, useTranslation} from 'react-i18next'
import Permission from '../../../../../components/Common/Permission/Permission'

const Footer = ({
  isDisabled,
  handleUpdateProfile,
  isAdd,
  userType,
  handleAssignClassTeacherCheckbox,
  nodeDetails,
  assignClassTeacherCheckbox,
  errorMessage = '',
  permissionId = null,
}) => {
  const {t} = useTranslation()
  const showAssignClassTeacherCheckbox =
    nodeDetails &&
    !nodeDetails.class_teacher?.phone_number &&
    userType === 'Teacher'

  return (
    <StickyFooter forSlider>
      <div className={styles.footer}>
        {showAssignClassTeacherCheckbox && (
          <div className={styles.assignCheck}>
            <input
              type="checkbox"
              checked={assignClassTeacherCheckbox}
              onChange={(e) =>
                handleAssignClassTeacherCheckbox(e.target.checked)
              }
              id="assign-teacher"
            />
            <label className="ml-1.5 cursor-pointer" htmlFor="assign-teacher">
              Assign as <b>Class Teacher</b> for
              {` ${nodeDetails?.classroomName}`}
            </label>
          </div>
        )}
        <div
          className={classNames(styles.footerContentWrapper, {
            [styles.fullWidth]: !showAssignClassTeacherCheckbox,
          })}
        >
          {errorMessage && (
            <div className={styles.footerErrorMessage}>{errorMessage}</div>
          )}
          {permissionId ? (
            <Permission permissionId={permissionId}>
              <Button
                className={styles.button}
                onClick={handleUpdateProfile}
                disabled={isDisabled}
              >
                {isAdd ? (
                  <Trans i18nKey="addUserType">Add {{userType}}</Trans>
                ) : (
                  t('updateDetails')
                )}
              </Button>
            </Permission>
          ) : (
            <Button
              className={styles.button}
              onClick={handleUpdateProfile}
              disabled={isDisabled}
            >
              {isAdd ? (
                <Trans i18nKey="addUserType">Add {{userType}}</Trans>
              ) : (
                t('updateDetails')
              )}
            </Button>
          )}
        </div>
      </div>
    </StickyFooter>
  )
}

export default Footer
