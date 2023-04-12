import React, {useState} from 'react'
import styles from './NPSStyles.module.css'
import {Button, Icon} from '@teachmint/krayon'
import {t} from 'i18next'
import WAVE_ICON from '../../assets/images/icons/wave-icon.svg'
import {events} from '../../utils/EventsConstants'
import {useSelector} from 'react-redux'

const NPSScore = ({
  setPopupPageNumber,
  setNPSSubmissionData,
  NPSSubmissionData,
  fd,
  handleCloseClick,
}) => {
  const [activeScore, setActiveScore] = useState(NPSSubmissionData.rating)
  const eventManager = useSelector((state) => state.eventManager)
  const lastEvent = useSelector((store) => store.lastEvent)
  const ratings = {
    bad: {start: 1, end: 6},
    avg: {start: 7, end: 8},
    good: {start: 9, end: 10},
  }
  const getRatingPills = ({start, end}) => {
    let array = []
    let style =
      end > ratings.avg.end
        ? styles.goodPills
        : end < ratings.avg.end
        ? styles.badPills
        : styles.avgPills

    let activeStyle =
      end > ratings.avg.end
        ? styles.activeGoodPills
        : end < ratings.avg.end
        ? styles.activeBadPills
        : styles.activeAvgPills

    for (let i = start; i <= end; i++) array.push(i)
    const pills = array.map((item) => (
      <div
        className={activeScore === item ? `${activeStyle} ${style}` : style}
        key={item}
        onClick={() => handleScoreClick(item)}
      >
        {item}
      </div>
    ))

    return pills
  }

  const handleScoreClick = (item) => {
    setNPSSubmissionData({...NPSSubmissionData, rating: item})
    setActiveScore(item)
  }
  const handleNextClick = () => {
    if (activeScore) {
      setPopupPageNumber(1)
    }
    eventManager.send_event(events.NPS_INTRO_NEXT_CLICKED_TFI, {
      triggering_event: lastEvent,
      nps_score: activeScore,
      form_id: fd._id,
    })
  }

  return (
    <div className={styles.NPSScorePopup}>
      <div className={styles.scorePopupHeaderBorder}>
        <div className={styles.scorePopupHeader}>
          <div
            className={styles.PopupCross}
            onClick={() => handleCloseClick('CANCEL', NPSSubmissionData, 1)}
          >
            <Icon name="close" size="xx_s" />
          </div>
        </div>
      </div>

      <div className={styles.scorePopupMainContent}>
        <div>
          <img src={WAVE_ICON} alt="hand icon" />
        </div>
        <div className={styles.scoreQuestionText}>
          {fd?.lang_meta_data?.en?.description}
        </div>
        <div className={styles.scorePopupScoreContainer}>
          <div
            className={
              styles.scorePopupScoreBad +
              ` ${
                activeScore > 0 && activeScore < ratings.avg.start
                  ? styles.activeBadBorder
                  : ' '
              }`
            }
          >
            {getRatingPills(ratings.bad)}
          </div>
          <div
            className={
              styles.scorePopupScoreAvg +
              ` ${
                activeScore > ratings.bad.end &&
                activeScore < ratings.good.start
                  ? styles.activeAvgBorder
                  : ' '
              }`
            }
          >
            {getRatingPills(ratings.avg)}
          </div>
          <div
            className={
              styles.scorePopupScoreGood +
              ` ${
                activeScore > ratings.avg.end ? styles.activeGoodBorder : ' '
              }`
            }
          >
            {getRatingPills(ratings.good)}
          </div>
        </div>
        <div className={styles.scorePopupButtonContainer}>
          <Button
            classes={styles.PopupButtonText}
            onClick={() => handleNextClick()}
            width={'full'}
            isDisabled={activeScore > 0 ? false : true}
          >
            {fd?.lang_meta_data?.en?.cta_1 || t('next')}
          </Button>
        </div>
        <div
          className={styles.PopupRemindText}
          onClick={() => handleCloseClick('REMIND', NPSSubmissionData, 1)}
        >
          {fd?.lang_meta_data?.en?.cta_2 || t('remindMeLater')}
        </div>
      </div>
    </div>
  )
}

export default NPSScore
