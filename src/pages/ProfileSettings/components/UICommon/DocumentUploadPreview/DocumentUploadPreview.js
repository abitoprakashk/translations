import React from 'react'
import {Accordion} from '@teachmint/krayon'
import DocumentPreviewCategories from './DocumentPreviewCategories/DocumentPreviewCategories'
import styles from './DocumentUploadPreview.module.css'

const DocumentUploadPreview = ({documentSettings}) => {
  const renderSettings = documentSettings.map((setting, i) => {
    if (!setting?.deleted && setting.is_active) {
      const documentFieldsDetails = setting?.childrenFields
      let isCategoryHaveField = true
      let actiVeFieldList = []
      if (documentFieldsDetails && documentFieldsDetails.length > 0) {
        documentFieldsDetails.forEach((item) => {
          if (item.is_active) {
            actiVeFieldList.push(item._id)
          }
        })
        if (actiVeFieldList.length == 0) {
          isCategoryHaveField = false
        }
      }
      return (
        <>
          {isCategoryHaveField &&
            setting &&
            setting?.childrenFields.length > 0 && (
              <div className={styles.accordiansWrapper}>
                <Accordion
                  isOpen={i === 0 ? true : false}
                  allowHeaderClick={true}
                  headerContent={<div>{setting.label}</div>}
                  className={styles.accordianChildrenWrapper}
                >
                  <div className={styles.fieldsWrapper}>
                    <DocumentPreviewCategories
                      fields={setting.childrenFields}
                      uploadDocument={() => {}}
                    />
                  </div>
                </Accordion>
              </div>
            )}
        </>
      )
    }
  })
  return <div className={styles.DocumentMega}>{renderSettings}</div>
}

export default DocumentUploadPreview
