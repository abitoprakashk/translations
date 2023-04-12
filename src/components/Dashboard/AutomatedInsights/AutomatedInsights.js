import React, {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {sidebarData} from '../../../utils/SidebarItems'
import {events} from '../../../utils/EventsConstants'
import history from '../../../history'
import {announcementType} from '../../../pages/communication/constants'
import newFeatureIcon from '../../../assets/images/icons/new-feature-icon.svg'
import {checkSubscriptionType, numDifferentiation} from '../../../utils/Helpers'
import {showFeatureLockAction} from '../../../redux/actions/commonAction'
import classNames from 'classnames'
import styles from './AutomatedInsights.module.css'
import {t} from 'i18next'
import {SliderActionTypes} from '../../../pages/communication/redux/actionTypes'
import {quickActionsActionTypes} from '../../../redux/actionTypes'
import {FEE_REPORTS_TEMPLATES} from '../../../pages/fee/fees.constants'
import {DateTime} from 'luxon'
import {PERMISSION_CONSTANTS} from '../../../utils/permission.constants'
import Permission from '../../Common/Permission/Permission'

export default function AutomatedInsights() {
  const {eventManager, instituteInfo, dashboardQuickActions, sidebar} =
    useSelector((state) => state)
  const usersPermission = useSelector(
    (state) => state?.globalData?.userRolePermission?.data?.permission_ids
  )
  const dispatch = useDispatch()
  const isPremium = checkSubscriptionType(instituteInfo)
  const todayTimestamp = DateTime.now()

  useEffect(() => {
    if (isPremium && usersPermission) {
      if (
        checkPermission(
          PERMISSION_CONSTANTS.FeeModuleController_reportDownloadRequest_read
        )
      ) {
        let data = {}
        data.report_type =
          FEE_REPORTS_TEMPLATES.FEE_COLLECTION_PAYMENTMODEWISE.value
        data.meta = {
          report_name: '',
          date_range: {
            start_date: todayTimestamp.startOf('day').toSeconds(),
            end_date: todayTimestamp.endOf('day').toSeconds(),
          },
        }
        dispatch({
          type: quickActionsActionTypes.TODAY_COLLECTED_FEE_REQUEST,
          payload: data,
        })
      }
    }
  }, [usersPermission])

  const checkPermission = (permissionId) => {
    const isPremium = checkSubscriptionType(instituteInfo)
    return usersPermission?.includes(permissionId) && isPremium ? true : false
  }

  // list of quick actions
  const insightsitems = [
    {
      type: announcementType.ANNOUNCEMENT,
      title: 'shareInformationWithTeachersAndStudents',
      btnText: 'createAnnouncement',
      permissionId:
        PERMISSION_CONSTANTS.communicationController_announcement_create, // based on user's permission this button will be disabled
      handleClick: () => {
        eventManager.send_event(events.CREATE_NEW_POST_POPUP_CLICKED_TFI, {
          post_type: 'announcement',
          screen_name: 'dashboard',
        })
        if (isPremium) {
          dispatch({type: SliderActionTypes.SET_SLIDER, payload: true})
          history.push({
            pathname: sidebarData.ANNOUNCEMENTS.route,
            state: {
              selectedOption: announcementType.ANNOUNCEMENT,
            },
          })
        } else dispatch(showFeatureLockAction(true))
      },
      isVisible: sidebar?.allowedMenus?.has('ANNOUNCEMENTS'),
      extraHtml: null,
    },
    {
      type: announcementType.ANNOUNCEMENT,
      title: null,
      btnText: t('collectFee'),
      permissionId:
        PERMISSION_CONSTANTS.FeeModuleController_reportDownloadRequest_read,
      handleClick: () => {
        eventManager.send_event(events.FEE_COLLECTION_CLICKED_TFI, {
          screen_name: 'dashboard',
        })
        if (isPremium)
          history.push({
            pathname: sidebarData.FEE_COLLECTION.route,
          })
        else dispatch(showFeatureLockAction(true))
      },
      extraHtml: (
        <div>
          <div
            className={classNames(styles.todayFeeCollectionText, 'tm-para3')}
          >
            {t('todaysFeeCollection')}
          </div>

          <div className="tm-h5">
            {numDifferentiation(
              dashboardQuickActions?.feeQuickActionData
                ?.todayTotalFeeCollection,
              instituteInfo.currency
            )}
          </div>
        </div>
      ),
      isVisible: isPremium && sidebar?.allowedMenus?.has('FEE_COLLECTION'),
    },
  ]

  return insightsitems?.filter((option) => option.isVisible)?.length > 0 ? (
    <div className="w-full overflow-hidden pl-4 py-3">
      <div
        className={classNames(
          styles.headerStyle,
          'w-full flex flex-row justify-between'
        )}
      >
        <div className="tm-h7">{t('quickActions')}</div>
        <img src={newFeatureIcon} />
      </div>
      <div className={styles.srickySidebar}>
        {insightsitems
          .filter((option) => option.isVisible)
          .map(
            ({title, btnText, permissionId, handleClick, extraHtml}, idx) => (
              <div
                className={classNames(
                  {[styles.announcementStyle]: idx !== 0},
                  'bg-white tm-border-radius1 px-4 py-4 tm-box-shadow1 content-center'
                )}
                key={`quickAction${idx}`}
              >
                {title && <div className="tm-para3">{t(title)}</div>}
                {extraHtml}
                <Permission permissionId={permissionId}>
                  <div
                    className="tm-btn3-blue mt-5 lg:56"
                    onClick={(e) => {
                      handleClick()
                      e.stopPropagation()
                    }}
                  >
                    {t(btnText)}
                  </div>
                </Permission>
              </div>
            )
          )}
      </div>
    </div>
  ) : null
}
