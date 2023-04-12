import {
  Divider,
  Para,
  PARA_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  Heading,
  HEADING_CONSTANTS,
  PlainCard,
  Badges,
  BADGES_CONSTANTS,
  Button,
  BUTTON_CONSTANTS,
} from '@teachmint/krayon'
import {useSelector, useDispatch} from 'react-redux'
import {t} from 'i18next'
import styles from './ShiftDetails.module.css'
import {useEffect} from 'react'
import globalActions from '../../../../../../redux/actions/global.actions'
import {useHistory} from 'react-router-dom'
import {STAFF_ATTENDANCE_ROUTES} from '../../StaffAttendanceConstants'
import {ATTENDANCE_TAKEN_AT} from '../../../../../../pages/HRMSConfiguration/AttendanceShifts/constants/shift.constants'

const checkinCheckoutInstructions = [
  t('checkinCheckoutInstruction1'),
  t('checkinCheckoutInstruction2'),
  t('checkinCheckoutInstruction3'),
]

const checkinInstructions = [
  t('checkinInstruction1'),
  t('checkinInstruction2'),
  t('checkinInstruction3'),
]

export default function ShiftDetails() {
  const history = useHistory()
  const dispatch = useDispatch()
  const shiftInfo = useSelector((state) => state.globalData?.shiftInfo?.data)
  const {currentAdminInfo} = useSelector((state) => state)

  useEffect(() => {
    dispatch(
      globalActions.fetchShiftInfo.request({
        iid: currentAdminInfo.imember_id,
      })
    )
  }, [currentAdminInfo])

  const goToMyAttendancePage = () => {
    history.push(STAFF_ATTENDANCE_ROUTES.MY_ATTENDANCE)
  }

  return (
    <div>
      <div className={styles.headingWrapper}>
        <div className={styles.headingSection} onClick={goToMyAttendancePage}>
          <Icon name="backArrow" size={ICON_CONSTANTS.SIZES.XX_SMALL} />
          <Heading
            type={HEADING_CONSTANTS.TYPE.TEXT_PRIMARY}
            textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}
          >
            {t('shiftDetails')}
          </Heading>
        </div>
      </div>
      <Divider spacing={16} />
      <PlainCard className={styles.shiftNameCard}>
        <Para
          type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
          className={styles.shiftNameHeading}
        >
          {t('shiftAllotted')}
        </Para>
        <Badges
          label={shiftInfo?.name}
          showIcon={false}
          className={styles.badge}
          size={BADGES_CONSTANTS.SIZE.SMALL}
        />
      </PlainCard>
      <PlainCard className={styles.shiftInfoCard}>
        <div className={styles.row}>
          <div className={styles.cell}>
            <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
              {t('shiftStartsAt')}
            </Para>
            <Para type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}>
              {shiftInfo?.setting?.intime}
            </Para>
          </div>
          <Divider spacing={0} isVertical />
          <div className={styles.cell}>
            <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
              {t('shiftEndsAt')}
            </Para>
            <Para type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}>
              {shiftInfo?.setting?.outtime || '-'}
            </Para>
          </div>
        </div>
        <Divider spacing={0} />
        {shiftInfo?.setting?.is_grace_allowed && (
          <>
            <div className={styles.row}>
              <div className={styles.cell}>
                <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
                  {t('graceTime')}
                </Para>
                <Para type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}>{`${
                  shiftInfo?.setting?.grace?.time
                } ${t('mins')}`}</Para>
              </div>
              <Divider spacing={0} isVertical />
              <div className={styles.cell}>
                <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
                  {t('graceAllowed')}
                </Para>
                <Para type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}>{`${
                  shiftInfo?.setting?.grace?.frequency
                } ${t('times')}/${t('allowed')}`}</Para>
              </div>
            </div>
            <Divider spacing={0} />
          </>
        )}
        <div className={styles.cell}>
          <Para
            type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
            className={styles.heading}
          >
            {t('shiftInfoInstructionHeading')}
          </Para>
          {[
            ...(shiftInfo?.setting?.attendance_taken_at ===
            ATTENDANCE_TAKEN_AT.CHECKIN_CHECKOUT
              ? checkinCheckoutInstructions
              : checkinInstructions),
          ].map((text, index) => {
            return (
              <div key={index} className={styles.instruction}>
                <Icon
                  name={'arrowForward'}
                  size={ICON_CONSTANTS.SIZES.XXX_SMALL}
                  type={ICON_CONSTANTS.TYPES.SECONDARY}
                />
                <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>{text}</Para>
              </div>
            )
          })}
          <div className={styles.doubtsSection}>
            <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
              {`${t('shiftInfoHaveDoubts')}? ${t('contactYourAdmin')}`}
            </Para>
          </div>
        </div>
      </PlainCard>
      <div className={styles.footer}>
        <Button
          type={BUTTON_CONSTANTS.TYPE.OUTLINE}
          category={BUTTON_CONSTANTS.CATEGORY.PRIMARY}
          width={BUTTON_CONSTANTS.WIDTH.FULL}
          prefixIcon={'backArrow'}
          onClick={goToMyAttendancePage}
        >
          {t('backToMyAttendance')}
        </Button>
      </div>
    </div>
  )
}
