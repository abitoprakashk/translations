import React, {useState, useEffect} from 'react'
import NPSFormContainer from './NPSForm'
import NPSScore from './NPSScore'
import styles from './NPSStyles.module.css'
import NPSSubmit from './NPSSubmit'
import {useDispatch, useSelector} from 'react-redux'
import globalActions from '../../redux/actions/global.actions'
import {getGlobalNPSData} from './redux/nps.selector'
import Loader from '../Common/Loader/Loader'
import {events} from '../../utils/EventsConstants'
import {getAdminSpecificFromLocalStorage} from '../../utils/Helpers'
import {BROWSER_STORAGE_KEYS} from '../../constants/institute.constants'

const NPSFeatureContainer = () => {
  const lastEvent = useSelector((store) => store.lastEvent)
  const [popupPageNumber, setPopupPageNumber] = useState(0)
  const [NPSSubmissionData, setNPSSubmissionData] = useState({
    rating: -1,
    text_ans: '',
    selected_options: {},
  })
  const eventManager = useSelector((state) => state.eventManager)
  const [currentPopup, setCurrentPopup] = useState({})
  const [showPopup, setShowPopup] = useState(false)
  const dispatch = useDispatch()
  const userType = useSelector((state) => state.currentAdminInfo.type)
  const {
    NPSTemplateList: {loading, data},
  } = getGlobalNPSData()
  useEffect(() => {
    if (data?.forms) {
      if (data?.forms[lastEvent]) {
        setPopupPageNumber(0)
        setNPSSubmissionData({
          rating: -1,
          text_ans: '',
          selected_options: {},
        })
        setCurrentPopup(data.forms[lastEvent])
        setShowPopup(true)
        eventManager.send_event(events.NPS_MODAL_LAUNCHED_TFI, {
          triggering_event: lastEvent,
          form_id: currentPopup._id,
        })
      }
    }
  }, [lastEvent])
  const postNPSSubmissionData = (payload) => {
    if (payload?.rating) {
      dispatch(globalActions.submitNPSFormTemplate.request(payload))
    }
    if (payload.submission_type !== 'SUBMIT') {
      setShowPopup(false)
    }
  }

  useEffect(() => {
    const CurrentOrgId = getAdminSpecificFromLocalStorage(
      BROWSER_STORAGE_KEYS.CURRENT_ORG_ID
    )
    if (!CurrentOrgId) {
      setTimeout(() => {
        if (userType !== 7 && userType) {
          dispatch(globalActions.NPSTemplateList.request())
        }
      }, 5000)
    }
  }, [userType])

  const handleCloseClick = (submit_type, data, page_id) => {
    let payload = {
      ...data,
      submission_type: submit_type,
      form_id: currentPopup._id,
    }
    setNPSSubmissionData(data)
    postNPSSubmissionData(payload)
    if (submit_type === 'REMIND') {
      eventManager.send_event(events.NPS_INTRO_REMIND_CLICKED_TFI, {
        triggering_event: lastEvent,
        form_id: currentPopup._id,
      })
    }
    if (submit_type === 'CANCEL') {
      eventManager.send_event(events.NPS_EXIT_CLICKED_TFI, {
        triggering_event: lastEvent,
        form_id: currentPopup._id,
        exit_screen_id: page_id,
      })
    }
  }

  const getPage = (popupPageNumber) => {
    if (popupPageNumber === 0)
      return (
        <NPSScore
          setPopupPageNumber={setPopupPageNumber}
          setNPSSubmissionData={setNPSSubmissionData}
          NPSSubmissionData={NPSSubmissionData}
          fd={currentPopup}
          handleCloseClick={handleCloseClick}
        />
      )
    else if (popupPageNumber === 1)
      return (
        <NPSFormContainer
          setPopupPageNumber={setPopupPageNumber}
          setNPSSubmissionData={setNPSSubmissionData}
          NPSSubmissionData={NPSSubmissionData}
          fd={currentPopup}
          options={data?.options}
          handleCloseClick={handleCloseClick}
        />
      )
    else if (popupPageNumber === 2)
      return (
        <NPSSubmit
          popupPageNumber={popupPageNumber}
          setPopupPageNumber={setPopupPageNumber}
          setNPSSubmissionData={setNPSSubmissionData}
          NPSSubmissionData={NPSSubmissionData}
          fd={currentPopup}
          handleCloseClick={() => {
            setShowPopup(false)
            eventManager.send_event(events.NPS_FINAL_SCREEN_DONE_CLICKED_TFI, {
              triggering_event: lastEvent,
              nps_score: NPSSubmissionData.rating,
              text_ans: NPSSubmissionData.text_ans,
              response: Object.keys(NPSSubmissionData.selected_options).map(
                (feature) => ({
                  feature: feature,
                  sub_features: NPSSubmissionData.selected_options[feature],
                })
              ),
            })
          }}
        />
      )
  }

  useEffect(() => {
    getPage(popupPageNumber)
  }, [popupPageNumber])

  return (
    <>
      <Loader show={loading} />
      {showPopup && (
        <div className={styles.NPSFeatureContainer}>
          <div
            className={
              popupPageNumber == 0
                ? styles.NPSFormPopupBackground
                : styles.NPSWideFormPopupBackground
            }
          >
            {getPage(popupPageNumber)}
          </div>
        </div>
      )}
    </>
  )
}

export default NPSFeatureContainer
