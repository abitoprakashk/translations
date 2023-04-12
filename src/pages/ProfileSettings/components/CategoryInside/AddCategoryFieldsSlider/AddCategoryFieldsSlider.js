import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {Button, StickyFooter} from '@teachmint/common'
// import {showToast} from '../../../../../redux/actions/commonAction'
import globalActions from '../../../../../redux/actions/global.actions'
import SliderScreenHeader from '../../../../../components/Common/SliderScreenHeader/SliderScreenHeader'
import SliderScreen from '../../../../../components/Common/SliderScreen/SliderScreen'
import {
  addCategoryFieldFormState,
  getRequestParamsObject,
  isFieldNameExist,
} from './AddCategoryFieldsSlider.utils'
import FieldSettingsToggles from '../../UICommon/FieldSettingsToggles/FieldSettingsToggles'
import CustomFieldBoxContainer from '../CustomFieldBoxContainer/CustomFieldBoxContainer'
import {getAddCategoryFieldToolTips} from '../CategoryInside.utils'
import {events} from '../../../../../utils/EventsConstants'
import styles from './AddCategoryFieldsSlider.module.css'

const AddCategoryFieldsSlider = ({
  userType,
  addFieldSliderCloseHandler,
  closeAddFieldSlider,
  categoryFieldsData,
  dataResetFlag,
  setDataResetFlag,
}) => {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const {instituteInfo, eventManager} = useSelector((state) => state)
  const [addNewFieldFormInputsValue, setAddNewFieldFormInputsValue] = useState(
    addCategoryFieldFormState
  )
  const [isFormValid, setIsFormValid] = useState(false)
  const [errorObject, setErrorObject] = useState({})

  const makeSliderHeaderTitle = `Create custom field - ${categoryFieldsData?.label}`
  // ToolTips Options Data
  const toolTipsOptionsData = getAddCategoryFieldToolTips(userType)

  const handleCategoryInputsSetError = (fieldName, error) => {
    let obj = {}
    obj[fieldName] = error
    setErrorObject((errorObject) => ({...errorObject, ...obj}))
  }

  // Add field submit form
  const handleAddFieldSubmitForm = () => {
    const fieldTitle = addNewFieldFormInputsValue?.fieldName.trim()
    if (fieldTitle !== '') {
      const isCategoryFieldNameExist = isFieldNameExist({
        fieldTitle,
        categoryFieldsData,
      })
      if (!isCategoryFieldNameExist) {
        const requestParams = getRequestParamsObject({
          instituteInfo,
          userType,
          categoryFieldsData,
          addNewFieldFormInputsValue,
        })
        dispatch(
          globalActions?.addCategoryFieldFormSubmitRequest?.request(
            requestParams
          )
        )
        eventManager.send_event(events.SAVE_NEW_PROFILE_FIELD_CLICKED_TFI, {
          screen_name: userType,
          category_id: categoryFieldsData?._id,
          form_fields: addNewFieldFormInputsValue,
        })
        resetDataHandler()
      } else {
        handleCategoryInputsSetError(
          'fieldName',
          t('sectionFieldNameAlreadyExist')
        )
        // setIsFormValid(false)
      }
    }
  }

  // Reset Data handler
  useEffect(() => {
    if (dataResetFlag) {
      resetDataHandler()
    }
  }, [dataResetFlag])

  const resetDataHandler = () => {
    setDataResetFlag(false)
    setAddNewFieldFormInputsValue(addCategoryFieldFormState)
    closeAddFieldSlider()
    setErrorObject({})
  }

  return (
    <div className={styles.categoryFieldSliderInside}>
      <SliderScreen setOpen={addFieldSliderCloseHandler}>
        <div className={styles.sliderMainContainer}>
          <SliderScreenHeader title={makeSliderHeaderTitle} />
          <div className={styles.sliderContainer}>
            <div className={styles.sliderBody}>
              <div className={styles.customFieldSection}>
                {/* Custom fields box container */}
                <CustomFieldBoxContainer
                  setIsFormValid={setIsFormValid}
                  dataResetFlag={dataResetFlag}
                  fieldFormInputsValue={addNewFieldFormInputsValue}
                  setFieldFormInputsValue={setAddNewFieldFormInputsValue}
                  setErrorObject={setErrorObject}
                  errorObject={errorObject}
                  handleCategoryInputsSetError={handleCategoryInputsSetError}
                />
                {/* Fields settings ToggleSwitch */}
                <div className={styles.fieldSettingsToggleBlock}>
                  <FieldSettingsToggles
                    fieldFormInputsValue={addNewFieldFormInputsValue}
                    setFieldFormInputsValue={setAddNewFieldFormInputsValue}
                    toolTipsOptionsData={toolTipsOptionsData}
                  />
                </div>
              </div>
            </div>
            <div className={styles.sliderFooter}>
              <div className={styles.addSectionNote}>
                {t('profileCategoryFieldNote')}
              </div>
              <StickyFooter forSlider={true}>
                <Button
                  size="big"
                  type="primary"
                  className={styles.addSaveButton}
                  onClick={handleAddFieldSubmitForm}
                  disabled={!isFormValid}
                >
                  {t('save')}
                </Button>
              </StickyFooter>
            </div>
          </div>
        </div>
      </SliderScreen>
    </div>
  )
}

export default AddCategoryFieldsSlider
