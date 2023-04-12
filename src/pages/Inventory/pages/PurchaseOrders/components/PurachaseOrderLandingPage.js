import React, {useState, useEffect} from 'react'
import {FlatAccordion, Button, Icon, Table, Slider} from '@teachmint/common'
import {useTranslation, Trans} from 'react-i18next'
import styles from './grn.module.css'
import {useDispatch, useSelector} from 'react-redux'
import {
  setPurchaseOrderErrorFalse,
  deletePurchaseOrderAction,
} from '../redux/actions/actions'
import ConfirmationPopup from '../../../../../components/Common/ConfirmationPopup/ConfirmationPopup'
import {CONST_PURCHASE_ORDERS_ITEM_TABLE_HEADERS} from '../../../../../constants/inventory.constants'
import {PurchaseOrderForm} from '../../../components/Forms/PurchaseOrderForm/PurchaseOrderForm'
import {events} from '../../../../../utils/EventsConstants'
import {v4 as uuidv4} from 'uuid'
import CloseSliderConfirmPopup from '../../../components/Common/CloseSliderConfirmPopUp'
import AlternateSearchBox from '../../../components/Common/AlternateSearchBox'
import {
  setToLocalStorage,
  getFromLocalStorage,
  getSymbolFromCurrency,
} from '../../../../../utils/Helpers'
import ReactTooltip from 'react-tooltip'
import Permission from '../../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../utils/permission.constants'
import {DEFAULT_CURRENCY} from '../../../../../constants/common.constants'

