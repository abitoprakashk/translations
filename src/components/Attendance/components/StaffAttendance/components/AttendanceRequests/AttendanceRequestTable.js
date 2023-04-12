import {useRef} from 'react'
import styles from './AttendanceRequestTable.module.css'
import {
  Table,
  Para,
  PARA_CONSTANTS,
  Tooltip,
  TOOLTIP_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  Button,
  BUTTON_CONSTANTS,
  Badges,
  BADGES_CONSTANTS,
  Avatar,
  AVATAR_CONSTANTS,
} from '@teachmint/krayon'
import {t} from 'i18next'
import {DateTime} from 'luxon'
import Permission from '../../../../../Common/Permission/Permission'
import {
  ATTENDANCE_REQUEST_BADGE_MAP,
  ATTENDANCE_REQUEST_STATUS,
} from './AttendanceRequests'
import {PERMISSION_CONSTANTS} from '../../../../../../utils/permission.constants'
import {sortOnProperty} from '../../commonFunctions'

const TableColumn = ({label, tooltip, id, onClick}) => {
  return (
    <div className={styles.colWrapper}>
      <Para textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}>{label}</Para>
      {(id || tooltip) && (
        <span
          data-tip
          data-for={label}
          className={styles.iconStyle}
          onClick={() => onClick(id)}
        >
          <Icon
            name={id ? 'unfoldMore' : 'info'}
            type={ICON_CONSTANTS.TYPES.SECONDARY}
            size={ICON_CONSTANTS.SIZES.XX_SMALL}
            version={ICON_CONSTANTS.VERSION.OUTLINED}
          />
          {tooltip && (
            <Tooltip
              toolTipId={label}
              toolTipBody={<div className={styles.toolTipBody}>{tooltip}</div>}
              place={TOOLTIP_CONSTANTS.TOOLTIP_POSITIONS.TOP}
              effect={TOOLTIP_CONSTANTS.TOOLTIP_EFFECTS.SOLID}
            />
          )}
        </span>
      )}
    </div>
  )
}

export default function AttendanceRequestTable({
  requestList,
  setRequestList,
  onClickActionBtn,
}) {
  const ascSortOrder = useRef({
    date: false, //default descending order
  })
  const sortTableColumns = (id) => {
    ascSortOrder.current = {
      ...ascSortOrder.current,
      [id]: !ascSortOrder.current[id],
    }
    const sortedList = sortOnProperty(requestList, id, ascSortOrder.current[id])
    setRequestList([...sortedList])
  }

  const tableColumns = [
    {
      key: 'name',
      label: <TableColumn label={t('staffName')} />,
    },
    {
      key: 'date',
      label: (
        <TableColumn label={t('date')} id={'date'} onClick={sortTableColumns} />
      ),
    },
    {
      key: 'time',
      label: <TableColumn label={`${t('inTime')}/${t('outTime')}`} />,
    },
    {
      key: 'distance',
      label: (
        <TableColumn
          label={t('radius')}
          tooltip={t('attendanceRequestRadiusTooltip')}
          onClick={() => {}}
        />
      ),
    },
    {
      key: 'reason',
      label: <TableColumn label={t('reason')} />,
    },
    {
      key: 'action',
      label: <TableColumn label={t('action')} />,
    },
  ]

  const getActionItem = (staff) => {
    switch (staff.request_status) {
      case ATTENDANCE_REQUEST_STATUS.PENDING: {
        return (
          <div className={styles.buttonWrapper}>
            <Permission
              permissionId={
                PERMISSION_CONSTANTS.geofenceStaffAttendanceController_requests_approve_update
              }
            >
              <Button
                classes={{button: styles.buttonStyle}}
                category={BUTTON_CONSTANTS.CATEGORY.CONSTRUCTIVE}
                onClick={() => {
                  onClickActionBtn(staff, ATTENDANCE_REQUEST_STATUS.ACCEPTED)
                }}
              >
                <Icon
                  name={'check'}
                  type={ICON_CONSTANTS.TYPES.INVERTED}
                  size={ICON_CONSTANTS.SIZES.XXX_SMALL}
                />
              </Button>

              <Button
                classes={{button: styles.buttonStyle}}
                category={BUTTON_CONSTANTS.CATEGORY.DESTRUCTIVE}
                onClick={() => {
                  onClickActionBtn(staff, ATTENDANCE_REQUEST_STATUS.REJECTED)
                }}
              >
                <Icon
                  name={'close'}
                  type={ICON_CONSTANTS.TYPES.INVERTED}
                  size={ICON_CONSTANTS.SIZES.XXX_SMALL}
                />
              </Button>
            </Permission>
          </div>
        )
      }
      case ATTENDANCE_REQUEST_STATUS.ACCEPTED:
      case ATTENDANCE_REQUEST_STATUS.REJECTED: {
        return (
          <Badges
            showIcon={false}
            label={ATTENDANCE_REQUEST_BADGE_MAP[staff.request_status]?.label}
            type={ATTENDANCE_REQUEST_BADGE_MAP[staff.request_status]?.type}
            size={BADGES_CONSTANTS.SIZE.SMALL}
          />
        )
      }
    }
  }

  const getStaffAvatar = (staff) => {
    return (
      <div className={styles.staffAvatarWrapper}>
        <Avatar
          name={staff.name}
          imgSrc={staff.img_url}
          size={AVATAR_CONSTANTS.SIZE.MEDIUM}
        />
        <div className={styles.staffDetails}>
          <Para type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}> {staff.name}</Para>
          <Para
            type={PARA_CONSTANTS.TYPE.TEXT_SECONDARY}
            textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
          >
            {staff.phone_number}
          </Para>
        </div>
      </div>
    )
  }

  const getTableText = (text, styleClass) => {
    return (
      <Para
        type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
        textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}
        className={styleClass}
      >
        {text}
      </Para>
    )
  }

  const getInOrOutTime = (time) => {
    return time?.value ? (
      <div className={styles.timeInfo}>
        <Para type={PARA_CONSTANTS.TYPE.TEXT_SECONDARY}>{time?.label}</Para>
        <span>-</span>
        {getTableText(time?.value)}
      </div>
    ) : null
  }

  const getTableRows = (filteredList) => {
    return filteredList.map((staff) => {
      return {
        _id: staff?._id,
        iid: staff?.iid,
        name: getStaffAvatar(staff),
        date: getTableText(
          DateTime.fromSeconds(staff.date).toFormat('dd/MM/yyyy')
        ),
        time: getInOrOutTime(staff?.time),
        distance: getTableText(`${staff.distance} m`),
        reason: getTableText(staff.request_msg || '-', styles.requestMsg),
        action: getActionItem(staff),
      }
    })
  }

  return requestList.length > 0 ? (
    <Table
      cols={tableColumns}
      rows={getTableRows(requestList)}
      uniqueKey={'_id'}
    />
  ) : null
}
