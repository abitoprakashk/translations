import {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import DocumentUpload from './Components/DocumentUpload/DocumentUpload'
import {
  getDocumentPersonaMemberAction,
  getInstitutePersonaSettingsAction,
  resetDocumentPersona,
  resetPersonaSettings,
} from './Redux/DocumentUpload.actions'
import {make_document_hierarchy} from './utils/helperFunctions'
import styles from './Documents.module.css'

const Documents = ({memberId, persona}) => {
  const dispatch = useDispatch()
  const [showMemberLoader, setShowMemberLoader] = useState(false)
  const institutePersonaSettings = useSelector(
    (store) => store.globalData?.institutePersonaSettings
  )
  const documentPersonaMember = useSelector(
    (store) => store.globalData?.documentPersonaMember
  )
  const documentSettings = make_document_hierarchy(
    institutePersonaSettings?.data
  )

  useEffect(() => {
    dispatch(resetPersonaSettings())
    dispatch(resetDocumentPersona())
    dispatch(getInstitutePersonaSettingsAction(persona))
    dispatch(getDocumentPersonaMemberAction(memberId))
  }, [])

  return institutePersonaSettings?.error === true ||
    documentPersonaMember?.error === true ? (
    <div className={styles.noDataDiv}>Respective data not found</div>
  ) : !showMemberLoader ? (
    documentSettings?.length > 0 && documentPersonaMember?.data !== null ? (
      <DocumentUpload
        documentSettings={documentSettings}
        personaMember={documentPersonaMember?.data}
        setShowMemberLoader={setShowMemberLoader}
        persona={persona}
      />
    ) : (
      <div className="loading" />
    )
  ) : (
    <div className="loading" />
  )
}

export default Documents
