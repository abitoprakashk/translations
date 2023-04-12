import React, {useState, useEffect, useMemo} from 'react'
import {useSelector} from 'react-redux'
import {StickyFooter} from '@teachmint/common'
import style from '../../YearlyCalendar.module.scss'
import cx from 'classnames'
import InputField from '../../../../components/Common/InputField/InputField'
import SliderScreen from '../../../../components/Common/SliderScreen/SliderScreen'
import SliderScreenHeader from '../../../../components/Common/SliderScreenHeader/SliderScreenHeader'
import RadioInput from '../../../../components/Common/RadioInput/RadioInput'
import MultipleSelectionDropdown from '../../../../components/Common/MultipleSelectionDropdown/MultipleSelectionDropdown'
import {HOLIDAY, YEARLY_LABELS} from '../../YearlyCalendar.constants'
import {INSTITUTE_TYPES} from '../../../../constants/institute.constants'
import {t} from 'i18next'
import {Input} from '@teachmint/common'

const AddEventHolidaySlider = ({
  setSlider,
  header,
  onChange,
  primaryFieldLabel,
  fieldsData,
  applicableForOptions,
  onSave,
  eventType,
  onEdit,
}) => {
  const [allClassesChecked, setAllClassesCheckbox] = useState('')
  const {instituteInfo} = useSelector((state) => state)

  const isSchool = useMemo(
    () => instituteInfo.institute_type === INSTITUTE_TYPES.SCHOOL,
    [instituteInfo]
  )

  useEffect(() => {
    if (fieldsData?.applicableFor != 1) {
      setAllClassesCheckbox(!fieldsData?.classes.some((item) => item.selected))
    }
  }, [])

  const isValid = () => {
    const {eventName, startDate, applicableFor, classes} = fieldsData
    if (applicableFor !== 1)
      return (
        eventName &&
        startDate &&
        applicableFor &&
        (!isSchool ||
          allClassesChecked ||
          classes.some((item) => item.selected))
      )
    else return eventName && startDate && applicableFor
  }

  return (
    <SliderScreen setOpen={() => setSlider(false)}>
      <>
        <SliderScreenHeader
          icon="https://storage.googleapis.com/tm-assets/icons/primary/calendar-clock-primary.svg"
          title={header}
        />
        <div className={style.slider_container}>
          <div className={style.slider_body}>
            <InputField
              fieldName="eventName"
              fieldType="text"
              handleChange={(fieldName, value) =>
                onChange(fieldName, value.substring(0, 100))
              }
              placeholder={
                eventType == HOLIDAY ? 'Independence Day' : 'Annual Day'
              }
              title={primaryFieldLabel}
              value={fieldsData?.eventName}
            />
            <div className={style.flex_group}>
              <Input
                type="date"
                title="Start Date"
                fieldName="startDate"
                value={
                  fieldsData?.startDate && fieldsData?.startDate !== ''
                    ? new Date(fieldsData?.startDate)
                    : ''
                }
                onChange={(obj) => onChange(obj.fieldName, obj.value)}
                classes={{wrapper: style.dateInput}}
                minDate={new Date()}
              />
              <Input
                type="date"
                title={`End Date ${
                  !fieldsData?._id ? '(' + t('caseOfMultipleDays') + ')' : ''
                }`}
                fieldName="endDate"
                value={
                  fieldsData?.endDate && fieldsData?.endDate !== ''
                    ? new Date(fieldsData?.endDate)
                    : ''
                }
                onChange={(obj) => onChange(obj.fieldName, obj.value)}
                classes={{wrapper: style.dateInput}}
                disabled={!fieldsData.startDate}
                minDate={new Date(fieldsData.startDate)}
              />
            </div>
            <div className={style.input_group}>
              <span className={style.label}>
                {YEARLY_LABELS.APPLICABLE_FOR}
              </span>
              <RadioInput
                dropdownItems={Object.keys(applicableForOptions).map((key) => {
                  return applicableForOptions[key]
                })}
                value={fieldsData?.applicableFor}
                handleChange={onChange}
                fieldName="applicableFor"
              />
            </div>
            {(fieldsData?.applicableFor === 2 ||
              fieldsData?.applicableFor == 3) &&
              isSchool && (
                <>
                  <div className={style.input_group}>
                    <input
                      type="checkbox"
                      checked={allClassesChecked}
                      onChange={() => {
                        setAllClassesCheckbox(!allClassesChecked)
                        onChange(
                          'classes',
                          fieldsData?.classes.map((item) => ({
                            ...item,
                            selected: false,
                          }))
                        )
                      }}
                      className={style.checkbox}
                    />
                    <span className={style.label}>
                      {YEARLY_LABELS.APPLICABLE_TO_ALL}
                    </span>
                  </div>
                  {!allClassesChecked && (
                    <div className={style.input_group}>
                      <span className={style.label}>
                        {YEARLY_LABELS.SELECT_CLASSES_STUDENT_ONLY}
                      </span>
                      <MultipleSelectionDropdown
                        value={fieldsData?.classes}
                        fieldName="classes"
                        handleChange={onChange}
                        title={YEARLY_LABELS.SELECT_CLASSES}
                      />
                    </div>
                  )}
                </>
              )}
          </div>
        </div>
        <StickyFooter forSlider>
          <button
            className={cx('tm-btn1-blue', {disabled: !isValid()})}
            disabled={!isValid()}
            onClick={fieldsData?._id ? onEdit : onSave}
          >
            {YEARLY_LABELS.SAVE}
          </button>
        </StickyFooter>
      </>
    </SliderScreen>
  )
}

export default AddEventHolidaySlider
