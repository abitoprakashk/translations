import {
  Button,
  Icon,
  Input,
  Slider,
  VirtualizedLazyList,
} from '@teachmint/common'
import SliderScreenHeader from '../../../../../../components/Common/SliderScreenHeader/SliderScreenHeader'
import styles from './SliderAllocation.module.css'
import {useState, useEffect} from 'react'
import classNames from 'classnames'
import {useSelector} from 'react-redux'
import {
  ALLOCATION_EVENT_MAP,
  CONST_ITEM_ALLOCATION_STATUS,
} from '../../../../../../constants/inventory.constants'
import {useDispatch} from 'react-redux'
import {allocateItemsManuallyAction} from '../../../Overview/redux/actions/actions'
import AddStoreForm from '../../../Stores/components/addStoreForm'
import {t} from 'i18next'
import {events} from '../../../../../../utils/EventsConstants'
import {compareStrings} from '../../../Categories/components/CategoriesPage'
import CloseSliderConfirmPopup from '../../../../components/Common/CloseSliderConfirmPopUp'
import {processInstituteMembersList} from '../../../../utils/Inventory.utils'

export default function SliderAllocateItemUnit({
  sliderScreen,
  setSliderScreen,
  itemUnitData,
  itemStores,
  allocateSliderScreen,
  currentPageReference,
  apiFilterData,
  possibleAllocatedIds,
  searchText,
}) {
  const dispatch = useDispatch()
  const {
    instituteStudentList,
    instituteTeacherList,
    instituteAdminList,
    eventManager,
  } = useSelector((state) => state)
  const [allocateToType, setAllocateToType] = useState()
  const [allocateToId, setAllocateToId] = useState()
  const [searchUserText, setSearchUserText] = useState('')
  const [searchUserResults, setSearchUserResults] = useState([])
  const [isAddStoreSliderOpen, setIsAddStoreSliderOpen] = useState(false)
  const inventoryStoresState = useSelector((state) => state.inventoryStores)
  const [disabled, setDisabled] = useState(true)
  const [selectedStore, setSelectedStore] = useState(null)
  const [storeName, setStoreName] = useState('')
  const [description, setDescription] = useState('')
  const storeDropdown = []
  let tempStores = itemStores?.slice()

  tempStores?.sort((a, b) => compareStrings(a.name, b.name))

  tempStores?.forEach((store) =>
    storeDropdown.push({
      label: store.name,
      value: store._id,
    })
  )

  useEffect(() => {
    setIsAddStoreSliderOpen(false)
  }, [inventoryStoresState.storeItemsData])

  useEffect(() => {
    if (allocateToId?.id?.length) setDisabled(false)
    else setDisabled(true)
  }, [allocateToId])

  const [instituteMembers, setInstituteMembers] = useState(
    processInstituteMembersList(
      instituteAdminList,
      instituteTeacherList,
      instituteStudentList
    )
  )
  useEffect(() => {
    setInstituteMembers(
      processInstituteMembersList(
        instituteAdminList,
        instituteTeacherList,
        instituteStudentList
      )
    )
  }, [instituteStudentList, instituteTeacherList, instituteAdminList])

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

  const handleAllocation = () => {
    eventManager.send_event(events.IM_ITEM_ALLOCATED_TFI, {
      screen_name: 'item overview',
      allocation_type: 'MANUAL',
      allocated_to: ALLOCATION_EVENT_MAP[allocateToType],
    })
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
          unit_ids: [itemUnitData._id],
          allocate_to_type: allocateToType,
          allocate_to_id: allocateToId.id,
        },
        payload: payload,
      })
    )
    setSliderScreen(null)
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

  return (
    <>
      {allocateSliderScreen && (
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
                <div className={styles.descContainer2}>
                  <p className={styles.typeText}>{t('category')}</p>
                  <p className={styles.typeText}>{t('item')}</p>
                  <p className={styles.valueTextLabel}>
                    {itemUnitData.category_name}
                  </p>
                  <p className={styles.valueTextLabel}>
                    {itemUnitData.item_name}
                  </p>
                  <p className={styles.typeText}>{t('itemCode')}</p>
                  <p className={styles.typeText}>{t('condition')}</p>
                  <p className={styles.valueText}>{itemUnitData.unit_code}</p>
                  <p className={styles.valueText}>{itemUnitData.condition}</p>
                </div>

                <div className={styles.allocateToContainer}>
                  <p
                    className={classNames(
                      styles.typeText,
                      styles.ml,
                      styles.mb
                    )}
                  >
                    {t('allocateTo')}
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
                              <Dropdown
                                items={searchUserResults}
                                Row={UserRow}
                              />
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
      )}
      {isAddStoreSliderOpen && (
        <Slider
          open={isAddStoreSliderOpen}
          setOpen={handleSliderClose}
          content={
            <AddStoreForm
              screenName={'bulk_allocate'}
              setIsAddStoreSliderOpen={setIsAddStoreSliderOpen}
              isAddStoreSliderOpen={isAddStoreSliderOpen}
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
