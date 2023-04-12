import {Button, Icon, Tooltip} from '@teachmint/common'
import classNames from 'classnames'
import {
  leaveSlotTypeMap,
  LEAVE_BASE_TYPE,
  LEAVE_STATUS,
  LEAVE_TYPE,
} from '../../../LeaveManagement.constant'
import defaultUserImage from '../../../../../assets/images/icons/user-profile.svg'
import styles from './LeaveTable.module.css'
import {DateTime} from 'luxon'
import {Trans} from 'react-i18next'
import {t} from 'i18next'
import Permission from '../../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../utils/permission.constants'
import {useSelector} from 'react-redux'

export const ROW_ACTIONS = {
  CANCEL: 'CANCEL',
  APPROVE: 'APPROVE',
  REJECT: 'REJECT',
  EDIT: 'EDIT',
}

const EmployeeDetails = ({data, overflowLen = 0, tooltipScope = ''}) => {
  return (
    <div className={classNames(styles.flex, styles.wfull)}>
      <img
        className={styles.img}
        src={data.img_url || defaultUserImage}
        alt=""
      />
      <div
        data-overflow={Boolean(overflowLen)}
        className={styles.empDetailsOverflow}
      >
        <a data-tip data-for={`${data._id}name_${tooltipScope}`}>
          <div
            className={classNames(styles.leavedate, styles.tableCellOverflow)}
          >
            {data.name}
          </div>
          {/* {data.name?.length > overflowLen ? (
            <Tooltip
              className={styles.tooltip}
              multiline
              toolTipId={`${data._id}name_${tooltipScope}`}
              type="info"
              place="right"
            >
              <span>{data.name}</span>
            </Tooltip>
          ) : null} */}
        </a>
        <div className={styles.staffType}>{data.rollName}</div>
      </div>
    </div>
  )
}

