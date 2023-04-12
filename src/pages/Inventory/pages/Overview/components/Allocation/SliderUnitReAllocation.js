import {Button, Slider, Icon} from '@teachmint/common'
import SliderScreenHeader from '../../../../../../components/Common/SliderScreenHeader/SliderScreenHeader'
import styles from './SliderAllocation.module.css'
import {useEffect, useState} from 'react'
import classNames from 'classnames'
import {useSelector} from 'react-redux'
import {CONST_ITEM_ALLOCATION_STATUS} from '../../../../../../constants/inventory.constants'
import {allocateItemsManuallyAction} from '../../../Overview/redux/actions/actions'
import {useDispatch} from 'react-redux'
import ConfirmationPopup from '../../../../../../components/Common/ConfirmationPopup/ConfirmationPopup'
import {t} from 'i18next'
import {events} from '../../../../../../utils/EventsConstants'
import {processInstituteMembersList} from '../../../../utils/Inventory.utils'

export default function SliderReAllocateItemUnit({
  sliderScreen,
  setSliderScreen,
  itemUnitData,
  storeData,
  setAllocateSliderScreen,
  reAllocateSliderScreen,
  apiFilterData,
  currentPageReference,
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
  const [allocatedTo, setAllocatedTo] = useState({})
  const [showPopup, setShowPopup] = useState(false)

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

  useEffect(() => {
    if (itemUnitData.allocated_to_type === CONST_ITEM_ALLOCATION_STATUS.STORE) {
      setAllocatedTo(
        storeData?.find((store) => store._id === itemUnitData.allocated_to_id)
      )
    }
    if (
      itemUnitData.allocated_to_type === CONST_ITEM_ALLOCATION_STATUS.INDIVIDUAL
    ) {
      setAllocatedTo(
        instituteMembers.find(
          (stud) => stud._id === itemUnitData.allocated_to_id
        )
      )
    }
  }, [itemUnitData])

  const handleReallocation = () => {
    eventManager.send_event(events.IM_REALLOCATE_UNIT_CLICKED_TFI, {})
    setAllocateSliderScreen(true)
    setSliderScreen(null)
  }

  const handleRemoveAllocation = () => {
    eventManager.send_event(events.IM_REMOVE_ALLOCATION_CLICKED_TFI, {})
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
          allocate_to_type: CONST_ITEM_ALLOCATION_STATUS.UNALLOCATED,
        },
        payload: payload,
      })
    )
    setSliderScreen(null)
  }

  return (
    <>
      {showPopup && (
        <div className={styles.Popup}>
          <ConfirmationPopup
            icon={
              <Icon
                name="removeCircle"
                type="filled"
                color="error"
                size="4xl"
              />
            }
            onClose={() => setShowPopup(false)}
            onAction={() => handleRemoveAllocation()}
            title={t('confirmationTitle')}
            desc={t('confirmationDesc')}
            secondaryBtnStyle={styles.removeCnfButton}
            primaryBtnText={t('cancel')}
            secondaryBtnText={t('remove')}
          />
        </div>
      )}
      {reAllocateSliderScreen && (
        <Slider
          open={sliderScreen}
          setOpen={setSliderScreen}
          hasCloseIcon={true}
          content={
            <>
              <SliderScreenHeader
                icon={<Icon name="allocateUser" size="xs" color="basic" />}
                title={t('reAllocateItem')}
              />
              <div className={styles.mainContainer}>
                <div className={styles.descContainer2}>
                  <p className={styles.typeText}>{t('category')}</p>
                  <p className={styles.typeText}>{t('item')}</p>
                  <p className={styles.valueText}>
                    {itemUnitData.category_name}
                  </p>
                  <p className={styles.valueText}>{itemUnitData.item_name}</p>
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
                    {t('allocatedTo')}
                  </p>
                  <div
                    className={classNames(
                      styles.optionTextContainer,
                      styles.ml
                    )}
                  >
                    <p className={styles.keyText}>{allocatedTo?.name}</p>
                    <p className={styles.valueText}>
                      {allocatedTo?.phone_number ||
                        allocatedTo?.email ||
                        allocatedTo?.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className={styles.buttonContainer}>
                <Button
                  size="big"
                  type="secondary"
                  className={styles.removeButton}
                  onClick={() => setShowPopup(true)}
                >
                  {t('removeAllocation')}
                </Button>
                <Button
                  size="big"
                  type="secondary"
                  className={styles.reallocateButton}
                  onClick={() => handleReallocation()}
                >
                  {t('reAllocate')}
                </Button>
              </div>
            </>
          }
        />
      )}
    </>
  )
}
