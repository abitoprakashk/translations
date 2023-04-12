import React, {useEffect, useState} from 'react'
import StoresOnboarding from './StoresOnboarding'
import {StoreOverview} from './StoreOverview'
import {getInventoryStoreListAction} from '../redux/actions/actions'
import {useDispatch, useSelector} from 'react-redux'
import AddStoreForm from './addStoreForm'
import {Slider} from '@teachmint/common'
import CloseSliderConfirmPopup from '../../../components/Common/CloseSliderConfirmPopUp'
import {showLoadingAction} from '../../../../../redux/actions/commonAction'

export default function Stores() {
  const dispatch = useDispatch()
  const inventoryStoresState = useSelector((state) => state.inventoryStores)
  const [storesExists, setStoresExists] = useState(
    inventoryStoresState?.storeItemsData?.obj?.length > 0
  )
  const [isAddStoreSliderOpen, setIsAddStoreSliderOpen] = useState(false)
  const [storeName, setStoreName] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (inventoryStoresState.storeItemsLoading) {
      dispatch(showLoadingAction(true))
      setIsLoading(true)
    } else {
      dispatch(showLoadingAction(false))
      setIsLoading(false)
    }
  }, [inventoryStoresState.storeItemsLoading])

  useEffect(() => {
    if (!storesExists) dispatch(getInventoryStoreListAction())
  }, [])

  useEffect(() => {
    setStoresExists(
      inventoryStoresState?.storeItemsData?.obj?.length > 0 ? true : false
    )
    setIsAddStoreSliderOpen(false)
  }, [inventoryStoresState.storeItemsData])

  const [showCloseConfirmPopup, setShowCloseConfirmPopup] = useState(false)

  const closeConfirmObject = {
    onClose: () => {
      setShowCloseConfirmPopup(false)
    },
    onAction: () => {
      setIsAddStoreSliderOpen(false)
      setShowCloseConfirmPopup(false)
    },
  }

  const handleSliderClose = () => {
    if (storeName?.length > 0 || description?.length > 0) {
      setShowCloseConfirmPopup(true)
    } else {
      setIsAddStoreSliderOpen(false)
    }
  }

  function checkForConfirmationPopup(storeNameInput, storeDescInput) {
    setStoreName(storeNameInput)
    setDescription(storeDescInput)
  }

  return (
    <>
      {isAddStoreSliderOpen && (
        <Slider
          open={isAddStoreSliderOpen}
          setOpen={handleSliderClose}
          content={
            <AddStoreForm
              isAddStoreSliderOpen={isAddStoreSliderOpen}
              screenName="item_room"
              checkForConfirmationPopup={checkForConfirmationPopup}
            />
          }
          hasCloseIcon={true}
        />
      )}
      {!isLoading ? (
        storesExists ? (
          <StoreOverview setIsAddStoreSliderOpen={setIsAddStoreSliderOpen} />
        ) : (
          <StoresOnboarding setIsAddStoreSliderOpen={setIsAddStoreSliderOpen} />
        )
      ) : (
        ''
      )}
      {showCloseConfirmPopup && (
        <CloseSliderConfirmPopup {...closeConfirmObject} />
      )}
    </>
  )
}
