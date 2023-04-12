import {
  Icon,
  ICON_CONSTANTS,
  CheckboxGroup,
  Chips,
  Button,
  BUTTON_CONSTANTS,
  Alert,
  Divider,
} from '@teachmint/krayon'
import classNames from 'classnames'
import {useEffect, useState} from 'react'
import {t} from 'i18next'
import {
  CUSTOM_CLASS_ID,
  RECIPIENT_TYPE_LABELS,
  SCHEDULER_TEMPLATE_TYPES,
  UNASSIGNED_USERS,
} from '../../Automation.constants.js'
import ClassHierarchy from './components/ClassHierarchy/ClassHierarchy'
import useHierarchyGroup from '../../hooks/useHierarchyGroup'
import {shouldSelectRecipientType} from '../../utils.js'
import styles from './RecipientSelection.module.css'

export default function RecipientSelection({
  inputData,
  setInputData,
  heirarchy,
  handleSelection,
  allselectedSections,
}) {
  const {customClasses, groups: hierarchyGroups} = useHierarchyGroup({
    ruleData: inputData,
    instHierarchy: heirarchy,
  })
  const [showClassSelection, setShowClassSelection] = useState(true)

  const template = inputData.template_id || inputData._id
  const selectedNodeIds = new Set(inputData?.filter?.recipient_node_ids || [])

  const updateFilters = (filters) => {
    setInputData((prev) => ({
      ...prev,
      filter: {
        ...(prev.filter || {}),
        ...filters,
      },
    }))
  }

  const onUnassignedSelect = (value) => {
    updateFilters({include_unassigned: value})
  }

  useEffect(() => {
    // Retain selected custom classrooms
    const selectedCustomClassIds =
      customClasses
        ?.filter((customClass) => selectedNodeIds.has(customClass._id))
        ?.map(({_id}) => _id) || []

    updateFilters({
      recipient_node_ids: [...selectedCustomClassIds, ...allselectedSections],
    })
  }, [allselectedSections, heirarchy])

  const handleTypeSelection = (selected) => {
    updateFilters({recipient_type: [...selected]})
  }

  const onClassSelect = (classIds, selected) => {
    if (selected) {
      classIds.forEach((classId) => selectedNodeIds.add(classId))
    } else {
      classIds.forEach((classId) => selectedNodeIds.delete(classId))
    }

    updateFilters({recipient_node_ids: [...selectedNodeIds]})
  }

  const onRemoveChip = (id) => {
    if (id === UNASSIGNED_USERS) {
      onUnassignedSelect(false)
    } else if (id === CUSTOM_CLASS_ID) {
      onClassSelect(
        customClasses.map(({_id}) => _id),
        false
      )
    } else if (customClasses?.some((customClass) => customClass._id === id)) {
      onClassSelect([id], false)
    } else {
      handleSelection({_id: id, isSelected: true})
    }
  }

  return (
    <div className={styles.recipientsContainer}>
      <div>
        {shouldSelectRecipientType(template) && (
          <div className={styles.userTypeBox}>
            <div className={styles.selectUserType}>
              <span>{t('userType')}</span>
              <CheckboxGroup
                name="user type"
                options={Object.entries(RECIPIENT_TYPE_LABELS).map(
                  ([value, label]) => ({
                    label,
                    value,
                    classes: {wrapper: styles.noMargin},
                  })
                )}
                selectedOptions={inputData.filter?.recipient_type || []}
                wrapperClass={styles.checkboxWrapper}
                onChange={handleTypeSelection}
              />
            </div>
            {template === SCHEDULER_TEMPLATE_TYPES.BIRTHDAY && (
              <>
                <Divider spacing="0px" />
                <div className={styles.birthdayInfo}>
                  <Icon
                    name="info"
                    version={ICON_CONSTANTS.VERSION.OUTLINED}
                    type={ICON_CONSTANTS.TYPES.SECONDARY}
                    size={ICON_CONSTANTS.SIZES.XXX_SMALL}
                    className={styles.infoIcon}
                  />
                  <span>{t('greetingsWhenInfo')}</span>
                </div>
              </>
            )}
          </div>
        )}
        <div
          className={styles.dropDownWrapper}
          onClick={() => setShowClassSelection(!showClassSelection)}
        >
          <span>
            {selectedNodeIds.size
              ? t('classesSelected', {count: selectedNodeIds.size})
              : t('selectClass')}
          </span>
          <Icon name="arrowDropDown" size={ICON_CONSTANTS.SIZES.XX_SMALL} />
        </div>
        {showClassSelection ? (
          <div className={styles.heirarchyWrapper}>
            <ClassHierarchy
              heirarchy={heirarchy}
              handleSelection={handleSelection}
              customClasses={customClasses}
              onCustomClassSelect={onClassSelect}
              selectedNodeIds={selectedNodeIds}
              includeUnassigned={inputData.filter?.include_unassigned}
              onUnassignedSelect={onUnassignedSelect}
            />
          </div>
        ) : (
          <ExpandableChipList
            items={getChipOptions(hierarchyGroups)}
            onChange={onRemoveChip}
            maxChips={3}
          />
        )}
      </div>
      {template === SCHEDULER_TEMPLATE_TYPES.FEE_REMINDER && (
        <Alert
          content={t('sendingFeeReminderToParents')}
          className={classNames(styles.para, styles.alert)}
          hideClose
          textSize="m"
        />
      )}
    </div>
  )
}

const ExpandableChipList = ({items, maxChips, ...chipProps}) => {
  const [showAllChips, setShowAllChips] = useState(false)
  const totalItems = items.length

  const showMoreButton = totalItems > maxChips
  const visibleItems = showAllChips ? items : items.slice(0, maxChips)

  return (
    <div className={styles.chipsContainer}>
      <Chips chipList={visibleItems} className="capitalize" {...chipProps} />
      {showMoreButton && (
        <Button
          type={BUTTON_CONSTANTS.TYPE.TEXT}
          onClick={() => setShowAllChips((show) => !show)}
          classes={{label: styles.para}}
        >
          {showAllChips
            ? t('viewLess')
            : t('numItemsMore', {count: totalItems - maxChips})}
        </Button>
      )}
    </div>
  )
}

const getChipOptions = (sectionWithName) =>
  Object.entries(sectionWithName).map(([id, label]) => ({id, label}))
