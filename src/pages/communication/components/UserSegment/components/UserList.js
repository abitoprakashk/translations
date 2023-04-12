import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Tag} from '@teachmint/common'
import classNames from 'classnames'
import {
  setTotalNoOfUsersAction,
  setSeletedUsersAction,
} from '../../../redux/actions/commonActions'
import styles from '../UserSegment.module.css'
import {
  VERIFICATION_STATUS,
  VERIFICATION_STATUS_ENUM,
  USER_FILTER_RADIO,
} from '../../../constants'
import UserDefaultIcon from '../../../../../assets/images/icons/user-profile.svg'
import {useTranslation} from 'react-i18next'
import {Input, Icon} from '@teachmint/common'
import {events} from '../../../../../utils/EventsConstants'
import {getPostTypeInText} from '../../../commonFunctions'
import {SearchBar} from '@teachmint/krayon'
import {Table as KrayonTable} from '@teachmint/krayon'
import {Tooltip} from '@teachmint/krayon'
import {roleType} from '../../../constants'
const UserList = ({
  list,
  tagData,
  clearAll,
  setSendUsersTo,
  addOrApplyFilter,
  isSelectAll,
  isUnassigned,
  isUncategorised,
}) => {
  const {t} = useTranslation()
  const tJoined = t('joined')
  const tPending = t('pending')
  const tSelected = t('selected')
  const tSearch = t('search')
  const {common} = useSelector((state) => state.communicationInfo)
  const {eventManager} = useSelector((state) => state)
  const [filteredList, setFilteredList] = useState(list)
  const [searchString, setSearchString] = useState('')
  const {segments, selected_users, announcement_type} = useSelector(
    ({communicationInfo}) => communicationInfo.common
  )
  const {unusedQuota} = useSelector((state) => state.communicationInfo.sms)
  const dispatch = useDispatch()

  useEffect(() => {
    setFilteredList(list)
  }, [list])

  const onRadioChangeValue = (value) => {
    let res = [value]
    if (value == 'all') {
      res = ['teacher', 'student', 'unassigned']
    }
    setSendUsersTo(res)
    eventManager.send_event(events.COMM_USER_SEGMENT_CLICKED, {
      user_segment: value,
      post_type: getPostTypeInText(announcement_type),
    })
  }

  useEffect(() => {
    dispatch(setTotalNoOfUsersAction(selected_users.length))
  }, [])
  const handleRowSelect = (rowId, checked) => {
    const newSet = new Set(selected_users)
    checked ? newSet.add(rowId) : newSet.delete(rowId)
    dispatch(setSeletedUsersAction(Array.from(newSet)))
    dispatch(setTotalNoOfUsersAction(newSet.size))
  }

  const handleSelectAll = (checked) => {
    const newSet = new Set(checked ? rows.map((r) => r.id) : [])
    dispatch(setSeletedUsersAction(Array.from(newSet)))
    dispatch(setTotalNoOfUsersAction(newSet.size))
  }

  const handleTextChange = ({value}) => {
    setSearchString(value)
    if (value === '') {
      setFilteredList(list)
      return
    }
    const str = value.toLowerCase()
    let res = list.filter(
      (item) =>
        item.phone_number.indexOf(str) !== -1 ||
        item.name.toLowerCase().replace('  ', ' ').indexOf(str) !== -1
    )
    setFilteredList(res)
  }

  const renderTags = () => {
    if (!tagData) return null
    return tagData.map((item) => (
      <span key={item.id} className={styles.tag}>
        {item.name}
      </span>
    ))
  }

  const isClearAllVisible = () => {
    return tagData.length ? true : false
  }

  const segmentDropdownValue = () => {
    if (segments.includes('teacher') && segments.includes('student'))
      return 'all'
    if (segments.includes('teacher')) return 'teacher'
    if (segments.includes('student')) return 'student'
  }
  const rows = filteredList.map((rowData) => ({
    id: rowData._id,
    studentDetails: (
      <div className="flex">
        <img
          className={styles.userDP}
          src={rowData.img_url || UserDefaultIcon}
          alt=""
        />
        <div className={styles.userNameNumberStatusSec}>
          <div className={styles.link}>{rowData.name}</div>
          <div className={styles.phoneNumberAndStatusSec}>
            <span className={styles.phnNumber}>
              {rowData?.enrollment_number ||
                rowData?.phone_number ||
                rowData.email}
            </span>
            <div className={styles.inlineBlock}>
              {VERIFICATION_STATUS_ENUM[rowData.verification_status] ===
                VERIFICATION_STATUS.JOINED && (
                <Tag accent="success" content={tJoined} />
              )}
              {VERIFICATION_STATUS_ENUM[rowData.verification_status] ===
                VERIFICATION_STATUS.PENDING && (
                <Tag accent="danger" content={tPending} />
              )}
            </div>
          </div>
        </div>
      </div>
    ),
    type: (
      <span
        className={classNames('text-capitalize', styles.userSegmentUserType)}
      >
        {roleType[rowData.type]}
      </span>
    ),
  }))

  const cols = [
    {key: 'studentDetails', label: 'Select All'},
    {
      key: 'type',
      label: (
        <div
          className={styles.tableHeaderWrapper}
          data-tip
          data-for="userListToolTip"
        >
          {common.selected_users.length > unusedQuota && (
            <Icon
              name="error"
              type="outlined"
              color="error"
              size="xxs"
              className={styles.tableHeaderIcon}
            />
          )}
          <span
            className={classNames(styles.tableHeaderText, {
              [styles.tableHeaderErrorState]:
                common.selected_users.length > unusedQuota,
            })}
          >
            {common.selected_users.length} {tSelected}
          </span>
          {common.selected_users.length > unusedQuota && (
            <Tooltip
              place="top"
              toolTipId="userListToolTip"
              toolTipBody={
                'You can only select ' + `${unusedQuota}` + ' receivers now'
              }
              classNames={{toolTipBody: styles.tableHeaderToolTipBody}}
            />
          )}
        </div>
      ),
    },
  ]
  const renderRadios = () => {
    return (
      <div className={styles.filterGroup}>
        <div className={styles.filterLabel}>Filter by users</div>
        <Input
          type="select"
          classes={{wrapper: styles.dropDownWrapper}}
          className={styles.dropDown}
          value={segmentDropdownValue()}
          options={USER_FILTER_RADIO}
          onChange={({value}) => onRadioChangeValue(value)}
        />
      </div>
    )
  }
  const renderFilterLabel = () => {
    if (isSelectAll && !isUnassigned && !isUncategorised) {
      return 'All classes'
    } else {
      if (tagData.length) {
        return `${tagData.length} selected`
      }
    }
    return 'All classes'
  }
  return (
    <div>
      <div className={styles.actionSection}>
        <div className={styles.searchBoxSection}>
          <SearchBar
            placeholder={tSearch}
            value={searchString}
            handleChange={handleTextChange}
          />
        </div>

        <div className={styles.filterSection}>
          <div>{renderRadios()}</div>
          <div className={styles.filterGroup}>
            <div className={styles.filterLabel}>Filter by classes</div>
            <button className={styles.addFilterBtn} onClick={addOrApplyFilter}>
              {renderFilterLabel()}
              <Icon
                name="downArrow"
                size="xxs"
                className={styles.addFilterIcon}
              />
            </button>
          </div>
        </div>
      </div>
      {tagData.length ? (
        <div className={styles.filterTagContainer}>
          <div className={styles.filterTags}>{renderTags()}</div>
          {isClearAllVisible() && (
            <span className={styles.clearAll} onClick={clearAll}>
              <Icon name="restore" color="error" size="xxxs" />
              {t('resetFilters')}
            </span>
          )}
        </div>
      ) : null}
      <div className={styles.tableListContianer}>
        <KrayonTable
          rows={rows}
          cols={cols}
          isSelectable={true}
          selectedRows={selected_users}
          onSelectRow={handleRowSelect}
          onSelectAll={handleSelectAll}
          uniqueKey="id"
        />
      </div>
    </div>
  )
}

export default UserList
