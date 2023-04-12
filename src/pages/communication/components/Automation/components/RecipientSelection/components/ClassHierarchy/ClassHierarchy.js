import {Accordion, Checkbox} from '@teachmint/krayon'
import React from 'react'
import {useTranslation} from 'react-i18next'
import {CUSTOM_CLASS_ID} from '../../../../Automation.constants'
import styles from './ClassHierarchy.module.css'

function ClassHierarchy({
  heirarchy,
  handleSelection,
  customClasses = [],
  onCustomClassSelect,
  selectedNodeIds,
  includeUnassigned,
  onUnassignedSelect,
}) {
  const {t} = useTranslation()

  const departments =
    heirarchy.department?.filter((department) => department.standard?.length) ||
    []

  const customClassIds = customClasses.map(({_id}) => _id)

  const handleCustomClassSelect = (classId, selected) => {
    if (classId === CUSTOM_CLASS_ID) {
      onCustomClassSelect(customClassIds, selected)
    } else {
      onCustomClassSelect([classId], selected)
    }
  }

  const onSelectAllToggle = ({value}) => {
    handleSelection(heirarchy)
    handleCustomClassSelect(CUSTOM_CLASS_ID, value)
    onUnassignedSelect(value)
  }

  const areAllCustomClassesSelected = customClassIds.every((customClassId) =>
    selectedNodeIds.has(customClassId)
  )

  const areAllSelected =
    heirarchy.isSelected && includeUnassigned && areAllCustomClassesSelected

  return (
    <div className={styles.wrapper}>
      <div key={heirarchy.id}>
        <Checkbox
          isSelected={areAllSelected}
          key={heirarchy._id}
          fieldName={heirarchy._id}
          handleChange={onSelectAllToggle}
          label={heirarchy.name}
        />
      </div>
      {!!departments.length &&
        departments.map((department) => (
          <Accordion
            isOpen={department.isOpen}
            classes={{
              accordionBody: styles.accordionBody,
              accordionWrapper: styles.accordionWrapper,
              accordionHeader: styles.accordionHeader,
            }}
            key={department._id}
            headerContent={
              <div className={styles.accordionHeader}>
                <Checkbox
                  isSelected={department.isSelected}
                  key={department._id}
                  fieldName={department._id}
                  handleChange={() => {
                    handleSelection(department)
                  }}
                  label={department.name}
                />
              </div>
            }
            toggleIconNames={{
              closed: 'downArrow',
              opened: 'upArrow',
            }}
          >
            <div>
              {department?.standard?.map((standard) => (
                <Accordion
                  isOpen={standard.isOpen}
                  classes={{
                    accordionBody: styles.sectionAccordionBody,
                    accordionWrapper: styles.sectionAccordionWrapper,
                    accordionHeader: styles.sectionAccordionHeader,
                  }}
                  key={standard._id}
                  headerContent={
                    <div>
                      <Checkbox
                        classes={{label: styles.standard}}
                        isSelected={standard.isSelected}
                        key={standard._id}
                        fieldName={standard._id}
                        handleChange={() => {
                          handleSelection(standard)
                        }}
                        label={standard.name}
                      />
                    </div>
                  }
                  toggleIconNames={{
                    closed: 'downArrow',
                    opened: 'upArrow',
                  }}
                >
                  <div className={styles.sectionBodyWrapper}>
                    {standard.section?.map((section) => (
                      <Checkbox
                        isSelected={section.isSelected}
                        key={section._id}
                        fieldName={section._id}
                        handleChange={() => {
                          handleSelection(section)
                        }}
                        label={section.name}
                      />
                    ))}
                  </div>
                </Accordion>
              ))}
            </div>
          </Accordion>
        ))}
      <CustomClassHierarchy
        customClasses={customClasses}
        selectedNodeIds={selectedNodeIds}
        handleCustomClassSelect={handleCustomClassSelect}
      />
      <div className={styles.unassignedSelectWrapper}>
        <Checkbox
          fieldName="select-unassigned"
          label={t('unassigned')}
          classes={{wrapper: styles.noMargin}}
          isSelected={includeUnassigned}
          handleChange={({value}) => onUnassignedSelect(value)}
        />
      </div>
    </div>
  )
}

const CustomClassHierarchy = ({
  customClasses,
  handleCustomClassSelect,
  selectedNodeIds,
}) => {
  const {t} = useTranslation()

  if (!customClasses.length) {
    return null
  }

  const areAllCustomClassesSelected = customClasses.every((customClass) =>
    selectedNodeIds.has(customClass._id)
  )

  return (
    <Accordion
      classes={{
        accordionBody: styles.accordionBody,
        accordionWrapper: styles.accordionWrapper,
        accordionHeader: styles.accordionHeader,
      }}
      headerContent={
        <div className={styles.accordionHeader}>
          <Checkbox
            fieldName="custom-classrooms"
            handleChange={({value}) => {
              handleCustomClassSelect(CUSTOM_CLASS_ID, value)
            }}
            isSelected={areAllCustomClassesSelected}
            label={t('customClassrooms')}
          />
        </div>
      }
      toggleIconNames={{
        closed: 'downArrow',
        opened: 'upArrow',
      }}
    >
      <div className={styles.customClassWrapper}>
        {customClasses?.map((section) => (
          <Checkbox
            key={section._id}
            fieldName={section._id}
            handleChange={({value}) => {
              handleCustomClassSelect(section._id, value)
            }}
            label={section.name}
            isSelected={selectedNodeIds.has(section._id)}
          />
        ))}
      </div>
    </Accordion>
  )
}

export default ClassHierarchy
