import {Table} from '@teachmint/common'
import {Icon, ICON_CONSTANTS} from '@teachmint/krayon'
import classNames from 'classnames'
import {useEffect, useRef, useState} from 'react'
import {useSelector} from 'react-redux'
import {useTranslation, Trans} from 'react-i18next'

import SliderScreen from '../../../../../../components/Common/SliderScreen/SliderScreen'
import SliderScreenHeader from '../../../../../../components/Common/SliderScreenHeader/SliderScreenHeader'
import SearchBox from '../../../../../../components/Common/SearchBox/SearchBox'
import LinearTabOptions from '../../../../../../components/Common/LinearTabOptions/LinearTabOptions'
import {searchBoxFilter} from '../../../../../../utils/Helpers'
import userProfileImg from '../../../../../../assets/images/icons/user-profile.svg'
import {
  RECEIVER_LIST_TABLE_HEADERS,
  MEMBER_TYPES,
} from './ReceiversList.constants'
import {
  getSharePostMessageText,
  getPostTypeInText,
} from '../../../../commonFunctions'
import {events} from '../../../../../../utils/EventsConstants'
import {announcementType, RECEIVER_LIST_TABS} from '../../../../constants'
import {shareOnWhatsAppApi} from '../../../../commonFunctions'
import styles from './ReceiversList.module.css'

