import {
  RadioGroup,
  CheckboxGroup,
  Icon,
  ICON_CONSTANTS,
  BUTTON_CONSTANTS,
  Datepicker,
  Divider,
  Modal,
} from '@teachmint/krayon'
import styles from './FilterModal.module.css'
import {useState} from 'react'
import classNames from 'classnames'
import {FILTER_OPTIONS} from './Filter.constants'
import {t} from 'i18next'
export default function FilterModal({
  isOpen,
  onClose,
  selected,
  onApply,
  hideSections = [],
}) {
  const filteredSection = hideSections.length
    ? (() => {
        let tempObj = {...FILTER_OPTIONS}
        hideSections.map((key) => {
          delete tempObj[key]
        })
        return tempObj
      })()
    : FILTER_OPTIONS
  const [selectedSection, setSelectedSection] = useState(
    Object.keys(filteredSection)[0]
  )
  const [selectedOptions, setSelectedOptions] = useState(selected)
  const [showAdditionalComp, setShowAdditionalComp] = useState(false)

  const getFieldName = (eventVar) => {
    return eventVar.nativeEvent.srcElement.name
  }
  const renderFilterList = () => {
    return Object.entries(filteredSection).map(([key, value]) => {
      const isSelected = selectedSection === key
      return (
        <>
          <div
            className={styles.filterListItem}
            key={key}
            onClick={() => setSelectedSection(key)}
          >
            <span
              className={classNames(styles.itemText, {
                [styles.selected]: isSelected,
              })}
            >
              {value['label']}
            </span>
            <Icon
              name={'chevronRight'}
              size={ICON_CONSTANTS.SIZES.SMALL}
              type={
                isSelected
                  ? ICON_CONSTANTS.TYPES.PRIMARY
                  : ICON_CONSTANTS.TYPES.SECONDARY
              }
            />
          </div>
          <Divider spacing={'0px'} />
        </>
      )
    })
  }

  const renderFilterDetails = () => {
    const detailsObj = filteredSection[selectedSection]
    if (detailsObj['type'] === 'checkbox') {
      return (
        <CheckboxGroup
          key={selectedSection}
          wrapperClass={styles.checkboxWrapper}
          options={detailsObj['children']}
          name={selectedSection}
          onChange={(selected, event) =>
            handleOptionSelection({selected, event})
          }
          selectedOptions={selectedOptions[selectedSection] || []}
        />
      )
    }
    if (detailsObj['type'] === 'radio') {
      return (
        <div className={styles.checkboxWrapper}>
          <RadioGroup
            options={detailsObj['children']}
            handleChange={handleOptionSelection}
            name={selectedSection}
            selectedOption={
              'time' in selectedOptions ? selectedOptions[selectedSection] : ''
            }
          />
          {showAdditionalComp && (
            <DateRangePickerV2
              handleChange={handleDateRangeSelection}
              values={selectedOptions?.range}
            />
          )}
        </div>
      )
    }
  }

  const handleOptionSelection = ({selected, event}) => {
    const keyName = getFieldName(event)
    setSelectedOptions({...selectedOptions, [keyName]: selected})
    if (keyName === 'time' && selected === 'custom') {
      setShowAdditionalComp(true)
    } else {
      setShowAdditionalComp(false)
    }
  }
  const handleDateRangeSelection = (selected) => {
    setSelectedOptions({
      ...selectedOptions,
      range: {...selectedOptions.range, ...selected},
    })
  }

  return (
    <Modal
      header={t('filters')}
      isOpen={isOpen}
      onClose={onClose}
      actionButtons={[
        {
          body: t('Clear'),
          type: BUTTON_CONSTANTS.TYPE.OUTLINE,
          onClick: () => setSelectedOptions({}),
        },
        {body: t('applyFilters'), onClick: () => onApply(selectedOptions)},
      ]}
      classes={{content: styles.modal}}
    >
      <div className={styles.filterWrapper}>
        <div className={styles.filterList}>{renderFilterList()}</div>
        <div className={styles.filterDetails}>{renderFilterDetails()}</div>
      </div>
    </Modal>
  )
}

function DateRangePickerV2({handleChange, values}) {
  const today = new Date()
  return (
    <div className={styles.dateWrapper}>
      <Datepicker
        inputProps={{placeholder: t('fromDate')}}
        value={values?.from || ''}
        closeOnChange={true}
        maxDate={today}
        onChange={(val) => {
          handleChange({from: val})
        }}
        classes={{input: styles.dateInput}}
      />
      <Datepicker
        inputProps={{placeholder: t('toDate')}}
        value={values?.to || ''}
        closeOnChange={true}
        minDate={values?.from || ''}
        maxDate={today}
        onChange={(val) => {
          handleChange({to: val})
        }}
        classes={{input: styles.dateInput}}
      />
    </div>
  )
}
