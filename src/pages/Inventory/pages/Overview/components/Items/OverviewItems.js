import React, {useState, useEffect} from 'react'
import {Button, Icon, Table, Input} from '@teachmint/common'
import {useTranslation, Trans} from 'react-i18next'
import styles from './items.module.css'
import {useDispatch, useSelector} from 'react-redux'
import {
  CONST_OVERVIEW_ITEMS_HEADERS,
  CONST_ITEM_TABLE_MAPPINGS,
  CONST_ITEM_ALLOCATION_STATUS,
  CONST_ITEM_CONDITION,
  CONST_ITEM_CONDITION_LIST,
} from '../../../../../../constants/inventory.constants'
import {
  updateInventoryItemUnitConditionAction,
  getAllItemsListRequestAction,
  setPage,
  setCurrentPageReference,
  setPossibleAllocationIds,
  setSearchText,
} from '../../redux/actions/actions'
import {FiltersUI} from './filters'
import SliderBulkAllocateItems from '../Allocation/SliderBulkAllocation'
import SliderAllocateItemUnit from '../Allocation/SliderUnitAllocation'
import {getInventoryStoreListAction} from '../../../Stores/redux/actions/actions'
import SliderReAllocateItemUnit from '../Allocation/SliderUnitReAllocation'
import {events} from '../../../../../../utils/EventsConstants'
import {PAGE_LIMIT} from '../../../../../../constants/inventory.constants'
import classNames from 'classnames'
import AlternateSearchBox from '../../../../components/Common/AlternateSearchBox'
import {
  setToLocalStorage,
  getFromLocalStorage,
} from '../../../../../../utils/Helpers'
import {processInstituteMembersList} from '../../../../utils/Inventory.utils'
import Permission from '../../../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../../utils/permission.constants'

