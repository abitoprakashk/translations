import React from 'react'
import {PlainCard} from '@teachmint/krayon'
import DocumentPreviewFields from '../DocumentPreviewFields/DocumentPreviewFields'
import styles from './DocumentPreviewCategories.module.css'

const DocumentPreviewCategories = ({fields, uploadDocument}) => {
  const renderFields = fields.map((field) => {
    if (field?.is_active) {
      return (
        <>
          <PlainCard
            className={styles.cardDesign}
            children={
              <DocumentPreviewFields
                field={field}
                uploadDocument={uploadDocument}
              />
            }
          />
        </>
      )
    }
  })
  return renderFields
}

export default DocumentPreviewCategories
