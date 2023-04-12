import React, {useEffect, useState} from 'react'
import PurchaseOrderOnboard from './PurchaseOrderOnboard'
import GRNLandingPage from './PurachaseOrderLandingPage'
import {useDispatch, useSelector} from 'react-redux'
import {getPurchaseOrderListAction} from '../redux/actions/actions'
import {getAllCategoriesRequestAction} from '../../Overview/redux/actions/actions'
import {showLoadingAction} from '../../../../../redux/actions/commonAction'
export default function Overview() {
  const purchaseOrdersState = useSelector(
    (state) => state.inventoryPurchaseOrder
  )
  const inventoryState = useSelector((state) => state.inventoryOverview)
  const [preventDeletePopup, setPreventDeletePopup] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [grnExists, setGrnExists] = useState(
    purchaseOrdersState?.purchaseOrdersListData?.obj?.hits?.length > 0
  )

  const dispatch = useDispatch()
  useEffect(() => {
    setPreventDeletePopup(false)
    if (!grnExists) dispatch(getPurchaseOrderListAction({}))
    Object.keys(inventoryState?.allCategories).length > 0
      ? dispatch(getAllCategoriesRequestAction())
      : null
  }, [])

  useEffect(() => {
    if (purchaseOrdersState.purchaseOrdersListLoading) {
      dispatch(showLoadingAction(true))
      setIsLoading(true)
    } else {
      dispatch(showLoadingAction(false))
      setIsLoading(false)
    }
  }, [purchaseOrdersState.purchaseOrdersListLoading])

  useEffect(() => {
    setGrnExists(
      purchaseOrdersState?.purchaseOrdersListData?.obj?.hits?.length > 0
        ? true
        : false
    )
  }, [purchaseOrdersState.purchaseOrdersListData])

  return !isLoading ? (
    grnExists ? (
      <GRNLandingPage
        preventDeletePopup={preventDeletePopup}
        setPreventDeletePopup={setPreventDeletePopup}
      />
    ) : (
      <PurchaseOrderOnboard />
    )
  ) : (
    ''
  )
}
