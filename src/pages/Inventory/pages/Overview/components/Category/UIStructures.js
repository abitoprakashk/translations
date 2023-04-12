import {FlatAccordion, Table, Button, Icon, Slider} from '@teachmint/common'
import React, {useEffect} from 'react'
import styles from './overviewCategory.module.css'
import {
  CONST_CATEGORY_CHILD_TABLE_MAPPINGS,
  CONST_CATEGORY_PARENT_TABLE_COLUMNS,
  CONST_CATEGORY_CHILD_TABLE_COLUMNS,
  CONST_ITEM_ALLOCATION_STATUS,
} from '../../../../../../constants/inventory.constants'
import {useTranslation} from 'react-i18next'
import SliderAllocateItems from '../Allocation/SliderAllocation'
import {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {getSingleItemByIDAction} from '../../redux/actions/actions'
import {getInventoryStoreListAction} from '../../../Stores/redux/actions/actions'
import {events} from '../../../../../../utils/EventsConstants'
import CloseSliderConfirmPopup from '../../../../components/Common/CloseSliderConfirmPopUp'
import {AddCategoryForm} from '../../../../components/Forms/AddCategoryForm/AddCategoryForm'
// import AlternateTooltip from '../../../../components/Common/AlternateTooltip'
import ReactTooltip from 'react-tooltip'
import {v4 as uuidv4} from 'uuid'
import Permission from '../../../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../../utils/permission.constants'
import {getSymbolFromCurrency} from '../../../../../../utils/Helpers'
import {DEFAULT_CURRENCY} from '../../../../../../constants/common.constants'

export default function MainTableUI(props) {
  const {t} = useTranslation()
  const [sliderScreen, setSliderScreen] = useState(false)
  const [selectedItem, setSelectedItem] = useState({})
  const [selectedAccordion, setSelectedAccordion] = useState('')
  const inventoryState = useSelector((state) => state.inventoryOverview)
  const inventoryStoresState = useSelector((state) => state.inventoryStores)
  const {eventManager, instituteInfo} = useSelector((state) => state)
  const [editSliderOpen, setEditSliderOpen] = useState(false)
  const [editCategoryData, setEditCategoryData] = useState({})
  const [isDataChanged, setIsDataChanged] = useState(false)

  const dispatch = useDispatch()
  const [showFirstListOpen, setShowFirstListOpen] = useState(
    inventoryState.allCategories?.obj?.length === 1
  )
  useEffect(() => {
    if (Object.keys(selectedItem).length !== 0) {
      dispatch(
        getSingleItemByIDAction({
          item_id: selectedItem._id,
          allocated_to_type: [CONST_ITEM_ALLOCATION_STATUS.UNALLOCATED],
          condition: ['GOOD'],
          limit: -1,
          paginate: false,
        })
      )
      dispatch(getInventoryStoreListAction())
    }
  }, [selectedItem])

  useEffect(() => {
    setShowFirstListOpen(inventoryState.allCategories?.obj?.length === 1)
  }, [inventoryState.allCategories.obj])

  const CustomPriceHeader = () => {
    return (
      <span className={styles.makeFlexCenter}>
        {t('totalStockPrice')}
        <span>
          <span data-tip data-for="price">
            <Icon name="info" size="xxxs" type="outlined" color="secondary" />
          </span>
          <ReactTooltip
            id="price"
            multiline="true"
            type="light"
            effect="solid"
            place="top"
            className={styles.customTooltip}
          >
            <span>{t('totalStockPriceToolTipContent')}</span>
          </ReactTooltip>
        </span>
      </span>
    )
  }

  const creatParentTableRows = (categoryData) => {
    let categroyRow = []
    let data = categoryData?.slice()
    data?.map((category) => {
      let newRow = {}
      newRow['id'] = category['_id']
      newRow[
        CONST_CATEGORY_PARENT_TABLE_COLUMNS[0].key
      ] = `${category['name']} - ${category['item_count']} Items`
      categroyRow.push(newRow)
      if (category['item_list']?.length > 0) {
        newRow['childTableRows'] = creatSubTableRows({
          data: category['item_list'],
          categoryName: category['name'],
          categoryId: category['_id'],
          uneditedData: category,
        })
      }
    })
    return categroyRow
  }

  const Allocate = ({itemData}) => {
    const handleAddItem = () => {
      eventManager.send_event(events.IM_ALLOCATE_ITEM_CLICKED_TFI, {
        screen_name: 'category overview',
      })
      setSelectedAccordion(itemData.category_id)
      setSelectedItem(itemData)
      setSliderScreen(true)
    }
    return (
      <Permission
        permissionId={
          PERMISSION_CONSTANTS.inventoryItemController_allocateAutomatic_update
        }
      >
        <Button
          type="secondary"
          onClick={() => handleAddItem()}
          disabled={itemData?.total_available === 0}
          className={`${
            itemData?.total_available === 0
              ? styles.disableAllocation
              : styles.enabledAllocation
          }`}
        >
          <Icon
            name="allocateUser"
            size="xs"
            color={`${
              itemData?.total_available !== 0 ? 'primary' : 'secondary'
            }`}
          />
          <span>{t('allocate')}</span>
        </Button>
      </Permission>
    )
  }

  const handleEdit = (data) => {
    let itemsData = {}
    data.item_list.forEach((item) => {
      let itemData = {
        name: item.name,
        stock: item.opening_stock,
        price: item.opening_price,
        prefix: item.prefix,
        totalAllocated: item.total_allocated,
      }
      itemsData[item._id] = itemData
    })
    itemsData = {
      ...itemsData,
      [uuidv4()]: {
        name: '',
        prefix: '',
        stock: '',
        price: '',
        hasError: true,
      },
    }
    let catData = {name: data.name, accordionOpen: true, items: itemsData}
    let payload = {[data._id]: catData}
    setEditCategoryData(payload)
    setEditSliderOpen(true)
  }

  const [showCloseConfirmPopup, setShowCloseConfirmPopup] = useState(false)

  useEffect(() => [setIsDataChanged(false)], [editSliderOpen])

  const handleSliderClose = (setCurrentSliderOpen) => {
    if (isDataChanged) {
      setShowCloseConfirmPopup(true)
    } else {
      setCurrentSliderOpen(false)
    }
  }

  const closeConfirmObject = {
    onClose: () => {
      setShowCloseConfirmPopup(false)
    },
    onAction: () => {
      setEditSliderOpen(false)
      setShowCloseConfirmPopup(false)
    },
  }

  const AddMoreItemsButton = ({data}) => {
    return (
      <div key={data['_id']} className={styles.addItemButtonWrapper}>
        <Permission
          permissionId={
            PERMISSION_CONSTANTS.inventoryItemCategoryController_edit_update
          }
        >
          <Button
            className={styles.addItemButton}
            onClick={() => {
              handleEdit(data)
              eventManager.send_event(events.IM_EDIT_CATEGORY_TAB_CLICKED_TFI, {
                screen_name: 'inventory_overview',
              })
            }}
            type="secondary"
          >
            {t('addMoreItems')}
          </Button>
        </Permission>
      </div>
    )
  }

  const creatSubTableRows = ({categoryName, data, uneditedData}) => {
    let childTableRows = []

    data?.map((item) => {
      const itemData = {category: categoryName, ...item}
      let rowData = {}
      for (let col in CONST_CATEGORY_CHILD_TABLE_MAPPINGS) {
        rowData[col] = item[CONST_CATEGORY_CHILD_TABLE_MAPPINGS[col]]
      }
      rowData['price'] = (
        <>
          <div className="flex">
            <label className="ml-0">
              {getSymbolFromCurrency(
                instituteInfo.currency || DEFAULT_CURRENCY
              )}
            </label>
            <label className="ml-1">
              {new Intl.NumberFormat(
                instituteInfo.currency === DEFAULT_CURRENCY ||
                instituteInfo.currency === '' ||
                instituteInfo.currency === null
                  ? 'en-IN'
                  : 'en-US'
              ).format(item['total_worth'])}
            </label>
          </div>
        </>
      )
      rowData['allocation'] = <Allocate itemData={itemData} />
      childTableRows.push(rowData)
    })
    childTableRows.push({
      item: <AddMoreItemsButton data={uneditedData} />,
      available: '',
      itemCount: '',
      price: '',
      allocation: '',
    })
    return childTableRows
  }

  const OverviewTable = () => {
    CONST_CATEGORY_CHILD_TABLE_COLUMNS[3].label = <CustomPriceHeader />
    let parentTableRows = creatParentTableRows(props.category_list)
    const tableRowList = []

    for (let row of parentTableRows) {
      tableRowList.push({
        id: row['id'],
        [CONST_CATEGORY_PARENT_TABLE_COLUMNS[0].key]: (
          <FlatAccordion
            isOpen={showFirstListOpen || row['id'] === selectedAccordion}
            onClick={() => {
              eventManager.send_event(
                events.IM_CATEGORY_DROPDOWN_CLICKED_TFI,
                {}
              )
            }}
            openOnlyOnArrowClick={false}
            title={row[CONST_CATEGORY_PARENT_TABLE_COLUMNS[0].key]}
            titleClass={styles.accordion}
          >
            <div className={styles.innerTable}>
              {row['childTableRows'] && (
                <>
                  <Table
                    rows={row['childTableRows']}
                    cols={CONST_CATEGORY_CHILD_TABLE_COLUMNS}
                    uniqueKey="id"
                  ></Table>
                </>
              )}
            </div>
          </FlatAccordion>
        ),
      })
    }
    return (
      <>
        {sliderScreen && (
          <SliderAllocateItems
            sliderScreen={sliderScreen}
            setSliderScreen={setSliderScreen}
            itemData={selectedItem}
            itemUnits={inventoryState.selectedItemTypeUnitListData}
            itemStores={inventoryStoresState.storeItemsData.obj}
            currentPageReference={inventoryState?.currentPageReference}
            apiFilterData={inventoryState?.apiFilterData}
            possibleAllocatedIds={inventoryState?.possibleAllocatedIds}
            searchText={inventoryState?.searchText}
          />
        )}
        <div className={styles.tableWrap}>
          <Table
            rows={tableRowList}
            cols={CONST_CATEGORY_PARENT_TABLE_COLUMNS}
          />
        </div>
      </>
    )
  }

  return (
    <>
      <OverviewTable />
      {editSliderOpen && (
        <div className={styles.slider}>
          <Slider
            open={true}
            setOpen={() => {
              handleSliderClose(setEditSliderOpen)
            }}
            hasCloseIcon={true}
            widthInPercent={40}
            content={
              <AddCategoryForm
                setSliderOpen={setEditSliderOpen}
                screenName="Item Category"
                isEdit={true}
                data={editCategoryData}
                setIsDataChanged={setIsDataChanged}
                scrollBotttom={true}
              />
            }
          ></Slider>
        </div>
      )}
      {showCloseConfirmPopup && (
        <CloseSliderConfirmPopup {...closeConfirmObject} />
      )}
    </>
  )
}
