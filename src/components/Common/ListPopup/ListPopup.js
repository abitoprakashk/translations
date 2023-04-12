import ListCard from './ListCard'
import crossIcon from '../../../assets/images/icons/cross-gray.svg'
import {useDispatch} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {showInstituteListAction} from '../../../redux/actions/instituteInfoActions'
import styles from './ListPopup.module.css'
import {Button} from '@teachmint/common'
import ListPendingCard from './ListPendingCard'
import classNames from 'classnames'
import {SearchBar} from '@teachmint/krayon'
import {useState} from 'react'
import {searchBoxFilter} from '../../../utils/Helpers'

export default function ListPopup({
  listItems,
  pendingInstitutes,
  selectedItem,
  handleItemSelection,
  actionTxt,
  action,
  closeActive,
  getActiveInstituteList,
  getPendingInstituteList,
  setPageNum,
}) {
  if (!(listItems?.length > 0 || pendingInstitutes?.length > 0)) setPageNum(1)

  const dispatch = useDispatch()
  const {t} = useTranslation()
  const [filterListItems, setFilterListItems] = useState(listItems)
  const [filterPendingInstitutes, setFilterPendingInstitutes] =
    useState(pendingInstitutes)
  const [searchText, setSearchText] = useState('')

  const showSearchBar = listItems?.length + pendingInstitutes?.length > 15

  const handleSearch = ({value}) => {
    setSearchText(value)
    let searchParams = [['title'], ['desc'], ['role']]
    setFilterListItems(searchBoxFilter(value, listItems, searchParams))
    setFilterPendingInstitutes(
      searchBoxFilter(value, pendingInstitutes, searchParams)
    )
  }

  const handleClosePopUp = () => {
    dispatch(showInstituteListAction(false))
  }

  const handleCreateNewInstitute = () => setPageNum(1)

  /*>*/
  return (
    <>
      <div className={`tm-popup-bg ${styles.popupWrapper}`}>
        <div
          className={classNames(
            'p-3',
            'lg:p-0',
            'mb-0',
            'lg:w-5/12',
            'h-auto',
            'lg:h-auto',
            'w-full',
            'rounded-none',
            'lg:rounded-lg',
            'tm-border-radius1',
            styles.bgColor,
            styles.maxWidth,
            styles.mainHeight
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className={classNames(
              styles.topContainer,
              styles.bottomBorder,
              styles.padding
            )}
          >
            <div className={styles.mainHeading}>
              {t('selectAnInstituteToContinue')}
            </div>
            <div className={classNames('px-4', 'py-3', 'lg:flex', styles.wrap)}>
              {closeActive && (
                <img
                  src={crossIcon}
                  alt="cross"
                  className="w-6 h-6 cursor-pointer"
                  onClick={handleClosePopUp}
                />
              )}
            </div>
          </div>
          {showSearchBar && (
            <div className={styles.searchBarContainer}>
              <SearchBar
                value={searchText}
                handleChange={handleSearch}
                placeholder={t('searchByNameOrRole')}
              />
            </div>
          )}

          <div
            className={
              showSearchBar ? styles.listBoxWithSearch : styles.listBox
            }
          >
            {pendingInstitutes.length > 0 ? (
              <div className={styles.mt}>
                <div className={classNames(styles.topContainer, styles.mb)}>
                  <div
                    className={classNames(styles.heading, styles.ml, styles.mt)}
                  >
                    {t('instituteRequests')}
                  </div>
                  {!closeActive && (
                    <button
                      onClick={handleCreateNewInstitute}
                      className={classNames(
                        styles.wrap,
                        styles.createButton,
                        styles.mt
                      )}
                    >
                      {t('createNewInstitute')}
                    </button>
                  )}
                </div>
                <div
                  className={classNames(
                    'p-4',
                    styles.yScroll,
                    styles.maxHeight
                  )}
                >
                  {filterPendingInstitutes.map(
                    ({num, title, _id, desc, iid, role, icon}) => (
                      <div key={num} className="cursor-pointer">
                        <ListPendingCard
                          num={num}
                          iid={iid}
                          role={role}
                          title={title}
                          icon={icon}
                          desc={desc}
                          selectedItem={selectedItem}
                          getActiveInstituteList={getActiveInstituteList}
                          getPendingInstituteList={getPendingInstituteList}
                        />
                      </div>
                    )
                  )}
                </div>
              </div>
            ) : null}
            {pendingInstitutes.length > 0 && listItems.length > 0 ? (
              <div
                className={classNames(styles.bottomDashedBorder, styles.mb)}
              ></div>
            ) : null}
            {listItems.length > 0 ? (
              <div className={styles.mt}>
                <div className={`${styles.topContainer}`}>
                  <div
                    className={classNames(styles.heading, styles.ml, styles.mt)}
                  >
                    {t('yourInstitutes')}
                  </div>
                  {/* {pendingInstitutes.length == 0 && !closeActive ? (
                  <button
                    onClick={handleCreateNewInstitute}
                    className={`${styles.wrap} ${styles.createButton} `}
                  >
                    {t('createNewInstitute')}
                  </button>
                ) : null} */}
                </div>
                <div
                  className={classNames(
                    'p-4',
                    styles.yScroll,
                    styles.maxHeight
                  )}
                >
                  {filterListItems.map(({num, title, desc, role, icon}) => (
                    <div key={num} className="cursor-pointer">
                      <ListCard
                        num={num}
                        title={title}
                        role={role}
                        icon={icon}
                        desc={desc}
                        handleSelection={handleItemSelection}
                        selectedItem={selectedItem}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          {listItems.length > 0 ? (
            <div className="p-4">
              <Button
                className={
                  selectedItem ? styles.enabledButton : styles.disabledButton
                }
                disabled={selectedItem ? false : true}
                onClick={() => {
                  action()
                }}
              >
                {actionTxt}
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}