export default function GRNLandingPage({
  preventDeletePopup,
  setPreventDeletePopup,
}) {
  const purchaseOrdersState = useSelector(
    (state) => state.inventoryPurchaseOrder
  )
  const {instituteInfo} = useSelector((state) => state)
  const {eventManager, adminInfo} = useSelector((state) => state)
  const [dataAdded, setDataAdded] = useState(false)
  const [dataEdited, setDataEdited] = useState(false)

  const [purchaseOrdersData, setPurchaseOrderData] = useState([])
  const [filteredOrdersData, setfilteredOrdersData] = useState([])

  const [inputValue, setInputValue] = useState('')
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const handleSearchFilter = (val) => {
    setInputValue(val)
    search(purchaseOrdersData, val, [
      'invoice_no',
      'vendor_name',
      'description',
    ])
    return
  }
  const [showDeleteConfirmPopup, setShowDeleteConfirmPopup] = useState(false)
  const [selectedRowData, setSelectedRowData] = useState()
  const [addSliderOpen, setAddSliderOpen] = useState(false)
  const [editSliderOpen, setEditSliderOpen] = useState(false)
  const [editPurchaseOrderData, setEditPurchaseOrderData] = useState({})
  const [infoDivParams, setInfoDivPamars] = useState(
    JSON.parse(getFromLocalStorage('INVENTORY_INFO_DIV_PARAMS'))
  )
  const [adminId, setAdminId] = useState(adminInfo._id)

  const handleDelete = (data) => {
    setSelectedRowData(data)
    setShowDeleteConfirmPopup(true)
  }

  const formatNumber = (number, currency) => {
    if (currency) {
      return (
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
              ).format(number)}
            </label>
          </div>
        </>
      )
    } else {
      return `${new Intl.NumberFormat(
        instituteInfo.currency === DEFAULT_CURRENCY ||
        instituteInfo.currency === '' ||
        instituteInfo.currency === null
          ? 'en-IN'
          : 'en-US'
      ).format(number)}`
    }
  }

  useEffect(() => {
    setAdminId(adminInfo._id)
    setPreventDeletePopup(false)
  }, [adminInfo])

  useEffect(() => {
    if (!purchaseOrdersState?.deletePurchaseOrderLoading) {
      if (purchaseOrdersState?.deletePurchaseOrderError) {
        setShowDeleteConfirmPopup(false)
        setPreventDeletePopup(true)
      }
      if (purchaseOrdersState?.deletePurchaseOrderData?.status) {
        eventManager.send_event(events.IM_DELETE_INVOICE_CLICKED_TFI, {
          id: selectedRowData._id,
        })
      }
    } else {
      setShowDeleteConfirmPopup(false)
    }
  }, [purchaseOrdersState?.deletePurchaseOrderLoading])

  useEffect(() => {
    setPreventDeletePopup(false)
  }, [])

  const closePopupAndRemoveSelection = () => {
    setPreventDeletePopup(false)
    setSelectedRowData({})
    dispatch(setPurchaseOrderErrorFalse())
  }

  const PreventDeleteConfirmObject = {
    onClose: closePopupAndRemoveSelection,
    onAction: closePopupAndRemoveSelection,
    icon: <Icon name="error" size="4xl" color="warning" type="outlined" />,
    title: t('deletePurchaseOrderWithObjectsPopupTitle'),
    desc: t('deletePurchaseOrderWithObjectsPopupDescription'),
    primaryBtnText: t('ackPopupBtnText'),
    primaryBtnStyle: styles.buttonOkay,
    closeOnBackgroundClick: true,
  }

  useEffect(() => {
    if (purchaseOrdersState?.purchaseOrdersListData.obj) {
      setPurchaseOrderData(
        purchaseOrdersState?.purchaseOrdersListData?.obj?.hits
      )
      setfilteredOrdersData(
        purchaseOrdersState?.purchaseOrdersListData?.obj.hits
      )
    }
  }, [purchaseOrdersState.purchaseOrdersListData])

  const search = (searchableData, searchString, searchKeysList) => {
    let tempList = []
    for (let data of searchableData) {
      for (let key of searchKeysList) {
        if (data[key].toLowerCase().indexOf(searchString.toLowerCase()) >= 0) {
          tempList.push(data)
          break
        }
      }
    }
    setfilteredOrdersData(tempList)
  }

  const deletConfirmObject = {
    onClose: () => {
      setShowDeleteConfirmPopup(false)
      setSelectedRowData({})
    },
    onAction: () => {
      dispatch(deletePurchaseOrderAction(selectedRowData._id))
      setSelectedRowData({})
    },
    icon: <Icon name="delete" size="xl" color="error" type="outlined" />,
    title: (
      <Trans i18nKey="deletePurchaseOrderTitle">
        Delete purchase order {selectedRowData?.invoice_no}
      </Trans>
    ),
    desc: t('deletePurchaseOrderDescription'),
    primaryBtnText: t('cancel'),
    secondaryBtnText: t('delete'),
    secondaryBtnStyle: styles.buttonRed,
    closeOnBackgroundClick: true,
  }

  const filterOptions = [
    {label: t('today'), value: 'Today'},
    {label: t('thisWeek'), value: 'This Week'},
    {label: t('thisMonth'), value: 'This Month'},
    {label: t('last6Months'), value: 'Last 6 Months'},
    {label: t('clearAll'), value: 'Filter By'},
  ]

  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false)
  const [filterTitle, setFilterTitle] = useState('Filter By')

  const getMinEpochInSeconds = (filterValue, currentDate) => {
    let minDate = currentDate.getDate()
    let minMonth = currentDate.getMonth()
    let minYear = currentDate.getFullYear()
    switch (filterValue) {
      case 'This Week':
        minDate = minDate - currentDate.getDay() + 1
        break
      case 'This Month':
        minDate = 1
        break
      case 'Last 6 Months':
        minDate = 1
        minMonth = minMonth - 5
        break
      default:
        break
    }
    const priorDate = new Date(minYear, minMonth, minDate)
    return priorDate.getTime() / 1000
  }

  const handleFilterClick = (filterValue) => {
    if (filterValue == 'Filter By') {
      setFilterTitle(filterValue)
      setfilteredOrdersData(purchaseOrdersData)
      return
    }
    const currentDate = new Date()
    const minEpoch = getMinEpochInSeconds(filterValue, currentDate)
    const maxEpoch = currentDate.getTime() / 1000
    setFilterDropdownOpen(false)
    setFilterTitle(filterValue)

    let newlist = purchaseOrdersData.filter((order) => {
      if (order.purchase_date >= minEpoch && order.purchase_date <= maxEpoch) {
        return true
      }
      return false
    })
    setfilteredOrdersData(newlist)
  }

  window.addEventListener('click', () => {
    if (filterDropdownOpen) {
      setFilterDropdownOpen(!filterDropdownOpen)
    }
  })

  const AccordionStructure = (props) => {
    const onDeleteClick = (e) => {
      e.stopPropagation()
      handleDelete(props)
    }

    const handleEditButtonClick = () => {
      let items = {}
      props.purchase_data.forEach((obj) => {
        items[obj.item_id] = {
          categoryName: obj.category_name,
          itemName: obj.item_name,
          quantity: obj.quantity,
          price: obj.unit_price,
        }
      })
      let data = {
        _id: props._id,
        invoiceNumber: props.invoice_no,
        merchantName: props.vendor_name,
        purchaseDate: props.purchase_date,
        purchaseDescription: props.description,
        items: items,
      }
      setEditPurchaseOrderData(data)
      setEditSliderOpen(true)
    }

    const formatDate = (purchaseDate) => {
      const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ]
      let d = new Date(purchaseDate * 1000),
        month = '' + monthNames[d.getMonth()],
        day = '' + d.getDate(),
        year = d.getFullYear()

      if (month.length < 2) month = '0' + month
      if (day.length < 2) day = '0' + day
      return [day, month, year].join(' ')
    }

    return (
      <div className={styles.tableBody} key={props._id}>
        <div className={styles.tableCell}>{props.invoice_no}</div>
        <div className={styles.tableCell}>
          {formatDate(props.purchase_date)
            ? formatDate(props.purchase_date)
            : props.purchase_date}
        </div>
        <div className={styles.tableCell}>{props.vendor_name}</div>
        <div className={styles.tableCell}>{props.description}</div>
        <div className={styles.tableCell}>
          <Permission
            permissionId={
              PERMISSION_CONSTANTS.inventoryItemCategoryController_edit_update
            }
          >
            <div
              onClick={(e) => {
                e.stopPropagation()
                handleEditButtonClick()
                eventManager.send_event(events.IM_EDIT_PO_DETAIL_CLICKED_TFI, {
                  id: props._id,
                })
              }}
            >
              <Icon name="edit1" size="xxs" color="primary" />
            </div>
          </Permission>
        </div>
        <div className={styles.tableCell}>
          <Permission
            permissionId={
              PERMISSION_CONSTANTS.inventoryPurchaseOrderController_deleteRoute_delete
            }
          >
            <div
              onClick={(e) => {
                onDeleteClick(e)
              }}
            >
              <Icon name="delete" size="xxs" color="error" type="outlined" />
            </div>
          </Permission>
        </div>
      </div>
    )
  }

  const createTableRows = (data) => {
    let rows = data.map((itemData) => {
      return {
        uniqueKey: 'id',
        id: itemData.item_id,
        key: itemData.item_id,
        category: itemData.category_name,
        item: itemData.item_name,
        quantity: formatNumber(itemData.quantity, false),
        price: formatNumber(itemData.unit_price, true),
        totalPrice: formatNumber(itemData.total_price, true),
      }
    })
    return rows
  }

  const TotalPrice = () => {
    return (
      <>
        <span className={styles.totalPrice}>
          {t('totalPrice')}
          <span data-tip data-for="price">
            <Icon name="error" size="xxxs" type="outlined" color="secondary" />
          </span>
          <ReactTooltip
            id="price"
            multiline="true"
            type="light"
            effect="solid"
            place="right"
            className={styles.customTooltip}
          >
            <span>{t('totalPriceIsUnitPriceAndQuantity')}</span>
          </ReactTooltip>
        </span>
      </>
    )
  }

  const [showCloseConfirmPopup, setShowCloseConfirmPopup] = useState(false)

  const closeConfirmObject = {
    onClose: () => {
      setShowCloseConfirmPopup(false)
    },
    onAction: () => {
      setAddSliderOpen(false)
      setEditSliderOpen(false)
      setShowCloseConfirmPopup(false)
    },
  }

  const handleSliderCloseAdd = () => {
    if (dataAdded) {
      setShowCloseConfirmPopup(true)
    } else {
      setAddSliderOpen(false)
    }
  }

  const handleSliderCloseEdit = () => {
    if (dataEdited) {
      setShowCloseConfirmPopup(true)
    } else {
      setEditSliderOpen(false)
    }
  }

  const checkForConfirmationPopupAdd = (
    invoiceNumber,
    merchantName,
    purchaseDate,
    purchaseDescription,
    items
  ) => {
    let check_empty = false
    for (var key in items) {
      if (
        items[key]['categoryName'] ||
        items[key]['itemName'] ||
        items[key]['price'] ||
        items[key]['quantity']
      ) {
        check_empty = true
        break
      }
    }
    if (check_empty) {
      setDataAdded(true)
    } else if (
      invoiceNumber ||
      merchantName ||
      purchaseDate ||
      purchaseDescription
    ) {
      setDataAdded(true)
    } else {
      setDataAdded(false)
    }
  }

  const checkForConfirmationPopupEdit = (
    invoiceNumber,
    merchantName,
    purchaseDate,
    purchaseDescription,
    _
  ) => {
    if (
      invoiceNumber !== editPurchaseOrderData?.invoiceNumber ||
      purchaseDescription !== editPurchaseOrderData?.purchaseDescription
    ) {
      setDataEdited(true)
    } else {
      setDataEdited(false)
    }
  }

  const checkDivParams = () => {
    const userData = infoDivParams === null ? {} : infoDivParams[adminId]
    if (userData && userData.purchaseOrder === false) return false
    else return true
  }
  const handleClose = () => {
    const params = infoDivParams !== null ? infoDivParams : {}

    if (params[adminId] !== undefined) {
      params[adminId]['purchaseOrder'] = false
    } else {
      params[adminId] = {purchaseOrder: false}
    }

    setToLocalStorage('INVENTORY_INFO_DIV_PARAMS', JSON.stringify(params))
    setInfoDivPamars(
      JSON.parse(getFromLocalStorage('INVENTORY_INFO_DIV_PARAMS'))
    )
  }

  CONST_PURCHASE_ORDERS_ITEM_TABLE_HEADERS[5].label = <TotalPrice />

  return (
    <>
      <div className={styles.parentWrapper}>
        {checkDivParams() && (
          <div className={styles.infoWrapper}>
            <p className={styles.infoContentDiv}>
              <Icon name="info" color="basic" size="xs" />
              &nbsp;&nbsp;{t('purchaseOrderInfoDiv')}
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
        <div
          className={styles.wrapper}
          onClick={(e) => {
            e.stopPropagation()
            filterDropdownOpen && setFilterDropdownOpen(false)
          }}
        >
          <div className={styles.searchBoxContainer}>
            <AlternateSearchBox
              value={inputValue}
              placeholder={t('serachBarPlaceHolder')}
              handleSearchFilter={handleSearchFilter}
            />
          </div>
          <div className={styles.buttonWrapper}>
            <div className={styles.filters}>
              <div className={styles.filterWrapper}>
                <div
                  className={styles.filterHeader}
                  onClick={() => {
                    setFilterDropdownOpen(true)
                  }}
                >
                  <div className={styles.filterHeaderText}>{filterTitle}</div>
                  <Icon
                    name={filterDropdownOpen ? 'upArrow' : 'downArrow'}
                    size="xs"
                    color="primary"
                  ></Icon>
                </div>
                {filterDropdownOpen && (
                  <div className={styles.dropdown}>
                    {filterOptions.map(({label, value}) => (
                      <div
                        className={styles.filterValue}
                        key={value}
                        onClick={() => {
                          handleFilterClick(value)
                          eventManager.send_event(
                            events.IM_PO_TIMELINE_FILTER_CLICKED_TFI,
                            {filter_type: value}
                          )
                        }}
                      >
                        {label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <Permission
              permissionId={
                PERMISSION_CONSTANTS.inventoryPurchaseOrderController_add_create
              }
            >
              <Button
                type="secondary"
                className={styles.button}
                onClick={() => {
                  setAddSliderOpen(true)
                  eventManager.send_event(events.IM_ADD_NEW_PO_TFI, {})
                }}
              >
                {t('addPurchaseOrderPlus')}
              </Button>
            </Permission>
          </div>
        </div>
      </div>
      <div className={styles.tablize}>
        <div className={styles.tableWrap}>
          <div className={styles.tableHeader} key={uuidv4()}>
            <div className={styles.tableCell}>{t('tableHeaderInvoiceNo')}</div>
            <div className={styles.tableCell}>
              {t('tableHeaderInvoiceDate')}
            </div>
            <div className={styles.tableCell}>{t('supplier')}</div>
            <div className={styles.tableCell}>{t('description')}</div>
            <div className={styles.tableCell}>{t('edit')}</div>
            <div className={styles.tableCell}>{t('delete')}</div>
          </div>
          {filteredOrdersData?.map((order) => {
            let tableRows = createTableRows(order.purchase_data)
            return (
              <FlatAccordion
                onClick={() => {
                  eventManager.send_event(
                    events.IM_VIEW_PO_DETAIL_CLICKED_TFI,
                    {id: order._id}
                  )
                }}
                openOnlyOnArrowClick={false}
                title={<AccordionStructure {...order} />}
                titleClass={styles.accordion}
                key={order._id}
              >
                {
                  <Table
                    cols={CONST_PURCHASE_ORDERS_ITEM_TABLE_HEADERS}
                    rows={tableRows}
                  />
                }
              </FlatAccordion>
            )
          })}
        </div>
      </div>
      {showDeleteConfirmPopup && <ConfirmationPopup {...deletConfirmObject} />}
      {preventDeletePopup && (
        <ConfirmationPopup {...PreventDeleteConfirmObject} />
      )}
      {addSliderOpen && (
        <Slider
          open={addSliderOpen}
          setOpen={handleSliderCloseAdd}
          hasCloseIcon={true}
          widthInPercent={70}
          content={
            <PurchaseOrderForm
              setSliderOpen={setAddSliderOpen}
              checkForConfirmationPopup={checkForConfirmationPopupAdd}
              setFilterTitle={setFilterTitle}
            />
          }
        ></Slider>
      )}
      {editSliderOpen && (
        <Slider
          open={true}
          setOpen={handleSliderCloseEdit}
          hasCloseIcon={true}
          widthInPercent={70}
          content={
            <PurchaseOrderForm
              setSliderOpen={setEditSliderOpen}
              isEdit={true}
              data={editPurchaseOrderData}
              checkForConfirmationPopup={checkForConfirmationPopupEdit}
              setFilterTitle={setFilterTitle}
            />
          }
        ></Slider>
      )}
      {showCloseConfirmPopup && (
        <CloseSliderConfirmPopup {...closeConfirmObject} />
      )}
    </>
  )
}
