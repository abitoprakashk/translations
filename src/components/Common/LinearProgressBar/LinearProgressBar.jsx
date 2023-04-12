import React from 'react'
import {useTranslation} from 'react-i18next'
import progressPattern from '../../../assets/images/dashboard/progress-pattern.svg'
import {events} from '../../../utils/EventsConstants'
import {useSelector} from 'react-redux'

export default function LinearProgressBar({
  progress = 0,
  nextStep = '',
  action,
  subjectNode,
  handleChange,
  sectionId,
}) {
  const {eventManager} = useSelector((state) => state)
  const {t} = useTranslation()
  if (progress === 100) return <></>
  return (
    <div
      className="w-full relative bg-white h-16 rounded-lg cursor-pointer"
      onClick={() => {
        eventManager.send_event(events.NEXT_RECOMMENDATION_ACTION_CLICKED_TFI, {
          setup_perc: progress,
          recommended_action: nextStep,
          section_id: sectionId,
        })
        handleChange(action, subjectNode)
      }}
    >
      <div
        className="absolute h-16 top-0 left-0 tm-linear-bg-green-1 rounded-lg"
        style={{width: `${progress}%`}}
      >
        <div
          className="absolute h-16 top-0 left-0 rounded-lg w-full bg-contain bg-repeat-x"
          style={{backgroundImage: `url(${progressPattern})`}}
        ></div>
      </div>

      <div className="absolute h-16 top-0 left-0 bg-transparent rounded-lg w-full p-3">
        <div className="flex justify-between tm-para tm-para-12 tm-color-text-primary">
          <div>{t('setupCompleted')}</div>
          <div>{t('nextRecommendedAction')}</div>
        </div>

        <div className="flex justify-between tm-h7">
          <div>{progress}%</div>
          <div>{nextStep}</div>
        </div>
      </div>
    </div>
  )
}
