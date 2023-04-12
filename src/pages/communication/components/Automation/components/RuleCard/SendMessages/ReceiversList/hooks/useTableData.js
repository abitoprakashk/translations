import {useMemo} from 'react'
import UserInfo from '../../../../../../../../../components/Common/Krayon/UserInfo'
import {MEMBER_TYPES} from '../../../../../../Posts/components/ReceiversList/ReceiversList.constants'
import {t} from 'i18next'
import styles from '../ReceiversList.module.css'
import {searchBoxFilter} from '../../../../../../../../../utils/Helpers'
import {RECEIVER_LIST_TABS} from '../../../../../../../constants'

const COLUMNS = [
  {key: 'name', label: t('receiverName')},
  {key: 'class', label: t('class')},
  {key: 'role', label: t('role')},
]

const SEARCH_PARAMS = [['name'], ['phone_number'], ['email']]

const useTableData = ({receiversList, selectedTab, searchTerm}) => {
  const receivers = useMemo(() => {
    const read = []
    const unread = []

    receiversList.forEach((item) => {
      if (item.read) {
        read.push(item)
      } else if (!item.sms_sent) {
        unread.push(item)
      }
    })

    return {
      [RECEIVER_LIST_TABS.READ]: read,
      [RECEIVER_LIST_TABS.UNREAD]: unread,
    }
  }, [receiversList])

  const currentList = receivers[selectedTab] || []

  const filteredList = useMemo(() => {
    const searchedRows = searchBoxFilter(searchTerm, currentList, SEARCH_PARAMS)
    return getTableRows(searchedRows)
  }, [currentList, searchTerm])

  return {rows: filteredList, columns: COLUMNS, receivers}
}

const getTableRows = (receivers) =>
  receivers.map((receiver) => ({
    name: (
      <UserInfo
        name={receiver.name}
        designation={receiver.phone_number || receiver.email}
        profilePic={receiver.img_url}
      />
    ),
    class: (
      <span className={styles.para}>
        {receiver.standard ? `${receiver.standard} - ${receiver.section}` : '-'}
      </span>
    ),
    role: (
      <span className={styles.para}>
        {receiver.type === MEMBER_TYPES.TEACHER ? t('teacher') : t('student')}
      </span>
    ),
  }))

export default useTableData
