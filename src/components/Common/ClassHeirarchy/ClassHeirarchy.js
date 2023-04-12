import {Accordion, Checkbox} from '@teachmint/krayon'
import React from 'react'
import styles from './ClassHeirarchy.module.css'

function ClassHeirarchy({heirarchy, handleSelection}) {
  return (
    <div>
      {heirarchy?.map((department) =>
        department?.standard ? (
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
                  classes={{checkbox: styles.checkbox}}
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
              {department?.standard?.map((standard) =>
                standard.section ? (
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
                          classes={{checkbox: styles.checkbox}}
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
                          classes={{checkbox: styles.checkbox}}
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
                ) : null
              )}
            </div>
          </Accordion>
        ) : null
      )}
    </div>
  )
}

export default ClassHeirarchy
