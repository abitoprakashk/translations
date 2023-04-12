import {getConfigDetails, log_event} from '../routes/dashboard'
import {v4 as uuidv4} from 'uuid'
import {fbEvents} from './EventsConstants'
import store from '../redux/store'
import {getFromLocalStorage, setToLocalStorage} from './Helpers'
import {REACT_APP_MOENGAGE_DEBUG_LOG} from '../constants'
import {eventManagerActionTypes} from '../redux/actionTypes'

export default class EventManager {
  constructor(uid, url) {
    this.eventConfig = null
    this.uid = uid
    this.firebase = null
    this.moengage = null
    this.campaignUrl = url

    // update app_id in localstorage if it is given as paramter in the url
    const search_url = new URL(url)
    const url_params = new URLSearchParams(search_url.search)
    if (url_params.get('app_id')) {
      this.updateAppID(url_params.get('app_id'))
    }
  }

  getConfig = async () => {
    await getConfigDetails()
      .then(async (data) => {
        this.eventConfig = data.obj
        this.moengage = window.moe({
          app_id: 'UK2R5N8L77KIUINA9WMMEUID',
          debug_logs: REACT_APP_MOENGAGE_DEBUG_LOG,
        })
        const firebase = (
          await import(
            /* webpackPrefetch: true, webpackChunkName: "firebase" */ 'firebase'
          )
        ).default
        this.FB = window.fbq
        if (!firebase.apps.length) {
          firebase.initializeApp({
            apiKey: 'AIzaSyC86r_KE3JS7lhSBFq8x1mpR9WqucpS7_M',
            authDomain: 'excellent-math-274709.firebaseapp.com',
            databaseURL: 'https://excellent-math-274709.firebaseio.com',
            projectId: 'excellent-math-274709',
            storageBucket: 'excellent-math-274709.appspot.com',
            messagingSenderId: '554736302166',
            appId: '1:554736302166:web:cc281dcb31c5211c0563f7',
            measurementId: 'G-3YS9P6ZDWX',
          })
        } else {
          firebase.app()
        }
        this.firebase = firebase.analytics()
      })
      .catch(() => {
        //console.log(error)
      })
  }

  get_default_data = () => {
    let ua = window.navigator.userAgent.toLowerCase()
    let isMobile = ua.includes('mobile')
    const {instituteInfo, currentAdminInfo} = store.getState()
    let data = {
      t: new Date().getTime(),
      uid: this.uid,
      utype: currentAdminInfo?.type,
      app_id: this.getAppID(),
      app_type: isMobile ? 'M-WEB' : 'WEB',
    }
    if (instituteInfo && instituteInfo._id) {
      data.insti_id = instituteInfo._id
      data.insti_type = instituteInfo.institute_type
    }
    return data
  }

  send_event = async (eventID, data = {}, firebase = false) => {
    data = {
      ...this.get_default_data(),
      ...data,
    }

    data = this.addCampaignUrlToPayload(data)
    if (this.eventConfig.internalEnabled) {
      await log_event(eventID, data)
    }
    if (firebase && this.eventConfig.firebaseEnabled) {
      this.firebase.logEvent(eventID, data)
    }
    if (this.eventConfig.moEngageEnabled) {
      this.moengage.track_event(eventID, data)
    }

    if (fbEvents.includes(eventID)) this.FB('trackCustom', eventID, data)
    const {
      globalData: {NPSTemplateList},
    } = store.getState()
    if (NPSTemplateList?.data?.forms?.[eventID]) {
      store.dispatch({
        type: eventManagerActionTypes.LAST_EVENT,
        payload: eventID,
      })
    }
  }

  add_unique_user = async (data) => {
    data = {
      ...this.get_default_data(),
      ...data,
    }

    data = this.addCampaignUrlToPayload(data)
    if (this.eventConfig?.moEngageEnabled) {
      this.moengage.add_unique_user_id(data.uid || data._id)
      this.moengage.add_first_name(data.first_name || data.name)
      this.moengage.add_last_name(data.last_name)
      this.moengage.add_email(data.email)
      this.moengage.add_mobile(data.phone_number)
    }
  }

  destroy_session = async () => {
    if (this.eventConfig.moEngageEnabled) {
      await this.moengage.destroy_session()
    }
  }

  getAppID = () => {
    let appId = getFromLocalStorage('app_id')
    if (!appId) {
      appId = uuidv4()
      setToLocalStorage('app_id', appId)
    }
    return appId
  }
  updateAppID = (appId) => {
    setToLocalStorage('app_id', appId)
  }

  addCampaignUrlToPayload = (data) => {
    let trackIdArr = this.campaignUrl.split('?')
    let track_id = ''
    if (trackIdArr[1]) {
      trackIdArr = String(trackIdArr[1]).split('&')
      if (trackIdArr) {
        trackIdArr.forEach((item) => {
          if (String(item).includes('uuid=')) {
            track_id = String(item).replace('uuid=', '')
          }
        })
      }
    }
    data = {...data, url: this.campaignUrl, track_id}
    return data
  }
}
