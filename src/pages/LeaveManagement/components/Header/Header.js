import React, {useEffect, useState} from 'react'
import {Button, Icon} from '@teachmint/common'
import classNames from 'classnames'
import {createPortal} from 'react-dom'
import {useDispatch, useSelector} from 'react-redux'
import RoleFilter from '../../../../components/RoleFilter'
import {events} from '../../../../utils/EventsConstants'
import {IS_MOBILE} from '../../../../constants'
import {showLeaveBalanceUpdateForm} from '../../redux/actions/leaveManagement.actions'
import Permission from '../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'
import {
  CreateLeaveButton,
  DownloadReportButton,
  RequestLeaveButton,
} from '../LeaveButtons'
import styles from './Header.module.css'

function Header({text, showEditLimit = false, myLeave = false, className}) {
  const dispatch = useDispatch()
  const eventManager = useSelector((state) => state.eventManager)
  const [portalElm, setPortalElm] = useState()

  useEffect(() => {
    setTimeout(() => {
      // this element can lie below this element & may take time during render
      // so using 200ms as a buffer
      setPortalElm(document.getElementById('leaveManagementButtons'))
    }, 200)

    return () => setPortalElm(null)
  }, [myLeave])

  return (
    <div className={classNames(styles.headerwrapper, className)}>
      <div className={styles.text}>{text}</div>
      {(IS_MOBILE || myLeave) && <div id="leaveManagementButtons" />}

      {portalElm &&
        createPortal(
          <div className={styles.btnWrapper}>
            {!myLeave && !IS_MOBILE && (
              <RoleFilter>
                <DownloadReportButton />
              </RoleFilter>
            )}
            {myLeave ? (
              <RequestLeaveButton />
            ) : (
              <RoleFilter>
                <CreateLeaveButton />
              </RoleFilter>
            )}

            {showEditLimit && (
              <RoleFilter>
                <Permission
                  permissionId={
                    PERMISSION_CONSTANTS.adminLeaveController_setSessionBalance_update
                  }
                >
                  <Button
                    onClick={() => {
                      dispatch(showLeaveBalanceUpdateForm())
                      eventManager.send_event(
                        events.MANAGE_LEAVE_BALANCE_CLICKED_TFI
                      )
                    }}
                    className={styles.iconBtn}
                    size="medium"
                    type="border"
                  >
                    <Icon
                      name="settingsGear"
                      size="xs"
                      type="outlined"
                      color="primary"
                    />
                  </Button>
                </Permission>
              </RoleFilter>
            )}
          </div>,
          portalElm
        )}
    </div>
  )
}

export default Header
