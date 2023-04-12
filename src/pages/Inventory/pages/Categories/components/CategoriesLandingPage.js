import React, {useEffect, useState} from 'react'
import CategoryOnboarding from './CategoryOnboarding'

import {getAllCategoriesRequestAction} from '../../Overview/redux/actions/actions'
import {useDispatch, useSelector} from 'react-redux'
import CategoriesPage from './CategoriesPage'
import {showLoadingAction} from '../../../../../redux/actions/commonAction'

export default function CategoryWrapper() {
  const inventoryState = useSelector((state) => state.inventoryOverview)
  const [categoryListExists, setCategoryListExists] = useState(
    Object.keys(inventoryState?.allCategories).length > 0
  )
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    !categoryListExists ? dispatch(getAllCategoriesRequestAction()) : ''
  }, [])

  useEffect(() => {
    if (inventoryState.allCategoriesLoading) {
      dispatch(showLoadingAction(true))
      setIsLoading(true)
    } else {
      dispatch(showLoadingAction(false))
      setIsLoading(false)
    }
  }, [inventoryState.allCategoriesLoading])

  useEffect(() => {
    if (Object.keys(inventoryState?.allCategories).length > 0) {
      setCategoryListExists(true)
    } else {
      setCategoryListExists(false)
    }
  }, [inventoryState.allCategories])

  return !isLoading ? (
    categoryListExists ? (
      <CategoriesPage />
    ) : (
      <CategoryOnboarding />
    )
  ) : (
    ''
  )
}
