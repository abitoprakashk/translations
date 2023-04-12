import {SearchBar, TabGroup, Table} from '@teachmint/krayon'
import classNames from 'classnames'
import {useEffect} from 'react'
import {useState} from 'react'
import {t} from 'i18next'
import {useDispatch, useSelector} from 'react-redux'
import {setPostReceiversList} from '../../../../../../redux/actions/commonActions'
import styles from './ReceiversList.module.css'
import useTableData from './hooks/useTableData'
import {RECEIVER_LIST_TABS} from '../../../../../../constants'
import {events} from '../../../../../../../../utils/EventsConstants'
export function ReceiversList({selectedMessage, setSelectedMessage}) {
  const [searchTerm, setSearchTerm] = useState('')
  const {receiversList} = useSelector(
    (state) => state.communicationInfo.common || []
  )
  const eventManager = useSelector((state) => state.eventManager)

  const {rows, columns, receivers} = useTableData({
    receiversList,
    searchTerm,
    selectedTab: selectedMessage.tab,
  })

  const selectTab = (tab) => setSelectedMessage((prev) => ({...prev, tab}))
  const dispatch = useDispatch()

  useEffect(() => {
    if (selectedMessage?.id) {
      dispatch(setPostReceiversList(selectedMessage.id))
    }
  }, [selectedMessage])

  return (
    <div>
      <div className={styles.topBar}>
        <div className={styles.tabGroupWrapper}>
          <TabGroup
            tabOptions={[
              {id: RECEIVER_LIST_TABS.READ, label: t('read')},
              {id: RECEIVER_LIST_TABS.UNREAD, label: t('unread')},
            ]}
            onTabClick={(tab) => selectTab(tab.id)}
            selectedTab={selectedMessage.tab}
            showMoreTab={false}
          />
        </div>
        <div className={styles.searchBarWrapper}>
          <SearchBar
            value={searchTerm}
            showSuggestion={false}
            placeholder={t('search')}
            handleChange={({value}) => setSearchTerm(value)}
            onFocus={() =>
              eventManager.send_event(
                events.COMMS_RULES_SENT_MESSAGES_VIEWERS_SEARCH_USED_TFI
              )
            }
          />
        </div>
      </div>
      <div className={classNames(styles.readStats, styles.para)}>
        {t(
          selectedMessage.tab === RECEIVER_LIST_TABS.READ
            ? 'readListText'
            : 'unreadListText',
          {count: receivers[selectedMessage.tab].length}
        )}
      </div>
      <Table cols={columns} rows={rows} />
    </div>
  )
}
