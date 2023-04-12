import styles from './AttendanceRequestCard.module.css'
import {
  Avatar,
  Badges,
  BADGES_CONSTANTS,
  Divider,
  Para,
  PARA_CONSTANTS,
  PlainCard,
  Button,
  BUTTON_CONSTANTS,
} from '@teachmint/krayon'
import {t} from 'i18next'
import {
  ATTENDANCE_REQUEST_STATUS,
  ATTENDANCE_REQUEST_BADGE_MAP,
} from './AttendanceRequests'
import Permission from '../../../../../Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../../utils/permission.constants'
import {DateTime} from 'luxon'

export default function AttendanceRequestCard({staff, onClickActionBtn}) {
  const getInOrOutTime = (time) => {
    return time?.value ? (
      <div className={styles.section}>
        <Para
          textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
          className={styles.label}
        >
          {time?.label}
        </Para>
        <Para
          textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
          type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
        >
          {time?.value}
        </Para>
      </div>
    ) : null
  }

  return (
    <PlainCard className={styles.cardWrapper}>
      <div className={styles.cardHeader}>
        <div className={styles.staffDetails}>
          <Avatar
            name={staff?.name}
            imgSrc={staff?.img_url}
            classes={{wrapper: styles.avatarWrapper}}
          />
          <div>
            <Para
              textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}
              type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
            >
              {staff?.name}
            </Para>
            <Para
              textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
              className={styles.label}
            >
              {staff?.phone_number}
            </Para>
          </div>
        </div>
        <Badges
          size={BADGES_CONSTANTS.SIZE.SMALL}
          label={ATTENDANCE_REQUEST_BADGE_MAP[staff?.request_status].label}
          showIcon={false}
          type={ATTENDANCE_REQUEST_BADGE_MAP[staff?.request_status].type}
        />
      </div>
      <Divider spacing={12} />
      <PlainCard className={styles.cardMainContent}>
        <div className={styles.timing}>
          <div className={styles.section}>
            <Para
              textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
              className={styles.label}
            >
              {t('date')}
            </Para>
            <Para
              textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
              type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
            >
              {DateTime.fromSeconds(staff.date).toFormat('dd/MM/yyyy')}
            </Para>
          </div>
          <Divider isVertical spacing={0} />
          {getInOrOutTime(staff?.time)}
          <Divider isVertical spacing={0} />
          <div className={styles.section}>
            <Para
              textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
              className={styles.label}
            >
              {t('radius')}
            </Para>
            <Para
              textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
              type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
            >
              {`${staff?.distance} m`}
            </Para>
          </div>
        </div>
        <Divider spacing={0} />
        <div className={styles.section}>
          <Para
            textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
            className={styles.label}
          >
            {t('reason')}
          </Para>
          <Para
            textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
            type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
          >
            {staff?.request_msg || '-'}
          </Para>
        </div>
      </PlainCard>
      {staff?.request_status === ATTENDANCE_REQUEST_STATUS.PENDING && (
        <div className={styles.buttonWrapper}>
          <Permission
            permissionId={
              PERMISSION_CONSTANTS.geofenceStaffAttendanceController_requests_approve_update
            }
          >
            <Button
              type={BUTTON_CONSTANTS.TYPE.OUTLINE}
              category={BUTTON_CONSTANTS.CATEGORY.DESTRUCTIVE}
              size={BUTTON_CONSTANTS.SIZE.SMALL}
              classes={{button: styles.button}}
              onClick={() =>
                onClickActionBtn(staff, ATTENDANCE_REQUEST_STATUS.REJECTED)
              }
            >
              {t('reject')}
            </Button>
            <Button
              type={BUTTON_CONSTANTS.TYPE.OUTLINE}
              category={BUTTON_CONSTANTS.CATEGORY.CONSTRUCTIVE}
              size={BUTTON_CONSTANTS.SIZE.SMALL}
              classes={{button: styles.button}}
              onClick={() =>
                onClickActionBtn(staff, ATTENDANCE_REQUEST_STATUS.ACCEPTED)
              }
            >
              {t('accept')}
            </Button>
          </Permission>
        </div>
      )}
    </PlainCard>
  )
}
