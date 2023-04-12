import React, {useEffect} from 'react'
import {Input, Button} from '@teachmint/common'
import {Link, useHistory} from 'react-router-dom'
import {sidebarData} from '../../../../utils/SidebarItems'
import styles from './LeaveBalanceConfirm.module.css'
import {Trans, useTranslation} from 'react-i18next'
import useWeeklyOff from './hooks/useWeeklyOff'
import useLeaveBalanceForm from './hooks/useLeaveBalanceForm'
import {useDispatch, useSelector} from 'react-redux'
import LEAVE_MANAGEMENT_ROUTES from '../../LeaveManagement.routes'
import {
  getLeaveBalance,
  resetSessionLeaveResponse,
} from '../../redux/actions/leaveManagement.actions'
import {events} from '../../../../utils/EventsConstants'
import Permission from '../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'

function LeaveBalanceConfirm() {
  const {t} = useTranslation()
  const history = useHistory()
  const dispatch = useDispatch()

  const eventManager = useSelector((state) => state.eventManager)

  const {leaves, success, submitting, setInputValue, submitLeaves} =
    useLeaveBalanceForm()

  const [weeklyoff] = useWeeklyOff()

  useEffect(() => {
    // if leave balance updated successfully
    if (success) {
      // if need to show success modal, comment the line below
      dispatch(resetSessionLeaveResponse())
      dispatch(getLeaveBalance())
      eventManager.send_event(events.REDIRECTED_TO_MANAGE_LEAVE_TFI, {
        screen_name: 'leave_management_overview',
      })
      history.replace(LEAVE_MANAGEMENT_ROUTES.MANAGE_LEAVES)
    }
  }, [success])

  return (
    <div className={styles.wrapper}>
      <div className={styles.leavebalancecard}>
        <div className={styles.title}>{t('manageLeaveBalance')}</div>
        <span className={styles.subtext}>{t('setthelimitfortheleaves')}</span>
        <hr className={styles.hr} />
        <div>
          {leaves.map((leave, index) => (
            <div key={index} className={styles.row}>
              <div>
                <div className={styles.rowTitle}>{leave.title}</div>
                {leave.subtext}
              </div>
              <div>
                <Input
                  className={styles.input}
                  classes={{
                    wrapper: styles.noPadding,
                    input: styles.noBackground,
                  }}
                  type="number"
                  value={leave['value']}
                  onChange={({value}) => {
                    value = value.replace(/[^0-9]/g, '')
                    setInputValue(index, value)
                  }}
                  isRequired
                />
              </div>
            </div>
          ))}

          <div className={styles.weekOffWrapper}>
            <div className={styles.weekofftitle}>
              {weeklyoff ? (
                <Trans i18nKey="weeklyoffDynamic">
                  Weekly off is set as {{weeklyoff}}
                </Trans>
              ) : (
                t('weeklyOffisbydefaultsetasSunday')
              )}
            </div>
            <div className={styles.weekoffsubtext}>
              {`${t('tochangegoto')} `}
              <Link to={sidebarData.YEARLY_CALENDAR.route}>
                <span className={styles.hyperlink}>
                  <Permission
                    permissionId={
                      PERMISSION_CONSTANTS.academicPlannerController_getEvents_read
                    }
                  >
                    {t('yearlyCalender')}
                  </Permission>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.info}>
        {t('byclickingonConfirmdefaultweeklyoff')}
      </div>
      <div className={styles.btnWrapper}>
        <Permission
          permissionId={
            PERMISSION_CONSTANTS.adminLeaveController_setSessionBalance_update
          }
        >
          <Button
            onClick={submitLeaves}
            size="medium"
            disabled={
              submitting ||
              leaves.some(
                ({value}) => value === '' || value < 0 || value >= 100
              )
            }
          >
            {t('confirmLeaveBalance')}
          </Button>
        </Permission>
      </div>
    </div>
  )
}

export default LeaveBalanceConfirm
