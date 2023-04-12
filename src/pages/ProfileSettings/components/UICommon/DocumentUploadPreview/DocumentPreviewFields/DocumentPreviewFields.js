import React from 'react'
import {Icon} from '@teachmint/krayon'
import styles from './DocumentPreviewFields.module.css'

const DocumentPreviewFields = ({field, uploadDocument}) => {
  const htmlFor = 'upload_doc' + field.key_id
  let inputTypes = ''
  field.permissible_values.map((type) => {
    inputTypes = inputTypes + '.' + type + ','
  })

  const bodyComponent = () => {
    return (
      <label className={styles.iconLabel} htmlFor={htmlFor}>
        <div className={styles.addFileBodyWrapper}>
          <div className={styles.iconWrapper}>
            <Icon name="add" type="primary" />
            <input
              id=""
              type="file"
              className={styles.uploadInput}
              accept={inputTypes}
              onChange={(e) => {
                uploadDocument(e.target.files[0], field)
              }}
            />
          </div>
        </div>
      </label>
    )
  }

  return (
    <>
      {bodyComponent()}
      <div className={styles.titleWrapper}>{field.label}</div>
    </>
  )
}

export default DocumentPreviewFields
