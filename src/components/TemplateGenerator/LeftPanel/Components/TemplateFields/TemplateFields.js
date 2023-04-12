import React, {useState} from 'react'
import {
  Para,
  Accordion,
  PARA_CONSTANTS,
  Button,
  BUTTON_CONSTANTS,
  Popup,
  Input,
  INPUT_TYPES,
  Icon,
  ICON_CONSTANTS,
  SearchBar,
} from '@teachmint/krayon'
import classNames from 'classnames'
import {useTranslation} from 'react-i18next'
import styles from './TemplateFields.module.css'
import {useDispatch} from 'react-redux'
import {useCustomFields} from '../../../redux/TemplateGenerator.selectors'
import {templatePageSettingsActions} from '../../../redux/TemplateGenerator.actionTypes'
import {generateIdFromString} from '../../../TemplateGenerator.utils'
import {TEMPLATE_GENERATOR_EVENTS} from '../../../TemplateGenerator.events'

const TemplateFields = ({
  templateFields,
  onFieldClick,
  triggerEvent = () => {},
  showCustomFields = true,
  onChangeSearchHandler,
  searchText = '',
  searchFilterFieldsList = [],
}) => {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const customInputs = useCustomFields()
  const [isOpenCustomField, openCustomFieldPopup] = useState(false)
  const [customInputName, setCustomInputName] = useState('')
  const [isOpenAccordianCustom, openCustomFieldsAccordian] = useState(false)

  const addCustomField = () => {
    triggerEvent(
      TEMPLATE_GENERATOR_EVENTS.TEMPLATE_MAKER_TEMPLATE_ADD_CUSTOM_FIELD_CLICKED_TFI
    )
    const inputs = [
      ...customInputs,
      {name: customInputName, id: generateIdFromString(customInputName)},
    ]
    dispatch({
      type: templatePageSettingsActions.SET_CUSTOM_FIELDS,
      payload: {
        customFields: inputs,
      },
    })

    closePopUp()
    openCustomFieldsAccordian(true)
  }

  const closePopUp = () => {
    openCustomFieldPopup(false)
    setCustomInputName('')
  }

  return (
    <div className={styles.wrapper}>
      <Popup
        isOpen={isOpenCustomField}
        onClose={closePopUp}
        actionButtons={[
          {
            body: t('cancel'),
            id: 'cancel',
            onClick: closePopUp,
            type: 'outline',
          },
          {
            id: 'okay',
            onClick: addCustomField,
            body: t('add'),
            type: BUTTON_CONSTANTS.TYPE.FILLED,
            category: BUTTON_CONSTANTS.CATEGORY.PRIMARY,
          },
        ]}
        header={t('templateGenerator.addCustomFieldHeader')}
      >
        <div className={styles.customFieldInputContainer}>
          <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
            {t('templateGenerator.addCustomFieldSubHeader')}
          </Para>
          <Input
            type={INPUT_TYPES.TEXT}
            title={t('templateGenerator.customInputeName')}
            fieldName="customFieldName"
            onChange={({value}) => {
              setCustomInputName(value.replace(/[^0-9a-zA-Z ]+/gi, ''))
            }}
            maxLength={30}
            value={customInputName}
            placeholder={t('templateGenerator.customInputePlaceHolder')}
          />
        </div>
      </Popup>
      <div className={styles.tabHead}>
        <Para
          type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
          weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
          textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}
        >
          {t('templateGenerator.fields')}
        </Para>
        <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
          {t('templateGenerator.fieldsDescription')}
        </Para>
      </div>
      <div className={styles.fieldContent}>
        <div>
          {Object.keys(templateFields.data).map((key) => (
            <>
              {templateFields.fieldMap[key] && (
                <Accordion
                  key={key}
                  allowHeaderClick
                  classes={{
                    accordionHeader: styles.accordionHeader,
                    accordionBody: styles.accordionBody,
                    accordionWrapper: styles.accordionWrapper,
                  }}
                  headerContent={
                    <span className={styles.accordionHeaderText}>
                      {templateFields.fieldMap[key].displayName}
                    </span>
                  }
                  onClick={() => {
                    triggerEvent(
                      TEMPLATE_GENERATOR_EVENTS.TEMPLATE_MAKER_TEMPLATE_FIELD_NODE_CLICKED_TFI,
                      {
                        node_name: key,
                      }
                    )
                  }}
                >
                  <div className={styles.accordionContent}>
                    {templateFields.data[key] &&
                      templateFields.data[key]?.length > 0 &&
                      templateFields.data[key].map((item, i) => {
                        if (!item.category_name) {
                          return (
                            <div className={styles.fieldItem} key={item.id}>
                              <span>{item.name}</span>
                              <span
                                className={classNames({
                                  [styles.disable]:
                                    !item[
                                      templateFields.fieldMap[key].displayField
                                    ],
                                })}
                                onClick={(e) =>
                                  onFieldClick(e, {
                                    id: item.id,
                                    name: item.name,
                                    value: item?.value || item?.default_value,
                                    type: templateFields.fieldMap[key].type,
                                    category: key,
                                    isImage: item.is_image,
                                  })
                                }
                              >
                                <Icon
                                  name="circledClose"
                                  type={ICON_CONSTANTS.TYPES.PRIMARY}
                                  version={ICON_CONSTANTS.VERSION.OUTLINED}
                                  size={ICON_CONSTANTS.SIZES.XX_SMALL}
                                />
                              </span>
                            </div>
                          )
                        } else {
                          const category = item.category_name
                          const fields = category ? item.fields : [item]
                          return (
                            <>
                              {i === 0 && (
                                <>
                                  <SearchBar
                                    value={searchText}
                                    handleChange={onChangeSearchHandler}
                                    placeholder="Search"
                                    classes={{
                                      removeIcon: styles.searchCloseButton,
                                    }}
                                  />
                                  {searchText?.trim().length > 0 && (
                                    <div
                                      className={styles.searchFieldContainer}
                                    >
                                      {searchFilterFieldsList?.length > 0 ? (
                                        searchFilterFieldsList.map((field) => {
                                          return (
                                            <div
                                              className={classNames(
                                                styles.innerFieldItem,
                                                styles.innerSearchFieldItem
                                              )}
                                              key={field.id}
                                            >
                                              <span>{field.name}</span>
                                              <span
                                                className={classNames({
                                                  [styles.disable]:
                                                    !field[
                                                      templateFields.fieldMap[
                                                        key
                                                      ].displayField
                                                    ],
                                                })}
                                                onClick={(e) => {
                                                  onFieldClick(e, {
                                                    id: field.id,
                                                    name: field.name,
                                                    value:
                                                      field?.value ||
                                                      field?.default_value,
                                                    type: templateFields
                                                      .fieldMap[key].type,
                                                    category: key,
                                                    isImage: field.is_image,
                                                  })
                                                }}
                                              >
                                                <Icon
                                                  name="circledClose"
                                                  type={
                                                    ICON_CONSTANTS.TYPES.PRIMARY
                                                  }
                                                  version={
                                                    ICON_CONSTANTS.VERSION
                                                      .OUTLINED
                                                  }
                                                  size={
                                                    ICON_CONSTANTS.SIZES
                                                      .XX_SMALL
                                                  }
                                                />
                                              </span>
                                            </div>
                                          )
                                        })
                                      ) : (
                                        <div className={styles.emptyFieldState}>
                                          {t('customCertificate.noFieldsFound')}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </>
                              )}

                              {!searchText?.trim().length > 0 && (
                                <Accordion
                                  key={category}
                                  allowHeaderClick
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    triggerEvent(
                                      TEMPLATE_GENERATOR_EVENTS.TEMPLATE_MAKER_TEMPLATE_FIELD_SUB_NODE_CLICKED_TFI,
                                      {
                                        node_name: category,
                                      }
                                    )
                                  }}
                                  classes={{
                                    accordionHeader:
                                      styles.innerAccordionHeader,
                                    accordionBody: styles.innerAccordionBody,
                                    accordionWrapper:
                                      styles.innerAccordionWrapper,
                                  }}
                                  headerContent={
                                    <span
                                      className={
                                        styles.innerAccordionHeaderText
                                      }
                                    >
                                      {category}
                                    </span>
                                  }
                                >
                                  {fields.map((field) => {
                                    return (
                                      <div
                                        className={styles.innerFieldItem}
                                        key={field.id}
                                      >
                                        <span>{field.name}</span>
                                        <span
                                          className={classNames({
                                            [styles.disable]:
                                              !field[
                                                templateFields.fieldMap[key]
                                                  .displayField
                                              ],
                                          })}
                                          onClick={(e) => {
                                            onFieldClick(e, {
                                              id: field.id,
                                              name: field.name,
                                              value:
                                                field?.value ||
                                                field.default_value,
                                              type: templateFields.fieldMap[key]
                                                .type,
                                              category: key,
                                              isImage: field.is_image,
                                            })
                                          }}
                                        >
                                          <Icon
                                            name="circledClose"
                                            type={ICON_CONSTANTS.TYPES.PRIMARY}
                                            version={
                                              ICON_CONSTANTS.VERSION.OUTLINED
                                            }
                                            size={ICON_CONSTANTS.SIZES.XX_SMALL}
                                          />
                                        </span>
                                      </div>
                                    )
                                  })}
                                </Accordion>
                              )}
                            </>
                          )
                        }
                      })}
                  </div>
                </Accordion>
              )}
            </>
          ))}
        </div>
        {customInputs?.length > 0 && (
          <Accordion
            allowHeaderClick
            classes={{
              accordionHeader: styles.accordionHeader,
              accordionBody: styles.accordionBody,
              accordionWrapper: styles.accordionWrapper,
            }}
            headerContent={
              <span className={styles.accordionHeaderText}>
                {t('templateGenerator.otherDetails')}
              </span>
            }
            isOpen={isOpenAccordianCustom}
            onClick={() =>
              triggerEvent(
                TEMPLATE_GENERATOR_EVENTS.TEMPLATE_MAKER_TEMPLATE_FIELD_NODE_CLICKED_TFI,
                {
                  node_name: 'custom',
                }
              )
            }
          >
            <div className={styles.accordionContent}>
              {customInputs.map((item) => {
                return (
                  <div className={styles.fieldItem} key={item.id}>
                    <span>{item.name}</span>
                    <span
                      onClick={(e) =>
                        onFieldClick(e, {
                          id: item.id,
                          name: item.name,
                          value: '',
                          type: 'dynamic',
                          category: 'CUSTOM',
                        })
                      }
                    >
                      <Icon
                        name="circledClose"
                        type={ICON_CONSTANTS.TYPES.PRIMARY}
                        version={ICON_CONSTANTS.VERSION.OUTLINED}
                        size={ICON_CONSTANTS.SIZES.XX_SMALL}
                      />
                    </span>
                  </div>
                )
              })}
            </div>
          </Accordion>
        )}

        {showCustomFields && (
          <div className={styles.addCustomButton}>
            <Button
              type={BUTTON_CONSTANTS.TYPE.OUTLINE}
              prefixIcon="add"
              onClick={() => openCustomFieldPopup(true)}
            >
              {t('templateGenerator.addCustomInput')}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default TemplateFields
