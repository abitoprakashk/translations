import React, {useEffect, useState} from 'react'
import {Trans, useTranslation} from 'react-i18next'
import PropTypes from 'prop-types'
import styles from './UserSelection.module.css'
import {
  Avatar,
  AVATAR_CONSTANTS,
  Badges,
  BADGES_CONSTANTS,
  Checkbox,
  Icon,
  ICON_CONSTANTS,
  Para,
  PARA_CONSTANTS,
  SearchBar,
  TabGroup,
  Table,
} from '@teachmint/krayon'
import {useSelector} from 'react-redux'
import {arrayToObject} from '../../../utils/Helpers'

const directoryTabs = [
  {
    label: <Trans i18nKey="studentDirectory">Student Directory</Trans>,
    id: 'student',
  },
  {
    label: <Trans i18nKey="teacherDirectory">Teacher Directory</Trans>,
    id: 'teacher',
  },
]

export default function UserSelection({
  data,
  handleChange,
  showSelectAll,
  disabledIds,
  isMultiSelect,
  hiddenIdsSet,
  suffixIcon,
}) {
  const [selectedDirectory, setSelectedDirectory] = useState(
    directoryTabs?.[0]?.id
  )
  const [studentsList, setStudentsList] = useState([])
  const [teachersList, setTeachersList] = useState([])
  const [searchText, setSearchText] = useState('')
  const [selectAllChecked, setSelectAllChecked] = useState(false)
  const [disabledObj, setDisabledObj] = useState({})

  const {instituteActiveStudentList, instituteActiveTeacherList} = useSelector(
    (state) => state
  )

  const {t} = useTranslation()

  // Create initial state and update based on any change
  useEffect(() => {
    if (!isMultiSelect) return
    const dataTemp = {...data}
    const items = [
      'initialSelected',
      'newAdded',
      'newRemoved',
      'fullSelectedList',
    ]
    let updated = false

    items.forEach((item) => {
      if (!dataTemp[item]) {
        updated = true
        dataTemp[item] = []
      }
    })

    if (updated) {
      dataTemp['fullSelectedList'] = [...dataTemp['initialSelected']]
      dataTemp['initailSelectedObject'] = dataTemp['initialSelected'].reduce(
        (acc, cur) => ({...acc, [cur]: cur}),
        {}
      )
      handleChange(dataTemp)
    } else {
      updateStudentDisplayList()
      updateTeacherDisplayList()
    }
  }, [data])

  // Update disable obj based disableids data
  useEffect(() => {
    let studentIds = [],
      teacherIds = []
    disabledIds?.map((id) => {
      if (instituteActiveStudentList?.find(({_id}) => _id === id))
        studentIds.push(id)
      else teacherIds.push(id)
    })

    setDisabledObj({studentIds, teacherIds})
  }, [disabledIds])

  // Update students display list if instituteActiveStudentList updated
  useEffect(() => {
    updateStudentDisplayList()
  }, [disabledObj, instituteActiveStudentList])

  // Update teachers display list if instituteActiveTeacherList updated
  useEffect(() => {
    updateTeacherDisplayList()
  }, [disabledObj, instituteActiveTeacherList])

  // Update select all on changing student list, teacher list(changing state) or selected directory
  useEffect(() => {
    if (showSelectAll)
      setSelectAllChecked(
        getSelectedUsersCount() ===
          (getSelectedDirectoryUserList()?.length || 0) -
            (selectedDirectory === directoryTabs?.[0]?.id
              ? disabledObj?.studentIds?.length || 0
              : disabledObj?.teacherIds?.length || 0)
      )
  }, [disabledObj, studentsList, teachersList, selectedDirectory])

  // Get current directory user list
  const getSelectedDirectoryUserList = () =>
    selectedDirectory === directoryTabs?.[0]?.id ? studentsList : teachersList

  // Get Selected user count based on current directory
  const getSelectedUsersCount = () =>
    getSelectedDirectoryUserList()?.filter(({isSelected}) => isSelected)?.length

  // Student display list update function
  const updateStudentDisplayList = () =>
    setStudentsList(updateDisplayList(instituteActiveStudentList))

  // Teacher display list update function
  const updateTeacherDisplayList = () =>
    setTeachersList(updateDisplayList(instituteActiveTeacherList))

  // Get display user list function
  const updateDisplayList = (userList) => {
    let userListTemp = {}
    let newUserList = []

    // Create object from array (key as _id)
    userList?.forEach((item) => {
      userListTemp[item?._id] = {
        ...item,
        isSelected: data['fullSelectedList']?.find((id) => id === item?._id),
      }
    })

    // Add all original selected to top
    data['initialSelected']?.forEach((item) => {
      if (userListTemp[item]) {
        newUserList.push(userListTemp[item])
        delete userListTemp[item]
      }
    })

    // Add rest of students
    newUserList = [...newUserList, ...Object.values(userListTemp)]

    if (hiddenIdsSet && hiddenIdsSet.size > 0) {
      newUserList = newUserList?.filter((obj) => !hiddenIdsSet.has(obj._id))
    }

    return newUserList
  }

  // Handle select change
  const handleSelectChange = (ids, value) => {
    let newAdded = arrayToObject(data['newAdded'])
    let newRemoved = arrayToObject(data['newRemoved'])
    let fullSelectedList = arrayToObject(data['fullSelectedList'])

    if (value) {
      ids?.forEach((item) => {
        // Add to fullSelectedList
        fullSelectedList[item] = item

        // Check if newly selected
        if (data['initailSelectedObject'][item]) {
          delete newRemoved[item]
        } else {
          newAdded[item] = item
        }
      })
    } else {
      ids?.forEach((item) => {
        // Add to fullSelectedList
        delete fullSelectedList[item]

        // Check if newly selected
        if (data['initailSelectedObject'][item]) {
          newRemoved[item] = item
        } else {
          delete newAdded[item]
        }
      })
    }

    handleChange({
      ...data,
      newAdded: Object.keys(newAdded),
      newRemoved: Object.keys(newRemoved),
      fullSelectedList: Object.keys(fullSelectedList),
    })
  }

  // Handle select all
  const handleSelectAll = ({value}) =>
    handleSelectChange(
      [
        ...getSelectedDirectoryUserList()
          ?.map(({_id}) => _id)
          ?.filter((userId) =>
            disabledIds?.find((item) => item === userId) ? false : true
          ),
      ],
      value
    )

  const getFilteredData = (data) => {
    let value = searchText.toLowerCase()

    if (value) {
      let filteredDataList = data?.filter((item) => {
        if (
          item?.name?.toLowerCase()?.includes(value) ||
          item?.hierarchy_nodes[0]?.toLowerCase()?.includes(value) ||
          item?.enrollment_number?.toLowerCase()?.includes(value) ||
          item?.classroom?.toLowerCase()?.includes(value)
        )
          return item
      })
      return filteredDataList
    }
    return data
  }

  const getTableRows = () => {
    const filteredList = getFilteredData(getSelectedDirectoryUserList())

    const enabled = [],
      disabled = []

    filteredList?.map((passenger) => {
      if (disabledIds?.find((item) => item === passenger?._id))
        disabled.push(passenger)
      else enabled.push(passenger)
    })

    const finalList = [...enabled, ...disabled]

    return finalList?.map(
      ({
        _id,
        name,
        enrollment_number,
        hierarchy_nodes,
        classroom,
        isSelected,
      }) => {
        let isDisabled = disabledIds?.find((item) => item === _id)
          ? true
          : false

        const content = (
          <div className={styles.userInfo}>
            <div className={styles.basicInfoWrapper}>
              <Avatar name={name} size={AVATAR_CONSTANTS.SIZE.MEDIUM} />
              <div className={styles.basicInfo}>
                <Para type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}>{name}</Para>
                <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
                  {enrollment_number}
                </Para>
              </div>
            </div>
            <div className={styles.rowEnd}>
              {(hierarchy_nodes?.length > 0 || classroom) && (
                <Badges
                  label={
                    hierarchy_nodes?.length > 0 ? hierarchy_nodes[0] : classroom
                  }
                  showIcon={false}
                  size={BADGES_CONSTANTS.SIZE.SMALL}
                />
              )}
              {suffixIcon && (
                <Icon name={suffixIcon} size={ICON_CONSTANTS.SIZES.XX_SMALL} />
              )}
            </div>
          </div>
        )

        return {
          data: (
            <div key={_id} className={styles.directoryItem}>
              {isMultiSelect ? (
                <Checkbox
                  classes={{wrapper: styles.checkboxWrapper}}
                  isSelected={isSelected}
                  fieldName={_id}
                  handleChange={({fieldName, value}) =>
                    handleSelectChange([fieldName], value)
                  }
                  isDisabled={isDisabled}
                >
                  {content}
                </Checkbox>
              ) : (
                <div
                  className={styles.rowWrapper}
                  onClick={() => handleChange(_id)}
                >
                  {content}
                </div>
              )}
            </div>
          ),
        }
      }
    )
  }

  // Return JSX
  return (
    <div>
      <div className={styles.tabGroupWrapper}>
        <TabGroup
          tabOptions={directoryTabs}
          onTabClick={(tab) => setSelectedDirectory(tab?.id)}
          selectedTab={selectedDirectory}
          showMoreTab={false}
        />
      </div>

      <SearchBar
        placeholder={t('userSelectionSearchPlaceHolder')}
        value={searchText}
        handleChange={({value}) => {
          setSearchText(value)
        }}
        classes={{wrapper: styles.searchBar}}
      />

      <div className={styles.directoryWrapper}>
        {isMultiSelect && (
          <div className={styles.directoryHeader}>
            {showSelectAll && (
              <div className={styles.selectAllWrapper}>
                <Checkbox
                  classes={{wrapper: styles.selectAllCheckboxWrapper}}
                  isSelected={selectAllChecked}
                  handleChange={handleSelectAll}
                >
                  <Para>
                    {selectedDirectory === directoryTabs?.[0]?.id
                      ? t('studentList')
                      : t('teacherList')}
                  </Para>
                </Checkbox>
              </div>
            )}
            <div className={styles.selectedWrapper}>
              <Para className={styles.selectedCount}>
                {getSelectedUsersCount()}
              </Para>
              <Para>{`/${getSelectedDirectoryUserList()?.length || 0} ${t(
                'selected'
              )}`}</Para>
            </div>
          </div>
        )}

        <div className={styles.tableWrapper}>
          <Table
            rows={getTableRows()}
            hideTableHeader={true}
            cols={[{key: 'data', label: ''}]}
            classes={{table: styles.table, td: styles.td}}
            virtualized={true}
            autoSize
          />
        </div>
      </div>
    </div>
  )
}

UserSelection.prototype = {
  data: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  showSelectAll: PropTypes.bool,
  isMultiSelect: PropTypes.bool,
}

UserSelection.defaultProps = {
  showSelectAll: true,
  isMultiSelect: true,
  disabledIds: [],
}
