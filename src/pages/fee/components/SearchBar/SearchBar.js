import {useMemo, useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useSelector, useDispatch} from 'react-redux'
import useComponentVisible from '../../hooks/useComponentVisible'
import StudentSearchResults from '../StudentSearchResults/StudentSearchResults'
import {searchResultsRequestedAction} from '../../redux/feeCollectionActions'
import SearchBox from '../../../../components/Common/SearchBox/SearchBox'
import {debounce} from '../../../../utils/Helpers'
import styles from './SearchBar.module.css'
import classNames from 'classnames'

const SearchBar = () => {
  const dispatch = useDispatch()
  const {t} = useTranslation()

  const [search, setSearch] = useState('')
  const searchResults = useSelector(
    (state) => state.feeCollection.searchResults
  )

  const {
    ref,
    isComponentVisible: showSearchResults,
    setIsComponentVisible: setShowSearchResults,
  } = useComponentVisible(false)

  useEffect(() => {
    setShowSearchResults(!!(search.length && searchResults?.length))
  }, [search, searchResults])

  const handleSearch = (searchKey) => {
    setSearch(searchKey)
    fetchSearchResults(searchKey)
  }

  const fetchSearchResults = useMemo(
    () =>
      debounce((searchKey) => {
        dispatch(searchResultsRequestedAction(searchKey))
      }, 500),
    []
  )

  return (
    <div ref={ref} className={classNames(styles.searchWrapper, 'rounded-full')}>
      <SearchBox
        value={search}
        placeholder={t('searchPlaceholder')}
        handleSearchFilter={handleSearch}
      />
      {showSearchResults && <StudentSearchResults />}
    </div>
  )
}

export default SearchBar
