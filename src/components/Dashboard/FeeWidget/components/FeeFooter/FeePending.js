import {
  AvatarGroup,
  AVATAR_GROUP_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  Para,
} from '@teachmint/krayon'
import classNames from 'classnames'
import React, {useMemo, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import {feeReminderRequestedAction} from '../../../../../pages/fee/redux/feeCollectionActions'
import {FEE_WIDGET_EVENTS} from '../../events'
import styles from './FeeFooter.module.css'
import ReminderModal from './ReminderModal'

function FeePending() {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const activeStudents = useSelector(
    (state) => state.instituteActiveStudentList
  )
  const eventManager = useSelector((state) => state.eventManager)
  const {data} = useSelector((state) => state.globalData.feeWidget)
  const [showReminderModal, setshowReminderModal] = useState(false)

  const avatarData = useMemo(() => {
    const pendingData = []
    activeStudents?.map((student) => {
      if (data?.pending?.includes(student._id)) {
        pendingData.push({
          id: student._id,
          name: student.full_name,
          imgSrc: student.img_url,
        })
      }
    })
    return pendingData
  }, [activeStudents, data])

  const onSendReminder = () => {
    dispatch(feeReminderRequestedAction(data?.pending))
    setshowReminderModal(false)
    eventManager.send_event(
      FEE_WIDGET_EVENTS.DASHBOARD_FEES_REPORTS_NOTIFY_CLICKED_TFI,
      {
        screen_name: 'dashboard',
        no_of_students: data?.pending?.length,
      }
    )
  }

  return (
    <div
      className={classNames(
        'flex justify-between items-center',
        styles.flexOne
      )}
    >
      <div
        onClick={() => {
          setshowReminderModal(true)
          eventManager.send_event(
            FEE_WIDGET_EVENTS.DASHBOARD_REPORTS_NOTIFY_STUDENT_CLICKED_TFI,
            {
              module: 'fee',
            }
          )
        }}
        className={classNames(
          'flex gap-1 flex-col cursor-pointer',
          styles.flexOne
        )}
      >
        <div
          className={classNames(
            'flex space-between items-center',
            styles.flexOne
          )}
        >
          <div className={classNames('ml-2', styles.flexOne)}>
            <AvatarGroup
              size={AVATAR_GROUP_CONSTANTS.SIZE.SMALL}
              data={avatarData}
              onClick={() => {}}
              onMoreClick={() => {}}
              className={classNames(styles.noWrap)}
            />
          </div>
          <div>
            <Icon
              size={ICON_CONSTANTS.SIZES.X_SMALL}
              type={ICON_CONSTANTS.TYPES.PRIMARY}
              className={classNames('cursor-pointer')}
              name="notificationsActive"
            />
          </div>
        </div>
        <Para
          className={classNames('mt-1', styles.footerFont12, styles.noWrap)}
        >
          {t('studentsFeePending')}
        </Para>
      </div>

      <ReminderModal
        onSendReminder={onSendReminder}
        isOpen={showReminderModal}
        onClose={() => setshowReminderModal(false)}
      />
    </div>
  )
}

export default FeePending
