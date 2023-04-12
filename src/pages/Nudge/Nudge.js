import React, {useEffect} from 'react'
import styles from './Nudge.module.css'
import {useDispatch, useSelector} from 'react-redux'
import {NudgePopup, Icon, IconFrame} from '@teachmint/krayon'
import {ErrorBoundary} from '@teachmint/common'
import {useHistory} from 'react-router-dom'
import {announcementType} from '../communication/constants'
import {
  getPopupAction,
  setPopupAction,
  setPopupTimeAction,
} from './redux/actions/popupActions'
import {setAnnouncementDraftDataAction} from '../communication/redux/actions/commonActions'
import {events} from '../../utils/EventsConstants'
import {SliderActionTypes} from '../communication/redux/actionTypes'
import classNames from 'classnames'

export default function Nudge() {
  const dispatch = useDispatch()
  const {
    popup: {popupInfo, showPopup},
    adminInfo,
    instituteInfo,
  } = useSelector((state) => state)
  const history = useHistory()
  const eventManager = useSelector((state) => state.eventManager)
  const closePopup = (not_useful) => {
    eventManager.send_event(events.NUDGE_CANCEL_CLICKED_TFI, {
      nudge_type: popupInfo?.popup_type,
      not_useful: not_useful,
    })
    if (not_useful) {
      dispatch(
        setPopupAction({
          pop_up: popupInfo._id,
          popup_type: popupInfo.popup_type,
          api_type: 'CLOSE',
        })
      )
    } else {
      dispatch(setPopupTimeAction())
    }
  }

  const redirect = (title, message) => {
    // code to redirect to announcement page
    eventManager.send_event(events.NUDGE_LET_TEACHERS_KNOW_CLICKED_TFI, {
      nudge_type: popupInfo?.popup_type,
    })
    if (popupInfo?.popup_type == 'NPS') {
      const redirect_url = `${popupInfo.meta_data.redirect_link}#name=${adminInfo.name}&phone_number=${adminInfo.phone_number}&role=${instituteInfo.role}&tfi_id=${instituteInfo._id}&institute_name=${instituteInfo.name}&user_id=${adminInfo._id}&query=${adminInfo._id}${instituteInfo._id}`
      dispatch(
        setPopupAction({
          pop_up: popupInfo._id,
          popup_type: popupInfo.popup_type,
          link: redirect_url,
          api_type: 'ACCEPTED',
        })
      )
    } else if (popupInfo.popup_type === 'Fees') {
      dispatch(
        setPopupAction({
          pop_up: popupInfo._id,
          popup_type: popupInfo.popup_type,
          link: popupInfo.meta_data.redirect_link,
          api_type: 'ACCEPTED',
        })
      )
    } else {
      dispatch({type: SliderActionTypes.SET_SLIDER, payload: true})
      history.push({
        pathname: '/institute/dashboard/communication',
        state: {
          selectedOption: announcementType.ANNOUNCEMENT,
          hasData: true,
        },
      })
      dispatch(
        setAnnouncementDraftDataAction({
          title: title,
          message: message,
          channels: ['notification'],
          segments: ['teacher', 'unassigned'],
          selectAll: true,
          selected_users: [],
          node_ids: [],
          duration: 0,
          is_anonymous: false,
        })
      )
    }
  }
  useEffect(() => {
    setTimeout(() => {
      dispatch(getPopupAction())
    }, 3000)
  }, [])
  return (
    <>
      {showPopup && popupInfo !== undefined && (
        <ErrorBoundary>
          <NudgePopup
            title={
              <div className={classNames(styles.header)}>
                <IconFrame size="m" type="basic" className={styles.bulbIcon}>
                  <Icon name="bulb" size="x_s" type="inverted" />
                </IconFrame>
                <div className={classNames(styles.title)}>
                  {popupInfo.title}
                </div>
                <div className={classNames(styles.sideTitle)}>
                  {popupInfo.meta_data.side_title}
                </div>
                <div className={classNames(styles.closeButton)}>
                  <Icon
                    name="close"
                    size="xx_s"
                    type="inverted"
                    onClick={() => {
                      closePopup(false)
                    }}
                  />
                </div>
              </div>
            }
            body={
              <ul className={styles.list}>
                {Object.keys(popupInfo.description).map((key, index) => {
                  return (
                    <li className={styles.item} key={index}>
                      {popupInfo.description[key]}
                    </li>
                  )
                })}
              </ul>
            }
            buttonLeft={popupInfo.meta_data.button_left}
            buttonRight={popupInfo.meta_data.button_right}
            buttonRightOnClick={() => {
              redirect(
                popupInfo.announcement_tile,
                popupInfo.announcement_message
              )
            }}
            buttonLeftOnClick={() => {
              closePopup(true)
            }}
            className={styles[popupInfo.meta_data.color]}
          />
        </ErrorBoundary>
      )}
    </>
  )
}