const LeaveDate = ({data}) => {
  return (
    <div className={classNames(styles.flex, styles.wfull)}>
      <div>
        <div className={styles.leavedate}>{data.leaveDates?.from}</div>
        {data?.from_slot && (
          <div className={styles.staffType}>
            {leaveSlotTypeMap[data.from_slot].label}
          </div>
        )}
      </div>
      {data.leaveDates?.to && (
        <>
          <div className={styles.dash} />
          <div>
            <div className={styles.leavedate}>{data.leaveDates?.to}</div>
            {data?.to_slot && (
              <div className={styles.staffType}>
                {leaveSlotTypeMap[data.to_slot].label}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

const LeaveTypes = ({data, tooltipScope = ''}) => {
  return (
    <div className={classNames(styles.flex, styles.wfull)}>
      <div>
        <div className={styles.leavedate}>
          <Trans key="leaveTypeDynamic">
            {{leave: `${LEAVE_TYPE[data.type]}`}} Leave
          </Trans>
          {tooltipScope && data.reason ? (
            <>
              <a
                className={styles.reasonicon}
                data-tip
                data-for={`${data._id}_id_${tooltipScope}`}
              >
                <Icon size="xxs" name="chat" color="warning" type="outlined" />
                <Tooltip
                  className={styles.tooltip}
                  multiline
                  toolTipId={`${data._id}_id_${tooltipScope}`}
                  type="warning"
                  place="right"
                >
                  <span>{data.reason}</span>
                </Tooltip>
              </a>
            </>
          ) : null}
        </div>
        {data.status !== LEAVE_BASE_TYPE.CREATED ? (
          <div className={styles.staffType}>
            {data.edited_at ? (
              <Trans i18nKey={'updatedOn'}>
                Updated on {{updatedOn: data.updatedOn}}
              </Trans>
            ) : (
              <Trans i18nKey={'requestedon'}>
                Requested on {{requestedOn: data.requestedOn}}
              </Trans>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}

const TotalLeaveTaken = ({data, showStaffmodal}) => {
  return (
    <div className={classNames(styles.flex, styles.wfull, styles.center)}>
      <div
        onClick={() => {
          showStaffmodal(data)
        }}
        className={styles.link}
      >
        {t('viewDetails')}
      </div>
    </div>
  )
}

const LeaveReason = ({data, tooltipScope = ''}) => {
  return (
    <div className={classNames(styles.flex, styles.wfull)}>
      {data.reason ? (
        <span
          className={styles.reasonicon}
          data-tip
          data-for={`${data._id}_id_${tooltipScope}`}
        >
          <Icon size="xxs" name="chat" color="warning" type="outlined" />
          <Tooltip
            className={styles.tooltip}
            multiline
            toolTipId={`${data._id}_id_${tooltipScope}`}
            type="warning"
            place="right"
          >
            <span>{data.reason}</span>
          </Tooltip>
        </span>
      ) : null}
      <div className={styles.overflowText}>
        <span>{data.reason}</span>
      </div>
    </div>
  )
}

const LeaveDays = ({data}) => {
  return (
    <div className={classNames(styles.flex, styles.wfull)}>
      <div>
        <div className={styles.leavedate}>{data.leaveDates?.count}</div>
      </div>
    </div>
  )
}

export const ThreeDots = ({data, onAction, canCancel, canEdit, className}) => {
  const currentUserIid = useSelector(
    (state) => state.currentAdminInfo?.imember_id
  )
  const showCancel =
    typeof canCancel === 'function' ? canCancel(data) : canCancel
  const showEdit = typeof canEdit === 'function' ? canEdit(data) : canEdit

  if (!showCancel && !showEdit) return null

  return (
    <div className={classNames(styles.flex, styles.wfull, className)}>
      <div className={styles.kebab}>
        <Icon size="xs" name="ellipsisVertical" color="basic" type="outlined" />
        <div className={styles.kebabContent}>
          {showEdit && (
            <Permission
              permissionId={
                data.iid == currentUserIid
                  ? PERMISSION_CONSTANTS.leaveController_updateRoute_update
                  : PERMISSION_CONSTANTS.adminLeaveController_updateStatus_update
              }
            >
              <div
                onClick={() => {
                  onAction(ROW_ACTIONS.EDIT, data)
                }}
                className={classNames(styles.kebabItem)}
              >
                {t('edit')}
              </div>
            </Permission>
          )}
          {showCancel && (
            <Permission
              permissionId={
                data.iid == currentUserIid
                  ? PERMISSION_CONSTANTS.leaveController_updateRoute_update
                  : PERMISSION_CONSTANTS.adminLeaveController_updateStatus_update
              }
            >
              <div
                onClick={() => {
                  onAction(ROW_ACTIONS.CANCEL, data)
                }}
                className={classNames(styles.kebabItem, styles.cancel)}
              >
                {t('cancel')}
              </div>
            </Permission>
          )}
        </div>
      </div>
    </div>
  )
}

const LeaveStatus = ({data}) => (
  <div className={styles.flex}>
    <div>
      <div
        className={classNames(
          styles.leavedate,
          styles.overflowText,
          styles[data.status?.toLowerCase()]
        )}
      >
        {data.status === LEAVE_BASE_TYPE.REQUESTED ? (
          <>{t('pendingForApproval')}</>
        ) : (
          <>
            {data.edited_at ? LEAVE_STATUS.UPDATED : LEAVE_STATUS[data.status]}{' '}
            on {DateTime.fromMillis(data.status_date).toFormat('dd LLL yyyy')}
          </>
        )}
      </div>
      {data.status === LEAVE_BASE_TYPE.REQUESTED ? (
        <div className={classNames(styles.staffType, styles.overflowText)}>
          {t('noActiontaken')}
        </div>
      ) : (
        <div className={classNames(styles.staffType, styles.overflowText)}>
          By {data.status_set_by_name}
        </div>
      )}
    </div>
  </div>
)

export const getPendingTableRow = ({
  rowData,
  onAction,
  showStaffmodal,
  canCancel,
  canEdit,
}) => {
  return {
    // id: rowData.studentId,
    empDetails: (
      <EmployeeDetails data={rowData} overflowLen={15} tooltipScope="pending" />
    ),
    leaveDates: <LeaveDate data={rowData} />,
    leaveType: <LeaveTypes data={rowData} />,
    manageLeaveType: (
      <LeaveTypes data={rowData} tooltipScope="pendingleavetype" />
    ),
    totalLeavesTaken: (
      <TotalLeaveTaken data={rowData} showStaffmodal={showStaffmodal} />
    ),
    reason: <LeaveReason data={rowData} tooltipScope="pendingreason" />,
    leaveDays: <LeaveDays data={rowData} />,
    leaveStatus: <LeaveStatus data={rowData} />,
    threeDots: (
      <ThreeDots
        data={rowData}
        onAction={onAction}
        canCancel={canCancel}
        canEdit={canEdit}
      />
    ),
    action: (
      <div className={styles.btnWrapper}>
        <Permission
          permissionId={
            PERMISSION_CONSTANTS.adminLeaveController_updateStatus_update
          }
        >
          <Button
            onClick={() => {
              onAction(ROW_ACTIONS.REJECT, rowData)
            }}
            type="secondary"
            className={styles.reject}
          >
            {t('reject')}
          </Button>
        </Permission>
        <div className={styles.pipe} />
        <Permission
          permissionId={
            PERMISSION_CONSTANTS.adminLeaveController_updateStatus_update
          }
        >
          <Button
            onClick={() => {
              onAction(ROW_ACTIONS.APPROVE, rowData)
            }}
            type="secondary"
            className={styles.approve}
          >
            {t('approve')}
          </Button>
        </Permission>
      </div>
    ),
  }
}

export const getPastTableRow = ({
  rowData,
  showStaffmodal,
  onAction,
  canCancel,
  canEdit,
}) => {
  return {
    // id: rowData.studentId,
    empDetails: (
      <EmployeeDetails data={rowData} overflowLen={18} tooltipScope="history" />
    ),
    leaveDates: <LeaveDate data={rowData} />,
    leaveType: <LeaveTypes data={rowData} />,
    manageLeaveType: <LeaveTypes data={rowData} tooltipScope="pastleavetype" />,
    totalLeavesTaken: (
      <TotalLeaveTaken data={rowData} showStaffmodal={showStaffmodal} />
    ),
    reason: <LeaveReason data={rowData} tooltipScope="pastreason" />,
    leaveDays: <LeaveDays data={rowData} />,
    threeDots: (
      <ThreeDots
        data={rowData}
        onAction={onAction}
        canCancel={canCancel}
        canEdit={canEdit}
      />
    ),
    leaveStatus: <LeaveStatus data={rowData} />,
  }
}

export const getStaffHistoryTableRow = ({rowData}) => {
  return {
    leaveDates: <LeaveDate data={rowData} />,
    leaveType: <LeaveTypes data={rowData} tooltipScope="staffHistory" />,
    leaveStatus: <LeaveStatus data={rowData} />,
    leaveDays: <LeaveDays data={rowData} />,
  }
}

const defaultColStyles = {
  display: 'flex',
  // overflow: 'hidden',
  padding: '15px 15px',
  alignItems: 'center',
  flex: 1,
  // maxWidth: 'calc(100%/4)',
}

const colStyles = {
  default: defaultColStyles,
  leaveDates: {
    ...defaultColStyles,
    minWidth: '250px',
    maxWidth: 'auto',
  },
  leaveDays: {
    ...defaultColStyles,
    maxWidth: '150px',
    minWidth: '100px',
  },
  leaveType: {
    ...defaultColStyles,
    minWidth: '170px',
    overflow: 'initial',
  },
  manageLeaveType: {
    ...defaultColStyles,
    minWidth: '250px',
    overflow: 'initial',
  },
  threeDots: {
    ...defaultColStyles,
    overflow: 'unset',
    flex: 'inital',
    minWidth: '50px',
  },
  reason: {
    ...defaultColStyles,
    maxWidth: '350px',
    minWidth: '250px',
  },
  leaveStatus: {
    ...defaultColStyles,
    minWidth: '200px',
  },
  totalLeavesTaken: {
    ...defaultColStyles,
    minWidth: '120px',
    maxWidth: '150px',
  },
  empDetails: {
    ...defaultColStyles,
    minWidth: '200px',
    maxWidth: '320px',
  },
  action: {
    ...defaultColStyles,
    justifyContent: 'center',
    minWidth: '200px',
    maxWidth: '250px',
  },
}

export const getLeavesTableColumnStyle = (cols) => {
  return cols.map(({key}) => {
    return colStyles[key] || colStyles.default
  })
}
