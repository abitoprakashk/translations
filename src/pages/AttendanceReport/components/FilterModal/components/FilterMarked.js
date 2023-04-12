import {Para, Radio, RangeSlider} from '@teachmint/krayon'
import {t} from 'i18next'
import produce from 'immer'
import React from 'react'
import styles from '../FilterModal.module.css'

function FilterMarked({markFilter, setmarkFilter}) {
  const handleSelection = (key) => {
    setmarkFilter(
      produce(markFilter, (draft) => {
        Object.keys(draft)?.map((key) => {
          draft[key].isSelected = false
        })
        draft[key].isSelected = true
        return draft
      })
    )
  }

  const handleSliderChange = ({selectedMax: maxVal}) => {
    setmarkFilter(
      produce(markFilter, (draft) => {
        draft.MARKED.sliderValue = maxVal
        return draft
      })
    )
  }

  return (
    <div>
      <Radio
        fieldName="MARKED"
        handleChange={() => handleSelection('MARKED')}
        label={t('marked')}
        isSelected={markFilter['MARKED'].isSelected}
      />
      <div className={styles.sliderWrapper}>
        <Para>{t('attendancePercentage')}</Para>
        <RangeSlider
          onChange={handleSliderChange}
          classes={{value: styles.value, wrapper: styles.slider}}
          max={100}
          preSelectedMax={markFilter.MARKED.sliderValue}
        />
      </div>
      <Radio
        fieldName="NOT_MARKED"
        handleChange={() => handleSelection('NOT_MARKED')}
        isSelected={markFilter['NOT_MARKED'].isSelected}
        label={t('notMarkedSentenceCase')}
      />
    </div>
  )
}

export default FilterMarked
