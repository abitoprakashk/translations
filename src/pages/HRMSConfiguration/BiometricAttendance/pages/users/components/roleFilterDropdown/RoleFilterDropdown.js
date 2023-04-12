import {useState, useRef} from 'react'
import {t} from 'i18next'
import {
  Checkbox,
  CHECKBOX_CONSTANTS,
  BUTTON_CONSTANTS,
  useOutsideClickHandler,
  Button,
  Para,
} from '@teachmint/krayon'
import styles from './roleFilterDropdown.module.css'
import classNames from 'classnames'
import {events} from '../../../../../../../utils/EventsConstants'
import {useSelector} from 'react-redux'

export default function RoleFilterDropdown({typeOfRoles, setTypeOfRoles}) {
  const [showDropDown, setShowDropDown] = useState(false)
  const {eventManager} = useSelector((state) => state)

  const ref = useRef()

  useOutsideClickHandler(ref, () => {
    setShowDropDown(false)
  })

  const handleOptionClick = ({value}) => {
    let tempData = {...typeOfRoles}
    tempData[value].selected = !tempData[value].selected
    setTypeOfRoles(tempData)
  }

  return (
    <div
      className={classNames(styles.mainContainer)}
      data-qa="button-dropdown"
      ref={ref}
    >
      <Button
        size={BUTTON_CONSTANTS.SIZE.MEDIUM}
        type={BUTTON_CONSTANTS.TYPE.OUTLINE}
        width={BUTTON_CONSTANTS.WIDTH.FULL}
        prefixIcon="preferences"
        children={t('filter')}
        onClick={() => {
          eventManager.send_event(events.HRMS_USER_MAPPING_FILTER_CLICKED_TFI)
          setShowDropDown(!showDropDown)
        }}
      />
      {showDropDown && (
        <div
          className={classNames(styles.dropdownContainer)}
          data-qa="button-dropdown-content"
        >
          {Object.keys(typeOfRoles)?.length ? (
            Object.values(typeOfRoles)?.map((opt) => (
              <div
                key={opt.id}
                onClick={() => {
                  handleOptionClick({value: opt.id})
                }}
                className={classNames(styles.optionHover)}
                data-qa="button-dropdown-content-item"
              >
                <Checkbox
                  isSelected={opt?.selected}
                  fieldName="roleFilterCheckbox"
                  onClick={() => {
                    handleOptionClick({value: opt.id})
                  }}
                  size={CHECKBOX_CONSTANTS.SIZE.SMALL}
                  label={opt.label}
                  classes={{
                    label: styles.markAllCheckbox,
                    wrapper: classNames(
                      styles.markAllCheckboxWrapper,
                      styles.marginLeftAuto
                    ),
                    checkbox: styles.checkbox,
                  }}
                />
              </div>
            ))
          ) : (
            <div
              className={classNames(styles.optionHover)}
              data-qa="button-dropdown-content-item"
            >
              <Para>{t('none')}</Para>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
