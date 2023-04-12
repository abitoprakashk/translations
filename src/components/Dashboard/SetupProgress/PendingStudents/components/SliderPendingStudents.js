import React, {useEffect} from 'react'
import userDefaultIcon from '../../../../../assets/images/icons/user-profile.svg'
import styles from '../PendingStudents.module.css'
import {useTranslation} from 'react-i18next'
import {SLIDERS_NAME} from '../../constants'

const SliderPendingStudents = (props) => {
  const {
    pendingStudentsObj,
    handleCheckboxToggle,
    selectedTeachersId,
    handleSelectAll,
    isAllSelected,
    allPendingTeachersIds,
    hasId,
    setEventsPayload,
    eventsPayload,
    setSliderScreen,
  } = props
  const {t} = useTranslation()

  let sortedPendingStudentsObj = Object.fromEntries(
    Object.entries(pendingStudentsObj).sort((a, b) => b[1].count - a[1].count)
  )
  useEffect(() => {
    Object.keys(sortedPendingStudentsObj).map((section_id) =>
      setEventsPayload([
        ...eventsPayload,
        {
          user_id: sortedPendingStudentsObj[section_id]?.class_teacher.uuid,
          section_id: section_id,
          student_count: sortedPendingStudentsObj[section_id]?.count,
        },
      ])
    )
  }, [selectedTeachersId])
  return (
    <div className="">
      {Object.keys(sortedPendingStudentsObj).length ? (
        <>
          <div className={`${styles.pending_students_slider_container}`}>
            <div className="">
              <div
                className={`${styles.pending_students_slider_container_input_div}`}
              >
                <label
                  className={`${styles.pending_students_slider_container_input_label}`}
                >
                  <input
                    className={`${styles.pending_students_slider_container_input} switch`}
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      isAllSelected &&
                      selectedTeachersId.length === allPendingTeachersIds.length
                    }
                  />
                </label>
                <div
                  className={`${styles.pending_students_slider_container_select_all} tm-para2`}
                  onClick={handleSelectAll}
                >
                  {t('selectAll')}
                </div>
              </div>
            </div>
            <div className="tm-h6">{`${selectedTeachersId.length} selected`}</div>
          </div>
          <div className={`${styles.assign_pending_students_header}`}>
            <div
              className={`${styles.pending_students_slider_container_classteacher_text} tm-para2`}
            >
              {t('classTeacher')}
            </div>
            <div
              className={`${styles.pending_students_slider_container_class_text} tm-para2`}
            >
              {t('class')}
            </div>
            <div
              className={`${styles.pending_students_slider_container_student_text} tm-para2`}
            >
              {t('pendingStudents')}
            </div>
          </div>
          <div
            className={`${styles.background_gray} ${styles.border_radius_8}`}
          >
            {selectedTeachersId &&
              Object.keys(sortedPendingStudentsObj)?.map((section_id) => (
                <div
                  key={sortedPendingStudentsObj[section_id].name}
                  className={
                    styles.pending_students_slider_container_table_container
                  }
                >
                  <div
                    className={`${styles.pending_students_slider_container_table}`}
                  >
                    <div
                      className={`${styles.pending_students_slider_container_table_teacher_container}`}
                    >
                      <div
                        className={`${styles.pending_students_slider_container_table_teacher_container_div}`}
                      >
                        <label
                          className={`${styles.pending_students_slider_container_table_teacher_container_label}`}
                        >
                          <input
                            className={`${styles.pending_students_slider_container_table_teacher_container_input} switch`}
                            type="checkbox"
                            onChange={handleCheckboxToggle}
                            value={
                              sortedPendingStudentsObj[section_id].class_teacher
                                ._id || ''
                            }
                            checked={hasId(
                              sortedPendingStudentsObj[section_id].class_teacher
                                ._id
                            )}
                          />
                        </label>
                      </div>
                      <div className={styles.margin_left_24}>
                        <img
                          src={
                            sortedPendingStudentsObj[section_id].class_teacher
                              ?.documents.img_url || userDefaultIcon
                          }
                          alt=""
                          className={`${styles.pending_students_slider_container_teacher_img}`}
                        />
                      </div>
                      <div className="">
                        <div className={`${styles.pending_teacher_name} `}>
                          {sortedPendingStudentsObj[section_id].class_teacher
                            .fields?.full_name ||
                            sortedPendingStudentsObj[section_id].class_teacher
                              .fields?.name ||
                            ''}
                        </div>
                        <div className="tm-para2">
                          {sortedPendingStudentsObj[section_id].class_teacher
                            .phone_number || ''}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`${styles.pending_students_slider_container_class_text}`}
                    >
                      <div className="tm-h6">
                        {sortedPendingStudentsObj[section_id].name}
                      </div>
                    </div>
                    <div
                      className={`${styles.pending_students_slider_container_student_text}`}
                    >
                      <div className="tm-h6">
                        {sortedPendingStudentsObj[section_id].count}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </>
      ) : (
        <div className={`${styles.text_message} tm-para3`}>
          {t('pendingStudentsTableEmptyMessage')}
          <div
            className={`${styles.text_message_redirect}`}
            onClick={(e) => {
              e.stopPropagation()
              setSliderScreen(SLIDERS_NAME.CLASSTEACHERS_NOT_ASSIGNED)
            }}
          >
            {t('assign')}
          </div>
        </div>
      )}
    </div>
  )
}

export default SliderPendingStudents
