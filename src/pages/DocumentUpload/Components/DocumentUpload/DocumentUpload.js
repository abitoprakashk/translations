import {Accordion} from '@teachmint/krayon'
import DocumentCategories from '../DocumentCategories/DocumentCategories'
import styles from './DocumentUpload.module.css'

const DocumentUpload = ({
  documentSettings,
  personaMember,
  setShowMemberLoader,
  persona,
}) => {
  const renderSettings = documentSettings.map((setting, i) => {
    return (
      <>
        <div className={styles.accordiansWrapper}>
          <Accordion
            isOpen={i === 0 ? true : false}
            allowHeaderClick={true}
            headerContent={<div>{setting.label}</div>}
            className={styles.accordianChildrenWrapper}
          >
            <div className={styles.fieldsWrapper}>
              <DocumentCategories
                fields={setting.fields}
                personaMember={personaMember}
                setShowMemberLoader={setShowMemberLoader}
                persona={persona}
              />
            </div>
          </Accordion>
        </div>
      </>
    )
  })

  return <div className={styles.DocumentMega}>{renderSettings}</div>
}

export default DocumentUpload
