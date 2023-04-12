import React from 'react'
import {checkSubscriptionType} from '../../../../utils/Helpers'
import {
  Button,
  EmptyState,
  PARA_CONSTANTS,
  Para,
  BUTTON_CONSTANTS,
} from '@teachmint/krayon'
import classNames from 'classnames'
import {useDispatch, useSelector} from 'react-redux'
import {useHistory} from 'react-router-dom'
import globalActions from '../../../../redux/actions/global.actions'
import {getLeaveWidget} from '../redux/leaveWidget.selector'
import styles from '../LeaveWidget.module.css'
import Shimmer from '../../../Common/ShimmerHoc/Shimmer'
import {useTranslation} from 'react-i18next'
import {PRICING} from '../../../../utils/SidebarItems'
import {events} from '../../../../utils/EventsConstants'

const LeaveWidgetBody = ({
  getStaffOnLeaveComponent,
  setDisplayModal,
  setModalData,
  setModalHeader,
  getStaffUpcomingComponent,
}) => {
  const instituteInfo = useSelector((state) => state?.instituteInfo)
  const eventManager = useSelector((state) => state.eventManager)
  const dispatch = useDispatch()
  const leaveWidgetData = getLeaveWidget()
  const history = useHistory()

  const {t} = useTranslation()
  if (checkSubscriptionType(instituteInfo)) {
    if (leaveWidgetData?.isLoading) {
      return (
        <>
          <div className={classNames(styles.bodyChild, styles.onLeave)}>
            <div>
              <Shimmer width="100%" height="100%">
                <rect x="0" y="16" rx="4" ry="4" width="50%" height="15" />
                <rect x="0" y="55" rx="4" ry="4" width="70%" height="15" />
                <rect x="0" y="77" rx="4" ry="4" width="80%" height="15" />
                <rect x="0" y="106" rx="4" ry="4" width="70%" height="15" />
                <rect x="0" y="128" rx="4" ry="4" width="80%" height="15" />
              </Shimmer>
            </div>
          </div>
          <div className={styles.bodyChild}>
            <div>
              <Shimmer width="100%" height="100%">
                <rect x="0" y="16" rx="4" ry="4" width="50%" height="15" />
                <rect x="0" y="55" rx="4" ry="4" width="70%" height="15" />
                <rect x="0" y="77" rx="4" ry="4" width="80%" height="15" />
                <rect x="0" y="106" rx="4" ry="4" width="70%" height="15" />
                <rect x="0" y="128" rx="4" ry="4" width="80%" height="15" />
              </Shimmer>
            </div>
          </div>
        </>
      )
    } else {
      if (leaveWidgetData?.error !== null) {
        return (
          <>
            <EmptyState
              iconName="error"
              content={t('unableToLoadData')}
              button={{
                size: BUTTON_CONSTANTS.SIZE.SMALL,
                version: BUTTON_CONSTANTS.ICON_VERSION.FILLED,
                children: t('tryAgain'),
                type: BUTTON_CONSTANTS.TYPE.TEXT,
                prefixIcon: 'refresh',
                onClick: () => {
                  dispatch(globalActions.leaveWidgetData.request())
                },
              }}
              classes={styles}
            />
          </>
        )
      } else {
        if (leaveWidgetData?.data?.leave_setup === true) {
          return (
            <>
              <div className={classNames(styles.bodyChild, styles.onLeave)}>
                <Para
                  type={PARA_CONSTANTS.TYPE.TEXT_SECONDARY}
                  weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
                  textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}
                >
                  {t('today')} ({leaveWidgetData?.data?.today?.length})
                </Para>
                <>
                  {leaveWidgetData?.data?.today?.length == 0 ? (
                    <div className={styles.emptyBody}>
                      <Para
                        type={PARA_CONSTANTS.TYPE.TEXT_SECONDARY}
                        weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
                        textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}
                      >
                        {t('everyoneWorkingToday')}
                      </Para>
                    </div>
                  ) : (
                    <div className={styles.fillBody}>
                      <div className={styles.bodyContainer}>
                        {getStaffOnLeaveComponent(
                          leaveWidgetData?.data?.today?.[0]
                        )}
                        {leaveWidgetData?.data?.today?.length > 1 ? (
                          getStaffOnLeaveComponent(
                            leaveWidgetData?.data?.today?.[1]
                          )
                        ) : (
                          <></>
                        )}
                      </div>
                      {leaveWidgetData?.data?.today?.length > 2 ? (
                        <Button
                          type={BUTTON_CONSTANTS.TYPE.TEXT}
                          children={t('numItemsMore', {
                            count: leaveWidgetData?.data?.today?.length - 2,
                          })}
                          onClick={() => {
                            setDisplayModal(true)
                            setModalData(leaveWidgetData?.data?.today)
                            setModalHeader(t('staffOnLeaveToday'))
                          }}
                          classes={styles}
                        />
                      ) : null}
                    </div>
                  )}
                </>
              </div>
              <div className={styles.bodyChild}>
                <Para
                  type={PARA_CONSTANTS.TYPE.TEXT_SECONDARY}
                  weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
                  textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}
                >
                  {t('upcomingLabel')} (
                  {leaveWidgetData?.data?.upcoming?.length})
                </Para>
                <>
                  {leaveWidgetData?.data?.upcoming?.length == 0 ? (
                    <div className={styles.emptyBody}>
                      <Para
                        type={PARA_CONSTANTS.TYPE.TEXT_SECONDARY}
                        weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
                        textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}
                      >
                        {t('noUpcomingLeaves')}
                      </Para>
                    </div>
                  ) : (
                    <div className={styles.fillBody}>
                      <div className={styles.bodyContainer}>
                        {getStaffUpcomingComponent(
                          leaveWidgetData?.data?.upcoming?.[0]
                        )}
                        {leaveWidgetData?.data?.upcoming?.length > 1 ? (
                          getStaffUpcomingComponent(
                            leaveWidgetData?.data?.upcoming?.[1]
                          )
                        ) : (
                          <></>
                        )}
                      </div>
                      {leaveWidgetData?.data?.upcoming?.length > 2 ? (
                        <Button
                          type={BUTTON_CONSTANTS.TYPE.TEXT}
                          children={t('numItemsMore', {
                            count: leaveWidgetData?.data?.upcoming?.length - 2,
                          })}
                          onClick={() => {
                            setDisplayModal(true)
                            setModalData(leaveWidgetData?.data?.upcoming)
                            setModalHeader(t('upcomingLeaves'))
                          }}
                          classes={styles}
                        />
                      ) : null}
                    </div>
                  )}
                </>
              </div>
            </>
          )
        } else {
          return (
            <>
              <EmptyState
                iconName="eventBusy"
                content={t('leaveNotSetup')}
                button={{
                  size: BUTTON_CONSTANTS.SIZE.SMALL,
                  version: BUTTON_CONSTANTS.ICON_VERSION.FILLED,
                  children: t('Setup Now'),
                  type: BUTTON_CONSTANTS.TYPE.TEXT,
                  onClick: () => {
                    eventManager.send_event(events.LEAVE_SETUP_CLICKED_TFI)
                    history.push({
                      pathname:
                        '/institute/dashboard/leave-management/set-leave-limit',
                    })
                  },
                }}
                classes={styles}
              />
            </>
          )
        }
      }
    }
  } else {
    return (
      <>
        <EmptyState
          iconName="lock"
          content={<Para>{t('upgradeToView')}</Para>}
          button={{
            size: BUTTON_CONSTANTS.SIZE.SMALL,
            type: BUTTON_CONSTANTS.TYPE.TEXT,
            version: BUTTON_CONSTANTS.ICON_VERSION.FILLED,
            children: t('viewPlans'),
            onClick: () => {
              history.push(PRICING)
            },
          }}
          classes={styles}
        />
      </>
    )
  }
}

export default LeaveWidgetBody
