import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {Icon, ICON_CONSTANTS, Modal, Tooltip} from '@teachmint/krayon'
import {t} from 'i18next'
import styles from './QuickActions.module.css'
import {QUICK_ACTIONS_DETAILS, QUICK_ACTIONS_LIST} from './contants'
import QuickActionsPopup from './QuickActionsPopup'
import {actionsList} from './utils'
import globalActions from '../../../redux/actions/global.actions'
import Permission from '../../Common/Permission/Permission'
import {showAddLeavePopup} from '../../../pages/LeaveManagement/redux/actions/leaveManagement.actions'
import {events} from '../../../utils/EventsConstants'
import {checkSubscriptionType} from '../../../utils/Helpers'
import {showFeatureLockAction} from '../../../redux/actions/commonAction'

const QuickActions = () => {
  const [showPopup, setShowPopup] = useState(false)
  const [activeActionDict, setActiveActionDict] = useState({})
  const [permittedActionList, setPermittedActionList] = useState([])

  const {globalData} = useSelector((state) => state)
  const {isLoading} = useSelector(() => globalData.getDashboardPreference)
  const {eventManager, instituteInfo} = useSelector((state) => state)
  const userRolePermission = useSelector(
    (state) => state.globalData?.userRolePermission
  )

  const dispatch = useDispatch()

  const isPremium = checkSubscriptionType(instituteInfo)

  const trackEvent = (eventName, status, node_type) => {
    eventManager.send_event(eventName, {
      screen_name: 'DASHBOARD',
      status,
      node_type,
    })
  }
  const handleEditClick = () => {
    setShowPopup(true)
  }

  const handleClosePopup = () => {
    let payloadObj = {
      preference: {
        ...globalData.getDashboardPreference.data?.preference,
        quick_actions: {...activeActionDict},
      },
    }
    dispatch(globalActions?.postDashboardPreference?.request(payloadObj))
    setShowPopup(false)
  }

  const handleToggleChange = ({id, val}) => {
    setActiveActionDict({
      ...activeActionDict,
      [id]: val,
    })
  }

  let activeActionIconList = actionsList.filter(
    (action) =>
      activeActionDict[action.id] &&
      userRolePermission?.data?.permission_ids?.includes(action.permission)
  )

  const getPemittedActionList = () => {
    if (!permittedActionList?.length > 0) {
      const tempArray = actionsList.filter((action) =>
        userRolePermission?.data?.permission_ids?.includes(action.permission)
      )
      setPermittedActionList(tempArray)
    }
  }

  const handleOnclick = (id) => {
    switch (id) {
      case QUICK_ACTIONS_LIST.MARK_STAFF_LEAVE.id:
        dispatch(showAddLeavePopup({staff: null}))
        break
      default:
        break
    }
  }

  useEffect(() => {
    getPemittedActionList()
  }, [userRolePermission])

  useEffect(() => {
    if (
      Object.keys({
        ...globalData?.getDashboardPreference?.data?.preference?.quick_actions,
      }).length > 0
    ) {
      let tempDict =
        globalData?.getDashboardPreference?.data?.preference?.quick_actions
      setActiveActionDict({...tempDict})
    }
  }, [globalData?.getDashboardPreference])

  return (
    <div className={styles.quickActionsContainer}>
      <div className={styles.quickActionsContainerHeader}>
        <div className={styles.quickActionsContainerHeaderText}>
          {t(QUICK_ACTIONS_DETAILS.TITLE)}
        </div>
        {!isLoading && (
          <div
            className={styles.quickActionsContainerHeaderEdit}
            onClick={() => {
              if (isPremium) {
                trackEvent(
                  events.DASHBOARD_QUICK_ACTIONS_EDIT_CLICKED_TFI,
                  'UNLOCKED'
                )

                handleEditClick()
              } else {
                trackEvent(
                  events.DASHBOARD_QUICK_ACTIONS_EDIT_CLICKED_TFI,
                  'LOCKED'
                )
                dispatch(showFeatureLockAction(true))
              }
            }}
          >
            {t('edit')}
          </div>
        )}
      </div>
      <div className={styles.quickActionsContainerIcons}>
        {isLoading && (
          <>
            {actionsList.map((index) => (
              <span key={index} className={styles.quickActionsIconLoading} />
            ))}
          </>
        )}
        {!isLoading && (
          <>
            {activeActionIconList.map(
              ({
                id,
                backgroundColor,
                redirectURL,
                iconName,
                text,
                permission,
              }) =>
                permission ? (
                  <Permission permissionId={permission} key={id}>
                    <div
                      data-tip
                      data-for={id}
                      className={styles.quickActionsIconDiv}
                    >
                      <Link
                        key={id}
                        className={styles.quickActionsIcon}
                        style={{backgroundColor: backgroundColor}}
                        to={isPremium && redirectURL}
                        onClick={() => {
                          if (isPremium) {
                            trackEvent(
                              events.DASHBOARD_QUICK_ACTIONS_NODE_CLICKED_TFI,
                              'UNLOCKED',
                              text
                            )

                            handleOnclick(id, text)
                          } else {
                            trackEvent(
                              events.DASHBOARD_QUICK_ACTIONS_NODE_CLICKED_TFI,
                              'LOCKED',
                              text
                            )
                            dispatch(showFeatureLockAction(true))
                          }
                        }}
                      >
                        <Icon
                          name={iconName}
                          type={ICON_CONSTANTS.TYPES.INVERTED}
                          size={ICON_CONSTANTS.SIZES.XX_SMALL}
                        />
                      </Link>
                    </div>
                    <Tooltip
                      toolTipId={id}
                      toolTipBody={text}
                      className={styles.toolTipCustom}
                      place="bottom"
                      effect="solid"
                    />
                  </Permission>
                ) : null
            )}
          </>
        )}
      </div>
      {showPopup && (
        <div className={styles.popupModal}>
          <Modal isOpen={true} className={styles.popupModalContainer}>
            <QuickActionsPopup
              handleClosePopup={handleClosePopup}
              handleToggleChange={handleToggleChange}
              actionsList={actionsList}
              activeActionDict={activeActionDict}
              permittedActionList={permittedActionList}
            />
          </Modal>
        </div>
      )}
    </div>
  )
}

export default QuickActions
