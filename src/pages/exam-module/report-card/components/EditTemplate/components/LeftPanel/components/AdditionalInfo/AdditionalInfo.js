import React, {useState} from 'react'
import {DateTime} from 'luxon'
import {
  Checkbox,
  DateRangePicker,
  Divider,
  Heading,
  HEADING_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  PlainCard,
  RadioGroup,
} from '@teachmint/krayon'
import {useSelector, useDispatch} from 'react-redux'
import {useTranslation} from 'react-i18next'

import commonStyles from '../../LeftPanel.module.css'
import styles from './AdditionalInfo.module.css'
import {
  EDIT_TEMPLATE_SECTIONS,
  ATTENDANCE_TYPES,
  REMARKS_TYPES,
} from '../../../../../../constants'
import classNames from 'classnames'
import ToggleButtonWrapper from '../ToggleButtonWrapper'
import {showErrorToast} from '../../../../../../../../../redux/actions/commonAction'
import {events} from '../../../../../../../../../utils/EventsConstants'

const AdditionalInfo = ({
  handleChange,
  data = {},
  renderManageButton,
  objToSave,
  setObjToSave,
  userEventHandler,
}) => {
  const {t} = useTranslation()
  const dispatch = useDispatch()

  const [showDatePickerDetails, setShowDatePickerDetails] = useState(false)

  const instituteActiveAcademicSessionId = useSelector(
    (state) => state.instituteActiveAcademicSessionId
  )

  const {start_time: sessionStartDate, end_time: sessionEndDate} = useSelector(
    (state) =>
      state.instituteAcademicSessionInfo.find(
        ({_id}) => _id === instituteActiveAcademicSessionId
      )
  )

  const cardStyle = classNames(
    commonStyles.blockCard,
    commonStyles.flex,
    commonStyles.flexColumn
  )

  const handleToggleChange = (obj, sectionName) => {
    userEventHandler(events.REPORT_CARD_SHOW_IN_REPORTCARD_CLICKED_TFI, {
      header_type: EDIT_TEMPLATE_SECTIONS.ADDITIONAL_INFO,
      sub_header_type: sectionName,
      flag: obj.value ? 'Y' : 'N',
    })
    handleChange(obj)
    let fetchParams = [...objToSave.template.fetch_params]
    let index = fetchParams.findIndex(
      (item) => item.method_name === sectionName
    )
    fetchParams[index] = {
      ...fetchParams[index],
      meta: {...fetchParams[index].meta, show: obj.value},
    }
    setObjToSave({
      ...objToSave,
      template: {...objToSave.template, fetch_params: fetchParams},
    })
  }

  const handleTypeChange = (obj, sectionName) => {
    // handleChange(obj)
    const {value} = obj
    let fetchParams = [...objToSave.template.fetch_params]
    let index = fetchParams.findIndex(
      (item) => item.method_name === sectionName
    )
    fetchParams[index] = {
      ...fetchParams[index],
      meta: {...fetchParams[index].meta, mode: value},
    }
    setObjToSave({
      ...objToSave,
      template: {...objToSave.template, fetch_params: fetchParams},
    })
  }

  const validateDateRange = (startDate, endDate, termIndex) => {
    let terms = objToSave.scholastic.exam_str.children
    for (let i = 0; i < terms.length; i++) {
      if (termIndex === i) continue
      if (terms[i].start_date >= startDate && terms[i].start_date < endDate) {
        return {
          errorMsg: t('termDateOverlaps'),
          error: true,
        }
      }
      if (terms[i].end_date >= startDate && terms[i].end_date < endDate) {
        return {
          errorMsg: t('termDateOverlaps'),
          error: true,
        }
      }
    }
  }

  const handleDateRangeChange = (range, termIndex) => {
    let terms = [...objToSave.scholastic.exam_str.children]
    let startDate = new Date(range.startDate)
    startDate = startDate.getTime() / 1000
    let endDate = new Date(range.endDate)
    endDate = endDate.getTime() / 1000
    let res = validateDateRange(startDate, endDate, termIndex)
    if (res?.error) {
      dispatch(showErrorToast(res.errorMsg))
      return
    }
    terms[termIndex] = {
      ...terms[termIndex],
      start_date: startDate,
      end_date: endDate,
    }
    setObjToSave({
      ...objToSave,
      scholastic: {
        ...objToSave.scholastic,
        exam_str: {...objToSave.scholastic.exam_str, children: terms},
      },
    })
    setShowDatePickerDetails(false)
  }

  const handleMonthChange = (obj) => {
    let fetchParams = [...objToSave.template.fetch_params]
    let index = fetchParams.findIndex(
      (item) => item.method_name === 'get_attendance'
    )
    let params = [...fetchParams[index].params]
    let paramIndex = params.findIndex((item) => item.id === obj.fieldName)
    params[paramIndex] = {...params[paramIndex], checked: obj.value}
    fetchParams[index] = {
      ...fetchParams[index],
      params,
    }
    if (!obj.value) {
      if (!params.find((item) => item.checked)) {
        fetchParams[index] = {
          ...fetchParams[index],
          meta: {...fetchParams[index].meta, show: false},
        }
      }
    } else {
      if (!fetchParams[index].meta.show) {
        fetchParams[index] = {
          ...fetchParams[index],
          meta: {...fetchParams[index].meta, show: true},
        }
      }
    }
    setObjToSave({
      ...objToSave,
      template: {...objToSave.template, fetch_params: fetchParams},
    })
  }

  const getDateRange = (obj) => {
    if (obj.start_date) {
      let startDate = DateTime.fromSeconds(obj.start_date).toFormat(`dd/LL/yy`)
      let endDate = DateTime.fromSeconds(obj.end_date).toFormat(`dd/LL/yy`)
      return `${startDate} - ${endDate}`
    }
  }

  const renderAttendance = () => {
    let arr = data.attendance
    switch (data.attendance_type) {
      case ATTENDANCE_TYPES.MONTHLY.value: {
        return (
          <>
            <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.X_SMALL}>
              {t('selectMonths')}
            </Heading>
            <div className={commonStyles.list}>
              {arr.map((item) => (
                <Checkbox
                  key={item.id}
                  fieldName={item.id}
                  label={item.label}
                  isSelected={item.checked}
                  handleChange={handleMonthChange}
                />
              ))}
            </div>
          </>
        )
      }
      case ATTENDANCE_TYPES.TERMWISE.value: {
        return (
          <>
            {arr?.map((item, i) => {
              if (item.checked)
                return (
                  <div
                    key={(item._id || i) + Math.random()}
                    className={styles.termList}
                  >
                    <span>{item.name}</span>
                    <div
                      className={styles.dateButton}
                      onClick={() =>
                        setShowDatePickerDetails({...item, index: i})
                      }
                    >
                      <Icon
                        name="dateRange"
                        size={ICON_CONSTANTS.SIZES.XX_SMALL}
                      />
                      {getDateRange(item)}
                    </div>
                  </div>
                )
              else return null
            })}
            {showDatePickerDetails && (
              <DateRangePicker
                startDate={showDatePickerDetails.start_date}
                endDate={showDatePickerDetails.end_date}
                onDone={(range) =>
                  handleDateRangeChange(range, showDatePickerDetails.index)
                }
                onClose={() => setShowDatePickerDetails(false)}
                maxDate={new Date(+sessionEndDate)}
                minDate={new Date(+sessionStartDate)}
              />
            )}
          </>
        )
      }
      default:
        return null
    }
  }

  const renderSignatureFields = () => {
    return data.signature_arr
      .filter((item) => item.checked)
      .map((item) => (
        <li key={item.id}>
          <div>{item.label}</div>
        </li>
      ))
  }

  const radioGroupWrapper = (section, fieldName, sectionName) => {
    return (
      <div
        className={classNames(
          commonStyles.flex,
          commonStyles.radioGroupWrapper
        )}
      >
        <RadioGroup
          options={Object.keys(section).map((type) => section[type])}
          selectedOption={data[fieldName]}
          handleChange={({selected}) =>
            handleTypeChange(
              {
                fieldName,
                value: selected,
              },
              sectionName
            )
          }
        />
      </div>
    )
  }

  return (
    <div className={commonStyles.accordianContent}>
      <PlainCard className={cardStyle}>
        <div className={commonStyles.blockHeader}>
          <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
            {t('attendance')}
          </Heading>
          <ToggleButtonWrapper
            fieldName="show_attendance"
            methodName="get_attendance"
            isSelected={data.show_attendance}
            handleChange={handleToggleChange}
          />
        </div>
        <Divider spacing={0} />
        {radioGroupWrapper(
          ATTENDANCE_TYPES,
          'attendance_type',
          'get_attendance'
        )}
        {renderAttendance()}
        <Divider spacing={10} />
      </PlainCard>
      <PlainCard className={cardStyle}>
        <div className={commonStyles.blockHeader}>
          <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
            {t('remarks')}
          </Heading>
          <ToggleButtonWrapper
            fieldName="show_remarks"
            methodName="get_remarks"
            isSelected={data.show_remarks}
            handleChange={handleToggleChange}
          />
        </div>
        <Divider spacing={0} />
        {radioGroupWrapper(REMARKS_TYPES, 'remarks_type', 'get_remarks')}
      </PlainCard>
      <PlainCard className={cardStyle}>
        <div className={commonStyles.blockHeader}>
          <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
            {t('results')}
          </Heading>
          <ToggleButtonWrapper
            fieldName="show_result"
            methodName="get_results"
            isSelected={data.show_result}
            handleChange={handleToggleChange}
          />
        </div>
        <Divider spacing={0} />
        {radioGroupWrapper(REMARKS_TYPES, 'result_type', 'get_results')}
      </PlainCard>
      <PlainCard className={cardStyle}>
        <div className={classNames(commonStyles.blockHeader, styles.signature)}>
          <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
            {t('signature')}
          </Heading>
          {renderManageButton(EDIT_TEMPLATE_SECTIONS.SIGN_MANAGE)}
          <ToggleButtonWrapper
            fieldName="show_signature"
            methodName="get_signatures"
            isSelected={data.show_signature}
            handleChange={handleToggleChange}
          />
        </div>
        <Divider spacing={0} />
        <ul className={commonStyles.list}>{renderSignatureFields()}</ul>
      </PlainCard>
    </div>
  )
}

export default React.memo(AdditionalInfo)
