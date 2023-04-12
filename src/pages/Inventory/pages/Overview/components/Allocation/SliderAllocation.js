import {
  Button,
  Input,
  Icon,
  MultiSelect,
  Slider,
  VirtualizedLazyList,
} from '@teachmint/common'
import SliderScreenHeader from '../../../../../../components/Common/SliderScreenHeader/SliderScreenHeader'
import styles from './SliderAllocation.module.css'
import {useEffect, useState} from 'react'
import classNames from 'classnames'
import {useSelector, useDispatch} from 'react-redux'
import {
  allocateItemsAutomaticallyAction,
  allocateItemsManuallyAction,
} from '../../../Overview/redux/actions/actions'
import {
  CONST_ITEM_ALLOCATION_STATUS,
  ALLOCATION_EVENT_MAP,
  CONST_ALLOCATION_METHOD,
} from '../../../../../../constants/inventory.constants'
import AddStoreForm from '../../../Stores/components/addStoreForm'
import {useTranslation} from 'react-i18next'
import {events} from '../../../../../../utils/EventsConstants'
import {compareStrings} from '../../../Categories/components/CategoriesPage'
import CloseSliderConfirmPopup from '../../../../components/Common/CloseSliderConfirmPopUp'
import {processInstituteMembersList} from '../../../../utils/Inventory.utils'

