import classNames from 'classnames'
import {getClassroomDays, getUniqueItems} from '../../../../utils/Helpers'
import SubjectTooltipOptions from '../../SectionDetails/SubjectTooltipOptions'
import styles from './UncategorizedClassroomCard.module.css'
import ImgText from '../../../Common/ImgText/ImgText'
import {useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {events} from '../../../../utils/EventsConstants'
import {UNCATEGORIZED_CLASSROOM_TOOLTIP_OPTIONS} from '../../../../utils/HierarchyOptions'
import produce from 'immer'
const {REACT_APP_BASE_URL} = process.env
import {getFromSessionStorage} from '../../../../utils/Helpers'
import {BROWSER_STORAGE_KEYS} from '../../../../constants/institute.constants'

function UncategorizedClassroomCard({classroomItem, handleChange}) {
  const {instituteInfo, eventManager} = useSelector((state) => state)

  const {t} = useTranslation()

  const trackEvent = (eventName, classId, screenName) => {
    let data = {}
    if (classId) data = {classId}
    if (screenName) data = {...data, screen_name: screenName}
    eventManager.send_event(eventName, data)
  }

  const classroomTooltipOptions = produce(
    UNCATEGORIZED_CLASSROOM_TOOLTIP_OPTIONS,
    (draft) => {
      if (!classroomItem?.teacher?.name) {
        draft[3].active = false
        draft[4].active = false
        draft[5].active = true
      }
    }
  )

  return (
    <div className={classNames(styles.card)}>
      <div className={classNames(styles.first_row)}>
        <div className="tm-hdg tm-hdg-20">{classroomItem?.name}</div>
        <SubjectTooltipOptions
          subjectItem={classroomItem}
          options={classroomTooltipOptions.filter(({active}) => active)}
          trigger={
            <img
              src="https://storage.googleapis.com/tm-assets/icons/secondary/settings-dots-secondary.svg"
              alt=""
              className={classNames(styles.classroom_settings)}
            />
          }
          handleChange={handleChange}
        />
      </div>

      <div className={classNames(styles.second_row)}>
        {(
          (classroomItem.subject &&
            getUniqueItems(classroomItem.subject.split(','))) ||
          []
        ).map((item, index) => (
          <div
            className={classNames(styles.subject_tag, 'tm-subject-tag')}
            key={index}
          >
            {item}
          </div>
        ))}
      </div>

      <div className={classNames(styles.third_row)}>
        <div className={classNames(styles.classroom_info_section)}>
          {classroomItem?.teacher?.name && (
            <ImgText
              icon="https://storage.googleapis.com/tm-assets/icons/secondary/teacher-whiteboard-secondary.svg"
              text={classroomItem?.teacher?.name}
            />
          )}
          <ImgText
            icon="https://storage.googleapis.com/tm-assets/icons/secondary/calendar-secondary.svg"
            text={getClassroomDays(classroomItem.timetable)}
          />
          <ImgText
            icon="https://storage.googleapis.com/tm-assets/icons/colorful/teacher-v1-yellow.svg"
            text={`${
              classroomItem.no_of_students +
              classroomItem.no_of_pending_students
            } Students`}
            textStyle={'tm-color-orange'}
          />
        </div>
        <div>
          <div
            className="items-center hidden lg:flex cursor-pointer"
            onClick={() => {
              trackEvent(events.VIEW_CLASSROOM_CLICKED, null, 'CLASSROOM_PAGE')
              window.open(
                `${REACT_APP_BASE_URL}classroom/${instituteInfo?._id}/${
                  classroomItem._id
                }?admin_uuid=${getFromSessionStorage(
                  BROWSER_STORAGE_KEYS.ADMIN_UUID
                )}`
              )
            }}
          >
            <div className="tm-hdg-14 tm-cr-bl-2">{t('viewClassroom')}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UncategorizedClassroomCard
