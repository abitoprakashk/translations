import {CheckboxGroupWithTitle} from '@teachmint/krayon'
import classNames from 'classnames'
import React from 'react'
import {useTranslation} from 'react-i18next'
import ClassHeirarchy from '../../../../../../../AttendanceReport/components/ClassHeirarchy/ClassHeirarchy'
import {FILTER_TYPES} from '../../../../../../constants/feeCustomization.editor.constants'
import styles from './FilterModal.module.css'

function FilterDetails({data, setSingleFilterData}) {
  return (
    <div
      className={classNames(
        styles.detailsWrapper,
        'show-scrollbar show-scrollbar-small'
      )}
    >
      <div className={classNames(styles.maxWidth)}>
        {<GetUi data={data} setSingleFilterData={setSingleFilterData} />}
      </div>
    </div>
  )
}

export default FilterDetails

const GetUi = ({data, setSingleFilterData}) => {
  let JSX = null
  const {t} = useTranslation()
  Object.values(data).forEach((item) => {
    if (!item.isSelected) return

    if (item.type === FILTER_TYPES.INSTITUTE_HEIRARCHY) {
      JSX = (
        <ClassHeirarchy
          classes={{
            wrapper: styles.heirarchyWrapper,
            accordionHeader: styles.accordionHeader,
            accordionWrapper: styles.accordionWrapper,
            accordionBody: styles.accordionBody,
          }}
          heirarchy={item.data}
          handleSelection={(...props) => {
            setSingleFilterData({key: item.value}, ...props)
          }}
        />
      )
    } else {
      const selectedOptions = item.data
        ?.filter((option) => option.isSelected)
        .map((option) => option.value)
      JSX = (
        <div>
          <CheckboxGroupWithTitle
            frozenOptions={[]}
            onChange={(selectedOption) => {
              setSingleFilterData({
                key: item.value,
                value: item.data.map((option) => {
                  const _option = structuredClone(option)
                  if (selectedOption.includes(_option.value)) {
                    _option.isSelected = true
                  } else {
                    _option.isSelected = false
                  }
                  return _option
                }),
              })
            }}
            classes={{optionsWrapper: styles.optionsWrapper}}
            options={item.data}
            selectedOptions={selectedOptions || []}
            title={t('selectAll')}
          />
        </div>
      )
    }
  })
  return JSX
}
