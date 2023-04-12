import React from 'react'
import Posts from '../Posts/Posts'
import {useSelector, useDispatch} from 'react-redux'
import {useEffect} from 'react'
import {announcementType} from '../../constants'
import {VirtualizedLazyList} from '@teachmint/common'
import styles from './SmsListing.module.css'
import {useState} from 'react'
import {
  Button,
  BUTTON_CONSTANTS,
  Divider,
  Modal,
  SearchBar,
  ICON_CONSTANTS,
  Chips,
  EmptyState,
} from '@teachmint/krayon'
import {fetchPostsDataRequestAction} from '../../redux/actions/postsActions'
import {Credits} from '../Sms/components/Credits/Credits'
import {t} from 'i18next'
import {Trans} from 'react-i18next'
import communicationStyles from '../../Communication.module.css'
import Permission from '../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'
import FilterModal from '../FilterModal/FilterModal'
import {getTimeFilterCheck} from '../../commonFunctions'
import {isMobile} from '@teachmint/krayon'
import {FILTER_OPTIONS, FILTER_KEYS} from '../FilterModal/Filter.constants'

export default function SmsListing({
  forceShowRechargeSms,
  setForceShowRechargeSms,
  handleSendSMS,
}) {
  const postList = useSelector(
    (state) => state.communicationInfo.posts.postList
  )
  const unusedQuota = useSelector(
    (state) => state.communicationInfo.sms.unusedQuota
  )
  const blockPrice = useSelector(
    (state) => state.communicationInfo.sms.blockPrice
  )
  const [smsList, setSmsList] = useState([])
  const [filteredList, setFilteredlist] = useState([])
  const [filterOptions, setFilterOptions] = useState({})
  const [chipOptions, setChipOptions] = useState([])
  const [rechargeModalOpen, setRechargeModalOpen] = useState(false)
  const [filterModalOpen, setFilterModalOpen] = useState(false)
  const [searchText, setSearchText] = useState(null)
  const dispatch = useDispatch()

  useEffect(() => {
    if (forceShowRechargeSms) {
      setRechargeModalOpen(true)
    }
    setForceShowRechargeSms(false)
  }, [forceShowRechargeSms])

  useEffect(() => {
    dispatch(fetchPostsDataRequestAction())
  }, [])

  useEffect(() => {
    getAllSmsList()
  }, [postList])

  useEffect(() => {
    getChipOptions()
  }, [filterOptions])

  const getAllSmsList = () => {
    let tempList = postList.filter((item) => {
      return item.announcement_type === announcementType.SMS
    })
    setSmsList(tempList)
    setFilteredlist(tempList)
  }

  const handleSearch = ({value}) => {
    setSearchText(value)
    if (value) {
      let tempSearch = filteredList.filter((item) => {
        return (
          item.title?.toLowerCase().includes(value) ||
          item.message?.toLowerCase().includes(value)
        )
      })
      setFilteredlist(tempSearch)
    } else {
      applyFilters(filterOptions)
    }
  }

  const postJsx = ({item}) => {
    return (
      <Posts
        showHeading={false}
        key={item._id}
        post={item}
        editIt={() => {}}
        setIsFeedbackSilderOpen={() => {}}
        handleTabClick={() => {}}
      />
    )
  }

  const getChipOptions = () => {
    let chipList = []
    Object.entries(filterOptions).map(([key, value]) => {
      if (!Object.keys(FILTER_OPTIONS).includes(key)) {
        return
      }
      if (key === 'time') {
        FILTER_OPTIONS[key].children.map((ele) => {
          if (ele.value === value) {
            chipList.push({id: `${key}_${value}`, label: ele.label})
          }
        })
      } else {
        value.map((val) => {
          let obj = FILTER_OPTIONS[key].children.find(
            (ele) => ele.value === val
          )
          if (obj) {
            chipList.push({id: `${key}_${val}`, label: obj.label})
          }
        })
      }
    })
    setChipOptions(chipList)
  }

  const onChipClose = (id) => {
    let [key, value] = id.split('_')
    let newOptions = {...filterOptions}
    if (key === FILTER_KEYS.TIME) {
      delete newOptions[key]
      setFilterOptions(newOptions)
    } else {
      let checkVal = +value
      if (isNaN(checkVal)) {
        checkVal = value
      }
      let index = newOptions[key].indexOf(checkVal)
      newOptions[key].splice(index, 1)
      setFilterOptions(newOptions)
    }
    applyFilters(newOptions)
  }

  const getFilteredPosts = () => {
    if (!smsList.length) {
      return (
        <div className={styles.emptyStateContainer}>
          <EmptyState
            content={t('noSmsSentLabel')}
            iconName="chat1"
            button={{
              children: t('sendSMS'),
              onClick: handleSendSMS,
            }}
          />
        </div>
      )
    }

    return (
      <div className={styles.virtualisedWrapper}>
        {filteredList.length ? (
          <VirtualizedLazyList
            itemCount={filteredList.length}
            itemSize={2}
            rowsData={filteredList}
            loadMoreItems={() => {}}
            RowJSX={postJsx}
            dynamicSize={true}
            loadMorePlaceholder={<div className="loader" />}
            showLoadMorePlaceholder={false}
          />
        ) : (
          <div className={communicationStyles.postNotFoundSec}>
            <div>{t('postsNotFound')}</div>
          </div>
        )}
      </div>
    )
  }

  const applyFilters = (selected) => {
    if (!Object.keys(selected).length) {
      setFilteredlist(smsList)
    } else {
      const newPostList = smsList.filter((item) => {
        const receiverCondition = selected?.[FILTER_KEYS.RECEIVER]?.length
          ? item.segments.some((val) =>
              selected[FILTER_KEYS.RECEIVER]?.includes(val)
            )
          : true

        const timeCondition =
          FILTER_KEYS.TIME in selected
            ? getTimeFilterCheck(
                item,
                selected[FILTER_KEYS.TIME],
                selected.range
              )
            : true
        const smsTypeCondition = selected?.[FILTER_KEYS.SMS_TYPE]?.length
          ? selected[FILTER_KEYS.SMS_TYPE].includes(+item.automated)
          : true
        return receiverCondition && timeCondition && smsTypeCondition
      })
      setFilteredlist(newPostList)
    }
    setFilterModalOpen(false)
    setFilterOptions(selected)
  }
  return (
    <div className={styles.contentContainer}>
      <div className={styles.listsContainer}>
        <div className={styles.heading}>{t('smsListingHeading')}</div>
        <div className={communicationStyles.communicationActions}>
          {!!smsList.length && (
            <div className={communicationStyles.searchBoxContainer}>
              <div className={communicationStyles.searchBoxWrapper}>
                <SearchBar value={searchText} handleChange={handleSearch} />
              </div>
              {!isMobile() && (
                <Button
                  type={BUTTON_CONSTANTS.TYPE.OUTLINE}
                  onClick={() => {
                    setFilterModalOpen(true)
                  }}
                  children={t('filters')}
                  prefixIcon="filter"
                  prefixIconVersion={ICON_CONSTANTS.VERSION.OUTLINED}
                />
              )}
            </div>
          )}
          {!!chipOptions.length && (
            <div className={styles.chips}>
              <Chips chipList={chipOptions} onChange={onChipClose} />
            </div>
          )}
        </div>
        {getFilteredPosts()}
      </div>
      <div className={styles.rechargeWrapper}>
        <div className={styles.rechargeContainer}>
          <div className={styles.rechargeText}>
            <div className={styles.smsCount}>{unusedQuota}</div>
            <div>{t('smsRemaining')}</div>
          </div>
          <div className={styles.divider}>
            <Divider spacing="0px" />
          </div>
          <Permission
            permissionId={
              PERMISSION_CONSTANTS.SmsController_create_recharge_order_create
            }
          >
            <div className={styles.button}>
              <Button
                width={BUTTON_CONSTANTS.WIDTH.FULL}
                onClick={() => {
                  setRechargeModalOpen(true)
                }}
                children="Recharge SMS"
              />
              <div className={styles.smsPriceText}>
                <Trans
                  i18nKey={'smsRechargePrice'}
                  values={{price: blockPrice / 10}}
                />
              </div>
            </div>
          </Permission>
        </div>
      </div>
      {!isMobile() && filterModalOpen && (
        <FilterModal
          isOpen={filterModalOpen}
          onClose={() => setFilterModalOpen(false)}
          hideSections={[FILTER_KEYS.MESSAGE]}
          onApply={applyFilters}
          selected={filterOptions}
        />
      )}
      <Modal
        isOpen={rechargeModalOpen}
        onClose={() => {
          setRechargeModalOpen(false)
          setForceShowRechargeSms(false)
        }}
        header={t('rechargeWithSms')}
      >
        <div className={styles.rechargeModal}>
          <Credits
            isExternalRechargeOpen={true}
            showText={false}
            classes={{icon: styles.creditIcon}}
          />
        </div>
      </Modal>
    </div>
  )
}
