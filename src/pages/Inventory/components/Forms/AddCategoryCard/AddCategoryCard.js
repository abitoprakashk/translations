import {useState} from 'react'
import styles from './addCategoryCard.module.css'
import {Input, Icon} from '@teachmint/common'
import {Accordion} from '@teachmint/krayon'
import {useTranslation} from 'react-i18next'
import {ItemForm} from '../ItemForm/ItemForm'
import {alphaNumericRegex} from '../../../../../utils/Validations'
import classNames from 'classnames'
import {CONST_INPUTS_MAX_LENGTH} from '../../../../../constants/inventory.constants'

export function AddCategoryCard({
  categoryData,
  index,
  removable,
  onRemoveCategory,
  onCategoryChange,
  isEdit,
  checkUniqueItemName,
  handleprefix,
  checkUniqueCategoryName,
  screenName,
}) {
  const {t} = useTranslation()

  const [catNameError, setCatNameError] = useState('')

  const initialNameInputError = categoryData.name ? {} : {['name']: true}

  const [categoryInputErrors, setCategoryInputErrors] = useState(
    initialNameInputError
  )

  const onItemsDataChange = (itemsData, itemsHasError) => {
    let tempErrors = {...categoryInputErrors}
    if (itemsHasError) {
      tempErrors = {...tempErrors, ['items']: true}
    } else {
      delete tempErrors['items']
    }
    let hasError = Object.keys(tempErrors).length > 0
    onCategoryChange({...categoryData, ['items']: itemsData}, hasError)
    setCategoryInputErrors(tempErrors)
  }

  const onInputDataChange = (field, value) => {
    let tempErrors = {...categoryInputErrors}
    if (value == '') {
      tempErrors = {...tempErrors, [field]: true}
    } else {
      delete tempErrors[field]
    }
    let hasError = Object.keys(tempErrors).length > 0
    if (field == 'name') {
      const nameError = handleCatNameError(value)
      if (nameError) {
        hasError = true
        tempErrors[field] = true
      }
    } else {
      hasError = catNameError ? true : false
    }
    onCategoryChange({...categoryData, [field]: value}, hasError)
    setCategoryInputErrors(tempErrors)
  }

  const handleCatNameError = (catName) => {
    if (catName.trimEnd().length < 2) {
      setCatNameError(t('categoryNameLengthError'))
    } else if (!checkUniqueCategoryName(catName)) {
      setCatNameError(t('categoryNameExistsError'))
    } else {
      setCatNameError('')
      return false
    }
    return true
  }

  const accordionHeader = (
    <div
      className={classNames(styles.accordionTitle, {
        [styles.titleGreen]: !categoryData.accordionOpen,
      })}
    >
      {categoryData.accordionOpen
        ? t('details')
        : `${Object.keys(categoryData.items).length} ${
            Object.keys(categoryData.items).length == 1 ? t('item') : t('items')
          }`}
    </div>
  )

  return (
    <div className={styles.category}>
      <div className={styles.categoryHeaderWrapper}>
        <div className={styles.categoryHeader}>
          {t('category') + ` ${index}`}
        </div>
        {removable && (
          <span onClick={onRemoveCategory} className={styles.cursorPointer}>
            <Icon name="close" color="secondary" size="xxxs"></Icon>
          </span>
        )}
      </div>
      <Input
        classes={{wrapper: styles.categoryNameInput, title: 'tm-para'}}
        type="text"
        title={t('categoryName')}
        fieldName="name"
        placeholder={t('categoryNamePlaceHolder')}
        maxLength={CONST_INPUTS_MAX_LENGTH.name}
        value={categoryData.name}
        isRequired={true}
        onChange={(e) => {
          if (!alphaNumericRegex(e.value)) {
            return
          }
          onInputDataChange(e.fieldName, e.value)
        }}
        showError={catNameError ? true : false}
        errorMsg={catNameError}
      />
      <hr></hr>
      <Accordion
        headerContent={accordionHeader}
        isOpen={categoryData.accordionOpen}
        allowHeaderClick={true}
        classes={{
          accordionHeader: styles.accordionTitle,
          accordionBody: styles.accordion,
        }}
        onClick={() => {
          onInputDataChange('accordionOpen', !categoryData.accordionOpen)
        }}
      >
        <div onClick={(e) => e.stopPropagation()}>
          <ItemForm
            isEdit={isEdit}
            itemsData={categoryData.items}
            onItemsDataChange={onItemsDataChange}
            checkUniqueItemName={checkUniqueItemName}
            handleprefix={handleprefix}
            screenName={screenName}
          />
        </div>
      </Accordion>
    </div>
  )
}
