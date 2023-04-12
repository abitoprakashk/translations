import React from 'react'
import {Dropdown, Button, SearchBar, Icon} from '@teachmint/krayon'
import useComponentVisible from '../../../../../../src/pages/fee/hooks/useComponentVisible'
import classNames from 'classnames'
import {ICON_SIZES, screenWidth} from '../../../../../pages/fee/fees.constants'
import styles from '../../FeeReports.module.css'
import {useTranslation} from 'react-i18next'

const FeeSearchRow = ({
  reportType,
  searchKeyWord,
  setSearchKeyWord,
  isDateRangeVisible,
  FEE_WISE_DATE_FILTER,
  handleFilterSelection,
  handleDownloadReport,
  selectedTimePeriod,
  openFilterModal,
  loader,
  tableData,
  isDownloadSectionVisible,
  isDownloadCategory,
  setIsDownloadCategroy,
}) => {
  const {t} = useTranslation()
  const {
    ref,
    isComponentVisible: showCategroyDowloadDropDown,
    setIsComponentVisible: setShowCategoryDownloadDropDown,
  } = useComponentVisible(false)

  const dateRangeDropDown = () => {
    return (
      <Dropdown
        isMultiSelect={false}
        isSearchable={false}
        options={FEE_WISE_DATE_FILTER}
        classes={{
          dropdownClass: styles.dropdownClass,
          optionsClass: styles.optionsClass,
          wrapperClass: styles.wrapperClass,
        }}
        onChange={handleFilterSelection}
        selectedOptions={selectedTimePeriod}
      />
    )
  }

  const searchBarComp = () => {
    return (
      <SearchBar
        value={searchKeyWord}
        classes={{
          wrapper: styles.searchBar,
          searchIcon: styles.marginRight8,
        }}
        handleChange={(data) => setSearchKeyWord(data?.value)}
        placeholder="Search"
      />
    )
  }

  const filterBtnComp = () => {
    return (
      <div className={styles.openFilterModalBtnCont}>
        <Button
          onClick={openFilterModal}
          category="primary"
          size={ICON_SIZES.SIZES.MEDIUM}
          type="outline"
          children={
            <div className={styles.filterBtn}>
              <Icon
                name="filter"
                version="filled"
                type="primary"
                size={ICON_SIZES.SIZES.X_SMALL}
              />
              {screenWidth() > 1024 && t('filters')}
            </div>
          }
        />
      </div>
    )
  }

  const downloadReportComp = () => {
    return (
      <div>
        <Button
          onClick={handleDownloadReport}
          category="primary"
          size={ICON_SIZES.SIZES.MEDIUM}
          type="filled"
          isDisabled={loader || (tableData && tableData.length === 0)}
          children={
            <div className={styles.filterBtn}>
              <Icon
                name="download"
                size={ICON_SIZES.SIZES.X_SMALL}
                type="inverted"
              />
              {screenWidth() > 1024 ? t('downloadReport') : ''}
            </div>
          }
        />
      </div>
    )
  }

  const handleCheckBoxTick = () => {
    setIsDownloadCategroy(!isDownloadCategory)
  }

  const downloadCategoryDropDown = () => {
    return (
      <div className={styles.categroyFilter} ref={ref}>
        <div
          className={styles.categoryBtn}
          onClick={() =>
            setShowCategoryDownloadDropDown(!showCategroyDowloadDropDown)
          }
        >
          <Icon
            name="settingsGear"
            size={ICON_SIZES.SIZES.XX_SMALL}
            type="primary"
            version="filled"
          ></Icon>
          <Icon
            name="downArrow"
            size={ICON_SIZES.SIZES.XX_SMALL}
            type="primary"
            version="filled"
          ></Icon>
        </div>
        <div
          className={classNames(
            styles.dropdownContent,
            showCategroyDowloadDropDown ? styles.flex : styles.hidden
          )}
          onClick={() => handleCheckBoxTick()}
        >
          <input type="checkbox" checked={isDownloadCategory} />
          &ensp;{t('downloadByFeeType')}
        </div>
      </div>
    )
  }

  return (
    <div className={styles.reportOptionContainer}>
      {screenWidth() > 1024 ? (
        <div className={classNames(styles.searchBarRow)}>
          {searchBarComp()}
          <div className={classNames(styles.flex)}>
            {isDateRangeVisible(reportType) && dateRangeDropDown()}
            {filterBtnComp()}
            <div className={classNames(styles.chipSeperation, 'h-10')}></div>
            {downloadReportComp()}
            {isDownloadSectionVisible() && downloadCategoryDropDown()}
          </div>
        </div>
      ) : (
        <div className={classNames(styles.wfull, styles.mobileView)}>
          <div className={classNames(styles.flex, styles.searchRowTop)}>
            {searchBarComp()}
            {filterBtnComp()}
          </div>
          <div className={classNames(styles.flex, styles.searchRowBottom)}>
            <div>{isDateRangeVisible(reportType) && dateRangeDropDown()}</div>
            {/* <div className={styles.flex}>
            {downloadReportComp()}
            {isDownloadSectionVisible() && (
              downloadCategoryDropDown()
            )}
          </div> */}
          </div>
        </div>
      )}
    </div>
  )
}

export default FeeSearchRow
