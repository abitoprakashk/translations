import React, {useEffect, useState} from 'react'
import {Button, Icon} from '@teachmint/common'
import styles from './overviewCategory.module.css'
import MainTableUI from './UIStructures'
import {useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import SliderBulkAllocateItems from '../Allocation/SliderBulkAllocation'
import {events} from '../../../../../../utils/EventsConstants'
import AlternateSearchBox from '../../../../components/Common/AlternateSearchBox'
import {
  setToLocalStorage,
  getFromLocalStorage,
} from '../../../../../../utils/Helpers'
import Permission from '../../../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../../utils/permission.constants'

export default function Overview() {
  const [inputValue, setInputValue] = useState('')
  const [categoryData, setCategoryData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [sliderBulkAllocate, setSliderBulkAllocate] = useState(false)
  const {eventManager, adminInfo} = useSelector((state) => state)
  const inventoryStoresState = useSelector((state) => state.inventoryStores)
  const inventoryState = useSelector((state) => state.inventoryOverview)
  const [itemStores, setStoreData] = useState([])
  const [infoDivParams, setInfoDivPamars] = useState(
    JSON.parse(getFromLocalStorage('INVENTORY_INFO_DIV_PARAMS'))
  )
  const [adminId, setAdminId] = useState(adminInfo._id)
  const {t} = useTranslation()
  const handleSearchFilter = (val) => {
    setInputValue(val)
    setFilteredData({
      category_list: search([...categoryData.category_list], val),
    })
    return
  }

  useEffect(() => {
    setStoreData(inventoryStoresState.storeItemsData.obj)
  }, [inventoryStoresState.storeItemsData])

  useEffect(() => {
    setAdminId(adminInfo._id)
  }, [adminInfo])

  const search = (dataList, searchString) => {
    let filteredList = []
    for (let i = 0; i < dataList.length; i++) {
      let newList
      if (
        dataList[i].name.toLowerCase().indexOf(searchString.toLowerCase()) >= 0
      ) {
        if (dataList[i].item_list?.length > 0) {
          newList = {
            ...dataList[i],
            item_list: dataList[i].item_list.filter((item) => {
              return (
                item.name.toLowerCase().indexOf(searchString.toLowerCase()) >= 0
              )
            }),
          }
        }
        newList.item_list =
          newList.item_list.length === 0
            ? dataList[i].item_list
            : newList.item_list
        filteredList.push(newList)
      } else {
        if (dataList[i].item_list?.length > 0) {
          newList = {
            ...dataList[i],
            item_list: dataList[i].item_list.filter((item) => {
              return (
                item.name.toLowerCase().indexOf(searchString.toLowerCase()) >= 0
              )
            }),
          }
        }
        newList.item_list.length > 0 ? filteredList.push(newList) : null
      }
    }
    return filteredList
  }

  useEffect(() => {
    setCategoryData({category_list: inventoryState.allCategories.obj})
    setFilteredData({category_list: inventoryState.allCategories.obj})
  }, [inventoryState.allCategories])

  const handleAllocation = () => {
    eventManager.send_event(events.IM_BULK_ALLOCATE_CLICKED_TFI, {})
    setSliderBulkAllocate(true)
  }

  const handleClose = () => {
    const params = infoDivParams !== null ? infoDivParams : {}

    if (params[adminId] !== undefined) {
      params[adminId]['categoryOverview'] = false
    } else {
      params[adminId] = {categoryOverview: false}
    }

    setToLocalStorage('INVENTORY_INFO_DIV_PARAMS', JSON.stringify(params))
    setInfoDivPamars(
      JSON.parse(getFromLocalStorage('INVENTORY_INFO_DIV_PARAMS'))
    )
  }

  const checkDivParams = () => {
    const userData = infoDivParams === null ? {} : infoDivParams[adminId]
    if (userData && userData.categoryOverview === false) return false
    else return true
  }

  return (
    <>
      <div className={styles.wrapper}>
        {inventoryState?.aggregateData?.obj?.total_allocated === 0 && (
          <div className={styles.bulkAllocationWrapper}>
            <p>{t('allocateDesc')}</p>
            <Permission
              permissionId={
                PERMISSION_CONSTANTS.inventoryItemController_allocateAutomatic_update
              }
            >
              <Button
                className={styles.allocateNowBtn}
                onClick={handleAllocation}
              >
                {t('allocateNow')}
              </Button>
            </Permission>
          </div>
        )}
        {inventoryState?.aggregateData?.obj?.total_allocated !== 0 &&
          checkDivParams() && (
            <div className={styles.infoWrapper}>
              <p className={styles.infoContentDiv}>
                <Icon name="info" color="basic" size="xs" />
                &nbsp;&nbsp;{t('categoryInfoDiv')}
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
        <div className={styles.searchBoxContainer}>
          <AlternateSearchBox
            value={inputValue}
            placeholder={t('searchPlaceholderCategory')}
            handleSearchFilter={handleSearchFilter}
          />
        </div>
      </div>
      <MainTableUI {...filteredData} />
      {sliderBulkAllocate && (
        <SliderBulkAllocateItems
          sliderScreen={sliderBulkAllocate}
          setSliderScreen={setSliderBulkAllocate}
          itemStores={itemStores}
          bulkAllocateSlider={sliderBulkAllocate}
          currentPageReference={inventoryState?.currentPageReference}
          apiFilterData={inventoryState?.apiFilterData}
          possibleAllocatedIds={inventoryState?.possibleAllocatedIds}
          searchText={inventoryState?.searchText}
        />
      )}
    </>
  )
}
