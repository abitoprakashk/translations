import {useEffect, useRef, useState} from 'react'
import {Button, Icon} from '@teachmint/common'
import styles from './addCategoryForm.module.css'
import {v4 as uuidv4} from 'uuid'
import {AddCategoryCard} from '../AddCategoryCard/AddCategoryCard'
import {useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import {
  getAllItemsListRequestAction,
  addInventoryItemAction,
  emptyBlackListAction,
  updateInventoryItemCategoryAction,
} from '../../../pages/Overview/redux/actions/actions'
import {createPrefixAction} from '../../../pages/Overview/redux/actions/actions'
import ConfirmationPopup from '../../../../../components/Common/ConfirmationPopup/ConfirmationPopup'
import {events} from '../../../../../utils/EventsConstants'
import {PAGE_LIMIT} from '../../../../../constants/inventory.constants'

export function AddCategoryForm({
  setIsDataChanged,
  setSliderOpen,
  screenName,
  isEdit = false,
  data,
  scrollBotttom = false,
}) {
  const ref = useRef()

  const scrollToBottom = (objDiv) => {
    objDiv.scrollTop = objDiv.scrollHeight
  }

  useEffect(() => {
    if (scrollBotttom) {
      scrollToBottom(ref.current)
    }
  }, [])

  const {t} = useTranslation()
  const dispatch = useDispatch()
  const [inputFieldErrors, setInputFieldErrors] = useState({})

  const inventoryOverview = useSelector((state) => state.inventoryOverview)
  const {eventManager} = useSelector((state) => state)

  const handleInputFieldError = (hasError, id) => {
    let tempErrors = {...inputFieldErrors}
    if (hasError) {
      tempErrors = {...inputFieldErrors, [id]: true}
    } else {
      delete tempErrors[id]
    }
    setInputFieldErrors(tempErrors)
  }

  const getNewCategoryData = () => {
    if (isEdit) {
      if (Object.keys(data).length > 0) {
        return data
      }
    }
    const categorykey = uuidv4()
    const itemKey = uuidv4()
    const itemData = {
      name: '',
      prefix: '',
      stock: '',
      price: '',
      hasError: true,
    }
    const categoryData = {
      name: '',
      accordionOpen: true,
      items: {[itemKey]: itemData},
    }
    handleInputFieldError(true, categorykey)
    return {
      [categorykey]: {...categoryData},
    }
  }

  const [categoriesData, setCategoriesData] = useState(() =>
    getNewCategoryData()
  )

  const addCategory = (categoriesData) => {
    let newCategoriesData = {...categoriesData}
    for (const key in newCategoriesData) {
      newCategoriesData[key].accordionOpen = false
    }
    setCategoriesData({...newCategoriesData, ...getNewCategoryData()})
  }

  const onRemoveCategory = (categoryId) => {
    let catData = {...categoriesData}
    delete catData[categoryId]
    setCategoriesData(catData)
    handleInputFieldError(false, categoryId)
  }

  const checkCategoriesDataChange = () => {
    if (isEdit) {
      if (JSON.stringify(data) === JSON.stringify(categoriesData)) {
        return false
      }
      return true
    }
    for (const key in categoriesData) {
      let category = categoriesData[key]
      if (category.name) {
        return true
      }
      let items = category.items
      for (const itemKey in items) {
        let item = items[itemKey]
        if (item.name || item.stock || item.stock) {
          return true
        }
      }
    }
    return false
  }

  useEffect(() => {
    setIsDataChanged(checkCategoriesDataChange())
  }, [categoriesData])

  const onCategoryChange = (categoryData, categoryHasError, categoryId) => {
    let tempErrors = {...inputFieldErrors}
    if (categoryHasError) {
      tempErrors = {...tempErrors, [categoryId]: true}
    } else {
      delete tempErrors[categoryId]
    }
    setInputFieldErrors(tempErrors)
    setCategoriesData({...categoriesData, [categoryId]: categoryData})
  }

  const [allItemNames, setAllItemNames] = useState({})
  const [allCategoryNames, setAllCategoryNames] = useState({})

  const getAllCategoryAndItemNames = () => {
    let categoryNames = {}
    let itemNames = {}
    inventoryOverview.allCategories?.obj?.forEach((cat) => {
      categoryNames[cat.name.toLowerCase()] = cat.name
      cat.item_list.forEach((item) => {
        itemNames[item.name.toLowerCase()] = item.name
      })
    })
    if (isEdit) {
      for (const catKey in data) {
        delete categoryNames[data[catKey].name.toLowerCase()]
        let items = data[catKey].items
        for (const itemKey in items) {
          delete itemNames[items[itemKey].name.toLowerCase()]
        }
      }
    }
    setAllCategoryNames(categoryNames)
    setAllItemNames(itemNames)
  }

  useEffect(() => {
    getAllCategoryAndItemNames()
  }, [])

  const checkUniqueItemName = (itemName, itemId, catId) => {
    for (const key in categoriesData) {
      let currentItems = categoriesData[key].items
      for (const itemKey in currentItems) {
        if (
          currentItems[itemKey].name.toLowerCase().trimEnd() ==
          itemName.toLowerCase().trimEnd()
        ) {
          if (itemKey === itemId && key == catId) {
            continue
          } else {
            return false
          }
        }
      }
    }
    if (
      Object.prototype.hasOwnProperty.call(
        allItemNames,
        itemName.toLowerCase().trimEnd()
      )
    ) {
      return false
    }
    return true
  }

  const checkUniqueCategoryName = (categoryName, catId) => {
    for (const key in categoriesData) {
      if (
        categoryName.toLowerCase().trimEnd() ===
          categoriesData[key].name.trimEnd() &&
        key != catId
      ) {
        return false
      }
    }
    if (
      Object.prototype.hasOwnProperty.call(
        allCategoryNames,
        categoryName.toLowerCase().trimEnd()
      )
    ) {
      return false
    }
    return true
  }

  const [prefixObj, setPrefixObj] = useState('')

  const handleprefix = (itemName, itemId, catId) => {
    let prefixBlacklist = []
    for (const catKey in categoriesData) {
      let items = categoriesData[catKey].items
      for (const itemKey in items) {
        if (itemKey != itemId || catKey != catId) {
          let currentPrefix = items[itemKey].prefix
          currentPrefix != '' ? prefixBlacklist.push(currentPrefix) : null
        }
      }
    }
    dispatch(
      createPrefixAction({
        name: itemName.trimEnd(),
        blacklist: prefixBlacklist,
      })
    )
    setPrefixObj({category: catId, item: itemId})
  }

  useEffect(() => {
    if (prefixObj) {
      let categories = {...categoriesData}
      categories[prefixObj.category].items[prefixObj.item].prefix =
        inventoryOverview.prefixBlacklist[
          inventoryOverview.prefixBlacklist?.length - 1
        ]
      setCategoriesData(categories)
    }
  }, [inventoryOverview.prefixBlacklist])

  const handleEditDispatch = () => {
    let addItems = []
    let editItems = []
    let catId = Object.keys(categoriesData)[0]
    let items = categoriesData[catId].items
    for (const itemKey in items) {
      let currentItem = items[itemKey]
      if (itemKey.length == 36) {
        const addItemObj = {
          item_name: currentItem.name,
          prefix: currentItem.prefix,
          unit_price: parseFloat(currentItem.price),
          quantity: parseInt(currentItem.stock),
        }
        addItems.push(addItemObj)
      } else {
        const editItemObj = {item_id: itemKey, name: currentItem.name}
        editItems.push(editItemObj)
      }
    }
    let payload = {
      _id: catId,
      category_name: categoriesData[catId].name,
      edit_items_list: editItems,
      add_items_list: addItems,
    }
    eventManager.send_event(events.IM_CATEGORY_EDITED_TFI, {
      category_name: payload.category_name,
    })
    dispatch(updateInventoryItemCategoryAction(payload))
  }

  const handleAddDispatch = () => {
    let data = []
    for (let categoryKey in categoriesData) {
      let itemsData = []
      let currentItems = categoriesData[categoryKey].items
      for (let itemKey in currentItems) {
        let itemObj = {
          item_name: currentItems[itemKey].name,
          prefix: currentItems[itemKey].prefix,
          unit_price: parseFloat(currentItems[itemKey].price),
          quantity: parseInt(parseInt(currentItems[itemKey].stock)),
        }
        itemsData.push(itemObj)
      }

      let obj = {
        category_name: categoriesData[categoryKey].name,
        items_list: itemsData,
      }
      data.push(obj)
    }

    eventManager.send_event(events['IM_CATEGORY_&_ITEMS_ADDED_TFI'], {
      screen_name: screenName,
      categories_data: data,
    })
    dispatch(addInventoryItemAction(data))
  }

  const onDoneButtonClick = () => {
    if (isEdit && !(JSON.stringify(data) === JSON.stringify(categoriesData))) {
      handleEditDispatch()
    } else if (!isEdit) {
      handleAddDispatch()
    }
    dispatch(emptyBlackListAction())
    dispatch(getAllItemsListRequestAction({limit: PAGE_LIMIT}))
    setSliderOpen(false)
    setCategoriesData(getNewCategoryData())
    setPrefixObj('')
  }

  const confirmObject = {
    onClose: () => {
      setShowConfirmPopup(false)
    },
    onAction: () => {
      onDoneButtonClick()
      setShowConfirmPopup(false)
    },
    icon: (
      <Icon
        name={'checkCircle'}
        size={'4xl'}
        color={'success'}
        type={'filled'}
      />
    ),
    title: t('saveDetails'),
    desc: t('categoryFormConfirmPopUpDesc'),
    primaryBtnText: t('cancel'),
    secondaryBtnText: t('save'),
    closeOnBackgroundClick: false,
  }

  const [showConfirmPopup, setShowConfirmPopup] = useState(false)

  return (
    <div className={styles.formWrapper}>
      <div className={styles.formTop}>
        <div className={styles.formHeading}>
          {isEdit ? t('editCategoryandItems') : t('addCategoryandItems')}
        </div>
      </div>
      <div ref={ref} className={styles.addCategoryFormWrapper}>
        <div className={styles.categoryList}>
          {Object.keys(categoriesData).map((id, index) => {
            return (
              <AddCategoryCard
                isEdit={isEdit}
                key={id}
                index={index + 1}
                categoryData={categoriesData[id]}
                removable={
                  Object.keys(categoriesData).length > 1 ? true : false
                }
                onRemoveCategory={() => {
                  onRemoveCategory(id)
                }}
                onCategoryChange={(categoryData, hasError) =>
                  onCategoryChange(categoryData, hasError, id)
                }
                checkUniqueItemName={(itemName, itemId) => {
                  return checkUniqueItemName(itemName, itemId, id)
                }}
                checkUniqueCategoryName={(catName) => {
                  return checkUniqueCategoryName(catName, id)
                }}
                handleprefix={(itemName, itemId) => {
                  handleprefix(itemName, itemId, id)
                }}
                screenName={screenName}
              ></AddCategoryCard>
            )
          })}
          {!isEdit && (
            <Button
              className={styles.addNewCategoryButton}
              onClick={() => {
                addCategory(categoriesData)
              }}
            >
              {t('addNewCategory')}
            </Button>
          )}
        </div>
      </div>
      <div className={styles.doneButtonWrapper}>
        <Button
          disabled={Object.keys(inputFieldErrors).length > 0 ? true : false}
          className={styles.doneButton}
          onClick={() => {
            if (isEdit) {
              onDoneButtonClick()
              return
            }
            setShowConfirmPopup(true)
          }}
        >
          {t('save')}
        </Button>
      </div>
      <div className={styles.confirmBoxWrapper}>
        {showConfirmPopup && <ConfirmationPopup {...confirmObject} />}
      </div>
    </div>
  )
}
