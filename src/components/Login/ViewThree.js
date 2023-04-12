import React from 'react'
import {useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import ProfileCard from '../Common/ProfileCard/ProfileCard'
import {events} from '../../utils/EventsConstants'
import {INSTITUTE_TYPES_ENABLED_LIST_INFO} from '../../constants/institute.constants'

export default function ViewThree({
  instituteType,
  setInstituteType,
  setPageNum,
}) {
  const {eventManager} = useSelector((state) => state)
  const {t} = useTranslation()

  return (
    <div>
      <div className="tm-h4">{t('selectYourInstituteType')}</div>
      <div className="tm-para2 mt-2">{t('selectOneToProceed')}</div>
      <div className="mt-4 lg:mt-12 lg:w-7/12">
        {INSTITUTE_TYPES_ENABLED_LIST_INFO.map(({id, title, imgSrc, desc}) => (
          <ProfileCard
            key={id}
            num={id}
            title={title}
            desc={desc}
            imgSrc={imgSrc}
            isSelected={instituteType}
            handleClick={() => {
              setInstituteType(id)
              setPageNum(2)
              eventManager.send_event(events.INSTITUTE_TYPE_SELECTED_TFI, {
                insti_type: id,
              })
            }}
          />
        ))}
      </div>
    </div>
  )
}
