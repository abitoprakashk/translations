import React, {useState, useEffect, useMemo} from 'react'
import {useSelector} from 'react-redux'
import {StickyFooter} from '@teachmint/common'
import {t} from 'i18next'
import SliderScreen from '../../../../components/Common/SliderScreen/SliderScreen'
import SliderScreenHeader from '../../../../components/Common/SliderScreenHeader/SliderScreenHeader'
import FlatTabSelect from '../../../../components/Common/FlatTabSelect/FlatTabSelect'
import MultipleSelectionDropdown from '../../../../components/Common/MultipleSelectionDropdown/MultipleSelectionDropdown'
import RadioInput from '../../../../components/Common/RadioInput/RadioInput'
import {
  TAB_OPTIONS,
  WEEKLY_OFF,
  applicableForOptions,
  tagTypeOptions,
} from '../../YearlyCalendar.constants'
import cx from 'classnames'
import style from '../../YearlyCalendar.module.scss'
import arrowImage from './arrow.png'
import {INSTITUTE_TYPES} from '../../../../constants/institute.constants'

const WeeklyOffAddSlider = ({
  clearSliderFields,
  setSlider,
  options,
  fieldsData,
  onSave,
  handleChange,
  onEdit,
}) => {
  const [allClassesChecked, setAllClassesCheckbox] = useState('')
  const {instituteInfo} = useSelector((state) => state)
  useEffect(() => {
    if (fieldsData?.applicableFor != 1) {
      setAllClassesCheckbox(
        !fieldsData?.classList.some((item) => item.selected)
      )
    }
  }, [])

  const isSchool = useMemo(
    () => instituteInfo.institute_type === INSTITUTE_TYPES.SCHOOL,
    [instituteInfo]
  )

  const isValid = () => {
    const {frequencyArray, applicableFor, tagType, classList} = fieldsData
    let isFrequencyArrayValid = frequencyArray?.some((item) => item.selected)
    if (applicableFor !== 1) {
      return (
        isFrequencyArrayValid &&
        tagType &&
        applicableFor &&
        (!isSchool ||
          allClassesChecked ||
          classList.some((item) => item.selected))
      )
    } else return isFrequencyArrayValid && tagType && applicableFor
  }

  return (
    <SliderScreen
      setOpen={() => {
        clearSliderFields()
        setSlider(false)
      }}
    >
      <>
        <SliderScreenHeader
          icon="https://storage.googleapis.com/tm-assets/icons/primary/calendar-clock-primary.svg"
          title={TAB_OPTIONS[WEEKLY_OFF].label}
        />
        <div className={style.slider_container}>
          <div className={style.slider_body}>
            <FlatTabSelect
              options={options}
              active={fieldsData.activeDay}
              onClick={(value) => handleChange('activeDay', value)}
              label="Select a Day"
            />
            {fieldsData.activeDay ? (
              <>
                <div className={style.input_group}>
                  <span className={style.label}>Frequency</span>
                  <MultipleSelectionDropdown
                    value={fieldsData.frequencyArray}
                    fieldName="frequency"
                    handleChange={(fieldName, value) =>
                      handleChange('frequencyArray', value)
                    }
                    title="Frequency"
                    placeholder="All"
                  />
                </div>
                <div className={style.input_group}>
                  <span className={style.label}>Select Type</span>
                  <RadioInput
                    dropdownItems={tagTypeOptions}
                    value={fieldsData.tagType}
                    handleChange={(fieldName, value) =>
                      handleChange('tagType', value)
                    }
                    fieldName="tagType"
                  />
                </div>
                <div className={style.input_group}>
                  <span className={style.label}>Applicable For</span>
                  <RadioInput
                    dropdownItems={Object.keys(applicableForOptions).map(
                      (key) => {
                        return applicableForOptions[key]
                      }
                    )}
                    value={fieldsData.applicableFor}
                    handleChange={(fieldName, value) =>
                      handleChange('applicableFor', value)
                    }
                    fieldName="applicableFor"
                  />
                </div>

                {(fieldsData.applicableFor === 2 ||
                  fieldsData.applicableFor == 3) &&
                  isSchool && (
                    <>
                      <div className={style.input_group}>
                        <input
                          type="checkbox"
                          checked={allClassesChecked}
                          onChange={() => {
                            setAllClassesCheckbox(!allClassesChecked)
                            handleChange(
                              'classes',
                              fieldsData?.classList.map((item) => ({
                                ...item,
                                selected: false,
                              }))
                            )
                          }}
                          className={style.checkbox}
                        />
                        <span className={style.label}>
                          {t('applicableToAll')}
                        </span>
                      </div>
                      {!allClassesChecked && (
                        <div className={style.input_group}>
                          <span className={style.label}>
                            {t('selectClassesForStudents')}
                          </span>
                          <MultipleSelectionDropdown
                            value={fieldsData?.classList}
                            fieldName="classList"
                            handleChange={handleChange}
                            title={t('selectClasses')}
                          />
                        </div>
                      )}
                    </>
                  )}
              </>
            ) : (
              <div className={style.selectDay_weekly}>
                <img src={arrowImage} alt="" />
                <p>{t('selectADay')}</p>
              </div>
            )}
          </div>
        </div>
        <StickyFooter forSlider>
          <button
            className={cx('tm-btn1-blue', {disabled: !isValid()})}
            disabled={!isValid()}
            onClick={fieldsData?._id ? onEdit : onSave}
          >
            Save
          </button>
        </StickyFooter>
      </>
    </SliderScreen>
  )
}

export default WeeklyOffAddSlider
