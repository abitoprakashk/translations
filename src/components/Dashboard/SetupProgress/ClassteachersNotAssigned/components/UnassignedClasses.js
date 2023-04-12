import React from 'react'
import {useTranslation} from 'react-i18next'
import {Input} from '@teachmint/common'
import styles from '../ClassteachersNotAssigned.module.css'
import history from '../../../../../history'
import {sidebarData} from '../../../../../utils/SidebarItems'

const UnassignedClasses = ({
  unassignedClasses,
  allTeachersList,
  selectedClassteachers,
  handleInputChange,
}) => {
  const {t} = useTranslation()

  const classTeachersListNames = allTeachersList.map((teacher) => ({
    value: teacher._id,
    label: teacher.name,
  }))

  return (
    <div className={`${styles.unassign_classteacher_container}`}>
      {unassignedClasses.length > 0 ? (
        <div className={`${styles.assign_classteacher_container}`}>
          <div className={`${styles.assign_classteacher_header}`}>
            <div
              className={`${styles.assign_classteacher_header_section} tm-para2`}
            >
              {t('section')}
            </div>
            <div
              className={`${styles.assign_classteacher_header_class_teacher} tm-para2`}
            >
              {t('classTeacher')}
            </div>
          </div>
          <div className="">
            {unassignedClasses.map((unassignedClass, index) => (
              <div className={`${styles.assign_classteacher_row}`} key={index}>
                <div
                  className={`${styles.assign_classteacher_container_section} tm-h6`}
                >
                  {unassignedClass}
                </div>
                <div
                  className={`${styles.assign_classteacher_container_input_container}`}
                >
                  <Input
                    type="select"
                    fieldName={unassignedClass}
                    options={classTeachersListNames}
                    value={selectedClassteachers[unassignedClass]}
                    onChange={(obj) => {
                      handleInputChange(obj)
                    }}
                    className={`${styles.assign_classteacher_container_input} tm-h6"`}
                    classes={{title: 'tm-para'}}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={`${styles.text_message} tm-para3`}>
          {t('unassignedClassesTableEmptyMessage')}
          <div
            className={`${styles.text_message_redirect}`}
            onClick={() => history.push(sidebarData.TEACHER_DIRECTORY.route)}
          >
            {t('invite')}
          </div>
        </div>
      )}
    </div>
  )
}

export default UnassignedClasses
