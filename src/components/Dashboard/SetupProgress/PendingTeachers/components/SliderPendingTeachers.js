import React from 'react'
import userDefaultIcon from '../../../../../assets/images/icons/user-profile.svg'
import styles from '../PendingTeachers.module.css'
import {useTranslation} from 'react-i18next'
import SearchBox from '../../../../Common/SearchBox/SearchBox'
import history from '../../../../../history'
import {sidebarData} from '../../../../../utils/SidebarItems'

const SliderPendingTeachers = (props) => {
  const {
    pendingTeachers,
    handleCheckboxToggle,
    selectedTeachersId,
    setSelectedTeachersId,
    handleSelectAll,
    isAllSelected,
    setFilter,
    filter,
    filteredTeachersList,
    setFilteredTeachersList,
  } = props
  const {t} = useTranslation()

  const handleSearchFilter = (valueWithCase) => {
    let value = valueWithCase.toLowerCase()
    setFilter(value)
    setSelectedTeachersId([])
    if (value) {
      let filteredList = pendingTeachers.filter((teacher) => {
        if (
          teacher.full_name?.toLowerCase()?.includes(value) ||
          teacher.last_name?.toLowerCase()?.includes(value) ||
          teacher.middle_name?.toLowerCase()?.includes(value)
        )
          return teacher
      })
      let selectedList = filteredList.map((ele) => ele._id)
      setSelectedTeachersId([...selectedList])
      setFilteredTeachersList([...filteredList])
    }
  }

  return (
    <div className="">
      {pendingTeachers.length > 0 ? (
        <>
          <div className={styles.margin_bottom_32}>
            <SearchBox
              value={filter}
              placeholder={t('searchWithTeacherName')}
              handleSearchFilter={handleSearchFilter}
            />
          </div>{' '}
          <div className={styles.pending_teacher_slider_container_select_all}>
            <div className="">
              <div
                className={
                  styles.pending_teacher_slider_container_select_all_div
                }
              >
                <label
                  className={
                    styles.pending_teacher_slider_container_select_all_label
                  }
                >
                  <input
                    className={`${styles.pending_teacher_slider_container_select_all_input} switch`}
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      isAllSelected &&
                      (selectedTeachersId.length === pendingTeachers.length ||
                        selectedTeachersId.length ===
                          filteredTeachersList.length)
                    }
                  />
                </label>
                <div
                  className={`${styles.pending_teacher_slider_container_select_all_text} tm-para2`}
                  onClick={handleSelectAll}
                >
                  {t('selectAll')}
                </div>
              </div>
            </div>
            <div className="tm-h6">{`${selectedTeachersId.length} selected`}</div>
          </div>
          <div
            className={`${styles.background_gray} ${styles.pending_teacher_slider_container_table_container}`}
          >
            {filter &&
              filteredTeachersList &&
              filteredTeachersList?.map((teacher) => (
                <div
                  key={teacher.id}
                  className={styles.pending_teacher_announcement_row}
                >
                  <div
                    className={styles.pending_teacher_slider_container_table}
                  >
                    <div
                      className={
                        styles.pending_teacher_slider_container_table_teacher_div
                      }
                    >
                      <label
                        className={
                          styles.pending_teacher_slider_container_table_teacher_label
                        }
                      >
                        <input
                          className={`${styles.pending_teacher_slider_container_table_teacher_input} switch `}
                          type="checkbox"
                          onChange={handleCheckboxToggle}
                          value={teacher._id || ''}
                          checked={selectedTeachersId.includes(teacher._id)}
                        />
                      </label>
                    </div>
                    <div
                      className={
                        styles.pending_teacher_slider_container_table_teacher_img_container
                      }
                    >
                      <div className="">
                        <img
                          src={teacher.img_url || userDefaultIcon}
                          alt=""
                          className={
                            styles.pending_teacher_slider_container_table_teacher_img
                          }
                        />
                      </div>
                      <div className="">
                        <div
                          className={
                            teacher.phone_number
                              ? styles.pending_teacher_name
                              : styles.pending_teacher_name_without_phone
                          }
                        >
                          {teacher.fields?.name ||
                            teacher.fields?.full_name ||
                            teacher.fields?.first_name ||
                            teacher.fields?.last_name ||
                            teacher.fields?.middle_name ||
                            ''}
                        </div>
                        <div className="tm-para2">
                          {teacher.phone_number || ''}
                        </div>
                      </div>
                    </div>
                  </div>
                  {!teacher.phone_number && (
                    <div
                      className={`${styles.pending_teacher_announcement_no_phone_text} tm-para4`}
                    >
                      {t('phoneNumberNotAdded')}
                    </div>
                  )}
                </div>
              ))}
            {!filter &&
              selectedTeachersId &&
              pendingTeachers?.map((teacher) => (
                <div
                  key={teacher.id}
                  className={styles.pending_teacher_announcement_row}
                >
                  <div
                    className={styles.pending_teacher_slider_container_table}
                  >
                    <div
                      className={
                        styles.pending_teacher_slider_container_table_teacher_div
                      }
                    >
                      <label
                        className={
                          styles.pending_teacher_slider_container_table_teacher_label
                        }
                      >
                        <input
                          className={`${styles.pending_teacher_slider_container_table_teacher_input} switch`}
                          type="checkbox"
                          onChange={handleCheckboxToggle}
                          value={teacher._id || ''}
                          checked={selectedTeachersId.includes(teacher._id)}
                        />
                      </label>
                    </div>
                    <div
                      className={
                        styles.pending_teacher_slider_container_table_teacher_img_container
                      }
                    >
                      <div className="">
                        <img
                          src={teacher.img_url || userDefaultIcon}
                          alt=""
                          className={
                            styles.pending_teacher_slider_container_table_teacher_img
                          }
                        />
                      </div>
                      <div className="">
                        <div
                          className={
                            teacher.phone_number
                              ? styles.pending_teacher_name
                              : styles.pending_teacher_name_without_phone
                          }
                        >
                          {teacher.fields?.name ||
                            teacher.fields?.full_name ||
                            teacher.fields?.first_name ||
                            teacher.fields?.last_name ||
                            teacher.fields?.middle_name ||
                            ''}
                        </div>
                        <div className="tm-para2">
                          {teacher.phone_number || ''}
                        </div>
                      </div>
                    </div>
                  </div>
                  {!teacher.phone_number && (
                    <div
                      className={`${styles.pending_teacher_announcement_no_phone_text} tm-para4`}
                    >
                      {t('phoneNumberNotAdded')}
                    </div>
                  )}
                </div>
              ))}
          </div>{' '}
        </>
      ) : (
        <div className={`${styles.text_message} tm-para3`}>
          {t('pendingTeachersTableEmptyMessage')}
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

export default SliderPendingTeachers