export default function SliderAllocateItems({
  sliderScreen,
  setSliderScreen,
  itemData,
  itemUnits,
  itemStores,
  apiFilterData,
  currentPageReference,
  possibleAllocatedIds,
  searchText,
}) {
  const dispatch = useDispatch()
  const inventoryStoresState = useSelector((state) => state.inventoryStores)
  const {
    instituteStudentList,
    instituteTeacherList,
    instituteAdminList,
    eventManager,
  } = useSelector((state) => state)
  const {t} = useTranslation()
  const [itemCount, setItemCount] = useState()
  const [allocationType, setAllocationType] = useState()
  const [allocateToType, setAllocateToType] = useState()
  const [allocateToId, setAllocateToId] = useState()
  const [unitOptions, setUnitOptions] = useState([])
  const [searchUserText, setSearchUserText] = useState('')
  const [searchUserResults, setSearchUserResults] = useState([])
  const [selectedUnits, setSelectedUnits] = useState([])
  const [disabled, setDisabled] = useState(true)
  const [isAddStoreSliderOpen, setIsAddStoreSliderOpen] = useState(false)
  const [storeName, setStoreName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedStore, setSelectedStore] = useState(null)
  let storeDropdown = []
  let tempStores = itemStores?.slice()

  tempStores?.sort((a, b) => compareStrings(a.name, b.name))

  tempStores?.forEach((store) =>
    storeDropdown.push({
      label: store.name,
      value: store._id,
    })
  )

  const [instituteMembers, setInstituteMembers] = useState(
    processInstituteMembersList(
      instituteAdminList,
      instituteTeacherList,
      instituteStudentList
    )
  )

  useEffect(() => {
    if (itemUnits && itemUnits.hits.length)
      setUnitOptions(
        itemUnits.hits.map((unit) => {
          if (
            unit.allocated_to_type === CONST_ITEM_ALLOCATION_STATUS.UNALLOCATED
          )
            return {
              label: (
                <span className={styles.primaryText}>
                  {unit.unit_code} | {itemData.name}
                </span>
              ),
              value: unit._id,
            }
        })
      )
  }, [itemUnits])

  useEffect(() => {
    setInstituteMembers(
      processInstituteMembersList(
        instituteAdminList,
        instituteTeacherList,
        instituteStudentList
      )
    )
  }, [instituteStudentList, instituteTeacherList, instituteAdminList])

  useEffect(() => {
    setIsAddStoreSliderOpen(false)
  }, [inventoryStoresState.storeItemsData])

  const handleSelection = (newSelectedOptions) => {
    if (
      selectedUnits.length <= itemCount &&
      newSelectedOptions.length <= itemCount
    )
      setSelectedUnits(newSelectedOptions)

    if (
      selectedUnits.length > itemCount &&
      newSelectedOptions.length < selectedUnits.length
    )
      setSelectedUnits(newSelectedOptions)
  }

  const handleSearchFilter = (text, fieldName) => {
    switch (fieldName) {
      case CONST_ITEM_ALLOCATION_STATUS.INDIVIDUAL:
        setSearchUserText(text)
        if (text.length >= 1) {
          const res = instituteMembers.filter(({name}) =>
            name.toLowerCase().startsWith(text.toLowerCase())
          )
          if (res.length > 0) {
            setSearchUserResults(res)
          } else setSearchUserResults([{name: t('noResults'), _id: 'no_value'}])
        } else setSearchUserResults([])
        break
      default:
        break
    }
  }

  const handleStoreSelection = ({fieldName, value}) => {
    switch (fieldName) {
      case 'Store':
        setSelectedStore(value)
        setAllocateToId({id: value})
        break
      default:
        break
    }
  }

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

  useEffect(() => {
    if (itemCount > 0 && allocationType?.length && allocateToId?.id?.length) {
      if (itemCount > unitOptions.length) {
        setDisabled(true)
      } else if (
        allocationType === CONST_ALLOCATION_METHOD.MANUAL &&
        selectedUnits.length == itemCount
      ) {
        setDisabled(false)
      } else if (allocationType === CONST_ALLOCATION_METHOD.AUTOMATIC)
        setDisabled(false)
      else setDisabled(true)
    } else setDisabled(true)
  }, [itemCount, allocationType, allocateToId, selectedUnits])

  const handleAllocation = () => {
    eventManager.send_event(events.IM_ITEM_ALLOCATED_TFI, {
      screen_name: 'category overview',
      allocation_type: allocationType,
      allocated_to: ALLOCATION_EVENT_MAP[allocateToType],
    })
    if (allocationType === CONST_ALLOCATION_METHOD.MANUAL) {
      let payload = {
        filters: {...apiFilterData},
        ...currentPageReference,
        possible_allocation_ids: possibleAllocatedIds,
      }
      if (searchText) {
        payload = {...payload, search_text: searchText}
      }
      dispatch(
        allocateItemsManuallyAction({
          allocationDetails: {
            unit_ids: selectedUnits,
            allocate_to_type: allocateToType,
            allocate_to_id: allocateToId.id,
          },
          payload: payload,
        })
      )
    }
    if (allocationType === CONST_ALLOCATION_METHOD.AUTOMATIC) {
      let payload = {
        filters: {...apiFilterData},
        ...currentPageReference,
        possible_allocation_ids: possibleAllocatedIds,
      }
      if (searchText) {
        payload = {...payload, search_text: searchText}
      }
      dispatch(
        allocateItemsAutomaticallyAction({
          allocationDetails: {
            _id: itemData._id,
            allocate_to_type: allocateToType,
            allocate_to_id: allocateToId.id,
            count: parseInt(itemCount),
          },
          payload: payload,
        })
      )
    }
    setSliderScreen(null)
  }

  const handleSelectUser = (item) => {
    if (item?.name !== t('noResults')) {
      setAllocateToId({
        id: item?._id,
        name: item?.name,
        phone_number: item?.phone_number,
        description: item?.description,
      })
      setSearchUserText('')
      setSearchUserResults([])
    }
  }

  const UserRow = ({item, index}) => {
    return (
      <div
        className={styles.profileContainer}
        onClick={() => handleSelectUser(item)}
        key={index}
      >
        <div className={styles.primaryText}>{item?.name}</div>
        <div className={styles.secondaryText}>
          {item?.phone_number || item?.email}
        </div>
      </div>
    )
  }

  return (
    <>
      <Slider
        open={sliderScreen}
        setOpen={setSliderScreen}
        hasCloseIcon={true}
        content={
          <>
            <SliderScreenHeader
              icon={<Icon name="allocateUser" size="xs" color="basic" />}
              title={t('allocateItem')}
            />
            <div className={styles.mainContainer}>
              <div className={styles.descContainer}>
                <p className={styles.typeText}>{t('category')}</p>
                <p className={styles.typeText}>{t('item')}</p>
                <p className={styles.valueTextLabel}>{itemData.category}</p>
                <p className={styles.valueTextLabel}>{itemData.name}</p>
              </div>
              <div className={styles.unitContainer}>
                <div className={styles.unitTextContainer}>
                  <p className={styles.typeText}>
                    {t('itemUnits')}
                    <span className={styles.red}>*</span>
                  </p>
                  <p className={styles.typeText}>
                    {t('availableUnits')}
                    <span className={styles.valueText}>
                      {unitOptions.length}
                    </span>
                  </p>
                </div>
                <Input
                  type="number"
                  fieldName="unitQuantity"
                  value={itemCount}
                  onChange={(obj) => setItemCount(obj.value)}
                  showError={
                    itemCount > unitOptions.length || itemCount === '0'
                  }
                  errorMsg={t('allocationErrorMsg')}
                  className={styles.unitInput}
                  errorClassName={styles.unitInputErrorClassName}
                  isRequired={true}
                  placeholder={t('unitInputPlaceholder')}
                />
              </div>
              <div className={styles.mt}>
                <p
                  className={classNames(styles.typeText, styles.ml, styles.mb)}
                >
                  {t('allocationMethod')}
                  <span className={styles.red}>*</span>
                </p>
                <div className={styles.methodInput}>
                  <div
                    className={classNames(
                      styles.inputOption,
                      styles.bottomBorder
                    )}
                  >
                    <input
                      type="radio"
                      value={CONST_ALLOCATION_METHOD.AUTOMATIC}
                      name="allocationMethod"
                      className={styles.input}
                      onChange={(e) => setAllocationType(e.target.value)}
                    />
                    <div className={styles.optionTextContainer}>
                      <p className={styles.keyText}>{t('automatic')}</p>
                      <p className={styles.valueTextSubtle}>
                        {t('automaticAllocationMsg')}
                      </p>
                    </div>
                  </div>
                  <div className={styles.inputOption}>
                    <input
                      type="radio"
                      value={CONST_ALLOCATION_METHOD.MANUAL}
                      name="allocationMethod"
                      className={styles.input}
                      onChange={(e) => setAllocationType(e.target.value)}
                    />
                    <div className={styles.optionTextContainer}>
                      <p className={styles.keyText}>{t('manual')}</p>
                      <p className={styles.valueTextSubtle}>
                        {t('chooseItemsToAllocate')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {allocationType === CONST_ALLOCATION_METHOD.MANUAL && (
                <div className={styles.mt}>
                  <div className={styles.unitDescContainer}>
                    <p
                      className={classNames(
                        styles.typeText,
                        styles.ml,
                        styles.mb,
                        styles.mt
                      )}
                    >
                      {`${selectedUnits.length} selected`}
                    </p>
                    {/* <button className={classNames(styles.typeText, styles.blue)}>
                    Hide all items
                  </button> */}
                  </div>
                  <MultiSelect
                    options={unitOptions}
                    selectedOptions={selectedUnits}
                    className={styles.unitSelectContainer}
                    onChange={handleSelection}
                  />
                </div>
              )}
              <div className={styles.allocateToContainer}>
                <p
                  className={classNames(styles.typeText, styles.ml, styles.mb)}
                >
                  {t('allocateTo')}
                  <span className={styles.red}>*</span>
                </p>
                <div>
                  <div className={styles.typeInput}>
                    <div
                      className={classNames(
                        styles.inputOption,
                        styles.bottomBorder
                      )}
                    >
                      <input
                        type="radio"
                        value={CONST_ITEM_ALLOCATION_STATUS.INDIVIDUAL}
                        name="allocateToType"
                        checked={
                          allocateToType ===
                          CONST_ITEM_ALLOCATION_STATUS.INDIVIDUAL
                        }
                        className={styles.input}
                        onChange={(e) => {
                          setAllocateToType(e.target.value)
                          setAllocateToId({})
                        }}
                      />
                      <div className={styles.optionTextContainer}>
                        <p className={styles.keyText}>{t('individual')}</p>
                        <p className={styles.valueTextSubtle}>
                          {t('allocateToIndividualExamples')}
                        </p>
                      </div>
                    </div>
                    {allocateToType ===
                      CONST_ITEM_ALLOCATION_STATUS.INDIVIDUAL && (
                      <>
                        {allocateToId?.id?.length > 0 && (
                          <div
                            className={classNames(
                              styles.optionTextContainer,
                              styles.ml
                            )}
                          >
                            <p className={styles.keyText}>
                              {allocateToId?.name}
                            </p>
                            <p className={styles.valueTextSubtle}>
                              {allocateToId?.phone_number ||
                                allocateToId?.email}
                            </p>
                          </div>
                        )}
                        <div>
                          <Input
                            type="text"
                            fieldName="Individual"
                            value={searchUserText}
                            onChange={(obj) =>
                              handleSearchFilter(
                                obj.value,
                                CONST_ITEM_ALLOCATION_STATUS.INDIVIDUAL
                              )
                            }
                            showError={false}
                            className={styles.searchBar}
                            isRequired={false}
                            placeholder={t('userSearchPlaceholder')}
                          />
                        </div>
                        {searchUserResults.length > 0 && (
                          <div className={styles.searchResultsPosition}>
                            <Dropdown items={searchUserResults} Row={UserRow} />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <div className={styles.typeInput}>
                    <div
                      className={classNames(
                        styles.inputOption,
                        styles.bottomBorder
                      )}
                    >
                      <input
                        type="radio"
                        value={CONST_ITEM_ALLOCATION_STATUS.STORE}
                        name="allocateToType"
                        className={styles.input}
                        onChange={(e) => {
                          setAllocateToType(e.target.value)
                          setAllocateToId({})
                        }}
                      />

                      <div className={styles.optionTextContainer}>
                        <p className={styles.keyText}>{t('itemRooms')}</p>
                        <p className={styles.valueTextSubtle}>
                          {t('allocateToStoreExamples')}
                        </p>
                      </div>
                    </div>
                    {itemStores?.length === 0 && (
                      <div className={styles.storePrompt}>
                        <Icon
                          name="error"
                          color="warning"
                          type="outlined"
                          size="xxs"
                        />
                        <p className={styles.secondaryText}>
                          {t('storePromptWarning')}
                        </p>
                        <Button
                          size="small"
                          type="secondary"
                          onClick={() => {
                            setIsAddStoreSliderOpen(true)
                          }}
                        >
                          {t('addStore')}
                        </Button>
                      </div>
                    )}
                    {allocateToType === CONST_ITEM_ALLOCATION_STATUS.STORE &&
                      itemStores?.length > 0 && (
                        <>
                          <div className={styles.dropdownContainer}>
                            <Input
                              placeholder={t('selectItemPlaceHolder')}
                              type="select"
                              fieldName="Store"
                              value={selectedStore}
                              options={storeDropdown}
                              onChange={handleStoreSelection}
                              className={`${styles.storeDropdown}
                              ${
                                storeDropdown?.length >= 4
                                  ? styles.storeDropdown4
                                  : storeDropdown?.length == 3
                                  ? styles.storeDropdown3
                                  : storeDropdown?.length == 2
                                  ? styles.storeDropdown2
                                  : styles.storeDropdown1
                              }`}
                            />
                          </div>
                        </>
                      )}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.doneButtonWrapper}>
              <Button
                onClick={handleAllocation}
                className={styles.doneButton}
                disabled={disabled}
              >
                {t('allocate')}
              </Button>
            </div>
          </>
        }
      />
      {isAddStoreSliderOpen && (
        <Slider
          open={isAddStoreSliderOpen}
          setOpen={handleSliderClose}
          content={
            <AddStoreForm
              isAddStoreSliderOpen={isAddStoreSliderOpen}
              screenName={'bulk_allocated'}
              checkForConfirmationPopup={checkForConfirmationPopup}
            />
          }
          hasCloseIcon={true}
        />
      )}
      {showCloseConfirmPopup && (
        <CloseSliderConfirmPopup {...closeConfirmObject} />
      )}
    </>
  )
}

function Dropdown({items, Row}) {
  const getHeight = (items) => {
    if (items.length === 1) return 66
    else if (items.length === 2) return 132
    else if (items.length === 0) return 0
    else return 200
  }
  return (
    <div
      style={{width: '91%', height: getHeight(items)}}
      className={styles.searchResultsDiv}
    >
      <VirtualizedLazyList
        RowJSX={Row}
        itemCount={items.length}
        itemSize={3}
        dynamicSize={true}
        rowsData={items}
      />
    </div>
  )
}
