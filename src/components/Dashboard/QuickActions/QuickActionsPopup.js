import React from 'react'
import {Icon, ICON_CONSTANTS, Toggle, TOGGLE_CONSTANTS} from '@teachmint/krayon'
import {QUICK_ACTIONS_DETAILS} from './contants'
import styles from './QuickActions.module.css'
import {t} from 'i18next'
import Permission from '../../Common/Permission/Permission'
import {useSelector} from 'react-redux'
import {events} from '../../../utils/EventsConstants'

const QuickActionsPopup = ({
  handleClosePopup,
  handleToggleChange,
  activeActionDict,
  permittedActionList,
}) => {
  const eventManager = useSelector((state) => state.eventManager)

  return (
    <div className={styles.QuickActionsPopupContainer}>
      <div className={styles.QuickActionsPopupContainerHead}>
        <div>{`${t('edit')} ${t(QUICK_ACTIONS_DETAILS.TITLE)}`}</div>
        <Icon
          name={'close'}
          size={ICON_CONSTANTS.SIZES.X_SMALL}
          className={styles.iconClose}
          onClick={() => {
            eventManager.send_event(
              events.DASHBOARD_QUICK_ACTIONS_EDIT_TOGGLE_SUBMITTED_TFI,
              {
                screen_name: 'dashboard',
                node_type: activeActionDict,
              }
            )
            handleClosePopup()
          }}
        />
      </div>
      {permittedActionList?.map((action, index) => (
        <Permission permissionId={action.permission} key={action.iconName}>
          <div key={index} className={styles.QuickActionsPopupContainerRow}>
            <div className={styles.QuickActionsPopupLeft}>
              <div
                className={styles.quickActionsPopupIcon}
                style={{backgroundColor: action.backgroundColor}}
              >
                <Icon
                  name={action.iconName}
                  type={ICON_CONSTANTS.TYPES.INVERTED}
                  size={ICON_CONSTANTS.SIZES.XX_SMALL}
                />
              </div>
              <div className={styles.quickActionsPopupText}>{action.text}</div>
            </div>
            <div className={styles.QuickActionsPopupRight}>
              <Toggle
                isSelected={activeActionDict[action.id]}
                handleChange={(e) => {
                  handleToggleChange({id: action.id, val: e.value})
                }}
                size={TOGGLE_CONSTANTS.SIZE.SMALL}
              />
            </div>
          </div>
        </Permission>
      ))}
    </div>
  )
}

export default QuickActionsPopup
