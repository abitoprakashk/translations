import React, {useMemo} from 'react'
import {Breadcrumb} from '@teachmint/common'
import {getBreadCrumbObject} from '../../../commonFunctions'
import styles from './CategoryFieldsBreadCrumb.module.css'

const CategoryFieldsBreadCrumb = (props) => {
  const categoryFieldsData = props.categoryFieldsDetails
  const breadCrumbData = useMemo(
    () => getBreadCrumbObject(props, categoryFieldsData),
    [categoryFieldsData]
  )
  return (
    <div className={styles.categoryFieldBreadCrumbBlock}>
      <Breadcrumb
        path={breadCrumbData}
        key={`breadCrumb_${categoryFieldsData?._id}`}
      />
    </div>
  )
}

export default CategoryFieldsBreadCrumb
