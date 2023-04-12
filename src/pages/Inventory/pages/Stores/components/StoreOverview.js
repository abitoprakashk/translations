import React, {useEffect, useState} from 'react'
import {Button, Icon, Table, Slider} from '@teachmint/common'
import styles from './store.module.css'
import {useTranslation, Trans} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import EditStoreForm from './editStoreForm'
import {
  CONST_STORE_COLUMN_HEADERS,
  CONST_STORE_COLUMN_MAPPING,
} from '../../../../../constants/inventory.constants'
import ShowItemDetailsSlider from './ShowItemDetailsSlider'
import ConfirmationPopup from '../../../../../components/Common/ConfirmationPopup/ConfirmationPopup'
import {deleteInventoryItemStoreAction} from '../redux/actions/actions'
import {events} from '../../../../../utils/EventsConstants'
import CloseSliderConfirmPopup from '../../../components/Common/CloseSliderConfirmPopUp'
import AlternateSearchBox from '../../../components/Common/AlternateSearchBox'
import {
  setToLocalStorage,
  getFromLocalStorage,
} from '../../../../../utils/Helpers'
import Permission from '../../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../utils/permission.constants'

export function StoreOverview({setIsAddStoreSliderOpen}) {
  const {t} = useTranslation()
  const inventoryStoresState = useSelector((state) => state.inventoryStores)
  const [inputValue, setInputValue] = useState('')
  const [allStoreData, setAllStoreData] = useState()
  const [tableRows, setTableRows] = useState([])
  const [isEditStoreSliderOpen, setIsEditStoreSliderOpen] = useState(false)
  const [isItemDetailsSliderOpen, setIsItemDetailsSliderOpen] = useState(false)
  const [showDeleteConfirmPopup, setShowDeleteConfirmPopup] = useState(false)
  const [selectedRowData, setSelectedRowData] = useState('')
  const {eventManager, adminInfo} = useSelector((state) => state)
  const dispatch = useDispatch()
  const [selectedStoreName, setStoreName] = useState('')
  const [selectedStoreDescription, setDescription] = useState('')
  const [infoDivParams, setInfoDivPamars] = useState(
    JSON.parse(getFromLocalStorage('INVENTORY_INFO_DIV_PARAMS'))
  )
  const [adminId, setAdminId] = useState(adminInfo._id)

  const search = (dataList, searchString) => {
    let filteredList = dataList.filter((data) => {
      if (data.name?.toLowerCase().indexOf(searchString.toLowerCase()) >= 0) {
        return true
      }
    })
    return filteredList
  }

  const handleSearchFilter = (str) => {
    setInputValue(str)
    creatRowData(search(allStoreData, str))
  }

  useEffect(() => {
    setAdminId(adminInfo._id)
  }, [adminInfo])

  useEffect(() => {
    setAllStoreData(inventoryStoresState?.storeItemsData?.obj)
    creatRowData(inventoryStoresState?.storeItemsData?.obj)
    setIsEditStoreSliderOpen(false)
  }, [inventoryStoresState.storeItemsData])

  function addItemClickHandler() {
    setIsAddStoreSliderOpen((isAddStoreSliderOpen) => !isAddStoreSliderOpen)
  }

  const handleEdit = (data) => {
    setSelectedRowData(data)
    setIsEditStoreSliderOpen((isEditStoreSliderOpen) => !isEditStoreSliderOpen)
    eventManager.send_event(events.IM_EDIT_STORE_CLICKED_TFI, {})
  }
  const ItemCountField = (props) => {
    const onViewDetailsClick = () => {
      eventManager.send_event(events.IM_VIEW_ITEM_LIST_TFI, {})
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
          <Button onClick={onViewDetailsClick} type={'keyboard'}>
            <ViewDetailButton />
          </Button>
        )}
      </>
    )
  }
  const handleDelete = (data) => {
    setSelectedRowData(data)
    setShowDeleteConfirmPopup(
      (showDeleteConfirmPopup) => !showDeleteConfirmPopup
    )
  }

  function creatRowData(data) {
    let allRows = []
    data?.map((storeItem) => {
      let newRow = {}
      for (let key in CONST_STORE_COLUMN_MAPPING) {
        newRow[key] = storeItem[CONST_STORE_COLUMN_MAPPING[key]]
      }
      newRow['itemCount'] = <ItemCountField {...storeItem} />
      newRow['edit'] = (
        <>
          <Permission
            permissionId={
              PERMISSION_CONSTANTS.inventoryItemStoreController_edit_update
            }
          >
            <Button
              className={styles.ellipsisVertical}
              onClick={(e) => {
                handleEdit(storeItem, e)
              }}
            >
              <Icon name="edit1" size="xxs" color="primary" />
            </Button>
          </Permission>
        </>
      )
      newRow['delete'] = (
        <>
          <Permission
            permissionId={
              PERMISSION_CONSTANTS.inventoryItemStoreController_deleteRoute_delete
            }
          >
            <Button
              className={styles.ellipsisVertical}
              onClick={(e) => {
                handleDelete(storeItem, e)
              }}
            >
              <Icon name="delete" size="xxs" color="error" type="outlined" />
            </Button>
          </Permission>
        </>
      )

      allRows.push(newRow)
    })
    setTableRows(allRows)
  }

  const closePopupAndRemoveSelection = () => {
    setShowDeleteConfirmPopup(false)
    setSelectedRowData({})
  }

  const confirmObjectUnallocated = {
    onClose: closePopupAndRemoveSelection,
    onAction: () => {
      closePopupAndRemoveSelection()
      dispatch(deleteInventoryItemStoreAction(selectedRowData._id))
    },
    icon: <Icon name="delete" size="4xl" color="error" type="outlined" />,
    title: (
      <Trans i18nKey="deleteStoreWithoutObjectsPopupTitle">
        Delete store {{storeName: selectedRowData.name}}
      </Trans>
    ),
    desc: t('deleteStoreWithoutObjectsPopupDescription'),
    primaryBtnText: t('cancel'),
    secondaryBtnText: t('delete'),
    closeOnBackgroundClick: true,
    secondaryBtnStyle: styles.buttonRed,
  }

  const confirmObjectAllocated = {
    onClose: closePopupAndRemoveSelection,
    onAction: closePopupAndRemoveSelection,
    icon: <Icon name="error" size="4xl" color="warning" type="outlined" />,
    title: t('deleteStoreWithObjectsPopupTitle'),
    desc: t('deleteStoreWithObjectsPopupDescription'),
    primaryBtnText: t('ackPopupBtnText'),
    primaryBtnStyle: styles.buttonOkay,
    closeOnBackgroundClick: true,
  }

  const [showCloseConfirmPopup, setShowCloseConfirmPopup] = useState(false)

  const closeConfirmObject = {
    onClose: () => {
      setShowCloseConfirmPopup(false)
    },
    onAction: () => {
      setIsEditStoreSliderOpen(false)
      setShowCloseConfirmPopup(false)
    },
  }

  const handleSliderClose = () => {
    if (
      selectedStoreName !== selectedRowData?.name ||
      selectedStoreDescription !== selectedRowData?.description
    ) {
      setShowCloseConfirmPopup(true)
    } else {
      setIsEditStoreSliderOpen(false)
    }
  }

  function checkForConfirmationPopup(storeNameInput, storeDescInput) {
    setStoreName(storeNameInput)
    setDescription(storeDescInput)
  }

  const checkDivParams = () => {
    const userData = infoDivParams === null ? {} : infoDivParams[adminId]
    if (userData && userData.storePage === false) return false
    else return true
  }
  const handleClose = () => {
    const params = infoDivParams !== null ? infoDivParams : {}

    if (params[adminId] !== undefined) {
      params[adminId]['storePage'] = false
    } else {
      params[adminId] = {storePage: false}
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
              &nbsp;&nbsp;{t('storeOverviewInfoDiv')}
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
          <div className={styles.searchBoxContainer}>
            <AlternateSearchBox
              value={inputValue}
              placeholder={t('storeSarchPlaceHolder')}
              handleSearchFilter={handleSearchFilter}
            />
          </div>
          <div>
            <Permission
              permissionId={
                PERMISSION_CONSTANTS.inventoryItemStoreController_add_create
              }
            >
              <Button
                type={'secondary'}
                size={'medium'}
                className={styles.button}
                onClick={addItemClickHandler}
              >
                {t('addStoreText')}
              </Button>
            </Permission>
          </div>
        </div>
      </div>
      <div className={styles.tableWrap}>
        <Table cols={CONST_STORE_COLUMN_HEADERS} rows={tableRows} />
      </div>
      {isEditStoreSliderOpen && (
        <Slider
          open={isEditStoreSliderOpen}
          setOpen={handleSliderClose}
          content={
            <EditStoreForm
              setIsEditStoreSliderOpen={setIsEditStoreSliderOpen}
              id={selectedRowData?._id}
              name={selectedRowData?.name}
              desc={selectedRowData?.description}
              checkForConfirmationPopup={checkForConfirmationPopup}
            />
          }
          hasCloseIcon={true}
        />
      )}
      {isItemDetailsSliderOpen && (
        <Slider
          open={isItemDetailsSliderOpen}
          setOpen={setIsItemDetailsSliderOpen}
          content={<ShowItemDetailsSlider {...selectedRowData} />}
          hasCloseIcon={true}
        />
      )}
      {showDeleteConfirmPopup &&
        (selectedRowData.item_count ? (
          <ConfirmationPopup {...confirmObjectAllocated} />
        ) : (
          <ConfirmationPopup {...confirmObjectUnallocated} />
        ))}
      {showCloseConfirmPopup && (
        <CloseSliderConfirmPopup {...closeConfirmObject} />
      )}
    </>
  )
}
