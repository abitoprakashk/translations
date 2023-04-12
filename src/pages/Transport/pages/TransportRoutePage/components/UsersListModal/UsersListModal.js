import {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import styles from './usersListModal.module.css'
import {
  Avatar,
  AVATAR_CONSTANTS,
  Badges,
  BADGES_CONSTANTS,
  BUTTON_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  Modal,
  MODAL_CONSTANTS,
  Para,
  PARA_CONSTANTS,
  SearchBar,
} from '@teachmint/krayon'
import {getDownloadCSV} from '../../../../../../utils/Helpers'
export default function UsersListModal({
  showModal,
  onModalClose,
  title,
  userIdsList,
  onDownloadClick,
}) {
  if (!showModal) return null

  const [usersData, setUsersData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [searchText, setSearchText] = useState('')
  const {t} = useTranslation()
  const studentsData = useSelector((state) => state?.instituteActiveStudentList)
  const teachersData = useSelector((state) => state?.instituteActiveTeacherList)

  const userTypeMap = {
    2: t('teacher'),
    4: t('student'),
  }

  useEffect(() => getUsersFromIds(userIdsList), [userIdsList])

  useEffect(() => getFilteredData(searchText), [usersData])

  const getUsersFromIds = (userIdsList) => {
    const students = studentsData.filter((obj) =>
      userIdsList?.includes(obj._id)
    )
    const teachers = teachersData.filter((obj) =>
      userIdsList?.includes(obj._id)
    )
    setUsersData([...students, ...teachers])
  }

  const getCsv = (value) => {
    const lines = []
    const headings = [
      t('name'),
      t('type'),
      t('pNumber'),
      t('classrooms'),
      t('enrollmentNumber'),
    ]
    lines.push(headings)
    value.forEach((obj) => {
      const line = [
        obj.name,
        userTypeMap[obj.type],
        obj.phone_number,
        obj.classrooms,
        obj.enrollment_number,
      ]
      lines.push(line)
    })
    const csvString = lines.map((line) => line.join(',')).join('\n')
    return csvString
  }

  const handleDownload = () => {
    onDownloadClick()
    const csvString = getCsv(usersData)
    getDownloadCSV(`${title}.csv`, csvString)
  }

  const handleSearchFilter = ({value}) => {
    setSearchText(value)
    getFilteredData(value)
  }

  const getFilteredData = (value) => {
    let filteredDataList = usersData

    if (value) {
      filteredDataList = filteredDataList?.filter(
        (item) =>
          item?.name?.toLowerCase()?.includes(value) ||
          item?.classroom?.toLowerCase()?.includes(value) ||
          item?.enrollment_number?.toLowerCase()?.includes(value)
      )
    }
    setFilteredData(filteredDataList)
  }

  const DownloadButton = () => {
    return (
      <div className={styles.downloadButton}>
        <Icon
          name={'download'}
          size={ICON_CONSTANTS.SIZES.XX_SMALL}
          version={ICON_CONSTANTS.VERSION.OUTLINED}
          type={ICON_CONSTANTS.TYPES.PRIMARY}
        />
        {t('download')}
      </div>
    )
  }

  return (
    <Modal
      header={title}
      classes={{modal: styles.modal}}
      isOpen={showModal}
      onClose={onModalClose}
      actionButtons={[
        {
          onClick: handleDownload,
          body: <DownloadButton />,
          type: BUTTON_CONSTANTS.TYPE.OUTLINE,
        },
      ]}
      size={MODAL_CONSTANTS.SIZE.X_LARGE}
      shouldCloseOnOverlayClick={false}
    >
      <div className={styles.wrapper}>
        <SearchBar
          placeholder={t('userSelectionSearchPlaceHolder')}
          value={searchText}
          handleChange={handleSearchFilter}
          classes={{wrapper: styles.searchBar}}
        />

        {filteredData?.length ? (
          <div className={styles.directoryWrapper}>
            {filteredData.map((user, i) => (
              <div key={i} className={styles.directoryItem}>
                <div className={styles.userInfo}>
                  <div className={styles.basicInfoWrapper}>
                    <Avatar
                      name={user.name}
                      size={AVATAR_CONSTANTS.SIZE.MEDIUM}
                    />
                    <div className={styles.basicInfo}>
                      <Para type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}>
                        {user.name}
                      </Para>
                      <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
                        {user.enrollment_number}
                      </Para>
                    </div>
                  </div>

                  {user.classroom && (
                    <Badges
                      label={user.classroom}
                      showIcon={false}
                      size={BADGES_CONSTANTS.SIZE.SMALL}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </Modal>
  )
}
