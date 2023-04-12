import React, {useEffect, useState} from 'react'
import {Button, Icon, Table, Slider} from '@teachmint/common'
import {useTranslation, Trans} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import styles from './categories.module.css'
import {
  CONST_CATEGORIES_ITEMS_HEADERS,
  CONST_CATEGORIES_ITEMS_TABLE_MAPPINGS,
} from '../../../../../constants/inventory.constants'
import {deleteInventoryItemCategoryAction} from '../../Overview/redux/actions/actions'
import ConfirmationPopup from '../../../../../components/Common/ConfirmationPopup/ConfirmationPopup'
import {AddCategoryForm} from '../../../components/Forms/AddCategoryForm/AddCategoryForm'
import ShowItemDetailsSlider from './ShowItemDetailsSlider'
import {events} from '../../../../../utils/EventsConstants'
import CloseSliderConfirmPopup from '../../../components/Common/CloseSliderConfirmPopUp'
import AlternateSearchBox from '../../../components/Common/AlternateSearchBox'
import CategoryOnboarding from './CategoryOnboarding'
import {
  setToLocalStorage,
  getFromLocalStorage,
} from '../../../../../utils/Helpers'
import ReactTooltip from 'react-tooltip'
import Permission from '../../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../utils/permission.constants'
import {getSymbolFromCurrency} from '../../../../../utils/Helpers'
import {DEFAULT_CURRENCY} from '../../../../../constants/common.constants'

export function compareStrings(a, b) {
  return a.toLowerCase() < b.toLowerCase()
    ? -1
    : a.toLowerCase() > b.toLowerCase()
    ? 1
    : 0
}

