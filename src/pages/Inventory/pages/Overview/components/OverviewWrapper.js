import React, {useEffect, useState} from 'react'
import InventoryOnboarding from './InventoryOnboarding'
import RouteMapping from '../RouteMapping'
import {InfoCard} from './InfoCard'
import {Icon} from '@teachmint/common'
import Cash from '../../../../../assets/images/icons/cash.svg'
import {
  getAggregateDataRequestedAction,
  getAllCategoriesRequestAction,
  getAllItemsListRequestAction,
  setPage,
  setCurrentPageReference,
  setApiFilterData,
  setSelectedFilters,
  setPossibleAllocationIds,
  setSearchText,
} from '../redux/actions/actions'
import {NavLink, useRouteMatch} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {PAGE_LIMIT} from '../../../../../constants/inventory.constants'
import styles from './overview.module.css'
import {events} from '../../../../../utils/EventsConstants'
import {getSymbolFromCurrency} from '../../../../../utils/Helpers'
import {DEFAULT_CURRENCY} from '../../../../../constants/common.constants'

export default function OverviewWrapper() {
  const inventoryState = useSelector((state) => state.inventoryOverview)
  const [categoryListExists, setCategoryListExists] = useState(
    inventoryState.aggregateData?.obj?.total_categories > 0
  )
  const {eventManager, instituteInfo} = useSelector((state) => state)
  const [aggregatedInfo, setAggregatedInfo] = useState([])
  const [totalCategories, setTotalCategories] = useState(0)
  const [totalInventory, setTotalInventory] = useState(0)
  const [allocatedInventory, setAllocatedInventory] = useState(0)
  const [totalInventoryWorth, setInventoryWorth] = useState(0)

  const {t} = useTranslation()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getAggregateDataRequestedAction())
    dispatch(getAllItemsListRequestAction({limit: PAGE_LIMIT}))
    dispatch(setPage(1))
    dispatch(setApiFilterData([]))
    dispatch(setSearchText(''))
    dispatch(setCurrentPageReference({limit: PAGE_LIMIT, next: true}))
    dispatch(setSelectedFilters([]))
    dispatch(setPossibleAllocationIds([]))
    Object.keys(inventoryState.allCategories).length === 0
      ? dispatch(getAllCategoriesRequestAction())
      : ''
  }, [])

  useEffect(() => {
    updateCard()
  }, [totalCategories, totalInventory, allocatedInventory, totalInventoryWorth])

  useEffect(() => {
    setCategoryListExists(
      inventoryState.aggregateData?.obj?.total_categories > 0 ? true : false
    )
    updateCardDetails(inventoryState.aggregateData?.obj)
  }, [inventoryState.aggregateData?.obj])

  function updateCardDetails(obj) {
    setTotalCategories(obj?.total_categories)
    setTotalInventory(obj?.total_quantity)
    setAllocatedInventory(obj?.total_allocated)
    setInventoryWorth(obj?.total_worth)
  }

  function updateCard() {
    let cards = [
      {
        id: 'total_inventory',
        icon: <Icon size="xs" type="filled" name="inventory" color="primary" />,
        title: t('totalInventory'),
        description: `${totalCategories} Categories, ${new Intl.NumberFormat(
          'en-IN'
        ).format(totalInventory)}  units`,
        viewMore: false,
        classes: {frame: 'frameBlue'},
      },
      {
        id: 'allocated_inventory',
        icon: <Icon size="xs" type="filled" name="archive" color="warning" />,
        title: t('allocatedInventory'),
        description: `${new Intl.NumberFormat('en-IN').format(
          allocatedInventory
        )} of ${new Intl.NumberFormat('en-IN').format(totalInventory)} units`,
        viewMore: false,
        classes: {frame: 'frameOrange'},
      },
      {
        id: 'total_inventory_worth',
        icon: <img src={Cash} className="h-6 w-6" />,
        title: t('totalInventoryWorth'),
        description: (
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
                ).format(totalInventoryWorth)}
              </label>
            </div>
          </>
        ),
        viewMore: false,
        classes: {frame: 'frameGreen'},
      },
    ]
    setAggregatedInfo(cards)
  }

  let {path} = useRouteMatch()
  const url = (link) => `${path}/${link}`

  return categoryListExists ? (
    <>
      <InfoCard cards={aggregatedInfo} />
      <div className={styles.navbarStyling}>
        <nav className={styles.tabMenu}>
          <NavLink
            key={`categories-12345`}
            activeClassName={styles.active}
            to={url('categories')}
            onClick={() => {
              eventManager.send_event(
                events.IM_CATEGORY_OVERVIEW_SUBTAB_CLICKED_TFI,
                {}
              )
            }}
          >
            {t('categoryOverview')}
          </NavLink>
        </nav>
        <nav className={styles.tabMenu}>
          <NavLink
            key={`items-12345`}
            activeClassName={styles.active}
            to={url('items')}
            onClick={() => {
              eventManager.send_event(
                events.IM_ITEM_OVERVIEW_SUBTAB_CLICKED_TFI,
                {}
              )
            }}
          >
            {t('itemOverview')}
          </NavLink>
        </nav>

        <RouteMapping />
      </div>
    </>
  ) : (
    <InventoryOnboarding />
  )
}
