import React from 'react'
import {useTranslation} from 'react-i18next'
import SearchBox from '../../../../Common/SearchBox/SearchBox'
import styles from '../../PendingTeachers/PendingTeachers.module.css'

import userDefaultIcon from '../../../../../assets/images/icons/user-profile.svg'
import {sidebarData} from '../../../../../utils/SidebarItems'

const SliderPendingAdmins = (props) => {
  const {
    pendingAdmins,
    handleCheckboxToggle,
    handleSelectAll,
    selectedAdminsId,
    setSelectedAdminsId,
    isAllSelected,
    filter,
    setFilter,
    filteredAdminsList,
    setFilteredAdminsList,
  } = props
  const {t} = useTranslation()

  const handleSearchFilter = (valueWithCase) => {
    let value = valueWithCase.toLowerCase()
    setFilter(value)
    setSelectedAdminsId([])
    if (value) {
      let filteredList = pendingAdmins.filter((admin) => {
        if (
          admin.name?.toLowerCase()?.includes(value) ||
          admin.last_name?.toLowerCase()?.includes(value) ||
          admin.middle_name?.toLowerCase()?.includes(value)
        )
          return admin
      })
      let selectedList = filteredList.map((ele) => ele._id)
      setSelectedAdminsId([...selectedList])
      setFilteredAdminsList([...filteredList])
    }
  }

  return (
    <div className="">
      {pendingAdmins.length > 0 ? (
        <>
          <div className={styles.margin_bottom_32}>
            <SearchBox
              value={filter}
              placeholder={t('searchWithAdminName')}
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
                      (selectedAdminsId.length === pendingAdmins.length ||
                        selectedAdminsId.length === filteredAdminsList.length)
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
            <div className="tm-h6">{`${selectedAdminsId.length} selected`}</div>
          </div>
          <div
            className={`${styles.background_gray} ${styles.pending_teacher_slider_container_table_container}`}
          >
            {filter &&
              filteredAdminsList &&
              filteredAdminsList?.map((admin) => (
                <div
                  key={admin.id}
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
                          value={admin._id || ''}
                          checked={selectedAdminsId.includes(admin._id)}
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
                          src={admin.img_url || userDefaultIcon}
                          alt=""
                          className={
                            styles.pending_teacher_slider_container_table_teacher_img
                          }
                        />
                      </div>
                      <div className="">
                        <div
                          className={
                            admin.phone_number
                              ? styles.pending_teacher_name
                              : styles.pending_teacher_name_without_phone
                          }
                        >
                          {admin?.fields.name ||
                            admin?.fields.full_name ||
                            admin?.fields.first_name ||
                            admin?.fields.last_name ||
                            admin?.fields.middle_name ||
                            ''}
                        </div>
                        <div className="tm-para2">
                          {admin.phone_number || ''}
                        </div>
                      </div>
                    </div>
                  </div>
                  {!admin.phone_number && (
                    <div
                      className={`${styles.pending_teacher_announcement_no_phone_text} tm-para4`}
                    >
                      {t('phoneNumberNotAdded')}
                    </div>
                  )}
                </div>
              ))}
            {!filter &&
              selectedAdminsId &&
              pendingAdmins?.map((admin) => (
                <div
                  key={admin.id}
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
                          value={admin._id || ''}
                          checked={selectedAdminsId.includes(admin._id)}
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
                          src={admin.img_url || userDefaultIcon}
                          alt=""
                          className={
                            styles.pending_teacher_slider_container_table_teacher_img
                          }
                        />
                      </div>
                      <div className="">
                        <div
                          className={
                            admin.phone_number
                              ? styles.pending_teacher_name
                              : styles.pending_teacher_name_without_phone
                          }
                        >
                          {admin?.fields.full_name ||
                            admin?.fields.name ||
                            admin?.fields.first_name ||
                            admin?.fields.last_name ||
                            admin?.fields.middle_name ||
                            ''}
                        </div>
                        <div className="tm-para2">
                          {admin.phone_number || ''}
                        </div>
                      </div>
                    </div>
                  </div>
                  {!admin.phone_number && (
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
          {t('pendingAdminsTableEmptyMessage')}
          <div
            className={`${styles.text_message_redirect}`}
            onClick={() => history.push(sidebarData.ADMIN.route)}
          >
            {t('invite')}
          </div>
        </div>
      )}
    </div>
  )
}

export default SliderPendingAdmins