export default function CategoriesPage() {
  const [inputValue, setInputValue] = useState('')
  const [categoryData, setCategoryData] = useState([])
  const [filteredCategoryData, setFilteredCategoryData] = useState([])
  const inventoryState = useSelector((state) => state.inventoryOverview)
  const {eventManager, adminInfo, instituteInfo} = useSelector((state) => state)
  const [tableRows, SetTableRows] = useState([])
  const [selectedRowData, setSelectedRowData] = useState('')
  const [showDeleteConfirmPopup, setShowDeleteConfirmPopup] = useState(false)
  const [isItemDetailsSliderOpen, setIsItemDetailsSliderOpen] = useState(false)
  const [categoryListExists, setCategoryListExists] = useState(false)
  const [infoDivParams, setInfoDivPamars] = useState(
    JSON.parse(getFromLocalStorage('INVENTORY_INFO_DIV_PARAMS'))
  )
  const [scrollToBottom, setScrollToBottom] = useState(false)
  const [adminId, setAdminId] = useState(adminInfo._id)
  const {t} = useTranslation()

  useEffect(() => {
    if (inventoryState?.allCategories?.obj?.length !== 0) {
      setCategoryListExists(true)
    } else {
      setCategoryListExists(false)
    }
  }, [inventoryState.allCategories.obj])

  useEffect(() => {
    setAdminId(adminInfo._id)
  }, [adminInfo])

  const handleSearchFilter = (val) => {
    setInputValue(val)
    setFilteredCategoryData({
      category_list: search(categoryData.category_list, val),
    })
    return
  }

  const search = (dataList, searchString) => {
    let filteredList = dataList.filter((data) => {
      if (data.name.toLowerCase().indexOf(searchString.toLowerCase()) >= 0) {
        return true
      }
    })
    return filteredList
  }

  const dispatch = useDispatch()

  useEffect(() => {
    createTableRows()
  }, [filteredCategoryData])

  useEffect(() => {
    setCategoryData({category_list: inventoryState.allCategories.obj})
    setFilteredCategoryData({category_list: inventoryState.allCategories.obj})
  }, [inventoryState.allCategories])

  // useEffect(() => {
  //   if (inventoryState?.allCategories?.obj?.length !== 0) {
  //     dispatch(getAllCategoriesRequestAction())
  //   }
  // }, [])

  const [addSliderOpen, setAddSliderOpen] = useState(false)
  const [editSliderOpen, setEditSliderOpen] = useState(false)
  const [editCategoryData, setEditCategoryData] = useState({})

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
    let catData = {name: data.name, accordionOpen: true, items: itemsData}
    let payload = {[data._id]: catData}
    setScrollToBottom(false)
    setEditCategoryData(payload)
    setEditSliderOpen(true)
  }

  const handleDelete = (data) => {
    setSelectedRowData(data)
    setShowDeleteConfirmPopup(
      (showDeleteConfirmPopup) => !showDeleteConfirmPopup
    )
  }

  const deleteConfirmObject = {
    onClose: () => {
      setShowDeleteConfirmPopup(false)
      setSelectedRowData({})
    },
    onAction: () => {
      dispatch(deleteInventoryItemCategoryAction(selectedRowData._id))
      setShowDeleteConfirmPopup(false)
      setSelectedRowData({})
      eventManager.send_event(events.IM_CATEGORY_DELETED_TFI, {
        category_name: selectedRowData.name,
      })
    },
    icon: <Icon name="delete" size="xl" color="error" type="outlined" />,
    title: (
      <Trans i18nKey="deleteCategoryTitle">
        Delete item category {{categoryName: selectedRowData.name}} ?
      </Trans>
    ),
    desc: t('deleteCategoryDescription'),
    primaryBtnText: t('cancel'),
    secondaryBtnText: t('delete'),
    secondaryBtnStyle: styles.buttonRed,
    closeOnBackgroundClick: true,
  }
  const warningObject = {
    onClose: () => {
      setShowDeleteConfirmPopup(false)
    },
    icon: <Icon name="error" size="4xl" color="warning" type="filled" />,
    title: t('deleteCategoryWarningTitle'),
    desc: t('deleteCategoryWarningDesc'),
    primaryBtnText: t('ok'),
    primaryBtnStyle: styles.popUpButtonOk,
    closeOnBackgroundClick: false,
  }

  const EditButton = (props) => {
    return (
      <Permission
        permissionId={
          PERMISSION_CONSTANTS.inventoryItemCategoryController_edit_update
        }
      >
        <Button
          type="keyboard"
          onClick={() => {
            handleEdit(props.rowData)
            eventManager.send_event(events.IM_EDIT_CATEGORY_TAB_CLICKED_TFI, {
              category_name: props?.rowData?.name,
            })
          }}
        >
          <Icon name="edit1" size="xxs" color="primary" />
        </Button>
      </Permission>
    )
  }

  const DeleteButton = (props) => {
    return (
      <Permission
        permissionId={
          PERMISSION_CONSTANTS.inventoryItemCategoryController_deleteRoute_delete
        }
      >
        <Button
          size="small"
          type="keyboard"
          onClick={(e) => {
            handleDelete(props.rowData, e)
            eventManager.send_event(events.IM_DELETE_CATEGORY_TAB_CLICKED_TFI, {
              category_name: props?.rowData?.name,
            })
          }}
        >
          <Icon name="delete" size="xxs" color="error" type="outlined" />
        </Button>
      </Permission>
    )
  }

  const ItemCountField = (props) => {
    const onViewDetailsClick = () => {
      setIsItemDetailsSliderOpen(true)
      setSelectedRowData(props)
    }

    const ViewDetailButton = () => {
      return (
        <>
          {props.item_count}
          <span className={styles.separator}> |</span>
          <span className={styles.veiwDetails}>{t('viewDetails')}</span>
        </>
      )
    }

    return (
      <>
        {props.item_count && (
          <Button onClick={onViewDetailsClick} type="keyboard">
            <ViewDetailButton />
          </Button>
        )}
      </>
    )
  }

  const CustomPriceHeader = () => {
    return (
      <span className={styles.customPriceHeader}>
        {t('totalStockPrice')}
        <span>
          <span data-tip data-for="totalStockPrice">
            <Icon name="info" size="xxxs" type="outlined" color="secondary" />
          </span>
          <ReactTooltip
            id="totalStockPrice"
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

  CONST_CATEGORIES_ITEMS_HEADERS[4].label = <CustomPriceHeader />

  function createTableRows() {
    let allRows = []
    filteredCategoryData.category_list?.map((category) => {
      let newRow = {}
      for (let key in CONST_CATEGORIES_ITEMS_TABLE_MAPPINGS) {
        newRow[key] = category[CONST_CATEGORIES_ITEMS_TABLE_MAPPINGS[key]]
      }
      newRow['worth'] = (
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
              ).format(newRow['worth'])}
            </label>
          </div>
        </>
      )
      newRow['itemsCount'] = <ItemCountField {...category} />
      newRow['edit'] = <EditButton rowData={category} />
      newRow['delete'] = <DeleteButton rowData={category} />
      allRows.push(newRow)
    })
    SetTableRows(allRows)
  }

  const isCategoryAllocated = () => {
    if (selectedRowData.total_allocated > 0) return true
    return false
  }

  const closeConfirmObject = {
    onClose: () => {
      setShowCloseConfirmPopup(false)
    },
    onAction: () => {
      if (addSliderOpen) setAddSliderOpen(false)
      else setEditSliderOpen(false)
      setShowCloseConfirmPopup(false)
    },
  }

  const [showCloseConfirmPopup, setShowCloseConfirmPopup] = useState(false)

  const handleSliderClose = (setCurrentSliderOpen) => {
    if (isDataChanged) {
      setShowCloseConfirmPopup(true)
    } else {
      setCurrentSliderOpen(false)
    }
  }

  const [isDataChanged, setIsDataChanged] = useState(false)

  useEffect(() => [setIsDataChanged(false)], [editSliderOpen, addSliderOpen])

  const checkDivParams = () => {
    const userData = infoDivParams === null ? {} : infoDivParams[adminId]
    if (userData && userData.categoryPage === false) return false
    else return true
  }
  const handleClose = () => {
    const params = infoDivParams !== null ? infoDivParams : {}

    if (params[adminId] !== undefined) {
      params[adminId]['categoryPage'] = false
    } else {
      params[adminId] = {categoryPage: false}
    }

    setToLocalStorage('INVENTORY_INFO_DIV_PARAMS', JSON.stringify(params))
    setInfoDivPamars(
      JSON.parse(getFromLocalStorage('INVENTORY_INFO_DIV_PARAMS'))
    )
  }

  return (
    <>
      {categoryListExists ? (
        <>
          <div className={styles.parentWrapper}>
            {checkDivParams() && (
              <div className={styles.infoWrapper}>
                <p className={styles.infoContentDiv}>
                  <Icon name="info" color="basic" size="xs" />
                  &nbsp;&nbsp;{t('categoryPageInfoDiv')}
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
            <div className={styles.topBar}>
              <div className={styles.searchContainer}>
                <AlternateSearchBox
                  value={inputValue}
                  placeholder={t('searchPlaceholderCategoryPage')}
                  handleSearchFilter={handleSearchFilter}
                />
              </div>
              <Permission
                permissionId={
                  PERMISSION_CONSTANTS.inventoryItemController_add_create
                }
              >
                <Button
                  type={'secondary'}
                  className={styles.addCategoryButton}
                  onClick={() => {
                    setAddSliderOpen(true)
                    eventManager.send_event(
                      events.IM_ADD_NEW_CATEGORY_CLICKED_TFI,
                      {screen_name: 'Item category'}
                    )
                  }}
                >
                  {t('addCategoryPlus')}
                </Button>
              </Permission>
            </div>
          </div>
          <div className={styles.tableWrap}>
            <Table
              cols={CONST_CATEGORIES_ITEMS_HEADERS}
              rows={tableRows}
            ></Table>
          </div>
          {showDeleteConfirmPopup &&
            (isCategoryAllocated() ? (
              <ConfirmationPopup {...warningObject} />
            ) : (
              <ConfirmationPopup {...deleteConfirmObject} />
            ))}
        </>
      ) : (
        <CategoryOnboarding />
      )}
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
                screenName="Item overview"
                isEdit={true}
                data={editCategoryData}
                setIsDataChanged={setIsDataChanged}
                scrollBotttom={scrollToBottom}
              />
            }
          ></Slider>
        </div>
      )}
      {isItemDetailsSliderOpen && (
        <Slider
          open={isItemDetailsSliderOpen}
          setOpen={setIsItemDetailsSliderOpen}
          content={
            <ShowItemDetailsSlider
              selectedRowData={selectedRowData}
              setEditSliderOpen={setEditSliderOpen}
              setSliderOpen={setIsItemDetailsSliderOpen}
              setEditCategoryData={setEditCategoryData}
              setScrollToBottom={setScrollToBottom}
            />
          }
          hasCloseIcon={true}
        />
      )}
      {addSliderOpen && (
        <div className={styles.slider}>
          <Slider
            open={addSliderOpen}
            setOpen={() => {
              handleSliderClose(setAddSliderOpen)
            }}
            hasCloseIcon={true}
            widthInPercent={40}
            content={
              <AddCategoryForm
                setSliderOpen={setAddSliderOpen}
                screenName="Item Category"
                setIsDataChanged={setIsDataChanged}
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