export default function OverviewItems({inputValue, setInputValue}) {
  const inventoryState = useSelector((state) => state.inventoryOverview)
  const inventoryStoresState = useSelector((state) => state.inventoryStores)
  const {eventManager, adminInfo} = useSelector((state) => state)
  const [tableRows, setTableRows] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const dispatch = useDispatch()
  const [lastPage, setLastPage] = useState('many')
  const [itemsData, setItemsData] = useState({
    items_list: [],
  })
  const [paginationButtonDisabled, setPaginationButtonDisabled] =
    useState(false)
  const [bulkAllocateSlider, setBulkAllocateSlider] = useState(null)
  const [allocateSliderScreen, setAllocateSliderScreen] = useState(null)
  const [reAllocateSliderScreen, setReAllocateSliderScreen] = useState(null)
  const [selectedItemUnit, setSelectedItemUnit] = useState({})
  const [itemStores, setStoreData] = useState([])
  const [infoDivParams, setInfoDivPamars] = useState(
    JSON.parse(getFromLocalStorage('INVENTORY_INFO_DIV_PARAMS'))
  )
  const {instituteStudentList, instituteTeacherList, instituteAdminList} =
    useSelector((state) => state)
  const [adminId, setAdminId] = useState(adminInfo._id)
  const {t} = useTranslation()

  const [instituteMembers, setInstituteMembers] = useState(
    processInstituteMembersList(
      instituteAdminList,
      instituteTeacherList,
      instituteStudentList
    )
  )

  useEffect(() => {
    setInstituteMembers(
      processInstituteMembersList(
        instituteAdminList,
        instituteTeacherList,
        instituteStudentList
      )
    )
  }, [instituteStudentList, instituteTeacherList, instituteAdminList])

  const handleSearchFilter = (val) => {
    let payload = {
      filters: {...inventoryState?.apiFilterData},
      limit: PAGE_LIMIT,
    }
    setInputValue(val)
    if (val.length >= 1) {
      dispatch(setPage(1))
      dispatch(setSearchText(val))
      setLastPage('many')
      let totalSearchSpace = instituteMembers.concat(itemStores)
      const res = totalSearchSpace?.filter(({name}) =>
        name.toLowerCase().startsWith(val.toLowerCase())
      )
      let final = res?.map((entity) => entity?._id)
      if (final) {
        payload = {...payload, search_text: val, possible_allocation_ids: final}
      }
      dispatch(setPossibleAllocationIds(final))
      dispatch(getAllItemsListRequestAction(payload))
    } else {
      dispatch(setPage(1))
      dispatch(setSearchText(val))
      dispatch(getAllItemsListRequestAction(payload))
      dispatch(setPossibleAllocationIds([]))
      setLastPage('many')
    }
    return
  }

  useEffect(() => {
    let payload = {
      ...inventoryState?.currentPageReference,
      filters: {...inventoryState?.apiFilterData},
    }
    if (inventoryState?.searchText) {
      payload = {...payload, search_text: inventoryState?.searchText}
    }
    if (inventoryState?.possibleAllocatedIds) {
      payload = {
        ...payload,
        possible_allocation_ids: inventoryState?.possibleAllocatedIds,
      }
    }
    dispatch(getAllItemsListRequestAction(payload))
  }, [])

  const Allocate = ({rowData}) => {
    const handleClick = () => {
      setSelectedItemUnit(rowData)
      if (
        rowData[CONST_ITEM_TABLE_MAPPINGS.allocatedTo] ===
        CONST_ITEM_ALLOCATION_STATUS.UNALLOCATED
      ) {
        eventManager.send_event(events.IM_ALLOCATE_ITEM_CLICKED_TFI, {
          screen_name: 'item overview',
        })
        setAllocateSliderScreen(true)
      } else {
        eventManager.send_event(events.IM_REALLOCATE_UNIT_CLICKED_TFI, {
          screen_name: 'item overview',
        })
        setReAllocateSliderScreen(true)
      }
    }
    return (
      <Permission
        permissionId={
          PERMISSION_CONSTANTS.inventoryItemController_allocateManual_update
        }
      >
        <Button
          type="keyboard"
          onClick={() => handleClick()}
          className={styles.allocateButton}
        >
          <Icon name="allocateUser" size="xs" color="primary" />
          <span>
            {rowData[CONST_ITEM_TABLE_MAPPINGS.allocatedTo] !==
            CONST_ITEM_ALLOCATION_STATUS.UNALLOCATED
              ? t('reAllocate')
              : t('allocate')}
          </span>
        </Button>
      </Permission>
    )
  }

  useEffect(() => {
    setStoreData(inventoryStoresState.storeItemsData?.obj)
  }, [inventoryStoresState.storeItemsData])

  useEffect(() => {
    setAdminId(adminInfo._id)
  }, [adminInfo])

  useEffect(() => {
    setItemsData({items_list: inventoryState.allItems?.obj?.hits})
    dispatch(getInventoryStoreListAction())
  }, [inventoryState.allItems, inventoryState.allItems?.obj])

  useEffect(() => {
    parser()
    if (inventoryState.allItems?.obj?.pagination?.is_last_page) {
      setLastPage(inventoryState?.pageNumber)
    }
  }, [itemsData])

  const ReAllocate = ({rowData}) => {
    const handleReAllocateItem = () => {
      eventManager.send_event(events.IM_REALLOCATE_UNIT_CLICKED_TFI, {
        screen_name: 'item overview',
      })
      setSelectedItemUnit(rowData)
      setReAllocateSliderScreen(true)
    }
    return (
      <Permission
        permissionId={
          PERMISSION_CONSTANTS.inventoryItemController_allocateManual_update
        }
      >
        <Button
          type="secondary"
          onClick={() => handleReAllocateItem()}
          className={styles.reallocateButton}
        >
          <Icon name="edit1" size="xs" color="primary" type="outlined" />
          <span>{t('editAllocation')}</span>
        </Button>
      </Permission>
    )
  }

  const AllocatedTo = ({data}) => {
    return (
      <span className={`${data === 'NA' ? styles.textNA : ''}`}>{data}</span>
    )
  }

  function parser() {
    const allRows = []
    itemsData?.items_list?.map((item) => {
      let newRow = {}
      for (let key in CONST_ITEM_TABLE_MAPPINGS) {
        newRow[key] = item[CONST_ITEM_TABLE_MAPPINGS[key]]
      }
      newRow['condition'] =
        CONST_ITEM_CONDITION[item[CONST_ITEM_TABLE_MAPPINGS.condition]]

      newRow['condition'] = (
        <Permission
          permissionId={
            PERMISSION_CONSTANTS.inventoryItemUnitController_updateCondition_update
          }
        >
          <Input
            item={item}
            type="select"
            onChange={({value}) => {
              let payload = {
                filters: {...inventoryState?.apiFilterData},
                ...inventoryState?.currentPageReference,
                possible_allocation_ids: inventoryState?.possibleAllocatedIds,
              }
              if (inventoryState?.searchText) {
                payload = {...payload, search_text: inventoryState?.searchText}
              }
              dispatch(
                updateInventoryItemUnitConditionAction({
                  condition: {
                    _id: item._id,
                    condition: value,
                  },
                  payload: payload,
                })
              )
            }}
            value={
              CONST_ITEM_CONDITION[item[CONST_ITEM_TABLE_MAPPINGS.condition]]
            }
            options={CONST_ITEM_CONDITION_LIST}
            shouldOptionsOccupySpace={false}
            size="small"
            className={classNames(
              styles.conditionSelection,
              styles[item[CONST_ITEM_TABLE_MAPPINGS.condition].toLowerCase()]
            )}
          />
        </Permission>
      )
      newRow['allocatedTo'] = (
        <AllocatedTo data={item.allocation_details.name} />
      )
      CONST_ITEM_ALLOCATION_STATUS[item[CONST_ITEM_TABLE_MAPPINGS.allocatedTo]]

      newRow['allocationStatus'] =
        item[CONST_ITEM_TABLE_MAPPINGS.allocatedTo] !==
        CONST_ITEM_ALLOCATION_STATUS.UNALLOCATED ? (
          <ReAllocate rowData={item} />
        ) : (
          <Allocate rowData={item} />
        )
      allRows.push(newRow)
    })
    setTableRows(allRows)
  }
  const handlePageButtonClick = (e, type) => {
    e.stopPropagation()
    let payload
    switch (type) {
      case 'next':
        payload = {
          filters: {...inventoryState?.apiFilterData},
          reference_id:
            inventoryState.allItems?.obj?.pagination?.starting_after,
          next: true,
          limit: PAGE_LIMIT,
          possible_allocation_ids: [...inventoryState?.possibleAllocatedIds],
        }
        if (inventoryState?.searchText?.length >= 1) {
          payload = {...payload, search_text: inventoryState?.searchText}
        }
        dispatch(setPage(inventoryState.pageNumber + 1))
        break
      case 'previous':
        payload = {
          filters: {...inventoryState?.apiFilterData},
          reference_id: inventoryState.allItems?.obj?.pagination?.ending_before,
          next: false,
          limit: PAGE_LIMIT,
          possible_allocation_ids: [...inventoryState?.possibleAllocatedIds],
        }
        if (inventoryState?.searchText?.length >= 1) {
          payload = {...payload, search_text: inventoryState?.searchText}
        }
        dispatch(setPage(inventoryState.pageNumber - 1))
        break
      default:
        break
    }
    dispatch(
      setCurrentPageReference({
        reference_id: payload.reference_id,
        next: payload.next,
        limit: PAGE_LIMIT,
      })
    )
    dispatch(getAllItemsListRequestAction(payload))
    return {type}
  }

  useEffect(() => {
    parser()
    if (inventoryState.allItems?.obj?.pagination?.is_last_page) {
      setLastPage(inventoryState?.pageNumber)
    }
  }, [])

  useEffect(() => {
    if (!inventoryState.allItemsLoading) {
      setPaginationButtonDisabled(false)
    } else {
      setPaginationButtonDisabled(true)
    }
  }, [inventoryState.allItemsLoading])

  const filterButtonClick = () => {
    setShowFilters(!showFilters)
  }
  const checkDivParams = () => {
    const userData = infoDivParams === null ? {} : infoDivParams[adminId]
    if (userData && userData.itemOverview === false) return false
    else return true
  }
  const handleClose = () => {
    const params = infoDivParams !== null ? infoDivParams : {}

    if (params[adminId] !== undefined) {
      params[adminId]['itemOverview'] = false
    } else {
      params[adminId] = {itemOverview: false}
    }

    setToLocalStorage('INVENTORY_INFO_DIV_PARAMS', JSON.stringify(params))
    setInfoDivPamars(
      JSON.parse(getFromLocalStorage('INVENTORY_INFO_DIV_PARAMS'))
    )
  }

  return (
    <>
      <div className={styles.parentWrapper}>
        {checkDivParams() && (
          <div className={styles.infoWrapper}>
            <p className={styles.infoContentDiv}>
              <Icon name="info" color="basic" size="xs" />
              &nbsp;&nbsp;{t('itemInfoDiv')}
            </p>
            <Button
              className={styles.closeBtn}
              onClick={handleClose}
              type="secondary"
            >
              <Icon name="close" color="secondary" size="xs" />
            </Button>
          </div>
        )}
        <div className={styles.wrapper}>
          <div
            className={`${styles.searchBoxContainer} ${
              checkDivParams() ? styles.searchPositioning : ''
            }`}
          >
            <AlternateSearchBox
              value={inputValue}
              placeholder={t('searchPlaceholderItems')}
              handleSearchFilter={handleSearchFilter}
            />
          </div>
          <div className={styles.filterBulkAllocateButtonWrapper}>
            <Permission
              permissionId={
                PERMISSION_CONSTANTS.inventoryItemCategoryController_getList_read
              }
            >
              <Button
                type={
                  showFilters || inventoryState?.selectedFilters.length != 0
                    ? 'primary'
                    : 'secondary'
                }
                size="small"
                className={styles.button}
                onClick={() => {
                  filterButtonClick()
                  eventManager.send_event(events.IM_TOP_FILTER_CLICKED_TFI, {})
                }}
              >
                <Icon
                  name="filter"
                  size="xs"
                  type="outlined"
                  color={
                    showFilters || inventoryState?.selectedFilters.length != 0
                      ? 'inverted'
                      : 'primary'
                  }
                />
              </Button>
            </Permission>
            <Permission
              permissionId={
                PERMISSION_CONSTANTS.inventoryItemController_allocateAutomatic_update
              }
            >
              <Button
                type="secondary"
                size="medium"
                className={styles.button}
                onClick={() => {
                  eventManager.send_event(
                    events.IM_BULK_ALLOCATE_CLICKED_TFI,
                    {}
                  )
                  setBulkAllocateSlider(true)
                }}
              >
                <Icon
                  name="allocateUser"
                  size="xs"
                  type="filled"
                  color="primary"
                />
                {t('bulkAllocation')}
              </Button>
            </Permission>
            <div>
              {showFilters && (
                <FiltersUI
                  setLastPage={setLastPage}
                  inputValue={inventoryState?.searchText}
                  setShowFilters={setShowFilters}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.mainTableWrapper}>
        <Table
          cols={CONST_OVERVIEW_ITEMS_HEADERS}
          rows={tableRows}
          uniqueKey="id"
        />
      </div>
      <div className={styles.pagginationWrapper}>
        <span>
          <Trans i18nKey="resultLimit">
            Showing
            {{
              limit: inventoryState.allItems?.obj?.hits?.length || 0,
            }}
          </Trans>
        </span>
        <div>
          <span>
            <Trans i18nKey="pageNumber">
              Page {{currentPage: inventoryState?.pageNumber}} of{' '}
              {{lastPage: lastPage}}
            </Trans>
          </span>
          <Button
            type="secondary"
            className={classNames(styles.pageButtons, {
              [styles.disabledPageButtons]:
                inventoryState.allItems?.obj?.pagination?.is_first_page ||
                inventoryState?.pageNumber === 1,
            })}
            onClick={(e) => {
              handlePageButtonClick(e, 'previous')
            }}
            disabled={
              inventoryState.allItems?.obj?.pagination?.is_first_page ||
              inventoryState?.pageNumber === 1 ||
              paginationButtonDisabled
            }
            title={`${
              inventoryState.allItems?.obj?.pagination?.is_first_page ||
              inventoryState?.pageNumber === 1
                ? 'Previous page'
                : 'Disabled'
            }`}
          >
            <Icon
              name="backArrow"
              size="xxs"
              type="outlined"
              className={styles.pageButtonIcons}
              color={`${
                inventoryState.allItems?.obj?.pagination?.is_first_page ||
                inventoryState?.pageNumber === 1
                  ? 'secondary'
                  : 'basic'
              }`}
            />
          </Button>
          <Button
            type="secondary"
            className={classNames(styles.pageButtons, {
              [styles.disabledPageButtons]:
                inventoryState.allItems?.obj?.pagination?.is_last_page,
            })}
            onClick={(e) => {
              handlePageButtonClick(e, 'next')
            }}
            disabled={
              inventoryState.allItems?.obj?.pagination?.is_last_page ||
              paginationButtonDisabled
            }
            title={`${
              inventoryState.allItems?.obj?.pagination?.is_last_page
                ? 'Previous page'
                : 'Disabled'
            }`}
          >
            <Icon
              name="forwardArrow"
              size="xxs"
              type="outlined"
              className={styles.pageButtonIcons}
              color={`${
                inventoryState.allItems?.obj?.pagination?.is_last_page
                  ? 'secondary'
                  : 'basic'
              }`}
            />
          </Button>
        </div>
      </div>
      {bulkAllocateSlider && (
        <SliderBulkAllocateItems
          setSliderScreen={setBulkAllocateSlider}
          sliderScreen={bulkAllocateSlider}
          itemStores={itemStores}
          bulkAllocateSlider={bulkAllocateSlider}
          currentPageReference={inventoryState?.currentPageReference}
          apiFilterData={inventoryState?.apiFilterData}
          possibleAllocatedIds={inventoryState?.possibleAllocatedIds}
          searchText={inventoryState?.searchText}
        />
      )}
      {allocateSliderScreen && (
        <SliderAllocateItemUnit
          sliderScreen={allocateSliderScreen}
          setSliderScreen={setAllocateSliderScreen}
          itemUnitData={selectedItemUnit}
          itemStores={itemStores}
          allocateSliderScreen={allocateSliderScreen}
          currentPageReference={inventoryState?.currentPageReference}
          apiFilterData={inventoryState?.apiFilterData}
          possibleAllocatedIds={inventoryState?.possibleAllocatedIds}
          searchText={inventoryState?.searchText}
        />
      )}
      {reAllocateSliderScreen && (
        <SliderReAllocateItemUnit
          sliderScreen={reAllocateSliderScreen}
          setSliderScreen={setReAllocateSliderScreen}
          itemUnitData={selectedItemUnit}
          itemStores={itemStores}
          setAllocateSliderScreen={() => setAllocateSliderScreen(true)}
          reAllocateSliderScreen={reAllocateSliderScreen}
          currentPageReference={inventoryState?.currentPageReference}
          apiFilterData={inventoryState?.apiFilterData}
          possibleAllocatedIds={inventoryState?.possibleAllocatedIds}
          searchText={inventoryState?.searchText}
        />
      )}
    </>
  )
}
