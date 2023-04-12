import React, {useCallback, useEffect, useState} from 'react'
import {Input, Icon, ICON_CONSTANTS} from '@teachmint/krayon'
import styles from './SearchBox.module.css'
import classNames from 'classnames'
import {debounce} from '../../../../../../../src/utils/Helpers'
import {useDispatch, useSelector} from 'react-redux'
import {useFeeCollection} from '../../../../redux/feeCollectionSelectors'
import {
  searchResultsRequestedAction,
  feeReminderRequestedAction,
} from '../../../../redux/feeCollectionActions'
import SearchResultsContainerMobile from './SearchResultsContainerMobile'
import SearchResultTable from './SearchResultTable/SearchResultTable'
import TableSkeleton from '../../../../../../components/SchoolSystem/StudentDirectory/FeeTab/skeletons/TableSkeleton/TableSkeleton'
import {t} from 'i18next'
import {events} from '../../../../../../utils/EventsConstants'
import {ErrorBoundary} from '@teachmint/common'
import {TYPING_PLACEHOLDER} from '../../../../fees.constants'

export default function SearchBox({
  searchValue,
  setSearchValue,
  isSearchFieldClicked,
  setIsSearchFieldClicked,
  isShowClasses,
  setIsShowClasses,
  handleCollectFeeClick,
  studentListObj,
  sendClickEvent,
  feeStatistics,
}) {
  const dispatch = useDispatch()
  const {searchResults, searchResultsLoading} = useFeeCollection()
  const {instituteInfo, isMobile, instituteActiveAcademicSessionId} =
    useSelector((state) => state)

  useEffect(() => {
    if (searchValue.length > 0) fetchSearchResults(searchValue)
  }, [searchValue])

  const fetchSearchResults = useCallback(
    debounce((searchKey) => {
      dispatch(searchResultsRequestedAction(searchKey))
    }, 500),
    []
  )

  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const placeholderValue =
    TYPING_PLACEHOLDER.PLACEHOLDER_VALUES[placeholderIndex]

  const [typingIndex, setTypingIndex] = useState(0)
  const [typingComplete, setTypingComplete] = useState(false)

  useEffect(() => {
    if (typingComplete) {
      const eraseTimeout = setTimeout(() => {
        const eraseInterval = setInterval(() => {
          setTypingIndex((prevIndex) => {
            if (prevIndex > 0) {
              return prevIndex - 1
            } else {
              clearInterval(eraseInterval)
              setTypingComplete(false)
              setTypingIndex(0)
              setPlaceholderIndex(
                (prevIndex) =>
                  (prevIndex + 1) % TYPING_PLACEHOLDER.PLACEHOLDER_VALUES.length
              )
              return prevIndex
            }
          })
        }, TYPING_PLACEHOLDER.ERASE_INTERVAL_TIME)
        return () => clearInterval(eraseInterval)
      }, TYPING_PLACEHOLDER.DELAY_TIME)
      return () => clearTimeout(eraseTimeout)
    }
  }, [typingComplete])

  useEffect(() => {
    if (!typingComplete) {
      const typingInterval = setInterval(() => {
        setTypingIndex((prevIndex) => {
          if (prevIndex < placeholderValue?.length) {
            return prevIndex + 1
          } else {
            setTypingComplete(true)
            clearInterval(typingInterval)
            return prevIndex
          }
        })
      }, TYPING_PLACEHOLDER.TYPING_INTERVAL_TIME)

      return () => clearInterval(typingInterval)
    }
  }, [placeholderValue, typingComplete])

  const typingPlaceholderValue = `${t('searchBy')} ${placeholderValue?.slice(
    0,
    typingIndex
  )}${typingComplete ? '|' : ''}`

  return (
    <ErrorBoundary>
      <div
        className={classNames(
          styles.searchBoxContainer,
          isSearchFieldClicked ? styles.searchBoxContainerClicked : ''
        )}
      >
        {/* <span className={styles.searchTitle}>{t('searchTitle')}</span> */}
        <div className={styles.inputWrapper}>
          <Input
            autoFocus
            isFocused
            value={searchValue}
            placeholder={typingPlaceholderValue}
            prefix={
              <Icon
                name="search"
                size={ICON_CONSTANTS.SIZES.XX_SMALL}
                type={ICON_CONSTANTS.TYPES.SECONDARY}
              />
            }
            suffix={
              searchValue ? (
                <Icon
                  name="close"
                  onClick={() => setSearchValue('')}
                  size={ICON_CONSTANTS.SIZES.XX_SMALL}
                  type={ICON_CONSTANTS.TYPES.SECONDARY}
                />
              ) : null
            }
            onChange={(e) => setSearchValue(e.value)}
            onClick={() => {
              setIsSearchFieldClicked(true)
              sendClickEvent(events.FEE_COLLECTION_SEARCH_BAR_CLICKED_TFI, {
                session_id: instituteActiveAcademicSessionId,
              })
            }}
          />
        </div>
        {searchValue && !isMobile && (
          <>
            {searchResultsLoading ? (
              <TableSkeleton
                tableRowsCount={7}
                classes={{
                  wrapper: styles.skeletonWrapper,
                }}
              />
            ) : (
              <SearchResultTable
                searchResults={searchResults}
                studentListObj={studentListObj}
                instituteInfo={instituteInfo}
                handleCollectFeeClick={handleCollectFeeClick}
                feeReminderRequestedAction={feeReminderRequestedAction}
                sendClickEvent={sendClickEvent}
              />
            )}
          </>
        )}
        {searchValue && isMobile && (
          <>
            {searchResultsLoading ? (
              <TableSkeleton
                tableRowsCount={7}
                classes={{
                  wrapper: classNames(
                    styles.mobileSkeleton,
                    styles.marginTopZero
                  ),
                }}
              />
            ) : (
              <SearchResultsContainerMobile
                studentListObj={studentListObj}
                searchResults={searchResults}
                handleCollectFeeClick={handleCollectFeeClick}
              />
            )}
          </>
        )}
        {!searchValue && (
          <div className={styles.browseByClassCTAContainer}>
            <span
              className={styles.browseByClassCTA}
              onClick={() => {
                if (feeStatistics.length !== 0) {
                  setIsShowClasses(!isShowClasses)
                  sendClickEvent(
                    isShowClasses
                      ? events.HIDE_CLASSES_CLICKED_TFI
                      : events.BROWSE_STUDENTS_BY_CLASS_CLICKED_TFI,
                    {
                      session_id: instituteActiveAcademicSessionId,
                    }
                  )
                }
              }}
            >
              {isShowClasses ? t('hideClasses') : t('showClasses')}
            </span>
          </div>
        )}
      </div>
    </ErrorBoundary>
  )
}
