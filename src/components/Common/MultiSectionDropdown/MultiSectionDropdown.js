import {useEffect, useState} from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import styles from './multiSectionDropdown.module.css'
import {
  CheckboxGroup,
  CHECKBOX_CONSTANTS,
  Chips,
  Heading,
  HEADING_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  Para,
  PARA_CONSTANTS,
  RequiredSymbol,
  SearchBar,
  useComponentVisible,
} from '@teachmint/krayon'

export const DROPDOWN_WIDTH_TYPES = {
  FIT_CONTENT: 'fitContent',
  AUTO: 'auto',
}

export const DROPDOWN_INFO_TYPES = {
  NONE: 'none',
  ERROR: 'error',
  SUCCESS: 'success',
}

export default function MultiSectionDropdown({
  fieldName,
  isMultiSelect,
  isDisabled,
  isSearchable,
  searchPlaceholder,
  defaultSearchValue,
  title,
  placeholder,
  selectionPlaceholder,
  options,
  selectedOptions,
  frozenOptions,
  widthType,
  infoType,
  withChips,
  shouldOptionsOccupySpace,
  classes,
  onChange,
  isRequired,
  infoMsg,
  ...props
}) {
  const {
    ref,
    isComponentVisible: showDropdown,
    setIsComponentVisible: setShowDropdown,
  } = useComponentVisible(false)

  const [search, setSearch] = useState(defaultSearchValue)

  useEffect(() => {
    if (!showDropdown) {
      setSearch('')
    }
  }, [showDropdown])

  const renderIcon = (option) => {
    if (option.icon) {
      return typeof icon === 'object' ? (
        option.icon
      ) : (
        <Icon
          type={option.iconType || ICON_CONSTANTS.TYPES.BASIC}
          name={option.icon}
          size={option?.size || ICON_CONSTANTS.SIZES.SMALL}
        />
      )
    }
    return ''
  }

  const handleChange = (value, event) => {
    onChange({
      fieldName,
      value,
      event,
    })
  }

  const getOptions = (options) => {
    if (search) {
      return options?.filter(
        (option) =>
          option?.label?.toLowerCase().includes(search.toLowerCase()) ||
          option?.children?.toLowerCase().includes(search.toLowerCase())
      )
    }
    return options
  }

  const renderOptionsWithHeading = () => {
    return options.map((section) => {
      return (
        <div key={section.heading}>
          {section.heading && (
            <Heading
              textSize={HEADING_CONSTANTS.TEXT_SIZE.SMALL}
              weight={HEADING_CONSTANTS.WEIGHT.BOLD}
              className={styles.sectionHeading}
            >
              {section.heading}
            </Heading>
          )}
          <div>{renderOptions(section)}</div>
        </div>
      )
    })
  }

  const renderOptions = (section) => {
    if (isMultiSelect) {
      return (
        <CheckboxGroup
          name={section.heading}
          size={CHECKBOX_CONSTANTS.SIZE.SMALL}
          options={getOptions(section.options)}
          onChange={(e) => {
            handleChange(e)
          }}
          frozenOptions={frozenOptions}
          wrapperClass={styles.multiselectOption}
          selectedOptions={selectedOptions}
        />
      )
    }

    return getOptions(section.options).map((option) => (
      <div
        key={option.value}
        className={classNames(styles.option, classes.optionClass, {
          [styles.disabled]: frozenOptions.includes(option.value),
        })}
        onClick={(e) => {
          if (!frozenOptions.includes(option.value)) {
            handleChange(option.value, e)
            setShowDropdown(!showDropdown)
          }
        }}
      >
        {option.icon && (
          <div className={styles.iconClass}>{renderIcon(option)}</div>
        )}
        <div className={styles.label}>{option.label}</div>
      </div>
    ))
  }
  const getPlaceholder = () => {
    if (selectionPlaceholder) {
      return selectionPlaceholder
    }
    const defaultPlaceholder = (
      <div className={styles.placeholder}>{placeholder}</div>
    )
    if (isMultiSelect) {
      if (selectedOptions.length > 0) {
        let item = null
        options.forEach((section) => {
          if (item) return
          item = section.options?.find((option) =>
            selectedOptions.includes(option.value)
          )
        })
        return selectedOptions.length > 1 ? (
          <>
            {item?.children || item?.label}
            <div className={styles.placeholder}>
              +{selectedOptions.length - 1} more
            </div>
          </>
        ) : (
          item?.children || item?.label
        )
      }
      return defaultPlaceholder
    }
    let item = null
    options.forEach((section) => {
      if (item) return
      item = section.options?.find((option) => option.value === selectedOptions)
    })
    return item?.children || item?.label || defaultPlaceholder
  }

  return (
    <div>
      {title && (
        <div className={styles.titleContainer}>
          {title}
          {isRequired && <RequiredSymbol />}
        </div>
      )}
      <div className={classNames(styles.wrapperClass, classes.wrapperClass)}>
        <div
          ref={ref}
          className={classNames(styles.dropdown, classes.dropdownClass, {
            [styles.dropdownOpened]: showDropdown,
            [styles.disabled]: isDisabled,
            [styles.errorBorder]: infoType === DROPDOWN_INFO_TYPES.ERROR,
            [styles.successBorder]: infoType === DROPDOWN_INFO_TYPES.SUCCESS,
            [styles[widthType]]: !!widthType,
          })}
        >
          <div
            onClick={() => {
              if (!isDisabled) setShowDropdown(!showDropdown)
            }}
            tabIndex="0"
            role="listbox"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isDisabled) {
                setShowDropdown(!showDropdown)
              }
            }}
            {...props}
          >
            <div className={styles.selectedItem}>
              <div className={classNames({[styles.moreItems]: isMultiSelect})}>
                {getPlaceholder()}
              </div>
              {!isDisabled && (
                <Icon
                  name="downArrow"
                  size={ICON_CONSTANTS.SIZES.XX_SMALL}
                  className={styles.dropdownIcon}
                />
              )}
            </div>
          </div>
          {showDropdown && options?.length && (
            <div
              className={classNames(
                styles.dropdownWrapper,
                classes.optionsClass
              )}
            >
              <div
                className={classNames(styles.optionsBox, {
                  [styles.noSpaceOccupied]: !shouldOptionsOccupySpace,
                })}
              >
                {title && (
                  <div className={styles.dropdownHeader}>
                    <div>{title}</div>
                    <div onClick={() => setShowDropdown(false)}>
                      <Icon name="close" size={ICON_CONSTANTS.SIZES.XX_SMALL} />
                    </div>
                  </div>
                )}
                <div className={styles.dropdownOptions}>
                  {isSearchable && (
                    <div className={styles.searchBar}>
                      <SearchBar
                        value={search}
                        showSuggestion={false}
                        placeholder={searchPlaceholder}
                        handleChange={({value}) => setSearch(value)}
                      />
                    </div>
                  )}
                  {renderOptionsWithHeading(options)}
                </div>
              </div>
            </div>
          )}
        </div>
        <Para
          className={styles.infoMsg}
          textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
        >
          {infoMsg}
        </Para>

        {isMultiSelect && withChips && (
          <div className={classes.chipsClass}>
            <Chips
              chipList={options
                .filter((option) => selectedOptions.includes(option.value))
                .map((option) => ({
                  ...option,
                  id: option.value,
                }))}
              frozenOptions={frozenOptions}
              onChange={(val) =>
                handleChange(selectedOptions.filter((value) => value !== val))
              }
              className={classes.chipClass}
            />
          </div>
        )}
      </div>
    </div>
  )
}

