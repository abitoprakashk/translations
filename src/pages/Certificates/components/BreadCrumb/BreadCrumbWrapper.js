import React from 'react'
import s from './BreadCrumbWrapper.module.css'
import {Breadcrumb} from '@teachmint/common'
import {getBreadCrumbData} from '../../commonFunctions'

const BreadCrumbWrapper = ({selectedType, selectedStudent}) => {
  return (
    <div className={s.wrapper}>
      <Breadcrumb path={getBreadCrumbData(selectedType, selectedStudent)} />
    </div>
  )
}

export default BreadCrumbWrapper
