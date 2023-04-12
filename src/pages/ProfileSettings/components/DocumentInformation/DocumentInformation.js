import React, {useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {SETTING_TYPE} from '../../ProfileSettings.constant'
import {getCategoriesCollection} from '../../ProfileSettings.utils'
import {fetchDocumentCategoriesRequestAction} from '../../redux/actions/ProfileSettingsActions'
import {personaProfileSettingsSelector} from '../../redux/ProfileSettingsSelectors'
import DocumentCategoriesSection from './DocumentCategoriesSection/DocumentCategoriesSection'
import DocumentHeaderSection from './DocumentHeaderSection/DocumentHeaderSection'
import styles from './DocumentInformation.module.css'

const DocumentInformation = ({persona}) => {
  const dispatch = useDispatch()
  const personaDocumentSettingsData = personaProfileSettingsSelector()

  useEffect(() => {
    let categoriesCollection = null
    if (
      personaDocumentSettingsData.data &&
      personaDocumentSettingsData.data.length > 0
    ) {
      categoriesCollection = getCategoriesCollection(
        personaDocumentSettingsData.data,
        SETTING_TYPE.CATEGORY_FOR_DOCUMENT
      )
    }
    dispatch(fetchDocumentCategoriesRequestAction(categoriesCollection))
  }, [personaDocumentSettingsData])

  return (
    <div className={styles.documentImformationSection}>
      <div className={styles.headerSection}>
        <DocumentHeaderSection persona={persona} />
      </div>
      <div className={styles.categorySection}>
        <DocumentCategoriesSection persona={persona} />
      </div>
    </div>
  )
}

export default DocumentInformation