MultiSectionDropdown.propTypes = {
  fieldName: PropTypes.string.isRequired,
  isMultiSelect: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isSearchable: PropTypes.bool,
  searchPlaceholder: PropTypes.string,
  defaultSearchValue: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  placeholder: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  selectionPlaceholder: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
  ]),
  options: PropTypes.array.isRequired,
  selectedOptions: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.array,
  ]),
  frozenOptions: PropTypes.arrayOf(PropTypes.string, PropTypes.number),
  widthType: PropTypes.oneOf(Object.values(DROPDOWN_WIDTH_TYPES)),
  infoType: PropTypes.oneOf(Object.values(DROPDOWN_INFO_TYPES)),
  infoMsg: PropTypes.string,
  withChips: PropTypes.bool,
  shouldOptionsOccupySpace: PropTypes.bool,
  classes: PropTypes.shape({
    wrapperClass: PropTypes.string,
    dropdownClass: PropTypes.string,
    optionsClass: PropTypes.string,
    optionClass: PropTypes.string,
    chipsClass: PropTypes.string,
    chipClass: PropTypes.string,
  }),
  onChange: PropTypes.func.isRequired,
}

MultiSectionDropdown.defaultProps = {
  isMultiSelect: false,
  isDisabled: false,
  isSearchable: false,
  searchPlaceholder: 'Search',
  defaultSearchValue: '',
  title: '',
  placeholder: 'Select',
  selectionPlaceholder: '',
  selectedOptions: [],
  frozenOptions: [],
  widthType: DROPDOWN_WIDTH_TYPES.AUTO,
  infoType: DROPDOWN_INFO_TYPES.NONE,
  infoMsg: '',
  withChips: false,
  shouldOptionsOccupySpace: true,
  classes: {},
}