export default function ReceiversList({
  setSliderOpen,
  tabId,
  post,
  showSmsTab = true,
}) {
  const [selectedTab, setSelectedTab] = useState(tabId)
  const [rowsData, setRowsData] = useState([])
  const [showData, setShowData] = useState([])
  const [countText, setCountText] = useState('')
  const [searchText, setSearchText] = useState('')
  const readList = useRef([])
  const unreadList = useRef([])
  const smsList = useRef([])
  const {receiversList} = useSelector((state) => state.communicationInfo.common)
  const eventManager = useSelector((state) => state.eventManager)
  const urlText = getSharePostMessageText(post)
  const url = `https://www.teachmint.com/announcement/${post._id}`
  const {t} = useTranslation()

  useEffect(() => {
    if (receiversList !== []) {
      setRowsData(receiversList)
    }
  }, [receiversList])

  useEffect(() => {
    let sms = [],
      read = [],
      unread = []
    rowsData.map((list) => {
      if (list.sms_sent) {
        sms.push(list)
      }
      if (list.read) {
        read.push(list)
      }
      if (!list.sms_sent && !list.read) {
        unread.push(list)
      }
    })

    readList.current = read
    unreadList.current = unread
    smsList.current = sms
    if (tabId === selectedTab) {
      handleTabChange(tabId)
    } else {
      handleTabChange(selectedTab)
    }
  }, [rowsData])

  useEffect(() => {
    eventManager.send_event(events.COMM_READ_SPLIT_TAB_SWITCHED, {
      post_id: post._id,
      post_type: getPostTypeInText(post.announcement_type),
      tab_name: selectedTab,
    })
  }, [selectedTab])

  useEffect(() => {
    setSelectedTab(tabId)
    handleTabChange(tabId)
  }, [tabId])

  const headerIcon = (
    <div className={styles.headerIcon}>
      <Icon
        name="announcement"
        type={ICON_CONSTANTS.TYPES.BASIC}
        version={ICON_CONSTANTS.VERSION.FILLED}
        size={ICON_CONSTANTS.SIZES.SMALL}
      />
    </div>
  )
  const tabOptions = [
    {
      label: `${
        post.announcement_type === announcementType.ANNOUNCEMENT
          ? t('unread')
          : t('pending')
      } (${unreadList?.current.length})`,
      id: RECEIVER_LIST_TABS.UNREAD,
    },
    {
      label: `${
        post.announcement_type === announcementType.ANNOUNCEMENT
          ? t('read')
          : t('seen')
      } (${readList?.current.length})`,
      id: RECEIVER_LIST_TABS.READ,
    },
  ]

  if (showSmsTab) {
    tabOptions.push({
      label: t('smsSentCount', {count: smsList?.current.length}),
      id: RECEIVER_LIST_TABS.SMS,
    })
  }

  const handleTabChange = (id) => {
    setSelectedTab(id)
    switch (id) {
      case RECEIVER_LIST_TABS.READ: {
        setShowData(readList.current)
        setCountText(
          <Trans
            i18nKey="readListText"
            values={{count: readList.current.length}}
          />
        )
        break
      }
      case RECEIVER_LIST_TABS.UNREAD: {
        setShowData(unreadList.current)
        setCountText(
          <Trans
            i18nKey="unreadListText"
            values={{count: unreadList.current.length}}
          />
        )
        break
      }
      case RECEIVER_LIST_TABS.SMS: {
        setShowData(smsList.current)
        setCountText(
          <Trans
            i18nKey="smsListText"
            values={{count: smsList.current.length}}
          />
        )
        break
      }
    }
  }

  const getRows = (row) => {
    let rows = []
    row?.map((rowData) =>
      rowData.type === MEMBER_TYPES.STUDENT ||
      rowData.type === MEMBER_TYPES.TEACHER
        ? rows.push({
            studentDetails: (
              <div className={classNames(styles.userInfo, styles.bg)}>
                <img
                  className={styles.profilePic}
                  src={rowData.img_url || userProfileImg}
                  alt=""
                />

                <div className={styles.nameContainer}>
                  <div className={styles.name}>{rowData.name}</div>
                  <div className={styles.phone}>
                    {rowData.phone_number || rowData.email}
                  </div>
                </div>
              </div>
            ),
            classAndSection: (
              <span>
                {rowData.standard || '-'}&nbsp;{rowData.section}
              </span>
            ),
            role: (
              <span className={styles.role}>
                {rowData.type === MEMBER_TYPES.TEACHER
                  ? t('teacher')
                  : t('student')}
              </span>
            ),
            action: (
              <div
                className={classNames({[styles.actions]: rowData.phone_number})}
                onClick={
                  rowData.phone_number
                    ? () => {
                        shareOnWhatsAppApi({
                          text: urlText,
                          phoneNumber: rowData.phone_number,
                          url: url,
                        })
                        eventManager.send_event(
                          events.COMM_READ_SPLIT_WHATSAPP_SHARE,
                          {
                            post_id: post._id,
                            post_type: getPostTypeInText(
                              post.announcement_type
                            ),
                            whatsapp_recepient_uid: rowData._id,
                          }
                        )
                      }
                    : null
                }
              >
                {rowData.phone_number && (
                  <Icon
                    name="whatsapp"
                    type={ICON_CONSTANTS.TYPES.SUCCESS}
                    size={ICON_CONSTANTS.SIZES.XX_SMALL}
                  />
                )}
                <span className={styles.actionText}>
                  {rowData.phone_number ? t('sharePost') : '-'}
                </span>
              </div>
            ),
          })
        : null
    )
    return rows
  }

  const handleSearchFliter = (text) => {
    setSearchText(text)
    let searchParams = [['name'], ['phone_number'], ['email']]
    if (text === '') {
      setRowsData(receiversList)
    } else {
      setRowsData(searchBoxFilter(text, rowsData, searchParams))
    }
  }
  return (
    <SliderScreen setOpen={() => setSliderOpen(null)} width="800">
      <SliderScreenHeader icon={headerIcon} title={t('receiverListHeader')} />
      <div className={styles.outsideWrapper}>
        <div
          onClick={() =>
            eventManager.send_event(events.COMM_READ_SPLIT_SEARCH_USED, {
              post_id: post._id,
              post_type: getPostTypeInText(post.announcement_type),
            })
          }
          className={styles.searchBox}
        >
          <SearchBox
            placeholder={'search...'}
            value={searchText}
            handleSearchFilter={handleSearchFliter}
          />
        </div>
        <LinearTabOptions
          className={styles.tabGroup}
          options={tabOptions}
          selected={selectedTab}
          handleChange={handleTabChange}
        />

        <div className={styles.infoText}>{countText}</div>
        <div className={styles.tableWrapper}>
          <Table
            cols={RECEIVER_LIST_TABLE_HEADERS}
            rows={getRows(showData)}
            className={styles.table}
          />
        </div>
      </div>
    </SliderScreen>
  )
}
